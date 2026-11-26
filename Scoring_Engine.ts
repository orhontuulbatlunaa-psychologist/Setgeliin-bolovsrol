/** Holland RIASEC scoring engine — deterministic, source-ordered. */
export type Code = "R"|"I"|"A"|"S"|"E"|"C";
export type Scores = Record<Code,number>;
export type Ranked = {code:Code;score:number;rank:number};
export type TestScore = {scores:Scores;ranked:Ranked[];topThree:Ranked[];maxScore:number;tieLabel?:"Тэнцсэн"|"Тэнцээгүй"};
export type ThreeTests = {interest:TestScore;ability:TestScore;occupation:TestScore};
export const ORDER:readonly Code[]=["R","I","A","S","E","C"];
const GROUPS:readonly Code[]=["R","I","A","S","E","C"];
/** Pair codes transcribed from the two numbered occupation choices in each of the 42 source questionnaire cells. */
export const TEST3_PAIRS:readonly (readonly [Code,Code])[]=[
["R","I"],
["I","C"],
["R","I"],
["S","E"],
["R","I"],
["C","A"],
["R","S"],
["E","C"],
["R","S"],
["A","E"],
["I","S"],
["S","A"],
["I","C"],
["C","E"],
["I","C"],
["E","A"],
["I","E"],
["A","A"],
["R","R"],
["C","I"],
["S","R"],
["E","C"],
["S","R"],
["A","E"],
["C","R"],
["E","A"],
["C","I"],
["A","C"],
["E","I"],
["A","S"],
["R","I"],
["I","A"],
["R","S"],
["S","C"],
["R","S"],
["C","E"],
["R","C"],
["A","E"],
["I","A"],
["S","S"],
["E","R"],
["A","E"]
];
function assert(ok:unknown,message:string):asserts ok {if(!ok)throw new Error(message);}
function emptyScores():Scores{return {R:0,I:0,A:0,S:0,E:0,C:0};}
function rank(scores:Scores,maxScore:number):TestScore{
 const sorted=ORDER.map(code=>({code,score:scores[code],rank:0})).sort((a,b)=>b.score-a.score||ORDER.indexOf(a.code)-ORDER.indexOf(b.code));
 let last:number|undefined,rankNumber=0;
 sorted.forEach((item,index)=>{if(last===undefined||item.score!==last)rankNumber=index+1;item.rank=rankNumber;last=item.score;});
 const cutoff=sorted[2].score;
 return {scores,ranked:sorted,topThree:sorted.filter(x=>x.score>=cutoff),maxScore};
}
function scoreLikert(answers:readonly number[],label:string):TestScore{
 assert(Array.isArray(answers)&&answers.length===36,`${label}: 36 хариулт шаардлагатай.`);
 const scores=emptyScores();
 answers.forEach((value,index)=>{
  assert(Number.isInteger(value)&&value>=0&&value<=3,`${label}: ${index+1}-р хариулт бүхэл 0–3 байх ёстой.`);
  scores[GROUPS[Math.floor(index/6)]]+=value;
 });
 return rank(scores,18);
}
export function scoreInterest(answers:readonly number[]):TestScore{return scoreLikert(answers,"Тест 1");}
export function scoreAbility(answers:readonly number[]):TestScore{return scoreLikert(answers,"Тест 2");}
export function scoreOccupation(selected:readonly Code[]):TestScore{
 const raw:unknown=selected;
 assert(Array.isArray(raw)&&raw.length===42,"Тест 3: 42 хос бүрээс яг нэг сонголт шаардлагатай.");
 const scores=emptyScores();
 (raw as unknown[]).forEach((value,index)=>{
  const pair=TEST3_PAIRS[index];
  assert(typeof value==="string"&&pair.includes(value as Code),`Тест 3: ${index+1}-р хосын сонголт тухайн хосын аль нэг код байх ёстой.`);
  scores[value as Code]+=1;
 });
 const result=rank(scores,42);
 const max=result.ranked[0].score;
 const tied=result.ranked.filter(x=>x.score===max).length>1;
 return {...result,tieLabel:tied?"Тэнцсэн":"Тэнцээгүй"};
}
export function scoreAll(input:{interest:readonly number[];ability:readonly number[];occupation:readonly Code[]}):ThreeTests{
 return {interest:scoreInterest(input.interest),ability:scoreAbility(input.ability),occupation:scoreOccupation(input.occupation)};
}
export type Step4Case="THREE_WAY_OVERLAP"|"INTEREST_ABILITY_OVERLAP"|"THREE_WAY_DIVERGENCE";
export type Step4Result={
 case:Step4Case;
 interest:Code[];ability:Code[];occupation:Code[];
 commonToAll:Code[];commonInterestAbility:Code[];
 dominantCandidates:Code[];accompanyingCandidates:Code[];
 counselorConfirmationRequired:true;interpretation:string;
};
export function analyzeStep4(t:ThreeTests):Step4Result{
 const i=t.interest.topThree.map(x=>x.code),a=t.ability.topThree.map(x=>x.code),o=t.occupation.topThree.map(x=>x.code);
 const commonToAll=ORDER.filter(x=>i.includes(x)&&a.includes(x)&&o.includes(x));
 const commonIA=ORDER.filter(x=>i.includes(x)&&a.includes(x));
 if(commonToAll.length)return {
  case:"THREE_WAY_OVERLAP",interest:i,ability:a,occupation:o,commonToAll,commonInterestAbility:commonIA,
  dominantCandidates:commonToAll,accompanyingCandidates:[],
  counselorConfirmationRequired:true,
  interpretation:"Гурван давхаргын давхцал байна. Эх материалын дагуу давхцсан хэв шинжүүдээс хамгийн өндөр оноотойг зонхилохоор сонгох ёстой. Онооны хэмжүүрүүд өөр тул автоматаар харьцуулж болохгүй; зөвлөх баталгаажуулна."
 };
 if(commonIA.length)return {
  case:"INTEREST_ABILITY_OVERLAP",interest:i,ability:a,occupation:o,commonToAll,commonInterestAbility:commonIA,
  dominantCandidates:[],accompanyingCandidates:[],counselorConfirmationRequired:true,
  interpretation:"Сонирхол ба чадавх давхцаж, мэргэжлийн сонголт зөрж байна. Мэргэжлийн талаарх мэдлэгээ өргөжүүлж, эцэг эх, багш эсвэл мэргэжлийн зөвлөхтэй ярилцахыг зөвлө."
 };
 return {
  case:"THREE_WAY_DIVERGENCE",interest:i,ability:a,occupation:o,commonToAll,commonInterestAbility:commonIA,
  dominantCandidates:[],accompanyingCandidates:[],counselorConfirmationRequired:true,
  interpretation:"Сонирхол, чадавх, мэргэжлийн хэв шинжүүд зөрж байна. Сонирхол, чадавх, амжилттай хийж чадах ажлын талаар эргэцүүлж, шаардлагатай бол зөвлөгөө ав."
 };
}
