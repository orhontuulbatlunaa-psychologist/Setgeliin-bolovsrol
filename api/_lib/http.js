const crypto = require("node:crypto");

function sendJson(res, status, payload, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  for (const [key, value] of Object.entries(extraHeaders)) res.setHeader(key, value);
  res.end(JSON.stringify(payload));
}

function readJson(req, maxBytes = 128 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error("Хүсэлтийн хэмжээ хэтэрсэн."), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error("JSON өгөгдөл буруу байна."), { statusCode: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function cleanText(value, maxLength = 200) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength)
    : "";
}

function validEmail(value) {
  return typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const configured = process.env.APP_ORIGIN;
  try {
    const expected = configured ? new URL(configured).origin : null;
    const actual = new URL(origin).origin;
    if (expected) return actual === expected;
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return host ? new URL(actual).host === String(host).split(",")[0].trim() : false;
  } catch {
    return false;
  }
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

module.exports = { sendJson, readJson, cleanText, validEmail, sameOrigin, sha256Hex };
