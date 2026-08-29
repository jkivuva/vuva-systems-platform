// Vuva Systems — Project Index & Creative Studio renderer (v4).
// Renders from portfolio-data.js: filter chips, live search, detail modal
// with the full Part-16 structure (problem → solution → how it works →
// live demo → visuals → features → value → tech → CTA), plus the
// contextual "Yes — Let's Build This" enquiry hand-off.
// Conventions: reduced-motion aware, fault-isolated inits, zero dependencies.

import { CATEGORIES, STATUS, PROJECTS } from './portfolio-data.js';
import { DEMO_CONFIG, demoConfigFor } from './demo-config.js';

// Demo modules are heavy (~120KB combined). We only need them once a
// visitor shows intent on a project card. Until then, the home page stays
// light and the rest of the chrome (nav, AI, contact form) works.
let demoModulePromise = null;
async function loadDemoModules() {
  if (!demoModulePromise) {
    demoModulePromise = (async () => {
      const [a, b] = await Promise.all([
        import('./demo-types-a.js'),
        import('./demo-types-b.js')
      ]);
      return { ...a, ...b };
    })();
  }
  return demoModulePromise;
}

const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const safeInit = (label, fn) => { try { fn(); } catch (err) { console.error(`[vuva] ${label} failed:`, err); } };

const TECH_PROJECTS = PROJECTS.filter((p) => p.type !== 'creative');
const CREATIVE_PROJECTS = PROJECTS.filter((p) => p.type === 'creative');
const WHATSAPP_URL = 'https://wa.me/254796117443';

/* ---------- Demo registry (lazy) ---------- */
let demoFactoriesPromise = null;
function loadDemoFactories() {
  if (!demoFactoriesPromise) {
    demoFactoriesPromise = loadDemoModules().then((mods) => ({
      booking: mods.bookingDemo,
      tracking: mods.trackingDemo,
      shop: mods.shopDemo,
      rooms: mods.roomsDemo,
      property: mods.propertyDemo,
      dashboard: mods.dashboardDemo,
      workflow: mods.workflowDemo,
      aiFlow: mods.aiFlowDemo,
      finance: mods.financeDemo,
      portal: mods.portalDemo,
      configurator: mods.configuratorDemo,
      gallery: mods.galleryDemo,
      course: mods.courseDemo,
      checklist: mods.microChecklist,
      microChecklist: mods.microChecklist,
      queue: mods.microQueue,
      microQueue: mods.microQueue,
      rate: mods.microRate,
      microRate: mods.microRate,
      roster: mods.microRoster,
      microRoster: mods.microRoster
    }));
  }
  return demoFactoriesPromise;
}

async function mountDemo(host, project) {
  const cfg = demoConfigFor(project.id);
  host.replaceChildren();
  if (!cfg?.demo) {
    host.appendChild(Object.assign(document.createElement('p'), {
      className: 'dm-note',
      textContent: 'Interactive walkthrough available on request.'
    }));
    return;
  }
  let factories;
  try {
    factories = await loadDemoFactories();
  } catch (err) {
    console.error(`[vuva] demo modules failed to load:`, err);
    host.replaceChildren();
    const wrap = document.createElement('div');
    wrap.className = 'dm-error';
    wrap.setAttribute('role', 'alert');
    wrap.innerHTML = `
      <strong>Something went wrong loading this demonstration.</strong>
      <span>The demo modules failed to load. This is usually a network problem.</span>
      <button type="button" class="button button-quiet" data-retry>Try Again</button>`;
    wrap.querySelector('[data-retry]')?.addEventListener('click', () => {
      demoModulePromise = null;
      demoFactoriesPromise = null;
      mountDemo(host, project);
    });
    host.appendChild(wrap);
    return;
  }
  const factory = factories[cfg.demo.type];
  if (!factory) { host.textContent = 'Demo unavailable.'; return; }
  try {
    factory(host, cfg.demo);
  } catch (err) {
    console.error(`[vuva] demo "${project.id}" failed:`, err);
    host.textContent = 'This demo hit a snag — refresh to retry.';
  }
}

