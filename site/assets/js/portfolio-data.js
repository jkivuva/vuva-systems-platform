// Vuva Systems — Portfolio Index data.
//
// The single source of truth for the Project Index and Vuva Creative Studio
// sections. Every entry carries an honest `status` label:
//   client      — genuine commissioned work, named with permission
//   portfolio   — our own build made to demonstrate craft (not a client engagement)
//   demo        — click-through demonstration system with sample data
//   concept     — designed concept showing what we can build
//   internal    — part of Vuva Systems' own product/technology development
// Nothing here invents clients, results, revenue or testimonials.

export const CATEGORIES = Object.freeze([
  'Business Systems',
  'AI & Automation',
  'Healthcare',
  'Logistics',
  'Retail',
  'Hospitality',
  'FinTech',
  'Real Estate',
  'Education',
  'Digital Experiences',
  'Data & Operations',
  'Creative'
]);

export const STATUS = Object.freeze({
  client: { label: 'Real project', cls: 'is-real' },
  portfolio: { label: 'Portfolio project', cls: 'is-portfolio' },
  internal: { label: 'Internal product', cls: 'is-portfolio' },
  demo: { label: 'Demo · sample data', cls: 'is-demo' },
  concept: { label: 'Concept', cls: 'is-concept' }
});

export const PROJECTS = [
  /* ================= CLIENT / REAL WORK ================= */
  {
    id: 'limitless-logistics',
    name: 'Limitless Logistics Platform',
    category: 'Logistics',
    industry: 'Freight & Clearing',
    status: 'client',
    featured: true,
    image: '/assets/img/logistics.svg',
    blurb: 'Freight platform covering the customer site, AI assistant, quote requests, shipment tracking and an operations dashboard.',
    capabilities: ['Dispatch', 'Live tracking', 'Driver app', 'Proof of delivery', 'ETA prediction', 'AI support', 'Multi-branch', 'Analytics'],
    detail: {
      problem: 'Customers could not see where their freight was. Drivers, warehouse work and quotes lived in separate tools.',
      solution: 'One platform: customer tracking portal, an AI assistant for status questions, online quotes and a single operations dashboard for dispatch.',
      features: ['Customer tracking portal', 'AI assistant on live records', 'Quote requests', 'Driver & warehouse management', 'Operations dashboard'],
      experience: 'Customers check shipment status themselves; dispatch runs the fleet from one screen instead of phone calls.',
      tech: ['Web app', 'WhatsApp automation', 'AI assistant', 'Cloud database'],
      value: 'Fewer status calls, one source of truth for every shipment, and customers who can self-serve.'
    }
  },
  {
    id: 'blitz-restaurant',
    name: 'Blitz Restaurant OS',
    category: 'Hospitality',
    industry: 'Restaurants & Delivery',
    status: 'client',
    featured: true,
    image: '/assets/img/hospitality.svg',
    blurb: 'Restaurant and delivery platform covering orders, payments, kitchens, riders and branch management across locations.',
    capabilities: ['Ordering', 'M-Pesa payments', 'Kitchen display', 'Rider tracking', 'Multi-branch'],
    detail: {
      problem: 'A growing restaurant group needed orders, kitchens, riders and branches to stay in sync without phone calls and paper.',
      solution: 'Every order flows from payment to kitchen to rider automatically, and managers see a report for each branch.',
      features: ['Online ordering', 'M-Pesa payments', 'Kitchen screens', 'Rider dispatch & tracking', 'Multi-branch administration'],
      experience: 'Customers order and pay in minutes; kitchen and riders work off live tickets rather than shouted instructions.',
      tech: ['Web app (PWA)', 'M-Pesa integration', 'Kitchen display system', 'Multi-branch database'],
      value: 'Orders stop falling through cracks and each branch is accountable for its own numbers.'
    }
  },
  {
    id: 'vuva-platform',
    name: 'Vuva Systems Platform',
    category: 'AI & Automation',
    industry: 'Software Engineering',
    status: 'client',
    featured: true,
    image: '/assets/img/enterprise.svg',
    blurb: 'This website: Cloudflare edge deployment, interactive demos, an AI consultant, signed WhatsApp webhook and its own D1 database.',
    capabilities: ['Edge platform', 'AI consultant', 'WhatsApp webhook', 'D1 database', 'Security headers'],
    detail: {
      problem: 'We wanted our own site to show how we build rather than just talk about it.',
      solution: 'A fast edge platform with interactive demos, an AI consultant, verified WhatsApp deliveries and a private operations area.',
      features: ['Interactive demo showroom', 'Vuva AI consultation engine', 'Signed WhatsApp webhook', 'Private internal area', 'Strict security headers'],
      experience: 'Visitors click into working systems instead of reading brochures; enquiries flow straight to WhatsApp.',
      tech: ['Cloudflare Workers', 'D1 SQL database', 'WhatsApp Business API', 'Zero third-party scripts'],
      value: 'The same standards we sell — security, speed and honesty — proven on our own infrastructure. Live at vuvasystems.com.'
    }
  },
  {
    id: 'apex',
    name: 'Apex Strategy Group Website',
    category: 'Digital Experiences',
    industry: 'Professional Services',
    status: 'portfolio',
    featured: false,
    image: '/assets/img/apex.svg',
    blurb: 'Editorial-style consultancy website built in WordPress with Elementor: strong typography, clean structure, polished business presence.',
    capabilities: ['WordPress', 'Elementor', 'Custom child theme', 'Responsive design', 'SEO structure'],
    detail: {
      problem: 'Show a complete WordPress/Elementor capability without inventing a client engagement.',
      solution: 'A fictional-but-honest strategy consultancy site: six pages, editorial homepage, case studies, working contact form and mobile-first layouts.',
      features: ['Custom child theme design system', 'Elementor layouts throughout', 'Case studies & insights sections', 'Working contact form', 'Clean URLs & meta structure'],
      experience: 'Reads like an editorial magazine: strong typography first, decoration second.',
      tech: ['WordPress', 'Hello Elementor + custom child theme', 'Elementor Pro layouts'],
      value: 'Proof of WordPress delivery quality. Completed local portfolio project; walkthrough available on request.'
    }
  },
  {
    id: 'ai-content-platform',
    name: 'AI Content Experience Platform',
    category: 'AI & Automation',
    industry: 'Media & Publishing',
    status: 'internal',
    featured: true,
    image: '/assets/img/enterprise.svg',
    blurb: 'Content platform where AI drafting, retrieval-augmented search and human review fit together in one editorial workflow.',
    capabilities: ['RAG pipeline', 'Cited answers', 'Human review gate', 'Evaluation harness', 'Workflow engine'],
    detail: {
      problem: 'Teams want AI help writing and finding content, but most tools publish whatever the model produces with no record of who checked it.',
      solution: 'Next.js front end over a headless CMS abstraction, a RAG pipeline that cites sources and refuses when coverage is thin, plus a publish-requires-approval workflow engine.',
      features: ['Grounded drafting with citations', 'Refuses low-evidence answers', 'Human approval before publishing', 'Evaluation harness', 'Full audit logging'],
      experience: 'Editors see exactly which sources informed a draft and who approved it — governance you can inspect.',
      tech: ['Next.js', 'RAG pipeline', 'Cloudflare Workers deployment'],
      value: 'Shows how we ship AI that organisations can trust and audit. Live case study at /work/ai-content-platform/.'
    }
  },

  /* ================= BUSINESS SYSTEMS ================= */
  {
    id: 'lend',
    name: 'V-Lend Loan Management',
    category: 'FinTech',
    industry: 'Microfinance & Credit',
    status: 'demo',
    featured: false,
    image: '/assets/img/fintech.svg',
    blurb: 'Loan origination with automatic checks, officer queues, M-Pesa disbursement and repayment tracking.',
    capabilities: ['Auto credit checks', 'Officer queue', 'M-Pesa disbursement', 'Arrears alerts'],
    detail: {
      problem: 'Lenders track applications in notebooks and spreadsheets, so nothing is consistent between branches or officers.',
      solution: 'One pipeline from application through automated rules, human review, disbursement and collections.',
      features: ['Application intake', 'Automatic eligibility rules', 'Officer review queue', 'M-Pesa B2C disbursement', 'Repayment schedules & arrears alerts'],
      experience: 'Officers see only applications flagged for them, with reasons attached; applicants get status by SMS.',
      tech: ['Rules engine', 'M-Pesa integration', 'Role-based access', 'Audit trail'],
      value: 'Faster decisions with a consistent paper trail. Try the working queue on this page in the capability stage above.'
    }
  },
  {
    id: 'crm-suite',
    name: 'Customer CRM & Pipeline',
    category: 'Business Systems',
    industry: 'Sales Teams',
    status: 'concept',
    image: '/assets/img/crm.svg',
    blurb: 'Leads move through visible stages with follow-up tasks, quotes and no lead left idle past its next action date.',
    capabilities: ['Deal stages', 'Follow-up tasks', 'Quotes', 'Activity timeline'],
    detail: {
      problem: 'Sales teams lose deals not to competitors but to forgotten follow-ups.',
      solution: 'A CRM shaped around the next action: every deal has an owner, a stage and a dated task that escalates when overdue.',
      features: ['Visual pipeline', 'Task & reminder engine', 'Quote generation', 'Contact timelines', 'WhatsApp touchpoints logged automatically'],
      experience: 'A salesperson opens the morning view and sees exactly which leads to call today.',
      tech: ['Relational database', 'Task scheduler', 'WhatsApp integration'],
      value: 'Nothing sits idle. Managers see pipeline value and stuck stages at a glance.'
    }
  },
  {
    id: 'hris',
    name: 'HR & Payroll System',
    category: 'Business Systems',
    industry: 'People Operations',
    status: 'concept',
    image: '/assets/img/hris.svg',
    blurb: 'Staff records, leave workflows, shift rosters and payslip generation in one employee system.',
    capabilities: ['Employee records', 'Leave workflows', 'Shift roster', 'Payslips'],
    detail: {
      problem: 'Leave requests on paper, rosters in WhatsApp groups and payslips assembled by hand each month.',
      solution: 'A single HR core: approved leave feeds the roster, the roster feeds payroll, payroll issues payslips without retyping.',
      features: ['Employee directory', 'Leave approval workflow', 'Shift & duty rosters', 'Statutory deductions setup', 'Self-service payslips'],
      experience: 'Staff request leave on their phones; approvals land with the manager with the balance already checked.',
      tech: ['Workflow engine', 'PDF payslip generation', 'SMS/email notifications'],
      value: 'HR admin hours drop and every deduction is explainable to the employee.'
    }
  },
  {
    id: 'legal-workspace',
    name: 'Legal Document Workspace',
    category: 'Business Systems',
    industry: 'Legal Services',
    status: 'concept',
    image: '/assets/img/legaltech.svg',
    blurb: 'Contract drafting with clause libraries, tracked reviews, versioning and signature-ready exports.',
    capabilities: ['Clause library', 'Version history', 'Review tasks', 'Approval trail'],
    detail: {
      problem: 'Contracts circulate as email attachments until nobody knows which version is current.',
      solution: 'Documents live once, versioned centrally, with clause-level review tasks and a complete approval history.',
      features: ['Reusable clause library', 'Redline-style review tasks', 'Version comparison', 'Signature-ready export', 'Matter dashboard'],
      experience: 'A lawyer assembles agreements from approved clauses instead of copying last month’s file.',
      tech: ['Document templating', 'Role-based permissions', 'Full audit log'],
      value: 'Less copy-paste risk and every contract tells you who changed what, and when.'
    }
  },
  {
    id: 'booking-engine',
    name: 'Universal Booking Engine',
    category: 'Business Systems',
    industry: 'Service Businesses',
    status: 'demo',
    image: '/assets/img/booking.svg',
    blurb: 'Online scheduling with capacity control, reminders that cut no-shows, and calendar sync for staff.',
    capabilities: ['Slot management', 'Reminders', 'Capacity rules', 'Rescheduling'],
    detail: {
      problem: 'Bookings taken by phone create double-bookings, empty slots and customers who simply forget to show up.',
      solution: 'A booking core any service business can adopt: live availability, automatic confirmations, reminders and staff calendars.',
      features: ['Public booking widget', 'Capacity & buffer rules', 'WhatsApp/SMS reminders', 'Staff calendars', 'No-show follow-up'],
      experience: 'Customers pick a slot like choosing a seat; staff see their week fill up in real time.',
      tech: ['Scheduling engine', 'Notification pipelines', 'Calendar integrations'],
      value: 'Fewer empty slots and dramatically fewer no-shows once reminders run themselves.'
    }
  },
  {
    id: 'queue-system',
    name: 'Queue Management System',
    category: 'Business Systems',
    industry: 'Banks, Clinics & Offices',
    status: 'concept',
    image: '/assets/img/queue.svg',
    blurb: 'Ticket-based queues with live wait times, counter displays and staff calling controls.',
    capabilities: ['Ticketing', 'Counter displays', 'Wait analytics', 'Staff call controls'],
    detail: {
      problem: 'Crowds form around reception desks while staff juggle who is next with no record of wait times.',
      solution: 'Tickets issued on arrival or by phone, counters call the next number, and management sees live wait analytics.',
      features: ['Self-service ticketing', 'Counter calling screens', 'Voice/visual announcements', 'Wait-time dashboards', 'Peak-hour planning reports'],
      experience: 'Customers sit down knowing their number and position; staff serve in fair order.',
      tech: ['Realtime state engine', 'Display screens', 'Analytics'],
      value: 'Calmer waiting rooms and hard data on where service slows down.'
    }
  },
  {
    id: 'pos-retail',
    name: 'Point of Sale & Sync',
    category: 'Retail',
    industry: 'Shops & Counters',
    status: 'concept',
    image: '/assets/img/pos.svg',
    blurb: 'Counter selling that keeps working offline and syncs receipts, stock and cash-up to head office.',
    capabilities: ['Offline-first till', 'Receipts', 'Cash-up reports', 'Head-office sync'],
    detail: {
      problem: 'Network outages stall tills, and head office learns about yesterday’s sales a week late.',
      solution: 'An offline-first point of sale that queues transactions locally and reconciles to head office the moment connectivity returns.',
      features: ['Fast barcode checkout', 'M-Pesa & card tender', 'Offline transaction queue', 'End-of-day cash-up', 'Head-office live totals'],
      experience: 'The till never shows a spinner during a sale; reconciliation happens invisibly in the background.',
      tech: ['Local-first storage', 'Sync protocol', 'Payment integrations'],
      value: 'Trading never stops for the network, and head office counts on numbers that are minutes old, not weeks.'
    }
  },

  /* ================= AI & AUTOMATION ================= */
  {
    id: 'agent-mesh',
    name: 'Agent Mesh Orchestrator',
    category: 'AI & Automation',
    industry: 'Cross-industry',
    status: 'internal',
    image: '/assets/img/agentmesh.svg',
    blurb: 'Specialised agents — customer, sales, ops, support, research, analytics — orchestrated around one governed core.',
    capabilities: ['Specialist agents', 'Shared memory', 'Guardrails', 'Human escalation'],
    detail: {
      problem: 'One general-purpose chatbot cannot respect the different limits of sales conversations, operations actions and financial records.',
      solution: 'A mesh of narrow agents, each with its own tools and limits, sharing one audited memory and escalating anything sensitive to people.',
      features: ['Per-agent tool scopes', 'Shared business memory', 'Escalation policies', 'Complete action audit trail', 'Cost & rate controls'],
      experience: 'Each agent behaves like a trained team member in one seat, not a generic chatbot.',
      tech: ['LLM orchestration', 'Retrieval', 'Policy guardrails', 'Event bus'],
      value: 'Automation you can defend: clear limits, full logs, humans on the sensitive paths.'
    }
  },
  {
    id: 'doc-intelligence',
    name: 'Document Intelligence Pipeline',
    category: 'AI & Automation',
    industry: 'Back Offices',
    status: 'concept',
    image: '/assets/img/aidocs.svg',
    blurb: 'Invoices, delivery notes and forms become structured records your systems can act on — with human checks on values.',
    capabilities: ['OCR + LLM extraction', 'Field validation', 'Human review', 'System handoff'],
    detail: {
      problem: 'Staff retype the same documents into three systems, slowly and with errors.',
      solution: 'Documents arrive by email or upload; extraction pulls fields and totals, validation flags oddities, and a person confirms before anything posts.',
      features: ['Email/upload intake', 'Field & table extraction', 'Confidence scoring', 'Human confirmation step', 'Direct posting to ERP/accounting'],
      experience: 'A clerk reviews pre-filled forms instead of typing them; exceptions are highlighted, not hidden.',
      tech: ['OCR + LLM extraction', 'Validation rules', 'ERP/accounting connectors'],
      value: 'Hours of retyping per day disappear, and accuracy goes up because machines draft and humans verify.'
    }
  },
  {
    id: 'invoice-flow',
    name: 'Invoice Processing Flow',
    category: 'AI & Automation',
    industry: 'Finance Teams',
    status: 'demo',
    image: '/assets/img/workflow.svg',
    blurb: 'A working demonstration of document-to-payment automation: extract, match, approve, pay, reconcile.',
    capabilities: ['Extraction', 'PO matching', 'Approvals', 'Reconciliation'],
    detail: {
      problem: 'Supplier invoices wait in inboxes while payments lag and duplicate payments slip through.',
      solution: 'Invoices are extracted automatically, matched to purchase orders, routed to the right approver and reconciled after payment.',
      features: ['Automated capture', 'Three-way matching', 'Approval routing', 'Payment scheduling', 'Exception reports'],
      experience: 'Finance approves from a queue of pre-checked invoices; duplicates are caught before money moves.',
      tech: ['Extraction pipeline', 'Matching rules', 'Payment integration', 'Audit log'],
      value: 'Shorter payment cycles with stronger controls — try it running live in the automation showcase below.'
    }
  },
  {
    id: 'voice-agent',
    name: 'Voice AI Receptionist',
    category: 'AI & Automation',
    industry: 'Front Desks',
    status: 'concept',
    image: '/assets/img/voiceai.svg',
    blurb: 'Calls answered instantly in English or Kiswahili, transcribed, booked into the calendar, escalated when unsure.',
    capabilities: ['Call answering', 'Transcription', 'Live booking', 'Human fallback'],
    detail: {
      problem: 'Front desks miss calls during busy hours, and every missed call is a customer who called a competitor.',
      solution: 'A voice agent that picks up immediately, understands the request, books or answers from real data, and hands complex calls to staff.',
      features: ['Natural call answering', 'English/Kiswahili handling', 'Live calendar booking', 'Message transcription', 'Instant human escalation'],
      experience: 'Callers hear an immediate, competent answer instead of ringing out.',
      tech: ['Speech recognition', 'LLM dialogue', 'Telephony integration', 'Calendar APIs'],
      value: 'No call goes unanswered, and the diary fills itself while staff do their actual jobs.'
    }
  },
  {
    id: 'lead-automation',
    name: 'Lead Capture & Qualification',
    category: 'AI & Automation',
    industry: 'Sales & Marketing Ops',
    status: 'demo',
    image: '/assets/img/apis.svg',
    blurb: 'Enquiries from web, WhatsApp and calls unified, classified, qualified and routed to the right person in seconds.',
    capabilities: ['Omni-channel intake', 'AI classification', 'Scoring', 'Routing'],
    detail: {
      problem: 'Leads arrive in five inboxes; whoever sees them first wins, and nobody measures response time.',
      solution: 'Every enquiry lands in one pipeline: classified by intent, scored against your criteria, assigned with a response deadline.',
      features: ['Website/WhatsApp/email intake', 'Intent classification', 'Qualification scoring', 'Owner assignment & escalation', 'Response-time reporting'],
      experience: 'Salespeople receive warm, annotated leads instead of raw messages; managers see speed-to-lead on a dashboard.',
      tech: ['Webhook fan-in', 'LLM classification', 'CRM integration'],
      value: 'Minutes-fast responses win business that day-long responses lose. See it in the AI automation showcase below.'
    }
  },
  {
    id: 'workflow-studio',
    name: 'Workflow Automation Studio',
    category: 'AI & Automation',
    industry: 'Operations',
    status: 'concept',
    image: '/assets/img/workflow.svg',
    blurb: 'Visual rule builder for the automations unique to your business — readable by managers, not just engineers.',
    capabilities: ['Rule builder', 'Branching logic', 'Notifications', 'Run logs'],
    detail: {
      problem: 'Every business has rules only it knows — who approves what, when to alert whom — usually kept in someone’s head.',
      solution: 'A studio where those rules are drawn as flows: conditions, branches, notifications and escalations anyone senior can read.',
      features: ['Drag-together rule builder', 'Conditional branching', 'Scheduled & event triggers', 'Notification fan-out', 'Every run logged and replayable'],
      experience: 'Managers change a threshold and the whole company’s behaviour updates — no developer ticket required.',
      tech: ['Rules DSL', 'Event triggers', 'Notification services'],
      value: 'Your operating policy becomes executable, visible and easy to change.'
    }
  },
  {
    id: 'ai-support-desk',
    name: 'AI Support Desk',
    category: 'AI & Automation',
    industry: 'Customer Service',
    status: 'concept',
    image: '/assets/img/security.svg',
    blurb: 'Ticket triage, suggested replies from your knowledge base, and humans for anything sensitive.',
    capabilities: ['Auto-triage', 'Suggested replies', 'Knowledge grounding', 'SLA tracking'],
    detail: {
      problem: 'Support inboxes mix urgent complaints with repeat questions, so urgent ones wait behind "what are your hours?".',
      solution: 'AI triages every ticket by urgency and topic, drafts grounded replies for the routine ones and routes the rest with context.',
      features: ['Urgency & sentiment triage', 'Draft replies with citations', 'Duplicate detection', 'SLA timers', 'Seamless human takeover'],
      experience: 'Agents clear the routine queue in a fraction of the time and give the hard cases full attention.',
      tech: ['Retrieval-augmented replies', 'Classification models', 'Helpdesk integration'],
      value: 'Faster first responses without losing the human touch where it matters.'
    }
  },
  {
    id: 'iot-telemetry',
    name: 'IoT Telemetry Platform',
    category: 'Data & Operations',
    industry: 'Field Equipment & Utilities',
    status: 'concept',
    image: '/assets/img/iot.svg',
    blurb: 'Sensors in the field report through gateways to live dashboards, alerts and maintenance schedules.',
    capabilities: ['Sensor ingestion', 'Gateway buffering', 'Threshold alerts', 'Maintenance triggers'],
    detail: {
      problem: 'Tanks overflow, cold rooms fail and generators sit un serviced because nobody sees equipment health until it breaks.',
      solution: 'Sensor readings flow through local gateways into one platform with thresholds, alerts and automatic maintenance jobs.',
      features: ['Multi-sensor ingestion', 'Store-and-forward gateways', 'Threshold & trend alerts', 'Maintenance scheduling', 'Uptime reporting'],
      experience: 'A supervisor gets a message about a rising temperature long before the stock is lost.',
      tech: ['Telemetry ingestion', 'Time-series storage', 'Alerting rules'],
      value: 'Equipment problems become scheduled work instead of emergencies.'
    }
  },

  /* ================= HEALTHCARE ================= */
  {
    id: 'vuvacare',
    name: 'VuvaCare Hospital System',
    category: 'Healthcare',
    industry: 'Hospitals & Clinics',
    status: 'demo',
    featured: true,
    image: '/assets/img/healthcare.svg',
    blurb: 'Patients book appointments and see their place in the queue; staff manage doctors, pharmacy and billing from the same system.',
    capabilities: ['Booking wizard', 'Live queue', 'Billing', 'Pharmacy', 'Reminders'],
    detail: {
      problem: 'Paper appointment books hide free slots, queues are invisible to patients, and billing reconciles by hand at month end.',
      solution: 'One two-sided system: patients book and track their visit; reception, doctors, pharmacy and billing share the same live record.',
      features: ['Patient booking wizard', 'Live department queues', 'Doctor scheduling', 'Pharmacy dispensing & stock', 'Billing with M-Pesa', 'Automated reminders'],
      experience: 'Patients walk in knowing their place; staff never ask "which doctor did you see?" again.',
      tech: ['Two-sided web app', 'Queue engine', 'M-Pesa integration'],
      value: 'Shorter waits, fewer no-shows and a front desk that stops firefighting. Launch the full demo above.'
    }
  },
  {
    id: 'lab-lis',
    name: 'Laboratory Information System',
    category: 'Healthcare',
    industry: 'Pathology Labs',
    status: 'concept',
    image: '/assets/img/labdiag.svg',
    blurb: 'Samples tracked from collection to result with ranges, flags and doctor notification built in.',
    capabilities: ['Sample tracking', 'Result validation', 'Range flags', 'Doctor alerts'],
    detail: {
      problem: 'Samples go missing between collection and the microscope, and results reach doctors late or not at all.',
      solution: 'Every sample gets an identity at collection; each step is scanned, validated against reference ranges and pushed to the requesting doctor.',
      features: ['Barcode sample lifecycle', 'Reference-range validation', 'Critical-value flags', 'Doctor & patient notification', 'Turnaround-time analytics'],
      experience: 'A phlebotomist prints a label once; everyone afterwards scans instead of searching.',
      tech: ['Barcode workflows', 'Validation rules', 'HL7-friendly interfaces'],
      value: 'Zero lost samples and turnaround times you can quote confidently.'
    }
  },
  {
    id: 'clinic-ops',
    name: 'Dental & Specialist Clinic Suite',
    category: 'Healthcare',
    industry: 'Specialist Clinics',
    status: 'concept',
    image: '/assets/img/clinicops.svg',
    blurb: 'Chair-side scheduling, treatment notes, sterilisation logs and patient recall in one clinic system.',
    capabilities: ['Chair scheduling', 'Treatment records', 'Sterilisation log', 'Recall lists'],
    detail: {
      problem: 'Specialist clinics juggle chairs, instruments and follow-ups across paper cards and diaries.',
      solution: 'A suite tuned to procedure clinics: chair schedules, per-visit treatment notes, instrument traceability and automatic recalls.',
      features: ['Procedure-based scheduling', 'Chair-side treatment notes', 'Sterilisation & instrument logs', 'Patient recall campaigns', 'Revenue per chair reporting'],
      experience: 'The clinician taps through a structured note between patients instead of writing after closing.',
      tech: ['Clinical templates', 'Recall scheduler', 'Reporting'],
      value: 'More patients seen per day with cleaner records and no missed recalls.'
    }
  },
  {
    id: 'telehealth',
    name: 'Telehealth Consultation Platform',
    category: 'Healthcare',
    industry: 'Remote Care',
    status: 'concept',
    image: '/assets/img/telemed.svg',
    blurb: 'Video consultations with vitals streaming, e-prescriptions and pharmacy fulfilment in one flow.',
    capabilities: ['Video visits', 'E-prescriptions', 'Pharmacy routing', 'Consult notes'],
    detail: {
      problem: 'Upcountry patients travel hours for fifteen-minute reviews that could happen on a phone.',
      solution: 'Consultations run end to end online: booking, video visit, notes, prescription and medicine delivery from a partner pharmacy.',
      features: ['Appointment-linked video rooms', 'Structured consult notes', 'Electronic prescriptions', 'Pharmacy routing & delivery', 'Payment before or after'],
      experience: 'A patient joins from a basic smartphone and leaves with medicine on the way.',
      tech: ['WebRTC video', 'Prescription module', 'Delivery coordination'],
      value: 'Reach patients outside your neighbourhood without diluting care quality.'
    }
  },
  {
    id: 'pharma-inventory',
    name: 'Pharmacy Inventory & Dispensing',
    category: 'Healthcare',
    industry: 'Pharmacies',
    status: 'concept',
    image: '/assets/img/pharmacy.svg',
    blurb: 'Prescriptions check against live shelf stock; expiring and slow items trigger supplier orders automatically.',
    capabilities: ['Dispensing', 'Batch expiry', 'Reorder points', 'Insurance claims'],
    detail: {
      problem: 'Pharmacies stock out of fast movers while dead stock expires on the shelf.',
      solution: 'Dispensing draws from batch-tracked inventory; expiry dates, reorder points and supplier orders are managed automatically.',
      features: ['Batch & expiry tracking', 'Prescription verification', 'Automatic reorder drafts', 'Slow-mover reports', 'Insurance claim exports'],
      experience: 'A pharmacist verifies a script in seconds and sees the shelf level update live.',
      tech: ['Batch-tracked inventory', 'Supplier ordering', 'Claims formatting'],
      value: 'Capital moves from expired shelf stock to the medicines customers actually ask for.'
    }
  },

  /* ================= LOGISTICS & TRANSPORT ================= */
  {
    id: 'fleet-command',
    name: 'Fleet Command Centre',
    category: 'Logistics',
    industry: 'Transporters',
    status: 'demo',
    image: '/assets/img/fleet.svg',
    blurb: 'Every vehicle’s duty status, GPS position, fuel and service schedule on one live board.',
    capabilities: ['Duty status board', 'GPS positions', 'Fuel tracking', 'Service alerts'],
    detail: {
      problem: 'Fleet owners discover problems when a customer calls angry or a vehicle fails on the highway.',
      solution: 'A command centre where every vehicle reports position, duty status and health, with service due dates surfaced before they bite.',
      features: ['Live vehicle map', 'Driver assignment & hours', 'Fuel & mileage logs', 'Service countdowns', 'Trip profitability reports'],
      experience: 'Dispatch sees the whole fleet as one picture instead of a wall of phone calls.',
      tech: ['GPS ingestion', 'Geofencing', 'Maintenance scheduler'],
      value: 'Fewer breakdowns, honest utilisation numbers and calmer customers. Open the logistics demo above for the full pattern.'
    }
  },
  {
    id: 'warehouse-wms',
    name: 'Warehouse Management System',
    category: 'Logistics',
    industry: 'Warehousing & Distribution',
    status: 'concept',
    image: '/assets/img/warehouse.svg',
    blurb: 'Bin-level inventory, guided pick paths and cycle counts that never shut the warehouse down.',
    capabilities: ['Bin locations', 'Pick paths', 'Cycle counts', 'Receiving'],
    detail: {
      problem: 'Pickers hunt for stock by memory and stocktakes freeze operations for a weekend.',
      solution: 'Everything has a bin; picking follows an optimised path; counting happens continuously in slices.',
      features: ['Bin & zone mapping', 'Guided multi-order picking', 'Continuous cycle counts', 'Goods receiving & put-away', 'Accuracy dashboards'],
      experience: 'A new picker is productive on day one because the system says where everything is.',
      tech: ['Inventory engine', 'Handheld/mobile UI', 'Barcode scanning'],
      value: 'Faster, accurate fulfilment without shutdown stocktakes.'
    }
  },
  {
    id: 'clearing-forwarding',
    name: 'Clearing & Forwarding System',
    category: 'Logistics',
    industry: 'Border & Port Agents',
    status: 'concept',
    image: '/assets/img/clearing.svg',
    blurb: 'Shipments tracked from entry through customs release to final delivery, with document packs and job costing.',
    capabilities: ['Entry tracking', 'Document packs', 'Status portals', 'Job costing'],
    detail: {
      problem: 'Consignments stall at borders while agents chase document status across emails and WhatsApp threads.',
      solution: 'Every consignment is a job: entry references, document checklist, customs milestones, charges and margin in one record.',
      features: ['Consignment job files', 'Document checklists & expiry alerts', 'Customs milestone tracking', 'Client status portal', 'Per-job cost & revenue reports'],
      experience: 'Clients stop calling for updates because the portal answers first.',
      tech: ['Workflow states', 'Document store', 'Client portal'],
      value: 'Faster clearances and per-job profitability you can actually see.'
    }
  },
  {
    id: 'lastmile',
    name: 'Last-Mile Delivery Manager',
    category: 'Logistics',
    industry: 'Courier & Delivery',
    status: 'demo',
    image: '/assets/img/logistics.svg',
    blurb: 'Route sequencing, rider apps, proof-of-delivery capture and customer tracking links for the final kilometre.',
    capabilities: ['Route sequencing', 'Rider app', 'Proof of delivery', 'Tracking links'],
    detail: {
      problem: 'Delivery days are planned on paper routes and confirmed by phone photos lost in gallery rolls.',
      solution: 'Stops are sequenced automatically, riders work from an app, POD is captured against each stop and customers watch progress live.',
      features: ['Stop sequencing', 'Rider mobile app', 'Photo/signature POD', 'Branded tracking links', 'Failed-attempt handling'],
      experience: 'Customers get a link, watch the rider approach, and receive the photo receipt without asking.',
      tech: ['Routing algorithms', 'Mobile app', 'GPS tracking'],
      value: 'More stops per rider per day and support calls that nearly vanish. Mirrors the Blitz Restaurant rider flow in the hospitality demo.'
    }
  },

  /* ================= RETAIL & COMMERCE ================= */
  {
    id: 'commerceos',
    name: 'CommerceOS Retail & Distribution',
    category: 'Retail',
    industry: 'Distribution Businesses',
    status: 'demo',
    image: '/assets/img/retail.svg',
    blurb: 'Stock across warehouses, supplier orders, branch sales and reorder intelligence in one distribution system.',
    capabilities: ['Inventory', 'Suppliers', 'Reorder alerts', 'Branch sales', 'AI analytics'],
    detail: {
      problem: 'Distribution businesses run blind between branches: what sold, what remains and what to reorder lives in separate sheets.',
      solution: 'One system for stock, suppliers, transfers and branch performance, with an assistant that flags what needs attention.',
      features: ['Warehouse & branch stock', 'Purchase orders', 'Inter-branch transfers', 'Branch sales dashboards', 'Reorder suggestions'],
      experience: 'A manager opens one dashboard and knows today what would otherwise surface at month end.',
      tech: ['Inventory engine', 'Supplier ordering', 'Analytics assistant'],
      value: 'Right stock in the right branch, with cash released from dead inventory. Launch CommerceOS above.'
    }
  },
  {
    id: 'ecommerce-storefront',
    name: 'E-commerce Storefront & Fulfilment',
    category: 'Retail',
    industry: 'Online Sellers',
    status: 'concept',
    image: '/assets/img/ecommerce.svg',
    blurb: 'Kenyan-first storefront: catalogue to M-Pesa checkout to rider dispatch, with stock that stays true.',
    capabilities: ['Catalogue', 'M-Pesa checkout', 'Stock sync', 'Dispatch board'],
    detail: {
      problem: 'Global e-commerce platforms assume card payments and international shipping that do not match local reality.',
      solution: 'A storefront built around M-Pesa and local couriers: catalogue, checkout, payment confirmation, dispatch and returns in one loop.',
      features: ['Product catalogue & search', 'M-Pesa express checkout', 'Live stock reservation', 'Courier dispatch board', 'Order status messaging'],
      experience: 'A shopper pays by M-Pesa in under a minute and watches the order move to their door.',
      tech: ['Storefront app', 'Payment gateway', 'Fulfilment workflow'],
      value: 'Conversion rates local buyers actually complete, and no overselling.'
    }
  },
  {
    id: 'loyalty',
    name: 'Loyalty & Customer Wallet',
    category: 'Retail',
    industry: 'Repeat Retail',
    status: 'concept',
    image: '/assets/img/crm.svg',
    blurb: 'Points, stamps and member pricing that work across branches and straight from the POS.',
    capabilities: ['Points ledger', 'Member tiers', 'Campaign offers', 'POS integration'],
    detail: {
      problem: 'Paper loyalty cards stay in drawers and marketing blasts everyone identically.',
      solution: 'A digital wallet tied to the phone number: earn at the till, spend anywhere, and target offers by real purchase behaviour.',
      features: ['Phone-number membership', 'Points & stamp campaigns', 'Tiered benefits', 'Targeted offer delivery via WhatsApp/SMS', 'Redemption analytics'],
      experience: 'A cashier asks for the phone number; balances and offers appear instantly.',
      tech: ['Ledger integrity rules', 'POS integration', 'Messaging hooks'],
      value: 'Repeat visits become measurable instead of hopeful.'
    }
  },

  /* ================= HOSPITALITY ================= */
  {
    id: 'hospitalityos',
    name: 'HospitalityOS Restaurant Suite',
    category: 'Hospitality',
    industry: 'Restaurant Groups',
    status: 'demo',
    image: '/assets/img/hospitality.svg',
    blurb: 'The full restaurant journey demonstrated end to end: ordering, M-Pesa, kitchen display, riders and branch reports.',
    capabilities: ['Ordering', 'M-Pesa', 'Kitchen display', 'Rider tracking', 'Multi-branch'],
    detail: {
      problem: 'Restaurants stitch together waiters’ notepads, separate payment tools and group chats for riders.',
      solution: 'One suite where the order is the spine: paid orders appear on kitchen screens, completed plates summon riders, managers watch branch dashboards.',
      features: ['Dine-in & online ordering', 'M-Pesa payments', 'Kitchen display system', 'Rider dispatch & tracking', 'Branch performance reports'],
      experience: 'Walk the entire journey in the demo above — from payment confirmation to doorstep.',
      tech: ['Order state machine', 'KDS screens', 'Payments integration'],
      value: 'Speed and accuracy customers can taste, with numbers managers can trust.'
    }
  },
  {
    id: 'hotel-pms',
    name: 'Hotel Front Desk & Housekeeping',
    category: 'Hospitality',
    industry: 'Hotels & Lodges',
    status: 'concept',
    image: '/assets/img/venue.svg',
    blurb: 'Room rack, walk-ins, housekeeping status and guest folios without the imported-software price tag.',
    capabilities: ['Room rack', 'Walk-in desk', 'Housekeeping boards', 'Guest folios'],
    detail: {
      problem: 'Small hotels run on paper registers while international PMS platforms price and complexity far beyond them.',
      solution: 'A right-sized property system: room statuses at a glance, fast check-in/out, housekeeping coordination and folio charges including M-Pesa.',
      features: ['Live room rack', 'Quick walk-in check-in', 'Housekeeping status board', 'Guest folios & invoicing', 'Occupancy & rate reporting'],
      experience: 'A receptionist checks in a walk-in in under two minutes, room ready or not.',
      tech: ['Availability engine', 'Folios & billing', 'M-Pesa payments'],
      value: 'Full-house control for properties that could never justify enterprise PMS pricing.'
    }
  },
  {
    id: 'venue-events',
    name: 'Venue & Events Management',
    category: 'Hospitality',
    industry: 'Event Venues',
    status: 'concept',
    image: '/assets/img/venue.svg',
    blurb: 'Halls, bookings, function sheets and deposit tracking for spaces hired by the day.',
    capabilities: ['Space calendar', 'Function sheets', 'Deposits', 'Vendor coordination'],
    detail: {
      problem: 'Venues double-book Saturdays and chase deposits over phone calls.',
      solution: 'A venue calendar where every enquiry becomes a quotation, then a held slot, then a contracted event with deposits recorded.',
      features: ['Multi-space calendar', 'Quotation builder', 'Deposit & balance tracking', 'Function sheet generation', 'Vendor & catering coordination'],
      experience: 'A coordinator sees every space, every weekend, every outstanding balance on one screen.',
      tech: ['Booking engine', 'Quotation templates', 'Payment tracking'],
      value: 'Peak weekends sell out deliberately instead of chaotically.'
    }
  },

  /* ================= FINTECH ================= */
  {
    id: 'payrail',
    name: 'Payments Rail & Reconciliation',
    category: 'FinTech',
    industry: 'Any Business Taking Payments',
    status: 'demo',
    image: '/assets/img/fintech.svg',
    blurb: 'M-Pesa and card payments wired into your system with automatic matching, so nothing is reconciled by spreadsheet.',
    capabilities: ['STK push', 'Card checkout', 'Auto-reconciliation', 'Settlement reports'],
    detail: {
      problem: 'Payments land in one system, orders in another, and somebody spends Mondays matching them manually.',
      solution: 'A payments layer that confirms transactions into your records in real time and reconciles automatically, with settlement reports for finance.',
      features: ['M-Pesa STK push & callbacks', 'Card checkout integration', 'Realtime confirmation webhooks', 'Automatic reconciliation', 'Daily settlement reports'],
      experience: 'A customer pays; the order flips to paid before they close the dialog.',
      tech: ['Payment gateway integrations', 'Idempotent webhook processing', 'Ledger design'],
      value: 'Zero manual matching and a trustworthy daily cash position.'
    }
  },
  {
    id: 'sacco-core',
    name: 'Savings & Group Banking Core',
    category: 'FinTech',
    industry: 'Chamas, SACCOs & Table Banking',
    status: 'concept',
    image: '/assets/img/fintech.svg',
    blurb: 'Member contributions, loans, guarantees and statements for group savings schemes, with M-Pesa at the centre.',
    capabilities: ['Member ledger', 'Group loans', 'Guarantors', 'Statements'],
    detail: {
      problem: 'Group savings run on treasurer notebooks; disputes start where the records blur.',
      solution: 'A shared ledger every member can inspect: contributions by M-Pesa, loan applications with guarantor consent, and automatic interest calculations.',
      features: ['Member & contribution ledgers', 'Loan products with guarantors', 'M-Pesa collections', 'Dividend & interest computation', 'Shareable statements'],
      experience: 'Members check their balances on the phone instead of waiting for the meeting.',
      tech: ['Double-entry ledger', 'M-Pesa C2B', 'Statement generator'],
      value: 'Trust through transparency — the ledger is the referee, not the treasurer’s notebook.'
    }
  },
  {
    id: 'expense-ops',
    name: 'Expense & Petty Cash Ops',
    category: 'FinTech',
    industry: 'Finance Teams',
    status: 'concept',
    image: '/assets/img/bi.svg',
    blurb: 'Receipts photographed, expenses coded, approvals routed and floats topped up without paper chasing.',
    capabilities: ['Receipt capture', 'Approval chains', 'Float top-ups', 'Spend reports'],
    detail: {
      problem: 'Petty cash disappears into a drawer of crumpled receipts nobody audits until year end.',
      solution: 'Staff photograph receipts on the spot; coding, approval and float replenishment all flow through one auditable loop.',
      features: ['Mobile receipt capture', 'Category coding with limits', 'Approval chains', 'Float & top-up management', 'Spend analytics by team'],
      experience: 'Submitting an expense takes thirty seconds at the point of purchase, not a month-end scramble.',
      tech: ['Mobile capture', 'Approval workflows', 'Accounting exports'],
      value: 'Clean audit trails and finance teams who stop being debt collectors.'
    }
  },

  /* ================= REAL ESTATE ================= */
  {
    id: 'propertyos',
    name: 'PropertyOS Property Management',
    category: 'Real Estate',
    industry: 'Landlords & Property Managers',
    status: 'demo',
    image: '/assets/img/realestate.svg',
    blurb: 'Tenants pay rent and report maintenance online; owners watch collections, vacancies and viewings live.',
    capabilities: ['Tenant portal', 'Rent collection', 'Maintenance', 'Viewings', 'AI leasing'],
    detail: {
      problem: 'Rent arrives by cash and screenshot, maintenance by word of mouth, and vacancy lists live in one agent’s head.',
      solution: 'A portal for tenants and a dashboard for owners: rent with M-Pesa receipts, maintenance tickets, unit status and booked viewings.',
      features: ['Tenant self-service portal', 'M-Pesa rent collection & receipts', 'Maintenance ticket workflow', 'Vacancy & viewing management', 'Owner collection reports'],
      experience: 'A tenant pays from their phone and gets a receipt; the landlord sees it land the same minute.',
      tech: ['Portal app', 'M-Pesa integration', 'Ticketing workflow'],
      value: 'Collections you can verify, tenants who self-serve, agents freed from chasing arrears. Launch PropertyOS above.'
    }
  },
  {
    id: 'leases-admin',
    name: 'Lease Administration & Renewals',
    category: 'Real Estate',
    industry: 'Commercial Property',
    status: 'concept',
    image: '/assets/img/realestate.svg',
    blurb: 'Every lease term, escalation clause and renewal deadline tracked so nothing lapses by surprise.',
    capabilities: ['Lease abstracts', 'Escalation clauses', 'Renewal alerts', 'Tenant mix reports'],
    detail: {
      problem: 'Leases sit in cabinets; escalation dates pass unclaimed and renewals are negotiated in a panic.',
      solution: 'Leases are abstracted into data: critical dates, escalation clauses and obligations tracked with warnings well ahead.',
      features: ['Lease abstraction records', 'Critical-date alerting', 'Escalation & indexation calculation', 'Renewal pipeline', 'Tenant mix analytics'],
      experience: 'A manager gets ninety days notice of every decision that matters, not three.',
      tech: ['Date engine', 'Document store', 'Reporting'],
      value: 'Revenue that was contractually owed finally gets collected, on time.'
    }
  },

  /* ================= EDUCATION ================= */
  {
    id: 'school-core',
    name: 'School Management System',
    category: 'Education',
    industry: 'Schools & Colleges',
    status: 'concept',
    image: '/assets/img/education.svg',
    blurb: 'Admissions, attendance, fee statements, exams and parent messaging in one school system.',
    capabilities: ['Admissions', 'Attendance', 'Fee statements', 'Exam records', 'Parent SMS'],
    detail: {
      problem: 'School records split across exercise books, Excel and memory make fee chasing and report writing a nightmare.',
      solution: 'One student record feeding everything: attendance, assessments, fee balances and messages home.',
      features: ['Admissions pipeline', 'Class registers & attendance', 'Fee statements & M-Pesa payment posting', 'Exams & report cards', 'Bulk parent messaging'],
      experience: 'A teacher marks the register in a tap; accounts see balances update the same moment.',
      tech: ['Student information system', 'Fee ledger', 'Messaging gateway'],
      value: 'Teachers teach, accounts collect, parents stay informed — from one register. Ask us for a walkthrough.'
    }
  },
  {
    id: 'student-portal',
    name: 'Student & Parent Portal',
    category: 'Education',
    industry: 'Schools & Colleges',
    status: 'concept',
    image: '/assets/img/education.svg',
    blurb: 'Timetables, results, fee balances and school announcements on any phone, in any browser.',
    capabilities: ['Timetable', 'Results', 'Fee balance', 'Announcements'],
    detail: {
      problem: 'Parents learn about fee balances and performance at termly meetings — months too late to act.',
      solution: 'A lightweight portal where parents and students see timetables, results, balances and notices the day they change.',
      features: ['Live timetable', 'Result slips per exam', 'Fee balance & payment history', 'Announcement feed', 'Low-bandwidth design'],
      experience: 'Works on a borrowed phone over 2G, because that is reality for many families.',
      tech: ['Progressive web app', 'Push/SMS notifications', 'Read-only sync'],
      value: 'Surprises disappear; engagement goes up without a single extra meeting.'
    }
  },
  {
    id: 'course-platform',
    name: 'Course & Training Platform',
    category: 'Education',
    industry: 'Training Providers',
    status: 'concept',
    image: '/assets/img/education.svg',
    blurb: 'Enrolment, lesson delivery, assignments and certificates for training businesses — with M-Pesa enrolments.',
    capabilities: ['Enrolments', 'Lesson library', 'Assignments', 'Certificates'],
    detail: {
      problem: 'Training providers run cohorts over WhatsApp with manual payment tracking and no learning records.',
      solution: 'A course platform where enrolment is a payment, lessons unlock progressively and completion issues certificates automatically.',
      features: ['Course catalogue & cohort intakes', 'M-Pesa enrolment', 'Lesson & resource library', 'Assignment submission & feedback', 'Auto-issued certificates'],
      experience: 'A learner pays, joins and progresses entirely from a phone.',
      tech: ['LMS core', 'Payment integration', 'Certificate generation'],
      value: 'Providers scale cohorts without drowning in admin, and students own their progress.'
    }
  },

  /* ================= DATA & OPERATIONS ================= */
  {
    id: 'bi-dashboard',
    name: 'Executive BI Dashboard',
    category: 'Data & Operations',
    industry: 'Management Teams',
    status: 'demo',
    image: '/assets/img/bi.svg',
    blurb: 'Revenue against target, segment mix and exception alerts — the numbers that run the meeting, on one screen.',
    capabilities: ['KPI tiles', 'Targets vs actual', 'Segment mix', 'Alert feed'],
    detail: {
      problem: 'Management meetings open with three people presenting three versions of the truth.',
      solution: 'One dashboard fed directly by the operational systems, with targets, trends and exception alerts agreed in advance.',
      features: ['Live KPI tiles', 'Target vs actual tracking', 'Segment & branch breakdowns', 'Exception alert stream', 'Board-ready exports'],
      experience: 'Meetings argue about decisions, not about whose spreadsheet is right.',
      tech: ['Warehouse modelling', 'Dashboard framework', 'Alert rules'],
      value: 'Decisions get faster because the facts arrive first. A working slice runs in the capability stage above.'
    }
  },
  {
    id: 'dataops',
    name: 'Data Pipeline & Warehouse',
    category: 'Data & Operations',
    industry: 'Growing Businesses',
    status: 'concept',
    image: '/assets/img/dataops.svg',
    blurb: 'POS, ERP and web data flowing nightly into one warehouse that feeds every report and AI answer.',
    capabilities: ['Source sync', 'Modelling', 'Quality checks', 'Report serving'],
    detail: {
      problem: 'Every new report means another manual export-and-VLOOKUP session that breaks next month.',
      solution: 'Pipelines pull from each source system nightly into modelled tables, with quality checks before anything serves to dashboards.',
      features: ['Connector framework', 'Nightly/incremental sync', 'Data quality gates', 'Modelled marts per team', 'History & auditability'],
      experience: 'Analysts query one trusted warehouse instead of assembling seven CSVs.',
      tech: ['ELT pipelines', 'SQL warehouse', 'Quality monitoring'],
      value: 'Reports become cheap, consistent and trusted enough to act on.'
    }
  },
  {
    id: 'inventory-intel',
    name: 'Inventory Intelligence Engine',
    category: 'Data & Operations',
    industry: 'Stock-holding Businesses',
    status: 'concept',
    image: '/assets/img/bi.svg',
    blurb: 'Demand patterns per SKU per branch drive reorder points, transfer suggestions and dead-stock alerts.',
    capabilities: ['Demand forecasting', 'Reorder points', 'Transfer suggestions', 'Dead-stock alerts'],
    detail: {
      problem: 'Reorder levels set once never adapt, so some items stock out while others pile up.',
      solution: 'Sales history trains per-SKU, per-branch demand profiles that adjust reorder points and suggest transfers between branches.',
      features: ['SKU × branch demand profiles', 'Dynamic reorder points', 'Inter-branch transfer suggestions', 'Dead-stock & markdown flags', 'Working-capital reports'],
      experience: 'The system proposes the weekly transfer list; a manager approves in minutes.',
      tech: ['Forecasting models', 'Optimisation rules', 'Inventory integration'],
      value: 'Working capital shifts from dusty shelves to the lines that sell. A working slice runs in the capability stage above.'
    }
  },

  /* ================= DIGITAL EXPERIENCES ================= */
  {
    id: 'customer-portal',
    name: 'Customer Self-Service Portal',
    category: 'Digital Experiences',
    industry: 'Service Businesses',
    status: 'concept',
    image: '/assets/img/professional.svg',
    blurb: 'Accounts, orders, documents and requests in one branded portal — the end of "please email us".',
    capabilities: ['Login & accounts', 'Order history', 'Document vault', 'Request forms'],
    detail: {
      problem: 'Customers call for information their provider could show them, tying up staff on repetitive questions.',
      solution: 'A branded portal where each customer sees their own orders, statements, documents and can raise requests that become tracked jobs.',
      features: ['Secure login & roles', 'Order/account history', 'Document downloads', 'Request forms → tracked tickets', 'Status notifications'],
      experience: 'Customers help themselves at 11pm; staff handle only what genuinely needs a person.',
      tech: ['Auth & roles', 'Portal app', 'Notification engine'],
      value: 'Support load drops while perceived service rises — the cheapest growth there is.'
    }
  },
  {
    id: 'brand-site-experience',
    name: 'Premium Brand Site Experience',
    category: 'Digital Experiences',
    industry: 'Brand-led Businesses',
    status: 'concept',
    image: '/assets/img/apex.svg',
    blurb: 'Editorial, cinematic brand websites engineered to load fast on Kenyan mobile networks.',
    capabilities: ['Art direction', 'Motion design', 'Performance budgets', 'SEO foundation'],
    detail: {
      problem: 'Beautiful sites are usually heavy, and fast sites are usually generic.',
      solution: 'Art-directed experiences built with strict performance budgets: self-hosted fonts, edge delivery, motion that respects reduced-motion settings.',
      features: ['Custom art direction', 'Scroll-driven storytelling', 'Sub-second loads on 3G', 'Accessible interactions', 'CMS-editable content'],
      experience: 'Feels like a film title sequence, loads like a news site.',
      tech: ['Static-first architecture', 'Edge CDN', 'Motion systems'],
      value: 'A brand impression that survives a weak network.'
    }
  },
  {
    id: 'member-subscriptions',
    name: 'Membership & Subscription Platform',
    category: 'Digital Experiences',
    industry: 'Communities & Media',
    status: 'concept',
    image: '/assets/img/security.svg',
    blurb: 'Sign-up tiers, recurring M-Pesa/card billing and gated member content with churn-saving dunning flows.',
    capabilities: ['Tier sign-up', 'Recurring billing', 'Gated content', 'Dunning flows'],
    detail: {
      problem: 'Subscription businesses leak revenue to failed payments and have no idea who lapsed.',
      solution: 'A platform handling recurring billing with automatic retries, grace periods and win-back messaging before cancellation.',
      features: ['Tiered membership plans', 'M-Pesa & card recurring billing', 'Members-only content gating', 'Failed-payment recovery flows', 'Churn & cohort reporting'],
      experience: 'A member updates their plan in seconds; failed payments recover silently.',
      tech: ['Recurring billing engine', 'Access control', 'Lifecycle messaging'],
      value: 'Predictable monthly revenue instead of monthly surprises.'
    }
  },

  /* ================= CREATIVE STUDIO ================= */
  {
    id: 'creative-brand-exp',
    name: 'Living Brand Experience',
    category: 'Creative',
    industry: 'Identity & Interaction',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-brand.svg',
    blurb: 'Identity systems translated into motion, interaction and responsive behaviour — brands that behave consistently everywhere.',
    capabilities: ['Identity systems', 'Motion language', 'Interaction design', 'Brand guidelines'],
    detail: {
      problem: 'Brands invest in identity PDFs that die in drawers while every channel improvises.',
      solution: 'We translate identity into living systems: motion principles, interaction behaviour and component libraries teams can actually ship.',
      features: ['Logo & identity systems', 'Motion and transition language', 'Interaction patterns', 'Component libraries', 'Usage guidelines that live online'],
      experience: 'Every touchpoint feels drawn by one hand, on screen and in print.',
      tech: ['Design tokens', 'Component systems', 'Prototyping tools'],
      value: 'A brand that stays coherent as it grows.'
    }
  },
  {
    id: 'creative-launch',
    name: 'Product Launch Experience',
    category: 'Creative',
    industry: 'Launch Campaigns',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-launch.svg',
    blurb: 'Countdown, reveal and first-order moments composed into one launch arc for a new product entering the market.',
    capabilities: ['Launch arcs', 'Countdown pages', 'Waitlist mechanics', 'Reveal moments'],
    detail: {
      problem: 'Launches announce once and vanish, instead of building anticipation into demand.',
      solution: 'A sequenced launch experience: teaser, countdown, reveal, waitlist and first-order flow — each stage measured against the next.',
      features: ['Teaser & countdown phases', 'Waitlist capture', 'Reveal-day storytelling', 'First-order conversion flow', 'Stage-by-stage analytics'],
      experience: 'Audiences move from curiosity to ownership inside one designed arc.',
      tech: ['Landing systems', 'Waitlist tooling', 'Analytics instrumentation'],
      value: 'Day-one demand instead of a quiet announcement.'
    }
  },
  {
    id: 'creative-campaign',
    name: 'Connected Campaign Concept',
    category: 'Creative',
    industry: 'Integrated Marketing',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-campaign.svg',
    blurb: 'One campaign story carried across web, print, OOH and WhatsApp with a single measurement spine.',
    capabilities: ['Campaign concepts', 'Cross-channel story', 'Measurement spine', 'Creative production'],
    detail: {
      problem: 'Campaigns fragment across channels, each measuring itself differently, none telling one story.',
      solution: 'A connected concept: one narrative expressed natively per channel, tied together by shared codes and a single measurement spine.',
      features: ['Core narrative & art direction', 'Channel-native executions', 'Trackable response codes', 'WhatsApp continuation journeys', 'Unified measurement dashboard'],
      experience: 'Someone photographs a poster, messages the code, and continues the story in chat.',
      tech: ['QR/deeplink infrastructure', 'Attribution tracking', 'Journey automation'],
      value: 'Every shilling of campaign spend becomes attributable.'
    }
  },
  {
    id: 'creative-immersive',
    name: 'Immersive Web Story',
    category: 'Creative',
    industry: 'Digital Storytelling',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-immersive.svg',
    blurb: 'Scroll-driven narratives with depth, parallax and sound that still load fast on mid-range phones.',
    capabilities: ['Scroll choreography', 'Depth & parallax', 'Sound design', 'Performance discipline'],
    detail: {
      problem: 'Immersive storytelling usually ships as a heavy microsite that half the audience never finishes loading.',
      solution: 'Narrative depth built with disciplined engineering: scroll choreography, layered visuals and optional sound within strict weight budgets.',
      features: ['Chaptered scroll narrative', 'Parallax depth systems', 'Reduced-motion alternatives', 'Optional audio layers', 'Mid-range phone performance targets'],
      experience: 'Readers finish the story because it never stutters or stalls.',
      tech: ['Scroll-driven animation', 'Asset optimisation', 'Lazy loading'],
      value: 'Stories people complete and share.'
    }
  },
  {
    id: 'creative-installation',
    name: 'Reactive Space Installation',
    category: 'Creative',
    industry: 'Physical Spaces',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-installation.svg',
    blurb: 'Screens and sound that respond to people moving through a lobby, showroom or event space.',
    capabilities: ['Presence sensing', 'Generative visuals', 'Spatial audio', 'Content scheduling'],
    detail: {
      problem: 'Digital signage plays loops nobody watches and spaces feel identical to every visitor.',
      solution: 'Installations that sense presence and respond: visuals bloom as visitors approach, audio shifts with crowd density, content schedules by time and audience.',
      features: ['Camera/radar presence sensing', 'Generative visual engines', 'Spatial audio scenes', 'Dayparted content scheduling', 'Remote monitoring'],
      experience: 'The space acknowledges you — subtly, memorably.',
      tech: ['Sensor hardware integration', 'Realtime graphics', 'Edge compute'],
      value: 'Spaces that make impressions physical visitors describe to others.'
    }
  },
  {
    id: 'creative-motion',
    name: 'Kinetic Type & Title Design',
    category: 'Creative',
    industry: 'Film, Video & Events',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-motion.svg',
    blurb: 'Title sequences, kinetic typography and event idents where the typography itself carries the message.',
    capabilities: ['Title sequences', 'Kinetic typography', 'Event idents', 'Transition systems'],
    detail: {
      problem: 'Openers and idents default to stock templates that say nothing about the brand behind them.',
      solution: 'Typography-first motion design: sequences where rhythm, timing and type carry meaning specific to the brand or event.',
      features: ['Custom title sequences', 'Kinetic type systems', 'Event opening idents', 'Lower-third & transition kits', 'Deliverables for screen sizes'],
      experience: 'Viewers feel intention in the first three seconds.',
      tech: ['Motion toolchains', 'Type systems', 'Render pipelines'],
      value: 'Ownable motion instead of borrowed template feel.'
    }
  },
  {
    id: 'creative-3d',
    name: '3D Product Visualisation',
    category: 'Creative',
    industry: 'Products & Retail',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-3d.svg',
    blurb: 'Photoreal product renders and interactive turnarounds that live on the web — one model, every angle and variant.',
    capabilities: ['Product modelling', 'Lighting & materials', 'Web turnarounds', 'Variant renders'],
    detail: {
      problem: 'Product photography costs multiply with every colour, angle and market variant.',
      solution: 'Model once, render everywhere: photoreal stills, variant matrices and interactive turnarounds embedded directly in the storefront.',
      features: ['Product modelling & texturing', 'Studio lighting setups', '360° web turnarounds', 'Colour/material variant renders', 'AR-ready exports'],
      experience: 'Shoppers spin, zoom and switch variants without waiting for a reshoot.',
      tech: ['3D modelling', 'Physically based rendering', 'WebGL embedding'],
      value: 'Catalogue imagery at a fraction of repeated photography cost.'
    }
  },
  {
    id: 'creative-editorial',
    name: 'Digital Editorial Design',
    category: 'Creative',
    industry: 'Publishing & Reports',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-editorial.svg',
    blurb: 'Long-form reports and magazines designed for screens: grids, type scales and rhythm that respect readers.',
    capabilities: ['Grid systems', 'Type scales', 'Reading rhythm', 'Report design'],
    detail: {
      problem: 'Annual reports and long-form journalism get pasted into PDFs nobody reads on a phone.',
      solution: 'Editorial design native to screens: typographic grids, considered scales and pacing that keep readers moving through thousands of words.',
      features: ['Screen-native grid systems', 'Typographic hierarchy', 'Chapter navigation', 'Data visualisation styling', 'Print-quality export paths'],
      experience: 'Reading a 40-page report on a phone stops feeling like punishment.',
      tech: ['CSS layout systems', 'Variable fonts', 'Chart styling'],
      value: 'Your best thinking actually gets read.'
    }
  },
  {
    id: 'creative-packaging',
    name: 'Packaging & Unboxing Concept',
    category: 'Creative',
    industry: 'Physical Products',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-packaging.svg',
    blurb: 'Dielines, print proofs and the unboxing film — packaging treated as media, not an afterthought.',
    capabilities: ['Dieline design', 'Print supervision', 'Unboxing films', 'Shelf testing'],
    detail: {
      problem: 'Packaging designed for the shelf alone misses the second audience: everyone who watches it opened online.',
      solution: 'Packaging developed as both object and media — dielines engineered for print, then staged and filmed for the unboxing moment.',
      features: ['Structural dieline design', 'Print-proof supervision', 'Unboxing film production', 'Shelf-visibility testing', 'Social-ready cutdowns'],
      experience: 'The box earns its ten seconds of fame and protects the product besides.',
      tech: ['Print production', 'Video production', 'Prototype iteration'],
      value: 'Free reach from every parcel shipped.'
    }
  },
  {
    id: 'creative-dataart',
    name: 'Generative Data Artwork',
    category: 'Creative',
    industry: 'Culture & Brand',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-dataart.svg',
    blurb: 'Business numbers rendered as generative artwork — annual reports, anniversaries and lobbies with living data.',
    capabilities: ['Generative systems', 'Data translation', 'Large-format output', 'Live renderings'],
    detail: {
      problem: 'Data visualisation stops at dashboards, and brand art ignores the numbers that make the company real.',
      solution: 'Generative systems that translate real figures — sales, growth, geography — into compositions for print, screens and lobby installations.',
      features: ['Parameter-driven generative systems', 'Live data feeds', 'Large-format print outputs', 'Lobby & event screen loops', 'Commemorative editions'],
      experience: 'The quarter’s numbers hang on the wall as something people stop to look at.',
      tech: ['Generative algorithms', 'Plotter/large-format printing', 'Live rendering'],
      value: 'Culture pieces that are literally made of the business.'
    }
  },
  {
    id: 'creative-retail-x',
    name: 'Connected Retail Experience',
    category: 'Creative',
    industry: 'Retail Spaces',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-retail.svg',
    blurb: 'Store shelves bridged to the digital layer: scan-for-story tags, AR try-on and one basket across physical and online.',
    capabilities: ['Smart shelf tags', 'AR try-on', 'Unified basket', 'Store analytics'],
    detail: {
      problem: 'Physical stores cannot answer "do you have this in blue?" and online stores cannot let you touch the fabric.',
      solution: 'A connected layer over the shop floor: tags that open stories and stock checks, AR previews, and one basket spanning shelf and website.',
      features: ['QR/NFC smart shelf tags', 'AR product try-on', 'Unified online/offline basket', 'Footfall & dwell analytics', 'Staff tablet companion'],
      experience: 'Scan a tag, see the story, reserve the size, pay either way.',
      tech: ['NFC/QR infrastructure', 'WebAR', 'Inventory sync'],
      value: 'The store stops competing with the website and starts completing it.'
    }
  },
  {
    id: 'creative-event-x',
    name: 'Event Digital Layer',
    category: 'Creative',
    industry: 'Events & Activations',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-event.svg',
    blurb: 'Stages with a second life on screens: registration, live overlays, second-screen interactions and highlight reels.',
    capabilities: ['Registration', 'Live overlays', 'Second screens', 'Highlight reels'],
    detail: {
      problem: 'Events end when the room empties, capturing nothing for the months until the next one.',
      solution: 'A digital layer around the event: smooth registration, live lower-thirds and overlays, audience second-screen moments, and highlights cut the same night.',
      features: ['Registration & check-in flow', 'Live stage overlays', 'Second-screen interactions', 'Same-night highlight editing', 'Post-event content packs'],
      experience: 'Attendees participate twice — once in the room, once in the feed.',
      tech: ['Registration systems', 'Live graphics', 'Rapid video editing'],
      value: 'One event funds content for a quarter.'
    }
  },
  {
    id: 'creative-hotel-x',
    name: 'Hotel Guest Journey Concept',
    category: 'Creative',
    industry: 'Hospitality Experience',
    type: 'creative',
    status: 'concept',
    image: '/assets/img/creative-hotel.svg',
    blurb: 'The whole guest journey — booking to review — carried in one WhatsApp thread with keys, menus and concierge built in.',
    capabilities: ['Chat-first journey', 'Digital keys', 'In-chat concierge', 'Checkout flow'],
    detail: {
      problem: 'Guests juggle a booking site, a key card, a room-phone menu and a feedback form — four systems, zero continuity.',
      solution: 'One conversational thread from booking to checkout: confirmations, digital key issuance, in-chat concierge and review capture.',
      features: ['Booking & pre-arrival chat', 'Digital key issuance', 'In-chat concierge & menus', 'Express checkout & folio', 'Review moment design'],
      experience: 'The guest never installs anything and never queues at reception.',
      tech: ['WhatsApp Business API', 'Key system integration', 'PMS hooks'],
      value: 'Higher reviews, lower front-desk load, and upsells offered at the right moment.'
    }
  }
];

/* Creative entries are filtered by `type` OR by category === 'Creative'. */
export const CREATIVE_PROJECTS = PROJECTS.filter((p) => p.type === 'creative');
export const TECH_PROJECTS = PROJECTS.filter((p) => p.type !== 'creative');

export function projectById(id) {
  return PROJECTS.find((p) => p.id === id) || null;
}
