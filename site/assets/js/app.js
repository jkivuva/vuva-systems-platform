import { siteConfig } from './config.js';

document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-navigation]');
const form = document.querySelector('[data-contact-form]');
const status = document.querySelector('[data-form-status]');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Fault isolation: one failing init must never take down the modules after it.
const safe = (label, fn) => { try { fn(); } catch (err) { console.error(`[vuva] ${label} failed:`, err); } };

/* ---------- Preloader ---------- */
function initPreloader() {
  const preloader = document.querySelector('[data-preloader]');
  const wordEl = document.querySelector('[data-pre-word]');
  const countEl = document.querySelector('[data-pre-count]');
  const barEl = document.querySelector('[data-pre-bar]');
  const heroTitle = document.querySelector('.hero-title');
  const finish = () => {
    preloader?.classList.add('is-done');
    document.body.classList.add('loaded');
    heroTitle?.classList.add('in');
    document.documentElement.classList.add('hero-in');
    setTimeout(() => preloader?.remove(), 1000);
  };

  if (!preloader || prefersReducedMotion || !wordEl) {
    if (preloader) preloader.remove();
    heroTitle?.classList.add('in');
    document.documentElement.classList.add('hero-in');
    return;
  }

  // Split the wordmark into animated characters.
  const text = wordEl.textContent ?? '';
  wordEl.setAttribute('aria-hidden', 'true');
  wordEl.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'pw-char';
    span.style.setProperty('--i', String(i));
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    wordEl.appendChild(span);
  });

  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 16 + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(finish, 260);
    }
    if (countEl) countEl.textContent = `${Math.floor(progress)}%`;
    if (barEl) barEl.style.setProperty('--p', String(progress / 100));
  }, 110);
}

safe('initPreloader', initPreloader);

/* ---------- Mobile navigation ---------- */
const setMenu = (open) => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  const label = menuToggle.querySelector('.sr-only');
  if (label) label.textContent = open ? 'Close navigation' : 'Open navigation';
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('has-menu', open);
  // Hard scroll lock while the overlay is active.
  if (open) {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  } else {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }
};

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

// Close the menu the moment any link inside it is activated — click AND touch,
// so the overlay never swallows or lags behind anchor navigation on mobile.
const closeFromLink = () => setMenu(false);
navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeFromLink);
  link.addEventListener('touchend', closeFromLink, { passive: true });
});
navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 780) setMenu(false);
});

/* ---------- Header state + scroll progress ---------- */
const progress = document.querySelector('[data-progress]');
let lastScrollY = window.scrollY;

function updateHeader() {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);
  if (!prefersReducedMotion && !document.body.classList.contains('has-menu')) {
    const goingDown = y > lastScrollY;
    if (goingDown && y > 420) header?.classList.add('nav-hidden');
    else if (!goingDown || y < 120) header?.classList.remove('nav-hidden');
  } else {
    header?.classList.remove('nav-hidden');
  }
  lastScrollY = y;

  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

/* ---------- Reveal on scroll ---------- */
const revealElements = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  revealElements.forEach((element) => observer.observe(element));
}

/* ---------- Editorial word-by-word statements ---------- */
function initWordReveals() {
  const targets = document.querySelectorAll('[data-intro-statement]');
  targets.forEach((el) => {
    if (el.dataset.wordsSplit === 'true') return;
    el.dataset.wordsSplit = 'true';

    // Wrap every word (including inside <em>) in a stagger-reveal span.
    const build = () => {
      let wi = 0;
      const processNode = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((chunk) => {
              if (!chunk) return;
              if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(chunk)); return; }
              const s = document.createElement('span');
              s.className = 'iw';
              s.style.setProperty('--wi', String(wi++));
              s.textContent = chunk;
              frag.appendChild(s);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            processNode(child);
          }
        });
      };
      processNode(el);
    };

    build();

    const markIn = () => el.classList.add('in');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) { markIn(); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { markIn(); obs.disconnect(); }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  });
}
safe('initWordReveals', initWordReveals);

