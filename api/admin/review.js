const { sendJson, readJson, cleanText, sameOrigin } = require("../_lib/http");
const { supabaseRequest } = require("../_lib/supabase");
const { verifyAdmin } = require("../_lib/admin-auth");

module.exports = async function reviewSubmission(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST хүсэлт шаардлагатай." }, { Allow: "POST" });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: "Энэ хүсэлтийн эх үүсвэр зөвшөөрөгдөөгүй." });
  if (!verifyAdmin(req)) return sendJson(res, 401, { error: "Админы эрхээр нэвтэрнэ үү." });

  try {
    const body = await readJson(req, 16 * 1024);
    const id = String(body.id || "");
    const action = body.action;
    const reviewNote = cleanText(body.reviewNote, 1000);
    if (!/^[0-9a-f-]{36}$/i.test(id) || !["approve","reject"].includes(action)) {
      return sendJson(res, 400, { error: "Хүсэлтийн мэдээлэл буруу байна." });
    }

    const approved = action === "approve";
    const updated = await supabaseRequest(
      `career_test_submissions?id=eq.${encodeURIComponent(id)}&review_status=eq.pending`,
      {
        method: "PATCH",
        body: {
          review_status: approved ? "approved" : "rejected",
          email_status: approved ? "waiting_report" : "not_sent",
          review_note: reviewNote || null,
          reviewed_by: "admin",
          reviewed_at: new Date().toISOString()
        },
        prefer: "return=representation"
      }
    );
    if (!Array.isArray(updated) || !updated.length) {
      return sendJson(res, 409, { error: "Энэ хүсэлт аль хэдийн шалгагдсан эсвэл олдсонгүй." });
    }

    return sendJson(res, 200, {
      ok: true,
      submissionCode: updated[0].submission_code,
      reviewStatus: updated[0].review_status,
      emailStatus: updated[0].email_status,
      message: approved
        ? "Хүсэлтийг зөвшөөрлөө. PDF тайлан болон имэйл илгээлтийн холболт хийгдсэний дараа автомат илгээлт идэвхжинэ."
        : "Хүсэлтийг буцаалаа. Тайлан илгээгдэхгүй."
    });
  } catch (error) {
    console.error("admin-review", error.message);
    return sendJson(res, 500, { error: "Хяналтын төлөвийг хадгалахад алдаа гарлаа." });
  }
};
