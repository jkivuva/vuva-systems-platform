// Vuva demo kit — shared helpers for in-modal interactive demonstrations.
// Pure DOM, zero dependencies, CSP-safe (no inline handlers, no external requests).
// Every demo renders into a root element and returns a cleanup function.

export const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const money = (n) => 'KSh ' + Math.round(n).toLocaleString('en-KE');

export const photo = (file) => '/assets/img/photos/' + file;

export function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

/* Small toast used by demos for feedback. */
export function toast(root, message, kind = 'ok') {
  let host = root.querySelector('.dm-toast');
  if (!host) { host = el('div', 'dm-toast'); root.appendChild(host); }
  host.className = `dm-toast is-on is-${kind}`;
  host.setAttribute('role', 'status');
  host.textContent = message;
  clearTimeout(host._t);
  host._t = setTimeout(() => host.classList.remove('is-on'), 2600);
}

/* Simulated processing delay for realistic loading states. */
export function busy(button, ms, done) {
  if (!button) { setTimeout(done, ms); return; }
  const original = button.textContent;
  button.disabled = true;
  button.classList.add('is-busy');
  button.textContent = 'Working…';
  setTimeout(() => {
    button.disabled = false;
    button.classList.remove('is-busy');
    button.textContent = original;
    done();
  }, ms);
}

/* Segmented control: returns setter; onChange(value). */
export function segmented(root, options, active, onChange) {
  const wrap = el('div', 'dm-seg');
  wrap.setAttribute('role', 'group');
  options.forEach((opt) => {
    const b = el('button', 'dm-seg-btn' + (opt.value === active ? ' is-on' : ''), esc(opt.label));
    b.type = 'button';
    b.setAttribute('aria-pressed', String(opt.value === active));
    b.addEventListener('click', () => {
      wrap.querySelectorAll('.dm-seg-btn').forEach((x) => { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('is-on');
      b.setAttribute('aria-pressed', 'true');
      onChange(opt.value);
    });
    wrap.appendChild(b);
  });
  root.appendChild(wrap);
  return wrap;
}

/* Timeline renderer for status flows (logistics, workflows, orders). */
export function timeline(steps, activeIndex) {
  const ol = el('ol', 'dm-timeline');
  steps.forEach((s, i) => {
    const li = el('li', 'dm-tl-step' + (i < activeIndex ? ' is-done' : i === activeIndex ? ' is-active' : ''));
    li.innerHTML = `<span class="dm-tl-dot" aria-hidden="true">${i < activeIndex ? '✓' : i + 1}</span>
      <span class="dm-tl-body"><strong>${esc(s.label)}</strong><small>${esc(s.detail || '')}</small></span>
      ${s.time ? `<span class="dm-tl-time">${esc(s.time)}</span>` : ''}`;
    ol.appendChild(li);
  });
  return ol;
}

/* Progress a timeline one step (wraps at end) and re-renders. */
export function advance(tlEl, steps, current) {
  const next = (current + 1) % steps.length;
  const fresh = timeline(steps, next);
  tlEl.replaceWith(fresh);
  return { el: fresh, index: next };
}

/* Simple bar chart (SVG) for dashboards. */
export function barChart(values, labels, { accent = '#35e0a1', height = 120 } = {}) {
  const max = Math.max(...values, 1);
  const n = values.length;
  const gap = 8;
  const w = 100 / n;
  let bars = '';
  values.forEach((v, i) => {
    const h = Math.max((v / max) * (height - 24), 4);
    const x = i * w + gap / 2;
    bars += `<rect x="${x}%" y="${height - 20 - h}" width="${w - gap}%" height="${h}" rx="3" fill="${accent}" opacity="${0.55 + 0.45 * (v / max)}"></rect>`;
    if (labels && labels[i]) {
      bars += `<text x="${i * w + w / 2}%" y="${height - 6}" text-anchor="middle" class="dm-chart-label">${esc(labels[i])}</text>`;
    }
  });
  return `<svg class="dm-chart" viewBox="0 0 100 ${height}" preserveAspectRatio="none" role="img" aria-label="Bar chart">${bars}</svg>`;
}

/* Sparkline (SVG polyline). */
export function sparkline(values, { stroke = '#35e0a1', height = 60 } = {}) {
  const max = Math.max(...values), min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${height - 6 - ((v - min) / span) * (height - 12)}`).join(' ');
  return `<svg class="dm-chart dm-spark" viewBox="0 0 100 ${height}" preserveAspectRatio="none" role="img" aria-label="Trend line"><polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>`;
}

/* KPI stat card row. */
export function statRow(stats) {
  const row = el('div', 'dm-stats');
  stats.forEach((s) => {
    row.appendChild(el('div', 'dm-stat', `
      <span class="dm-stat-label">${esc(s.label)}</span>
      <strong class="dm-stat-value">${esc(s.value)}</strong>
      ${s.delta ? `<span class="dm-stat-delta ${s.dir || ''}">${esc(s.delta)}</span>` : ''}`));
  });
  return row;
}

/* Searchable/filterable list helper: items = [{search, render, node}]. */
export function filterList(host, items, emptyText = 'Nothing matches that filter.') {
  const apply = (q) => {
    let shown = 0;
    for (const item of items) {
      const on = !q || item.search.toLowerCase().includes(q);
      item.node.hidden = !on;
      if (on) shown++;
    }
    let empty = host.querySelector('.dm-empty');
    if (!shown && !empty) { empty = el('p', 'dm-empty', esc(emptyText)); host.appendChild(empty); }
    if (empty) empty.hidden = shown > 0;
  };
  return { apply };
}

/* Demo shell: header strip + body + demo-note. Returns {root, body, note}. */
export function demoShell(title, envLabel = 'Demonstration · sample data') {
  const root = el('div', 'dm');
  const bar = el('div', 'dm-bar', `<span class="dm-bar-title">${esc(title)}</span><span class="dm-bar-env mono">${esc(envLabel)}</span>`);
  const body = el('div', 'dm-body');
  root.appendChild(bar);
  root.appendChild(body);
  return { root, body };
}

/* Image strip with captions. */
export function imageStrip(images, { ratio = '4 / 3' } = {}) {
  const wrap = el('div', 'dm-gallery');
  images.forEach((im) => {
    const fig = el('figure', 'dm-fig');
    fig.innerHTML = `<img src="${esc(im.src)}" alt="${esc(im.alt || '')}" loading="lazy" style="aspect-ratio:${ratio}">
      ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ''}`;
    wrap.appendChild(fig);
  });
  return wrap;
}

/* Confirmation card (success states). */
export function successCard(title, lines, ref) {
  return el('div', 'dm-success', `
    <span class="dm-success-icon" aria-hidden="true">✓</span>
    <strong>${esc(title)}</strong>
    ${lines.map((l) => `<span>${esc(l)}</span>`).join('')}
    ${ref ? `<code class="dm-ref">${esc(ref)}</code>` : ''}`);
}

/* Date helpers for booking demos. */
export function nextDays(n, offset = 0) {
  const out = [];
  const base = new Date();
  for (let i = offset; i < offset + n; i++) {
    const d = new Date(base.getTime() + i * 86400000);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: i === offset ? 'Today' : i === offset + 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    });
  }
  return out;
}

/* Deterministic pseudo-random for stable demo data. */
export function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
