import { RI } from "./data.js";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);

const TYPE_COPY = {
  R: {
    title: "Бодит үйл ажиллагааг эрхэмлэгч",
    description: "Бодит зүйл хийж бүтээх, машин техник ашиглах, засварлах, угсрах, барих, байгаль болон биет орчинтой ажиллахад сонирхолтой чиглэл.",
    qualities: "Гарын ур дүй, орон зайн төсөөлөл, бодит асуудлыг шийдэх, шууд үр дүн гаргах чадвар.",
    sourceCareers: ["Механик инженер", "Мехатроник инженер", "Цахилгааны инженер", "Компьютерийн сүлжээний инженер", "Нарны эрчим хүчний инженер", "Хүнсний технологич", "Барилгын техникч", "Аврагч-гал сөнөөгч"],
    modern: ["Мехатроник инженер", "Нарны эрчим хүчний инженер", "Компьютерийн сүлжээний инженер"]
  },
  I: {
    title: "Судлаач, шинжээч",
    description: "Үзэгдэл, юмсын учир шалтгаан, холбоо хамаарлыг шинжлэх, нотолгоонд тулгуурлан асуудал шийдэх, шинэ мэдлэг бүтээхэд татагдах чиглэл.",
    qualities: "Ажиглалт, судалгаа, логик сэтгэлгээ, бие даан төвлөрөх, баримтад тулгуурлах.",
    sourceCareers: ["Биологич", "Сэтгэл судлаач", "Экологич", "Статистикч", "Бизнесийн аналист", "Биотехнологич инженер", "Мэдээлэл хамгааллын инженер", "Программист"],
    modern: ["Биотехнологич инженер", "Мэдээлэл хамгааллын инженер", "Программист", "Нанотехнологич"]
  },
  A: {
    title: "Уран сайхны",
    description: "Уран сэтгэмж, бүтээлч шийдэл, гоо зүй, өөрийгөө өвөрмөц байдлаар илэрхийлэх боломжтой үйл ажиллагаанд сонирхолтой чиглэл.",
    qualities: "Бүтээлч сэтгэлгээ, дүрслэл төсөөлөл, гоо зүйн мэдрэмж, уян хатан байдал.",
    sourceCareers: ["Архитектор", "График дизайнер", "Веб дизайнер", "Мультимедиа дизайнер", "Кино найруулагч", "Хөгжмийн зохиолч", "Фото зурагчин", "Загвар зохион бүтээгч"],
    modern: ["Веб дизайнер", "График дизайнер", "Мультимедиа дизайнер", "Клип майкер"]
  },
  S: {
    title: "Нийгмийн",
    description: "Хүмүүстэй харилцах, ойлголцох, зааж сургах, зөвлөх, туслах, хамтран ажиллахад утга учир олдог чиглэл.",
    qualities: "Бусдыг ойлгох, сонсох, дэмжих, тайлбарлан сургах, хамтын ажиллагаа, хариуцлага.",
    sourceCareers: ["Сургуулийн сэтгэл зүйч", "Сэтгэл зүйч", "Нийгмийн ажилтан", "Мэргэжил сонголтын зөвлөх", "Багш", "Сургалтын менежер", "Хөдөлмөр эрхлэлтийн мэргэжилтэн", "Сувилагч"],
    modern: ["Сургуулийн сэтгэл зүйч", "Мэргэжил сонголтын зөвлөх", "Хөдөлмөр эрхлэлтийн мэргэжилтэн"]
  },
  E: {
    title: "Ажил хэрэгч",
    description: "Зорилго тавих, санаачилга гаргах, бусдыг зохион байгуулах, шийдвэр гаргах, бизнес болон үйлчилгээний үр дүнд хүрэхэд сонирхолтой чиглэл.",
    qualities: "Манлайлал, харилцаа, шийдвэр гаргалт, зохион байгуулалт, үр дүнд чиглэх.",
    sourceCareers: ["Бизнес эрхлэгч", "Маркетингийн менежер", "Төслийн менежер", "Борлуулалтын менежер", "Зах зээл судлаач", "Бизнесийн хөгжлийн менежер", "Санхүүгийн менежер", "Ухаалаг тээврийн системийн менежер"],
    modern: ["Бизнесийн аналист", "Бизнесийн хөгжлийн менежер", "Ухаалаг тээврийн системийн менежер"]
  },
  C: {
    title: "Стандартыг баримтлагч",
    description: "Тодорхой журам, стандартын дагуу нягт нямбай ажиллах, мэдээлэл боловсруулах, тооцоолох, бүртгэх, хянахад илүү ойр чиглэл.",
    qualities: "Нарийвчлал, эмх цэгц, тооцоолол, бүртгэл, тогтвортой ажиллах, заавар журмыг мөрдөх.",
    sourceCareers: ["Нягтлан бодогч", "Аудитор", "Актуарч", "Статистикч", "Нотариатч", "Даатгалын мэргэжилтэн", "Эм найруулагч", "Лаборант"],
    modern: ["Актуарч", "Статистикч", "Өгөгдөл боловсруулах, хяналтын чиглэлийн мэргэжилтэн"]
  }
};

const getType = (code) => RI.find((type) => type.code === code);
const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "long", day: "numeric" }).format(date);
};
const nameFor = (codes) => (codes || []).map((code) => {
  const type = getType(code);
  return type ? type.title : code;
}).join(", ") || "Тодорхойлоогүй";

