/* =========================================================
   2P Gestão & Tecnologia — scripts globais
   Edite os dados da empresa em SITE (vale para todas as páginas)
   ========================================================= */
const SITE = {
  nome: "2P Gestão & Tecnologia",
  razao: "2P Gestão e Tecnologia",
  cnpj: "65.455.598/0001-59",
  telefone: "+55 11 96842-6457",
  whatsapp: "5511968426457",            // só números, com DDI + DDD
  email: "contato@2pgestaoetecnologia.com.br",
  dominio: "2pgestaoetecnologia.com.br",
  cidade: "São Paulo - SP",
  horario: "Seg a Sex, 8h às 18h",
  formularioExterno: "",                // opcional: link de Google Forms/Typeform. Vazio = usa o formulário do site
  redes: {
    instagram: "#",
    linkedin: "#",
  },
  // Clientes atendidos: coloque o arquivo do logo em assets/img/clientes/ e informe o nome em "logo".
  // Enquanto "logo" estiver vazio, aparece o nome da empresa no lugar.
  clientes: [
    { nome: "Pissani", detalhe: "Massas Gourmet", logo: "pissani.png" },
    { nome: "La Firenze", detalhe: "Massas Artesanais", logo: "la-firenze.png" },
    { nome: "Intermezzo", detalhe: "Carnes", logo: "intermezzo.png" },
    { nome: "GLA Ice", detalhe: "Gelo & Distribuição", logo: "gla-ice.png" },
    { nome: "Lamari", detalhe: "Confecção", logo: "lamari.png" },
    { nome: "Blue Basic", detalhe: "Loja de roupas", logo: "blue-basic.png" },
    { nome: "Sr. Batata Fries", detalhe: "Batata frita para eventos", logo: "sr-batata-fries.png" },
    { nome: "Linguiçaria do Chef (LDC)", detalhe: "Frigorífico", logo: "ldc.png" },
    { nome: "VMP Ateliê", detalhe: "Ateliê de artesanatos", logo: "vmp-atelie.png" },
  ],
};

/* ---------- Conteúdo editável (pasta content/, editada pelo painel /admin) ----------
   Os valores acima e os textos do HTML valem como padrão; o que estiver
   nos arquivos content/*.json substitui. */
const CONTENT = {};

