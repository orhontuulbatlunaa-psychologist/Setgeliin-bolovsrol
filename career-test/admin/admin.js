const $ = (s) => document.querySelector(s);
const loginPanel = $("#login-panel");
const dashboard = $("#dashboard");
const loginForm = $("#login-form");

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    const error = new Error(data.error || "Хүсэлт амжилтгүй.");
    error.status = response.status;
    throw error;
  }
  return data;
}
function setLoggedIn(value) {
  loginPanel.hidden = value;
  dashboard.hidden = !value;
  $("#logout").hidden = !value;
}
function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("mn-MN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch { return value; }
}
function createNode(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = String(value);
  return node;
}
function bestCodes(items) {
  return (items || []).map((x) => x.code).join(" · ") || "—";
}
function scoreBreakdown(title, items) {
  const section = createNode("section", "score-breakdown");
  section.append(createNode("h3", "", title));
  const list = createNode("div", "score-breakdown-list");
  (items || []).forEach((item) => {
    const line = createNode("div", "score-breakdown-row");
    const name = createNode("span", "score-breakdown-name", item.code + " · " + item.short);
    const track = createNode("span", "score-breakdown-track");
    const fill = createNode("span", "score-breakdown-fill");
    fill.style.width = (item.max ? Math.max(0, Math.min(100, item.score / item.max * 100)) : 0) + "%";
    fill.style.background = item.color;
    track.append(fill);
    const value = createNode("b", "score-breakdown-value", item.score + "/" + item.max);
    line.append(name, track, value);
    list.append(line);
  });
  section.append(list);
  return section;
}
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#login-error").textContent = "";
  try {
    await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password: $("#admin-password").value }) });
    $("#admin-password").value = "";
    setLoggedIn(true);
    await loadSubmissions();
  } catch (error) {
    $("#login-error").textContent = error.message;
  }
});
$("#logout").addEventListener("click", async () => {
  try { await api("/api/admin/logout", { method: "POST", body: "{}" }); } catch {}
  setLoggedIn(false);
});
$("#refresh").addEventListener("click", loadSubmissions);
$("#status-filter").addEventListener("change", loadSubmissions);

