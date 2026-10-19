// The update check: what may have gone stale since the registers were last checked.
// Run as "npm run update-check", before going live and at each update (decision 110).
// It reads the registers and the maintenance guide, fetches every source once, and reports.
// It edits nothing. Sections 1 to 5 are findings for a person; only the passage check of
// section 6 fails the run. The value check reports, and its exit status does not count: a
// value not found, or a crash, is read and the check rerun alone (row W40 of
// docs/launch-dependencies.md). Each run is recorded in the handover's "Last checks".
//
//   --days N         flag a checked_date older than N days (default 45, the sister sites' rule)
//   --today DATE     the date to count from, as YYYY-MM-DD (default today)
//   --data DIR       read the registers from DIR instead of src/_data (for a planted run); the two
//                    source scripts read src/_data only, so such a run leaves them out
//   --no-fetch       skip the fetch and the two source scripts: sections 3 to 5 only

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at === -1 ? fallback : process.argv[at + 1];
};
const DAYS = Number(arg("days", 45));
const TODAY = arg("today", new Date().toISOString().slice(0, 10));
const DATA = arg("data", "src/_data");
const FETCH = !process.argv.includes("--no-fetch");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

const read = (name) => JSON.parse(readFileSync(join(DATA, name), "utf8"));
const figures = read("figures.json");
const claims = read("claims.json");
const sources = read("sources.json");
const tables = read("tables.json");
const links = read("links.json");
const history = read("history.json");
const news = read("news.json");
const pages = read("pageRegister.json").pages;
const guide = readFileSync("docs/maintenance.md", "utf8");

const report = { run_on: TODAY, days: DAYS, data: DATA };
const section = (title) => console.log(`\n${title}`);
const line = (text) => console.log(`  ${text}`);

