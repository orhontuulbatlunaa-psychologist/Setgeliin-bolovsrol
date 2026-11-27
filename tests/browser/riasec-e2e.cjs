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

    const result = page.locator("#result");
    const resultText = await result.innerText();

    const reportHeadings = await result.locator(".t3-report h2").allTextContents();
    assert.deepEqual(reportHeadings, [
      "Таны мэргэжилд чиглэсэн хүсэл сонирхол",
      "Таны өөрийн үнэлсэн чадавх",
      "Таны мэргэжлийн хэв шинж"
    ], "Үр дүнгийн тайлангууд батлагдсан дарааллаар харагдах ёстой");

    const expectedTypes = [
      "R · Бодит үйл ажиллагааг эрхэмлэгч",
      "I · Судлаач, шинжээч",
      "A · Уран сайхны",
      "S · Нийгмийн",
      "E · Ажил хэрэгч",
      "C · Стандартыг баримтлагч"
    ];
    for (const label of expectedTypes) {
      assert.ok(resultText.includes(label), `Үр дүнд ${label} нэршил байх ёстой`);
    }
    assert.ok(resultText.includes("18 / 18"), "Test 1-ийн 18/18 оноо харагдах ёстой");
    assert.ok(resultText.includes("12 / 18"), "Test 2-ийн 12/18 оноо харагдах ёстой");
    assert.ok(resultText.includes("ур чадварын шалгалт, онош биш"),
      "Test 2 өөрийн үнэлгээний хязгаарлалтыг тайлбарлах ёстой");
    assert.ok(resultText.includes("ТЕСТ 1 · СОНИРХОЛ"));
    assert.ok(resultText.includes("ТЕСТ 2 · ЧАДАВХ"));
    assert.ok(resultText.includes("ТЕСТ 3 · МИНИЙ МЭРГЭЖЛИЙН ХЭВ ШИНЖ"));
    assert.ok(resultText.includes("Алхам 4. Мэргэжлийн зонхилох хэв шинжээ тодорхойлох"));
    assert.ok(!resultText.includes("Таны сонгосон мэргэжлүүд"),
      "Test 3-д сонгосон мэргэжлийн жагсаалт нэмэгдэх ёсгүй");
    assert.ok(!resultText.includes("NaN"), "Оноонд NaN гарах ёсгүй");

    const interestRadii = await result.locator(".t3-report").nth(0)
      .locator(".t3-chart circle").evaluateAll(nodes => nodes.map(node => Number(node.getAttribute("r"))));
    const abilityRadii = await result.locator(".t3-report").nth(1)
      .locator(".t3-chart circle").evaluateAll(nodes => nodes.map(node => Number(node.getAttribute("r"))));
    assert.equal(interestRadii.length, 6, "Test 1 radar зургаан цэгтэй байх ёстой");
    assert.equal(abilityRadii.length, 6, "Test 2 radar зургаан цэгтэй байх ёстой");
    assert.ok(interestRadii.every(radius => radius === 13),
      "Test 1-ийн ижил 18 оноонууд ижил, пропорциональ радиустай байх ёстой");
    assert.ok(abilityRadii.every(radius => Math.abs(radius - (12 / 18 * 13)) < 0.001),
      "Test 2-ийн ижил 12 оноонууд ижил, пропорциональ радиустай байх ёстой");

    const interestBars = await result.locator(".t3-report").nth(0)
      .locator(".t3-fill").evaluateAll(nodes => nodes.map(node => node.style.getPropertyValue("--w")));
    const abilityBars = await result.locator(".t3-report").nth(1)
      .locator(".t3-fill").evaluateAll(nodes => nodes.map(node => node.style.getPropertyValue("--w")));
    assert.ok(interestBars.every(width => width === "100%"), "Test 1-ийн зургаан bar 18/18 байх ёстой");
    assert.ok(abilityBars.every(width => Math.abs(parseFloat(width) - 66.6666666667) < 0.001),
      "Test 2-ийн зургаан bar 12/18 байх ёстой");

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
