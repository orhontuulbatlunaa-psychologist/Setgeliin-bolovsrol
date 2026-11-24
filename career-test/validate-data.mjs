import assert from "node:assert/strict";
import { ASSESSMENT, QUESTION_COUNTS, RI } from "./data.js";
import { calculateAssessmentResults, rankTopThree, validateResponseSet } from "./scoring.js";

assert.equal(QUESTION_COUNTS.interest, 36, "Тест №1 яг 36 асуулттай байх ёстой");
assert.equal(QUESTION_COUNTS.ability, 36, "Тест №2 яг 36 асуулттай байх ёстой");
assert.equal(QUESTION_COUNTS.profile, 42, "Тест №3 яг 42 хос сонголттой байх ёстой");
assert.equal(QUESTION_COUNTS.interest + QUESTION_COUNTS.ability + QUESTION_COUNTS.profile, 114, "Нийт 114 хариулт байх ёстой");
assert.equal(ASSESSMENT.interestGroups.length, 6);
assert.equal(ASSESSMENT.abilityGroups.length, 6);
assert.ok(ASSESSMENT.interestGroups.every((group) => group.length === 6));
assert.ok(ASSESSMENT.abilityGroups.every((group) => group.length === 6));
assert.ok(ASSESSMENT.profilePairs.every((pair) => pair.length === 2));
assert.ok(ASSESSMENT.profilePairs.flat().every((choice) => Number.isInteger(choice[0]) && choice[0] >= 1 && choice[0] <= 6 && choice[1].length > 0));
assert.equal(RI.map((x) => x.code).join(""), "RI ASEC".replace(" ", ""));

const allZero = {
  interest: Object.fromEntries(ASSESSMENT.interestGroups.flatMap((group, gi) => group.map((_, qi) => [`${gi+1}-${qi+1}`, 0]))),
  ability: Object.fromEntries(ASSESSMENT.abilityGroups.flatMap((group, gi) => group.map((_, qi) => [`${gi+1}-${qi+1}`, 0]))),
  profile: Object.fromEntries(ASSESSMENT.profilePairs.map((_, i) => [String(i), 0]))
};
assert.deepEqual(validateResponseSet(ASSESSMENT, allZero), []);
const zeroResult = calculateAssessmentResults(ASSESSMENT, allZero);
assert.deepEqual(zeroResult.interest.map((x) => x.max), [18,18,18,18,18,18], "сонирхлын бүх бүлэг зургаан асуулт × 3 оноо = 18 байна");
assert.ok(zeroResult.ability.every((x) => x.max === 18));
assert.equal(zeroResult.profile.reduce((sum, item) => sum + item.score, 0), 42, "42 хосоос тус бүр нэг сонголт тоологдоно");

const maxScore = structuredClone(allZero);
maxScore.interest["1-4"] = 3;
maxScore.interest["1-6"] = 3;
assert.deepEqual(validateResponseSet(ASSESSMENT, maxScore), [], "R бүлгийн 4, 6-р асуултад 3 оноог зөвшөөрнө");
assert.equal(calculateAssessmentResults(ASSESSMENT, maxScore).interest[0].score, 6);
assert.equal(rankTopThree(RI.map((item) => ({...item,score:10}))).length, 6, "тэнцүү оноотой хэв шинжийг алдагдуулахгүй");

console.log("RIASEC source-data checks passed: 36 + 36 + 42 = 114; answer keys and scoring validations passed.");
