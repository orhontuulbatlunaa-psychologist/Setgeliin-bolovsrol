/** Holland RIASEC scoring core. Source-based; no cross-test raw-score addition. */
export type Code = "R"|"I"|"A"|"S"|"E"|"C";
export type Scores = Record<Code,number>;
export type Ranked = {code:Code; score:number; rank:number};
export type TestScore = {scores:Scores; ranked:Ranked[]; topThree:Ranked[]; maxScore:number};
export type ThreeTests = {interest:TestScore; ability:TestScore; occupation:TestScore};
export const ORDER:Code[]=["R","I","A","S","E","C"];
const GROUPS:Code[]=["R","I","A","S","E","C"];
// Test 3: two occupation codes per pair, transcribed in source order.
export const TEST3_PAIRS: readonly (readonly [Code,Code])[] = [
["R","I"],["I","C"],["R","S"],["I","E"],["R","C"],["I","A"],
["R","E"],["S","C"],["R","A"],["S","E"],["I","S"],["S","A"],
["I","C"],["C","E"],["I","C"],["C","A"],["I","A"],["E","A"],
["R","C"],["R","I"],["S","E"],["R","C"],["S","A"],["R","E"],
["C","E"],["R","A"],["C","A"],["I","C"],["E","A"],["I","S"],
["R","I"],["I","A"],["R","S"],["S","C"],["R","C"],["S","E"],
["R","A"],["C","E"],["I","S"],["A","S"],["E","A"],["R","E"]
];
function assert(ok:unknown,msg:string):asserts ok { if(!ok) throw new Error(msg); }
function rank(scores:Scores,maxScore:number):TestScore {
 const ranked=ORDER.map(code=>({code,score:scores[code],rank:0})).sort((a,b)=>b.score-a.score);
 let last:number|undefined, r=0;
 ranked.forEach((x,i)=>{if(last===undefined||x.score!==last)r=i+1;x.rank=r;last=x.score;});
 const cutoff=ranked[2].score;
 return {scores,ranked,topThree:ranked.filter(x=>x.score>=cutoff),maxScore};
}
function scoreLikert(answers:readonly number[],name:string):TestScore {
 assert(Array.isArray(answers)&&answers.length===36,name+": 36 хариулт шаардлагатай.");
 const scores:Scores={R:0,I:0,A:0,S:0,E:0,C:0};
 answers.forEach((v,i)=>{assert(Number.isInteger(v)&&v>=0&&v<=3,name+": "+(i+1)+"-р хариулт 0–3 байх ёстой.");scores[GROUPS[Math.floor(i/6)]]+=v;});
 return rank(scores,18);
}
export function scoreInterest(a:readonly number[]){return scoreLikert(a,"Тест 1");}
export function scoreAbility(a:readonly number[]){return scoreLikert(a,"Тест 2");}
export function scoreOccupation(selected:readonly Code[]):TestScore {
 assert(Array.isArray(selected)&&selected.length===42,"Тест 3: 42 хос бүрээс нэг сонголт шаардлагатай.");
 const s:Scores={R:0,I:0,A:0,S:0,E:0,C:0};
 selected.forEach((v,i)=>{assert(TEST3_PAIRS[i].includes(v),"Тест 3: "+(i+1)+"-р хосын сонголт тухайн хоёр мэргэжлийн аль нэг байх ёстой.");s[v]++;});
 return rank(s,42);
}
export function scoreAll(a:{interest:readonly number[];ability:readonly number[];occupation:readonly Code[]}):ThreeTests {
 return {interest:scoreInterest(a.interest),ability:scoreAbility(a.ability),occupation:scoreOccupation(a.occupation)};
}
export type Step4Case="all_overlap"|"interest_ability_overlap"|"all_diverge"|"needs_review";
export type Step4Result={case:Step4Case;overlap:Code[];interestAbilityOverlap:Code[];dominant:Code|null;accompanying:Code[];counselorReview:boolean;message:string};
const adjacent:Record<Code,Code[]>={R:["I","C"],I:["R","A"],A:["I","S"],S:["A","E"],E:["S","C"],C:["E","R"]};
/** Step 4: compare top-three sets as three independent layers; never sum unlike scales. */
export function analyzeStep4(t:ThreeTests):Step4Result {
 const i=t.interest.topThree.map(x=>x.code), a=t.ability.topThree.map(x=>x.code), o=t.occupation.topThree.map(x=>x.code);
 const overlap=i.filter(x=>a.includes(x)&&o.includes(x));
 const ia=i.filter(x=>a.includes(x));
 if(overlap.length){
  const candidates=overlap.slice().sort((x,y)=>(t.interest.scores[y]+t.ability.scores[y]+t.occupation.scores[y])-(t.interest.scores[x]+t.ability.scores[x]+t.occupation.scores[x]));
  const lead=candidates[0], adjacentCandidates=candidates.filter(x=>adjacent[lead].includes(x));
  const unique=candidates.length===1|| (candidates[1] && candidates[0]!==candidates[1]);
  const clear=unique && adjacentCandidates.length>=1;
  return {case:clear?"all_overlap":"needs_review",overlap,interestAbilityOverlap:ia,dominant:clear?lead:null,accompanying:clear?adjacentCandidates.slice(0,2):[],counselorReview:!clear,message:clear?"Гурван тестийн үр дүн давхцаж байна. Давхцсан хэв шинжээс зонхилох болон зэргэлдээ дагалдах хэв шинжийг тодорхойлов.":"Гурван тест давхцаж байгаа боловч зонхилох/дагалдах хэв шинжийг нэг утгатай тогтоох боломжгүй. Зөвлөхийн хяналт шаардлагатай."};
 }
 if(ia.length) return {case:"interest_ability_overlap",overlap,interestAbilityOverlap:ia,dominant:null,accompanying:[],counselorReview:true,message:"Сонирхол ба чадавх давхцаж байгаа боловч мэргэжлийн сонголт зөрж байна. Мэргэжлийн талаарх мэдлэгээ өргөжүүлж, эцэг эх, багш эсвэл мэргэжил сонголтын зөвлөхтэй ярилцахыг зөвлөе."};
 return {case:"all_diverge",overlap,interestAbilityOverlap:ia,dominant:null,accompanying:[],counselorReview:true,message:"Гурван үр дүн мэдэгдэхүйц зөрж байна. Өөрийн сонирхол, чадавх, амжилттай хийж чадах ажлын талаар эргэцүүлж, шаардлагатай бол чадавхын үр дүнг баримжаа болгон зөвлөгөө аваарай."};
}
