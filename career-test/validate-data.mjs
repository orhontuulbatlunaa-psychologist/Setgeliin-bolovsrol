import assert from "node:assert/strict";
import { ASSESSMENT, QUESTION_COUNTS, RI } from "./data.js";
import { calculateAssessmentResults, rankTopThree, summarizeGeneralProfile, validateResponseSet } from "./scoring.js";

assert.equal(QUESTION_COUNTS.interest, 36, "Тест №1 яг 36 асуулттай байх ёстой");
assert.equal(QUESTION_COUNTS.ability, 36, "Тест №2 яг 36 асуулттай байх ёстой");
assert.equal(QUESTION_COUNTS.profile, 42, "Тест №3 яг 42 хос сонголттой байх ёстой");
assert.equal(ASSESSMENT.profilePairs.length * 2, 84, "Тест №3-ын 42 хосод нийт 84 мэргэжлийн сонголт байна");
assert.equal(
  QUESTION_COUNTS.interest + QUESTION_COUNTS.ability + QUESTION_COUNTS.profile,
  114,
  "Нийт бөглөх хариултын үйлдэл 114 байна (36 + 36 + 42)"
);
assert.equal(ASSESSMENT.interestGroups.length, 6);
assert.equal(ASSESSMENT.abilityGroups.length, 6);
assert.ok(ASSESSMENT.interestGroups.every((group) => group.length === 6));
assert.ok(ASSESSMENT.abilityGroups.every((group) => group.length === 6));
assert.ok(ASSESSMENT.profilePairs.every((pair) => pair.length === 2));
assert.ok(
  ASSESSMENT.profilePairs.flat().every(
    (choice) => Number.isInteger(choice[0]) && choice[0] >= 1 && choice[0] <= 6 && choice[1].length > 0
  )
);
assert.equal(RI.map((x) => x.code).join(""), "RIASEC");

const allZero = {
  interest: Object.fromEntries(
    ASSESSMENT.interestGroups.flatMap((group, gi) => group.map((_, qi) => [`${gi + 1}-${qi + 1}`, 0]))
  ),
  ability: Object.fromEntries(
    ASSESSMENT.abilityGroups.flatMap((group, gi) => group.map((_, qi) => [`${gi + 1}-${qi + 1}`, 0]))
  ),
  profile: Object.fromEntries(ASSESSMENT.profilePairs.map((_, i) => [String(i), 0]))
};

assert.deepEqual(validateResponseSet(ASSESSMENT, allZero), []);
const zeroResult = calculateAssessmentResults(ASSESSMENT, allZero);
assert.deepEqual(
  zeroResult.interest.map((x) => x.max),
  [18, 18, 18, 18, 18, 18],
  "Тест №1-ийн бүлэг тус бүр зургаан асуулт × 3 оноо = 18 байна"
);
assert.deepEqual(zeroResult.ability.map((x) => x.max), [18, 18, 18, 18, 18, 18]);
assert.equal(
  zeroResult.profile.reduce((sum, item) => sum + item.score, 0),
  42,
  "Тест №3-ын 42 хосоос тус бүр нэг мэргэжил сонгогдож, нийт 42 хариулт тоологдоно"
);
assert.ok(
  zeroResult.comparison.every((item) => item.appearances >= 0 && item.appearances <= 3),
  "Нэгдсэн давтамж нь гурван тест тус бүрт эхний гуравт орсон тоог илэрхийлнэ"
);
assert.equal(zeroResult.comparison.length, 6);

const valuesForSums = (sums) => Object.fromEntries(
  sums.flatMap((sum, gi) => {
    const values = [];
    let remaining = sum;
    for (let qi = 0; qi < 6; qi += 1) {
      const value = Math.min(3, remaining);
      values.push([`${gi + 1}-${qi + 1}`, value]);
      remaining -= value;
    }
    assert.equal(remaining, 0, "жишиг бүлгийн нийлбэр 18-аас их байж болохгүй");
    return values;
  })
);
const manualAnswers = {
  interest: valuesForSums([9, 11, 7, 17, 14, 10]),
  ability: valuesForSums([3, 13, 4, 16, 11, 17]),
  profile: Object.fromEntries(ASSESSMENT.profilePairs.map((_, index) => [String(index), 0]))
};
const manualScores = calculateAssessmentResults(ASSESSMENT, manualAnswers);
assert.deepEqual(manualScores.interest.map((item) => item.score), [9, 11, 7, 17, 14, 10]);
assert.deepEqual(manualScores.ability.map((item) => item.score), [3, 13, 4, 16, 11, 17]);

const verifiedManualExample = summarizeGeneralProfile({
  interest: ["S", "E", "I"],
  ability: ["C", "S", "I"],
  profile: ["S", "E", "I"]
});
assert.deepEqual(verifiedManualExample.generalProfile.dominant, ["S", "I"]);
assert.deepEqual(verifiedManualExample.generalProfile.secondary, ["E", "C"]);
assert.deepEqual(
  verifiedManualExample.comparison.map((item) => [item.code, item.appearances]),
  [["S",3],["I",3],["E",2],["C",1],["R",0],["A",0]],
  "Гараар тулгасан жишээний нэгдсэн давтамж зөв байх ёстой"
);
assert.ok(zeroResult.generalProfile.dominant.length >= 1);
assert.ok(zeroResult.generalProfile.ranked.length >= 1);

const maxScore = structuredClone(allZero);
maxScore.interest["1-4"] = 3;
maxScore.interest["1-6"] = 3;
assert.deepEqual(validateResponseSet(ASSESSMENT, maxScore), [], "R бүлгийн 4, 6-р асуултад 3 оноог зөвшөөрнө");
assert.equal(calculateAssessmentResults(ASSESSMENT, maxScore).interest[0].score, 6);
assert.equal(rankTopThree(RI.map((item) => ({ ...item, score: 10 }))).length, 6, "тэнцүү оноотой хэв шинжийг алдагдуулахгүй");

console.log("RIASEC checks passed: 36 + 36 + 42 response actions; 42 pairs = 84 profession choices; six rating group maxima = 18.");
