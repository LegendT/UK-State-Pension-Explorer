// Measurements that support the manual part of the assessment. They do not replace a person.
// Reflow at 320 CSS px (1.4.10), text spacing (1.4.12), target size (2.5.8), heading order,
// keyboard focus order and visible focus (2.1.1, 2.4.3, 2.4.7, 2.4.11), and no-JavaScript reading.
// Also checks that the "On this page" list marks the section being read. Run it after changing
// src/assets/js/contents.js, the contents macro or the .contents styles.
// Usage: npm run build && node scripts/a11y-manual-assist.mjs

import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import puppeteer from "puppeteer";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".csv": "text/csv" };
const server = createServer((request, response) => {
  let path = join("_site", decodeURIComponent(new URL(request.url, "http://x").pathname));
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, "index.html");
  response.writeHead(200, { "content-type": TYPES[extname(path)] || "text/plain" });
  response.end(readFileSync(path));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const pages = JSON.parse(readFileSync("src/_data/pageRegister.json", "utf8")).pages.map((entry) => entry.path);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const report = { run: new Date().toISOString(), browser: await browser.version(), pages: {} };
const problems = [];
let contentsChecked = 0;
let followedChecked = 0;

for (const path of pages) {
  const out = {};
  const page = await browser.newPage();

  // Reflow: 320 CSS px wide, the width of a 1280 px window at 400% zoom.
  await page.setViewport({ width: 320, height: 256 });
  await page.goto(base + path, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  out.reflow = await page.evaluate(() => {
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll("body *")]
      .filter((el) => !el.closest(".scroll-x") && el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== "absolute")
      .map((el) => `${el.tagName.toLowerCase()}.${el.className} "${(el.textContent || "").trim().slice(0, 40)}"`);
    return { pageOverflowPx: overflow, elementsPastEdge: wide.slice(0, 5), count: wide.length };
  });
  if (out.reflow.pageOverflowPx > 0 || out.reflow.count) problems.push(`${path} reflow: ${JSON.stringify(out.reflow)}`);

  // Text spacing: the four overrides of SC 1.4.12. Look for clipped or overlapping text.
  await page.setViewport({ width: 390, height: 844 });
  await page.addStyleTag({ content: "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }" });
  out.textSpacing = await page.evaluate(() => {
    const clipped = [...document.querySelectorAll("body *")].filter((el) => {
      const s = getComputedStyle(el);
      if (el.closest(".visually-hidden, .skip-link") || el.matches(".visually-hidden, .skip-link")) return false;
      const hides = [s.overflowX, s.overflowY].some((v) => v === "hidden" || v === "clip");
      return hides && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
    });
    return { clipped: clipped.map((el) => el.tagName + "." + el.className).slice(0, 5), pageOverflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  if (out.textSpacing.clipped.length || out.textSpacing.pageOverflowPx > 0) problems.push(`${path} text spacing: ${JSON.stringify(out.textSpacing)}`);
  await page.close();

  // Target size, headings, focus. Fresh page at phone width.
  const second = await browser.newPage();
  await second.setViewport({ width: 390, height: 844 });
  await second.goto(base + path, { waitUntil: "networkidle0" });
  await second.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  out.targets = await second.evaluate(() => {
    const controls = [...document.querySelectorAll("a[href], button, input, select, summary")].filter((el) => el.offsetParent !== null && !el.closest(".skip-link") && !el.matches(".skip-link"));
    const inline = (el) => el.tagName === "A" && getComputedStyle(el).display === "inline" && el.parentElement.textContent.trim().length > el.textContent.trim().length;
    const rows = controls.map((el) => ({ el, box: el.getBoundingClientRect(), inline: inline(el) }));
    const name = (r) => `${r.el.tagName.toLowerCase()}#${r.el.id} "${(r.el.textContent || r.el.value || "").trim().slice(0, 30)}" ${Math.round(r.box.width)}x${Math.round(r.box.height)}`;
    return {
      total: rows.length,
      inlineExempt: rows.filter((r) => r.inline).length,
      under24: rows.filter((r) => !r.inline && (r.box.width < 24 || r.box.height < 24)).map(name),
      under44: rows.filter((r) => !r.inline && (r.box.width < 44 || r.box.height < 44) && r.box.width >= 24 && r.box.height >= 24).map(name),
    };
  });
  if (out.targets.under24.length) problems.push(`${path} targets under 24px: ${out.targets.under24.join("; ")}`);

  out.headings = await second.evaluate(() => {
    const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter((h) => h.offsetParent !== null).map((h) => ({ level: Number(h.tagName[1]), text: h.textContent.trim().slice(0, 50) }));
    const skips = levels.filter((h, i) => i > 0 && h.level > levels[i - 1].level + 1).map((h) => `h${h.level} "${h.text}"`);
    return { count: levels.length, skips };
  });
  if (out.headings.skips.length) problems.push(`${path} heading levels skipped: ${out.headings.skips.join("; ")}`);

  // Keyboard: press Tab through the page. Record order, whether focus is visible, and whether
  // the focused element is on screen and not covered.
  await second.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = false)));
  const expected = await second.evaluate(() => [...document.querySelectorAll("a[href], button, input, select, summary, [tabindex='0']")].filter((el) => el.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true }) && !el.closest("details:not([open]) > :not(summary)"))
    // A group of radio buttons is one tab stop.
    .filter((el, i, all) => el.type !== "radio" || all.findIndex((other) => other.type === "radio" && other.name === el.name) === i).length);
  const seen = [];
  for (let i = 0; i < expected + 5; i += 1) {
    await second.keyboard.press("Tab");
    const info = await second.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const box = el.getClientRects()[0] || el.getBoundingClientRect();
      const visible = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2) || s.boxShadow !== "none";
      const x = Math.min(Math.max(box.left + box.width / 2, 0), innerWidth - 1);
      const y = Math.min(Math.max(box.top + box.height / 2, 0), innerHeight - 1);
      const top = document.elementFromPoint(x, y);
      const covered = !(top && (el.contains(top) || top.contains(el)));
      const onScreen = box.bottom > 0 && box.top < innerHeight;
      return { key: `${el.tagName.toLowerCase()}#${el.id}|${(el.textContent || "").trim().slice(0, 25)}`, visible, covered, onScreen, y: Math.round(box.top + scrollY) };
    });
    if (!info) break;
    if (seen.length && info.key === seen[0].key) break;
    seen.push(info);
  }
  out.keyboard = {
    expected,
    reached: seen.length,
    noVisibleFocus: seen.filter((f) => !f.visible).map((f) => f.key),
    coveredOrOffScreen: seen.filter((f) => f.covered || !f.onScreen).map((f) => f.key),
    backwards: seen.filter((f, i) => i > 1 && f.y < seen[i - 1].y - 60).map((f) => f.key),
  };
  if (out.keyboard.reached < expected || out.keyboard.noVisibleFocus.length || out.keyboard.coveredOrOffScreen.length || out.keyboard.backwards.length) problems.push(`${path} keyboard: ${JSON.stringify(out.keyboard)}`);
  await second.close();

  // No JavaScript: the explanation must still be readable, and tool forms must not show.
  const third = await browser.newPage();
  await third.setJavaScriptEnabled(false);
  await third.goto(base + path, { waitUntil: "networkidle0" });
  out.noScript = await third.evaluate(() => ({
    words: document.querySelector("main").innerText.split(/\s+/).length,
    formsShown: [...document.querySelectorAll("form")].filter((f) => f.offsetParent !== null).length,
    noticesShown: [...document.querySelectorAll(".no-js-only")].filter((f) => f.offsetParent !== null).length,
    tools: document.querySelectorAll(".tool").length,
  }));
  if (out.noScript.formsShown || out.noScript.noticesShown !== out.noScript.tools) problems.push(`${path} without JavaScript: ${JSON.stringify(out.noScript)}`);
  await third.close();

  // "On this page": the link for the section being read is marked while scrolling and after a jump.
  const fourth = await browser.newPage();
  await fourth.setViewport({ width: 1400, height: 900 });
  await fourth.goto(base + path, { waitUntil: "networkidle0" });
  if (await fourth.$("main > .contents:not(.section-nav)")) {
    contentsChecked += 1;
    const links = "main > .contents:not(.section-nav) a";
    const frames = () => fourth.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const current = () => fourth.evaluate((sel) => [...document.querySelectorAll(sel)].findIndex((a) => a.getAttribute("aria-current") === "location"), links);
    const count = await fourth.$$eval(links, (a) => a.length);
    const mid = Math.floor(count / 2);
    const steps = [];
    await fourth.evaluate(() => scrollTo(0, document.body.scrollHeight)); await frames();
    steps.push(["bottom marks the last link", (await current()) === count - 1]);
    await (await fourth.$$(links))[0].click(); await frames();
    steps.push(["following the first link marks it", (await current()) === 0]);
    // Scroll to the second section, not a fixed distance: a first section can be longer than any fixed step.
    await fourth.evaluate((sel) => {
      const second = document.getElementById(document.querySelectorAll(sel)[1].hash.slice(1));
      scrollTo(0, second.getBoundingClientRect().top + scrollY);
    }, links); await frames();
    steps.push(["scrolling on moves the mark from the first link", ![0, -1].includes(await current())]);
    await (await fourth.$$(links))[mid].click(); await frames();
    steps.push(["following a middle link marks it", (await current()) === mid]);
    await fourth.evaluate(() => scrollBy(0, -400)); await frames();
    steps.push(["scrolling back up moves the mark off it", ![mid, -1].includes(await current())]);
    // In a tall window a last heading can stay below the marking line even at the bottom of the page,
    // so only the followed-link hold marks it. Pages where that happens are counted.
    await fourth.setViewport({ width: 1400, height: 2000 });
    await (await fourth.$$(links))[count - 1].click(); await frames();
    const belowLine = await fourth.evaluate((sel) => {
      const last = [...document.querySelectorAll(sel)].at(-1);
      return document.getElementById(last.hash.slice(1)).getBoundingClientRect().top > innerHeight / 4;
    }, links);
    if (belowLine) followedChecked += 1;
    steps.push(["following the last link marks it", (await current()) === count - 1]);
    await fourth.setViewport({ width: 1400, height: 450 });
    await fourth.evaluate(() => scrollTo(0, document.body.scrollHeight)); await frames();
    steps.push(["in a short window the marked link is in view", await fourth.evaluate((sel) => {
      const nav = document.querySelector(sel), box = nav.getBoundingClientRect(), mark = nav.querySelector('[aria-current="location"]')?.getBoundingClientRect();
      return Boolean(mark) && mark.top >= box.top && mark.bottom <= box.bottom;
    }, "main > .contents:not(.section-nav)")]);
    out.contents = steps.filter(([, ok]) => !ok).map(([name]) => name);
    if (out.contents.length) problems.push(`${path} On this page: ${out.contents.join("; ")}`);
  }
  await fourth.close();

  report.pages[path] = out;
  console.log(`${path}  reflow ${out.reflow.pageOverflowPx}px  spacing clipped ${out.textSpacing.clipped.length}  targets ${out.targets.total} (under 24: ${out.targets.under24.length}, 24 to 43: ${out.targets.under44.length}, inline exempt: ${out.targets.inlineExempt})  headings ${out.headings.count} skips ${out.headings.skips.length}  tab stops ${out.keyboard.reached}/${expected}  no-JS words ${out.noScript.words}`);
}

await browser.close();
// Every page with the list lost it, or the selector no longer matches: either way nothing was checked.
if (!contentsChecked) problems.push("On this page: no page with the list was found, so the marking was not checked");
if (contentsChecked && !followedChecked) problems.push("On this page: no last heading stayed below the marking line, so the hold on a followed link was not checked");
server.close();
mkdirSync("reports", { recursive: true });
writeFileSync("reports/a11y-manual-assist.json", JSON.stringify(report, null, 2));
console.log(`manual-assist: ${report.browser}. ${problems.length} problem(s). Saved to reports/a11y-manual-assist.json`);
for (const problem of problems) console.log(`  - ${problem.slice(0, 700)}`);
process.exit(problems.length ? 1 : 0);