/* ---------- Cursor glow (desktop only) ---------- */
function initCursorGlow() {
  const glow = document.querySelector('[data-cursor-glow]');
  if (!glow || prefersReducedMotion || !finePointer || window.innerWidth < 1024) return;
  let x = 0, y = 0, tx = 0, ty = 0, raf = null;
  const loop = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : null;
  };
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.style.opacity = '1';
    if (raf === null) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}
safe('initCursorGlow', initCursorGlow);

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  if (prefersReducedMotion || !finePointer || window.innerWidth < 1024) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 14;
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${(relX / rect.width) * strength * 2}px, ${(relY / rect.height) * strength * 2}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}
safe('initMagnetic', initMagnetic);

/* ---------- Service rows hover media ---------- */
function initServiceHoverMedia() {
  const rows = [...document.querySelectorAll('[data-service-row]')];
  if (!rows.length || !finePointer || prefersReducedMotion || window.innerWidth < 1024) return;
  const media = document.createElement('div');
  media.className = 'svc-hover-media';
  media.setAttribute('aria-hidden', 'true');
  const img = document.createElement('img');
  img.alt = '';
  img.src = '/assets/img/enterprise.svg';
  media.appendChild(img);
  document.body.appendChild(media);

  const IMAGES = [
    '/assets/img/logistics.svg',
    '/assets/img/hospitality.svg',
    '/assets/img/realestate.svg',
    '/assets/img/retail.svg',
    '/assets/img/professional.svg',
    '/assets/img/healthcare.svg',
    '/assets/img/enterprise.svg'
  ];

  rows.forEach((row, i) => {
    row.addEventListener('pointerenter', () => {
      img.src = IMAGES[i % IMAGES.length];
      media.classList.add('on');
    });
    row.addEventListener('pointerleave', () => media.classList.remove('on'));
    row.addEventListener('pointermove', (e) => {
      media.style.left = `${e.clientX + 28}px`;
      media.style.top = `${e.clientY - 90}px`;
    });
  });
}
safe('initServiceHoverMedia', initServiceHoverMedia);

/* ---------- Parallax on work imagery ---------- */
function initParallax() {
  const items = [...document.querySelectorAll('[data-parallax]')];
  if (!items.length || prefersReducedMotion || !finePointer) return;
  let raf = null;
  const update = () => {
    raf = null;
    const vh = window.innerHeight;
    for (const item of items) {
      const rect = item.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      const progressRatio = (rect.top + rect.height / 2 - vh / 2) / vh;
      item.style.transform = `translateY(${progressRatio * -26}px) scale(1.06)`;
    }
  };
  window.addEventListener('scroll', () => { if (raf === null) raf = requestAnimationFrame(update); }, { passive: true });
  update();
}
safe('initParallax', initParallax);

/* ---------- Sticky stack depth shading ---------- */
function initStackDepth() {
  const cards = [...document.querySelectorAll('[data-stack] .stack-card')];
  if (cards.length < 2 || prefersReducedMotion || !('IntersectionObserver' in window)) return;
  const shade = (card, ratio) => card.style.setProperty('--stack-shade', String(ratio));
  cards.forEach((card) => shade(card, 0));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      shade(entry.target, entry.isIntersecting ? entry.intersectionRect.height / Math.max(entry.boundingClientRect.height, 1) : 0);
    });
  }, { threshold: [0.15, 0.35, 0.6, 0.85] });
  cards.forEach((card) => observer.observe(card));
}
safe('initStackDepth', initStackDepth);

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

/* ---------- Capability strip marquee (duplicate content once) ---------- */
const capStrip = document.querySelector('[data-cap-strip]');
if (capStrip && !capStrip.dataset.cloned) {
  capStrip.dataset.cloned = 'true';
  [...capStrip.children].forEach((child) => {
    const clone = child.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    capStrip.appendChild(clone);
  });
}

