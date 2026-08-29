// Vuva demo types A — full interactive archetypes.
// Each factory: (body, kit) -> void; body is the mount node.
import {
  esc, money, photo, el, toast, busy, segmented, timeline, barChart, sparkline,
  statRow, filterList, demoShell, imageStrip, successCard, nextDays, seeded
} from './demo-kit.js';

/* ---------------------------------------------------------------- BOOKING */
export function bookingDemo(body, cfg) {
  cfg = cfg || {};
  const services = cfg.services || [
    { name: 'General Consultation', doctor: 'Dr. A. Mwangi', role: 'General Practitioner', img: 'clinic-doctor.jpg', fee: 1500, slots: ['08:30', '09:00', '09:30', '10:00', '11:00', '14:00'] },
    { name: 'Cardiology Review', doctor: 'Dr. J. Wanjiru', role: 'Cardiologist', img: 'doctor-patient.jpg', fee: 4500, slots: ['09:00', '09:30', '11:30', '14:30'] },
    { name: 'Paediatric Clinic', doctor: 'Dr. S. Otieno', role: 'Paediatrician', img: 'medical-team.jpg', fee: 2500, slots: ['08:00', '08:30', '10:30', '13:00'] }
  ];
  const days = nextDays(5);
  const state = { service: services[0], day: days[0], time: null, booked: {} };

  const { root, body: shellBody } = demoShell(cfg.title || 'Book a Clinic Visit', 'Demonstration · sample slots');
  const steps = el('ol', 'dm-steps');

  const renderServices = () => {
    const wrap = el('li', 'dm-step is-open');
    wrap.appendChild(el('h4', 'dm-step-title', '1 · Choose a service'));
    const grid = el('div', 'dm-choice-grid');
    services.forEach((s, i) => {
      const b = el('button', 'dm-choice' + (s === state.service ? ' is-on' : ''), `
        <img src="${photo(s.img)}" alt="" loading="lazy">
        <span class="dm-choice-name">${esc(s.name)}</span>
        <span class="dm-choice-meta">${esc(s.doctor)} · ${money(s.fee)}</span>`);
      b.type = 'button';
      b.addEventListener('click', () => {
        state.service = s; state.time = null;
        render();
      });
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    steps.appendChild(wrap);
  };

  const renderDays = () => {
    const wrap = el('li', 'dm-step is-open');
    wrap.appendChild(el('h4', 'dm-step-title', '2 · Pick a day'));
    const seg = el('div', 'dm-seg');
    days.forEach((d) => {
      const b = el('button', 'dm-seg-btn' + (d.key === state.day.key ? ' is-on' : ''), `<span>${esc(d.label)}</span><small>${esc(d.date)}</small>`);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(d.key === state.day.key));
      b.addEventListener('click', () => { state.day = d; state.time = null; render(); });
      seg.appendChild(b);
    });
    wrap.appendChild(seg);
    steps.appendChild(wrap);
  };

  const renderTimes = () => {
    const wrap = el('li', 'dm-step is-open');
    wrap.appendChild(el('h4', 'dm-step-title', '3 · Pick a time'));
    const grid = el('div', 'dm-slot-grid');
    const rnd = seeded(state.service.name.length * 31 + state.day.key.length * 7);
    state.service.slots.forEach((t) => {
      const taken = rnd() < 0.28;
      const b = el('button', 'dm-slot' + (taken ? ' is-taken' : '') + (t === state.time ? ' is-on' : ''), taken ? 'Booked' : t);
      b.type = 'button';
      b.disabled = taken;
      if (!taken) b.addEventListener('click', () => { state.time = t; render(); });
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    steps.appendChild(wrap);
  };

  const renderConfirm = () => {
    const wrap = el('li', 'dm-step is-open');
    wrap.appendChild(el('h4', 'dm-step-title', '4 · Confirm'));
    const summary = el('div', 'dm-summary', `
      <img src="${photo(state.service.img)}" alt="" loading="lazy">
      <div>
        <strong>${esc(state.service.name)}</strong>
        <span>${esc(state.service.doctor)} · ${esc(state.service.role)}</span>
        <span>${esc(state.day.label)} ${esc(state.day.date)}${state.time ? ' · ' + esc(state.time) : ''}</span>
        <span>Consultation ${money(state.service.fee)} · paid at reception or via M-Pesa</span>
      </div>`);
    wrap.appendChild(summary);
    const cta = el('button', 'button button-accent dm-cta', 'Confirm appointment');
    cta.type = 'button';
    cta.addEventListener('click', () => {
      busy(cta, 900, () => {
        const ref = 'APT-' + Math.floor(1000 + Math.random() * 9000);
        const done = successCard('Appointment booked successfully.', [
          `${state.service.name} with ${state.service.doctor}`,
          `${state.day.label} ${state.day.date} at ${state.time}`,
          'A WhatsApp reminder arrives 2 hours before.'
        ], ref);
        wrap.replaceChildren(el('h4', 'dm-step-title', 'Booked ✓'), done);
        const strip = imageStrip([{ src: photo(state.service.img), alt: state.service.name, caption: `${state.service.doctor} — ${state.service.role}` }]);
        wrap.appendChild(strip);
        toast(root, 'Confirmation sent to the patient (demo).');
      });
    });
    wrap.appendChild(cta);
    steps.appendChild(wrap);
  };

  function render() {
    steps.replaceChildren();
    renderServices(); renderDays(); renderTimes(); renderConfirm();
  }
  render();

  shellBody.appendChild(steps);
  shellBody.appendChild(el('p', 'dm-note', 'Sample data. In a real deployment the slots come from the clinic’s live calendar and confirmations go out via SMS/WhatsApp.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- TRACKING */
export function trackingDemo(body, cfg) {
  cfg = cfg || {};
  const shipments = cfg.shipments || [
    { id: 'VUVA-20481', origin: 'Nairobi', dest: 'Kisumu', status: 2, eta: 'Today 14:20', vehicle: 'Truck KDF 812L', driver: 'J. Achieng', weight: '2.4 t', img: 'truck-highway.jpg' },
    { id: 'VUVA-20495', origin: 'Mombasa', dest: 'Nakuru', status: 1, eta: 'Tomorrow 09:40', vehicle: 'Van KCX 441K', driver: 'M. Kamau', weight: '610 kg', img: 'delivery-van.jpg' },
    { id: 'VUVA-20502', origin: 'Eldoret', dest: 'Nairobi', status: 4, eta: 'Delivered 11:05', vehicle: 'Truck KBX 772F', driver: 'P. Njoroge', weight: '3.1 t', img: 'warehouse-worker.jpg' }
  ];
  const stages = [
    { label: 'Order received', detail: 'Booking confirmed, dock slot assigned' },
    { label: 'Picked up', detail: 'Cargo loaded, departure scan' },
    { label: 'In transit', detail: 'On the highway, GPS ping every 5 min' },
    { label: 'Arriving', detail: 'Final stop approached, recipient alerted' },
    { label: 'Delivered', detail: 'Proof of delivery with photo captured' }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Track a Shipment', 'Demonstration · sample shipments');
  const state = { current: shipments[0] };

  const picker = el('div', 'dm-seg dm-wrap');
  shipments.forEach((s) => {
    const b = el('button', 'dm-seg-btn' + (s === state.current ? ' is-on' : ''), '#' + s.id.split('-')[1]);
    b.type = 'button';
    b.addEventListener('click', () => { state.current = s; renderAll(); picker.querySelectorAll('.dm-seg-btn').forEach((x, i) => x.classList.toggle('is-on', shipments[i] === s)); });
    picker.appendChild(b);
  });
  shellBody.appendChild(picker);

  const card = el('div', 'dm-ship');
  const tl = el('div', 'dm-ship-timeline');
  shellBody.appendChild(card);
  shellBody.appendChild(tl);

  const advanceBtn = el('button', 'button button-ghost dm-cta', 'Simulate next status ▸');
  advanceBtn.type = 'button';
  advanceBtn.addEventListener('click', () => {
    state.current.status = (state.current.status + 1) % stages.length;
    if (state.current.status === 4) state.current.eta = 'Delivered ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    renderAll();
    toast(root, `#${state.current.id}: ${stages[state.current.status].label}`);
  });
  shellBody.appendChild(advanceBtn);

  function renderAll() {
    const s = state.current;
    card.innerHTML = `
      <div class="dm-ship-media"><img src="${photo(s.img)}" alt="" loading="lazy"><span class="dm-ship-id mono">#${esc(s.id)}</span></div>
      <div class="dm-ship-info">
        <strong>${esc(s.origin)} → ${esc(s.dest)}</strong>
        <span>${esc(s.vehicle)} · Driver ${esc(s.driver)}</span>
        <span>Load ${esc(s.weight)} · ETA ${esc(s.eta)}</span>
        <span class="dm-ship-status">${esc(stages[s.status].label)}</span>
      </div>`;
    tl.replaceChildren(timeline(stages, s.status));
  }
  renderAll();
  shellBody.appendChild(el('p', 'dm-note', 'Sample data. The live system streams GPS positions and pushes status updates to customers on WhatsApp automatically.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- SHOP */
export function shopDemo(body, cfg) {
  cfg = cfg || {};
  const products = cfg.products || [
    { id: 'p1', name: 'Field Headphones', price: 4500, img: 'product-headphones.jpg', tag: 'Audio' },
    { id: 'p2', name: 'Trail Sneakers', price: 6200, img: 'product-sneaker.jpg', tag: 'Footwear' },
    { id: 'p3', name: 'Classic Wall Clock', price: 2800, img: 'product-watch.jpg', tag: 'Home' },
    { id: 'p4', name: 'Daypack 22L', price: 3400, img: 'product-backpack.jpg', tag: 'Bags' },
    { id: 'p5', name: 'Running Shoes', price: 5900, img: 'product-shoes.jpg', tag: 'Footwear' },
    { id: 'p6', name: 'Insulated Bottle', price: 1200, img: 'product-water.jpg', tag: 'Home' }
  ];
  const cart = new Map();
  const { root, body: shellBody } = demoShell(cfg.title || 'Mini Store', 'Demonstration · sample catalogue');
  let filterTag = 'All';

  const tags = ['All', ...new Set(products.map((p) => p.tag))];
  const seg = el('div', 'dm-seg dm-wrap');
  const cartBar = el('div', 'dm-cartbar');
  const grid = el('div', 'dm-shop-grid');

  const renderGrid = () => {
    grid.replaceChildren();
    products.filter((p) => filterTag === 'All' || p.tag === filterTag).forEach((p) => {
      const card = el('div', 'dm-product');
      card.innerHTML = `
        <img src="${photo(p.img)}" alt="${esc(p.name)}" loading="lazy">
        <strong>${esc(p.name)}</strong>
        <span class="dm-product-meta">${esc(p.tag)} · ${money(p.price)}</span>`;
      const add = el('button', 'button button-ghost dm-add', 'Add to cart');
      add.type = 'button';
      add.addEventListener('click', () => {
        cart.set(p.id, (cart.get(p.id) || 0) + 1);
        renderCart();
        toast(root, `${p.name} added to cart`);
      });
      card.appendChild(add);
      grid.appendChild(card);
    });
  };

  const renderCart = () => {
    const count = [...cart.values()].reduce((a, b) => a + b, 0);
    const total = products.filter((p) => cart.has(p.id)).reduce((sum, p) => sum + p.price * cart.get(p.id), 0);
    cartBar.innerHTML = '';
    if (!count) { cartBar.appendChild(el('p', 'dm-empty', 'Cart is empty — add something.')); return; }
    const list = el('ul', 'dm-cart-list');
    products.filter((p) => cart.has(p.id)).forEach((p) => {
      const li = el('li', null, `<img src="${photo(p.img)}" alt=""><span class="dm-cart-name">${esc(p.name)}</span>`);
      const qty = el('span', 'dm-qty');
      const minus = el('button', 'dm-qty-btn', '−'); minus.type = 'button';
      const plus = el('button', 'dm-qty-btn', '+'); plus.type = 'button';
      const n = el('b', null, String(cart.get(p.id)));
      minus.addEventListener('click', () => { const v = cart.get(p.id) - 1; if (v <= 0) cart.delete(p.id); else cart.set(p.id, v); renderCart(); renderBadge(); });
      plus.addEventListener('click', () => { cart.set(p.id, cart.get(p.id) + 1); renderCart(); renderBadge(); });
      qty.append(minus, n, plus);
      li.appendChild(qty);
      li.appendChild(el('span', 'dm-cart-price', money(p.price * cart.get(p.id))));
      list.appendChild(li);
    });
    cartBar.appendChild(list);
    const foot = el('div', 'dm-cart-foot', `<strong>Total ${money(total)}</strong>`);
    const checkout = el('button', 'button button-accent dm-cta', 'Checkout with M-Pesa');
    checkout.type = 'button';
    checkout.addEventListener('click', () => {
      busy(checkout, 1100, () => {
        const ref = 'ORD-' + Math.floor(4000 + Math.random() * 5000);
        const done = successCard('Order confirmed.', [
          'STK push accepted — payment received.',
          'Stock reserved and a rider task was created.',
          'You will receive tracking updates in this chat.'
        ], ref);
        cartBar.replaceChildren(done);
        cart.clear();
        renderBadge();
      });
    });
    foot.appendChild(checkout);
    cartBar.appendChild(foot);
  };

  const renderBadge = () => {
    const count = [...cart.values()].reduce((a, b) => a + b, 0);
    const badge = root.querySelector('.dm-bar-title');
    badge.textContent = (cfg.title || 'Mini Store') + (count ? ` · ${count} in cart` : '');
  };

  tags.forEach((t) => {
    const b = el('button', 'dm-seg-btn' + (t === 'All' ? ' is-on' : ''), t);
    b.type = 'button';
    b.addEventListener('click', () => {
      filterTag = t;
      seg.querySelectorAll('.dm-seg-btn').forEach((x) => x.classList.toggle('is-on', x === b));
      renderGrid();
    });
    seg.appendChild(b);
  });

  renderGrid(); renderCart();
  shellBody.append(seg, grid, cartBar);
  shellBody.appendChild(el('p', 'dm-note', 'Sample data. The real build wires this catalogue to live stock and M-Pesa, exactly as shown.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- ROOMS (hotel) */
export function roomsDemo(body, cfg) {
  cfg = cfg || {};
  const rooms = cfg.rooms || [
    { name: 'Garden Room', price: 8500, img: 'hotel-room.jpg', sleeps: 2, perks: ['Queen bed', 'Garden view', 'Breakfast included'] },
    { name: 'City Suite', price: 14500, img: 'hotel-suite.jpg', sleeps: 3, perks: ['King bed', 'Skyline view', 'Lounge access'] },
    { name: 'Family Room', price: 11500, img: 'bedroom-interior.jpg', sleeps: 4, perks: ['Two queens', 'Connecting door', 'Kids stay free'] }
  ];
  const days = nextDays(6, 1);
  const state = { room: rooms[0], in: days[0], out: days[2], guests: 2 };
  const { root, body: shellBody } = demoShell(cfg.title || 'Book a Stay', 'Demonstration · sample availability');

  const gallery = el('div', 'dm-gallery dm-rooms');
  const form = el('div', 'dm-room-form');
  shellBody.append(gallery, form);

  const renderRooms = () => {
    gallery.replaceChildren();
    rooms.forEach((r) => {
      const b = el('button', 'dm-room-card' + (r === state.room ? ' is-on' : ''), `
        <img src="${photo(r.img)}" alt="${esc(r.name)}" loading="lazy">
        <span class="dm-room-name">${esc(r.name)}</span>
        <span class="dm-room-meta">Sleeps ${r.sleeps} · ${money(r.price)}/night</span>
        <span class="dm-room-perks">${r.perks.map((p) => esc(p)).join(' · ')}</span>`);
      b.type = 'button';
      b.addEventListener('click', () => { state.room = r; renderRooms(); renderQuote(); });
      gallery.appendChild(b);
    });
  };

  const nights = () => Math.max(1, Math.round((days.indexOf(state.out) - days.indexOf(state.in)) || 1));
  const total = () => state.room.price * nights();

  const renderQuote = () => {
    form.innerHTML = `
      <div class="dm-fieldrow"><label>Check-in</label><label>Check-out</label><label>Guests</label></div>`;
    const row = el('div', 'dm-fieldrow');
    const mk = (list, key, labelFn) => {
      const sel = document.createElement('select');
      sel.className = 'dm-select';
      list.forEach((d, i) => {
        const o = document.createElement('option');
        o.value = String(i); o.textContent = labelFn(d);
        sel.appendChild(o);
      });
      sel.value = String(days.indexOf(state[key]));
      sel.addEventListener('change', () => {
        const idx = Number(sel.value);
        state[key] = days[idx];
        if (days.indexOf(state.in) >= days.indexOf(state.out)) {
          state.out = days[Math.min(idx + 1, days.length - 1)];
        }
        renderQuote();
      });
      return sel;
    };
    row.appendChild(mk(days, 'in', (d) => `${d.label} ${d.date}`));
    row.appendChild(mk(days, 'out', (d) => `${d.label} ${d.date}`));
    const gsel = document.createElement('select');
    gsel.className = 'dm-select';
    [1, 2, 3, 4].forEach((g) => {
      const o = document.createElement('option');
      o.value = String(g); o.textContent = `${g} guest${g > 1 ? 's' : ''}`;
      gsel.appendChild(o);
    });
    gsel.value = String(Math.min(state.guests, state.room.sleeps));
    gsel.addEventListener('change', () => { state.guests = Number(gsel.value); });
    row.appendChild(gsel);
    form.appendChild(row);

    const quote = el('div', 'dm-summary', `
      <img src="${photo(state.room.img)}" alt="" loading="lazy">
      <div>
        <strong>${esc(state.room.name)}</strong>
        <span>${nights()} night${nights() > 1 ? 's' : ''} · ${state.guests} guest${state.guests > 1 ? 's' : ''}</span>
        <span>${money(state.room.price)} × ${nights()} = <b>${money(total())}</b></span>
        <span>Free cancellation until 24 h before arrival</span>
      </div>`);
    form.appendChild(quote);

    const cta = el('button', 'button button-accent dm-cta', 'Reserve now');
    cta.type = 'button';
    cta.addEventListener('click', () => {
      busy(cta, 900, () => {
        const ref = 'RES-' + Math.floor(2000 + Math.random() * 7000);
        const done = successCard('Reservation confirmed.', [
          `${state.room.name} · ${state.in.label} ${state.in.date} → ${state.out.label} ${state.out.date}`,
          `${state.guests} guest(s) · total ${money(total())}`,
          'Digital key and check-in details will arrive on WhatsApp.'
        ], ref);
        form.replaceChildren(done);
      });
    });
    form.appendChild(cta);
  };

  renderRooms(); renderQuote();
  shellBody.appendChild(el('p', 'dm-note', 'Sample data. The live system reads real availability, takes M-Pesa deposits and issues digital keys.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- PROPERTY */
export function propertyDemo(body, cfg) {
  cfg = cfg || {};
  const listings = cfg.listings || [
    { name: 'Kilimani 2-Bed', price: 58000, beds: 2, area: 'Kilimani', img: 'apartment-building.jpg', status: 'Vacant' },
    { name: 'Westlands Studio', price: 35000, beds: 1, area: 'Westlands', img: 'living-room.jpg', status: 'Vacant' },
    { name: 'Lavington Townhouse', price: 120000, beds: 4, area: 'Lavington', img: 'house-exterior.jpg', status: 'Notice given' },
    { name: 'Kileleshwa 3-Bed', price: 85000, beds: 3, area: 'Kileleshwa', img: 'modern-kitchen.jpg', status: 'Vacant' }
  ];
  const { root, body: shellBody } = demoShell(cfg.title || 'Browse Rentals', 'Demonstration · sample listings');
  const state = { beds: 'Any', maxPrice: 130000, viewing: null };

  const controls = el('div', 'dm-controls');
  const seg = el('div', 'dm-seg');
  ['Any', '1', '2', '3+'].forEach((b) => {
    const btn = el('button', 'dm-seg-btn' + (b === state.beds ? ' is-on' : ''), b === 'Any' ? 'Any beds' : b === '3+' ? '3+ beds' : b + ' bed');
    btn.type = 'button';
    btn.addEventListener('click', () => {
      state.beds = b;
      seg.querySelectorAll('.dm-seg-btn').forEach((x) => x.classList.toggle('is-on', x === btn));
      renderList();
    });
    seg.appendChild(btn);
  });
  const range = el('input');
  range.type = 'range'; range.min = '30000'; range.max = '130000'; range.step = '5000'; range.value = String(state.maxPrice);
  range.className = 'dm-range';
  range.setAttribute('aria-label', 'Maximum rent');
  const priceOut = el('span', 'dm-range-out', 'Up to ' + money(state.maxPrice));
  range.addEventListener('input', () => { state.maxPrice = Number(range.value); priceOut.textContent = 'Up to ' + money(state.maxPrice); renderList(); });
  controls.append(seg, el('div', 'dm-range-row', ''), priceOut);
  controls.querySelector('.dm-range-row').appendChild(range);
  shellBody.appendChild(controls);

  const listWrap = el('div', 'dm-list');
  shellBody.appendChild(listWrap);

  const matches = () => listings.filter((l) => {
    if (state.beds === '1' && l.beds !== 1) return false;
    if (state.beds === '2' && l.beds !== 2) return false;
    if (state.beds === '3+' && l.beds < 3) return false;
    return l.price <= state.maxPrice;
  });

  const renderList = () => {
    listWrap.replaceChildren();
    const found = matches();
    if (!found.length) { listWrap.appendChild(el('p', 'dm-empty', 'No units match — widen the filters.')); return; }
    found.forEach((l) => {
      const item = el('article', 'dm-listing');
      item.innerHTML = `
        <img src="${photo(l.img)}" alt="${esc(l.name)}" loading="lazy">
        <div class="dm-listing-body">
          <strong>${esc(l.name)}</strong>
          <span>${l.beds} bed · ${esc(l.area)} · ${money(l.price)}/month</span>
          <span class="dm-badge ${l.status === 'Vacant' ? 'is-ok' : 'is-warn'}">${esc(l.status)}</span>
        </div>`;
      const btn = el('button', 'button button-ghost dm-add', 'Book viewing');
      btn.type = 'button';
      btn.addEventListener('click', () => {
        state.viewing = l;
        renderViewing(l);
        toast(root, `Viewing requested for ${l.name}`);
      });
      item.querySelector('.dm-listing-body').appendChild(btn);
      listWrap.appendChild(item);
    });
  };

  const viewingHost = el('div', 'dm-viewing');
  const renderViewing = (l) => {
    const days = nextDays(4);
    viewingHost.replaceChildren();
    const box = el('div', 'dm-viewing-box');
    box.appendChild(el('h4', 'dm-step-title', `Viewing: ${l.name}`));
    const segd = el('div', 'dm-seg dm-wrap');
    let chosen = null;
    days.forEach((d) => {
      ['10:00', '14:00', '16:30'].forEach((t) => {
        const b = el('button', 'dm-seg-btn', `${d.label} ${t}`);
        b.type = 'button';
        b.addEventListener('click', () => { chosen = { d, t }; segd.querySelectorAll('.dm-seg-btn').forEach((x) => x.classList.remove('is-on')); b.classList.add('is-on'); });
        segd.appendChild(b);
      });
    });
    box.appendChild(segd);
    const confirm = el('button', 'button button-accent dm-cta', 'Confirm viewing');
    confirm.type = 'button';
    confirm.addEventListener('click', () => {
      if (!chosen) { toast(root, 'Pick a slot first', 'warn'); return; }
      busy(confirm, 700, () => {
        viewingHost.replaceChildren(successCard('Viewing booked.', [
          `${l.name} · ${chosen.d.label} ${chosen.d.date} at ${chosen.t}`,
          'Agent Ann meets you there — gate code sent on WhatsApp.'
        ], 'VW-' + Math.floor(100 + Math.random() * 900)));
      });
    });
    box.appendChild(confirm);
    viewingHost.appendChild(box);
  };
  shellBody.appendChild(viewingHost);
  renderList();
  shellBody.appendChild(el('p', 'dm-note', 'Sample data. The live system syncs vacancies, collects rent via M-Pesa and routes maintenance tickets.'));
  body.appendChild(root);
}

/* ---------------------------------------------------------------- DASHBOARD */
export function dashboardDemo(body, cfg) {
  cfg = cfg || {};
  /* Industry-aware variants. The dashboard is the same shell (segments +
     stats + chart + table) but the labels and rows adapt to the project
     so a school, a hospital, a logistics operation or a commerce store
     each feel like their own product, not a relabelled retail dashboard. */
  const variants = {
    school: {
      kpis: [
        { label: 'Students',  base: 1284, fmt: 'n',   delta: '▲ 3.1%',    dir: 'up' },
        { label: 'Present',   base: 1192, fmt: 'n',   delta: '▲ 1.4%',    dir: 'up' },
        { label: 'On-time',   base: 94.2, fmt: 'pct', delta: '▲ 0.6 pt',  dir: 'up' },
        { label: 'Fees due',  base: 840000, fmt: 'kes', delta: '▼ 2.4%',   dir: 'down' }
      ],
      chartTitle: 'Attendance by week',
      chartLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
      trendTitle: 'Attendance trend',
      tableTitle: 'Latest registrations',
      tableHead: ['Ref','Student','Class','Status'],
      tableRows: [
        ['#S-2049', 'A. Wanjiku',   'Grade 5', 'Active'],
        ['#S-2048', 'B. Otieno',    'Grade 3', 'Active'],
        ['#S-2047', 'F. Mwangi',    'Grade 6', 'Pending'],
        ['#S-2046', 'K. Njoroge',   'Grade 4', 'Active']
      ],
      statusMap: { Active: 'is-ok', Pending: 'is-warn' }
    },
    healthcare: {
      kpis: [
        { label: "Today's appts", base: 42,   fmt: 'n',   delta: '▲ 6',     dir: 'up' },
        { label: 'In queue',      base: 14,   fmt: 'n',   delta: '▼ 3',     dir: 'down' },
        { label: 'Doctors on',    base: 6,    fmt: 'n',   delta: '— flat',  dir: 'flat' },
        { label: 'Revenue',       base: 184000, fmt: 'kes', delta: '▲ 8.2%',  dir: 'up' }
      ],
      chartTitle: 'Appointments per day',
      chartLabels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      trendTitle: 'Queue length',
      tableTitle: "Today's schedule",
      tableHead: ['Time','Patient','Doctor','Status'],
      tableRows: [
        ['10:30', 'J. Kamau',  'Dr. Mwangi',     'Confirmed'],
        ['11:00', 'A. Otieno', 'Dr. Otieno',     'In consult'],
        ['11:30', 'F. Wanjiku','Dr. Kamau',      'Checked in'],
        ['14:00', 'K. Njoroge','Dr. Kiprono',    'Confirmed']
      ],
      statusMap: { Confirmed: 'is-info', 'In consult': 'is-warn', 'Checked in': 'is-ok' }
    },
    logistics: {
      kpis: [
        { label: 'In transit', base: 128, fmt: 'n', delta: '▲ 12', dir: 'up' },
        { label: 'At hub',     base: 22,  fmt: 'n', delta: '—',     dir: 'flat' },
        { label: 'On-time',    base: 96.4, fmt: 'pct', delta: '▲ 0.4 pt', dir: 'up' },
        { label: 'Drivers',    base: 18, fmt: 'n', delta: '▼ 1',  dir: 'down' }
      ],
      chartTitle: 'Shipments by week',
      chartLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
      trendTitle: 'Delivery volume',
      tableTitle: 'Active shipments',
      tableHead: ['Ref','Route','Driver','Status'],
      tableRows: [
        ['#VUVA-20481', 'Nairobi → Kisumu', 'J. Achieng', 'In transit'],
        ['#VUVA-20480', 'Mombasa → Nairobi','P. Otieno',  'At hub'],
        ['#VUVA-20479', 'Eldoret → Nairobi','B. Wanjiku', 'Delivered'],
        ['#VUVA-20478', 'Nairobi → Nakuru', 'K. Njoroge', 'In transit']
      ],
      statusMap: { 'In transit': 'is-info', 'At hub': 'is-warn', Delivered: 'is-ok' }
    },
    lend: {
      kpis: [
        { label: 'Applications', base: 86, fmt: 'n', delta: '▲ 9',   dir: 'up' },
        { label: 'In review',    base: 14, fmt: 'n', delta: '▼ 2',   dir: 'down' },
        { label: 'Approved',     base: 42, fmt: 'n', delta: '▲ 5',   dir: 'up' },
        { label: 'Disbursed',    base: 1240000, fmt: 'kes', delta: '▲ 11.4%', dir: 'up' }
      ],
      chartTitle: 'Disbursements by week',
      chartLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
      trendTitle: 'Approval rate',
      tableTitle: 'Latest applications',
      tableHead: ['App#','Applicant','Amount','Status'],
      tableRows: [
        ['LA-2049', 'B. Otieno',   85000, 'In review'],
        ['LA-2048', 'F. Wanjiku',  45000, 'Approved'],
        ['LA-2047', 'J. Kamau',   120000, 'In review'],
        ['LA-2046', 'K. Njoroge',  60000, 'Disbursed']
      ],
      statusMap: { 'In review': 'is-warn', Approved: 'is-info', Disbursed: 'is-ok' },
      moneyColumn: 2
    },
    crm: {
      kpis: [
        { label: 'Open deals',  base: 38, fmt: 'n', delta: '▲ 4',  dir: 'up' },
        { label: 'Pipeline',    base: 4800000, fmt: 'kes', delta: '▲ 6.2%', dir: 'up' },
        { label: 'Closing wk',  base: 7,  fmt: 'n', delta: '—',    dir: 'flat' },
        { label: 'Win rate',    base: 32.4, fmt: 'pct', delta: '▲ 1.1 pt', dir: 'up' }
      ],
      chartTitle: 'Pipeline by week',
      chartLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
      trendTitle: 'Deal velocity',
      tableTitle: 'Active deals',
      tableHead: ['Deal','Owner','Value','Stage'],
      tableRows: [
        ['D-2049', 'A. Wanjiku',  1200000, 'Quote'],
        ['D-2048', 'B. Otieno',    850000, 'Negotiation'],
        ['D-2047', 'F. Mwangi',    540000, 'Contacted'],
        ['D-2046', 'K. Njoroge',   920000, 'Won']
      ],
      statusMap: { Quote: 'is-warn', Negotiation: 'is-info', Contacted: 'is-info', Won: 'is-ok' },
      moneyColumn: 2
    },
    /* Default — retail/commerce (preserves the original look) */
    default: {
      kpis: [
        { label: 'Revenue', base: 2840000, fmt: 'kes', delta: '▲ 8.2%',  dir: 'up' },
        { label: 'Orders',  base: 1180,    fmt: 'n',   delta: '▲ 4.1%',  dir: 'up' },
        { label: 'On-time', base: 94.2,    fmt: 'pct', delta: '▲ 0.6 pt',dir: 'up' },
        { label: 'Returns', base: 2.1,     fmt: 'pct', delta: '▼ 0.3 pt',dir: 'down' }
      ],
      chartTitle: 'Revenue by week',
      chartLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
      trendTitle: 'Order trend',
      tableTitle: 'Latest orders',
      tableHead: ['Order','Customer','Status','Value'],
      tableRows: [
        ['#4821', 'K. Mwangi',   'Paid',       14500],
        ['#4820', 'A. Otieno',   'In transit', 22800],
        ['#4819', 'B. Wanjiku',  'Delivered',   8900],
        ['#4818', 'J. Njoroge',  'Paid',       31200]
      ],
      statusMap: { Paid: 'is-ok', 'In transit': 'is-info', Delivered: 'is-ok' },
      moneyColumn: 3
    }
  };
  const v = variants[cfg.industry] || variants.default;
  const fmtKpi = (k, f) => {
    if (k.fmt === 'pct') return k.base.toFixed(1) + '%';
    if (k.fmt === 'kes') return money(Math.round(k.base * f));
    return Math.round(k.base * f).toLocaleString('en-KE');
  };
  const { root, body: shellBody } = demoShell(cfg.title || 'Operations Dashboard', 'Demonstration · sample data');
  const ranges = { '7 days': 0.82, '30 days': 1.0, 'Quarter': 1.24 };
  const state = { range: '30 days' };

  const controls = el('div', 'dm-controls');
  segmented(controls, Object.keys(ranges).map((k) => ({ label: k, value: k })), state.range, (v2) => { state.range = v2; renderAll(); });
  shellBody.appendChild(controls);

  const host = el('div', 'dm-dash');
  shellBody.appendChild(host);

  function renderAll() {
    const f = ranges[state.range];
    const rnd = seeded(state.range.length * 97 + 11);
    host.replaceChildren(
      statRow(v.kpis.map((k) => ({ label: k.label, value: fmtKpi(k, f), delta: k.delta, dir: k.dir })))
    );
    const grid = el('div', 'dm-dash-grid');
    const chartCard = el('div', 'dm-card');
    chartCard.appendChild(el('h4', 'dm-card-title', v.chartTitle));
    const vals = Array.from({ length: v.chartLabels.length }, (_, i) => Math.round((180 + rnd() * 220) * f));
    chartCard.insertAdjacentHTML('beforeend', barChart(vals, v.chartLabels));
    grid.appendChild(chartCard);

    const trendCard = el('div', 'dm-card');
    trendCard.appendChild(el('h4', 'dm-card-title', v.trendTitle));
    trendCard.insertAdjacentHTML('beforeend', sparkline(Array.from({ length: 14 }, () => 40 + rnd() * 60)));
    grid.appendChild(trendCard);

    const tableCard = el('div', 'dm-card dm-card-wide');
    tableCard.appendChild(el('h4', 'dm-card-title', v.tableTitle));
    const tbl = el('table', 'dm-table');
    tbl.innerHTML = `<thead><tr>${v.tableHead.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody></tbody>`;
    v.tableRows.forEach((r) => {
      const tr = document.createElement('tr');
      const statusIdx = v.tableHead.findIndex((h) => /status|stage/i.test(h));
      const moneyIdx = v.moneyColumn != null ? v.moneyColumn : -1;
      tr.innerHTML = r.map((cell, i) => {
        if (i === statusIdx) {
          const cls = v.statusMap && v.statusMap[cell] ? v.statusMap[cell] : '';
          return `<td><span class="dm-badge ${cls}">${esc(cell)}</span></td>`;
        }
        if (i === moneyIdx) return `<td class="num">${money(cell)}</td>`;
        return `<td>${esc(String(cell))}</td>`;
      }).join('');
      tbl.querySelector('tbody').appendChild(tr);
    });
    tableCard.appendChild(tbl);
    grid.appendChild(tableCard);
    host.appendChild(grid);
  }
  renderAll();
  shellBody.appendChild(el('p', 'dm-note', 'Sample data. In production this reads your live database — same screens, real numbers.'));
  body.appendChild(root);
}