async function loadContent() {
  const get = (n) => fetch(`content/${n}.json`, { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const timeout = new Promise((r) => setTimeout(() => r([]), 3000));
  const nomes = ["empresa", "inicio", "sobre", "clientes", "depoimentos"];
  const dados = await Promise.race([Promise.all(nomes.map(get)), timeout]);
  nomes.forEach((n, i) => { CONTENT[n] = dados[i] || null; });

  const e = CONTENT.empresa;
  if (e) {
    Object.keys(e).forEach((k) => { if (k !== "instagram" && k !== "linkedin" && e[k] !== undefined) SITE[k] = e[k]; });
    SITE.redes = { instagram: e.instagram || "#", linkedin: e.linkedin || "#" };
  }
  if (CONTENT.clientes && Array.isArray(CONTENT.clientes.clientes)) SITE.clientes = CONTENT.clientes.clientes;
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// **negrito**, *destaque colorido* e quebra de linha
const rich = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.+?)\*/g, '<span class="text-grad">$1</span>')
  .replace(/\n/g, "<br>");
const assetPath = (p) => String(p).replace(/^\//, "");

function applyTexts() {
  document.querySelectorAll("[data-c]").forEach((el) => {
    const [grupo, campo] = el.dataset.c.split(".");
    const v = CONTENT[grupo] && CONTENT[grupo][campo];
    if (v === undefined || v === null || v === "") return;
    if (el.tagName === "IMG") { el.src = assetPath(v); return; }
    el.innerHTML = "paras" in el.dataset
      ? String(v).split(/\n\s*\n/).map((p) => `<p>${rich(p.trim())}</p>`).join("")
      : rich(v);
  });
}

/* ---------- Ícones (SVG inline) ---------- */
const ICONS = {
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  web: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M7 6.5h.01M10 6.5h.01"/>',
  sparkles: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  clipboard: '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9z"/><path d="M9 14l2 2 4-4"/>',
  zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 00-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 012-3.9A12.9 12.9 0 0122 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 01-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  doc: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "arrow-left": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  store: '<path d="M3 9l1-5h16l1 5"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/>',
  food: '<path d="M3 2v7a3 3 0 003 3v10M9 2v7M6 2v4"/><path d="M18 22V2c-2.5 1-4 3.5-4 7v4h4"/>',
  factory: '<path d="M2 20V9l6 4V9l6 4V4h4l2 16z"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  plug: '<path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7"/>',
  mobile: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
  code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 000 20c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0022 11c0-5-4.5-9-10-9z"/>',
  camera: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
  thermo: '<path d="M14 14.8V3.5a2.5 2.5 0 00-5 0v11.3a4.5 4.5 0 105 0z"/>',
  bell: '<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
  qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
};
const WHATS_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 012.2 12C2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 012.9 6.9c0 5.4-4.4 9.8-9.8 9.8zM20.5 3.5A11.9 11.9 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6A12 12 0 0012 24c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.5z"/></svg>';

function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}
const waLink = (msg) => `https://wa.me/${SITE.whatsapp}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;

/* ---------- Header e rodapé (um único lugar para editar) ---------- */
function renderHeader() {
  const el = document.querySelector("[data-header]");
  if (!el) return;
  const page = document.body.dataset.page;
  const links = [
    ["inicio", "index.html", "Início"],
    ["servicos", "servicos.html", "Serviços"],
    ["sistemas", "servicos.html#sistemas", "Sistemas"],
    ["sobre", "sobre.html", "Sobre nós"],
    ["depoimentos", "index.html#depoimentos", "Depoimentos"],
    ["contato", "contato.html", "Contato"],
  ];
  el.className = "header";
  el.innerHTML = `
    <div class="container header__inner">
      <a class="brand" href="index.html" aria-label="${SITE.nome} — página inicial">
        <img src="assets/img/logo-icone.png" alt="" width="56" height="50">
        <span class="brand__text"><strong>2P</strong><span>Gestão &amp; Tecnologia</span></span>
      </a>
      <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span></button>
      <nav class="nav" id="menu" aria-label="Menu principal">
        ${links.map(([id, href, label]) => `<a href="${href}"${id === page ? ' class="active" aria-current="page"' : ""}>${label}</a>`).join("")}
        <a class="btn btn--primary" href="contato.html#formulario">Solicitar orçamento</a>
      </nav>
    </div>`;
}

function renderFooter() {
  const el = document.querySelector("[data-footer]");
  if (!el) return;
  const year = new Date().getFullYear();
  el.className = "footer";
  el.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="footer__brand">
            <img src="assets/img/logo-icone.png" alt="${SITE.nome}" width="66" height="58">
            <div><strong>2P Gestão</strong><span>&amp; Tecnologia</span></div>
          </div>
          <p>Tecnologia sob medida para quem quer crescer com gestão de verdade: sites com IA, sistemas internos e inteligência para o seu negócio.</p>
          <p style="font-size:.85rem">CNPJ: ${SITE.cnpj}</p>
          <div class="socials">
            <a href="${SITE.redes.instagram}" aria-label="Instagram">${icon("instagram")}</a>
            <a href="${SITE.redes.linkedin}" aria-label="LinkedIn">${icon("linkedin")}</a>
            <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${WHATS_SVG}</a>
          </div>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><a href="index.html">Início</a></li>
            <li><a href="servicos.html">Serviços</a></li>
            <li><a href="sobre.html">Sobre nós</a></li>
            <li><a href="index.html#depoimentos">Depoimentos</a></li>
            <li><a href="contato.html">Contato</a></li>
          </ul>
        </div>
        <div>
          <h4>Soluções</h4>
          <ul>
            <li><a href="servicos.html#sites">Sites com IA</a></li>
            <li><a href="servicos.html#gestao">Gestão de negócios</a></li>
            <li><a href="servicos.html#checklist">Checklist S.I.F / Anvisa</a></li>
            <li><a href="servicos.html#sistemas">KDS para cozinhas</a></li>
            <li><a href="servicos.html#sistemas">Controle de estoque</a></li>
            <li><a href="servicos.html#sistemas">Etiquetas ShelfTag</a></li>
          </ul>
        </div>
        <div>
          <h4>Fale com a gente</h4>
          <ul class="footer__contact">
            <li>${icon("phone")}<a href="${waLink()}" target="_blank" rel="noopener">${SITE.telefone}</a></li>
            <li>${icon("mail")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li>${icon("pin")}<span>${SITE.cidade}</span></li>
            <li>${icon("clock")}<span>${SITE.horario}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${year} ${SITE.razao} · CNPJ ${SITE.cnpj} · Todos os direitos reservados.</span>
        <span>${SITE.dominio}</span>
      </div>
    </div>`;

  // Botões flutuantes
  document.body.insertAdjacentHTML("beforeend", `
    <a class="whats-float" href="${waLink("Olá! Vim pelo site da 2P e gostaria de mais informações.")}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${WHATS_SVG}</a>
    <button class="to-top" aria-label="Voltar ao topo">${icon("up")}</button>`);
}

