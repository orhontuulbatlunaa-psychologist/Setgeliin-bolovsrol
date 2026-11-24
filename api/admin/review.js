const { sendJson, readJson, cleanText, sameOrigin } = require("../_lib/http");
const { supabaseRequest } = require("../_lib/supabase");
const { verifyAdmin } = require("../_lib/admin-auth");
const { renderAssessmentReportPdf } = require("../_lib/report-pdf");
const { uploadPrivateReport, sendReportEmail } = require("../_lib/report-delivery");

async function getSubmission(id) {
  const rows = await supabaseRequest(
    `career_test_submissions?id=eq.${encodeURIComponent(id)}&select=id,submission_code,full_name,grade,group_name,email,phone,answers,results,review_status,email_status,review_note,created_at,report_storage_path,report_sha256&limit=1`
  );
  return Array.isArray(rows) ? rows[0] : null;
}

async function patchSubmission(id, filter, body) {
  return supabaseRequest(
    `career_test_submissions?id=eq.${encodeURIComponent(id)}&${filter}`,
    { method: "PATCH", body, prefer: "return=representation" }
  );
}

async function sendApprovedReport({ req, res, record, reviewNote, retry }) {
  const [{ ASSESSMENT }, { calculateAssessmentResults }] = await Promise.all([
    import("../../career-test/data.js"),
    import("../../career-test/scoring.js")
  ]);

  let results;
  try {
    results = calculateAssessmentResults(ASSESSMENT, record.answers);
  } catch (error) {
    return sendJson(res, 422, {
      error: "Тестийн эх хариултыг дахин тооцоолоход алдаа гарлаа. Тайлан илгээгээгүй.",
      details: error.validationErrors || []
    });
  }

  const student = {
    fullName: record.full_name,
    grade: record.grade,
    group: record.group_name,
    email: record.email
  };

  // PDF үүсгэж, private storage-д хадгалж дууссаны дараа л имэйл илгээх төлөвт шилжинэ.
  const pdfBuffer = await renderAssessmentReportPdf({
    student,
    results,
    submissionCode: record.submission_code,
    generatedAt: new Date().toISOString()
  });
  const stored = await uploadPrivateReport({ submissionId: record.id, pdfBuffer });

  const nextReviewNote = reviewNote || record.review_note || null;
  const stateFilter = retry
    ? `review_status=eq.approved&email_status=eq.${encodeURIComponent(record.email_status)}`
    : "review_status=eq.pending";
  const transitioned = await patchSubmission(record.id, stateFilter, {
    review_status: "approved",
    email_status: "sending",
    review_note: nextReviewNote,
    reviewed_by: retry ? "admin-retry" : "admin",
    reviewed_at: record.reviewed_at || new Date().toISOString(),
    report_storage_path: stored.storagePath,
    report_sha256: stored.sha256,
    results
  });
  if (!Array.isArray(transitioned) || !transitioned.length) {
    return sendJson(res, 409, {
      error: "Энэ хүсэлтийн төлөв өөрчлөгдсөн байна. Хүсэлтүүдийн жагсаалтыг шинэчлээд дахин шалгана уу."
    });
  }

  try {
    const emailResult = await sendReportEmail({
      email: record.email,
      fullName: record.full_name,
      submissionCode: record.submission_code,
      pdfBuffer
    });
    await patchSubmission(record.id, "review_status=eq.approved", {
      email_status: "sent",
      resend_message_id: emailResult.messageId,
      email_sent_at: new Date().toISOString(),
      report_storage_path: stored.storagePath,
      report_sha256: stored.sha256
    });
    return sendJson(res, 200, {
      ok: true,
      submissionCode: record.submission_code,
      reviewStatus: "approved",
      emailStatus: "sent",
      message: "PDF тайлан үүсэж, private хадгалалтад орон сурагчийн бүртгэлтэй и-мэйл рүү илгээгдлээ."
    });
  } catch (error) {
    const safeMessage = cleanText(error.message, 500);
    await patchSubmission(record.id, "review_status=eq.approved", {
      email_status: "failed",
      review_note: [nextReviewNote, "Имэйл илгээхэд алдаа: " + safeMessage].filter(Boolean).join(" · ")
    }).catch(() => {});
    return sendJson(res, 502, {
      error: "Тайлан бэлэн болсон боловч и-мэйл илгээж чадсангүй. Админ хяналтын хэсгээс дахин илгээж болно.",
      emailStatus: "failed"
    });
  }
}

