// Vuva AI · public business consultant, solutions architect & requirements analyst.
// Client-side (no backend): guides a visitor through an industry-aware consultation,
// analyses their answers, recommends a system and generates an ESTIMATED quotation
// using the centralized pricing config (./pricing.js). Never presents a binding quote.
import { pricing, estimate, formatRange } from './pricing.js';

const INDUSTRIES = {
  logistics: {
    label: 'Logistics & Transportation', icon: '🚚',
    intro: 'Logistics operations live or die on visibility and coordination.',
    askWhat: 'Tell me about your operation. How big is your fleet, what do you move, and where do things get stuck?',
    pain: ['Tracking & visibility', 'Dispatch & routing', 'Driver communication', 'Manual paperwork', 'Customer updates', 'Fleet / warehouse coordination'],
    automate: ['Shipment tracking', 'Dispatch & routing', 'Customer notifications', 'Driver app / GPS', 'Quotation & intake'],
    core: 'Logistics Operations Platform',
    platform: 'A logistics operations platform spanning dispatch, tracking, drivers and a customer portal.',
    future: ['Automated customs & clearing workflows', 'Route optimisation', 'Fleet maintenance scheduling', 'Proof-of-delivery imaging'],
    recommend: ['operations_dashboard', 'customer_portal', 'live_tracking', 'whatsapp', 'notifications', 'analytics', 'ai_assistant'],
    optional: ['ai_automation', 'payments_mpesa', 'multi_branch', 'mobile_app', 'api_integrations'],
    opportunities: {
      'Tracking & visibility': 'Centralized shipment and fleet visibility with live status.',
      'Dispatch & routing': 'Structured dispatch with route and driver assignment.',
      'Driver communication': 'Automated driver updates over WhatsApp/SMS.',
      'Manual paperwork': 'Digital capture that removes repetitive manual entry.',
      'Customer updates': 'Automated customer tracking notifications.',
      'Fleet / warehouse coordination': 'Unified fleet, warehouse and branch view.'
    }
  },
  healthcare: {
    label: 'Healthcare', icon: '🏥',
    intro: 'Healthcare systems need clear workflows and careful data handling.',
    askWhat: 'What kind of facility is it, a clinic, a pharmacy or a bigger practice? And how do you handle patients today?',
    pain: ['Appointments & scheduling', 'Patient records', 'Queue management', 'Billing & payments', 'Pharmacy workflows', 'Doctor / staff coordination'],
    automate: ['Appointment booking & reminders', 'Patient queue', 'Billing & payments', 'Patient communication', 'Reports & analytics'],
    core: 'Hospital Operations Platform',
    platform: 'A facility operations platform covering patients, appointments, queues, billing and pharmacy.',
    future: ['Telemedicine / video consultations', 'Lab & diagnostics integration', 'Insurance & NHIF workflows', 'Patient health portal'],
    recommend: ['operations_dashboard', 'customer_portal', 'ai_assistant', 'whatsapp', 'notifications', 'analytics'],
    optional: ['payments_mpesa', 'payments_card', 'ai_automation', 'enterprise', 'mobile_app'],
    opportunities: {
      'Appointments & scheduling': 'Online booking with automated confirmations and reminders.',
      'Patient records': 'Structured, secure patient and visit records.',
      'Queue management': 'Live queue visibility and patient flow control.',
      'Billing & payments': 'Digital billing, receipts and payment collection.',
      'Pharmacy workflows': 'Stock, dispensing and reorder workflows.',
      'Doctor / staff coordination': 'Shared schedules and handoff visibility.'
    }
  },
  realestate: {
    label: 'Real Estate', icon: '🏙️',
    intro: 'Property operations run on leases, rent and maintenance.',
    askWhat: 'Do you manage rentals, sales or both? And how are tenants and payments handled today?',
    pain: ['Tenant & lease management', 'Rent collection', 'Maintenance requests', 'Viewing bookings', 'Property listings', 'Document workflows'],
    automate: ['Tenant portal & rent collection', 'Maintenance ticketing', 'Viewing scheduling', 'Listing & lead management', 'Automated reminders'],
    core: 'Property Management Platform',
    platform: 'A property operations platform with tenants, rent, maintenance and viewings.',
    future: ['Owner / investor reporting', 'Automated lease renewals', 'Expense & utilities tracking', 'Property valuation analytics'],
    recommend: ['operations_dashboard', 'customer_portal', 'whatsapp', 'notifications', 'analytics', 'ai_assistant'],
    optional: ['payments_mpesa', 'live_tracking', 'ai_automation', 'multi_branch', 'custom_workflow'],
    opportunities: {
      'Tenant & lease management': 'Centralized tenants, units and lease records.',
      'Rent collection': 'Rent schedules with automated reminders and payments.',
      'Maintenance requests': 'Tenant service requests with tracking and status.',
      'Viewing bookings': 'Online viewing scheduling and follow-ups.',
      'Property listings': 'Listings with enquiry capture.',
      'Document workflows': 'Lease and document storage with access control.'
    }
  },
  hospitality: {
    label: 'Hospitality & Restaurants', icon: '🍽️',
    intro: 'Restaurants and kitchens live on speed between order and delivery.',
    askWhat: 'Do you serve walk in customers, deliveries or several branches? How does an order get from the customer to the kitchen to the rider?',
    pain: ['Order taking', 'Kitchen coordination', 'Delivery dispatch', 'Rider tracking', 'Branch management', 'Customer communication'],
    automate: ['Online ordering', 'Kitchen display', 'Delivery dispatch & tracking', 'Customer notifications', 'Branch reporting'],
    core: 'Restaurant & Delivery Platform',
    platform: 'A restaurant and delivery platform spanning order, kitchen, dispatch and branch.',
    future: ['Loyalty & repeat-customer programs', 'Table / reservation management', 'Supplier & ingredient stock', 'Menu performance analytics'],
    recommend: ['operations_dashboard', 'customer_portal', 'whatsapp', 'payments_mpesa', 'live_tracking', 'analytics', 'multi_branch'],
    optional: ['ai_assistant', 'ai_automation', 'payments_card', 'mobile_app', 'notifications'],
    opportunities: {
      'Order taking': 'Digital ordering that removes manual entry.',
      'Kitchen coordination': 'Kitchen display and preparation status.',
      'Delivery dispatch': 'Dispatch and rider assignment.',
      'Rider tracking': 'Live rider and delivery tracking for customers.',
      'Branch management': 'Multi-branch orders, menus and reporting.',
      'Customer communication': 'Automated order and delivery updates.'
    }
  },
  retail: {
    label: 'Retail & Distribution', icon: '🏬',
    intro: 'Retail operations span stock, orders and multiple channels.',
    askWhat: 'Do you sell in stores, online or both? How do you keep track of stock and sales today?',
    pain: ['Inventory tracking', 'Branch / warehouse coordination', 'Orders & fulfilment', 'Supplier management', 'Sales reporting', 'Customer service'],
    automate: ['Inventory & reorder alerts', 'Order management', 'Multi-branch reporting', 'Customer notifications', 'Sales analytics'],
    core: 'Commerce & Inventory Platform',
    platform: 'A commerce operations platform with inventory, orders and multi-branch reporting.',
    future: ['E-commerce storefront', 'Loyalty & promotions', 'Demand forecasting', 'B2B wholesale portal'],
    recommend: ['operations_dashboard', 'analytics', 'multi_branch', 'whatsapp', 'customer_portal'],
    optional: ['payments_mpesa', 'payments_card', 'ai_automation', 'api_integrations', 'mobile_app'],
    opportunities: {
      'Inventory tracking': 'Live inventory across branches and warehouses.',
      'Branch / warehouse coordination': 'Unified stock movement and transfers.',
      'Orders & fulfilment': 'Order management through to delivery.',
      'Supplier management': 'Supplier records and purchase workflows.',
      'Sales reporting': 'Sales and performance dashboards.',
      'Customer service': 'Faster resolution via integrated history.'
    }
  },
  professional: {
    label: 'Professional Services', icon: '💼',
    intro: 'Professional firms run on clients, appointments and documents.',
    askWhat: 'What service does the firm provide, and how do leads and appointments flow today?',
    pain: ['Lead intake', 'Appointments', 'Document workflows', 'Client follow-ups', 'Invoicing', 'CRM / records'],
    automate: ['Lead intake & qualification', 'Appointment scheduling', 'Automated follow-ups', 'Document portals', 'Invoicing'],
    core: 'Client Operations Platform',
    platform: 'A client operations platform covering intake, appointments and documents.',
    future: ['Client self-service portal', 'Automated engagement reports', 'Knowledge-base / AI intake', 'Team capacity planning'],
    recommend: ['operations_dashboard', 'customer_portal', 'whatsapp', 'notifications', 'analytics'],
    optional: ['ai_assistant', 'ai_automation', 'payments_mpesa', 'payments_card', 'custom_workflow'],
    opportunities: {
      'Lead intake': 'Structured lead capture and qualification.',
      'Appointments': 'Online scheduling with reminders.',
      'Document workflows': 'Secure document sharing and approvals.',
      'Client follow-ups': 'Automated follow-ups and status updates.',
      'Invoicing': 'Invoicing and payment collection.',
      'CRM / records': 'A single client and engagement record.'
    }
  },
  manufacturing: {
    label: 'Manufacturing', icon: '🏭',
    intro: 'Manufacturing runs on production, inventory and supply chain discipline.',
    askWhat: 'What do you manufacture, and how do you track production, stock and suppliers?',
    pain: ['Production tracking', 'Inventory & raw materials', 'Order fulfilment', 'Supplier management', 'Quality & defects', 'Reporting'],
    automate: ['Production workflow tracking', 'Inventory & reorder alerts', 'Order-to-delivery automation', 'Supplier communication', 'Quality reporting'],
    core: 'Manufacturing Operations Platform',
    platform: 'A production and supply-chain operations platform.',
    future: ['IoT machine monitoring', 'Production scheduling & planning', 'Predictive maintenance', 'Cost & margin analytics'],
    recommend: ['operations_dashboard', 'analytics', 'api_integrations', 'notifications'],
    optional: ['ai_automation', 'custom_workflow', 'live_tracking', 'multi_branch', 'enterprise'],
    opportunities: {
      'Production tracking': 'Live production status across lines.',
      'Inventory & raw materials': 'Raw-material stock and reorder automation.',
      'Order fulfilment': 'Order-to-delivery workflow tracking.',
      'Supplier management': 'Supplier records and purchase workflows.',
      'Quality & defects': 'Structured quality and defect capture.',
      'Reporting': 'Production and cost reporting dashboards.'
    }
  },
  education: {
    label: 'Education', icon: '🎓',
    intro: 'Schools and learning platforms run on admissions, timetables and communication.',
    askWhat: 'Is it a school, a training centre or an academy? How do admissions and parent communication work right now?',
    pain: ['Admissions & enrollment', 'Student records', 'Fees & payments', 'Timetables & scheduling', 'Parent communication', 'Reporting'],
    automate: ['Admissions workflow', 'Fees & payment reminders', 'Automated parent updates', 'Scheduling', 'Academic reporting'],
    core: 'Education Management Platform',
    platform: 'A school / academy operations platform spanning admissions, fees and communication.',
    future: ['Learning management (LMS)', 'Online assessments', 'Student & parent portal', 'Alumni engagement'],
    recommend: ['operations_dashboard', 'customer_portal', 'whatsapp', 'notifications', 'analytics'],
    optional: ['payments_mpesa', 'ai_assistant', 'mobile_app', 'custom_workflow', 'multi_branch'],
    opportunities: {
      'Admissions & enrollment': 'Structured online admissions workflow.',
      'Student records': 'Centralized student and academic records.',
      'Fees & payments': 'Fee schedules with automated reminders.',
      'Timetables & scheduling': 'Class and resource scheduling.',
      'Parent communication': 'Automated parent updates.',
      'Reporting': 'Academic and performance reporting.'
    }
  },
  construction: {
    label: 'Construction', icon: '🏗️',
    intro: 'Construction spans sites, budgets and many moving contractors.',
    askWhat: 'What do you build, and how do you track projects, sites and budgets today?',
    pain: ['Project tracking', 'Site coordination', 'Budget & payments', 'Contractor management', 'Document workflows', 'Reporting'],
    automate: ['Project & site tracking', 'Budget & payment workflows', 'Contractor communication', 'Document management', 'Progress reporting'],
    core: 'Construction Project Platform',
    platform: 'A construction project and site operations platform.',
    future: ['Site photo / progress logs', 'Procurement & approvals', 'Client progress portal', 'Cost forecasting'],
    recommend: ['operations_dashboard', 'analytics', 'live_tracking', 'notifications', 'customer_portal'],
    optional: ['ai_automation', 'payments_mpesa', 'custom_workflow', 'multi_branch', 'api_integrations'],
    opportunities: {
      'Project tracking': 'Live project and milestone tracking.',
      'Site coordination': 'Unified site and team coordination.',
      'Budget & payments': 'Budget tracking and payment workflows.',
      'Contractor management': 'Contractor records and handoffs.',
      'Document workflows': 'Plans and document control.',
      'Reporting': 'Progress and cost reporting dashboards.'
    }
  },
  other: {
    label: 'Other / Custom', icon: '🧩',
    intro: 'This is where Vuva does its best work. We start from your workflow rather than a template.',
    askWhat: 'Describe what your business does and the biggest operational pain point you want solved.',
    pain: ['Manual, repetitive work', 'Scattered tools & data', 'Slow customer response', 'No clear reporting', 'Disconnected teams', 'Scaling bottlenecks'],
    automate: ['Workflow automation', 'A customer portal', 'Reporting & dashboards', 'Integrations', 'AI assistance'],
    core: 'Custom Enterprise System',
    platform: 'A purpose-built system designed around your specific workflows.',
    future: ['Whatever your roadmap needs next, planned together'],
    recommend: ['operations_dashboard', 'customer_portal', 'analytics'],
    optional: ['ai_assistant', 'ai_automation', 'whatsapp', 'payments_mpesa', 'api_integrations', 'custom_workflow', 'mobile_app'],
    opportunities: {
      'Manual, repetitive work': 'Automation of repeatable steps.',
      'Scattered tools & data': 'A single connected operational view.',
      'Slow customer response': 'Automated, faster customer communication.',
      'No clear reporting': 'Dashboards and analytics on real business data.',
      'Disconnected teams': 'Shared workflows and handoffs.',
      'Scaling bottlenecks': 'Systems built to grow with the business.'
    }
  }
};

