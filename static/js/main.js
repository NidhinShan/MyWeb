/* ===== Config ===== */
// Leave empty to use direct automated delivery to DATA.profile.email via FormSubmit AJAX, or provide your custom endpoint URL
const FORM_ENDPOINT = "";

/* ===== Helpers ===== */
const root = document.documentElement;
const base = document.body.dataset.base || "";   
const page = document.body.dataset.page;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const chips = (arr) => `<div class="chips">${(arr || []).map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>`;
const P = DATA.profile;

/* ===== Renderers ===== */
const roleCard = (r) => `
  <article class="card tilt reveal">
    <h3>${esc(r.title)}</h3>
    <p class="meta">${esc(r.organization)} · ${esc(r.tenure)}</p>
    <ul>${(r.impact || []).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    ${chips(r.skills)}
  </article>`;

const projectCard = (p) => `
  <article class="card tilt reveal">
    <h3>${esc(p.title)}</h3>
    <p class="meta">${esc(p.description)}</p>
    ${chips(p.tags)}
    <div class="card-links">
      <a href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo <span class="arrow">↗</span></a>
      <a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub <span class="arrow">↗</span></a>
    </div>
  </article>`;

// Clean, lightweight card for the dedicated templates/hobbies.html page
const detailedHobbyCard = (h) => `
  <article class="hobby-detail-card tilt reveal" data-category="${esc(h.id)}">
    <div class="hobby-detail-header">
      <div class="hobby-icon-wrap">
        <span class="hobby-icon">${h.icon}</span>
      </div>
      <div class="hobby-header-text">
        <span class="hobby-badge">${esc(h.category)}</span>
        <h2>${esc(h.title)}</h2>
        <p class="hobby-tagline">${esc(h.tagline)}</p>
      </div>
    </div>
    <p class="hobby-desc">${esc(h.description)}</p>
    <div class="hobby-footer-tags">
      ${chips(h.tags)}
    </div>
  </article>`;

// Clean mini card for the Home Page Bento preview banner
const miniHobbyCard = (h) => `
  <div class="hobby-banner-card tilt">
    <span class="hobby-banner-icon">${h.icon}</span>
    <h4>${esc(h.title)}</h4>
    <p>${esc(h.tagline)}</p>
  </div>`;

const render = (sel, items, fn) => { const el = $(sel); if (el && items) el.innerHTML = items.map(fn).join(""); };

