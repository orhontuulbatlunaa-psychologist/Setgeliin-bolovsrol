const fs = require("node:fs/promises");
const path = require("node:path");
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

async function renderAssessmentReportPdf({ student, results, submissionCode, generatedAt }) {
  const [{ buildReportHtml }, logo] = await Promise.all([
    import("../../career-test/report-template.js"),
    fs.readFile(path.join(process.cwd(), "assets", "sb-logo.svg"))
  ]);

  const logoDataUri = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const html = buildReportHtml({
    student,
    results,
    submissionCode,
    generatedAt: generatedAt || new Date().toISOString(),
    logoDataUri
  });

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    await page.emulateMediaType("print");
    const output = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    return Buffer.from(output);
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

module.exports = { renderAssessmentReportPdf };
