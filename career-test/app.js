import { ASSESSMENT, RI, QUESTION_COUNTS } from "./data.js";

const $ = (selector) => document.querySelector(selector);
const registration = $("#registration");
const testArea = $("#test-area");
const resultsArea = $("#results-area");
const form = $("#registration-form");
const questionsEl = $("#questions");
const sections = ["interest", "ability", "profile"];
const sectionInfo = {
  interest: {
    title: "Тест №1. Миний мэргэжилд чиглэсэн хүсэл сонирхол",
    description: "Асуулт бүрийг уншаад таны хүсэл сонирхолд хамгийн ойр хариултын оноог сонгоно уу. Нэг асуултад нэг л хариулт сонгоно."
  },
  ability: {
    title: "Тест №2. Би юу чаддаг вэ?",
    description: "Асуулт бүр таны өөрийн үнэлсэн чадавхийн тухай. Өөрийн бодит мэдрэмжид нийцэх нэг хариултыг сонгоно уу."
  },
  profile: {
    title: "Тест №3. Миний мэргэжлийн хэв шинж",
    description: "Хос мэргэжил бүрээс танд арай илүү ойр санагдаж буй нэгийг сонгоно уу. Хоёулаа таалагдахгүй байсан ч харьцуулахад арай ойр нэгийг сонгох тухай эх зааврыг баримтална."
  }
};
const answers = { interest: {}, ability: {}, profile: {} };
let student = null;
let currentSection = "interest";
let latestPayload = null;

$("#year").textContent = new Date().getFullYear();

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}
function totalAnswered() {
  return sections.reduce((n, key) => n + Object.keys(answers[key]).length, 0);
}
function updateProgress() {
  const count = totalAnswered();
  $("#answered-count").textContent = count;
  $("#progress-fill").style.width = (count / 114 * 100) + "%";
  document.querySelectorAll(".step").forEach((button) => {
    const key = button.dataset.section;
    button.classList.toggle("active", key === currentSection);
    const index = sections.indexOf(key);
    button.classList.toggle("done", sections.slice(0, index + 1).every((section) => (
      Object.keys(answers[section]).length === QUESTION_COUNTS[section]
    )));
  });
}
function questionKey(groupIndex, questionIndex) {
  return String(groupIndex + 1) + "-" + String(questionIndex + 1);
}
function renderRatingSection(section) {
  const groups = section === "interest" ? ASSESSMENT.interestGroups : ASSESSMENT.abilityGroups;
  const scale = ASSESSMENT.scales[section];
  return groups.map((group, gi) => {
    const label = RI[gi];
    const cards = group.map((question, qi) => {
      const key = questionKey(gi, qi);
      const isReviewQuestion = section === "interest" && gi === 0 && (qi === 3 || qi === 5);
      // The source Word table has only 0, 1, 2 in these two cells; do not silently add 3.
      const available = isReviewQuestion ? scale.filter((x) => x.value <= 2) : scale;
      const options = available.map((option) => {
        const selected = answers[section][key] === option.value;
        return `<button type="button" class="scale-option ${selected ? "selected" : ""}" data-kind="${section}" data-key="${key}" data-value="${option.value}" aria-pressed="${selected}">
          <strong>${option.value}</strong><span>${esc(option.label)}</span>
        </button>`;
      }).join("");
      return `<article class="question-card">
        <p><span class="question-number">${section === "interest" ? "С" : "Ч"}${gi + 1}.${qi + 1}</span>${esc(question)}</p>
        <div class="scale-options">${options}</div>
      </article>`;
    }).join("");
    return `<section class="question-group">
      <h2 class="group-heading"><i class="group-dot" style="background:${label.color}"></i>${label.label}</h2>
      ${cards}
    </section>`;
  }).join("");
}
function renderProfileSection() {
  return ASSESSMENT.profilePairs.map((pair, index) => {
    const selected = answers.profile[String(index)];
    const options = pair.map((option, optionIndex) => {
      const code = option[0];
      const type = RI[code - 1];
      const active = selected === optionIndex;
      return `<button type="button" class="profile-option ${active ? "selected" : ""}" data-kind="profile" data-key="${index}" data-value="${optionIndex}" aria-pressed="${active}">
        <strong>${esc(option[1])}</strong>
        <small><i class="group-dot" style="background:${type.color}"></i> ${type.label}</small>
      </button>`;
    }).join("");
    return `<article class="question-card">
      <p><span class="question-number">Х${index + 1}.</span>Аль мэргэжил танд арай илүү ойр санагдаж байна вэ?</p>
      <div class="profile-options">${options}</div>
    </article>`;
  }).join("");
}
function renderSection() {
  $("#test-title").textContent = sectionInfo[currentSection].title;
  $("#section-description").textContent = sectionInfo[currentSection].description;
  questionsEl.innerHTML = currentSection === "profile"
    ? renderProfileSection()
    : renderRatingSection(currentSection);
  const index = sections.indexOf(currentSection);
  $("#previous-section").disabled = index === 0;
  $("#previous-section").style.opacity = index === 0 ? ".45" : "1";
  $("#next-section").hidden = index === sections.length - 1;
  $("#finish-test").hidden = index !== sections.length - 1;
  updateProgress();
}
function isComplete() {
  return totalAnswered() === 114 &&
    Object.keys(answers.interest).length === 36 &&
    Object.keys(answers.ability).length === 36 &&
    Object.keys(answers.profile).length === 42;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fd = new FormData(form);
  student = {
    fullName: String(fd.get("fullName")).trim(),
    grade: String(fd.get("grade")),
    group: String(fd.get("group")).trim(),
    email: String(fd.get("email")).trim(),
    phone: String(fd.get("phone") || "").trim(),
    consent: fd.get("consent") === "on",
    registeredAt: new Date().toISOString()
  };
  registration.hidden = true;
  testArea.hidden = false;
  currentSection = "interest";
  renderSection();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

questionsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-kind]");
  if (!button) return;
  const { kind, key, value } = button.dataset;
  answers[kind][key] = Number(value);
  renderSection();
  updateProgress();
});

