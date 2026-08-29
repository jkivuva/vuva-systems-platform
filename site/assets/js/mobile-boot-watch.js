// Vuva mobile boot watch — records JS errors, unhandled rejections and
// resource load failures that happen during the first 30 seconds after
// page load, then ships them to a Worker endpoint.
//
// Why: real users report occasional "black screen" / "blank page" on
// mobile. This module turns those silent failures into observable
// signals without polluting the page with intrusive UI.
//
// Behaviour:
//   - Captures window.error and unhandledrejection
//   - Watches performance.getEntriesByType('resource') for failed
//     resources (transferSize=0, duration>0 indicates a network failure)
//   - Sends a single compact JSON payload via navigator.sendBeacon
//   - Only runs on mobile viewports (<= 820px) to avoid desktop noise
//   - Throttles to one report per page view; never throws
//
// Endpoint /vuvasystems-internal/telemetry?key=mobile-boot
// is added to the Worker so reports land in a D1 table.

const ENDPOINT = '/vuvasystems-internal/telemetry?key=mobile-boot';
const isMobile = () => window.matchMedia('(max-width: 820px)').matches;
const TAG = 'vuva-boot-watch/1';

function collect() {
  const out = {
    tag: TAG,
    ua: navigator.userAgent,
    vw: window.innerWidth,
    vh: window.innerHeight,
    dpr: window.devicePixelRatio,
    net: navigator.connection && {
      type: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    },
    href: location.pathname + location.search,
    errs: [],
    rej: [],
    failed: [],
    time: Date.now()
  };
  return out;
}

function send(payload) {
  try {
    if (!isMobile()) return;
    if (!('sendBeacon' in navigator)) return;
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const ok = navigator.sendBeacon(ENDPOINT, blob);
    if (!ok) {
      /* No fallback transport — be silent. */
    }
  } catch (_) { /* never throw */ }
}

const buf = collect();

window.addEventListener('error', (event) => {
  buf.errs.push({
    msg: String(event.message || '').slice(0, 280),
    src: String(event.filename || '').slice(0, 280),
    line: event.lineno || 0,
    col: event.colno || 0,
    t: Date.now() - buf.time
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason && event.reason.message ? event.reason.message : String(event.reason || '');
  buf.rej.push({ msg: String(reason).slice(0, 280), t: Date.now() - buf.time });
});

/* Sample resource entries 3s after load (let everything finish) and
   again 10s in (for lazy imports). Failed = transferSize 0, duration > 0
   AND not an inline data URL. */
function scanFailed() {
  try {
    const resources = performance.getEntriesByType('resource');
    resources.forEach((r) => {
      if (r.transferSize === 0 && r.duration > 0 && !/^data:/.test(r.name)) {
        buf.failed.push({
          name: String(r.name).slice(0, 280),
          type: String(r.initiatorType || '').slice(0, 40),
          dur: Math.round(r.duration)
        });
      }
    });
  } catch (_) { /* ignore */ }
}
setTimeout(scanFailed, 3000);
setTimeout(scanFailed, 10000);

/* On pagehide / beforeunload, ship whatever we have. */
function flush() {
  if (buf._sent) return;
  buf._sent = true;
  send(buf);
}
window.addEventListener('pagehide', flush);
window.addEventListener('beforeunload', flush);
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush();
});
