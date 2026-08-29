// VuvaCare · Healthcare Management Demonstration.
// A two-sided demo (Patient Experience + Hospital Operations) connected by a
// shared, localStorage-persisted booking store. Fictional data only; no real
// medical records or live payments. Loaded in place of the shared demo.js.

const STORE_KEY = 'vuvacare_demo_v1';

const DEPARTMENTS = [
  { id: 'general', name: 'General Medicine', icon: '🩺', fee: 1500, desc: 'Everyday illness, check-ups and general consultations.' },
  { id: 'cardiology', name: 'Cardiology', icon: '🫀', fee: 2000, desc: 'Heart and cardiovascular consultations.' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '🧒', fee: 1800, desc: 'Child health, growth and immunisations.' },
  { id: 'dental', name: 'Dental', icon: '🦷', fee: 2500, desc: 'Dental exams, cleaning and procedures.' },
  { id: 'maternity', name: 'Maternity', icon: '🤰', fee: 2200, desc: 'Antenatal, postnatal and maternal care.' },
  { id: 'dermatology', name: 'Dermatology', icon: '✨', fee: 2200, desc: 'Skin, hair and nail consultations.' },
  { id: 'laboratory', name: 'Laboratory', icon: '🔬', fee: 1200, desc: 'Diagnostic tests and sample collection.' },
  { id: 'emergency', name: 'Emergency', icon: '🚑', fee: 3000, desc: 'Urgent and immediate care.' }
];

const DOCTORS = [
  { id: 'jane', name: 'Dr. Jane Mwangi', dept: 'cardiology', initials: 'JM', specialty: 'Consultant Cardiologist' },
  { id: 'brian', name: 'Dr. Brian Otieno', dept: 'general', initials: 'BO', specialty: 'General Practitioner' },
  { id: 'sarah', name: 'Dr. Sarah Kamau', dept: 'pediatrics', initials: 'SK', specialty: 'Pediatrician' },
  { id: 'david', name: 'Dr. David Kiprono', dept: 'dental', initials: 'DK', specialty: 'Dental Surgeon' },
  { id: 'achieng', name: 'Dr. Achieng Odhiambo', dept: 'maternity', initials: 'AO', specialty: 'Obstetrician' },
  { id: 'njeri', name: 'Dr. Njeri Wambui', dept: 'dermatology', initials: 'NW', specialty: 'Dermatologist' }
];

const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

const STATUS_LABEL = {
  confirmed: 'Confirmed', checked_in: 'Checked in', waiting: 'In queue',
  called: 'Called', in_consultation: 'In consultation', completed: 'Completed', cancelled: 'Cancelled'
};
const STATUS_BADGE = {
  confirmed: 'info', checked_in: 'info', waiting: 'warn', called: 'warn',
  in_consultation: 'warn', completed: 'ok', cancelled: 'neutral'
};