/* ---------- Ecosystem flow lighting ---------- */
function initSysFlow() {
  const nodes = [...document.querySelectorAll('[data-sys-flow] [data-snode]')];
  if (!nodes.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-lit', entry.isIntersecting));
  }, { threshold: 0.6 });
  nodes.forEach((node) => observer.observe(node));
}
safe('initSysFlow', initSysFlow);

/* ---------- Hero: subtle scroll fade ---------- */
function initHeroScrollFade() {
  const hero = document.querySelector('.hero-inner');
  if (!hero || prefersReducedMotion) return;
  let raf = null;
  const update = () => {
    raf = null;
    const y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    hero.style.opacity = String(Math.max(1 - y / (window.innerHeight * 0.9), 0));
    hero.style.transform = `translateY(${y * 0.18}px)`;
  };
  window.addEventListener('scroll', () => { if (raf === null) raf = requestAnimationFrame(update); }, { passive: true });
}
safe('initHeroScrollFade', initHeroScrollFade);

/* ============================================================
   INTERACTIVE MODULES (ported)
   ============================================================ */

/* ---------- Capability stage tabs ---------- */
function initCapStage() {
  const stage = document.querySelector('[data-cap-stage]');
  if (!stage) return;
  const tabs = [...stage.querySelectorAll('[data-cap-tab]')];
  const panes = [...stage.querySelectorAll('[data-cap-pane]')];

  const activate = (key) => {
    tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.capTab === key)));
    panes.forEach((pane) => {
      const on = pane.dataset.capPane === key;
      pane.classList.toggle('is-active', on);
      if (on) pane.removeAttribute('hidden');
      else pane.setAttribute('hidden', '');
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.capTab));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const dir = event.key === 'ArrowDown' ? 1 : -1;
      const next = tabs[(tabs.indexOf(tab) + dir + tabs.length) % tabs.length];
      next.focus();
      activate(next.dataset.capTab);
    });
  });
}
safe('initCapStage', initCapStage);

/* ---------- Pane: custom software · application feed ---------- */
function initSoftwareFeed() {
  const feed = document.querySelector('[data-app-feed]');
  const button = document.querySelector('[data-app-next]');
  if (!feed || !button) return;

  const names = ['A. Njoroge', 'B. Otieno', 'C. Wanjiru', 'D. Kamau', 'E. Achieng'];
  const amounts = [15000, 30000, 45000, 60000, 80000];
  let n = 2215;

  button.addEventListener('click', () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const approved = Math.random() > 0.35;
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const li = document.createElement('li');
    li.classList.add('is-new');
    li.innerHTML = `<b>${time}</b> Application #${n} · ${name} · KSh ${amount.toLocaleString('en-KE')} · ${
      approved ? 'auto-checks passed, offer ready' : 'flagged for officer review'
    }`;
    n += 1;
    feed.prepend(li);
    while (feed.children.length > 5) feed.lastElementChild.remove();
  });
}
safe('initSoftwareFeed', initSoftwareFeed);

/* ---------- Pane: automation pipeline runner ---------- */
function runPipeline(steps, { stepMs = 850, doneMs = 650 } = {}) {
  if (!steps.length) return () => {};
  let timers = [];
  const stop = () => { timers.forEach(clearTimeout); timers = []; };
  const reset = () => {
    stop();
    steps.forEach((s) => s.classList.remove('is-active', 'is-done'));
  };
  const play = () => {
    reset();
    steps.forEach((step, i) => {
      timers.push(setTimeout(() => {
        steps.forEach((s, j) => {
          s.classList.toggle('is-active', j === i);
          s.classList.toggle('is-done', j < i);
        });
        if (i === steps.length - 1) {
          timers.push(setTimeout(() => {
            steps.forEach((s) => { s.classList.remove('is-active'); s.classList.add('is-done'); });
          }, doneMs));
        }
      }, i * stepMs));
    });
  };
  return play;
}

