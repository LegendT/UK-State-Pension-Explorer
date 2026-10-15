// Drives the four tools in a headless Chrome the way a reader does and checks what each shows: the
// period and helper fields kept through a change, a blank or zero tax field, recovery from an
// incomplete or wrong entry, household and example changes, a malformed or restored address, history
// subranges and the table export, the copied link, and the focus and announcements that go with each
// (W12, from audit finding A14). A module that fails to load is checked by a11y-manual-assist.mjs.
// Serves _site itself, so run npm run build first. Chrome is the one on the computer, as a11y.mjs.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
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
const budgets = JSON.parse(readFileSync("src/_data/budgets.json", "utf8"));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
await browser.defaultBrowserContext().overridePermissions(base, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"]);
const problems = [];
let checks = 0;
function check(name, ok, detail) {
  checks += 1;
  if (!ok) problems.push(`${name}${detail === undefined ? "" : `: ${JSON.stringify(detail)}`}`);
}
// The live redraw waits 400 ms after the last keystroke; a little more lets the status settle.
const settle = () => new Promise((resolve) => setTimeout(resolve, 700));
async function open(path) {
  const page = await browser.newPage();
  page.errors = [];
  page.on("pageerror", (error) => page.errors.push(String(error)));
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(base + path, { waitUntil: "networkidle0" });
  return page;
}
// A missing element throws, so a check never passes on a page that lacks what it reads.
const text = (page, selector) => page.$eval(selector, (el) => el.textContent.trim());
const value = (page, selector) => page.$eval(selector, (el) => el.value);
async function type(page, selector, keys) {
  await page.focus(selector);
  await page.$eval(selector, (el) => { el.value = ""; });
  await page.keyboard.type(keys);
  await settle();
}
const submit = (page, form) => page.$eval(form, (el) => el.requestSubmit());

// Budget explorer.
{
  const page = await open("/tools/budget/");
  const firstIncome = `#budget-${budgets.income.find((row) => !row.couple_only && row.id !== "state-pension").id}`;
  const coupleOnly = `#budget-${budgets.income.find((row) => row.couple_only).id}`;
  const firstSpend = `#budget-${budgets.categories[0].id}`;
  await page.select("#budget-period", "month");
  await type(page, firstIncome, "1000");
  check("budget: a result follows the first amount", (await text(page, "#budget-result h3")) === "Your result");
  check("budget: the update is announced", /Result updated/.test(await text(page, "#budget-status")));
  check("budget: a blank tax field leaves the balance before tax", /Balance before tax/.test(await text(page, "#budget-result")) && !/after the tax you entered/.test(await text(page, "#budget-result")), await text(page, "#budget-result .headline"));
  await type(page, "#budget-tax", "0");
  check("budget: a zero tax field is known, not missing", /after the tax you entered/.test(await text(page, "#budget-result")), await text(page, "#budget-result .headline"));
  await page.click("#budget-fill-pension");
  await settle();
  const pensionMonthly = await value(page, "#budget-state-pension");
  const fullRate = await page.$eval("#budget-data", (el) => JSON.parse(el.textContent).full_new_rate);
  check("budget: the helper fills the pension in the period chosen", pensionMonthly === (Math.round(Number(fullRate) * 100 * 52 / 12) / 100).toFixed(2), [pensionMonthly, fullRate]);
  await page.click("#budget-household-couple");
  await settle();
  check("budget: a household change keeps the period", (await value(page, "#budget-period")) === "month");
  check("budget: a household change keeps the amounts and the helper's figure", (await value(page, firstIncome)) === "1000" && (await value(page, "#budget-state-pension")) === pensionMonthly);
  check("budget: two people shows the second pension field", await page.$eval(coupleOnly, (el) => el.offsetParent !== null));
  const couplePreset = budgets.presets.find((preset) => preset.household === "couple").id;
  await page.select("#budget-preset", couplePreset);
  await page.click("#budget-load");
  await settle();
  check("budget: loading an example fills the spending fields", (await value(page, firstSpend)) !== "", await value(page, firstSpend));
  check("budget: loading an example is announced", /Example budget loaded/.test(await text(page, "#budget-status")));
  const before = await text(page, "#budget-result");
  await type(page, firstSpend, "-");
  check("budget: a half-typed amount keeps the last result, marked out of date", (await page.$(".tool-stale")) !== null && (await text(page, "#budget-result")).includes("Out of date"));
  check("budget: the out-of-date state is announced", /out of date/.test(await text(page, "#budget-status")), await text(page, "#budget-status"));
  check("budget: the field shows its error", (await page.$eval(firstSpend, (el) => el.getAttribute("aria-invalid"))) === "true" && (await text(page, `${firstSpend}-error`)) !== "");
  await type(page, firstSpend, "100");
  check("budget: a corrected amount redraws the result", (await page.$(".tool-stale")) === null && (await text(page, "#budget-result")) !== before && (await page.$eval(firstSpend, (el) => el.getAttribute("aria-invalid"))) === "false");
  await type(page, firstSpend, "abc");
  await submit(page, "#budget-form");
  await settle();
  check("budget: a submit with a wrong entry takes focus to the field, shows no result and says so", (await page.evaluate(() => document.activeElement.id)) === firstSpend.slice(1) && /No result/.test(await text(page, "#budget-result h3")) && /problem with the amounts/.test(await text(page, "#budget-status")));
  await page.click("#budget-clear");
  await settle();
  check("budget: clearing empties the fields and is announced", (await value(page, firstIncome)) === "" && /cleared/.test(await text(page, "#budget-status")));
  check("budget: no script error", page.errors.length === 0, page.errors);
  await page.close();
}

// Rule comparison.
{
  const page = await open("/reform-options/compare/");
  await page.select("#compare-scenario", "low");
  await settle();
  check("compare: a scenario change renames the result and its reason", /low inflation/.test(await text(page, "#compare-result h3")) && (await text(page, "#compare-reason")) !== "");
  await page.click("#compare-edit summary");
  await type(page, "#compare-prices-0", "5.0");
  check("compare: an edited figure makes the result the reader's own", /your own figures/.test(await text(page, "#compare-result h3")) && /ones you entered/.test(await text(page, "#compare-result .source-line")));
  await type(page, "#compare-start", "200");
  check("compare: an entered start is named in the source line", /one you entered/.test(await text(page, "#compare-result .source-line")));
  await type(page, "#compare-years", "abc");
  check("compare: a wrong number of years keeps the last result, marked out of date", (await page.$(".tool-stale")) !== null);
  await submit(page, "#compare-form");
  await settle();
  check("compare: a submit with a wrong entry takes focus to the field and says so", (await page.evaluate(() => document.activeElement.id)) === "compare-years" && /Not available/.test(await text(page, "#compare-result h3")) && /problem with the figures/.test(await text(page, "#compare-status")));
  await type(page, "#compare-years", "5");
  check("compare: a corrected entry redraws the result", /starting from £200\.00/.test(await text(page, "#compare-result h3")));
  check("compare: nothing is written to the address", (await page.evaluate(() => location.search)) === "");
  await page.click("#compare-copy-link");
  await settle();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  check("compare: the copied link carries the settings shown", /start=200/.test(link) && /years=5/.test(link) && /prices=5\.0/.test(link) && /scenario=low/.test(link), link);
  check("compare: the copy is announced and noted, and the announcement stays", /has been copied/.test(await text(page, "#compare-status")) && /has been copied/.test(await text(page, "#compare-copy-note")));
  check("compare: no script error", page.errors.length === 0, page.errors);
  await page.close();
  const restored = await open(link.replace(/^https?:\/\/[^/]+/, ""));
  check("compare: the copied link reopens the result", /your own figures, starting from £200\.00/.test(await text(restored, "#compare-result h3")) && (await value(restored, "#compare-scenario")) === "low" && (await value(restored, "#compare-prices-0")) === "5.0");
  check("compare: nothing is announced on arrival", (await text(restored, "#compare-status")) === "");
  await restored.close();
  const malformed = await open("/reform-options/compare/?scenario=zzz&years=abc&start=xyz&first=1999&measure=nope&floor=off&prices=1,2&earnings=3");
  check("compare: a malformed address breaks nothing and keeps the menus valid", malformed.errors.length === 0 && (await value(malformed, "#compare-scenario")) === "steady" && (await value(malformed, "#compare-measure")) === "cash", malformed.errors);
  check("compare: a malformed address shows the wrong amount's error, not a result", /Not available/.test(await text(malformed, "#compare-result h3")) && (await text(malformed, "#compare-start-error")) !== "" && (await value(malformed, "#compare-years")) === "10");
  await malformed.close();
}

// History explorer.
{
  const page = await open("/tools/history/");
  await page.select("#history-series", "new");
  await page.select("#history-from", "2020/21");
  await page.select("#history-to", "2024/25");
  await page.select("#history-rule", "earnings");
  await settle();
  check("history: a subrange with a rule is drawn", /2020\/21 to 2024\/25/.test(await text(page, "#history-result h3")) && (await page.$$eval("#history-result tbody tr", (rows) => rows.length)) === 5);
  check("history: the calculated column is there", /Calculated: Earnings link/.test(await text(page, "#history-result thead")));
  check("history: the update is announced", /Result updated/.test(await text(page, "#history-status")));
  await page.click("#history-copy");
  await settle();
  const csv = await page.evaluate(() => navigator.clipboard.readText());
  const lines = csv.trim().split("\n");
  check("history: the copied table has a row for each year shown and the calculated columns", lines.length === 6 && /calculated_earnings_from_2020\/21/.test(lines[0]) && lines[1].startsWith("2020/21,"), lines[0]);
  check("history: the copy is announced", /has been copied/.test(await text(page, "#history-status")), await text(page, "#history-status"));
  await page.click("#history-download");
  await settle();
  check("history: the download is announced", /downloaded/.test(await text(page, "#history-status")), await text(page, "#history-status"));
  await page.select("#history-to", "2018/19");
  await settle();
  check("history: a last year before the first year is refused and the result kept", (await text(page, "#history-error")) !== "" && /2020\/21 to 2024\/25/.test(await text(page, "#history-result h3")));
  check("history: no script error", page.errors.length === 0, page.errors);
  await page.close();
  const restored = await open("/tools/history/?series=new&from=2018%2F19&to=2022%2F23&measure=earnings&rule=prices#explorer");
  check("history: a link restores the result it holds", /2018\/19 to 2022\/23/.test(await text(restored, "#history-result h3")) && (await value(restored, "#history-measure")) === "earnings" && (await value(restored, "#history-rule")) === "prices");
  check("history: nothing is announced on arrival", (await text(restored, "#history-status")) === "");
  await restored.close();
  const malformed = await open("/tools/history/?series=zzz&from=1999%2F00&to=abc&measure=nope&rule=none");
  check("history: a malformed address breaks nothing and shows the full range", malformed.errors.length === 0 && /2010\/11 to 2026\/27/.test(await text(malformed, "#history-result h3")), malformed.errors);
  await malformed.close();
}

// Triple lock calculator.
{
  const page = await open("/tools/triple-lock/");
  const published = await text(page, "#mechanism-result .headline");
  await type(page, "#mechanism-prices", "-");
  check("triple lock: a half-typed figure keeps the published decision, marked out of date", (await page.$(".tool-stale")) !== null && (await text(page, "#mechanism-result .headline")) === published);
  await type(page, "#mechanism-prices", "9.0");
  check("triple lock: a typed figure gives a hypothetical result", /Hypothetical result/.test(await text(page, "#mechanism-result h3")) && /9\.0% increase, decided by prices/.test(await text(page, "#mechanism-result .headline")));
  check("triple lock: the hypothetical result is announced", /Hypothetical result/.test(await text(page, "#mechanism-status")));
  await page.click("#mechanism-copy-link");
  await settle();
  check("triple lock: a copy after typing is announced, and the announcement stays", /has been copied/.test(await text(page, "#mechanism-status")) && /prices=9\.0/.test(await page.evaluate(() => navigator.clipboard.readText())), await text(page, "#mechanism-status"));
  await type(page, "#mechanism-earnings", "abc");
  await submit(page, "#mechanism-form");
  await settle();
  check("triple lock: a submit with a wrong entry takes focus to the field and says so", (await page.evaluate(() => document.activeElement.id)) === "mechanism-earnings" && /No result/.test(await text(page, "#mechanism-result h3")) && /problem with the figures/.test(await text(page, "#mechanism-status")));
  await type(page, "#mechanism-earnings", "4.8");
  await page.select("#mechanism-year", "2022/23");
  await page.click("#mechanism-load");
  await settle();
  check("triple lock: loading a decision shows it as published", /2022\/23: what was decided/.test(await text(page, "#mechanism-result h3")) && /Past decision: 2022\/23/.test(await text(page, "#mechanism-mode")));
  check("triple lock: no script error", page.errors.length === 0, page.errors);
  await page.close();
  const restored = await open("/tools/triple-lock/?year=2024%2F25&series=basic&prices=3.1&earnings=4.0&start=100.00#tool");
  check("triple lock: a link with typed figures opens a hypothetical result quietly", /Hypothetical result/.test(await text(restored, "#mechanism-result h3")) && (await value(restored, "#mechanism-start")) === "100.00" && (await text(restored, "#mechanism-status")) === "");
  await restored.close();
  const malformed = await open("/tools/triple-lock/?year=1999%2F00&series=zzz&prices=abc");
  check("triple lock: a malformed address breaks nothing and shows the field's error", malformed.errors.length === 0 && (await text(malformed, "#mechanism-prices-error")) !== "" && /No result/.test(await text(malformed, "#mechanism-result h3")), malformed.errors);
  await malformed.close();
}

await browser.close();
server.close();
console.log(`check-tools: ${checks} checks, ${problems.length} problem(s).`);
for (const problem of problems) console.log(`  - ${problem}`);
process.exit(problems.length ? 1 : 0);
