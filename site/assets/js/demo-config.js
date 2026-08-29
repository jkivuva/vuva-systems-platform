// Vuva demo config — maps every portfolio project to its interactive demo
// and supporting visuals. All 62 projects are covered.
//
//   demo: { type, title, ...typeOptions }   -> interactive demonstration
//   how:  [step, step, ...]                 -> "How it works" workflow strip
//   visuals: [{src, alt, caption}]          -> industry-relevant imagery
//   cta: { label }                          -> conversion button label

const P = (f) => '/assets/img/photos/' + f;

export const DEMO_CONFIG = {
  /* ================= CLIENT / REAL WORK ================= */
  'limitless-logistics': {
    demo: { type: 'tracking', title: 'Track a Limitless Logistics Shipment' },
    how: ['Customer books & pays', 'Cargo scanned at pickup', 'GPS streams live position', 'Customer self-serves status', 'Proof of delivery captured'],
    visuals: [
      { src: P('truck-highway.jpg'), alt: 'Freight truck on the highway', caption: 'Fleet on the Northern Corridor' },
      { src: P('warehouse-shelves.jpg'), alt: 'Warehouse racking', caption: 'Cross-dock operations' },
      { src: P('port-crane.jpg'), alt: 'Port crane loading containers', caption: 'Port & border milestones' }
    ],
    cta: { label: "Yes — Build My Logistics Platform" }
  },
  'blitz-restaurant': {
    demo: { type: 'shop', title: 'Order from the Restaurant' },
    how: ['Customer orders & pays via M-Pesa', 'Kitchen ticket fires instantly', 'Rider dispatched on completion', 'Customer tracks the rider live', 'Branch report updates automatically'],
    visuals: [
      { src: P('food-pizza.jpg'), alt: 'Fresh pizza from the kitchen', caption: 'Kitchen display integration' },
      { src: P('chef-kitchen.jpg'), alt: 'Chef at work', caption: 'Live kitchen tickets' },
      { src: P('delivery-rider.jpg'), alt: 'Delivery rider', caption: 'Rider dispatch & tracking' }
    ],
    cta: { label: "Yes — Build My Restaurant OS" }
  },
  'vuva-platform': {
    demo: { type: 'gallery', title: 'Platform Tour', slides: [
      { src: '/assets/img/enterprise.svg', title: 'Edge deployment', caption: 'Cloudflare Workers with strict security headers' },
      { src: '/assets/img/security.svg', title: 'Verified webhooks', caption: 'Signed WhatsApp deliveries, secrets never in the browser' },
      { src: '/assets/img/bi.svg', title: 'Private operations area', caption: 'D1 database with basic-auth gate' }
    ] },
    how: ['Visitor lands on the edge', 'Interactive demos load instantly', 'AI consultant qualifies the enquiry', 'WhatsApp webhook signs & verifies', 'Internal area tracks prospects'],
    visuals: [
      { src: P('server-room.jpg'), alt: 'Server racks', caption: 'Edge infrastructure mindset' },
      { src: P('network-cables.jpg'), alt: 'Network cabling', caption: 'Wired for reliability' },
      { src: P('security-lock.jpg'), alt: 'Security', caption: 'Security by default' }
    ],
    cta: { label: "Yes — Build My Platform" }
  },
  apex: {
    demo: { type: 'gallery', title: 'Site Walkthrough', slides: [
      { src: '/assets/img/apex.svg', title: 'Editorial homepage', caption: 'Charcoal & gold identity, strong typography' },
      { src: P('meeting-room.jpg'), title: 'Services & case studies', caption: 'Six-page structure with clear hierarchy' },
      { src: P('handshake-deal.jpg'), title: 'Business-facing polish', caption: 'Built in WordPress + Elementor' }
    ] },
    how: ['Concept & identity', 'Design system in a child theme', 'Elementor layouts throughout', 'Responsive & SEO structure', 'Delivered as a local portfolio build'],
    visuals: [
      { src: P('design-workspace.jpg'), alt: 'Design workspace', caption: 'Design systems first' },
      { src: P('creative-studio.jpg'), alt: 'Studio work', caption: 'Typography-led layouts' },
      { src: P('art-gallery.jpg'), alt: 'Gallery wall', caption: 'Editorial presentation' }
    ],
    cta: { label: "Yes — Build My WordPress Site" }
  },
  'ai-content-platform': {
    demo: { type: 'aiFlow', title: 'Ask the Content Platform', scenarios: [
      { msg: 'Draft an intro to our logistics case study.', steps: [['Request received', 'Editor console · now'], ['Intent detected', 'Draft generation'], ['Sources retrieved', '3 internal docs cited'], ['Draft produced', 'Every claim linked to a source'], ['Review gate', 'Queued for editor approval before publishing']] },
      { msg: 'Find everything we wrote about M-Pesa integrations.', steps: [['Request received', 'Editor console · now'], ['Intent detected', 'Retrieval search'], ['Coverage check', '7 passages found, high confidence'], ['Answer composed', 'Citations inline, sources listed'], ['Logged', 'Search saved to the workspace history']] }
    ] },
    how: ['Editor requests a draft', 'RAG retrieves cited sources', 'Model drafts with citations', 'Coverage check refuses thin answers', 'Human approves before publish'],
    visuals: [
      { src: P('documents-pile.jpg'), alt: 'Documents', caption: 'Content corpus' },
      { src: P('analytics-screen.jpg'), alt: 'Analytics screen', caption: 'Evaluation harness' },
      { src: P('office-work.jpg'), alt: 'Editor at work', caption: 'Human-in-the-loop review' }
    ],
    cta: { label: "Yes — Build My AI Platform" }
  },

  /* ================= BUSINESS SYSTEMS ================= */
  lend: {
    demo: { type: 'workflow', title: 'Loan Application Pipeline', steps: [
      { label: 'Application submitted', detail: 'Applicant details + income captured on mobile' },
      { label: 'Automatic checks', detail: 'Rules engine validates affordability & KYC flags' },
      { label: 'Officer review queue', detail: 'Flagged cases routed with reasons attached' },
      { label: 'Approval & offer', detail: 'Digital offer generated and accepted' },
      { label: 'M-Pesa disbursement', detail: 'B2C payment sent, schedule created' }
    ] },
    how: ['Apply on mobile', 'Rules auto-screen', 'Officer reviews exceptions', 'Offer accepted digitally', 'M-Pesa disburses & repayments tracked'],
    visuals: [
      { src: P('finance-charts.jpg'), alt: 'Financial charts', caption: 'Affordability analytics' },
      { src: P('phone-payment.jpg'), alt: 'Mobile payment', caption: 'M-Pesa B2C disbursement' },
      { src: P('accountant-desk.jpg'), alt: 'Finance desk', caption: 'Officer review workspace' }
    ],
    cta: { label: "Yes — Build My Lending System" }
  },
  'crm-suite': {
    demo: { type: 'workflow', title: 'Lead → Deal Pipeline', steps: [
      { label: 'Lead captured', detail: 'Web form / WhatsApp / referral lands in one inbox' },
      { label: 'Owner assigned', detail: 'Round-robin with territory rules' },
      { label: 'Stage: Contacted', detail: 'Call task created with a due date' },
      { label: 'Quote generated', detail: 'Priced from the product catalogue' },
      { label: 'Stage: Won', detail: 'Invoice raised, CRM record archived happy' }
    ] },
    how: ['Every lead lands in one pipeline', 'Tasks assigned with deadlines', 'Overdue deals escalate', 'Quotes from templates', 'Managers see pipeline value live'],
    visuals: [
      { src: P('handshake-deal.jpg'), alt: 'Handshake', caption: 'Deals that close' },
      { src: P('call-center.jpg'), alt: 'Sales calls', caption: 'Follow-up engine' },
      { src: P('team-whiteboard.jpg'), alt: 'Team planning', caption: 'Pipeline visibility' }
    ],
    cta: { label: "Yes — Build My CRM" }
  },
  hris: {
    demo: { type: 'microRoster', title: 'Roster & Leave', staff: [
      { name: 'A. Njoroge', role: 'Sales' }, { name: 'B. Otieno', role: 'Operations' },
      { name: 'C. Wanjiku', role: 'Finance' }, { name: 'D. Kamau', role: 'Support' }
    ] },
    how: ['Leave requested on mobile', 'Manager approves with balance checked', 'Roster updates automatically', 'Payroll reads approved shifts', 'Payslips issued self-service'],
    visuals: [
      { src: P('team-whiteboard.jpg'), alt: 'Team planning', caption: 'Shift planning' },
      { src: P('meeting-room.jpg'), alt: 'Meeting', caption: 'Approvals in one place' },
      { src: P('office-work.jpg'), alt: 'Office', caption: 'People operations' }
    ],
    cta: { label: "Yes — Build My HR System" }
  },
  'legal-workspace': {
    demo: { type: 'microChecklist', title: 'Contract Review Flow', doneText: 'Contract approved for signature.', items: [
      { title: 'Draft from clause library', detail: 'Approved clauses only — no copy-paste from old files' },
      { title: 'Clause checks', detail: 'Liability, termination & jurisdiction flagged' },
      { title: 'Partner review', detail: 'Redlines tracked with comments' },
      { title: 'Client confirmation', detail: 'Version shared with an audit trail' }
    ], note: 'Tick each stage to walk the review flow.' },
    how: ['Assemble from approved clauses', 'Automated clause checks', 'Redline review with tasks', 'Version comparison', 'Signature-ready export'],
    visuals: [
      { src: P('documents-signing.jpg'), alt: 'Signing documents', caption: 'Signature-ready exports' },
      { src: P('documents-pile.jpg'), alt: 'Contract files', caption: 'Clause libraries' },
      { src: P('meeting-room.jpg'), alt: 'Review meeting', caption: 'Partner review stages' }
    ],
    cta: { label: "Yes — Build My Document Workspace" }
  },
  'booking-engine': {
    demo: { type: 'booking', title: 'Book a Service Slot' , industry: 'default'},
    how: ['Customer picks a service', 'Live availability shown', 'Slot confirmed in seconds', 'Reminders fire automatically', 'No-shows followed up'],
    visuals: [
      { src: P('reception-desk.jpg'), alt: 'Reception desk', caption: 'Front desk unchained from the phone' },
      { src: P('clinic-doctor.jpg'), alt: 'Consultation', caption: 'Works for clinics, salons, consultants' },
      { src: P('phone-payment.jpg'), alt: 'Mobile booking', caption: 'Book from any phone' }
    ],
    cta: { label: "Yes — Build My Booking System" }
  },
  'queue-system': {
    demo: { type: 'microQueue', title: 'Live Queue Board' , industry: 'default'},
    how: ['Ticket issued on arrival', 'Counters call the next number', 'Wait times tracked live', 'Displays guide customers', 'Peak-hour reports plan staffing'],
    visuals: [
      { src: P('call-center.jpg'), alt: 'Service counters', caption: 'Fair, ordered service' },
      { src: P('reception-desk.jpg'), alt: 'Reception', caption: 'Calm waiting rooms' },
      { src: P('analytics-screen.jpg'), alt: 'Wait analytics', caption: 'Data on every wait' }
    ],
    cta: { label: "Yes — Build My Queue System" }
  },
  'pos-retail': {
    demo: { type: 'shop', title: 'Counter Sale (Offline-safe)' , industry: 'default'},
    how: ['Barcode checkout in seconds', 'M-Pesa / card tender', 'Offline queue if network drops', 'Auto-sync when back online', 'Head office sees totals live'],
    visuals: [
      { src: P('checkout-counter.jpg'), alt: 'Checkout counter', caption: 'Tills that never stall' },
      { src: P('retail-store.jpg'), alt: 'Retail store', caption: 'Built for shop floors' },
      { src: P('supermarket-aisle.jpg'), alt: 'Supermarket aisle', caption: 'Multi-branch sync' }
    ],
    cta: { label: "Yes — Build My Point of Sale" }
  },

  /* ================= AI & AUTOMATION ================= */
  'agent-mesh': {
    demo: { type: 'aiFlow', title: 'Meet the Agents', scenarios: [
      { msg: 'Customer: "Can I change my delivery to Saturday?"', steps: [['Customer Agent engaged', 'Reads order & rider schedules'], ['Change evaluated', 'Saturday route has capacity'], ['Policy check', 'Free change — within limits'], ['Action executed', 'Delivery rescheduled, records updated'], ['Confirmation', 'Customer told in the same chat']] },
      { msg: 'Ops: "Summarise this week\'s late deliveries."', steps: [['Analytics Agent engaged', 'Reads shipment history'], ['Pattern found', 'Naivasha route accounts for 70%'], ['Summary drafted', 'With per-route breakdown'], ['Ops Agent acts', 'Alert sent to the route owner'], ['Escalation ready', 'Manager sees the same card']] }
    ] },
    how: ['Request arrives on any channel', 'Right agent picks it up', 'Tools read live business data', 'Guardrails check the action', 'Sensitive steps go to a person'],
    visuals: [
      { src: P('analytics-screen.jpg'), alt: 'Agent analytics', caption: 'Agents with audit trails' },
      { src: P('server-room.jpg'), alt: 'Compute', caption: 'Orchestrated on the edge' },
      { src: P('office-work.jpg'), alt: 'Human oversight', caption: 'Humans on sensitive paths' }
    ],
    cta: { label: "Yes — Build My AI Agents" }
  },
  'doc-intelligence': {
    demo: { type: 'finance', title: 'Extract & Post Invoices' , industry: 'default'},
    how: ['Invoice arrives by email', 'AI extracts fields & totals', 'Validation flags oddities', 'Human confirms values', 'Posted to ERP automatically'],
    visuals: [
      { src: P('documents-pile.jpg'), alt: 'Paper invoices', caption: 'From paper pile to records' },
      { src: P('accountant-desk.jpg'), alt: 'Finance desk', caption: 'Clerks review, not retype' },
      { src: P('office-work.jpg'), alt: 'Office processing', caption: 'Hours saved daily' }
    ],
    cta: { label: "Yes — Build My Document Pipeline" }
  },
  'invoice-flow': {
    demo: { type: 'finance', title: 'Invoice → Payment Flow' , industry: 'default'},
    how: ['Invoice captured', 'Three-way matched to POs', 'Routed for approval', 'Payment scheduled', 'Reconciled automatically'],
    visuals: [
      { src: P('finance-charts.jpg'), alt: 'Finance charts', caption: 'Cash position clarity' },
      { src: P('accountant-desk.jpg'), alt: 'Accounts desk', caption: 'Approvals in one queue' },
      { src: P('cards-payment.jpg'), alt: 'Payment cards', caption: 'Payments wired in' }
    ],
    cta: { label: "Yes — Build My Invoice Flow" }
  },
  'voice-agent': {
    demo: { type: 'aiFlow', title: 'Answer a Call', scenarios: [
      { msg: 'Caller: "Hi, do you have anything free for a haircut tomorrow?"', steps: [['Call answered instantly', 'No hold music, ever'], ['Intent detected', 'Booking · hair · tomorrow'], ['Calendar checked', 'Two stylists free after 2 PM'], ['Slot offered', 'Caller picks 3:30 PM'], ['Booked & confirmed', 'SMS reminder scheduled']] },
      { msg: 'Caller: "Niko na swali kuhusu bei ya delivery."', steps: [['Call answered instantly', 'Swahili detected'], ['Intent detected', 'Delivery pricing question'], ['Rates retrieved', 'Zone-based rates from the system'], ['Answer spoken', 'Clear price quoted in Swahili'], ['Logged', 'Call summary saved to CRM']] }
    ] },
    how: ['Call arrives', 'Voice agent answers instantly', 'Intent understood (EN/SW)', 'Action taken from live data', 'Complex calls handed to staff'],
    visuals: [
      { src: P('voice-headset.jpg'), alt: 'Headset', caption: 'Never rings out again' },
      { src: P('call-center.jpg'), alt: 'Reception', caption: 'Front desk support' },
      { src: P('microphone-studio.jpg'), alt: 'Microphone', caption: 'Natural speech handling' }
    ],
    cta: { label: "Yes — Build My Voice Agent" }
  },
  'lead-automation': {
    demo: { type: 'workflow', title: 'Enquiry → Qualified Lead', steps: [
      { label: 'Enquiry lands', detail: 'Web / WhatsApp / email — one pipeline' },
      { label: 'AI classification', detail: 'Intent, urgency & budget signals detected' },
      { label: 'Score & route', detail: '82/100 → assigned to the senior rep' },
      { label: 'Response drafted', detail: 'Personalised reply ready for one-tap send' },
      { label: 'Follow-up armed', detail: '24 h reminder if the lead goes quiet' }
    ] },
    how: ['Every enquiry lands in one place', 'AI classifies & scores', 'Right owner assigned', 'Response drafted instantly', 'Nothing goes cold'],
    visuals: [
      { src: P('call-center.jpg'), alt: 'Sales team', caption: 'Speed-to-lead wins deals' },
      { src: P('handshake-deal.jpg'), alt: 'Deal closed', caption: 'Warm, annotated leads' },
      { src: P('analytics-screen.jpg'), alt: 'Response metrics', caption: 'Response-time reporting' }
    ],
    cta: { label: "Yes — Build My Lead Engine" }
  },
  'workflow-studio': {
    demo: { type: 'workflow', title: 'Approval Routing Flow', steps: [
      { label: 'Request raised', detail: 'Purchase request over KSh 50,000' },
      { label: 'Rule evaluated', detail: 'Amount > 50k → senior approval path' },
      { label: 'Approver notified', detail: 'WhatsApp card with one-tap approve' },
      { label: 'Escalation timer', detail: 'No reply in 4 h → next in line' },
      { label: 'Decision logged', detail: 'Every run stored and replayable' }
    ] },
    how: ['Draw the rule once', 'Events trigger the flow', 'Notifications fan out', 'Escalations fire on silence', 'Every run is logged'],
    visuals: [
      { src: P('team-whiteboard.jpg'), alt: 'Process design', caption: 'Rules your managers can read' },
      { src: P('office-work.jpg'), alt: 'Operations', caption: 'Policy becomes executable' },
      { src: P('analytics-screen.jpg'), alt: 'Run logs', caption: 'Replayable audit trail' }
    ],
    cta: { label: "Yes — Build My Workflow Studio" }
  },
  'ai-support-desk': {
    demo: { type: 'aiFlow', title: 'Triage the Inbox', scenarios: [
      { msg: 'Customer: "This is the THIRD time I\'m writing about my refund!!!"', steps: [['Ticket received', 'Email · marked urgent'], ['Sentiment detected', 'Strong frustration — priority raised'], ['History checked', 'Two previous tickets found'], ['Draft prepared', 'Apology + refund status + escalation'], ['Routed to human', 'Agent gets full context, one click to send']] },
      { msg: 'Customer: "What are your opening hours on Saturday?"', steps: [['Ticket received', 'Email · routine'], ['Intent detected', 'FAQ — opening hours'], ['Knowledge base match', 'Answer found, high confidence'], ['Reply sent automatically', 'Cited from the KB article'], ['Ticket closed', 'No human time spent']] }
    ] },
    how: ['Every ticket triaged by urgency', 'Routine ones answered from the KB', 'Sensitive ones routed with context', 'Agents clear the queue faster', 'SLAs tracked throughout'],
    visuals: [
      { src: P('call-center.jpg'), alt: 'Support desk', caption: 'Urgent first, routine automated' },
      { src: P('office-work.jpg'), alt: 'Agent workspace', caption: 'Drafts with citations' },
      { src: P('analytics-screen.jpg'), alt: 'SLA dashboards', caption: 'SLA timers visible' }
    ],
    cta: { label: "Yes — Build My Support Desk" }
  },
  'iot-telemetry': {
    demo: { type: 'dashboard', title: 'Equipment Health Board' , industry: 'default'},
    how: ['Sensors report via gateway', 'Thresholds watched 24/7', 'Alerts fire before failure', 'Maintenance jobs created', 'Uptime reported per site'],
    visuals: [
      { src: P('solar-panels.jpg'), alt: 'Solar installation', caption: 'Generation monitoring' },
      { src: P('factory-line.jpg'), alt: 'Factory equipment', caption: 'Machine health signals' },
      { src: P('network-cables.jpg'), alt: 'Sensors & cabling', caption: 'Gateway uplinks' }
    ],
    cta: { label: "Yes — Build My Telemetry Platform" }
  },

  /* ================= HEALTHCARE ================= */
  vuvacare: {
    demo: { type: 'booking', title: 'Book a Clinic Visit' },
    how: ['Patient picks a service', 'Sees the doctor & live slots', 'Books in under a minute', 'Reminder arrives on WhatsApp', 'Queue position visible on arrival'],
    visuals: [
      { src: P('clinic-doctor.jpg'), alt: 'Doctor in a clinic', caption: 'Digital front door for patients' },
      { src: P('doctor-patient.jpg'), alt: 'Doctor with patient', caption: 'Consultations that start on time' },
      { src: P('medical-team.jpg'), alt: 'Medical team', caption: 'One system for the whole facility' }
    ],
    cta: { label: "Yes — Build My Clinic System" }
  },
  'lab-lis': {
    demo: { type: 'microChecklist', title: 'Sample Journey', doneText: 'Sample lifecycle complete — zero lost samples.', items: [
      { title: 'Collection & label', detail: 'Barcode printed at the chair' },
      { title: 'Lab receive & spin', detail: 'Every step scanned — no searching' },
      { title: 'Result validated', detail: 'Reference ranges auto-checked' },
      { title: 'Doctor notified', detail: 'Critical values flagged instantly' }
    ], note: 'Tick each stage to move the sample through the lab.' },
    how: ['Label printed at collection', 'Every step scanned', 'Ranges validated automatically', 'Critical flags escalated', 'TAT analytics per test'],
    visuals: [
      { src: P('lab-samples.jpg'), alt: 'Lab samples', caption: 'Barcode-tracked samples' },
      { src: P('medical-team.jpg'), alt: 'Lab staff', caption: 'Scanned, not searched' },
      { src: P('analytics-screen.jpg'), alt: 'TAT analytics', caption: 'Turnaround you can quote' }
    ],
    cta: { label: "Yes — Build My Lab System" }
  },
  'clinic-ops': {
    demo: { type: 'booking', title: 'Chair Scheduling' , industry: 'healthcare'},
    how: ['Procedure-based scheduling', 'Chair-side treatment notes', 'Sterilisation logged per cycle', 'Recalls fire automatically', 'Revenue per chair reported'],
    visuals: [
      { src: P('dental-chair.jpg'), alt: 'Dental chair', caption: 'Procedure clinics, properly run' },
      { src: P('doctor-patient.jpg'), alt: 'Consultation', caption: 'Notes between patients' },
      { src: P('medical-team.jpg'), alt: 'Clinic team', caption: 'Whole-team coordination' }
    ],
    cta: { label: "Yes — Build My Clinic Suite" }
  },
  telehealth: {
    demo: { type: 'booking', title: 'Book a Video Consultation' },
    how: ['Patient books & pays online', 'Video room opens at the slot', 'Notes captured in-session', 'E-prescription issued', 'Medicine delivered by partner pharmacy'],
    visuals: [
      { src: P('telehealth.jpg'), alt: 'Telehealth consultation', caption: 'Care without the travel' },
      { src: P('phone-payment.jpg'), alt: 'Mobile payment', caption: 'Pay before or after' },
      { src: P('pharmacy-shelves.jpg'), alt: 'Pharmacy', caption: 'Medicine routed to a pharmacy near you' }
    ],
    cta: { label: "Yes — Build My Telehealth Service" }
  },
  'pharma-inventory': {
    demo: { type: 'dashboard', title: 'Pharmacy Stock Board' , industry: 'healthcare'},
    how: ['Prescription verified in seconds', 'Shelf levels update live', 'Expiry watched batch by batch', 'Reorders drafted automatically', 'Slow movers flagged for action'],
    visuals: [
      { src: P('pharmacy-shelves.jpg'), alt: 'Pharmacy shelves', caption: 'Batch-tracked inventory' },
      { src: P('lab-samples.jpg'), alt: 'Pharmacy lab', caption: 'Dispensing verification' },
      { src: P('analytics-screen.jpg'), alt: 'Stock analytics', caption: 'Capital on the right shelves' }
    ],
    cta: { label: "Yes — Build My Pharmacy System" }
  },

  /* ================= LOGISTICS ================= */
  'fleet-command': {
    demo: { type: 'tracking', title: 'Follow a Vehicle' , industry: 'logistics'},
    how: ['Vehicles report GPS live', 'Duty status on one board', 'Fuel & mileage logged', 'Service countdowns surface early', 'Trip profitability per vehicle'],
    visuals: [
      { src: P('truck-fleet.jpg'), alt: 'Fleet of trucks', caption: 'The whole fleet, one picture' },
      { src: P('truck-highway.jpg'), alt: 'Truck on highway', caption: 'Live positions on the corridor' },
      { src: P('driver-cab.jpg'), alt: 'Driver cabin', caption: 'Driver hours & assignments' }
    ],
    cta: { label: "Yes — Build My Fleet Command" }
  },
  'warehouse-wms': {
    demo: { type: 'microChecklist', title: 'Pick & Dispatch', doneText: 'Order picked, packed and dispatched.', items: [
      { title: 'Wave released', detail: 'Multi-order pick list generated' },
      { title: 'Guided pick path', detail: 'Bins sequenced to cut walking' },
      { title: 'Pack & verify', detail: 'Barcode scan confirms every item' },
      { title: 'Dispatch scan', detail: 'Courier manifest generated' }
    ], note: 'Tick each stage to run the pick.' },
    how: ['Wave planned', 'Pickers guided bin-to-bin', 'Scans verify every pick', 'Cycle counts run in slices', 'Accuracy on the dashboard'],
    visuals: [
      { src: P('warehouse-shelves.jpg'), alt: 'Warehouse racking', caption: 'Everything has a bin' },
      { src: P('forklift.jpg'), alt: 'Forklift', caption: 'Put-away & replenishment' },
      { src: P('warehouse-worker.jpg'), alt: 'Warehouse operative', caption: 'Guided picking' }
    ],
    cta: { label: "Yes — Build My Warehouse System" }
  },
  'clearing-forwarding': {
    demo: { type: 'tracking', title: 'Track a Consignment' , industry: 'logistics'},
    how: ['Job file opened per consignment', 'Document checklist tracked', 'Customs milestones updated', 'Client portal answers first', 'Job costing per file'],
    visuals: [
      { src: P('cargo-containers.jpg'), alt: 'Cargo containers', caption: 'Port to door, one job file' },
      { src: P('port-crane.jpg'), alt: 'Port crane', caption: 'Customs milestones tracked' },
      { src: P('warehouse-worker.jpg'), alt: 'Warehouse handling', caption: 'Release to delivery' }
    ],
    cta: { label: "Yes — Build My Clearing System" }
  },
  lastmile: {
    demo: { type: 'tracking', title: 'Track a Delivery' },
    how: ['Stops sequenced automatically', 'Riders work from the app', 'Customers watch progress live', 'POD captured per stop', 'Failed attempts re-route'],
    visuals: [
      { src: P('delivery-rider.jpg'), alt: 'Delivery rider', caption: 'Rider apps that respect the road' },
      { src: P('delivery-van.jpg'), alt: 'Delivery van', caption: 'Van & rider dispatch' },
      { src: P('city-skyline.jpg'), alt: 'City', caption: 'Urban route sequencing' }
    ],
    cta: { label: "Yes — Build My Delivery System" }
  },

  /* ================= RETAIL ================= */
  commerceos: {
    demo: { type: 'dashboard', title: 'Distribution Dashboard', industry: 'default' },
    how: ['Branch sales stream in live', 'Reorder points computed', 'Supplier orders drafted', 'Transfers balance the branches', 'Dead stock flagged'],
    visuals: [
      { src: P('supermarket-aisle.jpg'), alt: 'Supermarket aisle', caption: 'Branch-level visibility' },
      { src: P('warehouse-shelves.jpg'), alt: 'Warehouse stock', caption: 'Warehouse to branch flow' },
      { src: P('market-stall.jpg'), alt: 'Market stall', caption: 'Distribution done digitally' }
    ],
    cta: { label: "Yes — Build My Distribution OS" }
  },
  'ecommerce-storefront': {
    demo: { type: 'shop', title: 'Try the Storefront' , industry: 'default'},
    how: ['Customer browses the catalogue', 'Cart & quantity managed', 'M-Pesa express checkout', 'Stock reserved instantly', 'Dispatch & tracking follow'],
    visuals: [
      { src: P('product-headphones.jpg'), alt: 'Headphones product', caption: 'Real catalogue experiences' },
      { src: P('retail-store.jpg'), alt: 'Storefront', caption: 'Local-first commerce' },
      { src: P('phone-payment.jpg'), alt: 'M-Pesa payment', caption: 'Checkout in under a minute' }
    ],
    cta: { label: "Yes — Build My Online Store" }
  },
  loyalty: {
    demo: { type: 'microChecklist', title: 'Loyalty Journey', doneText: 'Reward earned and redeemed.', items: [
      { title: 'Join at the till', detail: 'Phone number is the membership card' },
      { title: 'Earn on purchase', detail: 'Points post automatically' },
      { title: 'Targeted offer', detail: 'WhatsApp coupon based on real behaviour' },
      { title: 'Redeem anywhere', detail: 'Works across all branches' }
    ], note: 'Tick each step to walk the loyalty loop.' },
    how: ['Join with a phone number', 'Earn automatically at the till', 'Offers targeted by behaviour', 'Redeem at any branch', 'Redemption analytics close the loop'],
    visuals: [
      { src: P('product-sneaker.jpg'), alt: 'Retail products', caption: 'Points on every pair' },
      { src: P('retail-store.jpg'), alt: 'Store', caption: 'Cross-branch redemption' },
      { src: P('phone-payment.jpg'), alt: 'Phone', caption: 'The card is the phone' }
    ],
    cta: { label: "Yes — Build My Loyalty Programme" }
  },

  /* ================= HOSPITALITY ================= */
  hospitalityos: {
    demo: { type: 'shop', title: 'Order & Track' },
    how: ['Order placed & paid via M-Pesa', 'Kitchen ticket fires', 'Rider dispatched on completion', 'Customer tracks the rider', 'Branch report updates'],
    visuals: [
      { src: P('food-pizza.jpg'), alt: 'Pizza', caption: 'From tap to table' },
      { src: P('restaurant-dining.jpg'), alt: 'Restaurant', caption: 'Dine-in and delivery in one system' },
      { src: P('delivery-rider.jpg'), alt: 'Rider', caption: 'Live rider tracking' }
    ],
    cta: { label: "Yes — Build My Restaurant Suite" }
  },
  'hotel-pms': {
    demo: { type: 'rooms', title: 'Book a Room' , industry: 'default'},
    how: ['Walk-in checked in under 2 min', 'Room rack shows live status', 'Housekeeping syncs per room', 'Folios capture every charge', 'M-Pesa settles the bill'],
    visuals: [
      { src: P('hotel-room.jpg'), alt: 'Hotel room', caption: 'Room rack at a glance' },
      { src: P('reception-desk.jpg'), alt: 'Hotel reception', caption: 'Two-minute check-ins' },
      { src: P('hotel-lobby.jpg'), alt: 'Hotel lobby', caption: 'Right-sized for your property' }
    ],
    cta: { label: "Yes — Build My Hotel System" }
  },
  'venue-events': {
    demo: { type: 'booking', title: 'Reserve the Venue' , industry: 'default'},
    how: ['Enquiry becomes a quotation', 'Slot held with a deposit', 'Function sheet generated', 'Vendors coordinated', 'Balances tracked to the day'],
    visuals: [
      { src: P('event-hall.jpg'), alt: 'Event hall', caption: 'Every weekend sold deliberately' },
      { src: P('stage-lights.jpg'), alt: 'Event lighting', caption: 'Function sheets in one click' },
      { src: P('handshake-deal.jpg'), alt: 'Booking confirmed', caption: 'Deposits recorded properly' }
    ],
    cta: { label: "Yes — Build My Venue System" }
  },

  /* ================= FINTECH ================= */
  payrail: {
    demo: { type: 'finance', title: 'Payment Reconciliation' },
    how: ['Customer pays by M-Pesa/card', 'Webhook confirms in real time', 'Ledger updated idempotently', 'Matching runs automatically', 'Settlement reports daily'],
    visuals: [
      { src: P('phone-payment.jpg'), alt: 'M-Pesa payment', caption: 'STK push to confirmed order' },
      { src: P('cards-payment.jpg'), alt: 'Card payments', caption: 'Cards and mobile money, one rail' },
      { src: P('finance-charts.jpg'), alt: 'Reconciliation charts', caption: 'Zero manual matching' }
    ],
    cta: { label: "Yes — Build My Payments Rail" }
  },
  'sacco-core': {
    demo: { type: 'finance', title: 'Group Ledger', invoices: [
      { id: 'CONTRIB-0812', supplier: 'Member M-Pesa contribution', amount: 5000, match: 'Share capital', status: 'Matched' },
      { id: 'LOAN-0331', supplier: 'Emergency loan issued', amount: 30000, match: '2 guarantors', status: 'Matched' },
      { id: 'REPAY-0331', supplier: 'Loan repayment received', amount: 12500, match: 'Installment 3/6', status: 'Matched' }
    ] },
    how: ['Contributions land by M-Pesa', 'Ledger updates member by member', 'Loans need guarantor consent', 'Interest computed automatically', 'Statements shareable instantly'],
    visuals: [
      { src: P('finance-charts.jpg'), alt: 'Sacco finances', caption: 'The ledger is the referee' },
      { src: P('meeting-room.jpg'), alt: 'Group meeting', caption: 'Transparency at meetings' },
      { src: P('phone-payment.jpg'), alt: 'M-Pesa', caption: 'Contributions by phone' }
    ],
    cta: { label: "Yes — Build My Sacco Core" }
  },
  'expense-ops': {
    demo: { type: 'microChecklist', title: 'Expense Approval Flow', doneText: 'Expense approved and float topped up.', items: [
      { title: 'Receipt photographed', detail: 'At the point of purchase' },
      { title: 'Auto-coded', detail: 'Category & limits applied' },
      { title: 'Manager approval', detail: 'One tap from WhatsApp' },
      { title: 'Float replenished', detail: 'Finance sees the audit trail' }
    ], note: 'Tick each stage to move the expense through.' },
    how: ['Snap the receipt on the spot', 'Coding & limits applied', 'Approvals routed by rule', 'Floats topped up', 'Spend analytics by team'],
    visuals: [
      { src: P('documents-pile.jpg'), alt: 'Receipts', caption: 'Every receipt captured' },
      { src: P('accountant-desk.jpg'), alt: 'Finance desk', caption: 'Clean audit trails' },
      { src: P('office-work.jpg'), alt: 'Team spend', caption: 'No more receipt drawers' }
    ],
    cta: { label: "Yes — Build My Expense Ops" }
  },

  /* ================= REAL ESTATE ================= */
  propertyos: {
    demo: { type: 'property', title: 'Find a Rental' },
    how: ['Tenant browses live vacancies', 'Viewing booked in-chat', 'Rent paid via M-Pesa with receipt', 'Maintenance tickets tracked', 'Owners watch collections live'],
    visuals: [
      { src: P('apartment-building.jpg'), alt: 'Apartment building', caption: 'Vacancies managed digitally' },
      { src: P('living-room.jpg'), alt: 'Living room interior', caption: 'Tenants self-serve' },
      { src: P('keys-handover.jpg'), alt: 'Keys handover', caption: 'Move-ins without the paperwork chase' }
    ],
    cta: { label: "Yes — Build My Property System" }
  },
  'leases-admin': {
    demo: { type: 'dashboard', title: 'Lease Critical Dates' , industry: 'default'},
    how: ['Leases abstracted into data', 'Critical dates alert 90 days out', 'Escalations computed automatically', 'Renewal pipeline managed', 'Tenant mix reported'],
    visuals: [
      { src: P('city-skyline.jpg'), alt: 'Commercial property', caption: 'Commercial portfolios, tracked' },
      { src: P('documents-signing.jpg'), alt: 'Lease signing', caption: 'Every clause abstracted' },
      { src: P('analytics-screen.jpg'), alt: 'Portfolio analytics', caption: 'Nothing lapses by surprise' }
    ],
    cta: { label: "Yes — Build My Lease Admin" }
  },

  /* ================= EDUCATION ================= */
  'school-core': {
    demo: { type: 'dashboard', title: 'School Operations Board' , industry: 'school'},
    how: ['Register marked in a tap', 'Fee balances update instantly', 'Report cards generated', 'Parents messaged in bulk', 'Accounts chase less, collect more'],
    visuals: [
      { src: P('classroom-students.jpg'), alt: 'Classroom', caption: 'One register for everything' },
      { src: P('teacher-board.jpg'), alt: 'Teacher at the board', caption: 'Teachers teach, admin runs itself' },
      { src: P('library-study.jpg'), alt: 'Library', caption: 'Records that outlive exercise books' }
    ],
    cta: { label: "Yes — Build My School System" }
  },
  'student-portal': {
    demo: { type: 'portal', title: 'Parent & Student Portal' , industry: 'school'},
    how: ['Log in from any phone', 'See timetable, results, balance', 'Announcements on time', 'Works on 2G', 'No meetings needed to know'],
    visuals: [
      { src: P('online-learning.jpg'), alt: 'Online learning', caption: 'Light pages for real networks' },
      { src: P('students-laptops.jpg'), alt: 'Students studying', caption: 'Results the day they change' },
      { src: P('kids-classroom.jpg'), alt: 'Young students', caption: 'Parents stay in the loop' }
    ],
    cta: { label: "Yes — Build My School Portal" }
  },
  'course-platform': {
    demo: { type: 'course', title: 'Learner Dashboard' , industry: 'education'},
    how: ['Enrol with M-Pesa', 'Lessons unlock progressively', 'Assignments submitted in-app', 'Feedback recorded', 'Certificates auto-issue'],
    visuals: [
      { src: P('students-laptops.jpg'), alt: 'Students with laptops', caption: 'Cohorts without the admin' },
      { src: P('online-learning.jpg'), alt: 'Learning on a phone', caption: 'Learn entirely from a phone' },
      { src: P('graduation.jpg'), alt: 'Graduation', caption: 'Certificates issued automatically' }
    ],
    cta: { label: "Yes — Build My Course Platform" }
  },

  /* ================= DATA & OPERATIONS ================= */
  'bi-dashboard': {
    demo: { type: 'dashboard', title: 'Executive Board' , industry: 'default'},
    how: ['Systems feed one warehouse', 'KPIs agreed in advance', 'Targets vs actual live', 'Exceptions alert first', 'Meetings argue decisions, not data'],
    visuals: [
      { src: P('finance-charts.jpg'), alt: 'Executive charts', caption: 'One version of the truth' },
      { src: P('meeting-room.jpg'), alt: 'Boardroom', caption: 'Decisions, not spreadsheet debates' },
      { src: P('analytics-screen.jpg'), alt: 'Dashboards', caption: 'Live, not month-end' }
    ],
    cta: { label: "Yes — Build My Executive Dashboard" }
  },
  dataops: {
    demo: { type: 'dashboard', title: 'Warehouse Sync Monitor', industry: 'logistics' },
    how: ['Sources sync nightly', 'Quality gates run', 'Marts modelled per team', 'History preserved', 'Analysts query one truth'],
    visuals: [
      { src: P('data-center.jpg'), alt: 'Data centre', caption: 'Pipelines with quality gates' },
      { src: P('server-room.jpg'), alt: 'Servers', caption: 'Nightly incremental sync' },
      { src: P('analytics-screen.jpg'), alt: 'Reports', caption: 'Reports become cheap' }
    ],
    cta: { label: "Yes — Build My Data Platform" }
  },
  'inventory-intel': {
    demo: { type: 'dashboard', title: 'Reorder Intelligence' , industry: 'default'},
    how: ['Demand profiled per SKU per branch', 'Reorder points adapt', 'Transfers suggested weekly', 'Dead stock flagged', 'Working capital released'],
    visuals: [
      { src: P('warehouse-shelves.jpg'), alt: 'Stock shelves', caption: 'Right stock, right branch' },
      { src: P('supermarket-aisle.jpg'), alt: 'Retail aisle', caption: 'Demand per branch' },
      { src: P('analytics-screen.jpg'), alt: 'Forecast charts', caption: 'Forecasts that adapt' }
    ],
    cta: { label: "Yes — Build My Inventory Intelligence" }
  },

  /* ================= DIGITAL EXPERIENCES ================= */
  'customer-portal': {
    demo: { type: 'portal', title: 'Self-Service Portal' , industry: 'default'},
    how: ['Customer logs in', 'Orders & documents self-served', 'Requests become tracked tickets', 'Status notifications flow', 'Support load drops'],
    visuals: [
      { src: P('office-work.jpg'), alt: 'Customer service', caption: 'Customers help themselves' },
      { src: P('documents-pile.jpg'), alt: 'Documents', caption: 'A vault per customer' },
      { src: P('analytics-screen.jpg'), alt: 'Requests dashboard', caption: 'Every request tracked' }
    ],
    cta: { label: "Yes — Build My Customer Portal" }
  },
  'brand-site-experience': {
    demo: { type: 'gallery', title: 'Experience Reel', slides: [
      { src: P('motion-blur-city.jpg'), title: 'Cinematic motion', caption: 'Scroll-driven storytelling' },
      { src: P('creative-studio.jpg'), title: 'Art direction', caption: 'Custom, not template' },
      { src: P('design-workspace.jpg'), title: 'Performance budgets', caption: 'Sub-second on 3G' }
    ] },
    how: ['Art direction first', 'Motion with reduced-motion respect', 'Self-hosted fonts & assets', 'Edge delivery', 'CMS-editable content'],
    visuals: [
      { src: P('motion-blur-city.jpg'), alt: 'Motion blur', caption: 'Film-grade motion' },
      { src: P('creative-studio.jpg'), alt: 'Creative studio', caption: 'Art-directed every time' },
      { src: P('design-workspace.jpg'), alt: 'Design tools', caption: 'Crafted, then engineered' }
    ],
    cta: { label: "Yes — Build My Brand Site" }
  },
  'member-subscriptions': {
    demo: { type: 'configurator', title: 'Membership Plans', modules: [
      { id: 'core', label: 'Base membership platform', price: 320000, weeks: 6, fixed: true },
      { id: 'tiers', label: 'Tiered plans', price: 60000, weeks: 1 },
      { id: 'billing', label: 'Recurring M-Pesa billing', price: 90000, weeks: 2 },
      { id: 'content', label: 'Members-only content', price: 80000, weeks: 2 },
      { id: 'dunning', label: 'Failed-payment recovery', price: 50000, weeks: 1 }
    ] },
    how: ['Member picks a tier', 'Recurring billing set up', 'Content gated by plan', 'Failed payments retried', 'Churn reported monthly'],
    visuals: [
      { src: P('cards-payment.jpg'), alt: 'Payment cards', caption: 'Recurring billing that recovers itself' },
      { src: P('phone-payment.jpg'), alt: 'Mobile money', caption: 'M-Pesa subscriptions included' },
      { src: P('analytics-screen.jpg'), alt: 'Churn analytics', caption: 'Cohorts & churn visibility' }
    ],
    cta: { label: "Yes — Build My Membership Platform" }
  },

  /* ================= CREATIVE STUDIO ================= */
  'creative-brand-exp': {
    demo: { type: 'gallery', title: 'Brand System Reel', slides: [
      { src: P('creative-studio.jpg'), title: 'Identity in motion', caption: 'Logo systems that behave' },
      { src: P('design-workspace.jpg'), title: 'Tokens & components', caption: 'One hand, every touchpoint' },
      { src: P('art-gallery.jpg'), title: 'Guidelines that live', caption: 'Online, not in a drawer' }
    ] },
    how: ['Identity workshop', 'Motion & interaction language', 'Component library built', 'Guidelines published live', 'Teams ship on-brand'],
    visuals: [
      { src: P('creative-studio.jpg'), alt: 'Studio', caption: 'Identity crafted in-house' },
      { src: P('design-workspace.jpg'), alt: 'Design workspace', caption: 'Systems, not one-offs' },
      { src: P('art-gallery.jpg'), alt: 'Gallery', caption: 'Presentation-grade output' }
    ],
    cta: { label: "Yes — Build My Brand Experience" }
  },
  'creative-launch': {
    demo: { type: 'microChecklist', title: 'Launch Arc Simulator', doneText: 'Launch complete — demand captured.', items: [
      { title: 'Teaser live', detail: 'Curiosity seeded with a countdown' },
      { title: 'Waitlist open', detail: 'Early signups captured & segmented' },
      { title: 'Reveal day', detail: 'Story drops, waitlist converts first' },
      { title: 'First orders', detail: 'Conversion flow measured per stage' }
    ], note: 'Run the launch arc stage by stage.' },
    how: ['Tease', 'Capture', 'Reveal', 'Convert', 'Measure each stage'],
    visuals: [
      { src: P('stage-lights.jpg'), alt: 'Launch stage', caption: 'Reveal moments that land' },
      { src: P('packaging-boxes.jpg'), alt: 'Product packaging', caption: 'Product-ready presentation' },
      { src: P('motion-blur-city.jpg'), alt: 'City motion', caption: 'Campaign energy' }
    ],
    cta: { label: "Yes — Build My Launch" }
  },
  'creative-campaign': {
    demo: { type: 'gallery', title: 'Campaign Storyboard', slides: [
      { src: P('motion-blur-city.jpg'), title: 'OOH — the poster', caption: 'QR continues the story in chat' },
      { src: P('phone-payment.jpg'), title: 'WhatsApp — the journey', caption: 'Scan to story to offer' },
      { src: P('retail-store.jpg'), title: 'In-store — the close', caption: 'One measurement spine throughout' }
    ] },
    how: ['One narrative defined', 'Executions native per channel', 'Codes make response trackable', 'Chat carries the journey', 'One dashboard measures all'],
    visuals: [
      { src: P('motion-blur-city.jpg'), alt: 'OOH placement', caption: 'Posters that talk back' },
      { src: P('phone-payment.jpg'), alt: 'Chat journey', caption: 'WhatsApp continuations' },
      { src: P('retail-store.jpg'), alt: 'Retail close', caption: 'Attribution to the till' }
    ],
    cta: { label: "Yes — Build My Campaign" }
  },
  'creative-immersive': {
    demo: { type: 'gallery', title: 'Scroll Story Preview', slides: [
      { src: P('neon-installation.jpg'), title: 'Chapter one', caption: 'Depth & parallax on load' },
      { src: P('motion-blur-city.jpg'), title: 'Chapter two', caption: 'Scroll choreography builds the story' },
      { src: P('stage-lights.jpg'), title: 'Final frame', caption: 'Optional sound, reduced-motion safe' }
    ] },
    how: ['Story chapters defined', 'Scroll choreography designed', 'Assets cut to weight budget', 'Motion respects settings', 'Shipped fast on mid-range phones'],
    visuals: [
      { src: P('neon-installation.jpg'), alt: 'Neon installation', caption: 'Depth that loads fast' },
      { src: P('motion-blur-city.jpg'), alt: 'Motion frame', caption: 'Cinematic on a budget' },
      { src: P('stage-lights.jpg'), alt: 'Lights', caption: 'Stories people finish' }
    ],
    cta: { label: "Yes — Build My Web Story" }
  },
  'creative-installation': {
    demo: { type: 'microQueue', title: 'Presence Simulator', tickets: ['Guest approaches', 'Visuals bloom', 'Audio shifts', 'Scene resets'], counters: ['Sensor A', 'Sensor A', 'Sensor B', 'System'] },
    how: ['Presence sensed', 'Visuals respond in real time', 'Audio follows density', 'Content schedules by daypart', 'Monitored remotely'],
    visuals: [
      { src: P('neon-installation.jpg'), alt: 'Reactive installation', caption: 'Spaces that acknowledge you' },
      { src: P('stage-lights.jpg'), alt: 'Lighting', caption: 'Light & sound as interface' },
      { src: P('art-gallery.jpg'), alt: 'Gallery space', caption: 'Lobbies, showrooms, events' }
    ],
    cta: { label: "Yes — Build My Installation" }
  },
  'creative-motion': {
    demo: { type: 'gallery', title: 'Motion Reel', slides: [
      { src: P('stage-lights.jpg'), title: 'Title sequences', caption: 'Rhythm carries the message' },
      { src: P('motion-blur-city.jpg'), title: 'Kinetic type', caption: 'Type in motion, on brand' },
      { src: P('microphone-studio.jpg'), title: 'Sound-synced cuts', caption: 'Every frame intentional' }
    ] },
    how: ['Script & storyboard', 'Type systems designed', 'Animation timed to sound', 'Delivered per screen size', 'Kits for future reuse'],
    visuals: [
      { src: P('stage-lights.jpg'), alt: 'Stage', caption: 'Openers with intent' },
      { src: P('motion-blur-city.jpg'), alt: 'Kinetic frame', caption: 'Motion is message' },
      { src: P('microphone-studio.jpg'), alt: 'Audio', caption: 'Sound-synced timing' }
    ],
    cta: { label: "Yes — Build My Motion Identity" }
  },
  'creative-3d': {
    demo: { type: 'gallery', title: 'Product Turntable', slides: [
      { src: P('product-headphones.jpg'), title: 'Studio render', caption: 'Model once, light forever' },
      { src: P('product-sneaker.jpg'), title: 'Variant matrix', caption: 'Every colourway from one model' },
      { src: P('product-watch.jpg'), title: 'Web turnaround', caption: 'Spin & zoom in the storefront' }
    ] },
    how: ['Product modelled once', 'Lighting & materials set', 'Variants rendered in matrix', 'Turnaround embedded in web', 'AR-ready exports'],
    visuals: [
      { src: P('product-headphones.jpg'), alt: 'Headphones render', caption: 'Photoreal renders' },
      { src: P('product-sneaker.jpg'), alt: 'Sneaker render', caption: 'Variants without reshoots' },
      { src: P('product-watch.jpg'), alt: 'Watch render', caption: 'Interactive turnarounds' }
    ],
    cta: { label: "Yes — Build My Product Visuals" }
  },
  'creative-editorial': {
    demo: { type: 'gallery', title: 'Editorial Spreads', slides: [
      { src: P('typography-print.jpg'), title: 'Type-first grids', caption: 'Reading rhythm on screens' },
      { src: P('library-study.jpg'), title: 'Long-form, readable', caption: '40 pages that get read' },
      { src: P('art-gallery.jpg'), title: 'Data styled', caption: 'Charts that match the type' }
    ] },
    how: ['Grid & scale defined', 'Chapters structured', 'Data visualisations styled', 'Screen-native pacing', 'Print-quality exports'],
    visuals: [
      { src: P('typography-print.jpg'), alt: 'Typography', caption: 'Type scales that respect readers' },
      { src: P('library-study.jpg'), alt: 'Reading', caption: 'Long-form on phones' },
      { src: P('art-gallery.jpg'), alt: 'Exhibition', caption: 'Reports as publications' }
    ],
    cta: { label: "Yes — Build My Editorial Design" }
  },
  'creative-packaging': {
    demo: { type: 'gallery', title: 'Packaging Story', slides: [
      { src: P('packaging-boxes.jpg'), title: 'Dieline to shelf', caption: 'Structure engineered for print' },
      { src: P('product-backpack.jpg'), title: 'Product in pack', caption: 'Shelf presence tested' },
      { src: P('camera-gear.jpg'), title: 'Unboxing film', caption: 'The second audience, online' }
    ] },
    how: ['Dieline engineered', 'Print proofs supervised', 'Unboxing staged & filmed', 'Cutdowns for social', 'Shelf visibility tested'],
    visuals: [
      { src: P('packaging-boxes.jpg'), alt: 'Packaging', caption: 'Structure as brand' },
      { src: P('product-backpack.jpg'), alt: 'Product', caption: 'Shelf-tested design' },
      { src: P('camera-gear.jpg'), alt: 'Filming', caption: 'Unboxing as media' }
    ],
    cta: { label: "Yes — Build My Packaging" }
  },
  'creative-dataart': {
    demo: { type: 'gallery', title: 'Data Canvas', slides: [
      { src: '/assets/img/creative-dataart.svg', title: 'The quarter as art', caption: 'Real figures, generative form' },
      { src: P('art-gallery.jpg'), title: 'Lobby edition', caption: 'Large-format prints' },
      { src: P('analytics-screen.jpg'), title: 'Live rendering', caption: 'Numbers flow in, art flows out' }
    ] },
    how: ['Pick the numbers', 'Generative system tuned', 'Live feeds wired', 'Large-format output', 'Editions for milestones'],
    visuals: [
      { src: '/assets/img/creative-dataart.svg', alt: 'Generative data art', caption: 'Made of the business' },
      { src: P('art-gallery.jpg'), alt: 'Gallery wall', caption: 'Prints & installations' },
      { src: P('analytics-screen.jpg'), alt: 'Live data', caption: 'Live feeds welcome' }
    ],
    cta: { label: "Yes — Commission My Data Artwork" }
  },
  'creative-retail-x': {
    demo: { type: 'shop', title: 'Connected Store Demo' },
    how: ['Smart tags open stories', 'AR try-on on the shelf', 'One basket online & offline', 'Footfall analytics flow', 'Staff tablet companion'],
    visuals: [
      { src: P('clothing-rack.jpg'), alt: 'Clothing rack', caption: 'Tags that tell stories' },
      { src: P('retail-store.jpg'), alt: 'Store floor', caption: 'Store completes the website' },
      { src: P('product-sneaker.jpg'), alt: 'Sneaker', caption: 'AR try-on, one tap' }
    ],
    cta: { label: "Yes — Build My Connected Store" }
  },
  'creative-event-x': {
    demo: { type: 'microChecklist', title: 'Event Day Run-through', doneText: 'Show wrapped — highlights rendering.', items: [
      { title: 'Doors & check-in', detail: 'Registration scanned at the gate' },
      { title: 'Live overlays', detail: 'Lower-thirds & speaker cards fired live' },
      { title: 'Second screen', detail: 'Audience polls & moments on their phones' },
      { title: 'Same-night highlights', detail: 'Reel cut before the room empties' }
    ], note: 'Run the show from doors to highlights.' },
    how: ['Registration flows', 'Stage graphics run live', 'Audience participates twice', 'Highlights cut same night', 'Content pack funds the quarter'],
    visuals: [
      { src: P('stage-lights.jpg'), alt: 'Event stage', caption: 'Stages with a second life' },
      { src: P('event-hall.jpg'), alt: 'Event hall', caption: 'In the room and in the feed' },
      { src: P('camera-gear.jpg'), alt: 'Event filming', caption: 'Same-night editing' }
    ],
    cta: { label: "Yes — Build My Event Layer" }
  },
  'creative-hotel-x': {
    demo: { type: 'rooms', title: 'Guest Journey Demo' },
    how: ['Booking confirmed in chat', 'Digital key issued', 'Concierge on WhatsApp', 'Express checkout & folio', 'Review moment designed'],
    visuals: [
      { src: P('hotel-lobby.jpg'), alt: 'Hotel lobby', caption: 'One thread for the whole stay' },
      { src: P('hotel-suite.jpg'), alt: 'Suite', caption: 'Digital keys, no queues' },
      { src: P('breakfast-tray.jpg'), alt: 'Room service', caption: 'In-chat concierge & menus' }
    ],
    cta: { label: "Yes — Build My Guest Experience" }
  }
};

export function demoConfigFor(id) {
  return DEMO_CONFIG[id] || null;
}