const NEEDS = {
  payments: 'Payments (M-Pesa / cards)',
  portal: 'Customer portal',
  dashboard: 'Dashboards',
  ai: 'AI assistance',
  integrations: 'Integrations',
  whatsapp: 'WhatsApp automation'
};

const BUDGETS = [
  { id: 'b1', label: 'Under KSh 500k' },
  { id: 'b2', label: 'KSh 500k – 1M' },
  { id: 'b3', label: 'KSh 1M – 2M' },
  { id: 'b4', label: 'KSh 2M+' },
  { id: 'b5', label: 'Not sure yet' }
];

const SCALES = [
  { id: 's1', label: '1–10 people' },
  { id: 's2', label: '11–50 people' },
  { id: 's3', label: '50+ people' },
  { id: 's4', label: 'Multiple branches / sites' }
];

const SOFTWARE = [
  { id: 'sw1', label: 'Spreadsheets / paper' },
  { id: 'sw2', label: 'Off-the-shelf apps' },
  { id: 'sw3', label: 'A custom system' },
  { id: 'sw4', label: 'A mix, not connected' }
];

// ---- "Thinking" analysis (PART 3) ----
const SIGNALS = [
  { re: /\b(call|phone|ring|whatsapp.*(ask|question)|enquir|complaint)\b/i, type: 'AI Opportunity', title: 'AI customer support agent', detail: 'Customers rely on direct contact for answers an assistant could handle.' },
  { re: /\b(manual|paper|spreadsheet|excel|type|write|re-?type|double.?entry)\b/i, type: 'Automation Opportunity', title: 'Workflow automation', detail: 'Manual capture and re-entry signal work that software should be doing.' },
  { re: /\b(track|where.*(shipment|order|parcel|goods|truck)|status|visib|locat|gps|live)\b/i, type: 'Software Opportunity', title: 'Live tracking & visibility', detail: 'Customers and staff lack a single view of where things are.' },
  { re: /\b(slow|delay|wait|long|queue|backlog)\b/i, type: 'Operations Opportunity', title: 'Process streamlining', detail: 'Friction in handoffs is slowing the operation down.' },
  { re: /\b(branch|branches|multi.?branch|site|outlet|warehouse|location)\b/i, type: 'Operations Opportunity', title: 'Multi-location coordination', detail: 'Multiple locations need a shared operational view.' },
  { re: /\b(stock|inventory|warehouse|supplier|re-?order)\b/i, type: 'Software Opportunity', title: 'Inventory management', detail: 'Stock and supply data appears fragmented.' },
  { re: /\b(pay|mpesa|mpesa|invoice|billing|rent|fees?|tuition)\b/i, type: 'Integration Opportunity', title: 'Payment integration', detail: 'Collections are manual or disconnected from records.' },
  { re: /\b(report|analytics|data|dashboard|see|metric|kpi)\b/i, type: 'Software Opportunity', title: 'Analytics & dashboards', detail: 'Management lacks real-time visibility into performance.' },
  { re: /\b(book|appoint|schedule|reserve|viewing|calendar)\b/i, type: 'Automation Opportunity', title: 'Booking & scheduling', detail: 'Scheduling is manual where it could be automated.' },
  { re: /\b(customer|client|tenant|patient|student|parent|guest)\b/i, type: 'Customer Experience', title: 'Customer portal & records', detail: 'Customers and their history deserve one connected record.' },
  { re: /\b(whatsapp|sms|text|email|notif|remind)\b/i, type: 'Integration Opportunity', title: 'Communication automation', detail: 'WhatsApp/SMS/email can carry routine updates automatically.' },
  { re: /\b(dispatch|rider|driver|fleet|route|delivery)\b/i, type: 'Operations Opportunity', title: 'Dispatch & fleet management', detail: 'Field operations can be orchestrated from one dashboard.' }
];

