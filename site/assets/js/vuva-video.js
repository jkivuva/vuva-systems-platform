/* Vuva media — <vuva-video> element.
   An elegant, honest video slot: shows a labelled poster frame until a real
   asset is configured via data-src. No fake URLs, no external requests.
   When data-src is set it renders a real <video> with:
     muted + autoplay (in view) + loop + playsinline, poster fallback,
     lazy attachment, and full reduced-motion compliance. */

class VuvaVideo extends HTMLElement {
  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    this.attachShadow({ mode: 'open' });

    const src = this.getAttribute('data-src');
    const label = this.getAttribute('data-label') || 'System walkthrough';
    const caption = this.getAttribute('data-caption') || '';
    const poster = this.getAttribute('data-poster') || '';
    const ratio = this.getAttribute('data-ratio') || '16 / 9';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const style = document.createElement('style');
    style.textContent = `
      :host { display:block; }
      .frame {
        position: relative; overflow: hidden; border-radius: 10px;
        border: 1px solid #46534e; background: #0e1513;
        aspect-ratio: ${ratio};
        container-type: inline-size;
      }
      .frame::before {
        content: ""; position: absolute; inset: 0;
        background-image: linear-gradient(rgba(53,224,161,.06) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(53,224,161,.06) 1px, transparent 1px);
        background-size: 30px 30px;
        mask-image: radial-gradient(85% 85% at 50% 40%, #000 30%, transparent 100%);
      }
      .stage { position:absolute; inset:0; display:flex; flex-direction:column; gap:.5rem; align-items:center; justify-content:center; text-align:center; padding:1rem; }
      .badge {
        display:inline-flex; gap:.4rem; align-items:center; padding:.3rem .65rem;
        border:1px solid rgba(217,164,65,.5); border-radius:999px;
        color:#d9a441; background:rgba(217,164,65,.08);
        font: 700 .62rem/1 ui-monospace, SFMono-Regular, Menlo, monospace;
        letter-spacing:.06em; text-transform:uppercase;
      }
      .badge::before { content:""; width:6px; height:6px; border-radius:50%; background:#d9a441; }
      .title { color:#e8eeea; font-family:"Space Grotesk", system-ui, sans-serif; font-weight:600; letter-spacing:-.01em; font-size:clamp(.95rem, 4cqi, 1.3rem); }
      .caption { color:#a7b3ad; font-size:.78rem; line-height:1.5; max-width:46ch; }
      .play { width:54px; height:54px; border-radius:50%; display:grid; place-items:center; color:#0c1210; background:#35e0a1; font-size:1.1rem; box-shadow:0 0 0 6px rgba(53,224,161,.14); }
      video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    `;

    const frame = document.createElement('div');
    frame.className = 'frame';

    const stage = document.createElement('div');
    stage.className = 'stage';

    if (src) {
      const video = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      if (poster) video.setAttribute('poster', poster);

      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      video.appendChild(source);
      frame.appendChild(video);

      if (!reduced && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            video.preload = 'metadata';
            video.play().catch(() => {});
            obs.disconnect();
        });
        }, { threshold: 0.35 });
        io.observe(this);
      }

      if (caption) {
        const cap = document.createElement('div');
        cap.className = 'caption';
        cap.textContent = caption;
        stage.appendChild(cap);
      }
      frame.appendChild(stage);
    } else {
      stage.innerHTML = `
        <span class="play" aria-hidden="true">▶</span>
        <span class="title">${label}</span>
        ${caption ? `<span class="caption">${caption}</span>` : ''}
        <span class="badge">Video slot — awaiting production asset</span>
      `;
      frame.appendChild(stage);
    }

    this.shadowRoot.append(style, frame);
  }
}

if (!customElements.get('vuva-video')) customElements.define('vuva-video', VuvaVideo);
