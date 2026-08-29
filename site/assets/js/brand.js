// Vuva brand — single source of truth for the trademark mark.
// The canonical asset is /assets/brand/vuva-trademark.svg. Because the
// site is plain HTML (no component framework), this module stamps the
// same inline SVG into every [data-brand-mark] placeholder, so pages
// never duplicate the markup by hand.
//
// Usage:
//   <span data-brand-mark class="brand-mark"></span>
//   <script type="module" src="/assets/js/brand.js?v=1"></script>

const BRAND_MARK_SVG = `
<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <g fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter">
    <path d="M58 32 L45 54.5 L19 54.5 L6 32 L19 9.5 L45 9.5 Z" stroke-width="3.5"/>
    <g transform="translate(13.4 15.2) scale(0.57)">
      <path d="M8 11h11l13 35 13-35h11" stroke-width="7"/>
      <path d="M18.5 11 32 46 45.5 11" stroke-width="2" opacity=".55"/>
    </g>
  </g>
  <g fill="currentColor">
    <rect x="55" y="29" width="6" height="6"/>
    <rect x="42" y="51.5" width="6" height="6"/>
    <rect x="16" y="51.5" width="6" height="6"/>
    <rect x="3" y="29" width="6" height="6"/>
    <rect x="16" y="6.5" width="6" height="6"/>
    <rect x="42" y="6.5" width="6" height="6"/>
  </g>
</svg>`;

function stampBrandMarks() {
  document.querySelectorAll('[data-brand-mark]').forEach((host) => {
    if (host.querySelector('svg')) return; // idempotent
    host.innerHTML = BRAND_MARK_SVG;
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', 'Vuva Systems mark');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', stampBrandMarks);
} else {
  stampBrandMarks();
}