module.exports = async function reviewSubmission(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST хүсэлт шаардлагатай." }, { Allow: "POST" });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: "Энэ хүсэлтийн эх үүсвэр зөвшөөрөгдөөгүй." });
  if (!verifyAdmin(req)) return sendJson(res, 401, { error: "Админы эрхээр нэвтэрнэ үү." });

  try {
    const body = await readJson(req, 16 * 1024);
    const id = String(body.id || "");
    const action = body.action;
    const reviewNote = cleanText(body.reviewNote, 1000);
    if (!/^[0-9a-f-]{36}$/i.test(id) || !["approve", "reject", "resend"].includes(action)) {
      return sendJson(res, 400, { error: "Хүсэлтийн мэдээлэл буруу байна." });
    }

    const record = await getSubmission(id);
    if (!record) return sendJson(res, 404, { error: "Тестийн хүсэлт олдсонгүй." });

    if (action === "reject") {
      if (record.review_status !== "pending") {
        return sendJson(res, 409, { error: "Зөвхөн хүлээгдэж буй хүсэлтийг буцаах боломжтой." });
      }
      const updated = await patchSubmission(id, "review_status=eq.pending", {
        review_status: "rejected",
        email_status: "not_sent",
        review_note: reviewNote || null,
        reviewed_by: "admin",
        reviewed_at: new Date().toISOString()
      });
      if (!Array.isArray(updated) || !updated.length) {
        return sendJson(res, 409, { error: "Энэ хүсэлтийг өөр админ аль хэдийн шалгасан байна." });
      }
      return sendJson(res, 200, {
        ok: true,
        submissionCode: record.submission_code,
        reviewStatus: "rejected",
        emailStatus: "not_sent",
        message: "Хүсэлтийг буцаалаа. Тайлан илгээгдэхгүй."
      });
    }

    if (action === "approve") {
      if (record.review_status !== "pending") {
        if (record.review_status === "approved" && record.email_status === "sent") {
          return sendJson(res, 200, { ok: true, submissionCode: record.submission_code, reviewStatus: "approved", emailStatus: "sent", message: "Энэ тайлан өмнө нь амжилттай илгээгдсэн байна." });
        }
        return sendJson(res, 409, { error: "Зөвхөн хүлээгдэж буй хүсэлтийг зөвшөөрнө. Имэйл илгээгээгүй бол “Дахин илгээх” үйлдлийг ашиглана уу." });
      }
      return await sendApprovedReport({ req, res, record, reviewNote, retry: false });
    }

    if (record.review_status !== "approved" || !["failed", "waiting_report", "sending"].includes(record.email_status)) {
      if (record.review_status === "approved" && record.email_status === "sent") {
        return sendJson(res, 200, { ok: true, submissionCode: record.submission_code, reviewStatus: "approved", emailStatus: "sent", message: "Тайлан өмнө нь амжилттай илгээгдсэн байна." });
      }
      return sendJson(res, 409, { error: "Дахин илгээх боломжтой төлөвт хүсэлт алга байна." });
    }
    return await sendApprovedReport({ req, res, record, reviewNote, retry: true });
  } catch (error) {
    console.error("admin-review", error.message);
    return sendJson(res, 500, { error: "Хяналтын үйлдлийг гүйцэтгэхэд алдаа гарлаа. Төлөвийг шинэчлээд шалгана уу." });
  }
};