/* Show a small placeholder until demo modules arrive */
function mountDemoLoading(host, project) {
  host.replaceChildren();
  const wrap = document.createElement('div');
  wrap.className = 'dm-loading';
  wrap.setAttribute('role', 'status');
  wrap.setAttribute('aria-live', 'polite');
  wrap.innerHTML = `
    <span class="dm-loading-spinner" aria-hidden="true"></span>
    <span>Loading ${esc(project.name)}…</span>`;
  host.appendChild(wrap);
  return wrap;
}

/* ---------- Card rendering ---------- */

function statusTag(statusKey) {
  const meta = STATUS[statusKey] || STATUS.concept;
  return `<span class="tag ${meta.cls} pf-tag">${esc(meta.label)}</span>`;
}

function cardHTML(project, index) {
  const isCreative = project.type === 'creative';
  const hasDemo = !!demoConfigFor(project.id)?.demo;
  const industry = industryKey(project);
  const preview = previewFragment(project, industry);
  return `
  <li class="pf-card reveal ${isCreative ? 'is-creative' : ''}" data-project-card="${esc(project.id)}" style="--pf-i:${index}">
    <button type="button" class="pf-card-btn" data-open-project="${esc(project.id)}" data-industry="${esc(industry)}" aria-haspopup="dialog">
      <span class="pf-media">
        <img src="${esc(project.image)}" alt="" loading="lazy" width="800" height="500">
        ${preview}
      </span>
      <span class="pf-body">
        <span class="pf-meta mono"><span class="pf-cat">${esc(project.category)}</span><span class="pf-ind">${esc(project.industry)}</span></span>
        <strong class="pf-name">${esc(project.name)}</strong>
        <span class="pf-blurb">${esc(project.blurb)}</span>
        <span class="pf-caps mono">${project.capabilities.slice(0, 3).map((c) => `<i>${esc(c)}</i>`).join('')}</span>
        <span class="pf-foot">
          ${statusTag(project.status)}
          <span class="pf-open-hint mono" aria-hidden="true">${hasDemo ? 'TRY THE DEMO →' : 'VIEW →'}</span>
        </span>
      </span>
    </button>
  </li>`;
}

/* Map a project to an industry key used for the card accent strip
   and the inline preview fragment. Falls back to "systems". */
function industryKey(project) {
  const cfg = demoConfigFor(project.id);
  if (cfg && cfg.industry) {
    if (cfg.industry === 'healthcare') return 'healthcare';
    if (cfg.industry === 'logistics') return 'logistics';
    if (cfg.industry === 'lend') return 'fintech';
    if (cfg.industry === 'crm') return 'systems';
  }
  const cat = (project.category || '').toLowerCase();
  if (cat.includes('health')) return 'healthcare';
  if (cat.includes('logist')) return 'logistics';
  if (cat.includes('retail')) return 'retail';
  if (cat.includes('hospital')) return 'hospitality';
  if (cat.includes('real estate')) return 'realestate';
  if (cat.includes('education')) return 'education';
  if (cat.includes('fintech')) return 'fintech';
  if (cat.includes('creative')) return 'creative';
  if (cat.includes('ai') || cat.includes('automation')) return 'ai';
  return 'systems';
}

/* Per-industry mini product fragments. Pure HTML — no JS, no fetches.
   Each is a tiny faithful mock of the real product surface so the
   visitor sees what the project actually feels like before clicking. */
