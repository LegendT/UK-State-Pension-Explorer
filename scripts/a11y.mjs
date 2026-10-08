// Runs axe-core against every built page, in each state listed below, and saves the full
// result. Violations and incomplete results are reported separately: incomplete is not a pass.
// Usage: npm run build && npm run a11y
// A clean run here is a floor. It does not show that the site meets WCAG 2.2 AA.

import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { extname, join } from "node:path";
import puppeteer from "puppeteer-core";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".csv": "text/csv", ".txt": "text/plain" };

const server = createServer((request, response) => {
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
const base = `http://127.0.0.1:${server.address().port}`;

const pages = JSON.parse(readFileSync("src/_data/pageRegister.json", "utf8")).pages.map((entry) => entry.path);

// Extra states of the four tools. Each function runs in the page before the audit.
const states = [
  { name: "details-open", path: "*", run: () => document.querySelectorAll("details").forEach((d) => (d.open = true)) },
  { name: "tool1-hypothetical", path: "/tools/triple-lock/", run: () => { document.getElementById("mechanism-prices").value = "2.5"; document.getElementById("mechanism-earnings").value = "2.5"; document.getElementById("mechanism-form").requestSubmit(); } },
  { name: "tool1-error", path: "/tools/triple-lock/", run: () => { document.getElementById("mechanism-prices").value = "abc"; document.getElementById("mechanism-start").value = "0"; document.getElementById("mechanism-form").requestSubmit(); } },
  { name: "tool2-volatile-earnings-measure", path: "/reform-options/compare/", run: () => { const s = document.getElementById("compare-scenario"); s.value = "volatile"; s.dispatchEvent(new Event("change")); document.getElementById("compare-measure").value = "earnings"; document.getElementById("compare-edit").open = true; document.getElementById("compare-form").requestSubmit(); } },
  { name: "tool2-error", path: "/reform-options/compare/", run: () => { document.getElementById("compare-years").value = "99"; document.getElementById("compare-start").value = "x"; document.getElementById("compare-form").requestSubmit(); } },
  { name: "tool3-preset-result", path: "/tools/budget/", run: () => { document.getElementById("budget-preset").value = "mis-2026-single-private"; document.getElementById("budget-load").click(); document.getElementById("budget-fill-pension").click(); document.getElementById("budget-form").requestSubmit(); } },
  { name: "tool3-couple-error", path: "/tools/budget/", run: () => { document.getElementById("budget-household-couple").click(); document.getElementById("budget-food").value = "-4"; document.getElementById("budget-tax").value = "abc"; document.getElementById("budget-form").requestSubmit(); } },
  { name: "tool4-new-with-rule", path: "/tools/history/", run: () => { const s = document.getElementById("history-series"); s.value = "new"; s.dispatchEvent(new Event("change")); document.getElementById("history-rule").value = "earnings"; document.getElementById("history-measure").value = "real"; document.getElementById("history-form").requestSubmit(); } },
  { name: "tool4-error", path: "/tools/history/", run: () => { document.getElementById("history-from").value = "2026/27"; document.getElementById("history-form").requestSubmit(); } },
];

const views = [
  { name: "phone-light", width: 390, height: 844, scheme: "light" },
  { name: "phone-dark", width: 390, height: 844, scheme: "dark" },
  { name: "desktop-light", width: 1280, height: 900, scheme: "light" },
  { name: "desktop-dark", width: 1280, height: 900, scheme: "dark" },
];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const version = await browser.version();
const runs = [];

async function audit(path, view, state) {
  const page = await browser.newPage();
  await page.setViewport({ width: view.width, height: view.height });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: view.scheme }, { name: "prefers-reduced-motion", value: "reduce" }]);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await page.goto(base + path, { waitUntil: "networkidle0" });
  if (state) {
    await page.evaluate(state.run);
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  await page.evaluate(axeSource);
  const result = await page.evaluate((tags) => window.axe.run(document, { runOnly: { type: "tag", values: tags } }), TAGS);
  // axe could not judge these. Measure each one: the text colour against the nearest solid
  // background behind it. This is valid only because the stylesheet uses no background images,
  // gradients, opacity or transparent colours, which the build of this report checks below.
  const measured = await page.evaluate((targets) => {
    const parse = (c) => c.match(/[\d.]+/g).map(Number);
    const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    return targets.map((target) => {
      const el = document.querySelector(target);
      if (!el) return { target, ratio: null };
      const style = getComputedStyle(el);
      let node = el;
      let bg = null;
      while (node && !bg) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c.length === 3 || c[3] === 1) bg = c.slice(0, 3);
        node = node.parentElement;
      }
      bg = bg || [255, 255, 255];
      const fg = parse(style.color);
      const [a, b] = [lum(fg.slice(0, 3)), lum(bg)].sort((x, y) => y - x);
      const size = parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      return { target, ratio: Math.round(((a + 0.05) / (b + 0.05)) * 100) / 100, needs: large ? 3 : 4.5, alpha: fg[3] !== undefined && fg[3] !== 1, fg: style.color, bg: `rgb(${bg.join(", ")})` };
    });
  }, result.incomplete.filter((item) => item.id === "color-contrast").flatMap((item) => item.nodes.map((node) => node.target.join(" "))));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.close();
  const pick = (list) => list.map((item) => ({ id: item.id, impact: item.impact, tags: item.tags.filter((t) => /^wcag\d/.test(t)), help: item.help, nodes: item.nodes.map((node) => ({ target: node.target.join(" "), summary: (node.failureSummary || "").slice(0, 300), message: node.any.concat(node.all, node.none).map((c) => c.message).join(" | ").slice(0, 300) })) }));
  runs.push({ path, view: view.name, state: state ? state.name : "default", violations: pick(result.violations), incomplete: pick(result.incomplete), passes: result.passes.length, inapplicable: result.inapplicable.length, pageOverflowPx: overflow, measured, scriptErrors: errors });
}

