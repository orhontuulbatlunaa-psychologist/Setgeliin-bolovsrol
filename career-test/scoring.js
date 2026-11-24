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

const intersect = (left = [], right = []) => left.filter((code) => right.includes(code));

export function compareAssessmentProfiles(tops) {
  const interestAbility = intersect(tops.interest, tops.ability);
  const interestProfile = intersect(tops.interest, tops.profile);
  const abilityProfile = intersect(tops.ability, tops.profile);
  const commonAcrossAll = intersect(interestAbility, tops.profile);

  let pattern = "partial-overlap";
  if (commonAcrossAll.length) pattern = "three-way-overlap";
  else if (interestAbility.length && !intersect(interestAbility, tops.profile).length) {
    pattern = "interest-ability-aligned-profile-differs";
  } else if (!interestAbility.length && !interestProfile.length && !abilityProfile.length) {
    pattern = "three-way-divergence";
  }

  const descriptions = {
    "three-way-overlap": "Сонирхол, чадавх болон мэргэжлийн хэв шинжийн үр дүнд нийтлэг хэв шинж байна. Энэ нь гурван үнэлгээ хоорондоо уялдаж байгааг илтгэх эерэг дохио; нийтлэг хэв шинжүүдийн давтамжийг ерөнхий дүгнэлтэд ашиглав.",
    "interest-ability-aligned-profile-differs": "Сонирхол болон өөрийн үнэлсэн чадавхийн хэв шинжүүд хоорондоо нийцэж байгаа боловч мэргэжлийн хэв шинжийн үнэлгээ өөр байна. Эх аргачлалд үүнийг мэргэжлийн нэр сонгохдоо сонирхол, чадавхийг харгалзаагүй эсвэл мэргэжлийн талаарх мэдлэг дутмаг байсантай холбоотой байж болох боломж гэж тайлбарладаг. Энэ нь баттай шалтгаан биш тул сурагч мэргэжлүүдийн талаар нэмж судлах нь зүйтэй.",
    "three-way-divergence": "Гурван үнэлгээний эхний хэв шинжүүд хоорондоо давхцахгүй байна. Эх аргачлалд ийм зөрүү нь сонирхол, чадавх хоёрын нийцэл сул, сонирхол эсвэл чадавхи бүрэн танигдаагүй/төлөвшөөгүй байж болохыг эргэцүүлэх шаардлагатай гэж тайлбарладаг.",
    "partial-overlap": "Гурван үнэлгээний зарим хэв шинж давхцаж, зарим нь зөрж байна. Давхцсан болон ялгаатай хэв шинжүүдийг тус бүрээр нь харж, мэргэжлийн сонголтын талаарх мэдлэгээ нэмж судлах нь зүйтэй."
  };

  return {
    pattern,
    commonAcrossAll,
    interestAbility,
    interestProfile,
    abilityProfile,
    narrative: descriptions[pattern]
  };
}

export function summarizeGeneralProfile(tops) {
  const comparison = RI.map((type) => ({
    ...type,
    appearances: countAppearances(type.code, [tops.interest, tops.ability, tops.profile]),
    totalAssessments: 3
  })).sort((a, b) => b.appearances - a.appearances);

  const sortedComparison = [...comparison].sort((a, b) => b.appearances - a.appearances);
  const highestFrequency = sortedComparison[0]?.appearances ?? 0;
  const dominantItems = sortedComparison.filter((item) => item.appearances === highestFrequency);
  const remainingItems = sortedComparison.filter((item) => item.appearances < highestFrequency);
  // Зонхилох хэв шинж тэнцвэл бүгдийг нь хадгална. Тэдний дараа давтамжаар
  // хоёр хэв шинжийг авна; хоёр дахь байранд давтамж тэнцсэн бол тэнцсэн бүгдийг хадгална.
  const secondaryThreshold = remainingItems[Math.min(1, remainingItems.length - 1)]?.appearances;
  const secondaryItems = secondaryThreshold === undefined
    ? []
    : remainingItems.filter((item) => item.appearances >= secondaryThreshold);
  const generalProfile = {
    dominant: dominantItems.map((item) => item.code),
    secondary: secondaryItems.map((item) => item.code),
    ranked: [...dominantItems, ...secondaryItems].map((item) => item.code),
    rule: "3 тест тус бүрийн эхний 3 хэв шинжийн давтамж (0–3)-г тоолно. Хамгийн их давтамжтай хэв шинж(үүд) зонхилох; тэдний дараа давтамжаар эхний хоёр хэв шинж дагалдах болно. Давтамж тэнцсэн хэв шинжүүдийг хасахгүй."
  };

  return { comparison, generalProfile };
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

  // Өөр өөр төрлийн raw оноог хооронд нь нэмэхгүй; зөвхөн тест тус бүрийн top-3 давтамжийг харьцуулна.
  const { comparison, generalProfile } = summarizeGeneralProfile(tops);
  const profileComparison = compareAssessmentProfiles(tops);

  return { interest, ability, profile, tops, comparison, generalProfile, profileComparison };
}