// A date as YYYY-MM-DD from "20 October 2026" or "October 2026", which is read as the month's last day:
// read as the 1st, a release due that month would be cleared by a recheck on the 1st and never reported.
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const monthNumber = (name) => MONTHS.indexOf(name.toLowerCase()) + 1;
const iso = (y, m, d) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
function datesIn(text) {
  const found = [];
  const dayMonthYear = /\b(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g;
  const monthYear = /\b(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g;
  text = text.replace(/\b(\d{1,2}) and (\d{1,2} \w+ \d{4})\b/g, (_, first, rest) => `${first} ${rest.slice(rest.indexOf(" ") + 1)} and ${rest}`);
  for (const [, d, m, y] of text.matchAll(dayMonthYear)) found.push(iso(y, monthNumber(m), d));
  for (const [, m, y] of text.replace(dayMonthYear, "").matchAll(monthYear)) found.push(iso(y, monthNumber(m), new Date(y, monthNumber(m), 0).getDate()));
  return [...new Set(found)];
}
const daysBetween = (from, to) => Math.round((Date.parse(to) - Date.parse(from)) / 86400000);

// 1 and 2. Every source and outbound link fetched once: status, final address, and a last-updated signal.
function signalsOf(html) {
  const meta = (name) => (html.match(new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]+)"`, "i")) || [])[1];
  const found = {};
  const add = (name, value) => { if (value) found[name] = value.slice(0, 10); };
  add("govuk:public-updated-at", meta("govuk:public-updated-at"));
  add("govuk:updated-at", meta("govuk:updated-at"));
  add("DC.Date.Modified", meta("DC.Date.Modified"));
  add("article:modified_time", meta("article:modified_time"));
  add("article:published_time", meta("article:published_time"));
  add("dateModified", (html.match(/"dateModified":\s*"([^"]+)"/) || [])[1]);
  const release = html.replace(/<[^>]+>/g, " ").match(/Release date:\s*(\d{1,2} \w+ \d{4})/);
  if (release) add("Release date", datesIn(release[1])[0]);
  return found;
}

async function fetchOne(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { headers: { "user-agent": UA }, signal: controller.signal, redirect: "follow" });
    const type = response.headers.get("content-type") || "";
    const html = type.includes("html") ? await response.text() : "";
    // The robot-check words are looked for only in an answer that is not 200: a normal page may load a captcha script.
    const refused = response.status === 429 ? "rate limited: HTTP 429, try again later" : response.status === 403 || (response.status !== 200 && /just a moment|captcha|access denied/i.test(html.slice(0, 5000))) ? `HTTP ${response.status}, the site answers with a robot check; read it in a browser` : null;
    return { status: response.status, final: response.url !== url ? response.url : null, refused, signals: signalsOf(html) };
  } catch (error) {
    return { status: 0, final: null, refused: false, signals: {}, error: error.name === "AbortError" ? "timed out after 15 s" : error.message };
  } finally {
    clearTimeout(timer);
  }
}

// One request at a time to each host, a second apart: the ONS answers 429 to a burst, and the
// passage check fetches the same pages straight after. Hosts run ten at a time.
async function fetchAll(items) {
  const results = [];
  const hosts = Object.values(Object.groupBy(items, (item) => new URL(item.url).host));
  let next = 0;
  await Promise.all(Array.from({ length: 10 }, async () => {
    while (next < hosts.length) {
      for (const item of hosts[next++]) {
        results.push({ ...item, ...(await fetchOne(item.url)) });
        await new Promise((done) => setTimeout(done, 1000));
      }
    }
  }));
  return results.sort((a, b) => a.id.localeCompare(b.id));
}

if (FETCH) {
  const items = [
    ...Object.entries(sources).map(([id, s]) => ({ id, kind: "source", url: s.url, publisher: s.publisher, checked_date: s.checked_date })),
    ...links.outbound.map((l) => ({ id: l.id, kind: "outbound link", url: l.url, publisher: l.site, checked_date: l.content_checked })),
  ];
  const fetched = await fetchAll(items);
  report.fetched = fetched;

  section(`1. Addresses: ${fetched.length} fetched once, ${Object.keys(sources).length} sources and ${links.outbound.length} outbound links.`);
  const dead = fetched.filter((f) => f.status !== 200 && !f.refused);
  const refused = fetched.filter((f) => f.refused);
  const moved = fetched.filter((f) => f.final);
  for (const f of dead) line(`DEAD      ${f.kind} ${f.id}: ${f.error || `HTTP ${f.status}`} <- ${f.url}`);
  for (const f of refused) line(`REFUSED   ${f.kind} ${f.id}: ${f.refused} <- ${f.url}`);
  for (const f of moved) line(`MOVED     ${f.kind} ${f.id}: now ${f.final}`);
  line(`${dead.length} dead, ${refused.length} refused, ${moved.length} redirected, ${fetched.length - dead.length - refused.length} answered.`);

  section("2. Newer editions: a last-updated signal later than the record's checked_date.");
  // Only a signal that moves when the page changes counts as readable: GOV.UK's public updated-at,
  // legislation.gov.uk's modified date and the generic modified-time metas. A release or published date
  // on a page tied to one edition never moves, so it says nothing, and the page is read by hand. GOV.UK's
  // govuk:updated-at moves on any edit, a typo or a tag, so it is not compared; a page with only that
  // since its check date is read by hand too (the owner's answer of 19 October 2026). A source published
  // at a new address each edition, as ONS and GOV.UK statistics are, never shows a newer signal on the
  // page checked: the guide's release table, section 4, is what finds those.
  const MODIFIED = ["govuk:public-updated-at", "DC.Date.Modified", "article:modified_time", "dateModified"];
  const modifiedSignals = (f) => Object.entries(f.signals).filter(([name]) => MODIFIED.includes(name));
  const newer = fetched.filter((f) => modifiedSignals(f).some(([, d]) => d > f.checked_date));
  for (const f of newer) line(`NEWER     ${f.kind} ${f.id}, checked ${f.checked_date}: ${modifiedSignals(f).map(([k, v]) => `${k} ${v}`).join(", ")}. Read it.`);
  line(`${newer.length} with a newer last-modified signal.`);
  const technical = fetched.filter((f) => !newer.includes(f) && f.signals["govuk:updated-at"] > f.checked_date);
  const noSignal = fetched.filter((f) => f.status === 200 && !f.refused && !modifiedSignals(f).length && !technical.includes(f));
  line(`To read by hand: ${technical.length} GOV.UK pages with a technical update since their check date and no public one, and ${noSignal.length} with no last-modified signal, by publisher.`);
  if (technical.length) line(`  Technical update only: ${technical.map((f) => `${f.id} (${f.checked_date}, edited ${f.signals["govuk:updated-at"]})`).join(", ")}`);
  const byPublisher = Object.groupBy(noSignal, (f) => f.publisher);
  for (const [publisher, list] of Object.entries(byPublisher).sort()) line(`  ${publisher}: ${list.map((f) => `${f.id} (${f.checked_date})`).join(", ")}`);
  report.newer = newer.map((f) => f.id);
  report.technical_update_only = technical.map((f) => f.id);
  report.no_signal = noSignal.map((f) => f.id);
}

// 3. Check dates older than the limit.
section(`3. Check dates older than ${DAYS} days on ${TODAY}.`);
const dated = [
  ...Object.entries(figures).map(([id, r]) => ["figure", id, r.checked_date]),
  ...Object.entries(claims).map(([id, r]) => ["claim", id, r.checked_date]),
  ...Object.entries(sources).map(([id, r]) => ["source", id, r.checked_date]),
  ...Object.entries(tables).map(([id, r]) => ["table", id, r.checked_date]),
  ["history", "history.json", history.checked_date],
  ...links.outbound.map((l) => ["outbound link", l.id, l.content_checked]),
];
const stale = dated.filter(([, , date]) => daysBetween(date, TODAY) > DAYS);
for (const [kind, id, date] of stale) line(`STALE     ${kind} ${id}: checked ${date}, ${daysBetween(date, TODAY)} days ago`);
const oldest = dated.reduce((a, b) => (a[2] < b[2] ? a : b));
line(`${stale.length} of ${dated.length} over the limit. Oldest: ${oldest[0]} ${oldest[1]}, ${oldest[2]}.`);
line(`For information, not flagged: news note as_of ${news.as_of}; pages last modified ${pages.map((p) => p.modified).filter(Boolean).sort().at(-1)}.`);
report.stale = stale.map(([kind, id, date]) => ({ kind, id, checked_date: date }));

// 4. Releases due, from the guide's own table, and each figure's next_review read the same way.
section(`4. Releases due on or before ${TODAY}, from the table in docs/maintenance.md.`);
// Only the table under "When a source publishes a new edition": the guide may gain other tables.
const releaseSection = guide.split("\n## When a source publishes a new edition")[1]?.split("\n## ")[0] ?? "";
if (!releaseSection) line("could not find the heading \"When a source publishes a new edition\" in docs/maintenance.md: section 4 has nothing to read");
const tableRows = releaseSection.split("\n").filter((l) => l.startsWith("| ") && !l.startsWith("| Date") && !l.startsWith("| ---")).map((l) => l.split("|").slice(1, -1).map((c) => c.trim())).filter((c) => c.length === 3);
const figureIds = Object.keys(figures);
function named(cell) {
  const ids = [];
  for (const [, token] of cell.matchAll(/`([^`]+)`/g)) {
    if (token === "history.json" || token === "next_year") continue;
    if (token.includes("*")) {
      const pattern = new RegExp(`^${token.replace(/\*/g, ".*")}$`);
      ids.push(...figureIds.filter((id) => pattern.test(id)).map((id) => ["figure", id]), ...Object.keys(claims).filter((id) => pattern.test(id)).map((id) => ["claim", id]));
    } else if (figures[token]) ids.push(["figure", token]);
    else if (claims[token]) ids.push(["claim", token]);
    else if (tables[token]) ids.push(["table", token]);
  }
  if (cell.includes("`history.json`")) ids.push(["history", "history.json"]);
  return ids;
}
const checkedDateOf = (kind, id) => ({ figure: figures, claim: claims, table: tables }[kind]?.[id]?.checked_date ?? history.checked_date);
const unreadable = [];
const due = [];
report.releases = [];
for (const [when, source, figuresCell] of tableRows) {
  const date = datesIn(when)[0];
  if (!date || datesIn(when).length > 1) { unreadable.push([when, source]); continue; }
  const items = named(figuresCell);
  const behind = items.filter(([kind, id]) => checkedDateOf(kind, id) < date);
  report.releases.push({ date, source, items: items.map(([, id]) => id), due: date <= TODAY && behind.length > 0 });
  if (date <= TODAY && behind.length) {
    due.push(source);
    line(`DUE       ${date} ${source}: ${behind.map(([, id]) => id).join(", ")}`);
  }
  if (!items.length) line(`NO ENTRY  ${date} ${source}: the row names no figure, claim or table, so it is checked by hand`);
  for (const [kind, id] of items) {
    if (kind !== "figure") continue;
    const own = datesIn(figures[id].next_review);
    if (own.length && !own.includes(date)) line(`DISAGREES figure ${id}: next_review says ${own.join(" or ")}, the table says ${date} (${source})`);
  }
}
line(`${due.length} due of ${tableRows.length} rows.`);
if (unreadable.length) { line("Could not read the date, check by hand:"); for (const [when, source] of unreadable) line(`  "${when}": ${source}`); }
report.releases_unreadable = unreadable.map(([when, source]) => ({ when, source }));

// 5. Typed wording that carries a tax year or a date: where each pattern appears in src/, outside the registers.
section("5. Typed wording that ages: tax years and dates in templates and scripts. Read each; the script judges nothing.");
// The previous tax year is searched too: after the April update it is the year that has gone stale.
const taxYears = [history.years.at(-2).tax_year, history.years.at(-1).tax_year, history.next_year.tax_year];
const forms = (year) => year.match(/^(\d{4})\/(\d{2})$/).slice(1).flatMap((_, i, [y, yy]) => i ? [] : [year, `${y} to ${y.slice(0, 2)}${yy}`, `${y}-${yy}`]);
const years = [...new Set(taxYears.flatMap((year) => [year.slice(0, 4), `${year.slice(0, 2)}${year.slice(5)}`]))];
// Each pattern as a regular expression: a space or &nbsp; between a month and its year, as templates
// write them (docs/markup-conventions.md), and the hyphen form not inside a figure id such as sp-spend-2026-27.
const patterns = [
  ...taxYears.flatMap(forms).map((form) => [form, new RegExp(`(?<![\\w-])${form.replace("/", "\\/")}(?![\\w-])`)]),
  ...years.map((y) => [`<month> ${y}`, new RegExp(`\\b(?:${MONTHS.map((m) => m[0].toUpperCase() + m.slice(1)).join("|")})(?: |&nbsp;)${y}\\b`)]),
];
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === "_data") return [];
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const typed = [];
for (const path of walk("src").filter((p) => /\.(njk|js|md)$/.test(p))) {
  readFileSync(path, "utf8").split("\n").forEach((text, i) => {
    const hit = patterns.filter(([, re]) => re.test(text)).map(([name]) => name);
    if (hit.length) typed.push({ path, line: i + 1, patterns: hit, text: text.trim().slice(0, 100) });
  });
}
for (const t of typed) line(`${t.path}:${t.line} [${t.patterns.join(", ")}] ${t.text}`);
line(`${typed.length} lines carry ${patterns.map(([name]) => name).join(", ")}.`);
report.typed = typed;

// 6. The two source checks, both run whichever fails; the passage check's status alone is the
// run's, so the documented rule holds by construction, not because check-values.py happens to
// exit 0 (W40).
let failed = false;
const ran = FETCH && DATA === "src/_data";
if (ran) {
  section("6. The passage and value checks.");
  for (const script of ["scripts/check-passages.py", "scripts/check-values.py"]) {
    const run = spawnSync("python3", [script], { stdio: "inherit" });
    if (script === "scripts/check-passages.py" && run.status !== 0) failed = true;
    if (script === "scripts/check-values.py" && run.status !== 0) line("The value check did not complete: read its output and rerun it alone.");
  }
}
report.source_checks_passed = ran ? !failed : null;

mkdirSync("reports", { recursive: true });
writeFileSync("reports/update-check.json", JSON.stringify(report, null, 2));
console.log(`\nupdate-check: ${!ran ? "the source checks were not run" : failed ? "FAILED, the passage check did not pass" : "the source checks passed"}; the findings above are for a person. Written to reports/update-check.json.`);
process.exit(failed ? 1 : 0);
