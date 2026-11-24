const crypto = require("node:crypto");

const COOKIE_NAME = "sb_career_admin";
const SESSION_SECONDS = 6 * 60 * 60;

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}
function sign(input, secret) {
  return crypto.createHmac("sha256", secret).update(input).digest("base64url");
}
function makeSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET нь 32-оос доошгүй тэмдэгт байх шаардлагатай.");
  const payload = base64url(JSON.stringify({
    sub: "career-admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS
  }));
  const token = `${payload}.${sign(payload, secret)}`;
  return token;
}
function getCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}
function verifyAdmin(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const token = getCookie(req, COOKIE_NAME);
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const expected = sign(parts[0], secret);
  const left = Buffer.from(parts[1]);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return false;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return payload.sub === "career-admin" && Number(payload.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
function sessionCookie(token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${SESSION_SECONDS}${secure}`;
}
function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${secure}`;
}
module.exports = { makeSession, verifyAdmin, sessionCookie, clearSessionCookie, COOKIE_NAME };
