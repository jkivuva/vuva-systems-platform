// Vuva AI — Prospecting (internal dashboard).
// Connected to the Worker API under /internal/api/* (Basic-auth gated):
//   - /config     → which integrations are live
//   - /search     → Tavily company discovery
//   - /prospects  → D1 persistence (list / save / delete)
//   - /outreach   → WhatsApp Business Cloud API send
// All third-party keys stay server-side; this file never sees them.

import { pricing, formatKsh } from '../assets/js/pricing.js';

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------
async function api(path, { method = 'GET', body } = {}) {
  const init = { method, headers: {} };
  if (body !== undefined) {
    init.headers['content-type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`/internal/api${path}`, init);
  try {
    return await res.json();
  } catch {
    return { ok: false, error: `Unexpected response (HTTP ${res.status}).` };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function badge(text, kind) {
  return el('span', `badge is-${kind}`, text);
}

// Heuristic relevance score from detected signals + provider relevance.
// Clearly an estimate for prioritization — not a scientific measure.
function heuristicScore(p) {
  const signals = Array.isArray(p.signals) ? p.signals.length : 0;
  const relevance = typeof p.relevance === 'number' ? p.relevance : 50;
  return Math.min(95, Math.round(40 + signals * 11 + relevance * 0.2));
}

function tier(s) {
  return s >= 70 ? 'hi' : s >= 45 ? 'mid' : 'lo';
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  prospects: [],
  config: { database: false, tavily: false, whatsapp: false },
  discoverBusy: false
};

function prospectById(id) {
  return state.prospects.find((p) => p.id === id);
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function initInternal() {
  // ---- Nav ----
  const navs = document.querySelectorAll('[data-panel-nav]');
  const panels = document.querySelectorAll('.demo-panel');
  const show = (id) => {
    panels.forEach((p) => p.classList.toggle('is-active', p.id === id));
    navs.forEach((b) => (b.getAttribute('data-panel-nav') === id ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  navs.forEach((b) => b.addEventListener('click', () => show(b.getAttribute('data-panel-nav'))));
  show('overview');

  // ---- Live clock ----
  const clock = document.querySelector('[data-demo-clock]');
  const tick = () => {
    if (clock) clock.textContent = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };
  tick();
  setInterval(tick, 30000);

  // ---- Settings: pricing ----
  renderPricing();
  renderConfigStatus();

  // ---- Load data ----
  const [cfg, prospects] = await Promise.all([api('/config'), api('/prospects')]);
  if (cfg.ok && cfg.config) state.config = cfg.config;
  if (prospects.ok && Array.isArray(prospects.prospects)) state.prospects = prospects.prospects;

  renderOverview();
  renderProspects();
  renderOutreachSelect();
  renderReports();
  initInbox();

  // ---- Wire forms ----
  initDiscover();
  initOutreach();
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
function renderPricing() {
  const list = document.querySelector('[data-pricing-list]');
  if (!list) return;
  list.innerHTML = '';
  const add = (dt, dd) => {
    const row = el('div');
    row.appendChild(el('dt', null, dt));
    row.appendChild(el('dd', null, dd));
    list.appendChild(row);
  };
  add(pricing.base.label, `${formatKsh(pricing.base.price)} · ${pricing.base.weeks} weeks`);
  pricing.modules.forEach((m) => add(m.label, `${formatKsh(m.price)} · +${m.weeks}wk`));
  document.querySelectorAll('[data-pricing-path]').forEach((n) => {
    n.textContent = '/assets/js/pricing.js';
  });
}

function renderConfigStatus() {
  const root = document.querySelector('[data-config-status]');
  if (!root) return;
  root.innerHTML = '';
  const rows = [
    ['Database (D1)', state.config.database],
    ['Web search (Tavily)', state.config.tavily],
    ['Outreach (WhatsApp)', state.config.whatsapp]
  ];
  rows.forEach(([label, live]) => {
    const row = el('div', 'config-row');
    row.appendChild(el('dt', null, label));
    row.appendChild(live ? badge('Configured', 'ok') : badge('Not set', 'warn'));
    root.appendChild(row);
  });
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
function renderOverview() {
  const stats = document.querySelector('[data-overview-stats]');
  if (stats) {
    const list = state.prospects;
    const qualified = list.filter((p) => p.status === 'qualified').length;
    const contacted = list.filter((p) => p.status === 'contacted').length;
    const high = list.filter((p) => heuristicScore(p) >= 70).length;
    const cards = [
      ['Prospects saved', list.length, list.length ? 'in database' : 'run a discovery'],
      ['High signal', high, '≥ 70 score'],
      ['Qualified', qualified, 'worth outreach'],
      ['Contacted', contacted, 'outreach sent']
    ];
    stats.innerHTML = '';
    cards.forEach(([label, value, sub]) => {
      const d = el('div', 'd-stat');
      d.appendChild(el('span', 'd-label', label));
      d.appendChild(el('span', 'd-value', String(value)));
      d.appendChild(el('span', 'd-delta flat', sub));
      stats.appendChild(d);
    });
  }

  const top = document.querySelector('[data-top-prospects]');
  if (top) {
    top.innerHTML = '';
    if (!state.prospects.length) {
      top.appendChild(emptyHint('No prospects yet. Run a discovery in “Discover Companies” to find and score real businesses.'));
      return;
    }
    [...state.prospects]
      .sort((a, b) => heuristicScore(b) - heuristicScore(a))
      .slice(0, 5)
      .forEach((p) => top.appendChild(renderProspectRow(p)));
  }
}

function emptyHint(text) {
  const p = el('p', 'muted-note');
  p.style.padding = '1rem';
  p.textContent = text;
  return p;
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
function renderReports() {
  const stats = document.querySelector('[data-report-stats]');
  if (stats) {
    const list = state.prospects;
    const high = list.filter((p) => heuristicScore(p) >= 70).length;
    const qualified = list.filter((p) => p.status === 'qualified').length;
    const contacted = list.filter((p) => p.status === 'contacted').length;
    stats.innerHTML = '';
    [
      ['Saved', list.length, 'prospects'],
      ['High signal', high, '≥ 70 score'],
      ['Qualified', qualified, 'worth outreach'],
      ['Contacted', contacted, 'outreach sent']
    ].forEach(([label, value, sub]) => {
      const d = el('div', 'd-stat');
      d.appendChild(el('span', 'd-label', label));
      d.appendChild(el('span', 'd-value', String(value)));
      d.appendChild(el('span', 'd-delta flat', sub));
      stats.appendChild(d);
    });
  }

  const top = document.querySelector('[data-report-top]');
  if (top) {
    top.innerHTML = '';
    if (!state.prospects.length) {
      top.appendChild(el('p', 'muted-note', 'No prospects saved yet. Run a discovery to populate this report.'));
      return;
    }
    const p = [...state.prospects].sort((a, b) => heuristicScore(b) - heuristicScore(a))[0];
    top.appendChild(kvCard('Top opportunity', [
      ['Company', p.name],
      ['Score', `${heuristicScore(p)} / 100 (heuristic)`],
      ['Industry', p.industry || '—'],
      ['Signals', p.signals && p.signals.length ? p.signals.join(' · ') : 'None detected']
    ]));
  }
}

// ---------------------------------------------------------------------------
// WhatsApp Inbox — conversations, takeover, manual send, live refresh.
// ---------------------------------------------------------------------------
const inboxState = {
  conversations: [],
  selected: null,
  messages: [],
  timer: null
};

function fmtTime(iso) {
  if (!iso) return '';
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z');
  return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

async function refreshInbox({ keepScroll = true } = {}) {
  const res = await api('/whatsapp/conversations');
  if (!res.ok) {
    const list = document.querySelector('[data-inbox-list]');
    if (list) list.innerHTML = '';
    return;
  }
  inboxState.conversations = res.conversations || [];
  renderInboxList();

  const totalUnread = inboxState.conversations.reduce((s, c) => s + (c.unread || 0), 0);
  const navBadge = document.querySelector('[data-nav-unread]');
  if (navBadge) {
    navBadge.hidden = totalUnread === 0;
    navBadge.textContent = String(totalUnread);
  }

  if (inboxState.selected) {
    const still = inboxState.conversations.find((c) => c.waId === inboxState.selected);
    if (!still) {
      inboxState.selected = null;
      showInboxEmpty();
    }
  }
}

function renderInboxList() {
  const list = document.querySelector('[data-inbox-list]');
  if (!list) return;
  list.innerHTML = '';

  if (!inboxState.conversations.length) {
    const empty = el('p', 'muted-note');
    empty.style.padding = '1rem';
    empty.textContent = 'No conversations yet. They appear here the moment a customer messages your WhatsApp number.';
    list.appendChild(empty);
    return;
  }

  inboxState.conversations.forEach((c) => {
    const item = el('button', 'inbox-item');
    item.type = 'button';
    if (inboxState.selected === c.waId) item.classList.add('is-active');

    const avatar = el('span', 'i-avatar', (c.waId || '?').slice(-2));
    const main = el('div', 'i-main');
    const top = el('div', 'i-top');
    top.appendChild(el('span', 'i-name', c.waId));
    top.appendChild(el('span', 'i-time', fmtTime(c.lastAt)));
    main.appendChild(top);
    const preview = el('span', 'i-preview');
    preview.textContent = `${c.lastDirection === 'out' ? 'You: ' : ''}${c.lastText || ''}`;
    main.appendChild(preview);

    const badges = el('div', 'i-badges');
    if (c.convStatus) badges.appendChild(el('span', `inbox-status st-${c.convStatus}`, convStatusLabel(c.convStatus)));
    if (c.mode === 'manual') badges.appendChild(el('span', 'inbox-manual-tag', 'Manual'));
    if (c.unread > 0) badges.appendChild(el('span', 'inbox-unread', String(c.unread)));
    if (badges.children.length) main.appendChild(badges);

    item.appendChild(avatar);
    item.appendChild(main);
    item.addEventListener('click', () => openConversation(c.waId));
    list.appendChild(item);
  });
}

function showInboxEmpty() {
  document.querySelector('[data-inbox-empty]')?.classList.remove('hidden');
  document.querySelector('[data-inbox-convo]')?.classList.add('hidden');
}

const CONV_STATUS_LABELS = { active: 'Active', waiting: 'Waiting', needs_human: 'Needs Human', resolved: 'Resolved' };
function convStatusLabel(s) {
  return CONV_STATUS_LABELS[s] || s;
}

async function openConversation(waId) {
  inboxState.selected = waId;
  document.querySelector('[data-inbox-empty]')?.classList.add('hidden');
  document.querySelector('[data-inbox-convo]')?.classList.remove('hidden');
  renderInboxList();
  await api('/whatsapp/read', { method: 'POST', body: { waId } });
  await loadConversationMessages();
  renderInboxList(); // clear unread badges
}

async function loadConversationMessages() {
  if (!inboxState.selected) return;
  const res = await api(`/whatsapp/messages?wa_id=${encodeURIComponent(inboxState.selected)}`);
  if (!res.ok) return;
  inboxState.messages = res.messages || [];
  renderMessages();
  updateModeControls();
}

function renderMessages() {
  const box = document.querySelector('[data-inbox-messages]');
  if (!box) return;
  box.innerHTML = '';
  let lastDay = '';
  inboxState.messages.forEach((m) => {
    const day = (m.created_at || '').slice(0, 10);
    if (day && day !== lastDay) {
      box.appendChild(el('div', 'inbox-day', day));
      lastDay = day;
    }
    const bubble = el('div', `im ${m.direction}${m.status === 'failed' ? ' failed' : ''}`);
    bubble.appendChild(el('div', null, m.text));
    const meta = el('div', 'im-meta');
    meta.appendChild(el('span', null, fmtTime(m.created_at)));
    meta.appendChild(el('span', null, m.direction === 'in' ? (m.contact_name || 'customer') : (m.status === 'failed' ? 'failed' : 'delivered ✓')));
    bubble.appendChild(meta);
    box.appendChild(bubble);
  });
  box.scrollTop = box.scrollHeight;
}

function updateModeControls() {
  const convo = inboxState.conversations.find((c) => c.waId === inboxState.selected);
  const mode = convo?.mode || 'auto';
  const btn = document.querySelector('[data-mode-btn]');
  const note = document.querySelector('[data-mode-note]');
  if (btn) {
    btn.textContent = mode === 'manual' ? 'Resume Automation' : 'Take Over';
    btn.classList.toggle('chip', false);
    btn.classList.toggle('is-dark', true);
  }
  if (note) {
    note.textContent = mode === 'manual'
      ? 'You are in control. Hermes will not auto-reply in this conversation until you resume automation.'
      : 'Hermes is auto-replying in this conversation. Use "Take Over" to respond manually.';
  }
  const name = document.querySelector('[data-convo-name]');
  const idEl = document.querySelector('[data-convo-id]');
  const statusSel = document.querySelector('[data-convo-status]');
  if (name) name.textContent = convo ? (convo.contactName || convo.waId) : (inboxState.selected || '—');
  if (idEl) {
    idEl.textContent = convo
      ? `${convo.contactName && convo.contactName !== convo.waId ? `${convo.waId} · ` : ''}${convo.totalMessages} messages · ${mode === 'manual' ? 'manual mode' : 'auto mode'}`
      : '';
  }
  if (statusSel) statusSel.value = convo?.convStatus || 'active';
}

function initInbox() {
  const modeBtn = document.querySelector('[data-mode-btn]');
  const statusSel = document.querySelector('[data-convo-status]');
  const compose = document.querySelector('[data-inbox-compose]');
  const input = document.querySelector('[data-inbox-input]');

  // Operator sets conversation status (Active/Waiting/Needs Human/Resolved).
  statusSel?.addEventListener('change', async () => {
    if (!inboxState.selected || !statusSel.value) return;
    const res = await api('/whatsapp/status', {
      method: 'POST',
      body: { waId: inboxState.selected, status: statusSel.value }
    });
    if (!res.ok) {
      updateModeControls();
      return;
    }
    const convo = inboxState.conversations.find((c) => c.waId === inboxState.selected);
    if (convo) {
      convo.convStatus = res.status;
      if (res.status === 'resolved') convo.mode = 'auto'; // resolving re-opens automation
    }
    updateModeControls();
    renderInboxList();
  });

  modeBtn?.addEventListener('click', async () => {
    if (!inboxState.selected) return;
    const convo = inboxState.conversations.find((c) => c.waId === inboxState.selected);
    const next = convo?.mode === 'manual' ? 'auto' : 'manual';
    const res = await api('/whatsapp/mode', { method: 'POST', body: { waId: inboxState.selected, mode: next } });
    if (res.ok) {
      convo.mode = next;
      updateModeControls();
      renderInboxList();
    }
  });

  compose?.addEventListener('click', async () => {
    if (!inboxState.selected) return;
    // First manual send in auto mode = implicit takeover.
    const convo = inboxState.conversations.find((c) => c.waId === inboxState.selected);
    if (convo && convo.mode === 'auto') {
      await api('/whatsapp/mode', { method: 'POST', body: { waId: inboxState.selected, mode: 'manual' } });
      convo.mode = 'manual';
    }
  });

  compose?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = (input?.value || '').trim();
    if (!text || !inboxState.selected) return;
    input.value = '';
    const res = await api('/whatsapp/send', { method: 'POST', body: { waId: inboxState.selected, text } });
    await loadConversationMessages();
    await refreshInbox();
    if (!res.ok) {
      const note = document.querySelector('[data-mode-note]');
      if (note) note.textContent = `✗ ${res.error || 'Send failed.'}`;
    }
  });

  // Poll every 5s while the inbox panel is visible; pause otherwise (saves D1 reads).
  document.querySelectorAll('[data-panel-nav="inbox"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      refreshInbox();
      if (inboxState.selected) loadConversationMessages();
      clearInterval(inboxState.timer);
      inboxState.timer = setInterval(() => {
        const panel = document.getElementById('inbox');
        if (panel?.classList.contains('is-active')) {
          refreshInbox();
          if (inboxState.selected) loadConversationMessages();
        }
        // stop polling entirely when tab hidden
        if (document.hidden) {
          clearInterval(inboxState.timer);
          inboxState.timer = null;
        }
    }, 5000);
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && inboxState.selected) refreshInbox();
  });

  refreshInbox();
}

// ---------------------------------------------------------------------------
// Discover
// ---------------------------------------------------------------------------
function initDiscover() {
  const form = document.querySelector('[data-discover-form]');
  const results = document.querySelector('[data-discover-results]');
  if (!form || !results) return;

  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.discoverBusy) return;

    const data = new FormData(form);
    const payload = {
      industry: (data.get('industry') || '').trim(),
      country: (data.get('country') || '').trim(),
      city: (data.get('city') || '').trim(),
      size: (data.get('size') || '').trim(),
      keywords: (data.get('keywords') || '').trim()
    };

    state.discoverBusy = true;
    if (button) {
      button.disabled = true;
      button.textContent = 'Searching…';
    }
    results.innerHTML = '';
    results.appendChild(el('p', 'muted-note', 'Searching the web for matching companies…'));

    const res = await api('/search', { method: 'POST', body: payload });

    state.discoverBusy = false;
    if (button) {
      button.disabled = false;
      button.textContent = 'Discover prospects →';
    }
    results.innerHTML = '';

    if (!res.ok) {
      results.appendChild(el('p', 'muted-note', `⚠ ${res.error || 'Search failed.'}`));
      return;
    }

    if (!res.results.length) {
      results.appendChild(el('p', 'muted-note', 'No companies found for those criteria · try broader keywords or a different city.'));
      return;
    }

    const meta = el('p', 'muted-note');
    meta.textContent = `${res.count} company/companies found. Review and save the promising ones to your Prospects database.`;
    results.appendChild(meta);

    res.results.forEach((r) => results.appendChild(renderSearchResult(r, payload)));
  });
}

function renderSearchResult(r, query) {
  const card = el('div', 'prospect-row discover-result');
  const score = heuristicScore({ signals: r.signals, relevance: r.relevance });
  card.appendChild(el('span', `p-score ${tier(score)}`, String(score)));

  const main = el('div', 'p-main');
  main.appendChild(el('strong', null, r.name || r.title));
  if (r.url) {
    const a = el('a', 'prospect-url', r.url.replace(/^https?:\/\//, '').replace(/\/.*$/, ''));
    a.href = r.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    main.appendChild(a);
  }
  if (r.signals && r.signals.length) {
    const tags = el('div', 'signal-tags');
    r.signals.slice(0, 4).forEach((s) => tags.appendChild(el('span', 'tag is-dark', s)));
    main.appendChild(tags);
  } else {
    main.appendChild(el('small', null, 'No automation-gap signals detected in the snippet.'));
  }
  card.appendChild(main);

  const actions = el('div', 'discover-actions');
  const save = el('button', 'button button-accent', 'Save to Prospects');
  save.type = 'button';
  save.addEventListener('click', async () => {
    save.disabled = true;
    save.textContent = 'Saving…';
    const body = {
      name: r.name || r.title,
      industry: query.industry && query.industry !== 'all' ? query.industry : 'Unspecified',
      location: [query.city, query.country].filter(Boolean).join(', ') || 'Unknown',
      website: r.url || '',
      url: r.url || '',
      content: r.content || '',
      signals: r.signals || [],
      relevance: r.relevance,
      source: 'tavily',
      status: 'new',
      contacts: []
    };
    const saved = await api('/prospects', { method: 'POST', body });
    if (saved.ok) {
      state.prospects.unshift(saved.prospect);
      renderOverview();
      renderProspects();
      renderOutreachSelect();
      save.textContent = '✓ Saved';
      save.disabled = true;
    } else {
      save.disabled = false;
      save.textContent = 'Save failed · retry';
    }
  });
  actions.appendChild(save);
  card.appendChild(actions);

  return card;
}

// ---------------------------------------------------------------------------
// Prospects list
// ---------------------------------------------------------------------------
function renderProspects() {
  const list = document.querySelector('[data-prospect-list]');
  if (!list) return;
  const filter = document.querySelector('[data-industry-filter]');

  const render = () => {
    const val = filter ? filter.value : 'all';
    list.innerHTML = '';
    const rows = state.prospects.filter((p) => val === 'all' || p.industry === val);
    if (!rows.length) {
      list.appendChild(emptyHint(state.prospects.length ? 'No prospects in that industry.' : 'No saved prospects yet. Use “Discover Companies” to find and save them.'));
      return;
    }
    rows.forEach((p) => list.appendChild(renderProspectRow(p)));
  };

  filter?.addEventListener('change', render);
  render();
}

function renderProspectRow(p) {
  const s = heuristicScore(p);
  const row = el('div', 'prospect-row');
  row.dataset.prospect = p.id;
  row.appendChild(el('span', `p-score ${tier(s)}`, String(s)));

  const main = el('div', 'p-main');
  main.appendChild(el('strong', null, p.name));
  main.appendChild(el('small', null, `${p.industry || 'Unspecified'} · ${p.location || 'Unknown'}${p.source === 'tavily' ? ' · web' : ''}`));
  row.appendChild(main);
  row.appendChild(badge(statusLabel(p.status), statusKind(p.status)));

  const del = el('button', 'row-delete', '×');
  del.type = 'button';
  del.setAttribute('aria-label', `Delete ${p.name}`);
  del.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${p.name}" from your prospects?`)) return;
    const res = await api(`/prospects?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' });
    if (res.ok) {
      state.prospects = state.prospects.filter((x) => x.id !== p.id);
      renderProspects();
      renderOverview();
      renderOutreachSelect();
    }
  });
  row.appendChild(del);

  row.addEventListener('click', () => showProspect(p));
  return row;
}

function statusLabel(s) {
  return { new: 'New', qualified: 'Qualified', contacted: 'Contacted', rejected: 'Rejected' }[s] || 'New';
}
function statusKind(s) {
  return { new: 'info', qualified: 'ok', contacted: 'warn', rejected: 'neutral' }[s] || 'info';
}

// ---------------------------------------------------------------------------
// Research detail
// ---------------------------------------------------------------------------
function showProspect(p) {
  const detail = document.querySelector('[data-prospect-detail]');
  const panel = document.getElementById('research');
  if (!detail || !panel) return;
  detail.innerHTML = '';

  const head = el('div', 'demo-panel-head');
  const hd = el('div');
  hd.appendChild(el('h2', null, p.name));
  hd.appendChild(el('p', null, [p.industry, p.location, p.website].filter(Boolean).join(' · ')));
  head.appendChild(hd);

  const scoreBlock = el('div', 'd-card');
  const sb = el('div', 'd-card-body');
  const s = heuristicScore(p);
  const big = el('div', 'score-big');
  big.appendChild(document.createTextNode(String(s)));
  big.appendChild(el('small', null, ' / 100'));
  sb.appendChild(big);
  const bar = el('div', `score-bar ${tier(s)}`);
  bar.appendChild(el('i'));
  sb.appendChild(bar);
  sb.appendChild(el('p', 'muted-note', 'Heuristic prioritization score · derived from detected automation-gap signals and search relevance. An estimate for ranking, not a scientific measure.'));
  scoreBlock.appendChild(sb);
  head.appendChild(scoreBlock);
  detail.appendChild(head);

  const kv = el('div', 'd-grid');
  kv.appendChild(kvCard('Profile', [
    ['Website', p.website || p.url || '—'],
    ['Industry', p.industry || '—'],
    ['Location', p.location || '—'],
    ['Source', p.source === 'tavily' ? 'Web discovery (Tavily)' : 'Manual'],
    ['Status', statusLabel(p.status)]
  ]));
  kv.appendChild(kvCard('Detected signals (heuristic)', p.signals && p.signals.length ? p.signals : ['None detected']));
  detail.appendChild(kv);

  if (p.content) {
    const card = el('div', 'd-card mt');
    card.appendChild(el('div', 'd-card-head', 'Public snippet'));
    const body = el('div', 'd-card-body');
    body.appendChild(el('p', 'prospect-snippet', p.content));
    card.appendChild(body);
    detail.appendChild(card);
  }

  const go = el('div', 'head-actions mt');
  const btn = el('button', 'button button-accent', 'Open in Outreach →');
  btn.type = 'button';
  btn.addEventListener('click', () => {
    const select = document.querySelector('[data-outreach-prospect]');
    if (select) {
      select.value = p.id;
      select.dispatchEvent(new Event('change'));
    }
    document.querySelector('[data-panel-nav="outreach"]')?.click();
  });
  go.appendChild(btn);
  detail.appendChild(go);

  document.querySelector('[data-panel-nav="research"]')?.click();
}

// ---------------------------------------------------------------------------
// Outreach
// ---------------------------------------------------------------------------
function renderOutreachSelect() {
  const select = document.querySelector('[data-outreach-prospect]');
  if (!select) return;
  const current = select.value;
  select.innerHTML = '';
  select.appendChild(new Option('Select a prospect…', ''));
  state.prospects.forEach((p) => select.appendChild(new Option(`${p.name} · ${p.industry || 'Unspecified'}`, p.id)));
  if (current && prospectById(current)) select.value = current;
}

function buildDraft(p) {
  const name = p.name || 'there';
  const industry = p.industry ? p.industry.toLowerCase() : 'your industry';
  const location = p.location ? p.location.split(',')[0].trim() : 'your area';
  const signalLine = p.signals && p.signals.length
    ? `Looking at your public presence, it seems ${p.signals[0].toLowerCase().replace(/\.$/, '')}.`
    : 'I noticed your public customer journey is handled mainly by phone or email.';

  return [
    `Hello ${name},`,
    '',
    `I came across your business while researching ${industry} in ${location}.`,
    '',
    `${signalLine} That usually means avoidable manual work · and an opportunity to streamline it.`,
    '',
    'Vuva Systems engineers AI-powered business systems · customer portals, WhatsApp automation, dashboards and payments · built around how your operation actually runs.',
    '',
    'Would you be open to a short call to see what a system designed for your workflow could look like? No obligation.',
    '',
    'Regards,',
    'Vuva Systems'
  ].join('\n');
}

function initOutreach() {
  const form = document.querySelector('[data-outreach-form]');
  const out = document.querySelector('[data-outreach-output]');
  if (!form || !out) return;

  const select = form.querySelector('[data-outreach-prospect]');
  const phone = form.querySelector('[data-outreach-phone]');
  const render = () => {
    out.innerHTML = '';
    const p = prospectById(select.value);
    if (!p) {
      out.appendChild(el('p', 'muted-note', 'Select a prospect to generate a personalized WhatsApp draft.'));
      return;
    }

    const draft = buildDraft(p);
    const box = el('div', 'outreach-box');
    box.textContent = draft;
    out.appendChild(box);

    if (phone) {
      const contact = Array.isArray(p.contacts) ? p.contacts.join(' ') : '';
      const digits = (contact.match(/\+?\d[\d\s-]{7,}/) || [''])[0].replace(/\D/g, '');
      phone.value = phone.value || digits;
      phone.placeholder = 'Recipient WhatsApp number, e.g. 2547…';
    }

    const actions = el('div', 'head-actions mt');
    const send = el('button', 'button button-accent', 'Send via WhatsApp');
    send.type = 'button';
    const note = el('p', 'muted-note');
    note.textContent = state.config.whatsapp
      ? 'Sends to the number below using the WhatsApp Business Cloud API. Real, outbound · please review carefully before sending.'
      : 'WhatsApp outbound is not configured yet (see Settings). Drafts are generated but cannot be sent until credentials are set.';

    send.addEventListener('click', async () => {
      const to = phone ? phone.value.trim() : '';
      if (!to) {
        note.textContent = 'Enter the recipient WhatsApp number first.';
        return;
      }
      if (!confirm(`Send this message to ${to}?`)) return;
      send.disabled = true;
      send.textContent = 'Sending…';
      const res = await api('/outreach', { method: 'POST', body: { to, message: draft, prospectId: p.id, prospectName: p.name } });
      send.disabled = false;
      send.textContent = 'Send via WhatsApp';
      if (res.ok) {
        note.textContent = '✓ Sent. The prospect has been marked as contacted.';
        p.status = 'contacted';
      } else {
        note.textContent = `✗ ${res.error || 'Send failed.'}`;
      }
    });

    actions.appendChild(send);
    out.appendChild(actions);
    out.appendChild(note);
  };

  select.addEventListener('change', render);
  render();
}

// ---------------------------------------------------------------------------
// Reused card builders
// ---------------------------------------------------------------------------
function kvCard(title, rows) {
  const card = el('div', 'd-card');
  card.appendChild(el('div', 'd-card-head', title));
  const body = el('div', 'd-card-body');
  const list = el('div', 'd-kv');
  rows.forEach((r) => {
    const div = el('div');
    div.appendChild(el('dt', null, r[0]));
    div.appendChild(el('dd', null, r[1] || '—'));
    list.appendChild(div);
  });
  body.appendChild(list);
  card.appendChild(body);
  return card;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initInternal);
else initInternal();