function radarSvg(title, scores, key) {
  const width = 520;
  const height = 390;
  const center = { x: 260, y: 184 };
  const radius = 123;
  const angle = (index) => (-90 + index * 60) * Math.PI / 180;
  const point = (index, fraction) => ({
    x: center.x + Math.cos(angle(index)) * radius * fraction,
    y: center.y + Math.sin(angle(index)) * radius * fraction
  });
  const rings = [0.25, 0.5, 0.75, 1].map((fraction) => {
    const points = RI.map((_, index) => {
      const p = point(index, fraction);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${points}" fill="none" stroke="#dbe7e2" stroke-width="1.1"/>`;
  }).join("");
  const axes = RI.map((_, index) => {
    const p = point(index, 1);
    return `<line x1="${center.x}" y1="${center.y}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="#dbe7e2" stroke-width="1"/>`;
  }).join("");
  const normalized = RI.map((type) => scores.find((item) => item.code === type.code) || { ...type, score: 0, max: 18 });
  const values = normalized.map((item) => Math.max(0, Math.min(1, item.score / (item.max || 1))));
  const polygon = values.map((fraction, index) => {
    const p = point(index, fraction);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
  const distinct = [...new Set(normalized.map((item) => item.score))].sort((a, b) => b - a);
  const markers = normalized.map((item, index) => {
    const p = point(index, values[index]);
    const rank = distinct.indexOf(item.score) + 1;
    const r = rank === 1 ? 8 : rank === 2 ? 6.2 : rank === 3 ? 4.6 : 2.8;
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${r}" fill="${item.color}" stroke="#fff" stroke-width="1.4"><title>${esc(item.code + " · " + item.score + "/" + item.max)}</title></circle>`;
  }).join("");
  const labels = RI.map((type, index) => {
    const p = point(index, 1.27);
    const anchor = p.x < center.x - 10 ? "end" : (p.x > center.x + 10 ? "start" : "middle");
    return `<text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(1)}" text-anchor="${anchor}" font-size="13" font-weight="800" fill="${type.color}">${type.code}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" class="radar" role="img" aria-label="${esc(title)} RIASEC зургаан өнцөгтийн график">
    ${rings}${axes}
    <polygon points="${polygon}" fill="#6fae9f" fill-opacity=".16" stroke="#327c79" stroke-width="3" stroke-linejoin="round"/>
    ${markers}${labels}
    <circle cx="${center.x}" cy="${center.y}" r="2.5" fill="#52736c"/>
  </svg>`;
}

function integratedSvg(results) {
  const center = { x: 250, y: 168 };
  const radius = 100;
  const angle = (index) => (-90 + index * 60) * Math.PI / 180;
  const point = (index, fraction, level) => {
    const pRadius = radius * level * fraction;
    return { x: center.x + Math.cos(angle(index)) * pRadius, y: center.y + Math.sin(angle(index)) * pRadius };
  };
  const rings = [0.34, 0.67, 1].map((fraction) => {
    const points = RI.map((_, index) => {
      const p = point(index, 1, fraction);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${points}" fill="none" stroke="#dce7e3" stroke-width="1.2"/>`;
  }).join("");
  const axes = RI.map((_, index) => {
    const p = point(index, 1, 1);
    return `<line x1="${center.x}" y1="${center.y}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="#e0e9e5"/>`;
  }).join("");
  const layers = [
    { key: "interest", level: 0.34, color: "#327c79" },
    { key: "ability", level: 0.67, color: "#d18a56" },
    { key: "profile", level: 1, color: "#ad79b4" }
  ];
  const shapes = layers.map((layer) => {
    const items = results[layer.key] || [];
    const points = RI.map((type, index) => {
      const item = items.find((score) => score.code === type.code);
      const fraction = Math.max(0, Math.min(1, item ? item.score / (item.max || 1) : 0));
      const p = point(index, fraction, layer.level);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
    const dots = RI.map((type, index) => {
      const item = items.find((score) => score.code === type.code);
      const fraction = Math.max(0, Math.min(1, item ? item.score / (item.max || 1) : 0));
      const p = point(index, fraction, layer.level);
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.2" fill="${layer.color}" stroke="#fff" stroke-width="1"/>`;
    }).join("");
    return `<polygon points="${points}" fill="${layer.color}" fill-opacity=".12" stroke="${layer.color}" stroke-width="2.2" stroke-linejoin="round"/>${dots}`;
  }).join("");
  const labels = RI.map((type, index) => {
    const p = point(index, 1, 1.24);
    const anchor = p.x < center.x - 10 ? "end" : (p.x > center.x + 10 ? "start" : "middle");
    return `<text x="${p.x.toFixed(1)}" y="${(p.y + 4).toFixed(1)}" text-anchor="${anchor}" font-size="12" font-weight="800" fill="${type.color}">${type.code}</text>`;
  }).join("");
  return `<svg viewBox="0 0 500 340" class="integrated-chart" role="img" aria-label="Сонирхол, чадавх, мэргэжлийн хэв шинжийн гурван давхар харьцуулалт">
    ${rings}${axes}${shapes}${labels}<circle cx="${center.x}" cy="${center.y}" r="2" fill="#647a74"/>
  </svg>`;
}

function scoreRows(scores, sectionKey) {
  const ordered = [...scores].sort((a, b) => b.score - a.score);
  const distinct = [...new Set(ordered.map((item) => item.score))];
  return ordered.map((item) => {
    const rank = distinct.indexOf(item.score) + 1;
    const width = item.max ? Math.max(0, Math.min(100, item.score / item.max * 100)) : 0;
    return `<div class="score-row">
      <div class="score-name"><span class="type-code" style="--type:${item.color}">${item.code}</span><span>${esc(TYPE_COPY[item.code]?.title || item.short)}</span></div>
      <div class="score-track"><i style="width:${width}%;background:${item.color}"></i></div>
      <div class="score-value">${item.score}<small>/ ${item.max}</small></div>
      <div class="score-rank">${rank <= 3 ? (rank === 1 ? "I" : rank === 2 ? "II" : "III") : ""}</div>
    </div>`;
  }).join("");
}

function pageHeader(kicker, title, lead = "") {
  return `<div class="page-head"><div class="eyebrow">${esc(kicker)}</div><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ""}</div>`;
}

function footer(page, code) {
  return `<div class="page-footer"><span>СЭТГЭЛИЙН БОЛОВСРОЛ · ХОЛЛАНД RIASEC</span><span>${esc(code)} · ${page}</span></div>`;
}

function page(inner, pageNo, code, extra = "") {
  return `<section class="page ${extra}">${inner}${footer(pageNo, code)}</section>`;
}

function typeCards(codes) {
  return codes.map((code) => {
    const type = getType(code);
    const info = TYPE_COPY[code];
    if (!type || !info) return "";
    return `<article class="type-card" style="--type:${type.color}">
      <div class="type-card-top"><span class="type-code">${code}</span><h3>${esc(info.title)}</h3></div>
      <p>${esc(info.description)}</p>
      <div class="quality"><b>Давуу тал байж болох чиглэл</b><span>${esc(info.qualities)}</span></div>
    </article>`;
  }).join("");
}

function careerCards(codes) {
  return codes.map((code, index) => {
    const type = getType(code);
    const info = TYPE_COPY[code];
    if (!type || !info) return "";
    const modernSet = new Set(info.modern);
    const careerList = info.sourceCareers.map((career) => `<li>${esc(career)}${modernSet.has(career) ? '<em>технологи, шинэчлэлтэй холбоотой жишээ</em>' : ""}</li>`).join("");
    return `<article class="career-card" style="--type:${type.color}">
      <div class="career-card-head"><span class="type-code">${code}</span><div><small>${index < 2 ? "ЗОНХИЛОХ ЧИГЛЭЛ" : "ДАГАЛДАХ ЧИГЛЭЛ"}</small><h3>${esc(info.title)}</h3></div></div>
      <p>${esc(info.description)}</p>
      <b class="mini-label">Эх аргачлалын мэргэжлийн жагсаалтаас жишээ</b>
      <ul>${careerList}</ul>
      <div class="career-note">Эдгээр нь судалж үзэх жишээ болохоос таны заавал сонгох мэргэжил биш. Мэргэжил бүрийн сургалтын агуулга, бодит ажлын орчин, шаардлагыг нэмж нягтлаарай.</div>
    </article>`;
  }).join("");
}

function commonCodes(results) {
  const comparison = results.profileComparison || {};
  return comparison.commonAcrossAll || [];
}

export function buildReportHtml({ student, results, submissionCode, logoDataUri = "", generatedAt = new Date().toISOString() }) {
  const name = esc(student.fullName || "Сурагч");
  const grade = esc(student.grade || "");
  const group = esc(student.group || "");
  const code = submissionCode || "SB-REPORT";
  const interestTop = results.tops?.interest || [];
  const abilityTop = results.tops?.ability || [];
  const profileTop = results.tops?.profile || [];
  const general = results.generalProfile || {};
  const comparison = results.comparison || [];
  const dominantCodes = general.dominant || [];
  const secondaryCodes = general.secondary || [];
  const overallCodes = general.ranked || [];
  const overviewCodes = [...dominantCodes, ...secondaryCodes];
  const dateText = formatDate(generatedAt);
  const dominantText = nameFor(dominantCodes);
  const secondaryText = nameFor(secondaryCodes);
  const common = commonCodes(results);
  const profileComparison = results.profileComparison || {};
  const patternText = profileComparison.narrative || "Гурван үнэлгээний үр дүнг харьцуулж, давхцал болон зөрүүг эргэцүүлэн тайлбарлах нь зүйтэй.";
  const normalizedFrequency = comparison.map((item) => {
    const rank = comparison.filter((x) => x.appearances > item.appearances).length + 1;
    return { ...item, rank };
  });
  const frequencyRows = normalizedFrequency.map((item) => `<div class="frequency-row"><span class="type-code" style="--type:${item.color}">${item.code}</span><span>${esc(TYPE_COPY[item.code]?.title || item.short)}</span><div class="frequency-dots">${[1,2,3].map((index) => `<i class="${index <= item.appearances ? "on" : ""}" style="--type:${item.color}"></i>`).join("")}</div><b>${item.appearances}/3</b></div>`).join("");
  const allTypeRows = RI.map((type) => `<div class="riasec-row"><span class="type-code" style="--type:${type.color}">${type.code}</span><div><b>${esc(TYPE_COPY[type.code].title)}</b><p>${esc(TYPE_COPY[type.code].description)}</p></div></div>`).join("");
  const studentGuide = `<div class="student-meta"><div><small>СУРАГЧ</small><b>${name}</b></div><div><small>АНГИ, БҮЛЭГ</small><b>${grade}-р анги · ${group} бүлэг</b></div><div><small>ТАЙЛАНГИЙН ДУГААР</small><b>${esc(code)}</b></div></div>`;
  const logo = logoDataUri ? `<img src="${logoDataUri}" class="brand-logo" alt="Сэтгэлийн боловсрол"/>` : `<div class="logo-fallback">СБ</div>`;

  const cover = `
    <div class="cover-top">${logo}<div class="cover-brand"><b>СЭТГЭЛИЙН БОЛОВСРОЛ</b><span>ӨӨРИЙГӨӨ ТАНИН МЭДЭХ АЯЛАЛ</span></div><div class="cover-tag">9–12 АНГИ</div></div>
    <div class="cover-art"><div class="cover-orbit orbit-one"></div><div class="cover-orbit orbit-two"></div><div class="cover-hex">RIASEC</div><span class="cover-point point-r">R</span><span class="cover-point point-i">I</span><span class="cover-point point-a">A</span><span class="cover-point point-s">S</span><span class="cover-point point-e">E</span><span class="cover-point point-c">C</span></div>
    <div class="cover-copy"><div class="eyebrow">ХУВЬ ХҮНИЙ МЭРГЭЖЛИЙН ЧИГ БАРИМЖАА</div><h1>Өөрийгөө таньж,<br/><em>ирээдүйгээ</em> чиглүүлье.</h1><p>Сонирхол · Өөрийн үнэлсэн чадавх · Мэргэжлийн хэв шинж</p></div>
    <div class="cover-band"><div><small>ТАЙЛАНГ ХҮЛЭЭН АВАГЧ</small><b>${name}</b><span>${grade}-р анги · ${group} бүлэг</span></div><div><small>ТАЙЛАН БОЛОВСРУУЛСАН</small><b>${dateText}</b><span>Holland RIASEC арга</span></div></div>
    <div class="cover-note">Энэхүү тайлан нь таны одоогийн хариултуудыг гурван өөр өнцгөөс харьцуулан, мэргэжлийн чиглэлээ судлахад туслах зорилготой.</div>
    ${footer(1, code)}`;

  const summary = `
    ${pageHeader("ТАНЫ ҮР ДҮН", "Таны мэргэжлийн чиг баримжааны хураангуй", "Энэ хэсэгт гурван үнэлгээний хамгийн чухал үр дүнг нэг дор харууллаа.")}
    ${studentGuide}
    <div class="summary-hero">
      <div class="summary-main"><small>ЗОНХИЛОХ ЕРӨНХИЙ ХЭВ ШИНЖ</small><h3>${esc(dominantText)}</h3><p>Гурван тестийн эхний гурван хэв шинжид хамгийн олон давтагдсан үр дүн.</p></div>
      <div class="summary-secondary"><small>ДАГАЛДАХ ХЭВ ШИНЖ</small><b>${esc(secondaryText)}</b><p>Зонхилох хэв шинжийн дараа давтамжаар эрэмбэлэгдсэн хоёр чиглэл.</p></div>
    </div>
    <div class="summary-three">
      <div><span>01</span><b>Сонирхол</b><strong>${esc(nameFor(interestTop))}</strong><small>Тест №1 · бүлгийн оноо / 18</small></div>
      <div><span>02</span><b>Чадавх</b><strong>${esc(nameFor(abilityTop))}</strong><small>Тест №2 · бүлгийн оноо / 18</small></div>
      <div><span>03</span><b>Хэв шинж</b><strong>${esc(nameFor(profileTop))}</strong><small>Тест №3 · сонголтын тоо / 42</small></div>
    </div>
    <div class="summary-insight"><div class="insight-icon">✦</div><div><b>Юуг анхаарч унших вэ?</b><p>Зонхилох хэв шинж нь таны боломж, ирээдүйн сонголтыг дангаар шийдэх дүгнэлт биш. Сонирхол, чадавх, мэргэжлийн хэв шинжийн давхцал болон зөрүүг хамтад нь хараад дараагийн судалгаагаа төлөвлөөрэй.</p></div></div>
    <div class="summary-frequency"><div class="section-subhead"><b>Гурван тестэд давтагдсан давтамж</b><small>Хэв шинж тус бүр хамгийн эхний 3-т орсон тоо</small></div>${frequencyRows}</div>
    ${footer(2, code)}`;

  const holland = `
    ${pageHeader("ХОЛЛАНД RIASEC", "Зургаан хэв шинжийг ойлгох нь", "RIASEC загвар нь сонирхол, хандлага, ажиллах орчны чиглэлийг зургаан бүлгээр тайлбарладаг.")}
    <div class="holland-intro"><div class="holland-hex">R<br/>I<br/>A<br/>S<br/>E<br/>C</div><div><h3>Нэг хүн зургаан хэв шинжийг өөр өөр хэмжээгээр агуулдаг.</h3><p>Эдгээрээс зарим нь илүү тод илэрч болох ч нэг хэв шинжийг дангаар нь хүний бүх чадвар, зан чанар гэж ойлгож болохгүй. Зэргэлдээ байрлах хэв шинжүүд хоорондоо нийцтэй, харин зургаан өнцөгтийн эсрэг талын хэв шинжүүд ялгаатай байж болно.</p></div></div>
    <div class="riasec-grid">${allTypeRows}</div>
    <div class="soft-note"><b>Тайланг хэрхэн унших вэ?</b><p>Тест №1 нь ямар үйл ажиллагаанд дуртайг, Тест №2 нь өөрийн чадавхаа хэрхэн үнэлж байгааг, Тест №3 нь хоёр мэргэжлийн аль нэгийг харьцуулан сонгох үеийн чиг хандлагыг харуулна. Гурван үр дүн ижил байх албагүй.</p></div>
    ${footer(3, code)}`;

  const interest = `
    ${pageHeader("ТЕСТ №1 · СОНИРХОЛ", "Таны мэргэжилд чиглэсэн хүсэл сонирхол", "Асуулт бүрт өгсөн 0–3 оноог RIASEC-ийн зургаан бүлгээр тус тусад нь нийлүүлэв.")}
    <div class="result-kpis"><div><small>ХАМГИЙН ӨНДӨР ОНОО</small><b>${results.interest.reduce((a,b)=>a.score>=b.score?a:b).score}/18</b></div><div><small>ТЭРГҮҮЛЖ БУЙ ЧИГЛЭЛ</small><b>${esc(nameFor(interestTop))}</b></div><div><small>ХАРИУЛТЫН ТОО</small><b>36 / 36</b></div></div>
    <div class="chart-panel"><div class="chart-title"><b>RIASEC зургаан өнцөгт</b><span>Тэмдэглэгээний хэмжээ: 1, 2, 3-р өндөр онооны түвшин</span></div>${radarSvg("Тест №1 сонирхлын үнэлгээ", results.interest, "interest")}<div class="chart-foot"><span><i class="dot big"></i> 1-р өндөр</span><span><i class="dot mid"></i> 2-р өндөр</span><span><i class="dot small"></i> 3-р өндөр</span></div></div>
    <div class="section-subhead"><b>Зургаан бүлгийн оноо</b><small>Бүлэг бүрийн дээд оноо 18</small></div><div class="score-table">${scoreRows(results.interest, "interest")}</div>
    <div class="interpretation"><b>Энэ үр дүн юуг өгүүлж байна вэ?</b><p>Таны хамгийн өндөр оноотой бүлгүүд нь одоогоор ямар төрлийн үйл ажиллагаа илүү сонирхол татаж байгааг илтгэнэ. ${esc(nameFor(interestTop))} гэсэн чиглэлийг эхний ээлжинд судалж, түүний дараах хэв шинжүүдтэйгээ хамтатган мэргэжлийн жишээг харьцуулаарай.</p></div>
    ${footer(4, code)}`;

  const ability = `
    ${pageHeader("ТЕСТ №2 · ЧАДАВХ", "Таны өөрийн үнэлсэн чадавх", "Асуулт бүрийн 0–3 оноог RIASEC-ийн зургаан бүлгээр нийлүүлсэн. Энэ нь өөрийн үнэлгээ болохоос ур чадварын шалгалт, онош биш.")}
    <div class="result-kpis"><div><small>ХАМГИЙН ӨНДӨР ОНОО</small><b>${results.ability.reduce((a,b)=>a.score>=b.score?a:b).score}/18</b></div><div><small>ТЭРГҮҮЛЖ БУЙ ЧИГЛЭЛ</small><b>${esc(nameFor(abilityTop))}</b></div><div><small>ХАРИУЛТЫН ТОО</small><b>36 / 36</b></div></div>
    <div class="chart-panel"><div class="chart-title"><b>RIASEC зургаан өнцөгт</b><span>Тэмдэглэгээний хэмжээ: 1, 2, 3-р өндөр онооны түвшин</span></div>${radarSvg("Тест №2 чадавхийн үнэлгээ", results.ability, "ability")}<div class="chart-foot"><span><i class="dot big"></i> 1-р өндөр</span><span><i class="dot mid"></i> 2-р өндөр</span><span><i class="dot small"></i> 3-р өндөр</span></div></div>
    <div class="section-subhead"><b>Зургаан бүлгийн оноо</b><small>Бүлэг бүрийн дээд оноо 18</small></div><div class="score-table">${scoreRows(results.ability, "ability")}</div>
    <div class="interpretation"><b>Өөрийн үнэлгээг хэрхэн ашиглах вэ?</b><p>Өндөр оноотой бүлгүүд нь таны өөрөө хийж чадна гэж үнэлсэн үйл ажиллагааг харуулна. Энэ дүнг бодит туршлага, хичээлийн амжилт, багш болон ойр хүмүүсийн ажиглалттай харьцуулбал илүү бодитой эргэцүүлэл болно.</p></div>
    ${footer(5, code)}`;

  const profile = `
    ${pageHeader("ТЕСТ №3 · МЭРГЭЖЛИЙН ХЭВ ШИНЖ", "Хос мэргэжлийн сонголтын үр дүн", "42 хосын нүд бүрт хоёр мэргэжил өгөгдсөн. Нийт 84 мэргэжлийн нэрээс хос бүрт нэгийг сонгож, 42 сонголт бүртгэгдсэн.")}
    <div class="result-kpis"><div><small>ХОСЫН ТОО</small><b>42 хос</b></div><div><small>СОНГОЛТЫН ТОО</small><b>42 / 42</b></div><div><small>ТЭРГҮҮЛЖ БУЙ ЧИГЛЭЛ</small><b>${esc(nameFor(profileTop))}</b></div></div>
    <div class="profile-highlight"><div><small>ТЕСТ №3-ЫН ЭХНИЙ ХЭВ ШИНЖҮҮД</small><h3>${esc(nameFor(profileTop))}</h3><p>Хос бүрээс сонгосон мэргэжлийн өмнөх 1–6 кодыг RIASEC бүлгээр тоолсон.</p></div><div class="profile-count">42<small>сонголт</small></div></div>
    <div class="section-subhead"><b>Сонголтын давтамж</b><small>Зургаан кодын нийлбэр 42 байна</small></div><div class="score-table">${scoreRows(results.profile, "profile")}</div>
    <div class="profile-method"><b>Бөглөх зарчмын сануулга</b><p>Энэ хэсэгт хосын хоёр мэргэжлээс танд “арай дээр” санагдсан нэгийг сонгоно. Хоёулаа таалагдахгүй байсан ч харьцуулахад арай дээр гэж үзсэн нэгийг сонгодог. Тиймээс энэ дүн нь тухайн хосын харьцуулсан сонголтын давтамж юм.</p></div>
    ${footer(6, code)}`;

  const integrated = `
    ${pageHeader("ГУРВАН ТЕСТИЙН НЭГДСЭН ХАРЬЦУУЛАЛТ", "Сонирхол · Чадавх · Мэргэжлийн хэв шинж", "Эх аргачлалын дагуу гурван үр дүнг Холландын зургаан өнцөгт дээр давхарлан харьцууллаа.")}
    <div class="integrated-key"><span><i style="--key:#327c79"></i>Дотор: сонирхол</span><span><i style="--key:#d18a56"></i>Дунд: чадавх</span><span><i style="--key:#ad79b4"></i>Гадна: мэргэжлийн хэв шинж</span></div>
    <div class="integrated-panel">${integratedSvg(results)}</div>
    <div class="comparison-columns">
      <div><small>СОНИРХОЛ</small><b>${esc(nameFor(interestTop))}</b></div>
      <div><small>ЧАДАВХ</small><b>${esc(nameFor(abilityTop))}</b></div>
      <div><small>ХЭВ ШИНЖ</small><b>${esc(nameFor(profileTop))}</b></div>
    </div>
    <div class="common-box"><b>Гурван үр дүнгийн давхцал</b><p>${common.length ? esc(nameFor(common)) : "Гурван үнэлгээний эхний гурван хэв шинжид нийтлэг код илрээгүй."}</p></div>
    <div class="comparison-narrative"><b>Давхцал ба зөрүүний тайлбар</b><p>${esc(patternText)}</p></div>
    <div class="overall-final"><div><small>ЗОНХИЛОХ ЕРӨНХИЙ ХЭВ ШИНЖ</small><b>${esc(dominantText)}</b></div><div><small>ДАГАЛДАХ ХЭВ ШИНЖ</small><b>${esc(secondaryText)}</b></div></div>
    <div class="tiny-note">Нэгдсэн давтамжийг тооцохдоо гурван тест тус бүрийн эхний гурван (тэнцсэн бол тэнцсэн бүх) хэв шинжид орсон эсэхийг тоолсон. Өөр өөр хэмжүүрийн түүхий оноог хооронд нь нэмээгүй.</div>
    ${footer(7, code)}`;

  const careers = `
    ${pageHeader("МЭРГЭЖЛИЙН СУДАЛГААНЫ ЧИГЛЭЛ", "Танд судалж үзэх мэргэжлийн жишээнүүд", "Зонхилох хэв шинжийн жишээг эхэлж, дагалдах хэв шинжийн мэргэжлүүдийг хамтад нь судлаарай.")}
    <div class="career-order"><span>ЭХЛЭЭД СУДЛАХ</span><b>${esc(dominantText)}</b><span>ДАРАА НЬ ХАРЬЦУУЛАХ</span><b>${esc(secondaryText)}</b></div>
    <div class="career-grid">${careerCards(overviewCodes.slice(0, 4))}</div>
    <div class="career-guidance"><b>Мэргэжил сонгохдоо өөрөөсөө асуугаарай</b><ol>
      <li>Энэ ажлын өдөр тутмын үйл ажиллагаа миний сонирхолд нийцэх үү?</li>
      <li>Шаардлагатай суурь хичээл, чадварыг эзэмшихэд бэлэн үү?</li>
      <li>Энэ мэргэжлийн бодит ажлын орчин, үүрэг хариуцлага надад тохирох уу?</li>
      <li>Ямар их, дээд сургууль болон хөтөлбөрөөр энэ мэргэжлийг эзэмшиж болох вэ?</li>
    </ol></div>
    ${footer(8, code)}`;

  const admissions = `
    ${pageHeader("ЭЛСЭЛТ БА СУРАЛЦАХ ТӨЛӨВЛӨГӨӨ", "Мэргэжил бүрийн сургалтын замыг нягтлаарай", "Их, дээд сургууль, хөтөлбөр, элсэлтийн шалгалт болон тухайн жилийн босго оноо өөрчлөгдөж болох тул сонголт хийх үед албан ёсны мэдээллийг заавал шалгана.")}
    <div class="admissions-ref"><small>ТУЛГУУР БАРИМТ</small><h3>Боловсролын сайдын 2026 оны 02 дугаар сарын 06-ны өдрийн А/34 тушаал</h3><p>“Босго оноо тогтоох тухай” тушаалын 2026–2027 оны элсэлтийн мэдээллийг ашиглахаар төлөвлөсөн.</p></div>
    <div class="admissions-warning"><b>Чухал тэмдэглэл</b><p>Сургуулийн нэр, хөтөлбөрийн код, элсэлтийн шалгалтын хичээл, босго онооны хавсралтын хүснэгтийг бүрэн бүтэцжүүлж, эх баримттай мөр мөрөөр нь баталгаажуулах ажил дуусаагүй байна. Иймээс энэхүү тайланд баталгаажаагүй сургууль, онооны жагсаалтыг таамгаар оруулаагүй.</p></div>
    <div class="checklist"><b>Сургууль, хөтөлбөр сонгохын өмнө шалгах нь</b>
      <div><span>01</span><p>Сургуулийн албан ёсны элсэлтийн журам, тухайн хичээлийн жилийн мэдээлэл.</p></div>
      <div><span>02</span><p>Сонгосон хөтөлбөрийн элсэлтийн шалгалтын хичээл, босго оноо.</p></div>
      <div><span>03</span><p>Хөтөлбөрийн магадлан итгэмжлэл, сургалтын төлөвлөгөө, дадлагын боломж.</p></div>
      <div><span>04</span><p>Сургалтын төлбөр, тэтгэлэг, дотуур байр, байршил болон төгсөгчдийн ажлын боломж.</p></div>
    </div>
    <div class="admissions-next"><b>Төлөвлөлтийн зөвлөмж</b><p>Зонхилох болон дагалдах хэв шинжид нийцэх 3–5 мэргэжлийг жагсааж, тус бүрийн сургалтын зам, хичээлийн шаардлага, ажлын орчныг харьцуулан судлаарай.</p></div>
    ${footer(9, code)}`;

  const worksheet = `
    ${pageHeader("ТАНЫ ДАРААГИЙН АЛХАМ", "Мэргэжлээ судлах миний ажлын хуудас", "Энэ хуудсыг өөрөө бөглөж, эцэг эх, багш эсвэл мэргэжлийн зөвлөхтэй ярилцахдаа ашиглаарай.")}
    <div class="worksheet-intro"><b>Миний судалж үзэх 3 мэргэжил</b><small>Зонхилох болон дагалдах хэв шинжид тохирох жишээнүүдээс сонгоно.</small></div>
    <div class="worksheet-fields">
      <div><span>01</span><b>Мэргэжлийн нэр:</b><i></i><b>Яагаад сонирхож байна вэ?</b><i></i></div>
      <div><span>02</span><b>Мэргэжлийн нэр:</b><i></i><b>Яагаад сонирхож байна вэ?</b><i></i></div>
      <div><span>03</span><b>Мэргэжлийн нэр:</b><i></i><b>Яагаад сонирхож байна вэ?</b><i></i></div>
    </div>
    <div class="worksheet-two">
      <div><b>Надад хөгжүүлэх шаардлагатай чадвар</b><i></i><i></i><i></i></div>
      <div><b>Судлах шаардлагатай хичээл, элсэлтийн нөхцөл</b><i></i><i></i><i></i></div>
    </div>
    <div class="worksheet-prompt"><b>Би дараагийн 7 хоногт хийх нэг бодит алхам</b><i></i><i></i></div>
    <div class="disclaimer"><b>Санамж</b><p>Энэ тайлан нь өөрийгөө танин мэдэх, мэргэжлийн боломжоо судлахад туслах мэдээлэл юм. Тестийн үр дүн нь мэргэжил сонголтын эцсийн шийдвэр, сэтгэл зүйн онош, амжилтын баталгаа биш. Сонголтоо бодит туршлага, сургалтын шаардлага, өөрийн үнэт зүйл болон зөвлөгөөтэй хамтатган гаргаарай.</p></div>
    <div class="source-note"><b>Агуулгын эх сурвалж</b><p>“Мэргэжил сонголтын Дж. Холландын арга” (9–12 анги) аргачлалын RIASEC тайлбар, Алхам 4–5; “Holland test- асуумж” эх асуумж. Мэргэжлийн жишээг аргачлалын Алхам 5-ын жагсаалтаас сонгов. Элсэлтийн босго онооны дэлгэрэнгүй хавсралтын нэг бүрчилсэн тулгалт хийгдээгүй тул сургууль, хөтөлбөрийн оноо оруулаагүй.</p></div>
    ${footer(10, code)}`;

  const style = `
  @page{size:A4;margin:0}
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:#eef2ef;color:#263c3a;font-family:Arial,"Noto Sans",sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{font-size:10pt;line-height:1.45}
  .page{position:relative;width:210mm;height:297mm;min-height:297mm;padding:15mm 16mm 17mm;background:#fffefa;overflow:hidden;page-break-after:always;break-after:page}
  .page:last-child{page-break-after:auto;break-after:auto}
  .page-head{margin-bottom:6mm}
  .eyebrow{color:#327c79;letter-spacing:.16em;font-size:7.5pt;font-weight:800;margin-bottom:2mm}
  h1,h2,h3,p{margin-top:0}
  h2{font-family:Georgia,serif;font-size:23pt;line-height:1.12;font-weight:500;color:#21423e;margin:0 0 2mm}
  .lead{font-size:9pt;line-height:1.5;color:#6c7c77;max-width:164mm;margin:0}
  .page-footer{position:absolute;bottom:7mm;left:16mm;right:16mm;border-top:1px solid #dce7e2;padding-top:3mm;display:flex;justify-content:space-between;color:#87958f;font-size:6.5pt;letter-spacing:.08em}
  .brand-logo{width:18mm;height:18mm;object-fit:contain}
  .logo-fallback{width:18mm;height:18mm;border-radius:50%;background:#327c79;color:white;display:grid;place-items:center;font-size:16pt;font-weight:800}
  .cover{background:linear-gradient(142deg,#f7f3e9 0%,#e4f1eb 56%,#d4e6dc 100%);padding:16mm 18mm;display:flex;flex-direction:column}
  .cover-top{display:flex;align-items:center;gap:4mm}
  .cover-brand b,.cover-brand span{display:block}
  .cover-brand b{font-size:9pt;letter-spacing:.1em;color:#21423e}
  .cover-brand span{font-size:6.5pt;letter-spacing:.16em;color:#74867f;margin-top:1mm}
  .cover-tag{margin-left:auto;border-radius:40px;background:#fffefa;color:#327c79;padding:2.4mm 4mm;font-size:7pt;font-weight:800;letter-spacing:.1em}
  .cover-art{position:absolute;right:16mm;top:39mm;width:112mm;height:112mm;border-radius:50%;background:radial-gradient(circle,#fffefa 0%,#d5e8df 60%,#c8ded3 100%);display:grid;place-items:center}
  .cover-orbit{position:absolute;border:1px solid #84a99d;border-radius:50%;opacity:.45}
  .orbit-one{width:88mm;height:88mm}
  .orbit-two{width:67mm;height:67mm;border-style:dashed}
  .cover-hex{width:44mm;height:44mm;display:grid;place-items:center;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:#21423e;color:white;font-family:Georgia,serif;font-size:17pt;letter-spacing:.08em}
  .cover-point{position:absolute;width:12mm;height:12mm;border-radius:50%;display:grid;place-items:center;color:white;font-size:10pt;font-weight:800;box-shadow:0 3mm 7mm #1f44351f}
  .point-r{top:11mm;left:50mm;background:#4f8f9d}.point-i{top:34mm;right:12mm;background:#6586c7}.point-a{bottom:18mm;right:20mm;background:#ad79b4}.point-s{bottom:10mm;left:46mm;background:#5d9b77}.point-e{bottom:37mm;left:8mm;background:#d18a56}.point-c{top:36mm;left:11mm;background:#8b8d98}
  .cover-copy{position:relative;margin-top:56mm;width:122mm}
  .cover-copy h1{font-family:Georgia,serif;font-size:34pt;line-height:1.12;color:#21423e;font-weight:500;margin:2mm 0 4mm}
  .cover-copy h1 em{color:#327c79;font-weight:500}
  .cover-copy p{font-size:10pt;color:#667d75}
  .cover-band{margin-top:auto;display:grid;grid-template-columns:1.2fr 1fr;gap:8mm;background:#fffefa;border:1px solid #e2e9e2;border-radius:5mm;padding:6mm}
  .cover-band small,.cover-band b,.cover-band span{display:block}
  .cover-band small{font-size:6.5pt;color:#8b9a92;letter-spacing:.12em;margin-bottom:1.5mm}
  .cover-band b{font-size:13pt;color:#21423e}
  .cover-band span{font-size:8pt;color:#6d7e76;margin-top:1mm}
  .cover-note{margin-top:5mm;color:#64766f;font-size:8pt;max-width:155mm}
  .student-meta{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:3mm;margin:0 0 6mm}
  .student-meta div{background:#f3f7f2;border-radius:3mm;padding:3mm 4mm}
  .student-meta small,.student-meta b{display:block}
  .student-meta small{font-size:6pt;letter-spacing:.1em;color:#82928b;margin-bottom:1mm}
  .student-meta b{font-size:9pt;color:#284c46}
  .summary-hero{display:grid;grid-template-columns:1.1fr .9fr;gap:3mm;margin-bottom:4mm}
  .summary-main,.summary-secondary{border-radius:4mm;padding:6mm}
  .summary-main{background:#21423e;color:#fffefa}
  .summary-secondary{background:#eaf3ee;border:1px solid #d8e7df}
  .summary-main small,.summary-secondary small{font-size:6.5pt;letter-spacing:.13em;display:block;margin-bottom:2mm;opacity:.8}
  .summary-main h3{font-family:Georgia,serif;font-size:20pt;font-weight:500;line-height:1.15;margin:0 0 2mm}
  .summary-main p,.summary-secondary p{font-size:8pt;line-height:1.45;margin:0;opacity:.83}
  .summary-secondary b{display:block;font-family:Georgia,serif;font-size:14pt;color:#327c79;line-height:1.2;margin-bottom:2mm}
  .summary-three{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin:4mm 0}
  .summary-three>div{border:1px solid #dfe9e3;border-radius:3mm;padding:4mm;min-height:29mm}
  .summary-three span{display:inline-grid;place-items:center;width:7mm;height:7mm;border-radius:50%;background:#dff0e9;color:#327c79;font-size:6.5pt;font-weight:800;margin-bottom:2mm}
  .summary-three b,.summary-three strong,.summary-three small{display:block}
  .summary-three b{font-size:9pt;margin-bottom:1mm}
  .summary-three strong{font-size:8pt;line-height:1.35;color:#327c79;min-height:8mm}
  .summary-three small{font-size:6.5pt;color:#85938c;margin-top:1mm}
  .summary-insight{display:flex;gap:3mm;padding:4mm;background:#f7f3e9;border-radius:3mm;margin:4mm 0}
  .insight-icon{font-size:17pt;color:#d18a56}
  .summary-insight b{font-size:9pt}
  .summary-insight p{font-size:8pt;color:#64736d;margin:1mm 0 0}
  .section-subhead{display:flex;justify-content:space-between;align-items:end;margin:4mm 0 2mm}
  .section-subhead b{font-size:9pt;color:#24443f}
  .section-subhead small{font-size:6.8pt;color:#86958e}
  .frequency-row{display:grid;grid-template-columns:9mm 1fr 22mm 13mm;gap:2mm;align-items:center;border-bottom:1px solid #ecf0eb;padding:1.4mm 0;font-size:7.5pt}
  .frequency-row>span:nth-child(2){color:#5d7069}
  .frequency-dots{display:flex;gap:1.2mm}
  .frequency-dots i{display:block;width:3.8mm;height:3.8mm;border-radius:50%;background:#e4eae6}
  .frequency-dots i.on{background:var(--type)}
  .frequency-row>b{text-align:right;color:#46645b}
  .type-code{width:7mm;height:7mm;border-radius:50%;display:inline-grid;place-items:center;background:var(--type);color:white;font-weight:800;font-size:7.5pt;flex:none}
  .holland-intro{display:grid;grid-template-columns:43mm 1fr;gap:7mm;padding:5mm;background:#f1f6f1;border-radius:4mm;margin-bottom:5mm;align-items:center}
  .holland-hex{height:40mm;display:flex;align-items:center;justify-content:center;flex-direction:column;line-height:1.55;font-size:9pt;font-weight:800;color:#327c79;border:2px solid #b8d2c7;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:#fffefa}
  .holland-intro h3{font-family:Georgia,serif;font-size:15pt;font-weight:500;line-height:1.22;margin-bottom:2mm;color:#294b44}
  .holland-intro p{font-size:8pt;color:#64736d;margin:0}
  .riasec-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.6mm}
  .riasec-row{display:flex;gap:3mm;border:1px solid #e3ebe5;border-radius:3mm;padding:3mm;min-height:26mm}
  .riasec-row b{display:block;font-size:8.5pt;margin-bottom:1mm}
  .riasec-row p{font-size:7.2pt;color:#6d7c75;margin:0;line-height:1.35}
  .soft-note{background:#edf5ef;border-left:1.5mm solid #5d9b77;border-radius:2mm;padding:3.5mm 4mm;margin-top:5mm}
  .soft-note b{font-size:8.5pt}
  .soft-note p{font-size:7.4pt;color:#64746c;margin:1.5mm 0 0}
  .result-kpis{display:grid;grid-template-columns:1fr 1.35fr 1fr;gap:3mm;margin-bottom:4mm}
  .result-kpis>div{padding:3.2mm 4mm;background:#f2f6f2;border-radius:3mm}
  .result-kpis small,.result-kpis b{display:block}
  .result-kpis small{font-size:6pt;letter-spacing:.11em;color:#81918a;margin-bottom:1mm}
  .result-kpis b{font-size:10pt;color:#327c79}
  .chart-panel{padding:3mm 5mm 2mm;border:1px solid #e1eae4;border-radius:4mm;margin-bottom:4mm}
  .chart-title{display:flex;align-items:end;justify-content:space-between}
  .chart-title b{font-size:9pt}
  .chart-title span{font-size:6.5pt;color:#89968f}
  .radar{display:block;width:125mm;height:91mm;margin:0 auto}
  .chart-foot{display:flex;justify-content:center;gap:8mm;font-size:7pt;color:#7b8c83;padding-bottom:1mm}
  .chart-foot span{display:flex;gap:2mm;align-items:center}
  .dot{display:inline-block;border-radius:50%;background:#327c79}
  .dot.big{width:3mm;height:3mm}.dot.mid{width:2.2mm;height:2.2mm}.dot.small{width:1.5mm;height:1.5mm}
  .score-table{border-top:1px solid #e3ebe5}
  .score-row{display:grid;grid-template-columns:55mm 1fr 14mm 8mm;gap:2.5mm;align-items:center;padding:2mm 1mm;border-bottom:1px solid #edf1ed}
  .score-name{display:flex;align-items:center;gap:2.4mm;font-size:7.4pt;color:#536c63}
  .score-name .type-code{width:6mm;height:6mm;font-size:6.5pt}
  .score-track{height:2mm;background:#edf2ee;border-radius:4mm;overflow:hidden}
  .score-track i{display:block;height:100%;border-radius:4mm}
  .score-value{font-size:8.5pt;color:#24443f;font-weight:800;text-align:right}
  .score-value small{color:#87958e;font-size:6.5pt;font-weight:400}
  .score-rank{font-size:7pt;color:#d18a56;font-weight:800;text-align:right}
  .interpretation{margin-top:4mm;background:#f7f3e9;border-radius:3mm;padding:3.5mm 4mm}
  .interpretation b{font-size:8pt}
  .interpretation p{font-size:7.4pt;color:#66766f;margin:1mm 0 0}
  .profile-highlight{display:flex;justify-content:space-between;align-items:center;background:#f1ebf4;border-radius:4mm;padding:5mm;margin-bottom:5mm}
  .profile-highlight small{font-size:6pt;letter-spacing:.12em;color:#85728e}
  .profile-highlight h3{font-family:Georgia,serif;font-size:18pt;font-weight:500;color:#755b82;margin:1mm 0}
  .profile-highlight p{font-size:7.4pt;color:#766b7b;margin:0}
  .profile-count{width:22mm;height:22mm;border-radius:50%;display:grid;place-items:center;background:#ad79b4;color:white;font-family:Georgia,serif;font-size:18pt}
  .profile-count small{display:block;font-family:Arial,sans-serif;font-size:5.8pt;color:white;letter-spacing:0}
  .profile-method{margin-top:5mm;padding:4mm;background:#f3f7f3;border-left:1.5mm solid #ad79b4}
  .profile-method b{font-size:8.5pt}
  .profile-method p{font-size:7.5pt;color:#697971;margin:1mm 0 0}
  .integrated-key{display:flex;justify-content:center;gap:7mm;font-size:7pt;color:#6c7c74;margin-bottom:3mm}
  .integrated-key span{display:flex;align-items:center;gap:2mm}
  .integrated-key i{width:4mm;height:4mm;border-radius:50%;background:var(--key)}
  .integrated-panel{height:98mm;background:#f5f8f4;border:1px solid #e1eae4;border-radius:4mm;display:grid;place-items:center;margin-bottom:4mm}
  .integrated-chart{width:145mm;height:96mm}
  .comparison-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5mm;margin:4mm 0}
  .comparison-columns>div{background:#f1f5f1;border-radius:3mm;padding:3mm}
  .comparison-columns small,.comparison-columns b{display:block}
  .comparison-columns small{font-size:6pt;letter-spacing:.1em;color:#8a9991}
  .comparison-columns b{font-size:8pt;color:#327c79;margin-top:1mm}
  .common-box{background:#e6f1e9;border-radius:3mm;padding:3mm 4mm;margin:3mm 0}
  .common-box b,.common-box p{display:block}
  .common-box b{font-size:8pt}
  .common-box p{margin:1mm 0 0;font-size:8.2pt;color:#327c79;font-weight:700}
  .comparison-narrative{padding:3.5mm 4mm;border:1px solid #e2ebe4;border-radius:3mm;margin:3mm 0}
  .comparison-narrative b{font-size:8pt}
  .comparison-narrative p{font-size:7.3pt;line-height:1.45;color:#69776f;margin:1mm 0 0}
  .overall-final{display:grid;grid-template-columns:1fr 1fr;gap:2mm;margin-top:3mm}
  .overall-final>div{background:#21423e;color:#fffefa;border-radius:3mm;padding:3mm 4mm}
  .overall-final small,.overall-final b{display:block}
  .overall-final small{font-size:6pt;letter-spacing:.1em;opacity:.75}
  .overall-final b{font-size:9.5pt;margin-top:1mm}
  .tiny-note{font-size:6.3pt;color:#929d96;margin-top:2mm}
  .career-order{display:flex;align-items:center;gap:3mm;flex-wrap:wrap;background:#eff5ef;padding:3mm 4mm;border-radius:3mm;margin:0 0 4mm}
  .career-order span{font-size:6pt;color:#829188;letter-spacing:.08em}
  .career-order b{font-size:8pt;color:#327c79;margin-right:4mm}
  .career-grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
  .career-card{border:1px solid #e1e9e4;border-top:2mm solid var(--type);border-radius:3mm;padding:3.5mm;break-inside:avoid}
  .career-card-head{display:flex;gap:2.5mm;align-items:center}
  .career-card-head small{font-size:5.7pt;color:#8a9991;letter-spacing:.12em}
  .career-card-head h3{font-family:Georgia,serif;font-size:11pt;font-weight:500;color:#24443f;margin:0}
  .career-card>p{font-size:7pt;color:#6e7c75;margin:2mm 0}
  .mini-label{font-size:6.5pt;color:#38584e}
  .career-card ul{margin:1.5mm 0 2mm;padding-left:4.5mm}
  .career-card li{font-size:6.5pt;color:#4d6259;margin-bottom:1mm}
  .career-card li em{font-style:normal;color:#327c79;font-size:5.5pt;margin-left:1.5mm}
  .career-note{border-top:1px solid #edf0ed;padding-top:2mm;font-size:6pt;line-height:1.4;color:#839087}
  .career-guidance{margin-top:4mm;background:#f7f3e9;border-radius:3mm;padding:3mm 4mm}
  .career-guidance b{font-size:8pt}
  .career-guidance ol{margin:1.5mm 0 0;padding-left:5mm;columns:2;column-gap:8mm}
  .career-guidance li{font-size:6.7pt;color:#687870;margin-bottom:1.2mm;break-inside:avoid}
  .admissions-ref{background:#21423e;color:#fffefa;border-radius:4mm;padding:6mm;margin-bottom:4mm}
  .admissions-ref small{font-size:6.5pt;letter-spacing:.12em;opacity:.75}
  .admissions-ref h3{font-family:Georgia,serif;font-size:18pt;font-weight:500;line-height:1.2;margin:2mm 0;color:#fffefa}
  .admissions-ref p{font-size:8pt;color:#d9e7df;margin:0}
  .admissions-warning{background:#fff2e9;border-left:1.5mm solid #d18a56;border-radius:3mm;padding:4mm;margin:4mm 0}
  .admissions-warning b{font-size:9pt;color:#9b5a3c}
  .admissions-warning p{font-size:7.8pt;color:#725c50;margin:1.5mm 0 0}
  .checklist{border:1px solid #e1eae4;border-radius:4mm;padding:4mm 5mm;margin:4mm 0}
  .checklist>b{font-size:9pt}
  .checklist>div{display:flex;gap:3mm;align-items:center;border-top:1px solid #edf0ed;padding:3mm 0}
  .checklist>div:first-of-type{margin-top:2mm}
  .checklist span{font-family:Georgia,serif;color:#327c79;font-size:13pt}
  .checklist p{margin:0;font-size:8pt;color:#5e7068}
  .admissions-next{background:#e9f2ed;border-radius:3mm;padding:4mm}
  .admissions-next b{font-size:8.5pt}
  .admissions-next p{font-size:7.5pt;color:#62756c;margin:1mm 0 0}
  .worksheet-intro{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3mm}
  .worksheet-intro b{font-size:10pt}
  .worksheet-intro small{font-size:6.7pt;color:#87958e}
  .worksheet-fields{display:grid;gap:3mm}
  .worksheet-fields>div{border:1px solid #dfe8e2;border-radius:3mm;padding:3mm 4mm;position:relative}
  .worksheet-fields span{position:absolute;right:4mm;top:3mm;font-size:8pt;font-weight:800;color:#d18a56}
  .worksheet-fields b{display:block;font-size:7.7pt;color:#4b635a;margin:1mm 0}
  .worksheet-fields i,.worksheet-two i,.worksheet-prompt i{display:block;height:7mm;border-bottom:1px solid #cbd9d1}
  .worksheet-two{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin:4mm 0}
  .worksheet-two>div{border-radius:3mm;background:#f2f6f1;padding:3mm 4mm;min-height:32mm}
  .worksheet-two b{font-size:7.7pt;display:block}
  .worksheet-prompt{background:#e7f1eb;padding:4mm;border-radius:3mm;margin:4mm 0}
  .worksheet-prompt b{font-size:8.5pt}
  .disclaimer{padding:3mm 4mm;border-left:1.5mm solid #d18a56;background:#fff8ef;border-radius:2mm}
  .disclaimer b,.source-note b{font-size:7.5pt}
  .disclaimer p,.source-note p{font-size:6.5pt;line-height:1.45;color:#727f77;margin:1mm 0 0}
  .source-note{margin-top:3mm;padding:2.5mm 0}
  `;
  const pages = [
    page(cover, 1, code, "cover"),
    page(summary, 2, code),
    page(holland, 3, code),
    page(interest, 4, code),
    page(ability, 5, code),
    page(profile, 6, code),
    page(integrated, 7, code),
    page(careers, 8, code),
    page(admissions, 9, code),
    page(worksheet, 10, code)
  ];
  return `<!doctype html><html lang="mn"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Мэргэжлийн чиг баримжааны тайлан — ${name}</title><style>${style}</style></head><body>${pages.join("")}</body></html>`;
}