function initAutomationPane() {
  const steps = [...document.querySelectorAll('[data-auto-flow] [data-fstep]')];
  const button = document.querySelector('[data-auto-run]');
  if (!steps.length || !button) return;
  const play = runPipeline(steps);
  button.addEventListener('click', play);

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    let played = false;
    new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !played) { played = true; play(); obs.disconnect(); }
      });
    }, { threshold: 0.45 }).observe(button.closest('[data-cap-pane]') || button);
  }
}
safe('initAutomationPane', initAutomationPane);

/* ---------- Pane: practical AI request processing ---------- */
function initAiSteps() {
  const list = document.querySelector('[data-ai-steps]');
  if (!list) return;

  const SCENARIOS = {
    'Where is my delivery?': [
      ['Find out who it is', 'The phone number matches K. Mwangi\'s account'],
      ['Look up the order', 'Order #4821 is out for delivery'],
      ['Check the rider', 'The rider is about six minutes away'],
      ["Write the reply", '"Your delivery arrives in about 6 minutes."'],
      ['Reply and save', 'The reply goes out on WhatsApp and the chat is logged']
    ],
    'Do you have a 2-bedroom vacant?': [
      ['Understand the question', 'Someone is asking about a two bedroom rental'],
      ['Search the listings', 'Six units under KSh 60k match'],
      ['Pick the best fit', 'A Kilimani unit sits closest to their budget'],
      ["Write the reply", "“Yes, we have 6 units. You can view one today at 2 PM.”"],
      ['Reply and save', 'The reply goes out and a new lead is saved in the CRM']
    ],
    'I want to book a car Friday': [
      ['Understand the request', 'They want to book a car this Friday'],
      ['Check the fleet', 'Three vehicles are free, from KSh 6,500 a day'],
      ['Work out the price', 'Two days with a driver comes to KSh 16,000'],
      ['Ask for details', 'ID, licence and a deposit are requested'],
      ['Hold the booking', 'The car is held for an hour and a confirmation is sent']
    ]
  };

  const render = (question) => {
    const steps = SCENARIOS[question] || [];
    list.innerHTML = '';
    steps.forEach(([title, detail], i) => {
      const li = document.createElement('li');
      li.className = 'flow-step is-done';
      li.style.opacity = '0';
      li.innerHTML = `<span class="flow-dot">${i + 1}</span><div><strong>${title}</strong><small>${detail}</small></div>`;
      list.appendChild(li);
      setTimeout(() => {
        li.style.transition = 'opacity .4s ease';
        li.style.opacity = '1';
      }, 120 + i * 160);
    });
  };

  document.querySelectorAll('[data-ai-q]').forEach((btn) => {
    btn.addEventListener('click', () => render(btn.dataset.aiQ));
  });

  const pane = list.closest('[data-cap-pane]');
  const trigger = document.querySelector('[data-cap-tab="ai"]');
  trigger?.addEventListener('click', () => {
    if (!list.children.length) render(Object.keys(SCENARIOS)[0]);
  });
  if (pane?.classList.contains('is-active') && !list.children.length) render(Object.keys(SCENARIOS)[0]);
}
safe('initAiSteps', initAiSteps);

/* ---------- Pane: WhatsApp order lifecycle ---------- */
function initWaChat() {
  const body = document.querySelector('[data-wa-chat]');
  if (!body) return;
  const NEXT = {
    kitchen: 'Kitchen update: your order is being prepared 👨‍🍳 Estimated ready in 18 min.',
    rider: 'Rider Ann has your order and is on the way 🛵 Track live until doorstep.',
    delivered: 'Delivered ✅ Thank you for ordering. Your receipt is saved in this chat.'
  };
  document.querySelectorAll('[data-wa-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = NEXT[btn.dataset.waStep];
      if (!text) return;
      const msg = document.createElement('div');
      msg.className = 'wa-msg out is-new';
      const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      msg.innerHTML = `${text}<span class="wa-meta">${time} ✓✓</span>`;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    });
  });
}
safe('initWaChat', initWaChat);