document.querySelectorAll(".step").forEach((button) => {
  button.addEventListener("click", () => {
    currentSection = button.dataset.section;
    renderSection();
    window.scrollTo({ top: testArea.offsetTop - 12, behavior: "smooth" });
  });
});
$("#previous-section").addEventListener("click", () => {
  const index = sections.indexOf(currentSection);
  if (index > 0) currentSection = sections[index - 1];
  renderSection();
  window.scrollTo({ top: testArea.offsetTop - 12, behavior: "smooth" });
});
$("#next-section").addEventListener("click", () => {
  const missing = missingInSection(currentSection);
  if (missing.length) {
    alert("Энэ хэсэгт " + missing.length + " хариулт дутуу байна. Бүх асуултад хариулна уу.");
    return;
  }
  currentSection = sections[sections.indexOf(currentSection) + 1];
  renderSection();
  window.scrollTo({ top: testArea.offsetTop - 12, behavior: "smooth" });
});
function missingInSection(section) {
  const expected = QUESTION_COUNTS[section];
  return expected - Object.keys(answers[section]).length;
}

function makeScores(section) {
  if (section === "profile") {
    const scores = RI.map((type, index) => ({
      ...type,
      score: Object.entries(answers.profile).reduce((sum, [pairIndex, choice]) => {
        return sum + (ASSESSMENT.profilePairs[Number(pairIndex)][choice][0] === index + 1 ? 1 : 0);
      }, 0),
      max: 42
    }));
    return scores;
  }
  const groups = section === "interest" ? ASSESSMENT.interestGroups : ASSESSMENT.abilityGroups;
  return groups.map((items, gi) => {
    let score = 0;
    let max = 0;
    items.forEach((_, qi) => {
      const key = questionKey(gi, qi);
      const allowed = section === "interest" && gi === 0 && (qi === 3 || qi === 5) ? [0,1,2] : [0,1,2,3];
      score += Number(answers[section][key] ?? 0);
      max += Math.max(...allowed);
    });
    return { ...RI[gi], score, max };
  });
}
function topThree(scores) {
  const sorted = [...scores].sort((a,b) => b.score - a.score);
  const cut = sorted[Math.min(2, sorted.length - 1)]?.score ?? -1;
  return sorted.filter((item) => item.score >= cut);
}
function renderScores(title, scores) {
  const rows = scores.map((item) => `<div class="score-row">
    <span class="score-name">${item.code} · ${item.short}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${item.max ? (item.score / item.max * 100) : 0}%;background:${item.color}"></div></div>
    <span class="score-value">${item.score}/${item.max}</span>
  </div>`).join("");
  return `<section class="result-section"><h2>${title}</h2>${renderRadar(title, [{label:title, scores, color:"#327c79"}])}${rows}</section>`;
}
function renderRadar(title, series) {
  const center = { x: 260, y: 190 };
  const radius = 122;
  const axisAngle = (index) => (-90 + index * 60) * Math.PI / 180;
  const point = (index, fraction) => ({
    x: center.x + Math.cos(axisAngle(index)) * radius * fraction,
    y: center.y + Math.sin(axisAngle(index)) * radius * fraction
  });
  const rings = [0.25, 0.5, 0.75, 1].map((fraction) => {
    const pts = RI.map((_, i) => {
      const p = point(i, fraction);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${pts}" class="radar-grid"></polygon>`;
  }).join("");
  const axes = RI.map((_, i) => {
    const p = point(i, 1);
    return `<line x1="${center.x}" y1="${center.y}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" class="radar-axis"></line>`;
  }).join("");
  const labels = RI.map((type, i) => {
    const p = point(i, 1.28);
    const anchor = p.x < center.x - 12 ? "end" : (p.x > center.x + 12 ? "start" : "middle");
    return `<text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(1)}" text-anchor="${anchor}" class="radar-label">${type.code}</text>`;
  }).join("");
  const plots = series.map((item) => {
    const pts = item.scores.map((score, i) => {
      const p = point(i, score.max ? Math.max(0, Math.min(1, score.score / score.max)) : 0);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
    const markers = item.scores.map((score, i) => {
      const p = point(i, score.max ? Math.max(0, Math.min(1, score.score / score.max)) : 0);
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.3" fill="${item.color}"></circle>`;
    }).join("");
    return `<polygon points="${pts}" fill="${item.color}" fill-opacity=".16" stroke="${item.color}" stroke-width="3" stroke-linejoin="round"></polygon>${markers}`;
  }).join("");
  const legend = series.map((item) => `<span class="radar-legend-item"><i style="background:${item.color}"></i>${esc(item.label)}</span>`).join("");
  return `<div class="radar-wrap">
    <svg class="radar-chart" viewBox="0 0 520 390" role="img" aria-label="${esc(title)} — RIASEC зургаан хэв шинжийн радарын график">
      <g>${rings}${axes}${plots}</g>
      <circle cx="${center.x}" cy="${center.y}" r="3" fill="#71827f"></circle>
      ${labels}
    </svg>
    <div class="radar-legend">${legend}</div>
    <div class="radar-types">${RI.map((type) => `<span><b>${type.code}</b> ${type.short}</span>`).join("")}</div>
    <p class="radar-hint">Тэнхлэг бүрийн утгыг тухайн үнэлгээний боломжит дээд оноонд харьцуулан дүрсэлсэн.</p>
  </div>`;
}

function buildResults() {
  const interest = makeScores("interest");
  const ability = makeScores("ability");
  const profile = makeScores("profile");
  const tops = {
    interest: topThree(interest).map((x) => x.code),
    ability: topThree(ability).map((x) => x.code),
    profile: topThree(profile).map((x) => x.code)
  };
  const comparison = RI.map((type) => ({
    ...type,
    appearances: [tops.interest, tops.ability, tops.profile].filter((list) => list.includes(type.code)).length
  })).sort((a,b) => b.appearances - a.appearances);
  return {
    interest, ability, profile, tops, comparison,
    sourceReview: ASSESSMENT.sourceReview,
    responseCount: totalAnswered()
  };
}
function showResults() {
  if (!isComplete()) {
    alert("Нийт 114 хариулт бүрэн бөглөгдөөгүй байна. Дутуу хэсгүүдийг шалгана уу.");
    return;
  }
  latestPayload = {
    student,
    assessmentVersion: ASSESSMENT.schemaVersion,
    submittedAt: new Date().toISOString(),
    answers: structuredClone(answers),
    results: buildResults()
  };
  testArea.hidden = true;
  resultsArea.hidden = false;
  const warning = $("#results-warning");
  warning.innerHTML = `<strong>Эх материалын хяналт шаардлагатай.</strong> ${esc(ASSESSMENT.sourceReview.note)}<br><br>Энэ нь хөгжүүлэлтийн туршилтын хувилбар: хариулт серверт хадгалагдаагүй, админы зөвшөөрөл болон PDF/и-мэйл илгээлт холбогдоогүй. Энэ дэлгэцийн дүнг эцсийн мэргэжлийн тайлан гэж ашиглахгүй.`;
  const { results } = latestPayload;
  const shared = results.comparison.filter((x) => x.appearances === 3).map((x) => x.code);
  const summary = `<div class="student-summary">
    <span><b>${esc(student.fullName)}</b></span>
    <span>${esc(student.grade)}-р анги, ${esc(student.group)} бүлэг</span>
    <span>${esc(student.email)}</span>
  </div>`;
  const comparisonRows = results.comparison.map((item) => `<div class="score-row">
    <span class="score-name">${item.code} · ${item.short}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${item.appearances / 3 * 100}%;background:${item.color}"></div></div>
    <span class="score-value">${item.appearances}/3</span>
  </div>`).join("");
  $("#results-content").innerHTML = summary +
    renderScores("Тест №1 · Мэргэжилд чиглэсэн хүсэл сонирхол", results.interest) +
    renderScores("Тест №2 · Өөрийн үнэлсэн чадавх", results.ability) +
    renderScores("Тест №3 · Мэргэжлийн хэв шинж", results.profile) +
    renderRadar("Гурван үнэлгээний харьцуулалт", [
      { label: "Сонирхол", scores: results.interest, color: "#327c79" },
      { label: "Чадавх", scores: results.ability, color: "#D18A56" },
      { label: "Хэв шинж", scores: results.profile, color: "#738CC7" }
    ]) +
    `<section class="result-section"><h2>Гурван үнэлгээний харьцуулалт</h2>
      <p class="section-description">Энэ зураглал нь хэв шинж бүр гурван үнэлгээний эхний гуравт хэдэн удаа орсныг харуулна. Эх аргачлалд гурван үнэлгээг нэг тоон оноонд нэгтгэх жин, томьёо заагаагүй тул нийлмэл оноо зохиож тооцоогүй.</p>
      ${comparisonRows}
      <p class="section-description">${shared.length ? "Гурван үнэлгээнд нийтлэг эхний гуравт орсон хэв шинж: " + shared.join(", ") : "Гурван үнэлгээнд ижил эхний хэв шинж давхцаагүй байна."} Энэ ажиглалтыг эцсийн зөвлөмж болгохын өмнө мэргэжилтэн тайлбарлана.</p>
    </section>`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$("#finish-test").addEventListener("click", showResults);

$("#export-json").addEventListener("click", () => {
  if (!latestPayload) return;
  const blob = new Blob([JSON.stringify(latestPayload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "riasec-test-response.json";
  anchor.click();
  URL.revokeObjectURL(url);
});
$("#restart").addEventListener("click", () => {
  if (!confirm("Одоогийн бөглөсөн хариултыг энэ дэлгэцээс арилгаж, шинээр эхлүүлэх үү?")) return;
  for (const section of sections) answers[section] = {};
  student = null;
  latestPayload = null;
  form.reset();
  resultsArea.hidden = true;
  registration.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});
