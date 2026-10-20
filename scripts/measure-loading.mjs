// Loading on a phone (W34). Measures a site as a slow phone would see it: the headers served for a
// page, the stylesheet, a script and the register, with each file's size raw, gzipped and with brotli;
// cold and warm loads of five pages; the tools' response from the last keystroke or choice to the
// redrawn result; and opening and scrolling through the source register. Network: the values Chrome's
// DevTools applies for its "Slow 4G" preset (1.6 Mbps down and 750 kbps up, each at 0.9, 562.5 ms
// latency); CPU slowed four times. Chrome is the one on the computer, as a11y.mjs.
//
//   node scripts/measure-loading.mjs                      # the built site, served by this script
//   SITE_URL=https://ukstatepensionexplorer.netlify.app SITE_USER=... SITE_PASS=... node scripts/measure-loading.mjs
//
// The user name and password are those of the preview's sign-in.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import puppeteer from "puppeteer-core";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
let server = null;
let base = process.env.SITE_URL;
if (!base) {
  const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".csv": "text/csv", ".txt": "text/plain" };
  server = createServer((request, response) => {
    let path = join("_site", decodeURIComponent(new URL(request.url, "http://x").pathname));
    if (existsSync(path) && statSync(path).isDirectory()) path = join(path, "index.html");
    if (!existsSync(path)) {
      response.writeHead(404, { "content-type": "text/html" });
      response.end(readFileSync("_site/404.html"));
      return;
    }
    response.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    response.end(readFileSync(path));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
}
const auth = process.env.SITE_USER ? `Basic ${Buffer.from(`${process.env.SITE_USER}:${process.env.SITE_PASS}`).toString("base64")}` : null;
const headers = auth ? { authorization: auth } : {};
const SLOW_4G = { offline: false, downloadThroughput: (1.6 * 1024 * 1024 * 0.9) / 8, uploadThroughput: (750 * 1024 * 0.9) / 8, latency: 150 * 3.75 };
const PAGES = ["/", "/reform-options/costs/", "/sources-and-method/", "/tools/compare/", "/tools/history/"];
const FILES = ["/", "/assets/css/main.css", "/assets/js/tools/compare.js", "/sources-and-method/", "/reform-options/costs/"];
const kB = (n) => (n / 1024).toFixed(1);

console.log(`== ${base}${server ? " (the built site, served by this script without compression or cache headers)" : ""} ==`);
console.log("== files: status; size decoded, gzipped and with brotli; the headers that govern compression and caching ==");
for (const path of FILES) {
  const response = await fetch(base + path, { headers: { ...headers, "accept-encoding": "br, gzip" } });
  const body = Buffer.from(await response.arrayBuffer());
  const show = ["content-encoding", "cache-control", "etag", "cache-status", "x-robots-tag", "vary"].map((name) => `${name}: ${response.headers.get(name) ?? "-"}`).join("; ");
  console.log(`${path}: ${response.status}; ${kB(body.length)} kB, gzip ${kB(gzipSync(body, { level: 9 }).length)} kB, brotli ${kB(brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length)} kB; ${show}`);
  if (response.status !== 200) {
    console.log("stopping: the site did not answer 200, so nothing below would measure the site");
    process.exit(1);
  }
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
// A fresh browser context for a cold load, so no connection, DNS or TLS state is reused.
async function phone(cacheOn) {
  const context = cacheOn ? browser.defaultBrowserContext() : await browser.createBrowserContext();
  const page = await context.newPage();
  if (auth) await page.setExtraHTTPHeaders(headers);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const cdp = await page.createCDPSession();
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", SLOW_4G);
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: !cacheOn });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  return page;
}
async function load(page, path) {
  await page.evaluateOnNewDocument(() => {
    window.__lcp = 0;
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__lcp = entry.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto(base + path, { waitUntil: "load" });
  await new Promise((resolve) => setTimeout(resolve, 500));
  return page.evaluate((path) => {
    const nav = performance.getEntriesByType("navigation")[0];
    const res = performance.getEntriesByType("resource");
    const sum = (key) => nav[key] + res.reduce((s, r) => s + r[key], 0);
    return { path, domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd), loadMs: Math.round(nav.loadEventEnd), largestPaintMs: Math.round(window.__lcp), requests: res.length + 1, transferredKB: Math.round(sum("transferSize") / 1024), decodedKB: Math.round(sum("decodedBodySize") / 1024), answeredFromCache: res.filter((r) => r.transferSize === 0).length };
  }, path);
}
console.log("== cold loads: a fresh browser context, cache off; ms to DOMContentLoaded, load and the largest paint; requests; kB on the wire and decoded ==");
for (const path of PAGES) { const page = await phone(false); console.log(JSON.stringify(await load(page, path))); await page.browserContext().close(); }
console.log("== warm loads: the same page a second time in one context, cache on ==");
for (const path of PAGES) { const page = await phone(true); await load(page, path); console.log(JSON.stringify(await load(page, path))); await page.close(); }

console.log("== tools: ms from the last keystroke, or the choice, to the redrawn result, CPU x4; a tool waits 400 ms after a keystroke before redrawing ==");
async function respond(path, field, act, resultId) {
  const page = await phone(true);
  await page.goto(base + path, { waitUntil: "networkidle0" });
  // The clock restarts at each input or change event the field fires, so the time is from the last one.
  const redrawn = page.evaluate(([field, resultId]) => new Promise((resolve) => {
    let start = performance.now();
    const input = document.querySelector(field);
    for (const type of ["input", "change"]) input.addEventListener(type, () => { start = performance.now(); });
    new MutationObserver((_, observer) => { observer.disconnect(); resolve(Math.round(performance.now() - start)); }).observe(document.getElementById(resultId), { childList: true, subtree: true });
  }), [field, resultId]);
  await act(page);
  const ms = await Promise.race([redrawn, new Promise((resolve) => setTimeout(() => resolve("no redraw within 5 s"), 5000))]);
  console.log(JSON.stringify({ path, field, toRedrawMs: ms }));
  await page.close();
}
const typing = (field, keys) => async (page) => { await page.focus(field); await page.$eval(field, (el) => { el.value = ""; }); await page.keyboard.type(keys); };
await respond("/tools/compare/", "#compare-start", typing("#compare-start", "200"), "compare-result");
await respond("/tools/triple-lock/", "#mechanism-prices", typing("#mechanism-prices", "4.0"), "mechanism-result");
await respond("/tools/budget/", "#budget-private-pension", typing("#budget-private-pension", "500"), "budget-result");
await respond("/tools/history/", "#history-measure", (page) => page.select("#history-measure", "real"), "history-result");

console.log("== source register: ms to open it, then scrolling through its table 600 px a frame, CPU x4: frames, frames over 16.7 ms, the longest frame ==");
{
  const page = await phone(true);
  await page.goto(base + "/sources-and-method/", { waitUntil: "networkidle0" });
  const result = await page.evaluate(() => new Promise((resolve) => {
    const details = document.querySelector("#table-register-sources").closest("details");
    const t0 = performance.now();
    details.open = true;
    const openMs = Math.round(performance.now() - t0);
    const table = details.querySelector("table");
    const top = table.getBoundingClientRect().top + scrollY;
    const bottom = top + table.getBoundingClientRect().height;
    scrollTo(0, top);
    const frames = [];
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      frames.push(now - last);
      last = now;
      scrollBy(0, 600);
      if (scrollY + innerHeight < bottom && frames.length < 400) requestAnimationFrame(step);
      else resolve({ openMs, tablePx: Math.round(bottom - top), frames: frames.length, over16ms: frames.filter((f) => f > 16.7).length, longestMs: Math.round(Math.max(...frames)) });
    };
    requestAnimationFrame(step);
  }));
  console.log(JSON.stringify(result));
  await page.close();
}
await browser.close();
if (server) server.close();