function previewFragment(project, industry) {
  const head = (label, badge) =>
    `<span class="pf-preview-h"><span><i class="pf-preview-dot"></i>${esc(label)}</span>${badge ? `<span>${esc(badge)}</span>` : ''}</span>`;
  if (industry === 'healthcare') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('VUVACARE · TODAY', 'LIVE')}
      <span class="pf-preview-grid">
        <span class="pf-preview-stat"><strong>42</strong><span>Appts</span></span>
        <span class="pf-preview-stat"><strong>14</strong><span>Queue</span></span>
        <span class="pf-preview-stat"><strong>6</strong><span>Doctors</span></span>
        <span class="pf-preview-stat"><strong>KSh 184k</strong><span>Revenue</span></span>
      </span>
      <span class="pf-preview-mini-row"><span class="num">10:30</span> Dr. Mwangi — Cardiology <span class="pf-preview-pill is-on">CONFIRMED</span></span>
      <span class="pf-preview-mini-row"><span class="num">11:00</span> A. Otieno — General <span class="pf-preview-pill">QUEUED</span></span>
    </span>`;
  }
  if (industry === 'logistics') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('TRACKING · VUVA-20481', 'IN TRANSIT')}
      <span class="pf-preview-row">
        <span style="width: 22%;">NBO</span>
        <span class="pf-preview-bar"><i style="width: 65%;"></i></span>
        <span style="width: 22%; text-align: right;">MSA</span>
      </span>
      <span class="pf-preview-mini-row">Truck KDF 812L · Driver J. Achieng · Load 2.4t</span>
      <span class="pf-preview-mini-row">ETA Today 14:20 · 5 of 5 stages</span>
    </span>`;
  }
  if (industry === 'retail') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('COMMERCEOS · ORDERS', 'Q3')}
      <span class="pf-preview-grid">
        <span class="pf-preview-stat"><strong>KSh 2.84M</strong><span>Revenue</span></span>
        <span class="pf-preview-stat"><strong>1,180</strong><span>Orders</span></span>
        <span class="pf-preview-stat"><strong>94.2%</strong><span>On-time</span></span>
        <span class="pf-preview-stat"><strong>2.1%</strong><span>Returns</span></span>
      </span>
      <span class="pf-preview-mini-row">Maize flour · 240 units <span class="pf-preview-pill is-on">REORDER</span></span>
      <span class="pf-preview-mini-row">Cooking oil · 18 units <span class="pf-preview-pill">LOW</span></span>
    </span>`;
  }
  if (industry === 'hospitality') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('HOSPITALITYOS · ORDERS', 'LIVE')}
      <span class="pf-preview-grid">
        <span class="pf-preview-stat"><strong>214</strong><span>Today</span></span>
        <span class="pf-preview-stat"><strong>168</strong><span>Delivered</span></span>
        <span class="pf-preview-stat"><strong>14</strong><span>Riders</span></span>
        <span class="pf-preview-stat"><strong>28m</strong><span>Avg time</span></span>
      </span>
      <span class="pf-preview-mini-row">Ruai branch leading · 46 orders</span>
    </span>`;
  }
  if (industry === 'realestate') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('PROPERTYOS · LISTINGS', '8 PROPS')}
      <span class="pf-preview-mini-row"><span class="num">KSh 58k</span> Kilimani 2-Bed <span class="pf-preview-pill is-on">VACANT</span></span>
      <span class="pf-preview-mini-row"><span class="num">KSh 35k</span> Westlands Studio <span class="pf-preview-pill is-on">VACANT</span></span>
      <span class="pf-preview-mini-row"><span class="num">KSh 120k</span> Lavington 4-Bed <span class="pf-preview-pill">NOTICE</span></span>
    </span>`;
  }
  if (industry === 'education') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('SCHOOL CORE · ATTENDANCE', 'TERM 3')}
      <span class="pf-preview-grid">
        <span class="pf-preview-stat"><strong>1,284</strong><span>Students</span></span>
        <span class="pf-preview-stat"><strong>1,192</strong><span>Present</span></span>
        <span class="pf-preview-stat"><strong>94.2%</strong><span>On-time</span></span>
        <span class="pf-preview-stat"><strong>KSh 840k</strong><span>Fees due</span></span>
      </span>
      <span class="pf-preview-mini-row">A. Wanjiku · Grade 5 <span class="pf-preview-pill is-on">PRESENT</span></span>
    </span>`;
  }
  if (industry === 'fintech') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('V-LEND · PIPELINE', 'OPEN')}
      <span class="pf-preview-grid">
        <span class="pf-preview-stat"><strong>86</strong><span>Apps</span></span>
        <span class="pf-preview-stat"><strong>14</strong><span>In review</span></span>
        <span class="pf-preview-stat"><strong>42</strong><span>Approved</span></span>
        <span class="pf-preview-stat"><strong>KSh 1.24M</strong><span>Disbursed</span></span>
      </span>
      <span class="pf-preview-mini-row">LA-2049 · B. Otieno · KSh 85,000 <span class="pf-preview-pill">REVIEW</span></span>
    </span>`;
  }
  if (industry === 'ai') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('AGENT MESH · WORKFLOW', 'ACTIVE')}
      <span class="pf-preview-mini-row"><span class="num">1</span> Customer Agent engaged</span>
      <span class="pf-preview-mini-row"><span class="num">2</span> Change evaluated — Saturday route OK</span>
      <span class="pf-preview-mini-row"><span class="num">3</span> Policy check <span class="pf-preview-pill is-on">PASS</span></span>
      <span class="pf-preview-mini-row"><span class="num">4</span> Action executed</span>
    </span>`;
  }
  if (industry === 'creative') {
    return `<span class="pf-preview" aria-hidden="true">
      ${head('CREATIVE STUDIO · CONCEPT', 'STAGE 02/04')}
      <span class="pf-preview-mini-row">Teaser live <span class="pf-preview-pill is-on">✓</span></span>
      <span class="pf-preview-mini-row">Waitlist open <span class="pf-preview-pill is-on">✓</span></span>
      <span class="pf-preview-mini-row">Reveal day <span class="pf-preview-pill">—</span></span>
      <span class="pf-preview-mini-row">First orders <span class="pf-preview-pill">—</span></span>
    </span>`;
  }
  /* systems / default */
  return `<span class="pf-preview" aria-hidden="true">
    ${head(esc((project.name || 'SYSTEM').toUpperCase().slice(0, 22)), 'DEMO')}
    <span class="pf-preview-mini-row"><span class="num">✓</span> Edge deployment</span>
    <span class="pf-preview-mini-row"><span class="num">✓</span> AI consultant</span>
    <span class="pf-preview-mini-row"><span class="num">✓</span> WhatsApp automation</span>
  </span>`;
}

