import { RI, QUESTION_COUNTS } from "./data.js";

const questionKey = (groupIndex, questionIndex) => `${groupIndex + 1}-${questionIndex + 1}`;

export function validateResponseSet(assessment, answers) {
  const errors = [];
  if (!answers || typeof answers !== "object") return ["Хариултын бүтэц буруу байна."];

  for (const section of ["interest", "ability"]) {
    const groups = section === "interest" ? assessment.interestGroups : assessment.abilityGroups;
    for (let gi = 0; gi < groups.length; gi += 1) {
      for (let qi = 0; qi < groups[gi].length; qi += 1) {
        const key = questionKey(gi, qi);
        const value = answers[section]?.[key];
        if (![0, 1, 2, 3].includes(value)) {
          errors.push(`${section}:${key} хариулт дутуу эсвэл буруу.`);
        }
      }
    }
  }

  for (let index = 0; index < assessment.profilePairs.length; index += 1) {
    const value = answers.profile?.[String(index)];
    if (![0, 1].includes(value)) {
      errors.push(`profile:${index} хариулт дутуу эсвэл буруу.`);
    }
  }

  if (Object.keys(answers.interest ?? {}).length !== QUESTION_COUNTS.interest) {
    errors.push("Сонирхлын хариултын тоо 36 биш байна.");
  }
  if (Object.keys(answers.ability ?? {}).length !== QUESTION_COUNTS.ability) {
    errors.push("Чадавхийн хариултын тоо 36 биш байна.");
  }
  if (Object.keys(answers.profile ?? {}).length !== QUESTION_COUNTS.profile) {
    errors.push("Хэв шинжийн хос сонголтын тоо 42 биш байна.");
  }
  return errors;
}

export function scoreRatingSection(assessment, answers, section) {
  const groups = section === "interest" ? assessment.interestGroups : assessment.abilityGroups;
  return groups.map((items, gi) => {
    let score = 0;
    items.forEach((_, qi) => {
      score += Number(answers[section][questionKey(gi, qi)]);
    });
    // Тест №1, №2: 6 асуулт × 3 оноо = бүлэг тус бүрийн дээд оноо 18.
    return { ...RI[gi], score, max: items.length * 3 };
  });
}

export function scoreProfileSection(assessment, answers) {
  return RI.map((type, index) => ({
    ...type,
    score: Object.entries(answers.profile).reduce((sum, [pairIndex, choice]) => {
      const selectedOption = assessment.profilePairs[Number(pairIndex)][choice];
      return sum + (selectedOption[0] === index + 1 ? 1 : 0);
    }, 0),
    // Тест №3-т хос бүрээс нэг мэргэжил сонгоно: нийт 42 сонголт.
    max: assessment.profilePairs.length
  }));
}

// Оноо тэнцсэн бүх хэв шинжийг хадгална. 3-р байранд тэнцсэн бол дур мэдэн хасахгүй.
export function rankTopThree(scores) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const threshold = sorted[Math.min(2, sorted.length - 1)]?.score ?? -1;
  return sorted.filter((item) => item.score >= threshold);
}

function countAppearances(code, tops) {
  return tops.filter((codes) => codes.includes(code)).length;
}

export function calculateAssessmentResults(assessment, answers) {
  const validationErrors = validateResponseSet(assessment, answers);
  if (validationErrors.length) {
    const error = new Error("Тестийн хариулт бүрэн бус эсвэл буруу байна.");
    error.validationErrors = validationErrors;
    throw error;
  }

  const interest = scoreRatingSection(assessment, answers, "interest");
  const ability = scoreRatingSection(assessment, answers, "ability");
  const profile = scoreProfileSection(assessment, answers);

  const tops = {
    interest: rankTopThree(interest).map((item) => item.code),
    ability: rankTopThree(ability).map((item) => item.code),
    profile: rankTopThree(profile).map((item) => item.code)
  };

  // Гурван тестийн тус бүрийн эхний гурван (тэнцсэн бол бүгдийг) хэв шинж
  // нийт хэдэн тестэд давтагдсаныг тоолж нэгдсэн дүгнэлт гаргана.
  // Өөр өөр төрлийн оноонуудыг хооронд нь нэмэхгүй, нийлмэл оноо зохиохгүй.
  const comparison = RI.map((type) => ({
    ...type,
    appearances: countAppearances(type.code, [tops.interest, tops.ability, tops.profile]),
    totalAssessments: 3
  })).sort((a, b) => b.appearances - a.appearances);

  const overallTop = rankTopThree(comparison);
  const highestFrequency = overallTop[0]?.appearances ?? 0;
  const generalProfile = {
    dominant: overallTop
      .filter((item) => item.appearances === highestFrequency)
      .map((item) => item.code),
    secondary: overallTop
      .filter((item) => item.appearances < highestFrequency)
      .map((item) => item.code),
    ranked: overallTop.map((item) => item.code),
    rule: "3 тест тус бүрийн эхний 3 хэв шинжийн давтамж (0–3)-г тоолж, хамгийн их давтамжтайг зонхилох, дараагийн өндөр давтамжтай хоёрыг дагалдах хэв шинжээр тодорхойлов. Тэнцсэн үр дүнг таслаагүй."
  };

  return { interest, ability, profile, tops, comparison, generalProfile };
}