/* ---------- date helpers (local time) ---------- */
function dateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fmtDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' });
}
function dayLabel(iso) {
  if (iso === dateStr(0)) return 'Today';
  if (iso === dateStr(1)) return 'Tomorrow';
  return fmtDate(iso);
}
function fmtTime(t) {
  const [h, m] = t.split(':');
  const hh = Number(h);
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${m} ${ampm}`;
}
const fmtKsh = (n) => `KSh ${n.toLocaleString('en-KE')}`;

/* ---------- seed data ---------- */
function mk(patient, deptId, doctorId, off, time, status, method = 'mpesa', pay = 'paid') {
  const dept = DEPARTMENTS.find((d) => d.id === deptId);
  const doc = DOCTORS.find((d) => d.id === doctorId);
  return {
    ref: '', code: '', patient, dept: deptId, doctor: doc ? doc.name : 'First available doctor',
    date: dateStr(off), time, fee: dept.fee, method, pay, status
  };
}
function seedBookings() {
  const rows = [
    mk('Faith Wanjiru', 'general', 'brian', 0, '09:00', 'completed'),
    mk('Peter Otieno', 'cardiology', 'jane', 0, '09:30', 'in_consultation'),
    mk('Amina Hassan', 'cardiology', 'jane', 0, '10:00', 'called'),
    mk('John Kariuki', 'cardiology', 'jane', 0, '10:30', 'waiting'),
    mk('Grace Njeri', 'pediatrics', 'sarah', 0, '11:00', 'checked_in'),
    mk('Kevin Otieno', 'dental', 'david', 0, '14:00', 'confirmed'),
    mk('Mary Wambui', 'dermatology', 'njeri', 0, '14:30', 'confirmed'),
    mk('Brian Kimani', 'cardiology', 'jane', 0, '15:00', 'confirmed'),
    mk('Naomi Achieng', 'cardiology', 'jane', 0, '11:30', 'waiting'),
    mk('Esther Moraa', 'general', 'brian', 0, '11:00', 'waiting'),
    mk('Lucy Achieng', 'maternity', 'achieng', 1, '09:00', 'confirmed'),
    mk('David Mutua', 'general', 'brian', 1, '10:30', 'confirmed'),
    mk('Naomi Chebet', 'pediatrics', 'sarah', 1, '14:00', 'confirmed'),
    mk('Paul Njoroge', 'cardiology', 'jane', 1, '10:00', 'confirmed', 'card', 'paid')
  ];
  let n = 1042;
  rows.forEach((r) => {
    r.ref = `VC-2026-${n}`;
    r.code = String(100000 + Math.floor(Math.random() * 900000));
    n += 1;
  });
  return rows;
}

let bookings = loadBookings();

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return seedBookings();
}
function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(bookings)); } catch { /* ignore */ }
}
function resetDemo() {
  bookings = seedBookings();
  persist();
}

/* ---------- DOM helpers ---------- */
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function badge(text, kind) { return el('span', `badge is-${kind}`, text); }
function dept(id) { return DEPARTMENTS.find((d) => d.id === id); }

/* ============================================================ *
 *  BOOKING WIZARD
 * ============================================================ */
const DRAFT = { dept: null, doctor: null, doctorName: null, date: null, time: null, name: '', phone: '', email: '', method: null, step: 1 };

function isSlotBusy(date, time) {
  return bookings.some((b) => b.date === date && b.time === time && b.status !== 'cancelled');
}

function renderWizard() {
  const stage = document.querySelector('[data-booking-stage]');
  const steps = document.querySelector('[data-booking-steps]');
  if (!stage || !steps) return;
  const labels = ['Department', 'Doctor', 'Date', 'Time', 'Your details', 'Review', 'Payment'];
  steps.innerHTML = '';
  labels.forEach((label, i) => {
    const s = el('span', 'vc-step');
    if (i + 1 < DRAFT.step) s.classList.add('is-done');
    else if (i + 1 === DRAFT.step) s.classList.add('is-active');
    s.appendChild(el('span', 'n', String(i + 1)));
    s.appendChild(document.createTextNode(label));
    steps.appendChild(s);
  });
  stage.innerHTML = '';
  const renderers = [stepDept, stepDoctor, stepDate, stepTime, stepDetails, stepReview, stepPayment];
  renderers[DRAFT.step - 1](stage);
}

function wizardNav(stage, { back, next }) {
  const nav = el('div', 'vc-wizard-nav');
  if (back) {
    const b = el('button', 'button button-quiet', '← Back');
    b.type = 'button';
    b.addEventListener('click', () => { DRAFT.step -= 1; renderWizard(); });
    nav.appendChild(b);
  }
  nav.appendChild(el('span', 'spacer'));
  const n = el('button', 'button button-accent', next.label);
  n.type = 'button';
  n.addEventListener('click', next.handler);
  nav.appendChild(n);
  stage.appendChild(nav);
}

function stepDept(stage) {
  const head = el('div', 'vc-step-head');
  head.appendChild(el('h3', null, 'Choose a department'));
  head.appendChild(el('p', null, 'Select the service you need. Fees are shown per consultation.'));
  stage.appendChild(head);
  const grid = el('div', 'vc-dept-grid');
  DEPARTMENTS.forEach((d) => {
    const card = el('button', 'vc-dept-card');
    card.type = 'button';
    const icon = el('span', 'd-icon', d.icon);
    const main = el('span', 'd-main');
    main.appendChild(el('strong', null, d.name));
    main.appendChild(el('small', null, d.desc));
    const fee = el('span', 'd-fee', fmtKsh(d.fee));
    card.append(icon, main, fee);
    card.addEventListener('click', () => { DRAFT.dept = d.id; DRAFT.step = 2; renderWizard(); });
    grid.appendChild(card);
  });
  stage.appendChild(grid);
}

function stepDoctor(stage) {
  const head = el('div', 'vc-step-head');
  head.appendChild(el('h3', null, `Choose a doctor · ${dept(DRAFT.dept).name}`));
  head.appendChild(el('p', null, 'Pick a specific doctor or the first available.'));
  stage.appendChild(head);
  const grid = el('div', 'vc-doctor-grid');
  const first = el('button', 'vc-doctor-card');
  first.type = 'button';
  const av = el('span', 'avatar alt', '★');
  const fm = el('span', 'd-main');
  fm.appendChild(el('strong', null, 'First available doctor'));
  fm.appendChild(el('small', null, 'Shortest wait · we assign the next available specialist.'));
  first.append(av, fm);
  first.addEventListener('click', () => { DRAFT.doctor = 'first'; DRAFT.doctorName = 'First available doctor'; DRAFT.step = 3; renderWizard(); });
  grid.appendChild(first);
  DOCTORS.filter((d) => d.dept === DRAFT.dept).forEach((doc) => {
    const card = el('button', 'vc-doctor-card');
    card.type = 'button';
    const a = el('span', 'avatar', doc.initials);
    const m = el('span', 'd-main');
    m.appendChild(el('strong', null, doc.name));
    m.appendChild(el('small', null, doc.specialty));
    card.append(a, m);
    card.addEventListener('click', () => { DRAFT.doctor = doc.id; DRAFT.doctorName = doc.name; DRAFT.step = 3; renderWizard(); });
    grid.appendChild(card);
  });
  stage.appendChild(grid);
  wizardNav(stage, { back: true, next: { label: 'Skip · first available →', handler: () => { DRAFT.doctor = 'first'; DRAFT.doctorName = 'First available doctor'; DRAFT.step = 3; renderWizard(); } } });
}

function stepDate(stage) {
  const head = el('div', 'vc-step-head');
  head.appendChild(el('h3', null, 'Choose a date'));
  head.appendChild(el('p', null, 'Appointments are available Monday to Saturday.'));
  stage.appendChild(head);
  const row = el('div', 'vc-date-row');
  for (let i = 0; i < 7; i += 1) {
    const iso = dateStr(i);
    const d = new Date(`${iso}T00:00:00`);
    const chip = el('button', 'vc-date-chip');
    chip.type = 'button';
    if (DRAFT.date === iso) chip.classList.add('is-selected');
    chip.appendChild(el('span', 'dow', d.toLocaleDateString('en-KE', { weekday: 'short' })));
    chip.appendChild(el('span', 'dom', String(d.getDate())));
    chip.appendChild(el('span', 'mon', d.toLocaleDateString('en-KE', { month: 'short' })));
    chip.addEventListener('click', () => { DRAFT.date = iso; DRAFT.step = 4; renderWizard(); });
    row.appendChild(chip);
  }
  stage.appendChild(row);
  wizardNav(stage, { back: true });
}

function stepTime(stage) {
  const head = el('div', 'vc-step-head');
  head.appendChild(el('h3', null, `Choose a time · ${dayLabel(DRAFT.date)}`));
  head.appendChild(el('p', null, 'Times marked with a line are already booked.'));
  stage.appendChild(head);
  const grid = el('div', 'vc-slot-grid');
  SLOTS.forEach((t) => {
    const busy = isSlotBusy(DRAFT.date, t);
    const slot = el('button', 'vc-slot', fmtTime(t));
    slot.type = 'button';
    if (busy) slot.classList.add('is-booked');
    if (DRAFT.time === t) slot.classList.add('is-selected');
    if (!busy) slot.addEventListener('click', () => { DRAFT.time = t; DRAFT.step = 5; renderWizard(); });
    grid.appendChild(slot);
  });
  stage.appendChild(grid);
  wizardNav(stage, { back: true });
}

function stepDetails(stage) {
  const head = el('div', 'vc-step-head');
  head.appendChild(el('h3', null, 'Your details'));
  head.appendChild(el('p', null, 'We only need what is necessary for this booking.'));
  stage.appendChild(head);
  const form = el('div', 'vc-form-grid');
  const field = (id, label, type, ph, autocomplete) => {
    const f = el('div', 'vc-field');
    f.appendChild(el('label', null, label));
    const input = el('input');
    input.type = type;
    input.id = id;
    input.placeholder = ph;
    if (autocomplete) input.autocomplete = autocomplete;
    input.value = DRAFT[id] || '';
    input.addEventListener('input', () => { DRAFT[id] = input.value; });
    f.appendChild(input);
    form.appendChild(f);
  };
  field('name', 'Full name *', 'text', 'e.g. Demo Patient', 'name');
  field('phone', 'Phone / WhatsApp *', 'tel', 'e.g. 0712 345 678', 'tel');
  field('email', 'Email (optional)', 'email', 'e.g. you@example.com', 'email');
  stage.appendChild(form);
  wizardNav(stage, {
    back: true,
    next: {
      label: 'Review appointment →',
      handler: () => {
        if (!DRAFT.name.trim() || !DRAFT.phone.trim()) {
          stage.appendChild(el('p', 'form-status', 'Please enter your name and phone number.'));
          return;
        }
        DRAFT.step = 6; renderWizard();
      }
    }
  });
}

function stepReview(stage) {
  const head = el('div', 'vc-step-head');
  head.appendChild(el('h3', null, 'Review your appointment'));
  stage.appendChild(head);
  const review = el('div', 'vc-review');
  const kv = el('div', 'd-kv');
  const row = (k, v) => { const d = el('div'); d.appendChild(el('dt', null, k)); d.appendChild(el('dd', null, v)); kv.appendChild(d); };
  row('Hospital', 'VuvaCare Medical Centre');
  row('Department', dept(DRAFT.dept).name);
  row('Doctor', DRAFT.doctorName);
  row('Date', dayLabel(DRAFT.date));
  row('Time', fmtTime(DRAFT.time));
  row('Patient', DRAFT.name);
  review.appendChild(kv);
  const fee = el('div', 'fee-total');
  fee.appendChild(el('div', null, 'Consultation fee'));
  fee.appendChild(el('strong', null, fmtKsh(dept(DRAFT.dept).fee)));
  review.appendChild(fee);
  stage.appendChild(review);
  wizardNav(stage, { back: true, next: { label: 'Continue to payment →', handler: () => { DRAFT.step = 7; renderWizard(); } } });
}

function stepPayment(stage) {
  const head = el('div', 'vc-step-head');
  head.appendChild(el('h3', null, `Pay consultation fee · ${fmtKsh(dept(DRAFT.dept).fee)}`));
  head.appendChild(el('p', null, 'Choose a payment method. This is a simulated demo payment.'));
  stage.appendChild(head);
  const methods = [['mpesa', '📱', 'M-Pesa'], ['card', '💳', 'Card'], ['bank', '🏦', 'Bank']];
  const grid = el('div', 'vc-pay-methods');
  methods.forEach(([id, icon, label]) => {
    const m = el('button', 'vc-pay-method');
    m.type = 'button';
    if (DRAFT.method === id) m.classList.add('is-selected');
    m.appendChild(el('span', 'm-icon', icon));
    m.appendChild(el('strong', null, label));
    m.addEventListener('click', () => { DRAFT.method = id; [...grid.children].forEach((c) => c.classList.remove('is-selected')); m.classList.add('is-selected'); });
    grid.appendChild(m);
  });
  stage.appendChild(grid);
  stage.appendChild(el('p', 'vc-simulated-pay', 'Demonstration payment only · no real money is processed and no live payment gateway is connected.'));
  wizardNav(stage, {
    back: true,
    next: {
      label: 'Pay & Confirm Appointment',
      handler: () => {
        if (!DRAFT.method) { stage.appendChild(el('p', 'form-status', 'Please choose a payment method.')); return; }
        runPayment();
      }
    }
  });
}

function runPayment() {
  const stage = document.querySelector('[data-booking-stage]');
  stage.innerHTML = '';
  stage.appendChild(el('h3', null, 'Processing payment…'));
  stage.appendChild(el('p', 'muted-note', 'Simulated M-Pesa / card / bank authorisation.'));
  setTimeout(() => confirmBooking(), 1200);
}

function confirmBooking() {
  const stage = document.querySelector('[data-booking-stage]');
  const userCount = bookings.filter((b) => b.isUser).length;
  const ref = `VC-2026-${2000 + userCount + 1}`;
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const booking = {
    ref, code, patient: DRAFT.name, phone: DRAFT.phone, email: DRAFT.email || '',
    dept: DRAFT.dept, doctor: DRAFT.doctorName, date: DRAFT.date, time: DRAFT.time,
    fee: dept(DRAFT.dept).fee, method: DRAFT.method, pay: 'paid', status: 'confirmed', isUser: true
  };
  bookings.push(booking);
  persist();
  renderConfirmation(stage, booking);
}

function renderConfirmation(stage, b) {
  stage.innerHTML = '';
  const wrap = el('div', 'vc-confirm');
  wrap.appendChild(el('div', 'big-check', '✓'));
  wrap.appendChild(el('h2', null, 'Appointment Confirmed'));
  wrap.appendChild(el('p', 'sub', 'Your booking is confirmed. Present your reference and verification code at reception.'));
  wrap.appendChild(el('div', 'code-big', b.code));
  wrap.appendChild(el('div', 'ref-line', `Booking reference · ${b.ref}`));
  const grid = el('div', 'vc-confirm-grid');
  const rows = [
    ['Patient', b.patient], ['Hospital', 'VuvaCare Medical Centre'], ['Department', dept(b.dept).name],
    ['Doctor', b.doctor], ['Date', dayLabel(b.date)], ['Time', fmtTime(b.time)],
    ['Consultation', fmtKsh(b.fee)], ['Status', 'Confirmed']
  ];
  rows.forEach(([k, v]) => { const d = el('div'); d.appendChild(el('dt', null, k)); d.appendChild(el('dd', null, v)); grid.appendChild(d); });
  wrap.appendChild(grid);
  const nav = el('div', 'vc-wizard-nav');
  const view = el('button', 'button button-accent', 'View my appointments →');
  view.type = 'button';
  view.addEventListener('click', () => { showPanel('p-appointments'); setMode('patient'); });
  const again = el('button', 'button button-quiet', 'Book another');
  again.type = 'button';
  again.addEventListener('click', () => { Object.assign(DRAFT, { dept: null, doctor: null, doctorName: null, date: null, time: null, name: '', phone: '', email: '', method: null, step: 1 }); renderWizard(); });
  nav.append(view, again);
  wrap.appendChild(nav);
  stage.appendChild(wrap);
  renderAll();
}

/* ============================================================ *
 *  RENDERERS
 * ============================================================ */
function renderAll() {
  renderHome();
  renderPatientPortal();
  renderHospital();
  renderReception();
}

function renderHome() {
  const depts = document.querySelector('[data-render="home-depts"]');
  if (depts) {
    depts.innerHTML = '';
    DEPARTMENTS.forEach((d) => {
      const card = el('div', 'd-card');
      const head = el('div', 'd-card-head');
      head.appendChild(el('h3', null, `${d.icon} ${d.name}`));
      head.appendChild(el('span', 'd-hint', fmtKsh(d.fee)));
      card.appendChild(head);
      const body = el('div', 'd-card-body');
      body.appendChild(el('p', null, d.desc));
      const cta = el('button', 'button button-accent', 'Book this department');
      cta.type = 'button';
      cta.addEventListener('click', () => { DRAFT.dept = d.id; DRAFT.step = 2; setMode('patient'); showPanel('p-book'); renderWizard(); });
      body.appendChild(cta);
      card.appendChild(body);
      depts.appendChild(card);
    });
  }
  const doctors = document.querySelector('[data-render="home-doctors"]');
  if (doctors) {
    doctors.innerHTML = '';
    DOCTORS.forEach((doc) => {
      const card = el('div', 'vc-doctor-card');
      card.style.cursor = 'default';
      card.appendChild(el('span', 'avatar', doc.initials));
      const m = el('span', 'd-main');
      m.appendChild(el('strong', null, doc.name));
      m.appendChild(el('small', null, doc.specialty));
      card.appendChild(m);
      doctors.appendChild(card);
    });
  }
}

function renderPatientPortal() {
  const mine = bookings.filter((b) => b.isUser);
  const upcoming = mine.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const history = bookings.filter((b) => b.status === 'completed');
  const upEl = document.querySelector('[data-render="appointments"]');
  const histEl = document.querySelector('[data-render="history"]');
  const payEl = document.querySelector('[data-render="p-payments"]');

  if (upEl) {
    upEl.innerHTML = '';
    if (!upcoming.length) {
      upEl.appendChild(el('p', 'vc-empty', 'No upcoming appointments yet. Book one to see it here.'));
    } else {
      const list = el('div', 'vc-appt-list');
      upcoming.forEach((b) => list.appendChild(apptCard(b)));
      upEl.appendChild(list);
    }
  }
  if (histEl) {
    histEl.innerHTML = '';
    if (!history.length) histEl.appendChild(el('p', 'vc-empty', 'No completed appointments yet.'));
    else { const list = el('div', 'vc-appt-list'); history.forEach((b) => list.appendChild(apptCard(b))); histEl.appendChild(list); }
  }
  if (payEl) {
    payEl.innerHTML = '';
    const paid = mine.filter((b) => b.pay === 'paid');
    if (!paid.length) payEl.appendChild(el('p', 'vc-empty', 'No payments yet.'));
    else {
      const list = el('div', 'vc-appt-list');
      paid.forEach((b) => {
        const c = el('div', 'vc-appt-card');
        const d = el('div', 'a-date'); d.appendChild(el('strong', null, fmtKsh(b.fee)));
        d.appendChild(el('span', null, b.method));
        const m = el('div', 'a-main');
        m.appendChild(el('strong', null, `${dept(b.dept).name} · ${b.doctor}`));
        m.appendChild(el('small', null, `${dayLabel(b.date)} · ${fmtTime(b.time)}`));
        m.appendChild(el('span', 'a-code', `Ref ${b.ref} · Paid`));
        c.append(d, m, badge('Paid', 'ok'));
        list.appendChild(c);
      });
      payEl.appendChild(list);
    }
  }
}

function apptCard(b) {
  const c = el('div', 'vc-appt-card');
  const d = el('div', 'a-date');
  d.appendChild(el('strong', null, b.time));
  d.appendChild(el('span', null, fmtDate(b.date)));
  const m = el('div', 'a-main');
  m.appendChild(el('strong', null, `${dept(b.dept).name} · ${b.doctor}`));
  m.appendChild(el('small', null, `VuvaCare Medical Centre · ${dayLabel(b.date)}`));
  m.appendChild(el('div', 'a-code', `Ref ${b.ref} · Code ${b.code}`));
  c.append(d, m, badge(STATUS_LABEL[b.status], STATUS_BADGE[b.status]));
  return c;
}

function renderHospital() {
  renderDashboard();
  renderAppointmentsTable();
  renderQueues();
  renderDoctors();
  renderDepartments();
  renderPayments();
  renderAnalytics();
  renderNotifications();
}

function renderDashboard() {
  const stats = document.querySelector('[data-render="h-stats"]');
  if (!stats) return;
  const today = dateStr(0);
  const t = bookings.filter((b) => b.date === today && b.status !== 'cancelled');
  const waiting = bookings.filter((b) => ['waiting', 'called', 'in_consultation'].includes(b.status)).length;
  const revenue = bookings.filter((b) => b.pay === 'paid').reduce((s, b) => s + b.fee, 0);
  const cards = [
    ['Appointments today', t.length, 'booked'],
    ['Confirmed', t.filter((b) => b.status === 'confirmed').length, 'paid & waiting'],
    ['In progress', t.filter((b) => ['checked_in', 'waiting', 'called', 'in_consultation'].includes(b.status)).length, 'being served'],
    ['Completed', t.filter((b) => b.status === 'completed').length, 'done today'],
    ['Patients waiting', waiting, 'across queues'],
    ['Revenue today', fmtKsh(t.filter((b) => b.pay === 'paid').reduce((s, b) => s + b.fee, 0)), 'collected'],
    ['Departments active', DEPARTMENTS.length, 'live'],
    ['All-time revenue', fmtKsh(revenue), 'demo data']
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

function renderAppointmentsTable() {
  const body = document.querySelector('[data-render="h-appointments"]');
  if (!body) return;
  const fDept = document.querySelector('[data-filter="dept"]');
  const fDoctor = document.querySelector('[data-filter="doctor"]');
  const fStatus = document.querySelector('[data-filter="status"]');
  const rows = bookings.filter((b) => {
    if (fDept && fDept.value && b.dept !== fDept.value) return false;
    if (fDoctor && fDoctor.value && b.doctor !== fDoctor.value) return false;
    if (fStatus && fStatus.value && b.status !== fStatus.value) return false;
    return true;
  }).sort((a, b2) => (a.date + a.time).localeCompare(b2.date + b2.time));
  body.innerHTML = '';
  if (!rows.length) { body.appendChild(el('p', 'vc-empty', 'No appointments match the current filters.')); return; }
  const table = el('table', 'd-table');
  const thead = el('thead');
  const tr = el('tr');
  ['Date', 'Time', 'Patient', 'Doctor', 'Department', 'Status', 'Payment'].forEach((h) => tr.appendChild(el('th', null, h)));
  thead.appendChild(tr); table.appendChild(thead);
  const tbody = el('tbody');
  rows.forEach((b) => {
    const r = el('tr');
    r.appendChild(el('td', 'num', dayLabel(b.date)));
    r.appendChild(el('td', 'num', fmtTime(b.time)));
    r.appendChild(el('td', 'strong', b.patient));
    r.appendChild(el('td', 'muted', b.doctor));
    r.appendChild(el('td', 'muted', dept(b.dept).name));
    r.appendChild(el('td', null)).appendChild(badge(STATUS_LABEL[b.status], STATUS_BADGE[b.status]));
    r.appendChild(el('td', null)).appendChild(badge(b.pay === 'paid' ? 'Paid' : 'Pending', b.pay === 'paid' ? 'ok' : 'warn'));
    tbody.appendChild(r);
  });
  table.appendChild(tbody);
  body.appendChild(table);
}

function renderQueues() {
  const wrap = document.querySelector('[data-render="h-queues"]');
  if (!wrap) return;
  wrap.innerHTML = '';
  const active = bookings.filter((b) => ['waiting', 'called', 'in_consultation'].includes(b.status));
  const depts = [...new Set(active.map((b) => b.dept))];
  if (!depts.length) { wrap.appendChild(el('p', 'vc-empty', 'No patients in queue. Check someone in at Reception.')); return; }
  depts.forEach((deptId) => {
    const q = active.filter((b) => b.dept === deptId);
    const card = el('div', 'd-card vc-queue-card');
    const head = el('div', 'd-card-head');
    head.appendChild(el('h3', null, `${dept(deptId).name} queue`));
    head.appendChild(el('span', 'd-hint', `${q.length} waiting · est. ${Math.max(5, q.length * 6)} min`));
    card.appendChild(head);
    const body = el('div', 'd-card-body tight');
    const list = el('div');
    q.forEach((b, i) => {
      const row = el('div', 'vc-queue-row');
      row.appendChild(el('span', 'q-pos', `#${i + 1}`));
      const m = el('div', 'q-main');
      m.appendChild(el('strong', null, b.patient));
      m.appendChild(el('small', null, `${b.ref} · ${fmtTime(b.time)}`));
      row.appendChild(m);
      row.appendChild(badge(STATUS_LABEL[b.status], STATUS_BADGE[b.status]));
      const actions = el('div', 'd-toolbar');
      if (b.status === 'waiting') actions.appendChild(actionBtn('Call', () => { b.status = 'called'; persist(); renderAll(); }));
      if (b.status === 'called') actions.appendChild(actionBtn('Start consult', () => { b.status = 'in_consultation'; persist(); renderAll(); }));
      if (b.status === 'in_consultation') actions.appendChild(actionBtn('Complete', () => { b.status = 'completed'; persist(); renderAll(); }));
      row.appendChild(actions);
      list.appendChild(row);
    });
    body.appendChild(list);
    card.appendChild(body);
    wrap.appendChild(card);
  });
}