/* ===== Shared layout: nav + footer + theme toggle ===== */
function renderLayout() {
  const links = [
    ["home", "index.html", "Home"],
    ["roles", "templates/roles.html", "Roles"],
    ["timeline", "templates/timeline.html", "Timeline"],
    ["hobbies", "templates/hobbies.html", "Hobbies"],
    ["contact", "templates/contact.html", "Contact"]
  ];
  const headerEl = $("#site-header");
  const footerEl = $("#site-footer");
  
  if (headerEl) {
    headerEl.innerHTML = `
      <header class="site-header">
        <nav class="container nav" aria-label="Main">
          <a class="logo" href="${base}index.html"><span>NS</span> · Portfolio</a>
          <ul class="nav-links" id="nav-links">
            ${links.map(([id, href, label]) =>
              `<li><a href="${base}${href}" ${id === page ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}
          </ul>
          <div class="nav-actions">
            <button class="icon-btn" id="theme-btn" aria-label="Toggle theme"></button>
            <button class="icon-btn hamburger" id="menu-btn" aria-label="Toggle menu" aria-expanded="false">☰</button>
          </div>
        </nav>
      </header>`;
  }
  if (footerEl) {
    footerEl.innerHTML = `<footer class="site-footer">© ${new Date().getFullYear()} ${esc(P.name)} · Crafted with HTML, CSS, JavaScript &amp; Three.js</footer>`;
  }

  const btn = $("#menu-btn"), nav = $("#nav-links");
  if (btn && nav) {
    const setOpen = (open) => { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); };
    btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setOpen(false); });
  }

  const tBtn = $("#theme-btn");
  if (tBtn) {
    const applyTheme = (t) => {
      root.dataset.theme = t;
      try { localStorage.setItem("theme", t); } catch (e) {}
      tBtn.textContent = t === "dark" ? "☀️" : "🌙";
      tBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    };
    applyTheme(root.dataset.theme || "light");
    tBtn.addEventListener("click", () => applyTheme(root.dataset.theme === "dark" ? "light" : "dark"));
  }
}

/* ===== Bind profile data ===== */
function bindProfile() {
  document.querySelectorAll("[data-bind]").forEach((el) => { el.textContent = P[el.dataset.bind] || ""; });
  const set = (id, href) => { const el = $(id); if (el) el.href = href; };
  set("#gh-link", P.github);
  set("#li-link", P.linkedin);
  set("#mail-link", `mailto:${P.email}`);
  set("#resume-btn", base + P.resume);

  // Sync title if it contains placeholder
  if (P.name && document.title.includes("Your Name")) {
    document.title = document.title.replace("Your Name", P.name);
  }
}

/* ===== Home page bento content ===== */
function initHome() {
  if (page !== "home") return;

  const statsEl = $("#stats");
  if (statsEl && DATA.stats) {
    statsEl.innerHTML = DATA.stats.map((s) =>
      `<div class="stat"><b><span data-count="${s.value}">0</span>${esc(s.suffix)}</b><small>${esc(s.label)}</small></div>`).join("");
  }

  const n = DATA.now;
  const statusEl = $("#status");
  if (statusEl && n) {
    statusEl.innerHTML = `
      <h3>Building</h3><p>${esc(n.building)}</p>
      <h3>Learning</h3><p>${esc(n.learning)}</p>
      <span class="live">${esc(n.status)}</span>`;
  }

  render("#roles-mini", DATA.roles?.slice(0, 3), (r) => `<li><b>${esc(r.title)}</b>${esc(r.organization)}</li>`);
  
  const sortedTimeline = [...(DATA.timeline || [])].sort((a, b) => b.year - a.year);
  render("#timeline-mini", sortedTimeline.slice(0, 3), (t) => `<li><b>${esc(t.year)}</b>${esc(t.title)}</li>`);

  render("#projects-bento", DATA.projects?.slice(0, 3), projectCard);

  // Home preview banner for Hobbies
  render("#hobbies-banner-cards", DATA.hobbies, miniHobbyCard);
}

/* ===== Dedicated Hobbies Page Logic (templates/hobbies.html) ===== */
function initHobbiesPage() {
  const deck = $("#hobbies-page-deck");
  if (!deck) return;

  const filterBar = $("#hobbies-filter-bar");
  let currentFilter = "all";

  const drawDeck = () => {
    const filtered = (DATA.hobbies || []).filter((h) => currentFilter === "all" || h.id === currentFilter);
    deck.innerHTML = filtered.map(detailedHobbyCard).join("");
    if (typeof initReveal === "function") initReveal();
  };

  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
      currentFilter = btn.dataset.hobbyFilter;
      
      // Fluid switch transition
      deck.style.opacity = "0";
      deck.style.transform = "translateY(10px)";
      setTimeout(() => {
        drawDeck();
        deck.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        deck.style.opacity = "1";
        deck.style.transform = "translateY(0)";
      }, 150);
    });
  }

  drawDeck();
}

/* ===== Pointer & Magnetic Micro-interactions ===== */
function initPointerFX() {
  if (reduce) return;

  // 3D Tilt, Spot & Cursor Spotlight effects
  document.addEventListener("mousemove", (e) => {
    // Project Cards & Bento Tiles cursor spotlight tracking
    const card = e.target.closest(".card, .tile, .hobby-detail-card, .hobby-banner-card");
    if (card) {
      const cr = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", (e.clientX - cr.left) + "px");
      card.style.setProperty("--mouse-y", (e.clientY - cr.top) + "px");
    }

    const t = e.target.closest(".tilt");
    if (t) {
      const r = t.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(1) + "deg");
      t.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(1) + "deg");
      t.style.setProperty("--gx", (x * 100).toFixed(0) + "%");
      t.style.setProperty("--gy", (y * 100).toFixed(0) + "%");
      t.classList.add("hot");
    }
    const s = e.target.closest(".spot");
    if (s) {
      const r = s.getBoundingClientRect();
      s.style.setProperty("--mx", e.clientX - r.left + "px");
      s.style.setProperty("--my", e.clientY - r.top + "px");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const t = e.target.closest(".tilt");
    if (t && !t.contains(e.relatedTarget)) {
      t.style.setProperty("--rx", "0deg");
      t.style.setProperty("--ry", "0deg");
      t.classList.remove("hot");
    }
    const card = e.target.closest(".card, .tile, .hobby-detail-card, .hobby-banner-card");
    if (card && !card.contains(e.relatedTarget)) {
      card.style.setProperty("--mouse-x", "-999px");
      card.style.setProperty("--mouse-y", "-999px");
    }
  });

  // Magnetic button pull effect
  document.querySelectorAll(".btn-primary, .btn-ghost, .icon-btn, .avatar-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ===== Scroll reveal + count-up numbers ===== */
function countUp(el) {
  el.querySelectorAll("[data-count]").forEach((n) => {
    const end = +n.dataset.count;
    if (reduce) { n.textContent = end; return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => { el.classList.add("in"); countUp(el); });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  els.forEach((el, i) => { el.style.setProperty("--d", (i % 4) * 80 + "ms"); io.observe(el); });
}

/* ===== Timeline Matrix Logic ===== */
function initTimeline() {
  const container = $("#timeline-matrix");
  if (!container) return;
  const filters = $("#filters");

  const matrixItem = (t) => `
    <div class="matrix-item reveal">
      <div class="matrix-node"></div>
      <div class="card tilt">
        <span class="matrix-badge">${esc(t.year)} · ${esc(t.category)}</span>
        <h3>${esc(t.title)}</h3>
        <p class="meta">${esc(t.description)}</p>
      </div>
    </div>`;

  let current = "All";
  const rawTimeline = DATA.timeline || [];

  const draw = () => {
    const items = rawTimeline.filter((t) => current === "All" || t.category === current);
    container.innerHTML = items.map(matrixItem).join("");
    if (typeof initReveal === "function") initReveal();
  };

  if (filters) {
    const cats = ["All", ...new Set(rawTimeline.map((t) => t.category))];
    filters.innerHTML = cats
      .map((c, i) => `<button class="filter-btn ${i === 0 ? "active" : ""}" data-filter="${esc(c)}">${esc(c)}</button>`)
      .join("");

    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".filter-btn");
      if (!b) return;
      filters.querySelectorAll(".filter-btn").forEach((x) => x.classList.toggle("active", x === b));
      current = b.dataset.filter;

      container.style.opacity = "0";
      setTimeout(() => {
        draw();
        container.style.transition = "opacity 0.25s ease";
        container.style.opacity = "1";
      }, 120);
    });
  }

  draw();
}

/* ===== Contact Form with Automated Email Delivery & Direct Fallback ===== */
function initContact() {
  const form = $("#contact-form");
  if (!form) return;
  const status = $("#form-status");

  const check = (field) => {
    let msg = "";
    const v = field.value.trim();
    if (!v) msg = "This field is required.";
    else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address.";
    else if (field.minLength > 0 && v.length < field.minLength) msg = `Please enter at least ${field.minLength} characters.`;
    field.classList.toggle("invalid", !!msg);
    field.classList.toggle("valid", !msg);
    const errEl = field.parentElement.querySelector(".error");
    if (errEl) errEl.textContent = msg;
    return !msg;
  };

  const fields = [...form.querySelectorAll("input, textarea")];
  fields.forEach((f) => {
    f.addEventListener("blur", () => check(f));
    f.addEventListener("input", () => f.classList.contains("invalid") && check(f));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (status) { status.className = ""; status.innerHTML = ""; }
    if (!fields.map(check).every(Boolean)) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending email...</span> <span class="btn-icon">⏳</span>`;
    }

    const data = Object.fromEntries(new FormData(form));
    const targetEmail = P.email || "nidhinshan7@gmail.com";
    
    // Automated Direct Endpoint (FormSubmit AJAX or custom endpoint)
    const endpoint = FORM_ENDPOINT || `https://formsubmit.co/ajax/${targetEmail}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject || "New Inquiry from Portfolio",
          message: data.message,
          _subject: `Portfolio Message from ${data.name}: ${data.subject || 'Inquiry'}`,
          _template: "table",
          _captcha: "false"
        })
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok && json.success !== "true" && json.success !== true) {
        throw new Error(json.message || "Failed to dispatch email");
      }

      if (status) {
        status.className = "ok";
        status.innerHTML = `
          <div class="status-box ok">
            <b>✓ Message sent directly!</b>
            <p>Your message has been delivered to <strong>${esc(targetEmail)}</strong>. I will get back to you shortly.</p>
          </div>
        `;
      }
      form.reset();
      fields.forEach((f) => f.classList.remove("valid"));
    } catch (err) {
      console.warn("Direct HTTP send issue:", err);
      if (status) {
        status.className = "fail";
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(data.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`${data.message}\n\n— Sent by ${data.name} (${data.email})`)}`;
        const mailtoLink = `mailto:${targetEmail}?subject=${encodeURIComponent(data.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`${data.message}\n\n— Sent by ${data.name} (${data.email})`)}`;
        
        status.innerHTML = `
          <div class="status-box fail">
            <b>Direct network dispatch blocked. Please click to send instantly:</b>
            <div style="margin-top:0.75rem; display:flex; gap:0.6rem; flex-wrap:wrap;">
              <a class="btn btn-primary" href="${gmailLink}" target="_blank" rel="noopener" style="padding:0.45rem 0.9rem; font-size:0.88rem;">Open in Gmail ↗</a>
              <a class="btn btn-ghost" href="${mailtoLink}" style="padding:0.45rem 0.9rem; font-size:0.88rem;">Open Mail App ↗</a>
            </div>
          </div>
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
    }
  });
}

/* ===== Init ===== */
renderLayout();
bindProfile();
initHome();
render("#roles-list", DATA.roles, roleCard);
initTimeline();
initHobbiesPage();
initContact();
initPointerFX();
initReveal();
