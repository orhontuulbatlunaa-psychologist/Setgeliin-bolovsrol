/** Step 4: source-faithful comparison of three RIASEC top-three layers. */
export type HollandCode = "R"|"I"|"A"|"S"|"E"|"C";
export type RankedType = {code:HollandCode;score:number;rank:number};
export type TestLayer = {scores:Record<HollandCode,number>;topThree:RankedType[]};
export type Step4Case = "THREE_WAY_OVERLAP"|"INTEREST_ABILITY_OVERLAP"|"THREE_WAY_DIVERGENCE";
export type Step4Result = {
  case:Step4Case;
  layers:{interest:HollandCode[];ability:HollandCode[];occupation:HollandCode[]};
  commonToAllThree:HollandCode[];
  commonToInterestAndAbility:HollandCode[];
  dominantCandidates:HollandCode[];
  accompanyingCandidates:HollandCode[];
  requiresCounselorConfirmation:true;
  interpretation:string;
  reflectionQuestions:string[];
  guidance:string[];
};
export const HOLLAND_ORDER:readonly HollandCode[]=["R","I","A","S","E","C"];
const ADJACENT:Record<HollandCode,HollandCode[]>={R:["I","C"],I:["R","A"],A:["I","S"],S:["A","E"],E:["S","C"],C:["E","R"]};
function ordered(codes:HollandCode[]):HollandCode[]{const s=new Set(codes);return HOLLAND_ORDER.filter(x=>s.has(x));}
function getTop(layer:TestLayer,label:string):HollandCode[]{
 if(!layer||!Array.isArray(layer.topThree)||layer.topThree.length===0)throw new Error(label+": topThree хоосон байна.");
 const codes=layer.topThree.map(x=>x.code);
 if(codes.some(x=>!HOLLAND_ORDER.includes(x)))throw new Error(label+": RIASEC код буруу байна.");
 return ordered(codes);
}
/**
 * Rationale: source requires three concentric hexagons (interest inner, ability middle,
 * occupation outer) and describes three comparison patterns. It says the highest score
 * among overlapping corners is dominant, but does not define a common scale or cross-test
 * tie-break for 18-point and 42-count results. Therefore no raw-score sum/weight is invented;
 * the common candidates are shown for counselor confirmation.
 */
export function analyzeStep4(input:{interest:TestLayer;ability:TestLayer;occupation:TestLayer}):Step4Result{
 const interest=getTop(input.interest,"Сонирхол"),ability=getTop(input.ability,"Чадавх"),occupation=getTop(input.occupation,"Мэргэжил");
 const all=ordered(interest.filter(x=>ability.includes(x)&&occupation.includes(x)));
 const ia=ordered(interest.filter(x=>ability.includes(x)));
 const layers={interest,ability,occupation};
 if(all.length){
  const adjacent=ordered(all.flatMap(x=>ADJACENT[x]).filter(x=>all.includes(x)));
  return {case:"THREE_WAY_OVERLAP",layers,commonToAllThree:all,commonToInterestAndAbility:ia,dominantCandidates:all,accompanyingCandidates:adjacent,requiresCounselorConfirmation:true,
   interpretation:"Сонирхол, чадавх, мэргэжлийн хэв шинжүүд давхцаж байна. Эх материалд энэ нь хүсүүштэй тохиолдол гэж үздэг. Давхцсан хэв шинжүүдээс хамгийн өндөр оноотойг зонхилох, түүнтэй зэргэлдээ хэв шинжүүдийг дагалдах чиглэлээр тодорхойлно.",
   reflectionQuestions:[],guidance:["Сонирхлын хэв шинжийг дотор, чадавхын хэв шинжийг дунд, мэргэжлийн хэв шинжийг гадна зургаан өнцөгтөд харуулна.","Тест 1/2-ын 0–18 оноог Тест 3-ын 0–42 сонголтын тоотой шууд харьцуулж болохгүй.","Давхцсан хэв шинжийн зонхилохыг эх материалын дагуу зөвлөх баталгаажуулж, зэргэлдээ хоёр дагалдах хэв шинжийг сонгоно."]};
 }
 if(ia.length)return {case:"INTEREST_ABILITY_OVERLAP",layers,commonToAllThree:[],commonToInterestAndAbility:ia,dominantCandidates:[],accompanyingCandidates:[],requiresCounselorConfirmation:true,
  interpretation:"Сонирхол ба чадавхийн хэв шинж давхцаж байгаа боловч мэргэжлийн хэв шинж зөрүүтэй байна. Энэ нь сонирхдог зүйлээ хийж чаддаг, эсвэл хийж чаддаг зүйлдээ дуртай байгааг илэрхийлж болох ч мэргэжлийн нэрийн өнгөц шинж эсвэл мэргэжлийн талаарх мэдлэг дутмаг байдал сонголтод нөлөөлсөн байж болзошгүй.",
  reflectionQuestions:["Тест 3-т сонгосон мэргэжлүүдийн ажил үүрэг, шаардлагыг хэр сайн мэдэх вэ?","Сонголтод нэр хүнд, цалин зэрэг гаднах хүчин зүйл нөлөөлсөн үү?"],
  guidance:["Мэргэжлүүдийн талаарх мэдлэгээ өргөжүүлнэ.","Эцэг эх, багш, мэргэжил сонголтын зөвлөхтэй ярилцана."]};
 return {case:"THREE_WAY_DIVERGENCE",layers,commonToAllThree:[],commonToInterestAndAbility:[],dominantCandidates:[],accompanyingCandidates:[],requiresCounselorConfirmation:true,
  interpretation:"Сонирхол, чадавх, мэргэжлийн хэв шинжүүд илт зөрж байна. Сонирхол ба чадавх хараахан нийцээгүй, эсвэл эдгээр нь бүрэн танигдаж, төлөвшөөгүй байж болзошгүй.",
  reflectionQuestions:["Би юуг чухам сонирхож байна вэ?","Би ер нь ямар чадавхитай вэ?","Би ямар ажил, мэргэжилд амжилт олж чадах вэ?"],
  guidance:["Өөрийн сонирхол, чадавхын талаар эргэцүүлэн бодно.","Шийдвэр гаргахад хүндрэлтэй бол чадавхын үр дүнг баримжаа болгоно.","Эцэг эх, багш болон шаардлагатай бол мэргэжлийн зөвлөхтэй зөвлөлдөнө."]};
}