function analyse(text) {
  const hits = [];
  for (const s of SIGNALS) {
    if (s.re.test(text) && !hits.some((h) => h.title === s.title)) hits.push(s);
  }
  return hits.slice(0, 6);
}

function buildAnalysisCard(text) {
  const hits = analyse(text);
  const card = el('div', 'ai-proposal ai-analysis');
  card.appendChild(el('h4', null, 'What Vuva sees'));
  const lead = el('p', 'prop-val');
  lead.textContent = 'Here is my first read on what you described. This is just analysis, not a final design:';
  card.appendChild(lead);
  if (!hits.length) {
    card.appendChild(el('p', 'prop-val', 'The next few questions will help me understand where the real opportunities are.'));
    return card;
  }
  hits.forEach((h) => {
    const b = el('div', 'prop-block');
    b.appendChild(el('span', 'prop-label', h.type));
    b.appendChild(el('div', 'prop-val', h.title));
    const d = el('p', 'prop-sub');
    d.textContent = h.detail;
    b.appendChild(d);
    card.appendChild(b);
  });
  return card;
}

const STAGES = { welcome: 'welcome', industry: 'industry', what: 'what', scale: 'scale', pain: 'pain', software: 'software', automate: 'automate', needs: 'needs', budget: 'budget', name: 'name', company: 'company', done: 'done' };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function initVuvaAI() {
  const root = document.querySelector('[data-vuva-ai]');
  if (!root) return;

  const transcript = root.querySelector('[data-ai-transcript]');
  const input = root.querySelector('[data-ai-input]');
  const sendBtn = root.querySelector('[data-ai-send]');
  const resetBtn = root.querySelector('[data-ai-reset]');

  let answers = {};
  let stage = STAGES.welcome;
  let busy = false;

  const scrollToEnd = () => { transcript.scrollTop = transcript.scrollHeight; };

  const addMessage = (kind, nodes, opts = {}) => {
    const wrap = el('div', `ai-msg ${kind === 'agent' ? 'agent' : 'user'}`);
    if (opts.label) wrap.appendChild(el('span', 'm-label', opts.label));
    if (Array.isArray(nodes)) nodes.forEach((n) => wrap.appendChild(n));
    else wrap.appendChild(nodes);
    transcript.appendChild(wrap);
    scrollToEnd();
    return wrap;
  };

  const textNode = (html) => { const p = el('p'); p.innerHTML = html; return p; };

  const quickRow = (options, handler) => {
    const row = el('div', 'ai-quick');
    options.forEach((opt) => {
      const btn = el('button', 'chip is-dark');
      btn.type = 'button';
      btn.textContent = opt.label;
      btn.dataset.id = opt.id;
      btn.addEventListener('click', () => handler(opt));
      row.appendChild(btn);
    });
    return row;
  };

  const showTyping = () => addMessage('agent', (() => {
    const t = el('span', 'ai-typing');
    t.appendChild(el('i')); t.appendChild(el('i')); t.appendChild(el('i'));
    return t;
  })());

  const reply = (nodes, opts, delay = 520) => {
    busy = true; input.disabled = true; sendBtn.disabled = true;
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      addMessage('agent', nodes, opts);
      busy = false; input.disabled = false; sendBtn.disabled = false;
      scrollToEnd();
    }, delay);
  };

  const pushQuestion = (prompt, options, handler, multiselect = false) => {
    reply(textNode(prompt));
    setTimeout(() => {
      if (multiselect) {
        const selected = new Set();
        const row = quickRow(options, (opt) => {
          selected.has(opt.id) ? selected.delete(opt.id) : selected.add(opt.id);
          row.querySelectorAll('.chip').forEach((c) => {
            if (selected.has(c.dataset.id)) c.setAttribute('aria-pressed', 'true');
            else c.removeAttribute('aria-pressed');
          });
        });
        const done = el('button', 'chip is-dark');
        done.type = 'button';
        done.dataset.primary = 'true';
        done.textContent = 'Continue →';
        done.addEventListener('click', () => handler({ ids: [...selected] }));
        row.appendChild(done);
        addMessage('agent', row, { label: 'Select all that apply' });
      } else {
        const row = quickRow(options, handler);
        addMessage('agent', row, { label: 'Your options' });
      }
    }, 640);
  };

  const setFreeText = (nextStage, placeholder) => {
    input.dataset.stage = nextStage;
    input.placeholder = placeholder;
    transcript.dataset.freetext = nextStage;
  };

  const freeText = (prompt, nextStage, placeholder, onDone) => {
    setFreeText(nextStage, placeholder);
    reply(textNode(prompt));
    setTimeout(() => input.focus(), 560);
    transcript.dataset._freeHandler = nextStage;
    transcript.dataset._freeNext = onDone ? 'custom' : '';
    transcript._onFreeDone = onDone;
  };

  const ind = () => INDUSTRIES[answers.industry] || INDUSTRIES.other;

  // ---- Flow ----
  const start = () => {
    answers = {};
    stage = STAGES.welcome;
    transcript.innerHTML = '';
    input.placeholder = 'Type a message…';
    delete transcript.dataset.freetext;
    delete input.dataset.stage;
    addMessage('agent', textNode('Hi, I’m <strong>Vuva AI</strong>. Answer a few short questions about your business and I will suggest the kind of system that fits, with an estimated investment range.'), { label: 'Vuva AI' });
    setTimeout(() => {
      stage = STAGES.industry;
      pushQuestion('To start, which industry are you in?', Object.entries(INDUSTRIES).map(([id, d]) => ({ id, label: `${d.icon} ${d.label}` })), (opt) => {
        answers.industry = opt.id;
        onIndustry();
      });
    }, 560);
  };

  const onIndustry = () => {
    const industry = ind();
    stage = STAGES.what;
    reply(textNode(`${industry.intro} <strong>${industry.label}</strong> deserves systems built for how it actually operates.`));
    setTimeout(() => {
      setFreeText(STAGES.what, 'Describe your operation…');
      reply(textNode(industry.askWhat));
    }, 620);
  };

  const handleFreeText = (value) => {
    const target = transcript.dataset.freetext;
    if (target === STAGES.what) {
      answers.what = value;
      delete transcript.dataset.freetext; delete input.dataset.stage;
      input.placeholder = 'Type a message…';
      reply(buildAnalysisCard(value), { label: 'Vuva AI · Analysis' }, 700);
      setTimeout(() => {
        stage = STAGES.scale;
        pushQuestion('Roughly what scale are you operating at?', SCALES, (opt) => {
          answers.scale = opt.id;
          stage = STAGES.pain;
          pushQuestion('Which of these currently consume the most time?', ind().pain.map((p) => ({ id: p, label: p })), (o) => {
            answers.pain = o.ids || [o.id];
            stage = STAGES.software;
            pushQuestion('What software do you use today?', SOFTWARE, (s) => {
              answers.software = s.id;
              stage = STAGES.automate;
              pushQuestion('What would you most like to automate first?', ind().automate.map((a) => ({ id: a, label: a })), (a) => {
                answers.automate = a.ids || [a.id];
                stage = STAGES.needs;
                pushQuestion('Which capabilities should the system include?', Object.entries(NEEDS).map(([id, label]) => ({ id, label })), (n) => {
                  answers.needs = n.ids || [n.id];
                  stage = STAGES.budget;
                  pushQuestion('Last question, and it is optional. Roughly what budget range are you thinking about?', BUDGETS, (b) => {
                    answers.budget = b.id;
                    stage = STAGES.name;
                    freeText('Thanks. What’s your name, so I can personalise the proposal?', STAGES.name, 'Your name…');
                  });
                }, true);
              }, true);
            });
          }, true);
        });
      }, 860);
    } else if (target === STAGES.name) {
      answers.name = value;
      delete transcript.dataset.freetext; delete input.dataset.stage;
      stage = STAGES.company;
      freeText(`Thanks, ${escapeHtml(value.split(' ')[0])}. And what’s your company or business called?`, STAGES.company, 'Company name…');
    } else if (target === STAGES.company) {
      answers.company = value;
      delete transcript.dataset.freetext; delete input.dataset.stage;
      input.placeholder = 'Type a message…';
      generateRecommendation();
    }
  };

  // ---- Recommendation (PART 5) ----
  const generateRecommendation = () => {
    stage = STAGES.done;
    const industry = ind();
    const needs = (answers.needs || []).map((id) => NEEDS[id]).filter(Boolean);

    const card = el('div', 'ai-proposal');
    card.appendChild(el('h4', null, 'Your Recommended Vuva System'));

    const block = (label, value) => {
      const b = el('div', 'prop-block');
      b.appendChild(el('span', 'prop-label', label));
      const v = el('div', 'prop-val');
      if (Array.isArray(value)) { const ul = el('ul'); value.forEach((x) => ul.appendChild(el('li', null, x))); v.appendChild(ul); }
      else v.textContent = value;
      b.appendChild(v);
      card.appendChild(b);
    };

    block('Core platform', industry.platform);
    const cx = [];
    if (needs.includes(NEEDS.portal) || industry.recommend.includes('customer_portal')) cx.push('Customer portal with self-service and status tracking');
    if (needs.includes(NEEDS.whatsapp) || industry.recommend.includes('whatsapp')) cx.push('Automated WhatsApp / SMS notifications');
    cx.push('A cleaner, faster customer experience');
    block('Customer experience', cx);
    const ops = ['Operations dashboard with live status', 'Role-based access for staff and management'];
    if (industry.recommend.includes('multi_branch')) ops.push('Multi-branch / multi-site management');
    block('Operations', ops);
    block('AI automation', `${(answers.automate || []).slice(0, 3).join(' · ') || 'Targeted workflow automation'} across your operation.`);
    const integ = [];
    if (needs.includes(NEEDS.payments)) integ.push('M-Pesa / card payments');
    if (needs.includes(NEEDS.integrations) || industry.recommend.includes('api_integrations')) integ.push('Third-party APIs & webhooks');
    if (industry.recommend.includes('live_tracking')) integ.push('Maps & live tracking');
    integ.push('WhatsApp, SMS & email');
    block('Integrations', integ.join(' · '));
    block('Analytics', 'Executive dashboards, KPI tracking and reports your team can act on.');
    block('Future expansion', industry.future);

    addMessage('agent', card, { label: 'Vuva AI · Recommendation' });

    setTimeout(() => {
      const cta = el('div', 'ai-quick');
      const quote = el('button', 'button button-accent');
      quote.type = 'button';
      quote.textContent = 'Generate estimated quotation →';
      quote.addEventListener('click', generateQuotation);
      cta.appendChild(quote);
      const adjust = el('button', 'button button-quiet');
      adjust.type = 'button';
      adjust.textContent = 'Start over';
      adjust.addEventListener('click', start);
      cta.appendChild(adjust);
      addMessage('agent', cta);
    }, 640);
  };

  // ---- Quotation (PART 6) ----
  const generateQuotation = () => {
    const industry = ind();
    const rec = new Set(industry.recommend);
    const optional = industry.optional.filter((id) => !rec.has(id));

    const quote = el('div', 'ai-proposal ai-quote');
    const head = el('div', 'ai-quote-head');
    head.appendChild(el('span', 'prop-label', 'Estimated project quotation'));
    head.appendChild(el('h4', null, industry.core));
    quote.appendChild(head);

    const meta = el('div', 'prop-block');
    meta.appendChild(el('div', 'prop-val', `${answers.company || 'Your business'} · ${industry.label}`));
    quote.appendChild(meta);

    const components = el('div', 'prop-block');
    components.appendChild(el('span', 'prop-label', 'System components. Toggle any optional modules'));
    const list = el('div', 'quote-modules');
    quote.appendChild(components);
    components.appendChild(list);

    const summary = el('div', 'quote-summary');
    quote.appendChild(summary);

    const assumptions = el('div', 'prop-block');
    assumptions.appendChild(el('span', 'prop-label', 'Assumptions'));
    assumptions.appendChild(el('div', 'prop-val', 'Single organisation, standard integrations, cloud deployment, and a normal level of customisation. Enterprise compliance or heavy legacy migration is scoped separately.'));
    quote.appendChild(assumptions);

    const disclaimer = el('div', 'prop-block');
    disclaimer.appendChild(el('span', 'prop-label', 'Important'));
    disclaimer.appendChild(el('div', 'prop-val', pricing.disclaimer));
    quote.appendChild(disclaimer);

    addMessage('agent', quote, { label: 'Vuva AI · Quotation' });

    const state = { selected: new Set([...rec]), optional: new Set(optional) };

    const renderModules = () => {
      list.innerHTML = '';
      const all = [...pricing.modules];
      const renderToggle = (m, checked) => {
        const label = el('label', 'quote-mod');
        const box = el('input');
        box.type = 'checkbox';
        box.checked = checked;
        box.addEventListener('change', () => { box.checked ? state.selected.add(m.id) : state.selected.delete(m.id); renderSummary(); });
        label.appendChild(box);
        const name = el('span', 'q-name', m.label);
        const price = el('span', 'q-price', formatRange({ low: m.price, high: m.price }));
        label.appendChild(name);
        label.appendChild(price);
        list.appendChild(label);
      };
      all.filter((m) => rec.has(m.id)).forEach((m) => renderToggle(m, true));
      all.filter((m) => state.optional.has(m.id)).forEach((m) => renderToggle(m, false));
    };

    const renderSummary = () => {
      const est = estimate([...state.selected]);
      summary.innerHTML = '';
      const invest = el('div', 'q-row');
      invest.appendChild(el('span', null, 'Estimated investment'));
      invest.appendChild(el('strong', null, formatRange(est)));
      summary.appendChild(invest);
      const time = el('div', 'q-row');
      time.appendChild(el('span', null, 'Estimated timeline'));
      time.appendChild(el('strong', null, `~${est.weeks} weeks`));
      summary.appendChild(time);
      const note = el('p', 'q-note');
      note.textContent = 'Includes discovery, architecture, development, testing and deployment. Timeline is an estimate and is confirmed after scoping.';
      summary.appendChild(note);
    };

    renderModules();
    renderSummary();

    setTimeout(() => {
      const cta = el('div', 'ai-quick');
      const build = el('button', 'button button-accent');
      build.type = 'button';
      build.textContent = 'Ready to build this system? →';
      build.addEventListener('click', handoff);
      cta.appendChild(build);
      addMessage('agent', cta);
    }, 560);
  };

  // ---- WhatsApp handoff (PART 8) ----
  const handoff = () => {
    const industry = ind();
    const est = estimate(industry.recommend);
    const card = el('div', 'ai-proposal');
    card.appendChild(el('h4', null, 'Ready to Build Your System?'));
    card.appendChild(el('div', 'prop-val', 'Here is a summary of everything we covered. Send it through and the team will pick it up from there, so you will not have to repeat yourself.'));
    const lines = [
      'Hello Vuva Systems, I just completed the Vuva AI consultation.',
      '',
      `Industry: ${industry.label}`,
      answers.name ? `Name: ${answers.name.trim()}` : '',
      answers.company ? `Company: ${answers.company.trim()}` : '',
      '',
      `Recommended system: ${industry.core}`,
      '',
      'Key requirements:',
      ...industry.recommend.map((id) => `• ${(pricing.modules.find((m) => m.id === id) || {}).label || id}`),
      '',
      `Estimated investment: ${formatRange(est)}`,
      `Estimated timeline: ~${est.weeks} weeks`,
      '',
      'I would like to discuss this project.'
    ].filter((l) => l !== '');

    const waBtn = el('a', 'button button-accent');
    waBtn.href = `https://wa.me/254796117443?text=${encodeURIComponent(lines.join('\n'))}`;
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.textContent = 'Talk to Vuva Systems on WhatsApp ↗';

    const cta = el('div', 'ai-quick');
    cta.appendChild(waBtn);
    card.appendChild(cta);
    addMessage('agent', card, { label: 'Vuva AI · Handoff' });

    // Internal lead classification only · never shown to the customer.
    const qualification = {
      industry: answers.industry,
      scale: answers.scale,
      software: answers.software,
      budget: answers.budget,
      modules: industry.recommend.length,
      completedQuote: true,
      intent: 'high'
    };
    if (window.console) console.info('vuva_ai_lead', qualification);
  };

  // ---- Input ----
  sendBtn.addEventListener('click', submitInput);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submitInput(); } });

  function submitInput() {
    const value = input.value.trim();
    if (!value || busy) return;
    addMessage('user', textNode(escapeHtml(value)), { label: 'You' });
    input.value = '';
    if (transcript.dataset.freetext) { handleFreeText(value); return; }
    if (stage === STAGES.done) {
      reply(textNode('Thanks. If you want to go through this again, use <strong>“Start over”</strong> above, or tap <strong>“Talk to Vuva Systems on WhatsApp”</strong> to speak with the team directly.'));
      return;
    }
    reply(textNode('Pick one of the options above and I will adjust my questions as we go.'));
  }

  resetBtn?.addEventListener('click', () => { input.value = ''; input.placeholder = 'Type a message…'; delete transcript.dataset.freetext; delete input.dataset.stage; start(); });

  start();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initVuvaAI);
else initVuvaAI();
