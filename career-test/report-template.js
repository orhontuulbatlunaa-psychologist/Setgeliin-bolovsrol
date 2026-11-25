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
const ENGLISH_TYPE = {
  R: { name: "Realistic", pronunciation: "риалистик" },
  I: { name: "Investigative", pronunciation: "инвестигейтив" },
  A: { name: "Artistic", pronunciation: "артистик" },
  S: { name: "Social", pronunciation: "сошиал" },
  E: { name: "Enterprising", pronunciation: "энтерпрайзинг" },
  C: { name: "Conventional", pronunciation: "кэнвэншэнэл" }
};
const TYPE_SECTORS = {
  R: "инженерчлэл, үйлдвэрлэл, барилга, эрчим хүч, техник үйлчилгээ, хөдөө аж ахуйн технологи",
  I: "шинжлэх ухаан, мэдээллийн технологи, өгөгдөл, судалгаа, эрүүл мэндийн оношилгоо",
  A: "дизайн, архитектур, медиа, контент үйлдвэрлэл, урлаг, бүтээлч үйлдвэрлэл",
  S: "боловсрол, эрүүл мэнд, сэтгэл зүйн үйлчилгээ, нийгмийн хамгаалал, хүний хөгжил",
  E: "бизнес, маркетинг, менежмент, төсөл, худалдаа, үйлчилгээ, бизнес эрхлэлт",
  C: "санхүү, нягтлан бодох бүртгэл, аудит, даатгал, өгөгдөл ба баримт бичгийн удирдлага, чанарын хяналт"
};

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

function rankedTypeRows(codes, scores) {
  const distinct = [...new Set([...scores].sort((a, b) => b.score - a.score).map((item) => item.score))];
  return (codes || []).map((code) => {
    const item = scores.find((score) => score.code === code);
    const rank = item ? distinct.indexOf(item.score) + 1 : 0;
    const roman = rank === 1 ? "I" : rank === 2 ? "II" : rank === 3 ? "III" : String(rank);
    return '<div class="ranked-type"><b>' + roman + '</b><span>' + esc(TYPE_COPY[code]?.title || code) + '</span></div>';
  }).join("");
}

