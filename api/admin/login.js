const crypto = require("node:crypto");
const { sendJson, readJson, sameOrigin } = require("../_lib/http");
const { supabaseRequest } = require("../_lib/supabase");
const { makeSession, sessionCookie } = require("../_lib/admin-auth");

function safeEqualText(a, b) {
  const left = crypto.createHash("sha256").update(String(a)).digest();
  const right = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(left, right);
}

module.exports = async function adminLogin(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST хүсэлт шаардлагатай." }, { Allow: "POST" });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: "Энэ хүсэлтийн эх үүсвэр зөвшөөрөгдөөгүй." });

  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 16 || !sessionSecret || sessionSecret.length < 32) {
    return sendJson(res, 503, { error: "Админы нэвтрэлтийн серверийн тохиргоо хараахан хийгдээгүй байна." });
  }

  try {
    const body = await readJson(req, 8 * 1024);
    const candidate = typeof body.password === "string" ? body.password : "";
    const forwarded = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
    const ipHash = crypto.createHmac("sha256", sessionSecret).update(forwarded).digest("hex");
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const attempts = await supabaseRequest(
      `career_admin_login_attempts?select=id&ip_hash=eq.${ipHash}&success=eq.false&created_at=gte.${encodeURIComponent(since)}&limit=6`
    );
    if (Array.isArray(attempts) && attempts.length >= 6) {
      return sendJson(res, 429, { error: "Нэвтрэх оролдлого хэтэрсэн байна. 15 минутын дараа дахин оролдоно уу." }, { "Retry-After": "900" });
    }

    const valid = safeEqualText(candidate, password);
    await supabaseRequest("career_admin_login_attempts", {
      method: "POST",
      body: { ip_hash: ipHash, success: valid },
      prefer: "return=minimal"
    });
    if (!valid) return sendJson(res, 401, { error: "Нууц үг буруу байна." });

    const token = makeSession();
    return sendJson(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(token) });
  } catch (error) {
    console.error("admin-login", error.message);
    return sendJson(res, error.statusCode || 500, { error: "Админы нэвтрэлтийг шалгахад алдаа гарлаа." });
  }
};
