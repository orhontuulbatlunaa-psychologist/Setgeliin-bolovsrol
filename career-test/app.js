import { ASSESSMENT, RI, QUESTION_COUNTS } from "./data.js";
import { calculateAssessmentResults } from "./scoring.js";

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
    description: "Нийт 42 хос буюу 84 мэргэжлийн нэр байна. Хос бүрийн хоёр мэргэжлээс танд арай илүү ойр санагдаж буй нэгийг сонгоно. Хоёулаа таалагдахгүй байсан ч арай дээр гэж үзсэн нэгийг сонгох эх зааврыг баримтална. Нэг хос = нэг хариулт."
  }
};
const answers = { interest: {}, ability: {}, profile: {} };
let student = null;
let currentSection = "interest";
let latestPayload = null;
let requestId = null;
let isSubmitting = false;

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
      const available = scale;
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
  requestId = window.crypto.randomUUID();
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
    const distinctScores = [...new Set(item.scores.map((score) => score.score))].sort((a, b) => b - a);
    const markers = item.scores.map((score, i) => {
      const p = point(i, score.max ? Math.max(0, Math.min(1, score.score / score.max)) : 0);
      const rank = distinctScores.indexOf(score.score) + 1;
      const markerRadius = rank === 1 ? 8 : rank === 2 ? 6 : rank === 3 ? 4.2 : 2.3;
      const markerTitle = `${score.code}: ${score.score}/${score.max} оноо; ${rank <= 3 ? `${rank}-р өндөр онооны түвшин` : "бусад оноо"}`;
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${markerRadius}" fill="${item.color}" stroke="#ffffff" stroke-width="1.2"><title>${esc(markerTitle)}</title></circle>`;
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
    <p class="radar-hint">Хамгийн өндөр гурван өөр онооны түвшнийг томоос жижиг дугуйгаар тэмдэглэв. Тэнцсэн оноо ижил хэмжээтэй; бусад хэв шинж жижиг цэгээр харагдана.</p>
  </div>`;
}

function buildResults() {
  return {
    ...calculateAssessmentResults(ASSESSMENT, answers),
    sourceReview: ASSESSMENT.sourceReview,
    responseCount: totalAnswered()
  };
}
async function showResults() {
  if (!isComplete()) {
    alert("Нийт 114 хариулт бүрэн бөглөгдөөгүй байна. Дутуу хэсгүүдийг шалгана уу.");
    return;
  }
  if (isSubmitting) return;
  isSubmitting = true;
  const finishButton = $("#finish-test");
  const originalLabel = finishButton.textContent;
  finishButton.disabled = true;
  finishButton.textContent = "Хариулт илгээж байна…";
  $("#results-warning").textContent = "";
  try {
    const response = await fetch("/api/assessment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        requestId,
        student,
        answers: structuredClone(answers)
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = Array.isArray(data.details) && data.details.length
        ? " " + data.details.slice(0, 3).join(" ")
        : "";
      throw new Error((data.error || "Тестийг илгээж чадсангүй.") + detail);
    }
    latestPayload = {
      submissionCode: data.submissionCode,
      status: data.status,
      receivedAt: new Date().toISOString()
    };
    testArea.hidden = true;
    resultsArea.hidden = false;
    $("#results-title").textContent = "Таны хариултыг хүлээн авлаа";
    const warning = $("#results-warning");
    warning.className = "submission-receipt";
    warning.textContent = "Тестийн хариулт амжилттай бүртгэгдлээ. Бүртгэлийн дугаар: " + data.submissionCode +
      ". Манай баг оноо, тайланг хянаж зөвшөөрсний дараа таны бүртгүүлсэн " + student.email +
      " хаяг руу дэлгэрэнгүй PDF тайлан илгээнэ.";
    $("#results-content").innerHTML =
      '<div class="student-summary">' +
      '<span><b>' + esc(student.fullName) + '</b></span>' +
      '<span>' + esc(student.grade) + '-р анги, ' + esc(student.group) + ' бүлэг</span>' +
      '<span>' + esc(student.email) + '</span>' +
      '</div><p class="section-description">Энэ хуудсанд онооны тайланг харуулахгүй. Тайланг зөвхөн админы хяналт, зөвшөөрлийн дараа и-мэйлээр илгээнэ.</p>';
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    alert(error.message);
    finishButton.disabled = false;
    finishButton.textContent = originalLabel;
  } finally {
    isSubmitting = false;
  }
}
$("#finish-test").addEventListener("click", showResults);

$("#restart").addEventListener("click", () => {
  if (!confirm("Одоогийн бөглөсөн хариултыг энэ дэлгэцээс арилгаж, шинээр эхлүүлэх үү?")) return;
  for (const section of sections) answers[section] = {};
  student = null;
  latestPayload = null;
  requestId = null;
  form.reset();
  resultsArea.hidden = true;
  registration.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});