function actionBtn(label, fn) {
  const b = el('button', 'chip', label);
  b.type = 'button';
  b.addEventListener('click', fn);
  return b;
}

function renderDoctors() {
  const wrap = document.querySelector('[data-render="h-doctors"]');
  if (!wrap) return;
  wrap.innerHTML = '';
  const today = dateStr(0);
  DOCTORS.forEach((doc) => {
    const list = bookings.filter((b) => b.doctor === doc.name && b.date === today && b.status !== 'cancelled').sort((a, b2) => a.time.localeCompare(b2.time));
    const card = el('div', 'd-card');
    const head = el('div', 'd-card-head');
    const t = el('div');
    t.appendChild(el('h3', null, doc.name));
    t.appendChild(el('span', 'd-hint', doc.specialty));
    head.appendChild(t);
    head.appendChild(el('span', 'd-hint', `${list.length} today`));
    card.appendChild(head);
    const body = el('div', 'd-card-body tight');
    const sched = el('div', 'vc-schedule');
    if (!list.length) sched.appendChild(el('p', 'vc-empty', 'No appointments scheduled.'));
    list.forEach((b) => {
      const item = el('div', 'vc-sched-item');
      item.appendChild(el('span', 's-time', fmtTime(b.time)));
      const m = el('div', 's-main');
      m.appendChild(el('strong', null, b.patient));
      m.appendChild(el('small', null, dept(b.dept).name));
      item.appendChild(m);
      item.appendChild(badge(STATUS_LABEL[b.status], STATUS_BADGE[b.status]));
      sched.appendChild(item);
    });
    body.appendChild(sched);
    card.appendChild(body);
    wrap.appendChild(card);
  });
}

