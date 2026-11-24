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
        if (![0,1,2,3].includes(value)) errors.push(`${section}:${key} хариулт дутуу эсвэл буруу.`);
        if (section === "interest" && gi === 0 && (qi === 3 || qi === 5) && value === 3) {
          errors.push(`${section}:${key} эх материалд байхгүй 3 оноо сонгогдсон.`);
        }
      }
    }
  }
  for (let index = 0; index < assessment.profilePairs.length; index += 1) {
    const value = answers.profile?.[String(index)];
    if (![0,1].includes(value)) errors.push(`profile:${index} хариулт дутуу эсвэл буруу.`);
  }
  if (Object.keys(answers.interest ?? {}).length !== QUESTION_COUNTS.interest) errors.push("Сонирхлын хариултын тоо 36 биш байна.");
  if (Object.keys(answers.ability ?? {}).length !== QUESTION_COUNTS.ability) errors.push("Чадавхийн хариултын тоо 36 биш байна.");
  if (Object.keys(answers.profile ?? {}).length !== QUESTION_COUNTS.profile) errors.push("Хэв шинжийн сонголтын тоо 42 биш байна.");
  return errors;
}

export function scoreRatingSection(assessment, answers, section) {
  const groups = section === "interest" ? assessment.interestGroups : assessment.abilityGroups;
  return groups.map((items, gi) => {
    let score = 0;
    let max = 0;
    items.forEach((_, qi) => {
      const key = questionKey(gi, qi);
      const allowed = section === "interest" && gi === 0 && (qi === 3 || qi === 5) ? [0,1,2] : [0,1,2,3];
      score += Number(answers[section][key]);
      max += Math.max(...allowed);
    });
    return { ...RI[gi], score, max };
  });
}

export function scoreProfileSection(assessment, answers) {
  return RI.map((type, index) => ({
    ...type,
    score: Object.entries(answers.profile).reduce((sum, [pairIndex, choice]) => {
      return sum + (assessment.profilePairs[Number(pairIndex)][choice][0] === index + 1 ? 1 : 0);
    }, 0),
    max: assessment.profilePairs.length
  }));
}

// Эх аргачлалд хамгийн өндөр оноо болон дараагийн хоёр өндөр оноог хэрэглэдэг.
// Гурав дахь байранд тэнцсэн хэв шинжүүдийг дур мэдэн таслахгүй, бүгдийг харуулна.
export function rankTopThree(scores) {
  const sorted = [...scores].sort((a,b) => b.score - a.score);
  const threshold = sorted[Math.min(2, sorted.length - 1)]?.score ?? -1;
  return sorted.filter((item) => item.score >= threshold);
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
    interest: rankTopThree(interest).map((x) => x.code),
    ability: rankTopThree(ability).map((x) => x.code),
    profile: rankTopThree(profile).map((x) => x.code)
  };
  const comparison = RI.map((type) => ({
    ...type,
    appearances: [tops.interest, tops.ability, tops.profile].filter((list) => list.includes(type.code)).length
  })).sort((a,b) => b.appearances - a.appearances);
  return { interest, ability, profile, tops, comparison };
}
