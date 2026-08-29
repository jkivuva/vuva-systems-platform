import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';

import worker from '../src/worker.js';
import { siteConfig } from '../site/assets/js/config.js';

const siteUrl = new URL('../site/', import.meta.url);
const readSiteFile = (path) => readFile(new URL(path, siteUrl), 'utf8');

describe('production website', () => {
  test('positions Vuva as a software engineering and AI systems company', async () => {
    const html = await readSiteFile('index.html');

    assert.match(html, /WE BUILD/);
    assert.match(html, /DIGITAL <em>SYSTEMS<\/em>/);
    assert.match(html, /THAT MOVE BUSINESS/);
    assert.match(html, /AI-powered business systems/);
    assert.match(html, /We don&#39;t just build software\.|We don’t just build software\./);
    assert.match(html, /We build the systems behind better businesses\./);
    assert.match(html, /We don&#39;t just build websites\. <em>We build the systems that run businesses\.<\/em>|We don’t just build websites\. <em>We build the systems that run businesses\.<\/em>/);
  });

  test('ships the required technical capability sections', async () => {
    const html = await readSiteFile('index.html');

    assert.match(html, /id="systems"/);
    assert.match(html, /id="work"/);
    assert.match(html, /id="architecture"/);
    assert.match(html, /id="ai-automation"/);
    assert.match(html, /id="vuva-ai"/);
    assert.match(html, /id="capabilities"/);
    assert.match(html, /id="contact"/);
    assert.match(html, /AI Agents/i);
    assert.match(html, /SaaS/i);
    assert.match(html, /WhatsApp/i);
    assert.match(html, /Dashboards|Live Dashboards/i);
  });

  test('lists the engineering services', async () => {
    const html = await readSiteFile('index.html');

    for (const service of [
      'AI &amp; Automation',
      'Custom Software',
      'Web &amp; Mobile Applications',
      'Business Management Systems',
      'Payments &amp; Integrations',
      'Data &amp; Analytics',
      'Digital Transformation',
      'Custom SaaS',
      'Customer Portals',
      'Enterprise Dashboards'
    ]) {
      assert.match(html, new RegExp(service.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('keeps the honest work language and process', async () => {
    const html = await readSiteFile('index.html');

    for (const step of ['Discover', 'Design', 'Build', 'Integrate', 'Test', 'Deploy', 'Support']) {
      assert.match(html, new RegExp(step));
    }
    assert.match(html, /Limitless Logistics/i);
    assert.match(html, /Blitz Restaurant/i);
    assert.match(html, /demonstration system/i);
    assert.match(html, /Demonstration System/i);
    assert.doesNotMatch(html, /testimonial/i);
  });

  test('includes complete SEO and social metadata', async () => {
    const html = await readSiteFile('index.html');

    assert.match(html, /<title>Vuva Systems \| Software Engineering, AI Systems &amp; Business Automation<\/title>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/vuvasystems\.com\/">/);
    assert.match(html, /property="og:image" content="https:\/\/vuvasystems\.com\/assets\/brand\/vuva-social\.png"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /type="application\/ld\+json"/);
  });

  test('centralizes correct business contact configuration', () => {
    assert.equal(siteConfig.domain, 'https://vuvasystems.com');
    assert.equal(siteConfig.email, 'hello@vuvasystems.com');
    assert.equal(siteConfig.phoneDisplay, '0739 694 759');
    assert.equal(siteConfig.callNumber, '254739694759');
    assert.equal(siteConfig.whatsappNumber, '254796117443');
    assert.equal(siteConfig.whatsappBaseUrl, 'https://wa.me/254796117443');
  });

  test('provides the qualification form fields, with an optional budget', async () => {
    const html = await readSiteFile('index.html');

    for (const field of ['name', 'company', 'email', 'phone', 'requirements', 'industry', 'size', 'project_type', 'budget', 'contact_method']) {
      assert.match(html, new RegExp(`name="${field}"`));
    }
    // Budget must be optional (no `required`), never forced.
    assert.match(html, /name="budget"/);
    assert.match(html, /data-contact-form/);
  });

  test('links industry demos as trailing-slash directory routes (zero redirects)', async () => {
    const html = await readSiteFile('index.html');

    for (const slug of ['logistics', 'healthcare', 'realestate', 'hospitality', 'retail']) {
      assert.match(html, new RegExp(`href="/demos/${slug}/"`));
    }
    // No .html or extensionless demo hrefs — those 404 locally or redirect in production.
    assert.doesNotMatch(html, /href="\/demos\/[a-z]+\.html"/);
    assert.doesNotMatch(html, /href="\/demos\/[a-z]+"/);
  });

  test('VuvaCare demo is a labelled two-sided healthcare demonstration', async () => {
    const html = await readSiteFile('demos/healthcare/index.html');
    assert.match(html, /data-vc-mode="patient"/);
    assert.match(html, /data-vc-mode="hospital"/);
    assert.match(html, /data-booking-stage/);
    assert.match(html, /data-reception-input/);
    assert.match(html, /Demonstration system/i);
    assert.match(html, /healthcare\.js/);
  });

  test('bundles industry imagery referenced from the systems and work sections', async () => {
    const html = await readSiteFile('index.html');
    for (const img of ['logistics', 'healthcare', 'realestate', 'hospitality', 'retail', 'professional', 'enterprise']) {
      assert.match(html, new RegExp(`/assets/img/${img}\\.svg`));
    }
  });

  test('ships all critical static assets including demos, AI and internal area', async () => {
    const paths = [
      'assets/css/styles.css',
      'assets/js/app.js',
      'assets/js/config.js',
      'assets/js/pricing.js',
      'assets/js/vuva-ai.js',
      'assets/brand/vuva-mark.svg',
      'assets/brand/vuva-social.png',
      'assets/img/logistics.svg',
      'assets/img/healthcare.svg',
      'assets/img/realestate.svg',
      'assets/img/hospitality.svg',
      'assets/img/retail.svg',
      'assets/img/professional.svg',
      'assets/img/enterprise.svg',
      'demos/demo.css',
      'demos/demo.js',
      'demos/logistics/index.html',
      'demos/healthcare/index.html',
      'demos/healthcare/healthcare.css',
      'demos/healthcare/healthcare.js',
      'demos/realestate/index.html',
      'demos/hospitality/index.html',
      'demos/retail/index.html',
      'internal/index.html',
      'internal/internal.css',
      'internal/internal.js',
      'favicon.svg',
      'site.webmanifest',
      'robots.txt',
      'sitemap.xml',
      '404.html'
    ];

    await Promise.all(paths.map((path) => access(new URL(path, siteUrl))));
  });
});

describe('portfolio expansion', () => {
  const imgDir = new URL('../site/assets/img/', import.meta.url);

  test('ships the Project Index and Creative Studio sections wired for rendering', async () => {
    const html = await readSiteFile('index.html');

    assert.match(html, /id="portfolio"/);
    assert.match(html, /id="creative"/);
    assert.match(html, /PROJECT INDEX/);
    assert.match(html, /VUVA CREATIVE STUDIO/);
    assert.match(html, /data-pf-chips/);
    assert.match(html, /data-pf-search/);
    assert.match(html, /data-pf-count/);
    assert.match(html, /data-pf-featured/);
    assert.match(html, /data-projects-grid/);
    assert.match(html, /data-creative-row/);
    // Renderer scripts are loaded as modules
    assert.match(html, /assets\/js\/portfolio-data\.js/);
    assert.match(html, /assets\/js\/portfolio\.js/);
    // Navigation exposes both sections
    assert.match(html, /href="#portfolio">Project Index</);
    assert.match(html, /href="#creative">Creative Studio</);
  });

  test('portfolio data is honest, complete and internally consistent', async () => {
    const { PROJECTS, TECH_PROJECTS, CREATIVE_PROJECTS, CATEGORIES, STATUS } = await import('../site/assets/js/portfolio-data.js');

    // Target scale: roughly 40-45 tech projects plus 10-15 creative concepts.
    assert.ok(TECH_PROJECTS.length >= 40 && TECH_PROJECTS.length <= 50, `tech count ${TECH_PROJECTS.length}`);
    assert.ok(CREATIVE_PROJECTS.length >= 10 && CREATIVE_PROJECTS.length <= 15, `creative count ${CREATIVE_PROJECTS.length}`);

    const seen = new Set();
    for (const project of PROJECTS) {
      assert.ok(!seen.has(project.id), `duplicate id ${project.id}`);
      seen.add(project.id);
      assert.ok(CATEGORIES.includes(project.category) || project.category === 'Digital Experiences', `bad category on ${project.id}`);
      assert.ok(STATUS[project.status], `bad status on ${project.id}`);
      for (const field of ['name', 'industry', 'image', 'blurb']) {
        assert.ok(project[field], `${field} missing on ${project.id}`);
      }
      assert.ok(Array.isArray(project.capabilities) && project.capabilities.length > 0, `capabilities missing on ${project.id}`);
      for (const part of ['problem', 'solution', 'features', 'experience', 'tech', 'value']) {
        assert.ok(project.detail?.[part], `detail.${part} missing on ${project.id}`);
      }
    }

    // Every concept must read as a concept, never as commissioned work.
    for (const project of PROJECTS.filter((p) => p.status === 'concept')) {
      assert.ok(STATUS.concept.label === 'Concept');
    }
    // Creative entries are labelled concepts unless explicitly otherwise.
    for (const project of CREATIVE_PROJECTS) {
      assert.equal(project.status, 'concept', `creative entry ${project.id} must be a concept`);
    }
  });

  test('every portfolio image exists on disk', async () => {
    const { PROJECTS } = await import('../site/assets/js/portfolio-data.js');
    for (const project of PROJECTS) {
      const file = project.image.replace('/assets/img/', '');
      await access(new URL(file, imgDir));
    }
  });

  test('no social-media advertising capability appears anywhere on the site', async () => {
    const html = await readSiteFile('index.html');
    assert.doesNotMatch(html, /social[- ]media advert/i);
    assert.doesNotMatch(html, /grow your (followers|likes)/i);
    assert.doesNotMatch(html, /follower growth/i);
    assert.doesNotMatch(html, /sponsored posts/i);
  });
});

describe('demo expansion (Part 2-33)', () => {
  test('every project has an interactive demo, how-it-works flow, visuals and a conversion CTA', async () => {
    const { PROJECTS } = await import('../site/assets/js/portfolio-data.js');
    const { DEMO_CONFIG } = await import('../site/assets/js/demo-config.js');

    const KNOWN_TYPES = new Set(['booking', 'tracking', 'shop', 'rooms', 'property', 'dashboard', 'workflow', 'aiFlow', 'finance', 'portal', 'configurator', 'gallery', 'course', 'checklist', 'microChecklist', 'queue', 'microQueue', 'rate', 'microRate', 'roster', 'microRoster']);

    for (const project of PROJECTS) {
      const cfg = DEMO_CONFIG[project.id];
      assert.ok(cfg, `no demo config for ${project.id}`);
      assert.ok(cfg.demo && KNOWN_TYPES.has(cfg.demo.type), `bad demo type on ${project.id}`);
      assert.ok(Array.isArray(cfg.how) && cfg.how.length >= 3, `how-it-works missing on ${project.id}`);
      assert.ok(Array.isArray(cfg.visuals) && cfg.visuals.length >= 2, `visuals missing on ${project.id}`);
      assert.ok(cfg.cta && /Yes/i.test(cfg.cta.label), `conversion CTA missing on ${project.id}`);
      for (const v of cfg.visuals) {
        assert.match(v.src, /\/assets\/img\/photos\/.+\.jpg|\/assets\/img\/[a-z-]+\.svg/, `bad visual src on ${project.id}`);
        assert.ok(v.alt, `visual alt missing on ${project.id}`);
      }
    }
  });

  test('demo photos exist on disk', async () => {
    const { DEMO_CONFIG } = await import('../site/assets/js/demo-config.js');
    const photosDir = new URL('../site/assets/img/', import.meta.url);
    const seen = new Set();
    for (const cfg of Object.values(DEMO_CONFIG)) {
      for (const v of cfg.visuals) {
        if (seen.has(v.src)) continue;
        seen.add(v.src);
        await access(new URL(v.src.replace('/assets/img/', ''), photosDir));
      }
    }
  });

  test('portfolio page wires the demo modules and enquiry prefill target', async () => {
    const html = await readSiteFile('index.html');
    /* Demo modules are lazy-loaded on first card intent, not eagerly — the
       index still references portfolio.js (the orchestrator) and config
       data files. The dynamic imports live in portfolio.js, validated below. */
    assert.match(html, /portfolio\.js/);
    assert.match(html, /demo-config\.js/);
    assert.match(html, /<option>Custom business system<\/option>/);
    assert.match(html, /<option>Creative \/ Brand<\/option>/);
    const portfolioJs = await readSiteFile('assets/js/portfolio.js');
    assert.match(portfolioJs, /import\(['"]\.\/demo-types-a\.js['"]\)/);
    assert.match(portfolioJs, /import\(['"]\.\/demo-types-b\.js['"]\)/);
  });
});

describe('website and webhook routing', () => {
  test('redirects www to the canonical apex domain', async () => {
    const response = await worker.fetch(new Request('https://www.vuvasystems.com/solutions?from=www'), {});

    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), 'https://vuvasystems.com/solutions?from=www');
  });

  test('serves website assets with production security headers', async () => {
    const env = {
      ASSETS: {
        fetch: async () => new Response('<!doctype html><title>Vuva Systems</title>', {
          headers: { 'content-type': 'text/html; charset=utf-8' }
        })
      }
    };
    const response = await worker.fetch(new Request('https://vuvasystems.com/'), env);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
  });

  test('keeps the health endpoint logically separate from static assets', async () => {
    let assetRequests = 0;
    const env = {
      ASSETS: { fetch: async () => { assetRequests += 1; return new Response('asset'); } }
    };
    const response = await worker.fetch(new Request('https://vuvasystems.com/health'), env);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
    assert.equal(assetRequests, 0);
  });
});

describe('internal prospecting area authentication', () => {
  const internalUrl = 'https://vuvasystems.com/internal/';
  const assetEnv = {
    ASSETS: { fetch: async () => new Response('internal dashboard', { headers: { 'content-type': 'text/html' } }) }
  };
  const configuredEnv = {
    ...assetEnv,
    INTERNAL_AUTH_USER: 'joshua',
    INTERNAL_AUTH_PASS: 'correct-horse-battery'
  };
  const basic = (user, pass) => `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;

  test('fails closed (503) when internal auth is not configured', async () => {
    const response = await worker.fetch(new Request(internalUrl), assetEnv);
    assert.equal(response.status, 503);
  });

  test('returns 401 without credentials when configured', async () => {
    const response = await worker.fetch(new Request(internalUrl), configuredEnv);
    assert.equal(response.status, 401);
    assert.match(response.headers.get('www-authenticate'), /Basic/);
  });

  test('rejects wrong credentials', async () => {
    const request = new Request(internalUrl, { headers: { authorization: basic('joshua', 'wrong-password') } });
    const response = await worker.fetch(request, configuredEnv);
    assert.equal(response.status, 401);
  });

  test('serves the internal dashboard with valid credentials', async () => {
    const request = new Request(internalUrl, { headers: { authorization: basic('joshua', 'correct-horse-battery') } });
    const response = await worker.fetch(request, configuredEnv);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'internal dashboard');
  });

  test('does not gate the public site', async () => {
    const response = await worker.fetch(new Request('https://vuvasystems.com/'), configuredEnv);
    assert.equal(response.status, 200);
  });
});

describe('internal prospecting API', () => {
  const baseEnv = {
    ASSETS: { fetch: async () => new Response('asset') },
    INTERNAL_AUTH_USER: 'joshua',
    INTERNAL_AUTH_PASS: 'correct-horse-battery'
  };
  const basic = (user, pass) => `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
  const authHeaders = { authorization: basic('joshua', 'correct-horse-battery') };

  function mockDb(rows = []) {
    const stmt = {
      bind: () => stmt,
      all: async () => ({ results: rows }),
      run: async () => ({ success: true })
    };
    return { prepare: () => stmt };
  }

  test('rejects the internal API without credentials', async () => {
    const response = await worker.fetch(
      new Request('https://vuvasystems.com/internal/api/config'),
      { ...baseEnv, DB: mockDb() }
    );
    assert.equal(response.status, 401);
  });

  test('reports integration config status', async () => {
    const response = await worker.fetch(
      new Request('https://vuvasystems.com/internal/api/config', { headers: authHeaders }),
      { ...baseEnv, DB: mockDb() }
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.config.database, true);
    assert.equal(body.config.tavily, false);
    assert.equal(body.config.whatsapp, false);
  });

  test('lists saved prospects from D1', async () => {
    const response = await worker.fetch(
      new Request('https://vuvasystems.com/internal/api/prospects', { headers: authHeaders }),
      { ...baseEnv, DB: mockDb([]) }
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual(body.prospects, []);
  });

  test('saves a prospect to D1', async () => {
    const response = await worker.fetch(
      new Request('https://vuvasystems.com/internal/api/prospects', {
        method: 'POST',
        headers: { ...authHeaders, 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Test Co', industry: 'Logistics & Transportation', location: 'Nairobi, Kenya', signals: ['Relies on WhatsApp'] })
      }),
      { ...baseEnv, DB: mockDb() }
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.prospect.name, 'Test Co');
    assert.equal(typeof body.prospect.id, 'string');
    assert.ok(body.prospect.id.length > 0);
  });

  test('fails search cleanly when Tavily is not configured', async () => {
    const response = await worker.fetch(
      new Request('https://vuvasystems.com/internal/api/search', {
        method: 'POST',
        headers: { ...authHeaders, 'content-type': 'application/json' },
        body: JSON.stringify({ industry: 'Logistics & Transportation', country: 'Kenya' })
      }),
      { ...baseEnv, DB: mockDb() }
    );
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.match(body.error, /TAVILY_API_KEY/);
  });

  test('fails outreach cleanly when WhatsApp is not configured', async () => {
    const response = await worker.fetch(
      new Request('https://vuvasystems.com/internal/api/outreach', {
        method: 'POST',
        headers: { ...authHeaders, 'content-type': 'application/json' },
        body: JSON.stringify({ to: '254700000000', message: 'Hello' })
      }),
      { ...baseEnv, DB: mockDb() }
    );
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.match(body.error, /WHATSAPP/);
  });
});

describe('WhatsApp conversation reply engine', () => {
  test('generates business-appropriate replies from inbound text', async () => {
    const { generateReply } = await import('../src/whatsapp-reply.js');

    assert.match(generateReply('Hi, I need help'), /Welcome to Vuva Systems/);
    assert.match(generateReply('how much does it cost?'), /scoped individually/i);
    assert.match(generateReply('do you build logistics systems?'), /Logistics is one of our core areas/);
    assert.match(generateReply('can you make me a website?'), /websites and web applications/i);
    assert.match(generateReply('xyzzy nothing matches this'), /Thanks for reaching out/);
  });

  test('webhook still returns EVENT_RECEIVED with the conversation layer wired in', async () => {
    worker.fetch;
    const { createHmac } = await import('node:crypto');
    const env = {
      META_APP_SECRET: 'test-secret',
      DB: {
        prepare: () => ({
          bind: () => ({ run: async () => ({}), all: async () => ({ results: [{ reply_status: null }] }) })
        })
      }
    };
    const payload = JSON.stringify({
      object: 'whatsapp_business_account',
      entry: [{ changes: [{ field: 'messages', value: { messages: [{ from: '254700000001', id: `wamid.test-${Date.now()}`, timestamp: '0', type: 'text', text: { body: 'Hi, I need help' } }] } }] }]
    });
    const signature = `sha256=${createHmac('sha256', 'test-secret').update(payload).digest('hex')}`;
    const response = await worker.fetch(new Request('https://vuvasystems.com/webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-hub-signature-256': signature },
      body: payload
    }), env);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'EVENT_RECEIVED');
  });

  test('flags conversations that need a human and classifies normal ones', async () => {
    const { needsHuman } = await import('../src/whatsapp-reply.js');

    assert.equal(needsHuman('I want to talk to a human'), true);
    assert.equal(needsHuman('this is unacceptable, I demand a refund'), true);
    assert.equal(needsHuman('let me speak to your manager'), true);
    assert.equal(needsHuman('Hi, I need help'), false);
    assert.equal(needsHuman('how much for a website?'), false);
  });
});
