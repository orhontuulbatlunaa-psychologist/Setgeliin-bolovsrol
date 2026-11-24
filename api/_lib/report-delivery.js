const crypto = require("node:crypto");

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} серверийн тохиргоо дутуу байна.`);
  return value;
}

async function uploadPrivateReport({ submissionId, pdfBuffer }) {
  const baseUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const secret = requiredEnv("SUPABASE_SECRET_KEY");
  const bucket = "career-test-reports";
  const storagePath = `reports/${submissionId}.pdf`;
  const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${encodedPath}`, {
    method: "POST",
    headers: {
      apikey: secret,
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/pdf",
      "x-upsert": "true",
      "cache-control": "private, max-age=0"
    },
    body: pdfBuffer
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`PDF тайланг private storage-д хадгалж чадсангүй (${response.status}). ${detail.slice(0, 250)}`);
  }
  return {
    storagePath,
    sha256: crypto.createHash("sha256").update(pdfBuffer).digest("hex")
  };
}

async function sendReportEmail({ email, fullName, submissionCode, pdfBuffer }) {
  const apiKey = requiredEnv("RESEND_API_KEY");
  const from = requiredEnv("EMAIL_FROM");
  const name = String(fullName || "сурагч").replace(/[<>]/g, "");
  const filename = `Setgeliin-bolovsrol-RIASEC-${submissionCode}.pdf`;
  const payload = {
    from,
    to: [email],
    subject: "Таны мэргэжлийн чиг баримжааны тайлан",
    text: `Сайн байна уу, ${name} аа.\n\nТаны Holland RIASEC мэргэжлийн чиг баримжааны тайланг PDF файлаар хавсаргалаа. Тайланг уншиж, сүүлийн хуудсан дахь дасгал ажлыг бөглөн өөрийн мэргэжлийн сонголтоо эргэцүүлээрэй.\n\nХүндэтгэсэн,\nСэтгэлийн боловсрол`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#29443d;max-width:600px;margin:auto"><h2 style="color:#327c79">Таны мэргэжлийн чиг баримжааны тайлан бэлэн боллоо</h2><p>Сайн байна уу, <b>${name}</b> аа.</p><p>Таны Holland RIASEC үнэлгээний дэлгэрэнгүй тайланг энэ имэйлд PDF файлаар хавсаргалаа.</p><p>Тайлангаа уншаад сүүлийн хуудсан дахь дасгал ажлыг бөглөж, сонирхож буй мэргэжлүүдээ цааш судлаарай.</p><p>Хүндэтгэсэн,<br/><b>Сэтгэлийн боловсрол</b></p></div>`,
    attachments: [{
      filename,
      content: pdfBuffer.toString("base64"),
      content_type: "application/pdf"
    }],
    tags: [
      { name: "category", value: "riasec-report" },
      { name: "submission", value: submissionCode.replace(/[^A-Za-z0-9_-]/g, "-").slice(0, 250) }
    ]
  };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `career-report-${submissionCode}`
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000)
  });
  const bodyText = await response.text();
  let body = {};
  try { body = bodyText ? JSON.parse(bodyText) : {}; } catch {}
  if (!response.ok || !body.id) {
    const reason = body?.message || body?.name || bodyText.slice(0, 250) || "Resend хүсэлт амжилтгүй.";
    throw new Error(`Тайлангийн имэйл илгээж чадсангүй (${response.status}). ${reason}`);
  }
  return { messageId: body.id };
}

module.exports = { uploadPrivateReport, sendReportEmail };