/* ---------- Pane: integrations cascade ---------- */
function initIntegStack() {
  const layers = [...document.querySelectorAll('[data-integ-stack] [data-ilayer]')];
  const button = document.querySelector('[data-integ-run]');
  if (!layers.length || !button) return;
  const play = runPipeline(layers, { stepMs: 700, doneMs: 500 });
  button.addEventListener('click', play);
}
safe('initIntegStack', initIntegStack);

/* ---------- Pane: responsive resize slider ---------- */
function initResizeFrame() {
  const range = document.querySelector('[data-resize-range]');
  const frame = document.querySelector('[data-resize-frame]');
  if (!range || !frame) return;
  range.addEventListener('input', () => {
    frame.style.maxWidth = `${range.value}px`;
  });
}
safe('initResizeFrame', initResizeFrame);

/* ---------- AI automation showcase scenarios ---------- */
function initShowcaseFlow() {
  const list = document.querySelector('[data-showcase-flow]');
  if (!list) return;

  const FLOWS = {
    delivery: [
      ['Customer message', '“Where is my delivery?” · WhatsApp, 10:42'],
      ['AI understands', 'Intent: delivery status. Language: English'],
      ['Identifies customer', 'Phone matches account. K. Mwangi verified'],
      ['Finds the shipment', 'VU-2042, Nairobi to Kisumu, in transit'],
      ['Computes ETA', 'Passed Naivasha at 09:31, arriving about 14:20'],
      ['Replies automatically', '“Your shipment arrives around 14:20 today.”'],
      ['Logs the interaction', 'Saved to shipment history, no staff time used']
    ],
    rental: [
      ['Customer message', '“I want to book a car for Friday” · WhatsApp'],
      ['AI understands', 'Intent: vehicle booking on Friday'],
      ['Checks the fleet', 'Three vehicles free Friday and Saturday: Harrier, Note, Demio'],
      ['Calculates price', 'Two days with a driver comes to about KSh 16,000'],
      ['Creates reservation', 'Vehicle held and booking RB-2291 created'],
      ['Sends confirmation', 'Summary + deposit payment link delivered'],
      ['Notifies operations', 'Cleaning and prep task added to the Friday board']
    ],
    clinic: [
      ['Patient message', '“Can I move my appointment to Thursday?” · WhatsApp'],
      ['AI understands', 'Intent: reschedule. Patient M. Wanjiku'],
      ['Finds the appointment', 'Cardiology with Dr. Mwangi, Friday 09:30'],
      ['Checks doctor availability', 'Thursday 11:00 is open and the queue looks light'],
      ['Updates the schedule', 'Old slot released, Thursday 11:00 confirmed'],
      ['Confirms to patient', '“Moved to Thursday 11:00. Reminder will come here.”'],
      ['Syncs reception', 'Front desk calendar updated with notes attached']
    ],
    invoice: [
      ['Invoice arrives', 'Supplier PDF lands in the finance inbox'],
      ['AI extracts the fields', 'Supplier, date, line items and totals read automatically'],
      ['Matches the purchase order', 'PO-1187 found · quantities and prices agree'],
      ['Routes for approval', 'Under limit, so the budget owner approves in one tap'],
      ['Schedules payment', 'Due date queued for the next M-Pesa / bank run'],
      ['Reconciles itself', 'Payment confirmation matches back to the invoice — no spreadsheet']
    ]
  };

  const render = (key) => {
    const steps = FLOWS[key] || [];
    list.innerHTML = '';
    steps.forEach(([title, detail], i) => {
      const li = document.createElement('li');
      li.className = 'flow-step';
      li.innerHTML = `<span class="flow-dot">${i + 1}</span><div><strong>${title}</strong><small>${detail}</small></div>`;
      list.appendChild(li);
    });
  };

  const play = runPipeline(list.querySelectorAll('.flow-step'), { stepMs: 700, doneMs: 600 });

  const buttons = [...document.querySelectorAll('[data-flow-pick]')];
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      render(btn.dataset.flowPick);
      play();
    });
  });

  const runBtn = document.querySelector('[data-showcase-run]');
  runBtn?.addEventListener('click', play);

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    let played = false;
    new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !played) { played = true; play(); obs.disconnect(); }
      });
    }, { threshold: 0.35 }).observe(list);
  } else {
    play();
  }

  render('delivery');
}
safe('initShowcaseFlow', initShowcaseFlow);

