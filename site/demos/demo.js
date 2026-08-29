// Vuva Systems · shared demonstration-environment framework.
// Wires sidebar navigation, the demo AI assistant and the live clock.
// Each demo page sets <body data-demo="..."> and includes static panel markup.

const DEMOS = {
  logistics: {
    name: 'Vuva Logistics Intelligence',
    assistant: 'Logistics AI',
    suggestions: ['Active shipments', 'Drivers on duty', 'Any delayed shipments?', 'How does proof of delivery work?'],
    rules: [
      { re: /shipment|parcel|cargo|consignment/i, reply: 'Right now there are 128 active shipments. 34 are in transit, 22 are at the warehouse and 72 were delivered today.' },
      { re: /driver|dispatch/i, reply: 'We have 18 drivers on duty across three branches. Twelve are on the road, four are on standby and two are on leave.' },
      { re: /late|delay/i, reply: 'Three shipments are running late. You can see them highlighted in the Shipments tab with an expected recovery time.' },
      { re: /fleet|vehicle|truck/i, reply: 'The fleet has 26 vehicles, mostly trucks plus six vans. Twenty three are out working right now.' },
      { re: /track|where|location/i, reply: 'Open the Tracking tab to see every shipment on the map with its current status.' },
      { re: /proof|signature|photo|pod/i, reply: 'Drivers capture a photo and signature at each drop. The proof attaches to the shipment and the customer gets a WhatsApp confirmation automatically.' },
      { re: /quote|price|book.*shipment|create/i, reply: 'Customers enter a pick up point, a drop off point and the weight, then get an instant quote. Payment happens by M-Pesa or invoice.' },
      { re: /eta|predict|forecast/i, reply: 'Arrival times come from live route progress and past trip data. If a shipment starts running late, the system flags it before customers notice.' }
    ],
    fallback: 'I’m the Logistics AI demo assistant. Ask about shipments, fleet, drivers, dispatch, tracking, proof of delivery or the customer portal.'
  },
  healthcare: {
    name: 'VuvaCare',
    assistant: 'VuvaCare AI',
    suggestions: ['How many patients are waiting?', 'Longest queue?', 'Today’s appointments', 'Cardiology slots'],
    rules: [
      { re: /wait|queue/i, reply: 'Fourteen patients are waiting right now. Six are in Outpatient, five in Cardiology and three in Pharmacy.' },
      { re: /longest|long/i, reply: 'Cardiology has the longest queue at the moment. Five patients, waiting about 24 minutes on average.' },
      { re: /appointment|today/i, reply: 'There are 42 appointments today. Most are confirmed, seven are in progress and four are still to come.' },
      { re: /cardio/i, reply: 'Cardiology has two free slots this afternoon, at 2:30 and 4:00.' },
      { re: /patient/i, reply: '1,284 patients are registered with us. We have seen 96 today and 14 are in the queue now.' },
      { re: /pharmacy|prescription|stock/i, reply: 'The pharmacy is holding eight prescriptions and three items need reordering soon.' }
    ],
    fallback: 'I’m the VuvaCare demo assistant. Ask about patients, queues, appointments, departments or pharmacy.'
  },
  realestate: {
    name: 'Vuva PropertyOS',
    assistant: 'Property AI',
    suggestions: ['2-bed under KSh 60k', 'Book a viewing', 'Rent collection', 'Vacancies'],
    rules: [
      { re: /2.?bed|two.?bed|bedroom/i, reply: 'I found six two bedroom units under KSh 60,000. Three are in Kilimani, two in Westlands and one in Lavington.' },
      { re: /book|view/i, reply: 'You can view a unit today at 11:00, 2:00 or 4:30. Tell me which works and I will book it.' },
      { re: /rent|payment|collect/i, reply: 'We have collected 92% of this month’s rent, KSh 1.84M of the 2.0M due. Four tenants are behind.' },
      { re: /vacan|empty/i, reply: 'Twelve units are vacant across eight properties, which is a 6% vacancy rate. The list is in the Vacancies tab.' },
      { re: /maintenance|repair|request/i, reply: 'Seven maintenance requests are open and three of them are urgent. They are all in the Maintenance tab.' }
    ],
    fallback: 'I’m the PropertyOS demo leasing assistant. Ask about units, rent, viewings, vacancies or maintenance.'
  },
  hospitality: {
    name: 'Vuva HospitalityOS',
    assistant: 'Hospitality AI',
    suggestions: ['Today’s orders', 'Top branch', 'Riders active', 'Today’s revenue'],
    rules: [
      { re: /order/i, reply: 'The branches have taken 214 orders today. 168 are delivered, 38 are in progress and 8 are waiting for confirmation.' },
      { re: /branch|top/i, reply: 'Nine branches are open today. Ruai is leading with 46 orders.' },
      { re: /rider|delivery|dispatch/i, reply: 'Fourteen riders are out now and deliveries are averaging 28 minutes today.' },
      { re: /revenue|sales|money/i, reply: 'Revenue so far today is KSh 312,450 across the branches, up 12% on yesterday.' }
    ],
    fallback: 'I’m the HospitalityOS demo assistant. Ask about orders, branches, riders, delivery or revenue.'
  },
  retail: {
    name: 'Vuva CommerceOS',
    assistant: 'Commerce AI',
    suggestions: ['Running low?', 'Highest sales branch', 'Best sellers this month', 'Stock overview'],
    rules: [
      { re: /low|reorder|running/i, reply: 'Seven products are running low. Maize flour, cooking oil, sugar, rice, detergent, bread and milk.' },
      { re: /highest|best.*branch|branch/i, reply: 'Westlands is leading sales today with KSh 148,200.' },
      { re: /best.?sell|top.*product|popular/i, reply: 'This month’s best sellers are maize flour, cooking oil, sugar and rice.' },
      { re: /stock|inventory|warehouse/i, reply: 'We hold 12,480 units across three warehouses. Seven items have dropped below their reorder level.' },
      { re: /supplier|purchase/i, reply: 'We work with 24 suppliers and three purchase orders are still awaiting confirmation.' }
    ],
    fallback: 'I’m the CommerceOS demo analytics assistant. Ask about stock, sales, branches, suppliers or best-sellers.'
  },
  rental: {
    name: 'Vuva RentalOS',
    assistant: 'Fleet AI',
    suggestions: ['Available this weekend?', 'Book the Harrier', 'Late returns', 'Pricing recommendation'],
    rules: [
      { re: /weekend|availab|free|saturday|sunday/i, reply: 'This weekend the Harrier, Nissan Note and Alphard are all free. The Demio comes back on Saturday afternoon.' },
      { re: /harrier|book|reserve/i, reply: 'The Harrier is KSh 7,500 a day with a refundable deposit of KSh 20,000. I can hold it for you now and send the deposit link on WhatsApp.' },
      { re: /late|overdue|return/i, reply: 'Two cars came back late today. Reminders went out automatically and late fees apply after the two hour grace period.' },
      { re: /price|pricing|rate|demand/i, reply: 'The model suggests raising SUV prices by 8% this weekend because demand looks strong. A manager would need to approve that first.' },
      { re: /deposit|payment|mpesa/i, reply: 'Deposits are held against each booking and released once inspection passes. M-Pesa and card both work here.' },
      { re: /maintenance|service|repair/i, reply: 'Four vehicles are being serviced or cleaned. KBX 442P needs a major service in three days, before the Mombasa contract starts.' },
      { re: /utilisa|utilisation|revenue|earn/i, reply: 'Fleet utilisation is 63% this month. The Alphard earns the most per day it is available while the Probox sits idle the most.' }
    ],
    fallback: 'I’m the Fleet AI demo assistant. Ask about availability, bookings, deposits, pricing, maintenance or utilisation.'
  }
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function initDemo() {
  const key = document.body.dataset.demo || 'logistics';
  const cfg = DEMOS[key] || DEMOS.logistics;

  // ---- Sidebar navigation ----
  const navButtons = document.querySelectorAll('[data-panel-nav]');
  const panels = document.querySelectorAll('.demo-panel');

  const showPanel = (id) => {
    panels.forEach((p) => p.classList.toggle('is-active', p.id === id));
    navButtons.forEach((b) => {
      const active = b.dataset.panelNav === id;
      if (active) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => showPanel(btn.dataset.panelNav));
  });

  if (panels.length) {
    const first = panels[0].id;
    showPanel(first);
  }

  // ---- Live clock ----
  const clock = document.querySelector('[data-demo-clock]');
  const tick = () => {
    if (clock) clock.textContent = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };
  tick();
  setInterval(tick, 30000);

  // ---- AI assistant ----
  const fab = document.querySelector('[data-ai-open]');
  const modal = document.querySelector('[data-ai-modal]');
  const close = document.querySelector('[data-ai-close]');
  const body = document.querySelector('[data-ai-body]');
  const input = document.querySelector('[data-ai-input]');
  const send = document.querySelector('[data-ai-send]');
  const suggest = document.querySelector('[data-ai-suggest]');

  const openModal = () => {
    modal?.classList.add('is-open');
    if (!body?.children.length) greet();
    input?.focus();
  };
  const closeModal = () => modal?.classList.remove('is-open');

  fab?.addEventListener('click', openModal);
  close?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal(); });

  const push = (kind, text) => {
    const m = el('div', `m ${kind}`);
    m.textContent = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  };

  const answer = (text) => {
    const typing = push('agent', '…');
    setTimeout(() => {
      typing.remove();
      push('agent', text);
    }, 480 + Math.random() * 360);
  };

  const match = (text) => {
    const rule = cfg.rules.find((r) => r.re.test(text));
    return rule ? rule.reply : cfg.fallback;
  };

  const greet = () => {
    push('agent', `Hi, I’m the ${cfg.assistant}. This is a demo running on sample data, so ask me anything about the system.`);
  };

  const submit = () => {
    const value = input.value.trim();
    if (!value) return;
    push('user', value);
    input.value = '';
    answer(match(value));
  };

  send?.addEventListener('click', submit);
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });

  if (suggest) {
    cfg.suggestions.forEach((s) => {
      const chip = el('button', 'chip is-dark');
      chip.type = 'button';
      chip.textContent = s;
      chip.addEventListener('click', () => {
        push('user', s);
        answer(match(s));
      });
      suggest.appendChild(chip);
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDemo);
else initDemo();