for (const path of pages) {
  for (const view of views) await audit(path, view, null);
  for (const state of states) {
    if (state.path !== "*" && state.path !== path) continue;
    await audit(path, views[0], state);
    await audit(path, views[3], state);
  }
}

await browser.close();
server.close();

mkdirSync("reports", { recursive: true });
const report = { tool: `axe-core ${JSON.parse(readFileSync(require.resolve("axe-core/package.json"), "utf8")).version}`, browser: version, platform: `${process.platform} ${process.arch}`, tags: TAGS, run: new Date().toISOString(), runs };
writeFileSync("reports/a11y.json", JSON.stringify(report, null, 2));

const group = (key) => {
  const found = new Map();
  for (const run of runs) for (const item of run[key]) for (const node of item.nodes) {
    const id = `${item.id} | ${node.target} | ${node.message}`;
    if (!found.has(id)) found.set(id, { item, node, where: [] });
    found.get(id).where.push(`${run.path} ${run.view} ${run.state}`);
  }
  return [...found.values()];
};
const violations = group("violations");
const incomplete = group("incomplete");
const css = readFileSync("_site/assets/css/main.css", "utf8");
const unsafe = /opacity|gradient|background-image|url\(|rgba|hsla|filter:/.test(css);
const measuredAll = runs.flatMap((run) => run.measured.map((m) => ({ ...m, where: `${run.path} ${run.view} ${run.state}` })));
const unmeasured = measuredAll.filter((m) => m.ratio === null || m.alpha);
const low = measuredAll.filter((m) => m.ratio !== null && m.ratio < m.needs);
const lowest = measuredAll.filter((m) => m.ratio !== null).sort((a, b) => a.ratio - b.ratio)[0];
const overflow = runs.filter((run) => run.pageOverflowPx > 0);
const errors = runs.filter((run) => run.scriptErrors.length);

console.log(`a11y: ${report.tool}, ${version}, ${report.platform}`);
console.log(`a11y: ${runs.length} audits of ${pages.length} pages. Rules tagged: ${TAGS.join(", ")}`);
console.log(`a11y: ${violations.length} distinct violation(s), ${incomplete.length} distinct incomplete result(s), ${overflow.length} audit(s) with sideways page scroll, ${errors.length} audit(s) with script errors`);
const reasons = new Map();
for (const { item, node, where } of incomplete) {
  const key = `${item.id}: ${node.message}`;
  reasons.set(key, (reasons.get(key) || 0) + where.length);
}
for (const [reason, count] of reasons) console.log(`INCOMPLETE x${count} ${reason}`);
console.log(`a11y: incomplete contrast results measured: ${measuredAll.length}. Below the threshold: ${low.length}. Could not be measured: ${unmeasured.length}. Stylesheet safe for this method: ${unsafe ? "NO" : "yes"}.`);
if (lowest) console.log(`a11y: lowest measured ratio ${lowest.ratio}:1 (needs ${lowest.needs}:1), ${lowest.fg} on ${lowest.bg}, ${lowest.target}, ${lowest.where}`);
for (const m of low.slice(0, 20)) console.log(`LOW CONTRAST ${m.ratio}:1 needs ${m.needs}:1 ${m.fg} on ${m.bg} ${m.target} ${m.where}`);
for (const [label, list] of [["VIOLATION", violations]]) {
  for (const { item, node, where } of list) console.log(`${label} ${item.id} (${item.impact}) ${item.tags.join(",")}\n    ${node.target}\n    ${node.message}\n    in ${where.length} audit(s), first: ${where[0]}`);
}
for (const run of overflow) console.log(`OVERFLOW ${run.pageOverflowPx}px ${run.path} ${run.view} ${run.state}`);
for (const run of errors) console.log(`SCRIPT ERROR ${run.path} ${run.view} ${run.state}: ${run.scriptErrors.join("; ")}`);
console.log("a11y: full results saved to reports/a11y.json");
process.exit(violations.length || overflow.length || errors.length || low.length || unmeasured.length || unsafe ? 1 : 0);
