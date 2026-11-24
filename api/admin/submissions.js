const { sendJson, sameOrigin } = require("../_lib/http");
const { supabaseRequest } = require("../_lib/supabase");
const { verifyAdmin } = require("../_lib/admin-auth");

module.exports = async function adminSubmissions(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "GET хүсэлт шаардлагатай." }, { Allow: "GET" });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: "Энэ хүсэлтийн эх үүсвэр зөвшөөрөгдөөгүй." });
  if (!verifyAdmin(req)) return sendJson(res, 401, { error: "Админы эрхээр нэвтэрнэ үү." });

  try {
    const url = new URL(req.url, "https://local.invalid");
    const status = url.searchParams.get("status");
    const allowed = new Set(["pending","approved","rejected"]);
    const filters = [
      "select=id,submission_code,full_name,grade,group_name,email,phone,review_status,email_status,created_at,reviewed_at,review_note,results",
      "order=created_at.desc",
      "limit=100"
    ];
    if (status && allowed.has(status)) filters.push(`review_status=eq.${status}`);
    const rows = await supabaseRequest("career_test_submissions?" + filters.join("&"));
    return sendJson(res, 200, { ok: true, submissions: Array.isArray(rows) ? rows : [] });
  } catch (error) {
    console.error("admin-submissions", error.message);
    return sendJson(res, 500, { error: "Тестийн хүсэлтүүдийг уншихад алдаа гарлаа." });
  }
};
