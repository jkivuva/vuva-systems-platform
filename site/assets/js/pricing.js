// Vuva Systems — centralized project pricing configuration.
//
// This is the single source of truth for the public Vuva AI quotation engine.
// Change prices, labels, or timelines HERE — no component code needs to change.
// These are ENGINEERING ESTIMATES for lead qualification only, never binding quotes.
// No secrets belong in this file; it is shipped to the browser by design.

export const pricing = Object.freeze({
  currency: 'KSh',
  locale: 'en-KE',
  currencyCode: 'KES',

  // Foundation every project starts from (authentication, data model, core app, deployment).
  base: Object.freeze({
    label: 'Core platform foundation',
    price: 320000,
    weeks: 6
  }),

  // Optional modules. `id` is stable; `label` is the customer-facing name.
  modules: Object.freeze([
    { id: 'operations_dashboard', label: 'Operations Dashboard', price: 60000, weeks: 1 },
    { id: 'customer_portal', label: 'Customer Portal', price: 80000, weeks: 2 },
    { id: 'ai_assistant', label: 'AI Customer Assistant', price: 140000, weeks: 2 },
    { id: 'ai_automation', label: 'AI Workflow Automation', price: 120000, weeks: 2 },
    { id: 'whatsapp', label: 'WhatsApp Automation', price: 70000, weeks: 1 },
    { id: 'notifications', label: 'SMS & Email Notifications', price: 40000, weeks: 1 },
    { id: 'payments_mpesa', label: 'M-Pesa Integration', price: 70000, weeks: 1 },
    { id: 'payments_card', label: 'Card Payments', price: 70000, weeks: 1 },
    { id: 'live_tracking', label: 'Live Tracking (GPS / Maps)', price: 90000, weeks: 2 },
    { id: 'analytics', label: 'Analytics & Reporting', price: 60000, weeks: 1 },
    { id: 'multi_branch', label: 'Multi-Branch Management', price: 80000, weeks: 2 },
    { id: 'api_integrations', label: 'API Integrations', price: 90000, weeks: 2 },
    { id: 'mobile_app', label: 'Mobile App (PWA)', price: 100000, weeks: 2 },
    { id: 'saas_billing', label: 'SaaS Subscription Billing', price: 90000, weeks: 2 },
    { id: 'enterprise', label: 'Enterprise Security & Access', price: 120000, weeks: 2 },
    { id: 'custom_workflow', label: 'Custom Workflow Modules', price: 80000, weeks: 2 }
  ]),

  // Estimate banding: the engine quotes a range so no false precision is implied.
  lowFactor: 0.9,
  highFactor: 1.18,

  disclaimer:
    'This is an estimated project investment based on the requirements provided. Final pricing is confirmed by Vuva Systems following technical review and project scoping.'
});

export function moduleById(id) {
  return pricing.modules.find((m) => m.id === id);
}

export function estimate(moduleIds) {
  const selected = (moduleIds || [])
    .map(moduleById)
    .filter(Boolean);

  const moduleTotal = selected.reduce((sum, m) => sum + m.price, 0);
  const subtotal = pricing.base.price + moduleTotal;
  const weeks = pricing.base.weeks + selected.reduce((sum, m) => sum + m.weeks, 0);

  return {
    selected,
    moduleTotal,
    subtotal,
    weeks,
    low: Math.round(subtotal * pricing.lowFactor),
    high: Math.round(subtotal * pricing.highFactor)
  };
}

export function formatKsh(amount) {
  return `KSh ${Math.round(amount / 1000).toLocaleString('en-KE')}k`;
}

export function formatRange(est) {
  return `${formatKsh(est.low)} – ${formatKsh(est.high)}`;
}