/* ---------- WhatsApp industry scenes ---------- */
function initWaScenes() {
  const body = document.querySelector('[data-wa-demo-chat]');
  if (!body) return;

  const SCENES = {
    property: [
      ['in', 'Hi, do you have any 2-bedroom vacant?', '14:02 ✓✓'],
      ['out', 'Yes, we have 6 two-bedroom units under KSh 60,000. Three in Kilimani, two in Westlands and one in Lavington. Would you like to book a viewing today?', '14:02 ✓✓'],
      ['in', 'Yes, 2pm', '14:03 ✓✓'],
      ['out', 'Booked ✅ Kilimani viewing at 2:00 PM. Agent Ann will meet you there and the gate code is 4412. Reminder will come here 1 hour before.', '14:03 ✓✓']
    ],
    logistics: [
      ['in', 'Where is my cargo VU-2042?', '09:15 ✓✓'],
      ['out', 'VU-2042 passed Naivasha at 09:31 and is on schedule and should reach Kisumu around 14:20. I’ll confirm the moment it’s delivered.', '09:15 ✓✓'],
      ['in', 'Thanks, that helps', '09:16 ✓✓'],
      ['out', 'Anytime! Proof of delivery with photo will be sent to this number at drop-off 📦', '09:16 ✓✓']
    ],
    rental: [
      ['in', 'Is the Harrier available this weekend?', '16:40 ✓✓'],
      ['out', 'Yes, Saturday 8 AM to Sunday 8 PM is free. KSh 7,500/day, KSh 20,000 refundable deposit. Include a driver for KSh 3,000/day?', '16:40 ✓✓'],
      ['in', 'No driver. Book it', '16:41 ✓✓'],
      ['out', 'Reserved ✅ Deposit link sent here. Pickup is Saturday at 8 AM, please bring your ID and licence. Changes are free until Friday.', '16:41 ✓✓']
    ],
    clinic: [
      ['in', 'Reminding me of what time tomorrow?', '18:00 ✓✓'],
      ['out', 'Your cardiology appointment is tomorrow (Friday) at 9:30 AM with Dr. Mwangi. You’re #3 in the morning queue.', '18:00 ✓✓'],
      ['in', 'Can I come earlier?', '18:01 ✓✓'],
      ['out', 'An 8:30 slot just opened · shall I take it? Reply YES and I’ll move you instantly.', '18:01 ✓✓']
    ]
  };

  document.querySelectorAll('[data-wa-scene]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-wa-scene]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const msgs = SCENES[btn.dataset.waScene] || [];
      body.innerHTML = '';
      msgs.forEach(([kind, text, meta], i) => {
        const div = document.createElement('div');
        div.className = `wa-msg ${kind}`;
        div.innerHTML = `${text}<span class="wa-meta">${meta}</span>`;
        body.appendChild(div);
        if (i === msgs.length - 1) body.scrollTop = body.scrollHeight;
      });
    });
  });
}
safe('initWaScenes', initWaScenes);

