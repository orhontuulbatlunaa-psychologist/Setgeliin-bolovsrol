const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = process.cwd();
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://127.0.0.1").pathname;
  const filename = pathname === "/" ? "holland-test.html" : pathname.slice(1);
  const fullPath = path.join(root, filename);
  if (!fullPath.startsWith(root + path.sep) && fullPath !== path.join(root, "holland-test.html")) {
    res.writeHead(403).end("Forbidden"); return;
  }
  fs.readFile(fullPath, (error, data) => {
    if (error) { res.writeHead(404).end("Not found"); return; }
    res.writeHead(200, { "content-type": filename.endsWith(".js") ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8" });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(4173, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/holland-assessment.html");
    await page.waitForSelector("form");

    assert.equal(await page.locator(".question").count(), 114, "Хуудас яг 114 асуулт харуулах ёстой");
    assert.equal(await page.locator('input[name^="t1-"]').count(), 144, "Test 1-ийн 36×4 сонголт");
    assert.equal(await page.locator('input[name^="t2-"]').count(), 144, "Test 2-ийн 36×4 сонголт");
    assert.equal(await page.locator('input[name^="t3-"]').count(), 84, "Test 3-ийн 42×2 сонголт");

    await page.getByRole("button", { name: "Хариултыг шалгаж, оноо бодох" }).click();
    assert.equal(await page.locator("#result").evaluate(el => getComputedStyle(el).display), "none",
      "Хоосон тестийг илгээхэд үр дүн гарах ёсгүй");

    for (let i = 0; i < 36; i++) {
      await page.locator(`input[name="t1-${i}"][value="3"]`).check();
      await page.locator(`input[name="t2-${i}"][value="2"]`).check();
    }
    for (let i = 0; i < 42; i++) {
      await page.locator(`input[name="t3-${i}"][value="0"]`).check();
    }

    assert.match(await page.locator(".progress").textContent(), /114 \/ 114/,
      "Явц 114/114 болох ёстой");
    await page.getByRole("button", { name: "Хариултыг шалгаж, оноо бодох" }).click();
    await page.locator("#result").waitFor({ state: "visible" });

    const resultText = await page.locator("#result").innerText();
    for (const code of ["R", "I", "A", "S", "E", "C"]) {
      assert.ok(resultText.includes(`${code} —`), `Үр дүнд ${code} хэв шинж байх ёстой`);
      assert.ok(resultText.includes(`: 18 / 18`) || resultText.includes(`: 12 / 18`),
        "Test 1/2-ийн бүлгийн онооны хязгаар зөв байх ёстой");
    }
    assert.ok(resultText.includes("Тест 1 · Хүсэл сонирхол"));
    assert.ok(resultText.includes("Тест 2 · Чадавхийн өөрийн үнэлгээ"));
    assert.ok(resultText.includes("Тест 3 · Мэргэжлийн хэв шинж"));
    assert.ok(resultText.includes("Алхам 4. Мэргэжлийн зонхилох хэв шинжээ тодорхойлох"));
    assert.ok(/Тэнцсэн|Тэнцээгүй/.test(resultText), "Test 3 тэнцлийн төлөв харагдах ёстой");
    assert.ok(!resultText.includes("NaN"), "Оноонд NaN гарах ёсгүй");
    assert.deepEqual(errors, [], "Браузерийн JavaScript алдаагүй ажиллах ёстой");

    console.log("PASS: 114 асуулт, хоосон илгээлтийн хориг, явц, 3 тестийн оноо, Test 3 тэнцлийн төлөв, Алхам 4.");
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
  server.close();
});