function renderClients() {
  document.querySelectorAll("[data-clients]").forEach((el) => {
    el.innerHTML = SITE.clientes.map((c) => {
      const titulo = esc([c.nome, c.detalhe].filter(Boolean).join(" · "));
      if (!c.logo) return `<div class="client client--name" title="${titulo}"><div><strong>${esc(c.nome)}</strong><span>${esc(c.detalhe || "")}</span></div></div>`;
      const src = c.logo.includes("/") ? assetPath(c.logo) : `assets/img/clientes/${c.logo}`;
      return `<div class="client" title="${titulo}"><img src="${esc(src)}" alt="${esc(c.nome)}" loading="lazy"></div>`;
    }).join("");
  });
}

function renderTestimonials() {
  const d = CONTENT.depoimentos, track = document.querySelector(".t-track");
  if (!track || !d || !Array.isArray(d.depoimentos) || !d.depoimentos.length) return;
  track.innerHTML = d.depoimentos.map((t) => {
    const n = Math.max(1, Math.min(5, +t.estrelas || 5));
    const iniciais = String(t.nome || "").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
    return `<div class="t-slide"><div class="t-card">
      <div class="t-stars" aria-label="${n} estrelas">${"★".repeat(n)}</div>
      <blockquote>"${esc(t.texto || "")}"</blockquote>
      <div class="t-author"><div class="t-avatar">${esc(iniciais)}</div><div><strong>${esc(t.nome || "")}</strong><span>${esc(t.cargo || "")}</span></div></div>
    </div></div>`;
  }).join("");
}

/* ---------- Comportamentos ---------- */
function initIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  document.querySelectorAll("[data-whats-icon]").forEach((el) => { el.innerHTML = WHATS_SVG; });
  document.querySelectorAll("[data-site]").forEach((el) => { el.textContent = SITE[el.dataset.site]; });
  document.querySelectorAll("[data-wa]").forEach((el) => { el.href = waLink(el.dataset.wa); el.target = "_blank"; el.rel = "noopener"; });
  document.querySelectorAll("[data-mailto]").forEach((el) => { el.href = `mailto:${SITE.email}`; });
}

function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  if (!toggle) return;
  const close = () => { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

function initScroll() {
  const header = document.querySelector(".header");
  const toTop = document.querySelector(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 10);
    toTop && toTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => io.observe(el));
}

function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  const run = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
}