/* ---------- Agent mesh ---------- */
function initAgentMesh() {
  const mesh = document.querySelector('[data-agent-mesh]');
  const nameEl = document.querySelector('[data-agent-name]');
  const descEl = document.querySelector('[data-agent-desc]');
  const chainEl = document.querySelector('[data-agent-chain]');
  if (!mesh || !nameEl || !descEl || !chainEl) return;

  const AGENTS = {
    customer: {
      name: 'Customer Agent',
      desc: 'Answers customer questions using real business data such as orders, bookings and accounts, then completes routine requests end to end.',
      chain: ['Customer channels', 'CRM', 'Orders / bookings', 'Human escalation when unsure']
    },
    sales: {
      name: 'Sales Agent',
      desc: 'Talks to new leads, books calls into the team calendar and follows up until someone replies.',
      chain: ['Lead channels', 'CRM', 'Calendar', 'Sales team handoff']
    },
    ops: {
      name: 'Operations Agent',
      desc: 'Assigns dispatches, sends tasks to the right branch or person and flags problems before they become delays.',
      chain: ['Operations dashboard', 'Dispatch board', 'Staff notifications', 'Manager escalation']
    },
    support: {
      name: 'Support Agent',
      desc: 'Handles the repeat questions on its own and passes the rest to your team with full context.',
      chain: ['Support inbox', 'Knowledge base', 'Ticketing', 'Human escalation']
    },
    research: {
      name: 'Research Agent',
      desc: 'Reads documents and contracts, then summarises them so your team can check the sources.',
      chain: ['Document store', 'Web sources', 'Summaries', 'Review by staff']
    },
    analytics: {
      name: 'Analytics Agent',
      desc: 'Answers questions about sales, stock and performance using the data in your systems.',
      chain: ['Database', 'Analytics models', 'Dashboards', 'Alert rules']
    }
  };

  mesh.querySelectorAll('[data-agent]').forEach((card) => {
    card.addEventListener('click', () => {
      mesh.querySelectorAll('[data-agent]').forEach((c) => c.classList.toggle('is-active', c === card));
      const agent = AGENTS[card.dataset.agent];
      if (!agent) return;
      nameEl.textContent = agent.name;
      descEl.textContent = agent.desc;
      chainEl.innerHTML = '';
      agent.chain.forEach((item, i) => {
        const span = document.createElement('span');
        span.textContent = item;
        chainEl.appendChild(span);
        if (i < agent.chain.length - 1) {
          const sep = document.createElement('span');
          sep.className = 'sep';
          sep.textContent = '→';
          chainEl.appendChild(sep);
        }
      });
    });
  });
}
safe('initAgentMesh', initAgentMesh);

/* ---------- Architecture stack scroll lighting ---------- */
function initArchStack() {
  const layers = [...document.querySelectorAll('[data-arch-stack] [data-alayer]')];
  if (!layers.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-lit', entry.isIntersecting));
  }, { threshold: 0.6 });
  layers.forEach((layer) => observer.observe(layer));
}
safe('initArchStack', initArchStack);

/* ---------- "What can we build?" explorer ---------- */
const EXPLORER = {
  'Automate customer support': ['AI assistant that answers common questions', 'Auto-triage to the right person', 'WhatsApp & email automation', 'Saved replies and case history'],
  'Build a customer portal': ['Login and account area', 'Orders, documents and history', 'Status tracking and updates', 'Self-service requests'],
  'Track deliveries': ['Live shipment tracking', 'Rider / driver GPS views', 'Customer delivery notifications', 'Dispatch and proof of delivery'],
  'Manage branches': ['Multi-branch dashboard', 'Per-branch performance', 'Central menu, stock or pricing', 'Staff and role management'],
  'Manage inventory': ['Live stock across locations', 'Low-stock and reorder alerts', 'Transfers between branches', 'Supplier and purchase records'],
  'Automate WhatsApp': ['Order or enquiry capture', 'Automated notifications', 'Business API integration', 'Conversations linked to records'],
  'Accept payments': ['M-Pesa and card checkout', 'Payment links and invoicing', 'Reconciliation and receipts', 'Recurring / scheduled billing'],
  'Build an internal dashboard': ['Live operational view', 'KPIs and charts', 'Role-based access', 'Reports your team trusts'],
  'Build SaaS': ['Multi-tenant platform', 'Subscriptions and billing', 'Onboarding and settings', 'Admin console'],
  'Connect APIs': ['Third-party integrations', 'Webhooks and data sync', 'Payments, maps and messaging', 'Legacy system connectors'],
  'Add AI': ['AI agents inside workflows', 'Document and data insight', 'Customer and staff assistants', 'Automated decisions and actions'],
  'Automate bookings': ['Online scheduling', 'Reminders and confirmations', 'Queue and capacity control', 'No-show follow-ups'],
  'Manage operations': ['End-to-end workflow tracking', 'Team handoffs and tasks', 'Real-time status across teams', 'One connected system'],
  'Analyse business data': ['Reporting and analytics', 'Sales and performance trends', 'Forecasts and alerts', 'Data you can actually act on']
};

