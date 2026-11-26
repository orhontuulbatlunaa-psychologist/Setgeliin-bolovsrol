const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync("holland-questions.js", "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);
const q = context.window.HOLLAND_QUESTIONS;
assert.ok(q, "HOLLAND_QUESTIONS must be defined");
assert.equal(q.test1.length, 36, "Test 1 must contain 36 items");
assert.equal(q.test2.length, 36, "Test 2 must contain 36 items");
assert.equal(q.test3.length, 42, "Test 3 must contain 42 pairs");
assert.equal(new Set(q.test1).size, 36, "Test 1 must not contain duplicate items");
assert.equal(new Set(q.test2).size, 36, "Test 2 must not contain duplicate items");
assert.ok(q.test3.every(pair => Array.isArray(pair) && pair.length === 4), "Each Test 3 pair must have two occupations and two codes");
assert.ok(q.test3.every(pair => [1,2,3,4,5,6].includes(pair[2]) && [1,2,3,4,5,6].includes(pair[3])), "Test 3 codes must be in R-I-A-S-E-C range 1–6");
assert.ok(q.test3.every(pair => typeof pair[0] === "string" && pair[0].trim() && typeof pair[1] === "string" && pair[1].trim()), "Occupation labels must be non-empty");

const scoringSource = fs.readFileSync("Scoring_Engine.ts", "utf8");
const pairBlock = scoringSource.match(/export const TEST3_PAIRS:[\s\S]*?=\[([\s\S]*?)\n\];/);
assert.ok(pairBlock, "Scoring engine must expose the 42 Test 3 code pairs");
const enginePairs = [...pairBlock[1].matchAll(/\["([RIASEC])","([RIASEC])"\]/g)].map(m => [m[1], m[2]]);
assert.equal(enginePairs.length, 42, "Scoring engine must contain 42 Test 3 pairs");
const codeNumber = { R: 1, I: 2, A: 3, S: 4, E: 5, C: 6 };
q.test3.forEach((pair, index) => {
  assert.deepEqual([pair[2], pair[3]], enginePairs[index].map(code => codeNumber[code]),
    `Test 3 pair ${index + 1} must match scoring engine mapping`);
});
const html = fs.readFileSync("holland-assessment.html", "utf8");
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]).filter(s => s.trim());
assert.ok(inlineScripts.length, "Assessment page must contain an inline application script");
inlineScripts.forEach((script, index) => {
  assert.doesNotThrow(() => new Function(script), `Assessment inline script ${index + 1} must parse`);
});

console.log("RIASEC questionnaire checks passed: item counts, labels, pair codes, engine mapping, and assessment script syntax.");