function renderDepartments() {
  const wrap = document.querySelector('[data-render="h-departments"]');
  if (!wrap) return;
  wrap.innerHTML = '';
  const grid = el('div', 'd-grid thirds');
  DEPARTMENTS.forEach((d) => {
    const docs = DOCTORS.filter((x) => x.dept === d.id).length;
    const today = bookings.filter((b) => b.dept === d.id && b.date === dateStr(0) && b.status !== 'cancelled').length;
    const inQueue = bookings.filter((b) => b.dept === d.id && ['waiting', 'called', 'in_consultation'].includes(b.status)).length;
    const revenue = bookings.filter((b) => b.dept === d.id && b.pay === 'paid').reduce((s, b) => s + b.fee, 0);
    const card = el('div', 'd-card');
    const head = el('div', 'd-card-head');
    head.appendChild(el('h3', null, `${d.icon} ${d.name}`));
    head.appendChild(el('span', 'd-hint', fmtKsh(d.fee)));
    card.appendChild(head);
    const body = el('div', 'd-card-body');
    const kv = el('div', 'd-kv');
    const r = (k, v) => { const x = el('div'); x.appendChild(el('dt', null, k)); x.appendChild(el('dd', null, v)); kv.appendChild(x); };
    r('Doctors', docs);
    r('Appointments today', today);
    r('In queue', inQueue);
    r('Revenue', fmtKsh(revenue));
    body.appendChild(kv);
    card.appendChild(body);
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
}

function renderPayments() {
  const wrap = document.querySelector('[data-render="h-payments"]');
  if (!wrap) return;
  wrap.innerHTML = '';
  const paid = bookings.filter((b) => b.pay === 'paid');
  const revenue = paid.reduce((s, b) => s + b.fee, 0);
  const byMethod = { mpesa: 0, card: 0, bank: 0 };
  paid.forEach((b) => { byMethod[b.method] = (byMethod[b.method] || 0) + b.fee; });
  const stats = el('div', 'd-stats');
  const s = (l, v, sub) => { const d = el('div', 'd-stat'); d.appendChild(el('span', 'd-label', l)); d.appendChild(el('span', 'd-value', v)); d.appendChild(el('span', 'd-delta flat', sub)); stats.appendChild(d); };
  s('Total revenue', fmtKsh(revenue), 'demo data');
  s('M-Pesa', fmtKsh(byMethod.mpesa), 'collected');
  s('Card', fmtKsh(byMethod.card), 'collected');
  s('Bank', fmtKsh(byMethod.bank), 'collected');
  wrap.appendChild(stats);
  const table = el('table', 'd-table');
  const thead = el('thead'); const tr = el('tr');
  ['Reference', 'Patient', 'Department', 'Fee', 'Method', 'Status'].forEach((h) => tr.appendChild(el('th', null, h)));
  thead.appendChild(tr); table.appendChild(thead);
  const tbody = el('tbody');
  paid.slice().reverse().slice(0, 12).forEach((b) => {
    const r = el('tr');
    r.appendChild(el('td', 'num strong', b.ref));
    r.appendChild(el('td', 'strong', b.patient));
    r.appendChild(el('td', 'muted', dept(b.dept).name));
    r.appendChild(el('td', 'num', fmtKsh(b.fee)));
    r.appendChild(el('td', 'muted', b.method.toUpperCase()));
    r.appendChild(el('td', null)).appendChild(badge('Paid', 'ok'));
    tbody.appendChild(r);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
}

function renderAnalytics() {
  const wrap = document.querySelector('[data-render="h-analytics"]');
  if (!wrap) return;
  wrap.innerHTML = '';
  const days = [0, 1, 2, 3, 4, 5, 6];
  const perDay = days.map((off) => bookings.filter((b) => b.date === dateStr(off) && b.status !== 'cancelled').length);
  const max = Math.max(1, ...perDay);
  const grid = el('div', 'd-grid');
  const c1 = el('div', 'd-card');
  c1.appendChild(el('div', 'd-card-head', 'Appointments per day (next 7 days)'));
  const b1 = el('div', 'd-card-body');
  const svg1 = el('svg', 'd-chart');
  svg1.setAttribute('viewBox', '0 0 400 160');
  svg1.setAttribute('preserveAspectRatio', 'none');
  let bars = '';
  days.forEach((off, i) => {
    const h = Math.round((perDay[i] / max) * 120);
    const x = 15 + i * 55;
    bars += `<rect x="${x}" y="${140 - h}" width="40" height="${h}" fill="${i === 0 ? '#40dca9' : '#087957'}"/>`;
  });
  svg1.innerHTML = bars;
  b1.appendChild(svg1); c1.appendChild(b1); grid.appendChild(c1);
  const c2 = el('div', 'd-card');
  c2.appendChild(el('div', 'd-card-head', 'Revenue by department'));
  const b2 = el('div', 'd-card-body');
  const revByDept = DEPARTMENTS.map((d) => ({ name: d.name, total: bookings.filter((x) => x.dept === d.id && x.pay === 'paid').reduce((s, x) => s + x.fee, 0) }));
  const maxRev = Math.max(1, ...revByDept.map((r) => r.total));
  const svg2 = el('svg', 'd-chart');
  svg2.setAttribute('viewBox', '0 0 400 200');
  revByDept.forEach((r, i) => {
    const w = Math.round((r.total / maxRev) * 260);
    const y = 15 + i * 24;
    svg2.innerHTML += `<rect x="8" y="${y}" width="${Math.max(6, w)}" height="16" fill="#40dca9" opacity="0.85"/><text x="${w + 18}" y="${y + 12}" font-size="10" fill="#5d6965">${r.name} · ${fmtKsh(r.total)}</text>`;
  });
  b2.appendChild(svg2); c2.appendChild(b2); grid.appendChild(c2);
  wrap.appendChild(grid);
  const reset = el('button', 'button button-quiet', 'Reset demo data');
  reset.type = 'button';
  reset.addEventListener('click', () => { resetDemo(); DRAFT.step = 1; renderAll(); });
  wrap.appendChild(reset);
}

function renderNotifications() {
  const wrap = document.querySelector('[data-render="h-notifications"]');
  if (!wrap) return;
  wrap.innerHTML = '';
  const items = [
    ['✅', 'Appointment confirmed', 'Your VuvaCare appointment is confirmed for 10:30 AM.', 'just now'],
    ['🔔', 'Appointment reminder', 'Reminder: you have a cardiology appointment tomorrow at 10:30 AM.', '1h ago'],
    ['🕒', 'Queue update', 'You are number 2 in the cardiology queue.', '2h ago'],
    ['✓', 'Appointment completed', 'Your appointment has been completed. Thank you for visiting.', 'Yesterday']
  ];
  const feed = el('div', 'd-card');
  feed.appendChild(el('div', 'd-card-head', 'Automated notifications (simulated)'));
  const body = el('div', 'd-card-body tight pad-feed');
  const list = el('div');
  items.forEach(([icon, title, msg, time]) => {
    const n = el('div', 'vc-notif');
    n.appendChild(el('span', 'n-icon', icon));
    const m = el('div', 'n-main');
    m.appendChild(el('strong', null, title));
    m.appendChild(el('p', null, msg));
    m.appendChild(el('small', null, time));
    n.appendChild(m);
    list.appendChild(n);
  });
  body.appendChild(list);
  feed.appendChild(body);
  wrap.appendChild(feed);
}

function renderReception() {
  const result = document.querySelector('[data-render="h-reception-result"]');
  if (result) result.innerHTML = '';
}

function receptionLookup(query) {
  const result = document.querySelector('[data-render="h-reception-result"]');
  if (!result) return;
  const q = query.trim().toUpperCase();
  if (!q) { result.innerHTML = ''; return; }
  const b = bookings.find((x) => x.ref.toUpperCase() === q || x.code === q);
  result.innerHTML = '';
  if (!b) {
    const c = el('div', 'vc-result notfound');
    const head = el('div', 'r-head');
    head.appendChild(el('span', 'r-flag', '✕'));
    head.appendChild(el('strong', null, 'No appointment found'));
    c.appendChild(head);
    c.appendChild(el('p', 'muted-note', `No booking matches “${query}”. Check the reference or verification code and try again.`));
    result.appendChild(c);
    return;
  }
  const c = el('div', 'vc-result found');
  const head = el('div', 'r-head');
  head.appendChild(el('span', 'r-flag', '✓'));
  head.appendChild(el('strong', null, 'Appointment Found'));
  c.appendChild(head);
  const kv = el('div', 'd-kv');
  const r = (k, v) => { const x = el('div'); x.appendChild(el('dt', null, k)); x.appendChild(el('dd', null, v)); kv.appendChild(x); };
  r('Patient', b.patient);
  r('Doctor', b.doctor);
  r('Department', dept(b.dept).name);
  r('Appointment', `${dayLabel(b.date)} · ${fmtTime(b.time)}`);
  r('Payment', b.pay === 'paid' ? 'Paid' : 'Pending');
  r('Status', STATUS_LABEL[b.status]);
  c.appendChild(kv);
  const actions = el('div', 'head-actions mt');
  if (b.status === 'confirmed') {
    actions.appendChild(actionBtn('Check In Patient', () => { b.status = 'checked_in'; persist(); renderAll(); receptionLookup(q); }));
  } else if (b.status === 'checked_in') {
    actions.appendChild(actionBtn('Add to queue →', () => { b.status = 'waiting'; persist(); renderAll(); receptionLookup(q); }));
  } else if (b.status === 'waiting') {
    actions.appendChild(el('span', 'badge is-warn', 'In queue · see Queues'));
  } else if (['called', 'in_consultation'].includes(b.status)) {
    actions.appendChild(el('span', 'badge is-warn', STATUS_LABEL[b.status]));
  } else if (b.status === 'completed') {
    actions.appendChild(el('span', 'badge is-ok', 'Completed'));
  }
  c.appendChild(actions);
  result.appendChild(c);
}

/* ============================================================ *
 *  MODE + NAV
 * ============================================================ */
let currentMode = 'patient';

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('[data-vc-mode]').forEach((btn) => {
    btn.setAttribute('aria-selected', String(btn.dataset.vcMode === mode));
  });
  document.getElementById('vc-nav-patient').classList.toggle('hidden', mode !== 'patient');
  document.getElementById('vc-nav-hospital').classList.toggle('hidden', mode !== 'hospital');
  const first = mode === 'patient' ? 'p-home' : 'h-dashboard';
  showPanel(first);
}

function showPanel(id) {
  document.querySelectorAll('.demo-panel').forEach((p) => p.classList.remove('is-active'));
  const panel = document.getElementById(id);
  if (panel) panel.classList.add('is-active');
  document.querySelectorAll('[data-vc-nav]').forEach((b) => {
    if (b.dataset.vcNav === id) b.setAttribute('aria-current', 'true');
    else b.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================ *
 *  AI ASSISTANT (service & appointment assistant · never diagnoses)
 * ============================================================ */
function deptFromText(text) {
  const map = {
    heart: 'cardiology', cardio: 'cardiology', cardiologist: 'cardiology',
    child: 'pediatrics', pediatric: 'pediatrics', baby: 'pediatrics', 'paed': 'pediatrics',
    tooth: 'dental', teeth: 'dental', dentist: 'dental',
    skin: 'dermatology', derma: 'dermatology',
    pregnant: 'maternity', matern: 'maternity', antenatal: 'maternity',
    lab: 'laboratory', test: 'laboratory', laboratory: 'laboratory',
    emergency: 'emergency', urgent: 'emergency',
    general: 'general', 'gp': 'general', 'check.up': 'general', medicine: 'general'
  };
  for (const [key, val] of Object.entries(map)) {
    if (text.toLowerCase().includes(key)) return val;
  }
  return null;
}

function aiAnswer(text) {
  const t = text.toLowerCase();
  const d = deptFromText(text);
  const feeQ = /how much|fee|cost|price|charge/i.test(t);
  const bookQ = /book|see|appointment|available|slot|schedule|want/i.test(t);

  if (d && feeQ) {
    const de = dept(d);
    return `A ${de.name} consultation at VuvaCare Medical Centre is ${fmtKsh(de.fee)}.`;
  }
  if (d && bookQ) {
    const tomorrow = dateStr(1);
    const free = SLOTS.filter((s) => !isSlotBusy(tomorrow, s)).slice(0, 4);
    const list = free.map((s) => fmtTime(s)).join(', ');
    return `Here are available ${dept(d).name} appointments tomorrow: ${list}. Tap one to book it.`;
  }
  if (d) {
    const de = dept(d);
    return `${de.icon} ${de.name} · ${de.desc} Consultation fee ${fmtKsh(de.fee)}.`;
  }
  if (/doctor|who|specialist/i.test(t)) {
    return `Our specialists include Dr. Jane Mwangi (Cardiology), Dr. Brian Otieno (General Medicine), Dr. Sarah Kamau (Pediatrics), Dr. David Kiprono (Dental), Dr. Achieng Odhiambo (Maternity) and Dr. Njeri Wambui (Dermatology).`;
  }
  if (/which department|what department|department should|where should/i.test(t)) {
    return `It depends on your need · General Medicine for everyday illness, Cardiology for heart concerns, Pediatrics for children, Dental for teeth, Maternity for pregnancy care, Dermatology for skin, or Laboratory for tests. I can help you book any of them.`;
  }
  if (/where is|location|address|directions/i.test(t)) {
    return `VuvaCare Medical Centre is on Hospital Road, Nairobi (demo address). The Dental department is on the ground floor, Cardiology on the first floor.`;
  }
  if (/my appointment|what time|my booking|my code/i.test(t)) {
    const mine = bookings.filter((b) => b.isUser).slice(-1)[0];
    if (mine) return `Your next appointment is ${dept(mine.dept).name} on ${dayLabel(mine.date)} at ${fmtTime(mine.time)}. Ref ${mine.ref}, code ${mine.code}.`;
    return `I don't see an appointment for you yet · you can book one in a few taps.`;
  }
  if (/hello|hi|hey/i.test(t)) {
    return `Hello! I'm VuvaCare AI, your service and appointment assistant. I can help you choose a department, find doctors, check fees and book an appointment. I don't diagnose conditions · I just help you find the right care.`;
  }
  return `I can help you find the right department, see doctors and fees, and book an appointment. Try “book a cardiologist”, “how much is a dental consultation?” or “which department should I choose?”. I don't diagnose conditions.`;
}

function initAI() {
  const fabs = document.querySelectorAll('[data-ai-open]');
  const modal = document.querySelector('[data-ai-modal]');
  const close = document.querySelector('[data-ai-close]');
  const body = document.querySelector('[data-ai-body]');
  const input = document.querySelector('[data-ai-input]');
  const send = document.querySelector('[data-ai-send]');
  const suggest = document.querySelector('[data-ai-suggest]');
  if (!fabs.length || !modal || !body) return;

  const open = () => { modal.classList.add('is-open'); if (!body.children.length) greet(); input.focus(); };
  const closeModal = () => modal.classList.remove('is-open');
  fabs.forEach((fab) => fab.addEventListener('click', open));
  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  const push = (kind, text) => { const m = el('div', `m ${kind}`); m.textContent = text; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; };
  const answer = (text, extra) => {
    const typing = push('agent', '…');
    setTimeout(() => { typing.remove(); const m = push('agent', text); if (extra) extra(m); }, 500 + Math.random() * 300);
  };

  const slotChips = (wrap, deptId) => {
    const tomorrow = dateStr(1);
    const row = el('div', 'ai-quick');
    SLOTS.filter((s) => !isSlotBusy(tomorrow, s)).slice(0, 4).forEach((s) => {
      const c = el('button', 'chip is-dark', fmtTime(s));
      c.type = 'button';
      c.addEventListener('click', () => {
        DRAFT.dept = deptId; DRAFT.doctor = 'first'; DRAFT.doctorName = 'First available doctor';
        DRAFT.date = tomorrow; DRAFT.time = s; DRAFT.step = 5;
        closeModal(); setMode('patient'); showPanel('p-book'); renderWizard();
      });
      row.appendChild(c);
    });
    wrap.appendChild(row);
  };

  const greet = () => {
    push('agent', `Hi, I'm VuvaCare AI · your service and appointment assistant. I can help you choose a department, see fees, and book an appointment. I don't diagnose conditions.`);
  };

  const submit = () => {
    const value = input.value.trim();
    if (!value) return;
    push('user', value);
    input.value = '';
    const d = deptFromText(value);
    const bookQ = /book|see|appointment|available|slot|schedule|want/i.test(value);
    if (d && bookQ) {
      answer(`Here are available ${dept(d).name} slots for tomorrow · tap one to book:`, (m) => slotChips(m, d));
    } else {
      answer(aiAnswer(value));
    }
  };
  send.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });

  const suggestions = ['Book a cardiologist', 'How much is a dental consultation?', 'Which department should I choose?', 'What doctors are available?'];
  suggestions.forEach((s) => {
    const chip = el('button', 'chip is-dark', s);
    chip.type = 'button';
    chip.addEventListener('click', () => { push('user', s); const d = deptFromText(s); const bookQ = /book|see/i.test(s); if (d && bookQ) { answer(`Here are available ${dept(d).name} slots for tomorrow · tap one to book:`, (m) => slotChips(m, d)); } else { answer(aiAnswer(s)); } });
    suggest.appendChild(chip);
  });
}

/* ============================================================ */
function initClock() {
  const clock = document.querySelector('[data-demo-clock]');
  const tick = () => { if (clock) clock.textContent = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }); };
  tick(); setInterval(tick, 30000);
}

function init() {
  // nav
  document.querySelectorAll('[data-vc-nav]').forEach((btn) => {
    btn.addEventListener('click', () => showPanel(btn.dataset.vcNav));
  });
  document.querySelectorAll('[data-vc-mode]').forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.dataset.vcMode));
  });
  // filters
  ['dept', 'doctor', 'status'].forEach((key) => {
    const sel = document.querySelector(`[data-filter="${key}"]`);
    sel?.addEventListener('change', renderAppointmentsTable);
  });
  // reception
  const rInput = document.querySelector('[data-reception-input]');
  const rGo = document.querySelector('[data-reception-go]');
  rGo?.addEventListener('click', () => receptionLookup(rInput.value));
  rInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') receptionLookup(rInput.value); });

  initClock();
  initAI();
  setMode('patient');
  renderWizard();
  renderAll();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
