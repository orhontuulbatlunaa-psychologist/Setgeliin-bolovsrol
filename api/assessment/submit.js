const crypto = require("node:crypto");
const { sendJson, readJson, cleanText, validEmail, sameOrigin } = require("../_lib/http");
const { supabaseRequest } = require("../_lib/supabase");

module.exports = async function submitAssessment(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST хүсэлт шаардлагатай." }, { Allow: "POST" });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: "Энэ хүсэлтийн эх үүсвэр зөвшөөрөгдөөгүй." });

  try {
    const body = await readJson(req);
    const student = body.student || {};
    const fullName = cleanText(student.fullName, 120);
    const groupName = cleanText(student.group, 20);
    const email = cleanText(student.email, 254).toLowerCase();
    const phone = cleanText(student.phone, 30) || null;
    const grade = Number(student.grade);
    const consent = student.consent === true;
    const idempotencyKey = String(body.requestId || "");

    if (!fullName || !groupName || !validEmail(email) || ![9,10,11,12].includes(grade) || !consent) {
      return sendJson(res, 400, { error: "Бүртгэлийн мэдээлэл дутуу эсвэл буруу байна." });
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
      return sendJson(res, 400, { error: "Хүсэлтийн таних дугаар буруу байна." });
    }
    if (!body.answers || typeof body.answers !== "object") {
      return sendJson(res, 400, { error: "Тестийн хариулт олдсонгүй." });
    }

    const [{ ASSESSMENT }, { calculateAssessmentResults }] = await Promise.all([
      import("../../career-test/data.js"),
      import("../../career-test/scoring.js")
    ]);
    let results;
    try {
      results = calculateAssessmentResults(ASSESSMENT, body.answers);
    } catch (error) {
      return sendJson(res, 422, {
        error: "Тестийн хариулт бүрэн бус байна. Бөглөсөн хариултаа шалгана уу.",
        details: error.validationErrors || []
      });
    }

    const day = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const code = `SB-${day}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const record = {
      submission_code: code,
      idempotency_key: idempotencyKey,
      full_name: fullName,
      grade,
      group_name: groupName,
      email,
      phone,
      consent: true,
      consent_text_version: "2026-11-24-v1",
      answers: body.answers,
      results,
      assessment_version: ASSESSMENT.schemaVersion,
      source_review_status: ASSESSMENT.sourceReview.status,
      review_status: "pending",
      email_status: "not_sent"
    };

    try {
      const inserted = await supabaseRequest("career_test_submissions", {
        method: "POST",
        body: record,
        prefer: "return=representation"
      });
      const saved = Array.isArray(inserted) ? inserted[0] : inserted;
      return sendJson(res, 201, {
        ok: true,
        submissionCode: saved.submission_code,
        status: "pending_review",
        message: "Тестийн хариулт амжилттай бүртгэгдлээ. Тайлан админы хяналтад орсны дараа и-мэйлээр илгээгдэнэ."
      });
    } catch (error) {
      if (error.statusCode === 409 || error.statusCode === 23505) {
        const existing = await supabaseRequest(
          `career_test_submissions?select=submission_code,review_status&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&limit=1`
        );
        if (Array.isArray(existing) && existing[0]) {
          return sendJson(res, 200, {
            ok: true,
            submissionCode: existing[0].submission_code,
            status: existing[0].review_status === "pending" ? "pending_review" : existing[0].review_status,
            message: "Энэ тестийн илгээлт өмнө нь бүртгэгдсэн байна."
          });
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("assessment-submit", error.message);
    const status = [400,413].includes(error.statusCode) ? error.statusCode : 500;
    return sendJson(res, status, { error: status === 500 ? "Тестийг хадгалахад алдаа гарлаа. Дахин оролдоно уу." : error.message });
  }
};