/* ---------- Detail (Part 16) ---------- */

function featureHTML(project) {
  const d = project.detail;
  const cfg = demoConfigFor(project.id);
  const caps = project.capabilities.map((c) => `<li>${esc(c)}</li>`).join('');
  const conceptNote = project.status === 'concept'
    ? `<p class="pfd-concept-note"><strong>Concept demonstration.</strong> This is an example of a solution Vuva Systems can build for your business — try the working demo below.</p>`
    : '';
  return `
    <div class="pfd-hero">
      <img src="${esc(project.image)}" alt="" width="800" height="500">
      ${statusTag(project.status)}
    </div>
    <div class="pfd-head">
      <p class="mono pfd-kicker">${esc(project.category)} · ${esc(project.industry)}</p>
      <h3 id="pfd-title">${esc(project.name)}</h3>
      <p class="pfd-lead">${esc(project.blurb)}</p>
      ${conceptNote}
    </div>
    <div class="pfd-sections">
      <section class="pfd-sec"><h4 class="mono pfd-sec-title">THE PROBLEM</h4><p>${esc(d.problem)}</p></section>
      <section class="pfd-sec"><h4 class="mono pfd-sec-title">THE VUVA SOLUTION</h4><p>${esc(d.solution)}</p></section>
    </div>
    ${cfg?.how ? `
    <section class="pfd-sec pfd-how">
      <h4 class="mono pfd-sec-title">HOW IT WORKS</h4>
      <ol class="dm-how">${cfg.how.map((h, i) => `<li><span class="dm-how-num mono">${String(i + 1).padStart(2, '0')}</span><span>${esc(h)}</span></li>`).join('')}</ol>
    </section>` : ''}
    <section class="pfd-sec">
      <h4 class="mono pfd-sec-title">LIVE DEMO</h4>
      <div class="pfd-demo" data-pfd-demo></div>
    </section>
    ${cfg?.visuals?.length ? `
    <section class="pfd-sec">
      <h4 class="mono pfd-sec-title">VISUALS</h4>
      <div class="pfd-visuals">${cfg.visuals.map((v) => `
        <figure class="pfd-fig">
          <img src="${esc(v.src)}" alt="${esc(v.alt || '')}" loading="lazy" width="525" height="350">
          ${v.caption ? `<figcaption>${esc(v.caption)}</figcaption>` : ''}
        </figure>`).join('')}</div>
    </section>` : ''}
    <div class="pfd-sections">
      <section class="pfd-sec"><h4 class="mono pfd-sec-title">KEY FEATURES</h4><ul class="pfd-list">${d.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></section>
      <section class="pfd-sec"><h4 class="mono pfd-sec-title">USER EXPERIENCE</h4><p>${esc(d.experience)}</p></section>
      <section class="pfd-sec"><h4 class="mono pfd-sec-title">BUSINESS VALUE</h4><p>${esc(d.value)}</p></section>
      <section class="pfd-sec"><h4 class="mono pfd-sec-title">TECHNOLOGY</h4><p>${esc(d.tech.join(' · '))}</p></section>
    </div>`;
}

