const { sendJson, sameOrigin } = require("../_lib/http");
const { clearSessionCookie } = require("../_lib/admin-auth");

module.exports = async function adminLogout(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST хүсэлт шаардлагатай." }, { Allow: "POST" });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: "Энэ хүсэлтийн эх үүсвэр зөвшөөрөгдөөгүй." });
  return sendJson(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
};
