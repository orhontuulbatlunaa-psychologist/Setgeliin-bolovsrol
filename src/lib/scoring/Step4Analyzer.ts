/**
 * Step 4 — source-faithful Holland RIASEC profile comparison.
 *
 * The three instruments use different score ranges (18, 18, 42).
 * The source does not define a common normalized scale. This module
 * therefore compares the three top-profile sets, never sums raw scores,
 * and leaves final dominant/accompanying type confirmation to a counselor.
 */
export type HollandCode = "R" | "I" | "A" | "S" | "E" | "C";
export type RankedType = { code: HollandCode; score: number; rank: number };
export type TestProfile = { scores: Record<HollandCode, number>; ranked: RankedType[]; topThree: RankedType[]; maxScore: 18 | 42 };
export type ThreeProfiles = { interest: TestProfile; ability: TestProfile; occupation: TestProfile };

export const HOLLAND_ORDER: readonly HollandCode[] = ["R", "I", "A", "S", "E", "C"];
export const ADJACENT: Readonly<Record<HollandCode, readonly HollandCode[]>> = {
  R: ["I", "C"], I: ["R", "A"], A: ["I", "S"],
  S: ["A", "E"], E: ["S", "C"], C: ["E", "R"]
};

export type Step4Pattern =
  | "THREE_WAY_OVERLAP"
  | "INTEREST_ABILITY_OVERLAP"
  | "THREE_WAY_DIVERGENCE";

export type Step4Analysis = {
  pattern: Step4Pattern;
  interestTop: HollandCode[];
  abilityTop: HollandCode[];
  occupationTop: HollandCode[];
  commonToAll: HollandCode[];
  commonToInterestAndAbility: HollandCode[];
  dominantCandidates: HollandCode[];
  accompanyingCandidates: HollandCode[];
  counselorConfirmationRequired: true;
  interpretation: string;
  reflectionQuestions: string[];
  guidance: string[];
};

function topCodes(profile: TestProfile): HollandCode[] {
  if (!profile || !Array.isArray(profile.topThree) || profile.topThree.length === 0) {
    throw new Error("Алхам 4: гурван тестийн оноо бүрэн тооцогдсон байх шаардлагатай.");
  }
  return profile.topThree.map(x => x.code);
}

/** Preserve equal-rank boundary ties; do not truncate to exactly three. */
export function analyzeStep4(profiles: ThreeProfiles): Step4Analysis {
  const interestTop = topCodes(profiles.interest);
  const abilityTop = topCodes(profiles.ability);
  const occupationTop = topCodes(profiles.occupation);
  const commonToAll = HOLLAND_ORDER.filter(c =>
    interestTop.includes(c) && abilityTop.includes(c) && occupationTop.includes(c)
  );
  const commonToInterestAndAbility = HOLLAND_ORDER.filter(c =>
    interestTop.includes(c) && abilityTop.includes(c)
  );

  if (commonToAll.length > 0) {
    const adjacentToShared = HOLLAND_ORDER.filter(c =>
      commonToAll.some(shared => ADJACENT[shared].includes(c))
    );
    return {
      pattern: "THREE_WAY_OVERLAP",
      interestTop, abilityTop, occupationTop, commonToAll,
      commonToInterestAndAbility,
      dominantCandidates: commonToAll,
      accompanyingCandidates: adjacentToShared,
      counselorConfirmationRequired: true,
      interpretation: "Сонирхол, өөрийн үнэлсэн чадавх, мэргэжлийн хэв шинжийн үр дүн давхцаж байна. Эх материалд энэ нь хүсүүштэй тохиолдол гэж үзсэн. Давхцсан хэв шинжүүдийг зургаан өнцөгтийн байрлал болон онооны мэдээлэлтэй хамт зөвлөх нягталж, зонхилох ба хоёр дагалдах хэв шинжийг баталгаажуулна.",
      reflectionQuestions: [],
      guidance: [
        "Сонирхлыг дотор, чадавхыг дунд, мэргэжлийн хэв шинжийг гадна зургаан өнцөгтөөр харьцуулна.",
        "Давхцсан оройнуудыг тодруулж, зургаан өнцөгт дээрх зэргэлдээ байрлалыг харуулна.",
        "Тестүүдийн онооны хэмжүүр өөр тул 18 ба 42 оноог шууд нэмэхгүй; эцсийн хэв шинжийг зөвлөх баталгаажуулна."
      ]
    };
  }

  if (commonToInterestAndAbility.length > 0) {
    return {
      pattern: "INTEREST_ABILITY_OVERLAP",
      interestTop, abilityTop, occupationTop, commonToAll,
      commonToInterestAndAbility,
      dominantCandidates: [], accompanyingCandidates: [],
      counselorConfirmationRequired: true,
      interpretation: "Сонирхол ба чадавхийн хэв шинж давхцаж байгаа боловч мэргэжлийн хэв шинжийн сонголт өөр байна. Эх материалд үүнийг өөрийн дуртай, хийж чаддаг зүйлтэй холбоотой байж болохын зэрэгцээ мэргэжлийн талаарх мэдлэг дутмаг эсвэл нэр хүнд, цалин зэрэг гаднах хүчин зүйл сонголтод нөлөөлсөн байж болзошгүй гэж тайлбарласан.",
      reflectionQuestions: [
        "Тест 3-т сонгосон мэргэжлүүдийн өдөр тутмын ажил, шаардлагыг хэр сайн мэдэх вэ?",
        "Сонголтод нэр хүнд, цалин зэрэг гаднах хүчин зүйл нөлөөлсөн үү?"
      ],
      guidance: [
        "Сонирхож буй мэргэжлүүдийн агуулга, өдөр тутмын ажил, шаардлагын талаар мэдээллээ өргөжүүлнэ.",
        "Эцэг эх, багш эсвэл мэргэжил сонголтын зөвлөхтэй ярилцана."
      ]
    };
  }

  return {
    pattern: "THREE_WAY_DIVERGENCE",
    interestTop, abilityTop, occupationTop, commonToAll,
    commonToInterestAndAbility,
    dominantCandidates: [], accompanyingCandidates: [],
    counselorConfirmationRequired: true,
    interpretation: "Сонирхол, чадавх, мэргэжлийн хэв шинжийн үр дүн хоорондоо давхцахгүй байна. Эх материалд сонирхол ба чадавх зөрүүтэй, эсвэл эдгээр нь бүрэн танигдаж, төлөвшөөгүй байж болзошгүй гэж тайлбарласан.",
    reflectionQuestions: [
      "Би юуг чухам сонирхож байна вэ?",
      "Би ер нь ямар чадавхтай вэ?",
      "Би ямар ажил, мэргэжилд амжилт олж чадах вэ?"
    ],
    guidance: [
      "Өөрийн сонирхол, чадавхын талаар тайван эргэцүүлэн бодно.",
      "Шийдвэр гаргахад хүндрэлтэй бол чадавхын үр дүнг баримжаа болгон ашиглаж болно.",
      "Эцэг эх, багш болон шаардлагатай бол мэргэжлийн зөвлөхтэй зөвлөлдөнө."
    ]
  };
}
