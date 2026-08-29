// Vuva demo types B — workflow, AI, finance, portal, configurator, gallery & micro demos.
import {
  esc, money, photo, el, toast, busy, segmented, timeline, sparkline,
  statRow, demoShell, imageStrip, successCard, seeded
} from './demo-kit.js';

/* ---------------------------------------------------------------- WORKFLOW */
export function workflowDemo(body, cfg) {
  cfg = cfg || {};
  const steps = cfg.steps || [
    { label: 'Enquiry arrives', detail: 'New message from the website contact form' },
    { label: 'AI qualification', detail: 'Budget signals found · intent: new system build' },
    { label: 'CRM record created', detail: 'Lead scored 82/100 — warm, assigned to sales' },
    { label: 'Salesperson notified', detail: 'WhatsApp card sent to the account owner' },
    { label: 'Follow-up scheduled', detail: 'Auto reminder in 24 h if no reply' }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Lead Automation Flow', 'Demonstration · sample run');
  const tl = el('div');
  const log = el('ul', 'dm-log');
  let index = -1;
  let timer = null;

  const runBtn = el('button', 'button button-accent dm-cta', 'Run the workflow ▸');
  runBtn.type = 'button';
  const resetBtn = el('button', 'button button-ghost dm-cta', 'Reset');
  resetBtn.type = 'button';

  function paint() {
    tl.replaceChildren(timeline(steps, index));
  }
  function logLine(i) {
    const li = el('li', null, `<b>${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</b> ${esc(steps[i].label)} — ${esc(steps[i].detail)}`);
    log.prepend(li);
  }
  runBtn.addEventListener('click', () => {
    clearInterval(timer);
    index = -1; log.replaceChildren(); paint();
    timer = setInterval(() => {
      index += 1;
      if (index >= steps.length) {
        clearInterval(timer);
        toast(root, 'Workflow complete — lead ready for the team.');
        return;
      }
      paint(); logLine(index);
    }, 850);
  });
  resetBtn.addEventListener('click', () => { clearInterval(timer); index = -1; log.replaceChildren(); paint(); });

  shellBody.append(runBtn, resetBtn, tl, el('h4', 'dm-step-title', 'Activity log'), log);
  shellBody.appendChild(el('p', 'dm-note', 'Sample run. The real engine runs these steps against your CRM, WhatsApp and calendars automatically.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- AI FLOW */
export function aiFlowDemo(body, cfg) {
  cfg = cfg || {};
  const scenarios = cfg.scenarios || [
    {
      msg: 'I want to book an appointment with a cardiologist tomorrow.',
      steps: [
        ['Message received', 'WhatsApp · 09:41'],
        ['Intent detected', 'Appointment booking'],
        ['Entities extracted', 'Department: Cardiology · Date: Tomorrow'],
        ['Checking availability', 'Dr. Wanjiru has 4 open slots'],
        ['Action taken', 'Slots offered back in the chat, booking one tap away']
      ]
    },
    {
      msg: 'Where is my order #4821?',
      steps: [
        ['Message received', 'WhatsApp · 14:02'],
        ['Intent detected', 'Order status'],
        ['Customer matched', 'Phone verified → K. Mwangi'],
        ['Order located', '#4821 out for delivery, rider 6 min away'],
        ['Action taken', 'Live ETA replied automatically, chat logged']
      ]
    },
    {
      msg: 'Do you supply 200 bags of cement to Kisumu?',
      steps: [
        ['Message received', 'WhatsApp · 11:15'],
        ['Intent detected', 'Bulk quote request'],
        ['Stock checked', '1,240 bags available at the Kisumu depot'],
        ['Price computed', 'Volume discount applied — quote drafted'],
        ['Action taken', 'Quote sent + sales rep notified for follow-up']
      ]
    }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Talk to the AI', 'Simulated assistant · sample data');
  let current = scenarios[0];

  const chips = el('div', 'dm-chiprow');
  scenarios.forEach((s) => {
    const b = el('button', 'chip', esc(s.msg.length > 34 ? s.msg.slice(0, 33) + '…' : s.msg));
    b.type = 'button';
    b.addEventListener('click', () => { current = s; run(); chips.querySelectorAll('.chip').forEach((x) => x.classList.toggle('is-on', x === b)); });
    chips.appendChild(b);
  });
  const chat = el('div', 'dm-ai');
  const stepsHost = el('ol', 'dm-ai-steps');

  function run() {
    chat.innerHTML = `<div class="wa-msg in">${esc(current.msg)}<span class="wa-meta">now ✓✓</span></div>`;
    stepsHost.replaceChildren();
    current.steps.forEach(([t, d], i) => {
      setTimeout(() => {
        const li = el('li', 'dm-ai-step is-done', `<span class="dm-ai-dot">${i + 1}</span><div><strong>${esc(t)}</strong><small>${esc(d)}</small></div>`);
        stepsHost.appendChild(li);
        if (i === current.steps.length - 1) {
          chat.insertAdjacentHTML('beforeend', `<div class="wa-msg out">Done — handled end to end, records updated.<span class="wa-meta">now ✓✓</span></div>`);
        }
      }, 420 * (i + 1));
    });
  }
  run();
  shellBody.append(chips, chat, el('h4', 'dm-step-title', 'What the system does'), stepsHost);
  shellBody.appendChild(el('p', 'dm-note', 'Simulated reasoning with sample data. Production assistants read your real records and always escalate sensitive actions to a person.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- FINANCE */
export function financeDemo(body, cfg) {
  cfg = cfg || {};
  const invoices = cfg.invoices || [
    { id: 'INV-8841', supplier: 'Kilimanjaro Supplies', amount: 184500, match: 'PO-1187', status: 'Matched' },
    { id: 'INV-8842', supplier: 'Nairobi Fleet Care', amount: 96200, match: 'PO-1190', status: 'Matched' },
    { id: 'INV-8843', supplier: 'TechHub Ltd', amount: 250000, match: '—', status: 'Needs review' }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Invoice Processing', 'Demonstration · sample invoices');
  const host = el('div', 'dm-finance');
  shellBody.appendChild(host);

  function render() {
    host.replaceChildren();
    host.appendChild(statRow([
      { label: 'Inbox', value: String(invoices.length) },
      { label: 'Auto-matched', value: String(invoices.filter((i) => i.status === 'Matched').length) },
      { label: 'Awaiting approval', value: String(invoices.filter((i) => i.status !== 'Matched').length) },
      { label: 'Total value', value: money(invoices.reduce((s, i) => s + i.amount, 0)) }
    ]));
    invoices.forEach((inv, idx) => {
      const row = el('div', 'dm-invrow');
      row.innerHTML = `
        <div class="dm-inv-main"><strong>${esc(inv.id)}</strong><span>${esc(inv.supplier)} · ${money(inv.amount)} · ${esc(inv.match)}</span></div>
        <span class="dm-badge ${inv.status === 'Matched' ? 'is-ok' : 'is-warn'}">${esc(inv.status)}</span>`;
      const act = el('button', 'button button-ghost dm-add', inv.status === 'Matched' ? 'Approve' : 'Extract');
      act.type = 'button';
      act.addEventListener('click', () => {
        busy(act, 1000, () => {
          if (inv.status !== 'Matched') {
            inv.match = 'PO-1193 (auto-found)';
            inv.status = 'Matched';
            toast(root, `${inv.id}: fields extracted, PO matched.`);
            render();
          } else {
            inv.status = 'Approved';
            toast(root, `${inv.id} approved — payment scheduled.`);
            render();
          }
        });
      });
      row.appendChild(act);
      host.appendChild(row);
    });
  }
  render();
  shellBody.appendChild(el('p', 'dm-note', 'Sample data. The pipeline reads invoices from your inbox, matches them to purchase orders and routes approvals.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- PORTAL */
export function portalDemo(body, cfg) {
  cfg = cfg || {};
  const { root, body: shellBody } = demoShell(cfg.title || 'Customer Portal', 'Demonstration · sample account');
  const tabs = [
    { key: 'orders', label: 'Orders' },
    { key: 'documents', label: 'Documents' },
    { key: 'requests', label: 'Requests' }
  ];
  const controls = el('div', 'dm-controls');
  const host = el('div', 'dm-portal');
  shellBody.append(controls, host);

  const orders = [
    { id: '#4821', date: '12 Aug', status: 'In transit', value: 14500 },
    { id: '#4795', date: '04 Aug', status: 'Delivered', value: 22800 },
    { id: '#4711', date: '21 Jul', status: 'Delivered', value: 8900 }
  ];
  const docs = [
    { name: 'Invoice #4821.pdf', size: '84 KB' },
    { name: 'Statement — July.pdf', size: '132 KB' },
    { name: 'SLA agreement (signed).pdf', size: '210 KB' }
  ];
  const requests = [
    { id: 'REQ-104', what: 'Change delivery address', status: 'Done' },
    { id: 'REQ-099', what: 'Download tax certificate', status: 'Done' }
  ];

  function renderTab(key) {
    host.replaceChildren();
    if (key === 'orders') {
      const t = el('table', 'dm-table');
      t.innerHTML = '<thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Value</th></tr></thead>';
      const tb = el('tbody');
      orders.forEach((o) => {
        const tr = el('tr', null, `<td class="mono">${o.id}</td><td>${o.date}</td><td><span class="dm-badge ${o.status === 'Delivered' ? 'is-ok' : 'is-info'}">${o.status}</span></td><td>${money(o.value)}</td>`);
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      host.appendChild(t);
    } else if (key === 'documents') {
      const list = el('ul', 'dm-doclist');
      docs.forEach((d) => {
        const li = el('li', null, `<span>📄 ${esc(d.name)}</span><small>${d.size}</small>`);
        const b = el('button', 'button button-ghost dm-add', 'View');
        b.type = 'button';
        b.addEventListener('click', () => toast(root, `${d.name} would open here (demo).`));
        li.appendChild(b);
        list.appendChild(li);
      });
      host.appendChild(list);
    } else {
      const list = el('ul', 'dm-doclist');
      requests.forEach((q) => {
        list.appendChild(el('li', null, `<span>${esc(q.what)}</span><small class="mono">${q.id} · ${q.status}</small>`));
      });
      host.appendChild(list);
      const newReq = el('button', 'button button-ghost dm-cta', 'New request');
      newReq.type = 'button';
      const input = el('input', 'dm-input');
      input.placeholder = 'e.g. Reschedule Thursday delivery…';
      input.setAttribute('aria-label', 'New request');
      newReq.addEventListener('click', () => {
        if (!input.value.trim()) { toast(root, 'Type a request first', 'warn'); return; }
        busy(newReq, 600, () => {
          requests.unshift({ id: 'REQ-' + (105 + requests.length), what: input.value.trim(), status: 'Received' });
          input.value = '';
          renderTab('requests');
          toast(root, 'Request logged and assigned a tracking number.');
        });
      });
      host.append(input, newReq);
    }
  }
  segmented(controls, tabs, 'orders', renderTab);
  renderTab('orders');
  shellBody.appendChild(el('p', 'dm-note', 'Sample account. Your customers would see their own live orders, documents and requests here.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- COURSE */
export function courseDemo(body, cfg) {
  cfg = cfg || {};
  /* Two-sided course platform: course list → lesson player → mark
     complete → progress updates → assignment → submit. Pure local state. */
  const courses = cfg.courses || [
    {
      id: 'cp-101', code: 'CP-101', title: 'Introduction to Cloud Operations',
      teacher: 'Mr. K. Njoroge', cohort: 'Cohort 12 · Term 3',
      progress: 0.40,
      lessons: [
        { id: 'l1', title: 'What is a server?', done: true,  duration: '8 min' },
        { id: 'l2', title: 'Why we use the cloud', done: true, duration: '11 min' },
        { id: 'l3', title: 'Picking a region',     done: false, duration: '9 min' },
        { id: 'l4', title: 'Identity and access',  done: false, duration: '14 min' },
        { id: 'l5', title: 'A first deployment',   done: false, duration: '18 min' }
      ],
      assignment: {
        id: 'as-1', title: 'Set up your first VM',
        prompt: 'Create a small VM in any cloud (AWS / GCP / Azure). Record the steps as a 6-step bullet list and submit.',
        submitted: false, grade: null
      }
    },
    {
      id: 'dp-202', code: 'DP-202', title: 'Data Pipelines for Analysts',
      teacher: 'Ms. F. Wanjiku', cohort: 'Cohort 8 · Term 3',
      progress: 0.10,
      lessons: [
        { id: 'l1', title: 'Sources and sinks',   done: true,  duration: '7 min' },
        { id: 'l2', title: 'Scheduling jobs',     done: false, duration: '12 min' },
        { id: 'l3', title: 'Schema evolution',    done: false, duration: '10 min' },
        { id: 'l4', title: 'Backfills and reruns',done: false, duration: '13 min' }
      ],
      assignment: {
        id: 'as-2', title: 'Reverse a pipeline',
        prompt: 'Given a 3-stage pipeline diagram, write the SQL that reproduces it and submit a 2-paragraph explanation.',
        submitted: false, grade: null
      }
    },
    {
      id: 'gd-150', code: 'GD-150', title: 'Graphic Design Foundations',
      teacher: 'Mr. A. Otieno', cohort: 'Cohort 5 · Term 3',
      progress: 0.70,
      lessons: [
        { id: 'l1', title: 'Grid systems',         done: true,  duration: '9 min' },
        { id: 'l2', title: 'Typography basics',    done: true,  duration: '13 min' },
        { id: 'l3', title: 'Colour and contrast',  done: true,  duration: '11 min' },
        { id: 'l4', title: 'Putting it together',  done: false, duration: '16 min' }
      ],
      assignment: {
        id: 'as-3', title: 'Brand mini system',
        prompt: 'Build a 3-component brand mini-system (logo, accent, layout) and submit as a single PDF.',
        submitted: false, grade: null
      }
    }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Learner Dashboard', 'Demonstration · sample data');
  const state = { courseId: courses[0].id, lessonId: null, answer: '', submission: null };

  /* --- Course list + course detail two-pane layout --- */
  const layout = el('div', 'dm-course-layout');
  const sidebar = el('aside', 'dm-course-side');
  const detail = el('div', 'dm-course-detail');
  layout.append(sidebar, detail);
  shellBody.appendChild(layout);

  function progressBar(pct) {
    const wrap = el('div', 'dm-course-progress');
    const bar = el('div', 'dm-course-progress-bar');
    bar.innerHTML = `<i style="width:${Math.round(pct * 100)}%"></i>`;
    wrap.append(bar, el('span', 'dm-course-progress-label', Math.round(pct * 100) + '% complete'));
    return wrap;
  }
  function lessonChip(lesson, active) {
    const c = el('button', 'dm-course-lesson' + (active ? ' is-on' : '') + (lesson.done ? ' is-done' : ''));
    c.type = 'button';
    c.innerHTML = `
      <span class="dm-course-lesson-mark" aria-hidden="true">${lesson.done ? '✓' : ''}</span>
      <span class="dm-course-lesson-main">
        <strong>${esc(lesson.title)}</strong>
        <small>${esc(lesson.duration)}</small>
      </span>`;
    c.addEventListener('click', () => { state.lessonId = lesson.id; renderDetail(); });
    return c;
  }

  function renderSidebar() {
    sidebar.replaceChildren();
    const head = el('h4', 'dm-course-h', 'My courses');
    sidebar.appendChild(head);
    courses.forEach((c) => {
      const done = c.lessons.filter((l) => l.done).length;
      const total = c.lessons.length;
      const card = el('button', 'dm-course-card' + (c.id === state.courseId ? ' is-on' : ''));
      card.type = 'button';
      card.innerHTML = `
        <span class="dm-course-card-h">
          <span class="mono">${esc(c.code)}</span>
          <span class="mono dm-course-card-pct">${done}/${total}</span>
        </span>
        <strong>${esc(c.title)}</strong>
        <span class="muted-note">${esc(c.teacher)} · ${esc(c.cohort)}</span>
        ${progressBar(c.progress).outerHTML}`;
      card.addEventListener('click', () => { state.courseId = c.id; state.lessonId = null; renderAll(); });
      sidebar.appendChild(card);
    });
  }

  function renderDetail() {
    detail.replaceChildren();
    const c = courses.find((x) => x.id === state.courseId);
    if (!c) return;
    /* Top: progress + teacher */
    const head = el('div', 'dm-course-head');
    head.innerHTML = `
      <div>
        <p class="mono dm-course-kicker">${esc(c.code)} · ${esc(c.cohort)}</p>
        <h3>${esc(c.title)}</h3>
        <p class="muted-note">Taught by ${esc(c.teacher)}</p>
      </div>`;
    head.appendChild(progressBar(c.progress));
    detail.appendChild(head);

    /* Lessons list */
    const lessonBlock = el('section', 'dm-course-block');
    lessonBlock.appendChild(el('h4', 'dm-course-h', 'Lessons'));
    const lessonList = el('ol', 'dm-course-lessons');
    c.lessons.forEach((l) => lessonList.appendChild(lessonChip(l, l.id === state.lessonId)));
    lessonBlock.appendChild(lessonList);
    detail.appendChild(lessonBlock);

    /* Active lesson player */
    const active = c.lessons.find((l) => l.id === state.lessonId) || c.lessons.find((l) => !l.done);
    if (active) {
      const player = el('div', 'dm-course-player');
      player.innerHTML = `
        <p class="mono dm-course-kicker">Now playing</p>
        <h4>${esc(active.title)} <span class="muted-note" style="font-weight:400;margin-left:.4rem">${esc(active.duration)}</span></h4>
        <div class="dm-course-player-stage" aria-hidden="true">
          <span>▶</span>
          <span>Lesson video</span>
          <small>${esc(active.duration)}</small>
        </div>
        <p class="muted-note">Watch the lesson, then mark it complete. The course progress bar above updates immediately.</p>`;
      const markBtn = el('button', 'button button-accent dm-cta', active.done ? 'Lesson complete ✓' : 'Mark lesson complete');
      markBtn.type = 'button';
      if (active.done) markBtn.disabled = true;
      markBtn.addEventListener('click', () => {
        active.done = true;
        const done = c.lessons.filter((l) => l.done).length;
        c.progress = c.lessons.length ? done / c.lessons.length : 0;
        toast(shellBody, 'Lesson marked complete. Progress updated.', 'ok');
        renderAll();
      });
      player.appendChild(markBtn);
      detail.appendChild(player);
    }

    /* Assignment */
    const asg = c.assignment;
    if (asg) {
      const block = el('section', 'dm-course-block');
      block.appendChild(el('h4', 'dm-course-h', 'Assignment'));
      const wrap = el('div', 'dm-course-assignment');
      wrap.innerHTML = `
        <strong>${esc(asg.title)}</strong>
        <p>${esc(asg.prompt)}</p>`;
      if (asg.submitted) {
        const done = el('div', 'dm-success');
        done.innerHTML = `
          <span class="dm-success-icon" aria-hidden="true">✓</span>
          <strong>Assignment submitted</strong>
          <span>Reference ${esc(state.submission || 'ASG-' + Math.floor(2000 + Math.random() * 7000))} · ${esc(asg.grade || 'Pending review')}</span>
          <span>Your work is in the teacher's queue. You can resubmit up to two times before the deadline.</span>`;
        wrap.appendChild(done);
      } else {
        const ta = el('textarea', 'dm-input dm-textarea');
        ta.rows = 4;
        ta.placeholder = 'Type your answer here. This is a demonstration submission — no real grading happens.';
        ta.addEventListener('input', () => { state.answer = ta.value; });
        wrap.appendChild(ta);
        const submitBtn = el('button', 'button button-accent dm-cta', 'Submit answer');
        submitBtn.type = 'button';
        submitBtn.addEventListener('click', () => {
          if (!state.answer.trim()) { toast(shellBody, 'Type a short answer first.', 'warn'); return; }
          asg.submitted = true;
          asg.grade = 'Pending review';
          state.submission = 'ASG-' + Math.floor(2000 + Math.random() * 7000);
          toast(shellBody, 'Submission received.', 'ok');
          renderAll();
        });
        wrap.appendChild(submitBtn);
      }
      block.appendChild(wrap);
      detail.appendChild(block);
    }
  }

  function renderAll() { renderSidebar(); renderDetail(); }

  renderAll();
  body.appendChild(root);
}

/* ---------------------------------------------------------------- CONFIGURATOR */
export function configuratorDemo(body, cfg) {
  cfg = cfg || {};
  const modules = cfg.modules || [
    { id: 'core', label: 'Core system', price: 320000, weeks: 6, fixed: true },
    { id: 'portal', label: 'Customer portal', price: 80000, weeks: 2 },
    { id: 'ai', label: 'AI assistant', price: 140000, weeks: 2 },
    { id: 'mpesa', label: 'M-Pesa payments', price: 70000, weeks: 1 },
    { id: 'whatsapp', label: 'WhatsApp automation', price: 70000, weeks: 1 },
    { id: 'dash', label: 'Analytics dashboard', price: 60000, weeks: 1 },
    { id: 'branch', label: 'Multi-branch', price: 80000, weeks: 2 }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Scope Your System', 'Indicative estimates · not a quote');
  const chosen = new Set(['core']);
  const host = el('div', 'dm-config');
  const list = el('div', 'dm-config-list');
  const out = el('div', 'dm-config-out');
  host.append(list, out);
  shellBody.appendChild(host);

  function render() {
    list.replaceChildren();
    modules.forEach((m) => {
      const row = el('label', 'dm-config-row' + (m.fixed ? ' is-fixed' : ''));
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = chosen.has(m.id);
      cb.disabled = !!m.fixed;
      cb.addEventListener('change', () => { cb.checked ? chosen.add(m.id) : chosen.delete(m.id); renderOut(); });
      row.appendChild(cb);
      row.insertAdjacentHTML('beforeend', `<span class="dm-config-label">${esc(m.label)}${m.fixed ? ' <small>included</small>' : ''}</span><span class="dm-config-price mono">+${money(m.price)}</span>`);
      list.appendChild(row);
    });
    renderOut();
  }
  function renderOut() {
    const sel = modules.filter((m) => chosen.has(m.id));
    const total = sel.reduce((s, m) => s + m.price, 0);
    const weeks = sel.reduce((s, m) => s + m.weeks, 0);
    out.innerHTML = `
      <strong>${sel.length} module${sel.length > 1 ? 's' : ''} selected</strong>
      <span class="dm-config-total">${money(Math.round(total * 0.9))} – ${money(Math.round(total * 1.18))}</span>
      <span>≈ ${weeks} weeks · indicative range, confirmed after scoping</span>`;
  }
  render();
  shellBody.appendChild(el('p', 'dm-note', 'The same estimator that powers Vuva AI on this site — pick modules to see an honest range.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- GALLERY (creative) */
export function galleryDemo(body, cfg) {
  cfg = cfg || {};
  const slides = cfg.slides || [];
  const { root, body: shellBody } = demoShell(cfg.title || 'Visual Experience', 'Concept visuals · sample content');
  let index = 0;
  const stage = el('div', 'dm-gallery-stage');
  const dots = el('div', 'dm-dots');
  const prev = el('button', 'dm-nav-btn', '←');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous');
  const next = el('button', 'dm-nav-btn', '→');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next');

  function paint() {
    const s = slides[index];
    stage.innerHTML = `
      <img src="${esc(s.src)}" alt="${esc(s.alt || '')}" loading="lazy">
      <div class="dm-gallery-caption"><strong>${esc(s.title)}</strong><span>${esc(s.caption || '')}</span></div>`;
    dots.replaceChildren();
    slides.forEach((_, i) => {
      const d = el('button', 'dm-dot' + (i === index ? ' is-on' : ''));
      d.type = 'button';
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => { index = i; paint(); });
      dots.appendChild(d);
    });
  }
  prev.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; paint(); });
  next.addEventListener('click', () => { index = (index + 1) % slides.length; paint(); });
  paint();
  const nav = el('div', 'dm-gallery-nav');
  nav.append(prev, dots, next);
  shellBody.append(stage, nav);
  shellBody.appendChild(el('p', 'dm-note', cfg.note || 'Concept presentation. Every frame here is produced in-house — identity, imagery and interaction.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- MICRO DEMOS */
export function microChecklist(body, cfg) {
  cfg = cfg || {};
  const items = cfg.items || [];
  const { root, body: shellBody } = demoShell(cfg.title || 'Interactive Checklist', 'Demonstration');
  const list = el('ul', 'dm-checklist');
  items.forEach((it) => {
    const li = el('li', 'dm-check');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'dm-' + Math.random().toString(36).slice(2, 8);
    const lab = el('label');
    lab.htmlFor = cb.id;
    lab.innerHTML = `<strong>${esc(it.title)}</strong><small>${esc(it.detail || '')}</small>`;
    cb.addEventListener('change', () => {
      li.classList.toggle('is-done', cb.checked);
      const all = list.querySelectorAll('input:checked').length === items.length;
      if (all) toast(root, cfg.doneText || 'All set — workflow complete.');
    });
    li.append(cb, lab);
    list.appendChild(li);
  });
  shellBody.append(list);
  shellBody.appendChild(el('p', 'dm-note', cfg.note || 'Tick items to walk the flow.'));
  body.appendChild(root);
}

export function microQueue(body, cfg) {
  cfg = cfg || {};
  const tickets = cfg.tickets || ['A-041', 'A-042', 'A-043'];
  const counters = cfg.counters || ['Counter 1', 'Counter 2', 'Counter 3'];
  const { root, body: shellBody } = demoShell(cfg.title || 'Live Queue', 'Demonstration · sample queue');
  let next = 0;
  const board = el('div', 'dm-queue-board');
  const callBtn = el('button', 'button button-accent dm-cta', 'Call next ticket');
  callBtn.type = 'button';
  const nowServing = el('div', 'dm-queue-now', '—');

  function paint() {
    board.replaceChildren();
    tickets.forEach((t, i) => {
      board.appendChild(el('div', 'dm-queue-card' + (i < next ? ' is-done' : i === next ? ' is-active' : ''), `<span class="mono">${t}</span><small>${i < next ? 'served' : i === next ? 'up next' : 'waiting'}</small>`));
    });
  }
  callBtn.addEventListener('click', () => {
    if (next >= tickets.length) { toast(root, 'Queue cleared — nice pace.', 'ok'); return; }
    nowServing.innerHTML = `<span>Now serving</span><strong class="mono">${tickets[next]}</strong><small>at ${counters[next % counters.length]}</small>`;
    toast(root, `${tickets[next]} to ${counters[next % counters.length]}`);
    next += 1;
    paint();
  });
  paint();
  shellBody.append(callBtn, nowServing, board);
  shellBody.appendChild(el('p', 'dm-note', 'Sample tickets. The live board updates counters and phones in real time.'));
  body.appendChild(root);
}

export function microRate(body, cfg) {
  cfg = cfg || {};
  const base = cfg.base || 7500;
  const { root, body: shellBody } = demoShell(cfg.title || 'Demand Pricing', 'Demonstration · sample rates');
  const host = el('div', 'dm-rate');
  const days = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
  const factors = [1, 1.2, 1.5, 1.3, 0.9];
  function paint(multiplier) {
    host.replaceChildren();
    days.forEach((d, i) => {
      const price = Math.round(base * factors[i] * multiplier / 100) * 100;
      const card = el('div', 'dm-rate-card' + (factors[i] > 1.3 ? ' is-peak' : ''), `
        <span>${d}</span><strong>${money(price)}</strong>
        <small>${factors[i] > 1.3 ? 'peak' : factors[i] < 1 ? 'quiet' : 'standard'}</small>`);
      host.appendChild(card);
    });
  }
  segmented(body, [
    { label: 'Normal weekend', value: '1' },
    { label: 'Holiday weekend', value: '1.25' }
  ], '1', (v) => paint(Number(v)));
  shellBody.appendChild(host);
  shellBody.appendChild(el('p', 'dm-note', 'Rates respond to demand signals — the same logic adjusts your prices automatically.'));
  body.appendChild(root);
}

export function microRoster(body, cfg) {
  cfg = cfg || {};
  const staff = cfg.staff || [
    { name: 'A. Njoroge', role: 'Stylist', status: 'On shift' },
    { name: 'B. Otieno', role: 'Stylist', status: 'On leave' },
    { name: 'C. Wanjiku', role: 'Colourist', status: 'On shift' },
    { name: 'D. Kamau', role: 'Barber', status: 'Off today' }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Shift Roster', 'Demonstration · sample roster');
  const host = el('div', 'dm-roster');
  staff.forEach((s, i) => {
    const row = el('div', 'dm-roster-row');
    row.innerHTML = `<img src="${photo(['clinic-doctor.jpg', 'call-center.jpg', 'office-work.jpg', 'driver-cab.jpg'][i % 4])}" alt="" loading="lazy"><div><strong>${esc(s.name)}</strong><span>${esc(s.role)}</span></div>`;
    const seg = el('div', 'dm-seg');
    ['On shift', 'Off'].forEach((opt) => {
      const b = el('button', 'dm-seg-btn' + ((s.status === 'On shift') === (opt === 'On shift') ? ' is-on' : ''), opt);
      b.type = 'button';
      b.addEventListener('click', () => {
        s.status = opt === 'On shift' ? 'On shift' : 'Off today';
        seg.querySelectorAll('.dm-seg-btn').forEach((x) => x.classList.toggle('is-on', x === b));
        toast(root, `${s.name} → ${s.status}`);
      });
      seg.appendChild(b);
    });
    row.appendChild(seg);
    host.appendChild(row);
  });
  shellBody.append(host);
  shellBody.appendChild(el('p', 'dm-note', 'Roster changes flow straight into payroll and customer booking availability.'));
  body.appendChild(root);
}