function initTestimonials() {
  const root = document.querySelector(".testimonials");
  if (!root) return;
  const track = root.querySelector(".t-track");
  const slides = root.querySelectorAll(".t-slide");
  const dots = root.querySelector(".t-dots");
  let i = 0, timer;
  slides.forEach((_, n) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Depoimento ${n + 1}`);
    b.addEventListener("click", () => go(n, true));
    dots.appendChild(b);
  });
  const go = (n, user) => {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.querySelectorAll("button").forEach((d, k) => d.classList.toggle("active", k === i));
    slides.forEach((s, k) => s.setAttribute("aria-hidden", String(k !== i)));
    if (user) restart();
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 7000); };
  root.querySelector(".t-prev").addEventListener("click", () => go(i - 1, true));
  root.querySelector(".t-next").addEventListener("click", () => go(i + 1, true));
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restart);
  // swipe no celular
  let x0 = null;
  root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true);
    x0 = null;
  });
  go(0);
  restart();
}

function initSubnav() {
  const links = document.querySelectorAll(".subnav a");
  if (!links.length) return;
  const sections = [...links].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
}

/* ---------- Formulário de contato ---------- */
function maskPhone(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  return v;
}

function initForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  // Pré-seleciona o serviço vindo da URL (ex.: contato.html?servico=checklist)
  const pre = new URLSearchParams(location.search).get("servico");
  if (pre) { const opt = form.querySelector(`#servico option[value="${pre}"]`); if (opt) opt.selected = true; }

  const tel = form.querySelector("#telefone");
  tel.addEventListener("input", () => { tel.value = maskPhone(tel.value); });

  if (SITE.formularioExterno) {
    const ext = document.querySelector("[data-form-externo]");
    if (ext) { ext.href = SITE.formularioExterno; ext.hidden = false; }
  }

  const validate = () => {
    let ok = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".field");
      let valid = input.value.trim() !== "";
      if (valid && input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (valid && input.id === "telefone") valid = input.value.replace(/\D/g, "").length >= 10;
      field.classList.toggle("has-error", !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    return ok;
  };
  form.querySelectorAll("input, select, textarea").forEach((el) =>
    el.addEventListener("input", () => el.closest(".field") && el.closest(".field").classList.remove("has-error")));

  const buildMessage = () => {
    const d = new FormData(form);
    const servicoSel = form.querySelector("#servico");
    const interesses = d.getAll("interesse").join(", ");
    return [
      `Olá, 2P! Gostaria de um orçamento.`,
      ``,
      `*Nome:* ${d.get("nome")}`,
      d.get("empresa") ? `*Empresa:* ${d.get("empresa")}` : null,
      `*E-mail:* ${d.get("email")}`,
      `*Telefone:* ${d.get("telefone")}`,
      `*Serviço:* ${servicoSel.options[servicoSel.selectedIndex].text}`,
      interesses ? `*Segmento:* ${interesses}` : null,
      ``,
      `*Mensagem:* ${d.get("mensagem")}`,
    ].filter((l) => l !== null).join("\n");
  };

  const done = () => {
    form.hidden = true;
    document.querySelector(".form-success").classList.add("show");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(waLink(buildMessage()), "_blank", "noopener");
    done();
  });

  const mailBtn = form.querySelector("[data-send-email]");
  mailBtn && mailBtn.addEventListener("click", () => {
    if (!validate()) return;
    const body = buildMessage().replace(/\*/g, "");
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Orçamento pelo site - " + form.nome.value)}&body=${encodeURIComponent(body)}`;
    done();
  });

  const again = document.querySelector("[data-form-reset]");
  again && again.addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    document.querySelector(".form-success").classList.remove("show");
  });
}

/* ---------- Inicialização ---------- */
renderHeader();
initMenu();
loadContent().finally(() => {
  renderFooter();
  applyTexts();
  renderClients();
  renderTestimonials();
  initIcons();
  initScroll();
  initReveal();
  initCounters();
  initTestimonials();
  initSubnav();
  initForm();
});