function initExplorer() {
  const explorer = document.querySelector('[data-explorer]');
  if (!explorer) return;

  const chips = explorer.querySelectorAll('[data-goal]');
  const output = explorer.querySelector('[data-explorer-output]');
  const heading = output.querySelector('[data-out-heading]');
  const lead = output.querySelector('[data-out-lead]');
  const list = output.querySelector('[data-out-list]');

  const render = (goal) => {
    const items = EXPLORER[goal] || [];
    heading.textContent = goal;
    lead.textContent = 'Here is what we would build for this.';
    list.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  };

  chips.forEach((chip) => {
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      const isActive = chip.getAttribute('aria-pressed') === 'true';
      chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
      if (isActive) {
        chip.setAttribute('aria-pressed', 'false');
        heading.textContent = 'Select a goal to begin';
        lead.textContent = 'Pick a goal and we will show what goes into it.';
        list.innerHTML = '';
      } else {
        chip.setAttribute('aria-pressed', 'true');
        render(chip.dataset.goal);
      }
    });
  });
}
safe('initExplorer', initExplorer);

/* ---------- Contact form → WhatsApp ---------- */
const sanitizeLine = (value) => value.trim().replace(/\s+/g, ' ');
const fieldLabel = (form, name) => {
  const field = form.querySelector(`[name="${name}"]`);
  if (!field) return '';
  const option = field.selectedOptions?.[0];
  return option?.textContent || sanitizeLine(field.value) || '';
};

const createWhatsAppMessage = (data, form) => {
  const pick = (name) => sanitizeLine(data.get(name) || '');
  const targets = [...form.querySelectorAll('input[name="build_target"]:checked')]
    .map((el) => el.value)
    .join(', ');

  const lines = [
    'Hello Vuva Systems, I would like to discuss a project.',
    '',
    `Name: ${pick('name')}`,
    `Company: ${pick('company') || 'Not provided'}`,
    `Email: ${pick('email')}`,
    `Phone / WhatsApp: ${pick('phone') || 'Not provided'}`,
    `Industry: ${pick('industry') || 'Not provided'}`,
    `Business size: ${pick('size') || 'Not provided'}`,
    `Project type: ${pick('project_type') || 'Not provided'}`,
    `System should include: ${targets || 'Not specified'}`,
    `Budget: ${pick('budget') || 'Not provided'}`,
    `Contact method: ${pick('contact_method') || 'WhatsApp'}`,
    '',
    'What would you like to build or improve:',
    pick('requirements')
  ];

  return lines.filter((l) => l !== '').join('\n');
};

form?.querySelectorAll('input, textarea, select').forEach((field) => {
  field.addEventListener('input', () => {
    field.removeAttribute('aria-invalid');
    if (status) status.textContent = '';
  });
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  if (data.get('website')) {
    if (status) status.textContent = 'Thank you.';
    form.reset();
    return;
  }

  if (!form.checkValidity()) {
    form.querySelectorAll(':invalid').forEach((field) => field.setAttribute('aria-invalid', 'true'));
    if (status) status.textContent = 'Please complete the required fields and check your email address.';
    form.reportValidity();
    return;
  }

  const message = createWhatsAppMessage(data, form);
  const whatsappUrl = `${siteConfig.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
  if (status) status.textContent = 'Opening WhatsApp…';

  const link = document.createElement('a');
  link.href = whatsappUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.append(link);
  link.click();
  link.remove();
});