/* ---------- Modal ---------- */

let lastFocused = null;

function ensureModal() {
  let modal = document.querySelector('[data-pfd-modal]');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.className = 'pfd';
  modal.setAttribute('data-pfd-modal', '');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'pfd-title');
  modal.innerHTML = `
    <div class="pfd-backdrop" data-pfd-close></div>
    <div class="pfd-panel" role="document">
      <button type="button" class="pfd-close" data-pfd-close aria-label="Close project details">×</button>
      <div class="pfd-scroll" data-pfd-content></div>
      <div class="pfd-cta-bar">
        <div class="pfd-cta-copy">
          <strong data-pfd-cta-title>Like what you see?</strong>
          <span class="mono" data-pfd-cta-sub>Concepts are labelled — this is what we can build for you.</span>
        </div>
        <button type="button" class="button button-accent" data-pfd-build>Yes — Let's Build This <span aria-hidden="true">↗</span></button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-pfd-close]')) closeModal();
    const build = event.target.closest('[data-pfd-build]');
    if (build) startEnquiry(modal.dataset.projectId);
    const demoCta = event.target.closest('[data-demo-cta]');
    if (demoCta) startEnquiry(modal.dataset.projectId);
  });

  /* Focus trap */
  modal.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusables = modal.querySelectorAll('a[href], button:not([disabled]), input:not([type=hidden]), select, textarea');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  return modal;
}

function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
  document.body.style.overflow = lock ? 'hidden' : '';
  document.body.style.touchAction = lock ? 'none' : '';
}

function openProject(id) {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return;
  lastFocused = document.activeElement;
  const modal = ensureModal();
  modal.dataset.projectId = id;
  modal.querySelector('[data-pfd-content]').innerHTML = featureHTML(project);
  modal.querySelector('[data-pfd-cta-title]').textContent = `Want ${shortName(project)} for your business?`;
  modal.classList.add('is-open');
  lockScroll(true);
  history.replaceState(null, '', `#project=${id}`);
  const closeBtn = modal.querySelector('.pfd-close');
  if (closeBtn) closeBtn.focus();
  const host = modal.querySelector('[data-pfd-demo]');
  mountDemoLoading(host, project);
  mountDemo(host, project);
}

function shortName(project) {
  const n = project.name;
  return n.length > 34 ? n.slice(0, 33).trim() + '…' : n;
}