function createCard(row) {
  const card = createNode("article", "submission");
  const head = createNode("div", "submission-head");
  const left = document.createElement("div");
  left.append(
    createNode("h2", "", row.full_name),
    createNode("p", "", row.grade + "-р анги · " + row.group_name + " бүлэг · " + row.email + (row.phone ? " · " + row.phone : "")),
    createNode("div", "code", row.submission_code + " · " + formatDate(row.created_at))
  );
  const badge = createNode("span", "status", row.review_status + " · " + row.email_status);
  head.append(left, badge);
  card.append(head);

  const scores = createNode("div", "scores");
  const tops = row.results && row.results.tops ? row.results.tops : {};
  [["Сонирхол","interest"],["Чадавх","ability"],["Хэв шинж","profile"]].forEach(([label,key]) => {
    const box = createNode("div", "score");
    box.append(createNode("b", "", label), createNode("span", "", bestCodes(tops[key])));
    scores.append(box);
  });
  card.append(scores);

  const breakdown = createNode("details", "score-details");
  const summary = createNode("summary", "", "Онооны дэлгэрэнгүйг харах");
  breakdown.append(summary);
  breakdown.append(
    scoreBreakdown("Тест №1 · Сонирхол (бүлэг тус бүр 18 хүртэл)", row.results?.interest),
    scoreBreakdown("Тест №2 · Чадавх (бүлэг тус бүр 18 хүртэл)", row.results?.ability),
    scoreBreakdown("Тест №3 · Хэв шинж (сонголтын тоо / 42)", row.results?.profile)
  );

  const overall = createNode("div", "overall-profile");
  const general = row.results?.generalProfile || {};
  overall.append(
    createNode("b", "", "Нэгдсэн хэв шинж"),
    createNode("p", "", "Зонхилох: " + bestCodes((general.dominant || []).map((code) => ({code}))) ),
    createNode("p", "", "Дагалдах: " + bestCodes((general.secondary || []).map((code) => ({code}))) )
  );
  const frequency = createNode("div", "frequency-list");
  (row.results?.comparison || []).forEach((item) => {
    const line = createNode("span", "", item.code + " · " + item.appearances + "/3");
    frequency.append(line);
  });
  overall.append(frequency);
  breakdown.append(overall);
  card.append(breakdown);

  if (row.review_note) card.append(createNode("p", "", "Тайлбар: " + row.review_note));

  const actions = createNode("div", "actions");
  if (row.review_status === "pending") {
    const note = document.createElement("textarea");
    note.className = "note";
    note.placeholder = "Админы тэмдэглэл (сонголтоор)";
    note.value = row.review_note || "";
    const reject = createNode("button", "button light", "Буцаах");
    reject.addEventListener("click", () => review(row.id, "reject", note.value));
    const approve = createNode("button", "button primary", "Тайлан илгээхийг зөвшөөрөх");
    approve.addEventListener("click", () => review(row.id, "approve", note.value));
    const hint = createNode("p", "", "Зөвшөөрөхөд PDF тайлан үүсэж, private хадгалалтад орсны дараа сурагчийн бүртгэлтэй и-мэйл рүү хавсралтаар илгээгдэнэ.");
    actions.append(note, reject, approve, hint);
  } else if (row.review_status === "approved" && ["failed","waiting_report"].includes(row.email_status)) {
    const note = document.createElement("textarea");
    note.className = "note";
    note.placeholder = "Дахин илгээх тэмдэглэл (сонголтоор)";
    note.value = row.review_note || "";
    const resend = createNode("button", "button primary", "PDF тайланг дахин илгээх");
    resend.addEventListener("click", () => review(row.id, "resend", note.value));
    actions.append(note, resend, createNode("p", "", "Өмнөх илгээлт амжилтгүй эсвэл хүлээгдэж байгаа тул ижил тайланг дахин үүсгэж илгээнэ."));
  } else if (row.review_status === "approved" && row.email_status === "sent") {
    actions.append(createNode("p", "delivery-success", "PDF тайлан и-мэйлээр амжилттай илгээгдсэн."));
  }
  card.append(actions);
  return card;
}
async function review(id, action, reviewNote) {
  const prompts = {
    approve: "Энэ сурагчийн оноог шалгасан уу? Зөвшөөрвөл PDF тайлан үүсэж, бүртгэлтэй и-мэйл рүү илгээгдэнэ.",
    reject: "Энэ хүсэлтийг буцаах уу? Тайлан илгээгдэхгүй.",
    resend: "PDF тайланг ижил бүртгэлтэй и-мэйл рүү дахин илгээх үү?"
  };
  if (!confirm(prompts[action] || "Үргэлжлүүлэх үү?")) return;
  try {
    await api("/api/admin/review", { method: "POST", body: JSON.stringify({ id, action, reviewNote }) });
    await loadSubmissions();
  } catch (error) {
    $("#dashboard-error").textContent = error.message;
    await loadSubmissions();
  }
}
async function loadSubmissions() {
  $("#dashboard-error").textContent = "";
  $("#submission-list").replaceChildren(createNode("div", "empty", "Хүсэлтүүдийг ачаалж байна…"));
  try {
    const status = $("#status-filter").value;
    const data = await api("/api/admin/submissions?status=" + encodeURIComponent(status));
    const list = $("#submission-list");
    list.replaceChildren(...data.submissions.map(createCard));
    $("#counts").textContent = data.submissions.length + " хүсэлт харуулж байна (сүүлийн 100 хүртэл).";
    if (!data.submissions.length) list.replaceChildren(createNode("div", "empty", "Энэ төлөвт хүсэлт алга байна."));
    setLoggedIn(true);
  } catch (error) {
    if (error.status === 401) { setLoggedIn(false); return; }
    $("#dashboard-error").textContent = error.message;
    $("#submission-list").replaceChildren();
  }
}
loadSubmissions();
