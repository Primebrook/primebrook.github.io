// Opens a built page in headless Chrome at phone and desktop widths, reports
// layout problems, and saves screenshots to look at.
//
//   npm run build && npm run inspect -- /writing/test-post/
//   npm run inspect -- /writing/test-post/ --widths=375,1440 --wait=12000
//
// Why not `chrome --screenshot`: headless Chrome won't lay a page out narrower
// than 500px, and its virtual time freezes timers, so animations never run.
// Driving it over the DevTools protocol avoids both.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { extname } from 'node:path';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const path = args.find((a) => !a.startsWith('--')) ?? '/';
const widths = flag('widths', '375,1280').split(',').map(Number);
const wait = Number(flag('wait', '2500'));
const out = flag('out', join(tmpdir(), 'blog-inspect'));
const chromePath = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PREVIEW_PORT = 4329;
const DEBUG_PORT = 9329;
const SLICE = 1400;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function until(fn, what, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const v = await fn();
      if (v) return v;
    } catch {}
    await sleep(250);
  }
  throw new Error(`timed out waiting for ${what}`);
}

// Serve dist/ directly. `astro preview` allows only one server at a time, so
// it would clash with one already running.
const DIST = new URL('../dist/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(DIST, url.endsWith('/') ? url + 'index.html' : url);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(PREVIEW_PORT);
const profile = join(tmpdir(), `blog-inspect-profile-${process.pid}`);
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${DEBUG_PORT}`,
  `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });

try {
  const base = `http://localhost:${PREVIEW_PORT}`;
  await until(() => fetch(base).then((r) => r.ok), 'the dist/ server');
  if (!(await fetch(base + path)).ok) throw new Error(`${path} is not in dist/. Run \`npm run build\` first, and check the path.`);
  const target = await until(
    () => fetch(`http://127.0.0.1:${DEBUG_PORT}/json`).then((r) => r.json()).then((ts) => ts.find((t) => t.type === 'page')),
    'Chrome',
  );

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
    } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      errors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
    }
  });
  const call = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const my = ++id;
      pending.set(my, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
      ws.send(JSON.stringify({ id: my, method, params }));
    });
  const evaluate = async (expression) => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;

  await call('Page.enable');
  await call('Runtime.enable');
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const slug = path.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home';
  let failed = false;

  for (const width of widths) {
    errors.length = 0;
    await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    await call('Page.navigate', { url: base + path });
    await until(() => evaluate('document.readyState === "complete"'), 'page load');
    // Scroll through the page so anything that starts on scroll (lazy images,
    // animations waiting for IntersectionObserver) starts, then give it time.
    await evaluate(`(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      scrollTo(0, 0);
    })()`);
    await sleep(wait);

    const report = await evaluate(`(() => {
      // Compare against the width asked for, not innerWidth: with mobile
      // emulation, as on a real phone, the viewport widens to fit wide content.
      const width = ${width};
      const doc = document.documentElement;
      // Elements poking past the viewport. Skips boxes that scroll on purpose
      // (display maths, code, pseudocode, diagrams) and KaTeX's invisible parts.
      const overflowsPage = [...document.querySelectorAll('main *')]
        .filter((el) => el.getBoundingClientRect().right > width + 1 && !el.closest('.katex-display, pre, .pseudocode, .mermaid, .katex-mathml, .hide-tail'))
        .slice(0, 5).map((el) => el.tagName.toLowerCase() + (el.getAttribute('class') ? '.' + el.getAttribute('class').split(' ')[0] : '') + ' in ' + (el.closest('[class]:not(svg *)')?.getAttribute('class') ?? '?').split(' ')[0]);
      return {
        pageScrollsSideways: doc.scrollWidth > width || innerWidth > width,
        overflowsPage,
        textWidth: Math.round(document.querySelector('.prose > p, .intro')?.getBoundingClientRect().width ?? 0),
        katexErrors: document.querySelectorAll('.katex-error').length,
        scrollingEquations: [...document.querySelectorAll('.katex-display')].filter((d) => d.scrollWidth > d.clientWidth + 1).length,
        mermaid: document.querySelectorAll('pre.mermaid').length + ' blocks, ' + document.querySelectorAll('pre.mermaid svg').length + ' rendered',
        animationStatus: [...document.querySelectorAll('[aria-live]')].map((s) => s.textContent.trim()),
        height: doc.scrollHeight,
      };
    })()`);

    const shots = [];
    for (let y = 0, n = 1; y < report.height; y += SLICE, n++) {
      const { data } = await call('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y, width, height: Math.min(SLICE, report.height - y), scale: 1 },
      });
      const file = join(out, `${slug}-${width}-${n}.png`);
      await writeFile(file, Buffer.from(data, 'base64'));
      shots.push(file);
    }

    const bad = report.pageScrollsSideways || report.overflowsPage.length > 0 || report.katexErrors > 0 || errors.length > 0;
    failed ||= bad;
    console.log(`\n${bad ? '✗' : '✓'} ${path} at ${width}px`);
    console.log(`  text width ${report.textWidth}px · page scrolls sideways: ${report.pageScrollsSideways}` +
      (report.overflowsPage.length ? ` (${report.overflowsPage.join(', ')})` : ''));
    console.log(`  KaTeX errors: ${report.katexErrors} · equations scrolling in their own box: ${report.scrollingEquations}`);
    console.log(`  Mermaid: ${report.mermaid}`);
    if (report.animationStatus.length) console.log(`  live status text: ${report.animationStatus.join(' | ')}`);
    if (errors.length) console.log(`  browser errors:\n    ${errors.join('\n    ')}`);
    console.log(`  screenshots:\n    ${shots.join('\n    ')}`);
  }

  ws.close();
  process.exitCode = failed ? 1 : 0;
} finally {
  chrome.kill();
  server.close();
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