function closeModal() {
  const modal = document.querySelector('[data-pfd-modal]');
  if (!modal || !modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  lockScroll(false);
  history.replaceState(null, '', location.pathname + location.search + '#portfolio');
  if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
}

/* ---------- Contextual enquiry (Parts 23–31) ---------- */

const INDUSTRY_MAP = {
  'Logistics': 'Logistics & Transportation',
  'Healthcare': 'Healthcare',
  'Hospitality': 'Hospitality & Restaurants',
  'Retail': 'Retail & Distribution',
  'Real Estate': 'Real Estate',
  'Education': 'Education',
  'FinTech': 'FinTech & Payments',
  'Business Systems': 'Business Systems',
  'AI & Automation': 'AI & Automation',
  'Data & Operations': 'Data & Analytics',
  'Digital Experiences': 'Web & Digital Experience',
  'Creative': 'Creative / Brand'
};

function startEnquiry(projectId) {
  const project = PROJECTS.find((p) => p.id === id_or(projectId));
  closeModal();

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  /* Prefill selects */
  const setSelect = (name, value) => {
    const sel = form.querySelector(`[name="${name}"]`);
    if (!sel) return;
    const match = [...sel.options].find((o) => o.value === value || o.textContent.trim() === value);
    if (match) sel.value = match.value;
  };
  setSelect('project_type', 'Custom business system');
  setSelect('industry', INDUSTRY_MAP[project.category] || '');

  /* Requirements prefill */
  const req = form.querySelector('[name="requirements"]');
  if (req && !req.value.trim()) {
    req.value = `I want a system like "${project.name}" (${project.category}) for my business.`;
  }

  /* Context banner inside the form */
  let banner = form.querySelector('.pf-interest-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'pf-interest-banner';
    form.prepend(banner);
  }
  banner.innerHTML = `
    <p class="mono pf-interest-kicker">SELECTED SOLUTION</p>
    <strong>${esc(project.name)}</strong>
    <span>${esc(project.category)} · ${esc(INDUSTRY_MAP[project.category] || project.industry)}</span>
    <div class="pf-interest-choice" role="radiogroup" aria-label="Customisation">
      <label class="pf-choice"><input type="radio" name="pf_interest" value="Something like this" checked><span>Something like this</span></label>
      <label class="pf-choice"><input type="radio" name="pf_interest" value="Similar, but customized"><span>Similar, but customized</span></label>
      <label class="pf-choice"><input type="radio" name="pf_interest" value="I'm not sure yet"><span>I'm not sure yet</span></label>
    </div>`;

  /* Include the selection in the WhatsApp hand-off */
  const interest = () => {
    const checked = banner.querySelector('input[name="pf_interest"]:checked');
    return checked ? checked.value : 'Something like this';
  };
  if (!window.__vuvaInterestHooked) {
    const origForm = form;
    origForm.addEventListener('submit', () => {
      const p = window.__vuvaLastProject;
      if (!p) return;
      const reqField = origForm.querySelector('[name="requirements"]');
      if (reqField && !/Project of interest:/i.test(reqField.value)) {
        reqField.value = `Project of interest: ${p.name}\nInterest: ${interest()}\n\n${reqField.value}`;
      }
    }, true);
    window.__vuvaInterestHooked = true;
  }
  window.__vuvaLastProject = project;

  /* Success state mention */
  const status = document.querySelector('[data-form-status]');
  if (status) status.textContent = '';

  /* Jump to the form. Instant scroll: reliable across browsers, and the modal
     close already provides the visual break from the demo. */
  requestAnimationFrame(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    const heading = document.querySelector('.contact-copy h3');
    if (heading) heading.textContent = 'Great. Let’s build something like this for your business.';
    setTimeout(() => form.querySelector('[name="name"]')?.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 700);
  });
}

function id_or(v) { return v || ''; }

/* ---------- Section wiring ---------- */