function overlapRadarSvg(comparison) {
  const center = { x: 300, y: 170 }, radius = 116;
  const angle = (index) => (-90 + index * 60) * Math.PI / 180;
  const point = (index, fraction) => ({ x: center.x + Math.cos(angle(index)) * radius * fraction, y: center.y + Math.sin(angle(index)) * radius * fraction });
  const rings = [1 / 3, 2 / 3, 1].map((fraction) => '<polygon points="' + RI.map((_, index) => { const p = point(index, fraction); return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(" ") + '" fill="none" stroke="#dce7e3" stroke-width="1.2"/>').join("");
  const axes = RI.map((_, index) => { const p = point(index, 1); return '<line x1="' + center.x + '" y1="' + center.y + '" x2="' + p.x.toFixed(1) + '" y2="' + p.y.toFixed(1) + '" stroke="#e0e9e5"/>'; }).join("");
  const values = RI.map((type) => Math.max(0, Math.min(3, Number(comparison.find((item) => item.code === type.code)?.appearances || 0))) / 3);
  const polygon = values.map((fraction, index) => { const p = point(index, fraction); return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(" ");
  const markers = RI.map((type, index) => { const p = point(index, values[index]); const item = comparison.find((score) => score.code === type.code); return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="6" fill="' + type.color + '" stroke="#fff" stroke-width="1.5"><title>' + esc(type.code + " · " + (item?.appearances || 0) + "/3") + '</title></circle>'; }).join("");
  const labels = RI.map((type, index) => { const p = point(index, 1.22); const anchor = p.x < center.x - 10 ? "end" : (p.x > center.x + 10 ? "start" : "middle"); return '<text x="' + p.x.toFixed(1) + '" y="' + (p.y + 4).toFixed(1) + '" text-anchor="' + anchor + '" font-size="13" font-weight="800" fill="' + type.color + '">' + type.code + '</text>'; }).join("");
  const counts = RI.map((type, index) => { const p = point(index, values[index]); const item = comparison.find((score) => score.code === type.code); return '<text x="' + (p.x + 9).toFixed(1) + '" y="' + (p.y - 8).toFixed(1) + '" font-size="10" font-weight="700" fill="#52665f">' + (item?.appearances || 0) + '</text>'; }).join("");
  return '<svg viewBox="0 0 600 340" class="overlap-chart" role="img" aria-label="Гурван тестийн эхний гурван хэв шинжийн давхцлын давтамжийн график">' + rings + axes + '<polygon points="' + polygon + '" fill="#5d9b77" fill-opacity=".18" stroke="#327c79" stroke-width="3" stroke-linejoin="round"/>' + markers + counts + labels + '<circle cx="300" cy="170" r="2.5" fill="#647a74"/><text x="300" y="326" text-anchor="middle" font-size="10" fill="#829188">Давтамж: тест тус бүрийн эхний 3-т орсон тоо (0–3)</text></svg>';
}

function riasecSpectrum() {
  return '<div class="riasec-spectrum">' + RI.map((type) => {
    const english = ENGLISH_TYPE[type.code];
    return '<div style="--type:' + type.color + '"><b>' + type.code + '</b><strong>' + english.name + '</strong><span>' + esc(TYPE_COPY[type.code].title) + '</span></div>';
  }).join("") + '</div>';
}

function riasecLegend() {
  return '<div class="riasec-legend">' + RI.map((type) => '<span style="--type:' + type.color + '"><b>' + type.code + '</b>' + esc(TYPE_COPY[type.code].title) + '</span>').join("") + '</div>';
}
function personalizedTypeCards(codes, dominantCodes) {
  return (codes || []).map((code) => {
    const info = TYPE_COPY[code], type = getType(code);
    if (!info || !type) return "";
    const label = dominantCodes.includes(code) ? "ЗОНХИЛОХ ХЭВ ШИНЖ" : "ДАГАЛДАХ ХЭВ ШИНЖ";
    return '<article class="personal-type" style="--type:' + type.color + '"><div class="personal-type-head"><span class="type-code">' + code + '</span><div><small>' + label + '</small><b>' + esc(info.title) + '</b></div></div><p>' + esc(info.description) + '</p><div><small>СУДАЛЖ ҮЗЭХ САЛБАР</small><span>' + esc(TYPE_SECTORS[code]) + '</span></div><div><small>МЭРГЭЖЛИЙН ЖИШЭЭ</small><span>' + esc(info.sourceCareers.slice(0, 3).join(" · ")) + '</span></div></article>';
  }).join("");
}

function pageHeader(kicker, title, lead = "") {
  return `<div class="page-head"><div class="eyebrow">${esc(kicker)}</div><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ""}</div>`;
}

function footer(page, code) {
  return `<div class="page-footer"><span>СЭТГЭЛИЙН БОЛОВСРОЛ · ХОЛЛАНД RIASEC</span><span>${esc(code)} · ${page}</span></div>`;
}

function page(inner, pageNo, code, extra = "") {
  // Each authored page body already includes its page footer.
  return `<section class="page ${extra}">${inner}</section>`;
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

function careerCards(codes, dominantCount = 2) {
  return codes.map((code, index) => {
    const type = getType(code);
    const info = TYPE_COPY[code];
    if (!type || !info) return "";
    const modernSet = new Set(info.modern);
    const careerList = info.sourceCareers.slice(0, 6).map((career) => `<li>${esc(career)}${modernSet.has(career) ? '<em>технологи, шинэчлэлтэй холбоотой жишээ</em>' : ""}</li>`).join("");
    return `<article class="career-card" style="--type:${type.color}">
      <div class="career-card-head"><span class="type-code">${code}</span><div><small>${index < dominantCount ? "ЗОНХИЛОХ ХЭВ ШИНЖ" : "ДАГАЛДАХ ХЭВ ШИНЖ"}</small><h3>${esc(info.title)}</h3></div></div>
      <p>${esc(info.description)}</p>
      <b class="mini-label">Эх аргачлалын мэргэжлийн жагсаалтаас жишээ</b>
      <ul>${careerList}</ul>
      <div class="career-note">Эдгээр нь судалж үзэх жишээ болохоос таны заавал сонгох мэргэжил биш. Мэргэжил бүрийн сургалтын агуулга, бодит ажлын орчин, шаардлагыг нэмж нягтлаарай.</div>
    </article>`;
  }).join("");
}

function labourTrendChart() {
  const growing = [
    ["Их өгөгдлийн мэргэжилтэн", 120],
    ["Финтек инженер", 93],
    ["Хиймэл оюун, машин сургалтын мэргэжилтэн", 82],
    ["Программ хангамж хөгжүүлэгч", 57],
    ["Мэдээллийн аюулгүй байдлын менежментийн мэргэжилтэн", 53]
  ];
  const declining = [
    ["Шуудангийн үйлчилгээний ажилтан", -34],
    ["Банкны теллер", -31],
    ["Мэдээлэл шивэлтийн ажилтан", -26],
    ["Касс, тасалбар борлуулалтын ажилтан", -20],
    ["Захиргааны туслах, гүйцэтгэх нарийн бичгийн дарга", -20]
  ];
  const rows = (items, max, kind) => items.map(([label, value]) => `<div class="labour-bar-row"><span>${esc(label)}</span><div class="labour-bar-track"><i class="${kind}" style="width:${Math.abs(value) / max * 100}%"></i></div><b>${value > 0 ? "+" : ""}${value}%</b></div>`).join("");
  return `<div class="labour-chart"><div><h4>2030 он хүртэл өсөх төлөвтэй ажлын байр</h4>${rows(growing, 120, "growth-bar")}</div><div><h4>Эрэлт нь буурах төлөвтэй ажлын байр</h4>${rows(declining, 40, "decline-bar")}</div><p>Хувиар илэрхийлсэн нь 2025–2030 оны цэвэр өсөлт/бууралтын төсөөлөл; Дэлхийн эдийн засгийн форумын ажил олгогчдын судалгаанд тулгуурласан.</p></div>`;
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
  const allTypeRows = RI.map((type) => { const english = ENGLISH_TYPE[type.code]; return `<div class="riasec-row"><span class="type-code" style="--type:${type.color}">${type.code}</span><div><b>${esc(TYPE_COPY[type.code].title)}</b><small class="english-type">${english.name} · (${english.pronunciation})</small><p>${esc(TYPE_COPY[type.code].description)}</p></div></div>`; }).join("");
  const studentGuide = `<div class="student-meta"><div><small>СУРАГЧ</small><b>${name}</b></div><div><small>АНГИ, БҮЛЭГ</small><b>${grade}-р анги · ${group} бүлэг</b></div><div><small>ТАЙЛАНГИЙН ДУГААР</small><b>${esc(code)}</b></div></div>`;
  const logo = logoDataUri ? `<img src="${logoDataUri}" class="brand-logo" alt="Сэтгэлийн боловсрол"/>` : `<div class="logo-fallback">СБ</div>`;

  const cover = `
    <div class="cover-top">${logo}<div class="cover-brand"><b>СЭТГЭЛИЙН БОЛОВСРОЛ</b><span>ӨӨРИЙГӨӨ ТАНИН МЭДЭХ АЯЛАЛ</span></div><div class="cover-tag">9–12 АНГИ</div></div>
    <div class="cover-art"><div class="cover-orbit orbit-one"></div><div class="cover-orbit orbit-two"></div><div class="cover-hex">RIASEC</div><span class="cover-point point-r">R</span><span class="cover-point point-i">I</span><span class="cover-point point-a">A</span><span class="cover-point point-s">S</span><span class="cover-point point-e">E</span><span class="cover-point point-c">C</span></div>
    <div class="cover-copy"><div class="eyebrow">ХУВЬ ХҮНИЙ МЭРГЭЖЛИЙН ЧИГ БАРИМЖАА</div><h1>Өөрийгөө таньж,<br/><em>ирээдүйгээ</em> чиглүүлье.</h1><p>Сонирхол · Өөрийн үнэлсэн чадавх · Мэргэжлийн хэв шинж</p></div>
    <div class="cover-band"><div><small>ТАЙЛАНГ ХҮЛЭЭН АВАГЧ</small><b>${name}</b><span>${grade}-р анги · ${group} бүлэг</span></div><div><small>ТАЙЛАН БОЛОВСРУУЛСАН</small><b>${dateText}</b><span>Holland RIASEC арга</span></div></div>
    <div class="cover-note">Энэхүү тайлан нь таны одоогийн хариултуудыг гурван өөр өнцгөөс харьцуулан, мэргэжлийн чиглэлээ судлахад туслах зорилготой.</div>
    <div class="cover-contact"><span>ВЭБ: setgeliin-bolovsrol.vercel.app</span><span>И-МЭЙЛ: setgeliinbolovsrol@gmail.com</span></div>
    ${footer(1, code)}`;

  const summary = `
    ${pageHeader("ТАНЫ ҮР ДҮН", "Таны мэргэжлийн чиг баримжааны дүгнэлт", "Гурван үнэлгээний үр дүнг нэгтгэн, зонхилох болон дагалдах хэв шинжийг товч харуулав.")}
    ${studentGuide}
    <div class="summary-hero">
      <div class="summary-main"><small>МЭРГЭЖЛИЙН ЗОНХИЛОХ ХЭВ ШИНЖ</small><h3>${esc(dominantText)}</h3><p>Сонирхол, өөрийн үнэлсэн чадавх, мэргэжлийн сонголтын гурван үнэлгээнд хамгийн олон давтагдсан хэв шинж.</p></div>
      <div class="summary-secondary"><small>ДАГАЛДАХ ХЭВ ШИНЖ</small><b>${esc(secondaryText)}</b><p>Зонхилох хэв шинжийн дараах өндөр давтамжтай, мэргэжлийн боломжийг өргөн хүрээнд судлахад анхаарах чиглэлүүд.</p></div>
    </div>
    <div class="summary-three">
      <div><span>01</span><b>Миний сонирхол</b><div class="summary-ranks">${rankedTypeRows(interestTop, results.interest)}</div><small>Тест №1 · бүлгийн оноо / 18</small></div>
      <div><span>02</span><b>Би юу чаддаг вэ?</b><div class="summary-ranks">${rankedTypeRows(abilityTop, results.ability)}</div><small>Тест №2 · бүлгийн оноо / 18</small></div>
      <div><span>03</span><b>Миний мэргэжлийн хэв шинж</b><div class="summary-ranks">${rankedTypeRows(profileTop, results.profile)}</div><small>Тест №3 · сонголтын тоо / 42</small></div>
    </div>
    <div class="summary-insight"><div class="insight-icon">✦</div><div><b>Үр дүнг хэрхэн ойлгох вэ?</b><p>Зонхилох болон дагалдах хэв шинж нь мэргэжил, ирээдүйн сонголтыг дангаар тогтоохгүй. Сонирхол, өөрийн үнэлсэн чадавх, мэргэжлийн сонголтын нийцэл ба ялгааг хамтад нь авч үзэж, бодит туршлага болон сургалтын шаардлагатай харьцуулан судлаарай.</p></div></div>
    <div class="summary-frequency"><div class="section-subhead"><b>Гурван тестэд давтагдсан давтамж</b><small>Хэв шинж тус бүр эхний гуравт орсон тоо · 0–3</small></div>${frequencyRows}</div>
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
    <div class="chart-panel"><div class="chart-title"><b>RIASEC зургаан өнцөгт</b><span>Тэмдэглэгээний хэмжээ: 1, 2, 3-р өндөр онооны түвшин</span></div>${radarSvg("Тест №1 сонирхлын үнэлгээ", results.interest, "interest")}${riasecLegend()}<div class="chart-foot"><span><i class="dot big"></i> 1-р өндөр</span><span><i class="dot mid"></i> 2-р өндөр</span><span><i class="dot small"></i> 3-р өндөр</span></div></div>
    <div class="section-subhead"><b>Зургаан бүлгийн оноо</b><small>Бүлэг бүрийн дээд оноо 18</small></div><div class="score-table">${scoreRows(results.interest, "interest")}</div>
    <div class="interpretation"><b>Энэ үр дүн юуг өгүүлж байна вэ?</b><p>Таны хамгийн өндөр оноотой бүлгүүд нь одоогоор ямар төрлийн үйл ажиллагаа илүү сонирхол татаж байгааг илтгэнэ. ${esc(nameFor(interestTop))} гэсэн чиглэлийг эхний ээлжинд судалж, түүний дараах хэв шинжүүдтэйгээ хамтатган мэргэжлийн жишээг харьцуулаарай.</p></div>
    ${footer(4, code)}`;

  const ability = `
    ${pageHeader("ТЕСТ №2 · ЧАДАВХ", "Таны өөрийн үнэлсэн чадавх", "Асуулт бүрийн 0–3 оноог RIASEC-ийн зургаан бүлгээр нийлүүлсэн. Энэ нь өөрийн үнэлгээ болохоос ур чадварын шалгалт, онош биш.")}
    <div class="result-kpis"><div><small>ХАМГИЙН ӨНДӨР ОНОО</small><b>${results.ability.reduce((a,b)=>a.score>=b.score?a:b).score}/18</b></div><div><small>ТЭРГҮҮЛЖ БУЙ ЧИГЛЭЛ</small><b>${esc(nameFor(abilityTop))}</b></div><div><small>ХАРИУЛТЫН ТОО</small><b>36 / 36</b></div></div>
    <div class="chart-panel"><div class="chart-title"><b>RIASEC зургаан өнцөгт</b><span>Тэмдэглэгээний хэмжээ: 1, 2, 3-р өндөр онооны түвшин</span></div>${radarSvg("Тест №2 чадавхийн үнэлгээ", results.ability, "ability")}${riasecLegend()}<div class="chart-foot"><span><i class="dot big"></i> 1-р өндөр</span><span><i class="dot mid"></i> 2-р өндөр</span><span><i class="dot small"></i> 3-р өндөр</span></div></div>
    <div class="section-subhead"><b>Зургаан бүлгийн оноо</b><small>Бүлэг бүрийн дээд оноо 18</small></div><div class="score-table">${scoreRows(results.ability, "ability")}</div>
    <div class="interpretation"><b>Өөрийн үнэлгээг хэрхэн ашиглах вэ?</b><p>Өндөр оноотой бүлгүүд нь таны өөрөө хийж чадна гэж үнэлсэн үйл ажиллагааг харуулна. Энэ дүнг бодит туршлага, хичээлийн амжилт, багш болон ойр хүмүүсийн ажиглалттай харьцуулбал илүү бодитой эргэцүүлэл болно.</p></div>
    ${footer(5, code)}`;

  const profile = `
    ${pageHeader("ТЕСТ №3 · МЭРГЭЖЛИЙН ХЭВ ШИНЖ", "Хос мэргэжлийн сонголтын үр дүн", "42 хосын нүд бүрт хоёр мэргэжил өгөгдсөн. Нийт 84 мэргэжлийн нэрээс хос бүрт нэгийг сонгож, 42 сонголт бүртгэгдсэн.")}
    <div class="result-kpis"><div><small>ХОСЫН ТОО</small><b>42 хос</b></div><div><small>СОНГОЛТЫН ТОО</small><b>42 / 42</b></div><div><small>ТЭРГҮҮЛЖ БУЙ ЧИГЛЭЛ</small><b>${esc(nameFor(profileTop))}</b></div></div>
    <div class="profile-highlight"><div><small>ТЕСТ №3-ЫН ЭХНИЙ ХЭВ ШИНЖҮҮД</small><h3>${esc(nameFor(profileTop))}</h3><p>Хос бүрээс сонгосон мэргэжлийн өмнөх 1–6 кодыг RIASEC бүлгээр тоолсон.</p></div><div class="profile-count">42<small>сонголт</small></div></div>
    <div class="chart-panel profile-radar"><div class="chart-title"><b>RIASEC зургаан өнцөгт</b><span>Хос мэргэжлийн сонголтын давтамж · нийт 42</span></div>${radarSvg("Тест №3 мэргэжлийн хэв шинжийн үнэлгээ", results.profile, "profile")}${riasecLegend()}<div class="chart-foot"><span>Тэмдэглэгээний хэмжээ нь онооны эрэмбийн түвшинг харуулна</span></div></div>
    <div class="section-subhead"><b>Зургаан хэв шинжийн сонголтын давтамж</b><small>Нийлбэр 42</small></div><div class="score-table">${scoreRows(results.profile, "profile")}</div>
    <div class="profile-method"><b>Бөглөх зарчмын сануулга</b><p>Энэ хэсэгт хосын хоёр мэргэжлээс танд “арай дээр” санагдсан нэгийг сонгоно. Хоёулаа таалагдахгүй байсан ч харьцуулахад арай дээр гэж үзсэн нэгийг сонгодог. Тиймээс энэ дүн нь тухайн хосын харьцуулсан сонголтын давтамж юм.</p></div>
    ${footer(6, code)}`;

  const integrated = `
    ${pageHeader("ГУРВАН ТЕСТИЙН НЭГДСЭН ХАРЬЦУУЛАЛТ", "Сонирхол · Чадавх · Мэргэжлийн хэв шинж", "Гурван үнэлгээ тус бүрийн дүр зургийг жижиг графикаар, нэгдсэн давхцлыг том графикаар харуулав.")}
    <div class="mini-chart-grid">
      <div class="mini-chart-card"><b>01 · СОНИРХОЛ</b>${radarSvg("Тест №1 сонирхол", results.interest, "interest")}<small>${esc(nameFor(interestTop))}</small></div>
      <div class="mini-chart-card"><b>02 · ЧАДАВХ</b>${radarSvg("Тест №2 чадавх", results.ability, "ability")}<small>${esc(nameFor(abilityTop))}</small></div>
      <div class="mini-chart-card"><b>03 · МЭРГЭЖЛИЙН ХЭВ ШИНЖ</b>${radarSvg("Тест №3 мэргэжлийн хэв шинж", results.profile, "profile")}<small>${esc(nameFor(profileTop))}</small></div>
    </div>
    <div class="overlap-panel"><div class="chart-title"><b>Гурван тестийн нэгдсэн давхцал</b><span>Хэв шинж тус бүрийн давтамж · 0–3</span></div>${overlapRadarSvg(comparison)}</div>
    <div class="riasec-spectrum-wrap"><div class="spectrum-heading"><b>RIASEC · зургаан хэв шинж</b><small>Өнгөний код нь 3–6-р хуудсанд ашигласантай ижил</small></div>${riasecSpectrum()}</div>
    <div class="integrated-conclusion"><div><small>МЭРГЭЖЛИЙН ЗОНХИЛОХ ХЭВ ШИНЖ</small><b>${esc(dominantText)}</b></div><div><small>ДАГАЛДАХ ХЭВ ШИНЖ</small><b>${esc(secondaryText)}</b></div></div>
    <div class="comparison-narrative"><b>Давхцал ба зөрүүний тайлбар</b><p>${esc(patternText)}</p></div>
    <div class="tiny-note">Давтамж нь гурван тест тус бүрийн эхний гурван (гуравдугаар байранд тэнцсэн бол тэнцсэн бүх) хэв шинжид орсон тоог харуулна. Өөр хэмжүүрийн түүхий оноонуудыг хооронд нь нэмээгүй.</div>
    ${footer(7, code)}`;

  const personalized = `
    ${pageHeader("СУРАГЧИЙН RIASEC ҮНЭЛГЭЭНД СУУРИЛСАН ТОДОРХОЙЛОЛТ", "Таны мэргэжлийн чиг баримжааны хувийн дүгнэлт", "Таны сонирхол, өөрийн үнэлсэн чадавх, мэргэжлийн хос сонголтыг уялдуулан тайлбарлаж, судалж үзэх боломжит салбар, мэргэжлийн чиглэлийг тодорхойлов.")}
    <div class="personal-summary"><b>Таны хариултаас харагдаж буй ерөнхий зураглал</b>
      <p>Таны хариултаас харахад та ${esc(nameFor(interestTop))} хэв шинжтэй холбоотой үйл ажиллагаанд илүү сонирхолтой байж болох бөгөөд ${esc(nameFor(abilityTop))} чиглэлийн ур чадварыг өөртөө илүүтэй гэж үнэлжээ. Мэргэжлийн хос сонголтын үед ${esc(nameFor(profileTop))} чиглэлүүдийн сонголт харьцангуй олон давтагдсан байна.</p>
      <p>Гурван үнэлгээний эхний гурван үр дүнгийн давтамжаар ${esc(dominantText)} зонхилох, ${esc(secondaryText)} дагалдах хэв шинжээр илэрч байна. Иймээс эдгээр чиглэлийн огтлолцолд буй мэргэжил, ажлын орчныг эхэлж судлах нь зүйтэй.</p></div>
    <div class="personal-triad">
      <div><small>СОНИРХЛЫН ҮНЭЛГЭЭ</small><b>${esc(nameFor(interestTop))}</b><p>${esc(interestTop.map((code) => TYPE_COPY[code]?.description || "").filter(Boolean).join(" "))}</p></div>
      <div><small>ӨӨРИЙН ҮНЭЛСЭН ЧАДАВХ</small><b>${esc(nameFor(abilityTop))}</b><p>${esc(abilityTop.map((code) => TYPE_COPY[code]?.qualities || "").filter(Boolean).join(" "))}</p></div>
      <div><small>МЭРГЭЖЛИЙН ХОС СОНГОЛТ</small><b>${esc(nameFor(profileTop))}</b><p>42 хос мэргэжлээс сонгосон хариултын кодын давтамжид дээрх чиглэлүүд илүү олон илэрсэн байна.</p></div>
    </div>
    <div class="personal-fit"><b>Гурван үнэлгээний нийцэл ба ялгаа</b><p>${esc(patternText)}</p></div>
    <div class="section-subhead"><b>Танд судалж үзэхэд тохиромжтой байж болох салбар, мэргэжил</b><small>Зонхилох ба дагалдах хэв шинжийн уялдаа</small></div>
    <div class="personal-type-grid">${personalizedTypeCards(overviewCodes, dominantCodes)}</div>
    <div class="personal-caution"><b>Үр дүнг хэрхэн зөв ашиглах вэ?</b><p>Энэ тодорхойлолт нь таны ирээдүйн мэргэжил, авьяас, амжилтыг эцэслэн тогтоохгүй. Тестийн оноог бодит туршлага, дуртай хичээл, эзэмшсэн ур чадвар, үнэт зүйл, ажлын орчин болон тухайн мэргэжлийн сургалтын шаардлагатай харьцуулан эргэцүүлээрэй. Мэргэжил сонголтын эцсийн шийдвэрийг олон талын мэдээлэлд тулгуурлан гаргах нь зүйтэй.</p></div>
    ${footer(8, code)}`;

  const careers = `
    ${pageHeader("МЭРГЭЖЛИЙН СУДАЛГААНЫ ЧИГЛЭЛ", "Зонхилох хэв шинжид тохирох мэргэжлийн жишээ", "Зонхилох хэв шинжийн мэргэжлийн жишээг эхэлж, дагалдах хэв шинжийн боломжуудтай харьцуулан судлаарай.")}
    <div class="career-order"><span>ЗОНХИЛОХ ХЭВ ШИНЖ</span><b>${esc(dominantText)}</b><span>ДАГАЛДАХ ХЭВ ШИНЖ</span><b>${esc(secondaryText)}</b></div>
    <div class="career-grid">${careerCards(overviewCodes, dominantCodes.length)}</div>
    <div class="career-guidance"><b>Мэргэжил сонгохдоо өөрөөсөө асуугаарай</b><ol>
      <li>Энэ ажлын өдөр тутмын үйл ажиллагаа миний сонирхолд нийцэх үү?</li>
      <li>Шаардлагатай суурь хичээл, чадварыг эзэмшихэд бэлэн үү?</li>
      <li>Энэ мэргэжлийн бодит ажлын орчин, үүрэг хариуцлага надад тохирох уу?</li>
      <li>Ямар их, дээд сургууль болон хөтөлбөрөөр энэ мэргэжлийг эзэмшиж болох вэ?</li>
    </ol></div>
    ${footer(9, code)}`;

  const laborTrends = `
    ${pageHeader("ХӨДӨЛМӨРИЙН ЗАХ ЗЭЭЛИЙН СУДАЛГАА", "Ажил хөдөлмөр эрхлэлтийн ирээдүйн чиг хандлага", "Технологийн хөгжил, хүн ам зүйн өөрчлөлт, эдийн засгийн шинэ бүтэц, ногоон шилжилт нь мэргэжлийн эрэлт болон ажил үүргийн агуулгыг өөрчилж байна.")}
    <div class="labour-lead"><b>Ирээдүйн мэргэжлийг зөвхөн нэрээр нь бус, тухайн ажилд шаардагдах ур чадвар, өдөр тутмын үүргийн өөрчлөлттэй нь хамт судлах шаардлагатай.</b><p>Хөдөлмөрийн зах зээлийн прогноз нь тодорхой хугацаа, судалгаанд хамрагдсан ажил олгогчдын хүлээлтэд тулгуурладаг. Иймээс доорх тоон мэдээллийг баталгаатай ирээдүй гэж бус, одоогийн чиг хандлагын баримжаа гэж ойлгоно.</p></div>
    <div class="labour-stats">
      <div><small>МОНГОЛ УЛС · 2026 ОНЫ ТӨЛӨВ</small><b>82.6 мянга</b><span>Ажилтан авах хэрэгцээтэй ажлын байрны тооцоолол</span></div>
      <div><small>ДЭЛХИЙ · 2030 ОН ХҮРТЭЛ</small><b>+78 сая</b><span>170 сая шинээр бий болох, 92 сая шахагдах ажлын байрны цэвэр өсөлтийн төсөөлөл</span></div>
      <div><small>ХИЙМЭЛ ОЮУН УХААН</small><b>1/4</b><span>Дэлхийн ажиллагчдын генератив хиймэл оюуны нөлөөлөлд ямар нэг хэмжээгээр өртөж болох хувь</span></div>
    </div>
    ${labourTrendChart()}
    <div class="labour-columns">
      <div class="labour-panel growing"><h3>Эрэлт нь өсөх төлөвтэй салбар, мэргэжлүүд</h3><p class="panel-intro">Дэлхийн ажил олгогчдын 2025–2030 оны төсөөлөл болон технологи, хүн ам, эрчим хүчний шилжилтийн чиглэлд тулгуурласан жишээ.</p><ul>
        <li><b>Мэдээллийн технологи, өгөгдөл, хиймэл оюун:</b> хиймэл оюун ба машин сургалтын мэргэжилтэн, их өгөгдлийн шинжээч, програм хангамж хөгжүүлэгч, кибер аюулгүй байдлын мэргэжилтэн, өгөгдлийн сангийн инженер.</li>
        <li><b>Эрчим хүч, байгаль орчин, инженерчлэл:</b> сэргээгдэх эрчим хүчний инженер, байгаль орчны инженер, цахилгаан эрчим хүчний системийн мэргэжилтэн, автоматжуулалт ба роботын инженер, цахилгаан болон автомашины шинэ технологийн мэргэжилтэн.</li>
        <li><b>Эрүүл мэнд, боловсрол, нийгмийн үйлчилгээ:</b> сувилагч, асаргаа сувилгааны мэргэжилтэн, нөхөн сэргээх үйлчилгээний ажилтан, багш, нийгмийн ажилтан, сэтгэл зүйн зөвлөх.</li>
        <li><b>Дэд бүтэц, үйлдвэрлэл, логистик:</b> барилгын инженер, техникч, засвар үйлчилгээний мэргэжилтэн, нийлүүлэлтийн сүлжээ ба логистикийн шинжээч, үйлдвэрлэлийн автоматжуулалтын техникч.</li>
        <li><b>Хөдөө аж ахуй, хүнсний үйлдвэрлэл:</b> агротехнологич, хүнсний технологич, мал эмнэлгийн мэргэжилтэн, хүнсний аюулгүй байдал ба чанарын хяналтын мэргэжилтэн.</li>
      </ul></div>
      <div class="labour-panel exposed"><h3>Эрэлт буурах, автоматжуулалтад өртөх эрсдэлтэй ажил</h3><p class="panel-intro">Олон улсын прогнозод дараах ажил, үүргийн эрэлт буурах хүлээлт өндөр гарсан.</p><ul>
        <li>Касс, тасалбар борлуулалтын ажилтан.</li>
        <li>Захиргааны туслах, нарийн бичгийн даргын хэвшмэл ажил үүрэг.</li>
        <li>Хэвлэлийн үйлдвэрлэлийн зарим давтагддаг ажил.</li>
        <li>Нягтлан бодох бүртгэл, аудитын стандартчилсан, давтагддаг даалгаврын хэсэг.</li>
        <li>Мэдээлэл шивэх, бүртгэл шинэчлэх, баримт боловсруулах зэрэг дүрэмчилж болох ажлууд.</li>
      </ul><div class="automation-caveat"><b>Чухал ялгаа:</b> Эдгээр мэргэжил бүрэн устах нь баталгаатай гэсэн үг биш. Харин автоматжуулалт, хиймэл оюун ухааны нөлөөгөөр зарим ажлын байр, давтагддаг даалгаврын хэрэгцээ буурч, үлдэх ажил нь илүү нарийн ур чадвар шаардаж болзошгүй.</div></div>
    </div>
    <div class="skill-band"><b>Өөрчлөгдөж буй зах зээлд хэрэгтэй ур чадвар</b><span>Дижитал болон хиймэл оюуны бичиг үсэг · өгөгдөлд суурилсан сэтгэлгээ · шүүмжлэлт сэтгэлгээ · асуудал шийдвэрлэх · бүтээлч байдал · харилцаа, хамтын ажиллагаа · дасан зохицох чадвар · тасралтгүй суралцах дадал.</span></div>
    <div class="labour-context"><b>Монгол Улсын нөхцөл байдлын баримжаа</b><p>Гэр бүл, хөдөлмөр, нийгмийн хамгааллын яамны 2026 оны Хөдөлмөрийн зах зээлийн эрэлтийн барометрийн мэдээллээр тухайн жилд 82.6 мянган ажлын байранд ажилтан авах хэрэгцээ тооцоолсон. Үүний 90.7 хувь буюу 74.9 мянга нь байнгын ажлын байр; 53.2 хувь нь шинэ ажлын байр, 46.8 хувь нь сул ажлын байрыг нөхөх хэрэгцээ гэж тайлагнажээ. Энэ бол 2026 оны жилийн эрэлтийн тооцоо бөгөөд 2030 он хүртэлх мэргэжил тус бүрийн прогноз биш.</p></div>
    <div class="source-note labour-sources"><b>Судалгааны эх сурвалж</b><p>Гэр бүл, хөдөлмөр, нийгмийн хамгааллын яам, “2026 онд 82.6 мянган ажлын байранд ажилтан авах хэрэгцээ бий болно” (2026.06.04), https://mlsp.gov.mn/content/detail/4102; World Economic Forum, <i>The Future of Jobs Report 2025</i>, Figure 2.2 (ажлын байрны цэвэр өсөлт, бууралтын хувь), https://reports.weforum.org/docs/WEF_Future_of_Jobs_Report_2025.pdf; International Labour Organization, <i>Generative AI and Jobs: A Refined Global Index of Occupational Exposure</i> (2025.05.20), https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure. Олон улсын прогноз нь Монголын бүх салбарт ижил хэмжээгээр хэрэгжинэ гэсэн үг биш.</p></div>
    ${footer(10, code)}`;

  const rankingUniversities = [
    "Монгол Улсын Их Сургууль|Улаанбаатар",
        "Шинжлэх ухаан, технологийн их сургууль|Улаанбаатар",
        "Санхүү, эдийн засгийн их сургууль|Улаанбаатар",
        "Анагаахын шинжлэх ухааны үндэсний их сургууль|Улаанбаатар",
        "Хөдөө аж ахуйн их сургууль|Улаанбаатар",
        "Монгол Улсын Боловсролын Их Сургууль|Улаанбаатар",
        "Отгонтэнгэр их сургууль|Улаанбаатар",
        "Соёл урлагийн их сургууль|Улаанбаатар",
        "Хүрээ дээд сургууль|Улаанбаатар",
        "Олон улсын Улаанбаатарын их сургууль|Улаанбаатар",
        "Этүгэн их сургууль|Сүхбаатар",
        "Ховд их сургууль|Ховд",
        "Монголын олон улсын их сургууль|Улаанбаатар",
        "Идэр их сургууль|Улаанбаатар",
        "Удирдлагын академи|Улаанбаатар",
        "Эм зүйн шинжлэх ухааны их сургууль|Улаанбаатар",
        "Монгол-Германы хамтарсан ашигт малтмал, технологийн их сургууль|Улаанбаатар",
        "Глобал манлайлал их сургууль|Улаанбаатар",
        "Их Засаг их сургууль|Улаанбаатар",
        "Соёл-Эрдэм дээд сургууль|Улаанбаатар",
        "Улаанбаатарын улсын их сургууль|Улаанбаатар",
        "Мандах их сургууль|Улаанбаатар",
        "Хүмүүнлэгийн ухааны их сургууль|Улаанбаатар",
        "Монголын үндэсний их сургууль|Улаанбаатар",
        "Сити их сургууль|Улаанбаатар",
        "Инженер, технологийн дээд сургууль|Улаанбаатар",
        "Орхон их сургууль|Улаанбаатар",
        "Дорнод их сургууль|Чойбалсан",
        "Цэцээ гүн менежментийн институт|Улаанбаатар",
        "Монгол Улсын Консерватори|Улаанбаатар",
        "Номера институт|Улаанбаатар",
        "Олон улс судлалын хүрээлэн|Улаанбаатар",
        "Монголын үндэсний биеийн тамирын институт|Улаанбаатар",
        "Эдийн засгийн үндэсний их сургууль|Улаанбаатар",
        "Сан их сургууль|Улаанбаатар",
        "Отч Манрамба их сургууль|Улаанбаатар",
        "Мон-Алтиус институт|Улаанбаатар",
        "Боловсрол, соёл, эрх зүйн дээд сургууль|Улаанбаатар",
        "Аварга институт|Улаанбаатар",
        "Ач анагаах ухааны их сургууль|Улаанбаатар",
        "Шихихутуг хууль зүйн дээд сургууль|Улаанбаатар",
        "Олон улсын эдийн засаг, бизнесийн их сургууль|Улаанбаатар",
        "Засагт хан институт|Улаанбаатар",
        "Хангай их сургууль|Улаанбаатар",
        "Дархан их сургууль|Дархан",
        "Энерэл анагаах ухааны дээд сургууль|Улаанбаатар",
        "Улаанбаатар их сургууль|Улаанбаатар",
        "Шинэ анагаах ухааны институт|Улаанбаатар",
        "Үндэсний техникийн их сургууль|Улаанбаатар",
        "Шинэ иргэншил политехник коллеж|Улаанбаатар"
  ];
  const rankingColumn = (start, end) => rankingUniversities.slice(start, end).map((entry, index) => { const [university, city] = entry.split("|"); return `<div class="rank-row"><b>${start + index + 1}</b><span>${esc(university)}</span><small>${esc(city)}</small></div>`; }).join("");
  const universityRankings = `
    ${pageHeader("ИХ, ДЭЭД СУРГУУЛИЙН МЭДЭЭЛЭЛ", "Монголын их, дээд сургуулиудын жагсаалт", "2026 оны uniRank-ийн 62 байгууллагатай жагсаалтын 1–50-р байрыг харуулав. Энэ нь веб хэмжүүрт суурилсан академик бус эрэмбэ бөгөөд сургалтын чанарын баталгаат үнэлгээ биш.")}
    <div class="ranking-explainer"><b>Эрэмбийг хэрхэн ойлгох вэ?</b><p>Энэ бол uniRank-ийн 2026 оны, веб орчин дахь харагдац зэрэг хараат бус веб хэмжүүрт тулгуурласан <b>академик бус жагсаалт</b> юм. Сургалтын чанар, магадлан итгэмжлэл, төгсөгчдийн ажил эрхлэлт, тухайн хөтөлбөрийн давуу талыг дангаар нотлохгүй.</p><p>Боловсролын яам 2026 оны хагас жилийн тайландаа үндэсний эрэмбэ, чансааг шинэчлэх өгөгдлийг бүрдүүлж, баталгаажуулах ажил үргэлжилж байгааг мэдээлсэн. Иймээс доорх веб жагсаалтыг Монгол Улсын албан ёсны үндэсний чанарын эрэмбэ гэж ойлгохгүй.</p></div>
    <div class="rank-columns"><div>${rankingColumn(0,25)}</div><div>${rankingColumn(25,50)}</div></div>
    <div class="ranking-source"><b>Эх сурвалж</b><p>uniRank, <i>2026 Mongolian University Ranking</i> (нийт 62 байгууллага; эх жагсаалтын 1–50-р байр): https://www.unirank.org/mn/ranking/. Боловсрол, шинжлэх ухааны яам, 2026 оны хагас жилийн гүйцэтгэлийн тайлан: moe.gov.mn/post/176799. Жагсаалтын эрэмбэ нь вэб хэмжүүрийн дараалал болохоос чанарын гэрчилгээ, зөвлөмж биш.</p></div>
    ${footer(11, code)}`;

  const admissions = `
    ${pageHeader("ИХ, ДЭЭД СУРГУУЛИЙН МЭДЭЭЛЭЛ", "Суралцах чиглэл ба элсэлтийн шаардлага", "Сургуулийн ерөнхий нэр хүндээс гадна сонгосон хөтөлбөрийн агуулга, элсэлтийн хичээл, босго оноо, нэмэлт шалгуур болон ажлын боломжийг хамтад нь харьцуулаарай.")}
    <div class="admission-intro"><b>Доорх жишээнүүд нь 2026–2027 оны хичээлийн жилийн албан ёсны элсэлтийн мэдээлэлд тулгуурлав.</b><p>Элсэлтийн хичээл, босго оноо жил бүр шинэчлэгдэж болох тул бүртгүүлэхээсээ өмнө тухайн хөтөлбөрийн хамгийн сүүлийн журамтай дахин тулгана.</p></div>
    <div class="university-grid">
      <article class="university-card"><h3>Монгол Улсын Их Сургууль · МУИС</h3><p><b>Судлах боломжтой чиглэл:</b> байгалийн ухаан, математик, мэдээллийн технологи, нийгэм-хүмүүнлэг, эрх зүй, бизнес, олон улсын харилцаа зэрэг олон салбарын бакалаврын хөтөлбөр.</p><p><b>Элсэлтийн нөхцөл:</b> 2026–2027 оны бакалаврын өдрийн элсэлтийн журам нийтлэгдсэн. Суурь болон дагалдах шалгалтын хослол, босго оноо нь сонгосон хөтөлбөрөөс хамаарч өөр байна; хөтөлбөрийн мэдээллийг элсэлтийн системээс тус бүр шалгана.</p><small>Албан ёсны эх сурвалж: elselt.num.edu.mn · burtgel.num.edu.mn</small></article>
      <article class="university-card"><h3>Шинжлэх Ухаан, Технологийн Их Сургууль · ШУТИС</h3><p><b>Судлах чиглэл:</b> инженерчлэл, технологи, хэрэглээний математик, статистик, үйлдвэрлэл, эрчим хүч, байгаль орчны инженерчлэл.</p><p><b>2026–2027 оны жишээ · Статистик:</b> суурь хичээл Математик эсвэл Физик — 490; дагалдах хичээл Нийгэм судлал эсвэл Англи хэл — 450. Сургалтын хугацаа 4 жил.</p><small>Албан ёсны эх сурвалж: sas.must.edu.mn/en/page/1093 · elselt.edu.mn</small></article>
      <article class="university-card"><h3>Анагаахын Шинжлэх Ухааны Үндэсний Их Сургууль · АШУҮИС</h3><p><b>Судлах чиглэл:</b> хүний их эмч, уламжлалт анагаах ухаан, сувилахуй, эм зүй, нийгмийн эрүүл мэнд болон эрүүл мэндийн тусламж үйлчилгээ.</p><p><b>2026–2027 оны жишээ · Хүний их эмч:</b> ЭЕШ-1 Хими эсвэл Математик — 490; ЭЕШ-2 Биологи эсвэл Физик — 490. <b>Уламжлалт анагаахын их эмч:</b> эхний бүлэг 440, хоёр дахь бүлэг 490.</p><small>Албан ёсны эх сурвалж: mnums.edu.mn/admission/requirements · admission.mnums.edu.mn</small></article>
      <article class="university-card"><h3>Дотоод хэргийн их сургууль · ДХИС</h3><p><b>Судлах чиглэл:</b> хууль сахиулах, цагдаа, хил хамгаалалт, онцгой байдал, шүүхийн шийдвэр гүйцэтгэл, шинжлэн магадлах ухаан, сэтгэл судлал, нийгмийн ажил.</p><p><b>2026–2027 оны жишээ · 4 жилийн хөтөлбөр:</b> Сэтгэл судлал — суурь Нийгэм судлал/Математик 490; хавсарга Монгол хэл/Англи хэл 490. Нийгмийн ажил — суурь Нийгэм судлал/Англи хэл 490; хавсарга Монгол хэл/Математик 500. ДХИС-ийн 2026 оны №117 журмын дагуу элсэгч 17–26 настай байх, эрүүл мэнд, бие бялдар, сэтгэл зүйн сорил, ярилцлагын шаардлага хангасан байна; эдгээр хоёр хөтөлбөрт эрэгтэй 165 см, эмэгтэй 160 см-ээс доошгүй өндөртэй байх тусгай шалгуур мөн үйлчилнэ.</p><small>Албан ёсны эх сурвалж: uia.gov.mn · elselt.uia.gov.mn · элсэлтийн журам (2026.03.30, №117)</small></article>
    </div>
    <div class="admission-a34"><b>2026.02.06-ны А/34 тушаалын хавсралт · 157-р мөр · 071405 Программ хангамжийн инженерчлэл</b><p>Суурь шалгалт — Математик/Физик: 490 оноо; дагалдах шалгалт — Нийгэм судлал/Англи хэл: 450 оноо. Энэ нь хавсаргасан хүснэгтийн мэргэжлийн чиглэлийн босго бөгөөд тухайн сургуулийн жилийн нэмэлт шаардлагыг орлохгүй.</p></div>
    <div class="admission-check"><b>Хөтөлбөрөө сонгохын өмнө дараах мэдээллийг заавал нягтлаарай</b><ol>
      <li>Хөтөлбөрийн нэр, индекс, суралцах хугацаа, сургалтын агуулга.</li>
      <li>Суурь болон дагалдах ЭЕШ-ын хичээл, хичээл тус бүрийн босго оноо.</li>
      <li>Ур чадвар, бие бялдар, ярилцлага болон бусад тусгай шалгалт байгаа эсэх.</li>
      <li>Магадлан итгэмжлэл, дадлага хийх боломж, сургалтын орчин.</li>
      <li>Сургалтын төлбөр, тэтгэлэг, байршил, дотуур байр, төгсөгчдийн ажил эрхлэлтийн мэдээлэл.</li>
    </ol></div>
    <div class="admission-warning"><b>Босго оноо нь элсэх баталгаа биш</b><p>Босго оноо нь тухайн хөтөлбөрт өрсөлдөх доод шаардлагыг илэрхийлнэ. Элсэгчдийн онооны эрэмбэ, батлагдсан хяналтын тоо, нэмэлт шалгуур болон сургуулийн дотоод журмаар эцсийн шалгаруулалт хийгддэг.</p></div>
    <div class="admission-sources"><b>Эх сурвалжийн тэмдэглэл</b><p>МУИС-ийн 2026–2027 оны элсэлтийн журам: elselt.num.edu.mn; ШУТИС-ийн хөтөлбөр, суурь болон дагалдах хичээлийн жагсаалт: sas.must.edu.mn/en/page/1093; АШУҮИС-ийн 2026–2027 оны босго оноо, шалгалтын шаардлага: mnums.edu.mn/admission/requirements; ДХИС-ийн захирлын 2026.03.30-ны №117 тушаалын хавсралт: sis.uia.gov.mn/files/admission/2026-2027_оны_хичээлийн_жилийн_4_жил_иргэн.pdf. Энэ бол сонгосон хөтөлбөрүүдийн жишээ мэдээлэл бөгөөд бүх сургуулийн бүрэн жагсаалт биш. А/34 тушаалын жишээ нь хавсаргасан албан хүснэгтийн 157-р мөр (071405 индекс)-д тулгуурлав.</p></div>
    ${footer(12, code)}`;

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
    <div class="disclaimer"><b>Санамж</b><p>Энэ тайлан нь өөрийгөө танин мэдэх, мэргэжлийн боломжоо судлахад туслах мэдээлэл юм. Тестийн үр дүн нь мэргэжил сонголтын эцсийн шийдвэр, сэтгэл зүйн онош, амжилтын баталгаа биш. Сонголтоо бодит туршлага, сургалтын шаардлага, өөрийн үнэт зүйл болон зөвлөгөөтэй хамтатган гаргаарай.</p></div>
    <div class="source-note"><b>Агуулгын эх сурвалж</b><p>“Мэргэжил сонголтын Дж. Холландын арга” (9–12 анги) аргачлалын RIASEC тайлбар, Алхам 4–5; “Holland test- асуумж” эх асуумж. Мэргэжлийн жишээг аргачлалын Алхам 5-ын жагсаалтаас сонгов. Элсэлтийн хөтөлбөрийн жишээг 2026–2027 оны сургуулиудын албан ёсны мэдээлэлтэй тулгасан; элсэх жилийн журамтай дахин нягтална.</p></div>
    ${footer(13, code)}`;

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
  .cover-contact{display:flex;gap:8mm;flex-wrap:wrap;margin-top:2mm;color:#52736c;font-size:7pt;letter-spacing:.04em}
  .ranked-type{display:flex;gap:1.6mm;align-items:baseline;font-size:7pt;line-height:1.35;margin:.7mm 0;color:#4f665e}
  .ranked-type b{min-width:5mm;color:#d18a56;font-size:6.5pt}
  .summary-ranks{margin:1.5mm 0;min-height:15mm}
  .english-type{display:block;font-size:6.7pt;color:#327c79;margin:-.5mm 0 1mm;letter-spacing:.02em}
  .riasec-legend{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2mm 2mm;margin:1mm 0 2mm}
  .riasec-legend span{display:flex;align-items:center;gap:1.5mm;font-size:5.8pt;color:#586c63}
  .riasec-legend b{display:inline-grid;place-items:center;width:5mm;height:5mm;border-radius:50%;background:var(--type);color:#fff;font-size:6pt;flex:none}
  .profile-radar{margin:2mm 0}
  .mini-chart-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm;margin:1mm 0 3mm}
  .mini-chart-card{border:1px solid #e1eae4;border-radius:3mm;padding:1.5mm;text-align:center;min-width:0}
  .mini-chart-card>b{display:block;font-size:5.8pt;letter-spacing:.04em;color:#6e8178;min-height:6mm}
  .mini-chart-card .radar{width:53mm;height:39mm;margin:0 auto}
  .mini-chart-card>small{display:block;font-size:5.8pt;line-height:1.22;color:#327c79;min-height:6mm;margin-top:-1mm}
  .overlap-panel{height:77mm;background:#f5f8f4;border:1px solid #e1eae4;border-radius:4mm;padding:2.5mm 4mm;margin-bottom:2mm}
  .overlap-chart{display:block;width:145mm;height:67mm;margin:0 auto}
  .riasec-spectrum-wrap{margin:1.5mm 0 2mm}
  .spectrum-heading{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1mm}
  .spectrum-heading b{font-size:7.5pt;color:#24443f}
  .spectrum-heading small{font-size:5.6pt;color:#87958e}
  .riasec-spectrum{display:grid;grid-template-columns:repeat(6,1fr);gap:1.3mm}
  .riasec-spectrum>div{min-width:0;text-align:center;border-radius:2mm;padding:1.4mm .5mm;background:#f3f6f2;border-top:1.7mm solid var(--type)}
  .riasec-spectrum b,.riasec-spectrum strong,.riasec-spectrum span{display:block}
  .riasec-spectrum b{font-family:Georgia,serif;font-size:10pt;color:var(--type)}
  .riasec-spectrum strong{font-size:5.5pt;color:#49645a}
  .riasec-spectrum span{font-size:5.1pt;line-height:1.15;color:#829087;margin-top:.5mm}
  .integrated-conclusion{display:grid;grid-template-columns:1fr 1fr;gap:2mm;margin:1.5mm 0}
  .integrated-conclusion>div{background:#21423e;color:#fffefa;border-radius:2.5mm;padding:2mm 3mm}
  .integrated-conclusion small,.integrated-conclusion b{display:block}
  .integrated-conclusion small{font-size:5.6pt;letter-spacing:.08em;opacity:.8}
  .integrated-conclusion b{font-size:7.6pt;margin-top:.5mm}
  .personal-summary{background:#f1f6f1;border-left:1.5mm solid #327c79;border-radius:3mm;padding:4mm 5mm;margin-bottom:3mm}
  .personal-summary>b{font-size:8.5pt}
  .personal-summary p{font-size:7.2pt;line-height:1.42;color:#62736b;margin:1.5mm 0 0}
  .personal-fit{padding:3mm 4mm;border:1px solid #e2ebe4;border-radius:3mm;margin:2mm 0 3mm}
  .personal-fit b{font-size:7.4pt}
  .personal-fit p{font-size:6.4pt;line-height:1.35;color:#69776f;margin:1mm 0 0}
  .personal-triad{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm;margin:3mm 0}
  .personal-triad>div{border:1px solid #e1eae4;border-radius:3mm;padding:3mm}
  .personal-triad small,.personal-triad b{display:block}
  .personal-triad small{font-size:5.8pt;letter-spacing:.07em;color:#83918a}
  .personal-triad b{font-size:7.2pt;color:#327c79;margin:1mm 0}
  .personal-triad p{font-size:6.1pt;line-height:1.32;color:#6b7a72;margin:0}
  .personal-type-grid{display:grid;grid-template-columns:1fr 1fr;gap:2mm}
  .personal-type{border:1px solid #e1e9e4;border-top:1.5mm solid var(--type);border-radius:2.5mm;padding:2.7mm;break-inside:avoid}
  .personal-type-head{display:flex;align-items:center;gap:2mm;margin-bottom:1mm}
  .personal-type-head .type-code{width:6mm;height:6mm;font-size:6.5pt}
  .personal-type-head small,.personal-type-head b{display:block}
  .personal-type-head small{font-size:5.3pt;color:#829188;letter-spacing:.06em}
  .personal-type-head b{font-size:8pt;color:#24443f}
  .personal-type>p{font-size:6.3pt;line-height:1.3;color:#687970;margin:0 0 1.4mm}
  .personal-type>div:not(.personal-type-head){margin-top:1mm}
  .personal-type>div>small{display:block;font-size:5.3pt;color:#89958e;letter-spacing:.06em}
  .personal-type>div>span{display:block;font-size:6pt;line-height:1.3;color:#50665d}
  .personal-caution{margin-top:3mm;background:#fff5eb;border-left:1.5mm solid #d18a56;border-radius:2mm;padding:3mm 4mm}
  .personal-caution b{font-size:7.5pt}
  .personal-caution p{font-size:6.4pt;line-height:1.35;color:#6d7169;margin:1mm 0 0}
  .labour-lead{border-left:1.5mm solid #327c79;background:#f1f6f1;border-radius:2.5mm;padding:3.5mm 4mm;margin-bottom:3mm}
  .labour-lead b{font-size:8.5pt;color:#284b44}
  .labour-lead p{font-size:6.8pt;color:#64756d;margin:1mm 0 0;line-height:1.4}
  .labour-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm;margin:3mm 0}
  .labour-stats>div{border-radius:3mm;padding:3mm;background:#f2f6f2}
  .labour-stats small,.labour-stats b,.labour-stats span{display:block}
  .labour-stats small{font-size:5.5pt;letter-spacing:.07em;color:#7d8d85}
  .labour-stats b{font-family:Georgia,serif;font-size:16pt;color:#327c79;margin:1mm 0}
  .labour-stats span{font-size:5.8pt;line-height:1.25;color:#66766e}
  .labour-columns{display:grid;grid-template-columns:1.08fr .92fr;gap:2.5mm}
  .labour-panel{border:1px solid #e1e9e4;border-radius:3mm;padding:3mm}
  .labour-panel h3{font-family:Georgia,serif;font-size:11.5pt;font-weight:500;color:#24443f;margin:0 0 1.2mm}
  .panel-intro{font-size:6.2pt;line-height:1.3;color:#6b7a72;margin:0 0 1.5mm}
  .labour-panel ul{margin:0;padding-left:3.8mm}
  .labour-panel li{font-size:5.8pt;line-height:1.3;color:#5b6c63;margin-bottom:1.25mm}
  .labour-panel li b{color:#38584e}
  .exposed{background:#fffaf4}
  .automation-caveat{margin-top:1.5mm;border-top:1px solid #f0e6d8;padding-top:1.5mm;font-size:5.7pt;line-height:1.3;color:#805f4c}
  .skill-band{background:#21423e;color:#fffefa;border-radius:3mm;padding:3mm 4mm;margin:2.5mm 0}
  .skill-band b,.skill-band span{display:block}
  .skill-band b{font-size:7.2pt}
  .skill-band span{font-size:5.8pt;line-height:1.3;color:#deebe3;margin-top:1mm}
  .labour-context{border:1px solid #e1e9e4;border-radius:3mm;padding:2.5mm 3.5mm;margin:2.5mm 0}
  .labour-context b{font-size:6.8pt}
  .labour-context p{font-size:5.8pt;line-height:1.3;color:#697971;margin:1mm 0 0}
  .labour-sources{margin-top:1mm;padding-top:1mm}
  .labour-sources p{font-size:5.1pt;line-height:1.25}
  .labour-chart{display:grid;grid-template-columns:1fr 1fr;gap:3mm;padding:2.5mm 3.5mm;border:1px solid #e1e9e4;border-radius:3mm;margin:2.5mm 0}
  .labour-chart h4{font-size:6.5pt;color:#36584f;margin:0 0 1.3mm}
  .labour-bar-row{display:grid;grid-template-columns:36mm 1fr 9mm;align-items:center;gap:1.2mm;margin:.8mm 0}
  .labour-bar-row>span{font-size:5.2pt;line-height:1.12;color:#64736c}
  .labour-bar-row>b{font-size:5.7pt;text-align:right;color:#38594f}
  .labour-bar-track{height:2.2mm;background:#edf1ec;border-radius:2mm;overflow:hidden}
  .labour-bar-track i{display:block;height:100%;border-radius:2mm}
  .growth-bar{background:#5d9b77}
  .decline-bar{background:#d18a56}
  .labour-chart>p{grid-column:1/-1;margin:.5mm 0 0;font-size:5pt;line-height:1.2;color:#89958e}
  .rank-columns{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin:2mm 0}
  .rank-row{display:grid;grid-template-columns:6mm 1fr 19mm;gap:1.2mm;align-items:center;padding:1.1mm 0;border-bottom:1px solid #edf0eb}
  .rank-row>b{display:grid;place-items:center;width:5.5mm;height:5.5mm;border-radius:50%;background:#edf4ee;color:#327c79;font-size:6pt}
  .rank-row>span{font-size:6pt;line-height:1.15;color:#435b51}
  .rank-row>small{font-size:5.2pt;text-align:right;color:#89958e}
  .ranking-explainer{background:#f1f6f1;border-left:1.5mm solid #327c79;border-radius:3mm;padding:3mm 4mm;margin-bottom:2.5mm}
  .ranking-explainer>b{font-size:7.6pt}
  .ranking-explainer p{font-size:6.1pt;line-height:1.3;color:#66766e;margin:1mm 0 0}
  .ranking-source p{font-size:5.5pt;line-height:1.25;color:#78857d;margin:1mm 0 0}
  .admission-a34{background:#f4f7f1;border:1px solid #dfe9e1;border-radius:3mm;padding:2.5mm 3.5mm;margin:2mm 0}
  .admission-a34>b{font-size:7pt;color:#327c79}
  .admission-a34 p{font-size:6pt;line-height:1.3;color:#66766e;margin:1mm 0 0}
  .admission-intro{background:#eef5ef;border-radius:3mm;padding:3mm 4mm;margin-bottom:3mm}
  .admission-intro b{font-size:8pt}
  .admission-intro p{font-size:6.8pt;color:#687970;margin:1mm 0 0}
  .university-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm}
  .university-card{border:1px solid #e1e9e4;border-top:1.5mm solid #5d9b77;border-radius:2.5mm;padding:3mm;break-inside:avoid}
  .university-card h3{font-family:Georgia,serif;font-size:10pt;font-weight:500;color:#24443f;margin:0 0 1.5mm}
  .university-card p{font-size:6.3pt;line-height:1.32;color:#607168;margin:1mm 0}
  .university-card small{font-size:5.6pt;color:#327c79}
  .admission-check{border:1px solid #e1e9e4;border-radius:3mm;padding:3mm 4mm;margin:3mm 0}
  .admission-check b{font-size:7.8pt}
  .admission-check ol{margin:1mm 0 0;padding-left:5mm;columns:2;column-gap:7mm}
  .admission-check li{font-size:6.1pt;color:#63746b;margin-bottom:1mm;break-inside:avoid}
  .admission-sources p{font-size:5.3pt;line-height:1.25}
  `;
  const pages = [
    page(cover, 1, code, "cover"),
    page(summary, 2, code),
    page(holland, 3, code),
    page(interest, 4, code),
    page(ability, 5, code),
    page(profile, 6, code),
    page(integrated, 7, code),
    page(personalized, 8, code),
    page(careers, 9, code),
    page(laborTrends, 10, code),
    page(universityRankings, 11, code),
    page(admissions, 12, code),
    page(worksheet, 13, code)
  ];
  return `<!doctype html><html lang="mn"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Мэргэжлийн чиг баримжааны тайлан — ${name}</title><style>${style}</style></head><body>${pages.join("")}</body></html>`;
}