function initProjectIndex() {
  const grid = document.querySelector('[data-projects-grid]');
  if (!grid) return;

  const chipWrap = document.querySelector('[data-pf-chips]');
  const searchInput = document.querySelector('[data-pf-search]');
  const countEl = document.querySelector('[data-pf-count]');
  const empty = document.querySelector('[data-pf-empty]');

  const featured = PROJECTS.filter((p) => p.featured);
  const featuredRow = document.querySelector('[data-pf-featured]');
  if (featuredRow) {
    featuredRow.innerHTML = featured.map(cardHTML).join('');
    featuredRow.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
  }

  let activeCategory = 'All';
  let query = '';

  const applyFilters = () => {
    const q = query.trim().toLowerCase();
    const items = [];
    for (const p of TECH_PROJECTS) {
      if (activeCategory !== 'All' && p.category !== activeCategory) continue;
      if (q && ![p.name, p.category, p.industry, ...p.capabilities].join(' ').toLowerCase().includes(q)) continue;
      items.push(p);
    }
    grid.innerHTML = items.map(cardHTML).join('');
    if (countEl) countEl.textContent = `${items.length} project${items.length === 1 ? '' : 's'}`;
    if (empty) empty.hidden = items.length > 0;
    grid.classList.toggle('has-items', items.length > 0);
    grid.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
  };

  if (chipWrap) {
    const cats = ['All', ...CATEGORIES.filter((c) => c !== 'Creative')];
    chipWrap.innerHTML = cats.map((c, i) =>
      `<button type="button" class="chip${i === 0 ? ' is-on' : ''}" data-pf-filter="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`
    ).join('');
    chipWrap.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-pf-filter]');
      if (!btn) return;
      activeCategory = btn.dataset.pfFilter;
      chipWrap.querySelectorAll('.chip').forEach((c) => {
        const on = c === btn;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      applyFilters();
    });
  }

  if (searchInput) {
    let debounce = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        query = searchInput.value || '';
        applyFilters();
      }, 140);
    });
  }

  applyFilters();

  const openFromHash = () => {
    const match = window.location.hash.match(/^#project=([\w-]+)$/);
    if (!match) return false;
    const project = PROJECTS.find((p) => p.id === match[1]);
    if (project && window.__vuvaOpenProject) {
      window.__vuvaOpenProject(project.id);
      return true;
    }
    return false;
  };
  if (!openFromHash()) {
    window.addEventListener('hashchange', openFromHash, { once: true });
  }
}
safeInit('initProjectIndex', initProjectIndex);

function initCreativeStudio() {
  const row = document.querySelector('[data-creative-row]');
  if (!row) return;
  row.innerHTML = CREATIVE_PROJECTS.map(cardHTML).join('');
  row.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => el.classList.add('is-visible'));
}
safeInit('initCreativeStudio', initCreativeStudio);

function initProjectModal() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-project]');
    if (!trigger) return;
    event.preventDefault();
    /* Pre-warm the demo modules on the first intent, so by the time
       the user actually clicks, they're cached. (Cheap if already cached.) */
    loadDemoFactories();
    openProject(trigger.dataset.openProject);
  });
  /* Warm-load on hover/focus so the first click is instant. */
  let warmed = false;
  const warm = () => {
    if (warmed) return;
    warmed = true;
    loadDemoFactories();
  };
  document.addEventListener('pointerover', (event) => {
    if (event.target.closest('[data-open-project]')) warm();
  }, { passive: true });
  document.addEventListener('focusin', (event) => {
    if (event.target.closest('[data-open-project]')) warm();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
  window.__vuvaOpenProject = openProject;
}
safeInit('initProjectModal', initProjectModal);

/* Magnetic buttons inside the modal need the same treatment as the page's. */
function initModalMagnetics() {
  if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  document.addEventListener('pointermove', (event) => {
    const el = event.target.closest?.('.pfd [data-magnetic]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.transform = `translate(${((event.clientX - rect.left - rect.width / 2) / rect.width) * 20}px, ${((event.clientY - rect.top - rect.height / 2) / rect.height) * 20}px)`;
  });
  document.addEventListener('pointerout', (event) => {
    const el = event.target.closest?.('.pfd [data-magnetic]');
    if (el) el.style.transform = '';
  });
}
safeInit('initModalMagnetics', initModalMagnetics);
