// Checks the built site in _site against the registers. Run by "npm run build".
// It reads what was written, not the templates, so it catches what a reader would get.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import site from "../src/_data/site.js";

const OUT = "_site";
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const register = read("src/_data/pageRegister.json").pages;
const figures = read("src/_data/figures.json");
const claims = read("src/_data/claims.json");
const sources = read("src/_data/sources.json");
const links = read("src/_data/links.json");
const problems = [];
const fail = (message) => problems.push(message);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(OUT).filter((path) => path.endsWith(".html"));
const urlOf = (path) => `/${relative(OUT, path)}`.replace(/index\.html$/, "");
const meta = (html, pattern) => (html.match(pattern) || [])[1];

// 1. Every page written is in the register, and every register entry was written.
const written = new Map(htmlFiles.map((path) => [urlOf(path), readFileSync(path, "utf8")]));
for (const url of written.keys()) if (!register.some((entry) => entry.path === url)) fail(`${url} is not in the page register`);
for (const entry of register) if (!written.has(entry.path)) fail(`${entry.path} is in the page register but was not built`);

// 2. Titles and descriptions: present, unique, and free of volatile amounts.
const seen = { title: new Map(), description: new Map() };
for (const entry of register) {
  for (const key of ["title", "description"]) {
    if (!entry[key]) fail(`${entry.path} has no ${key}`);
    if (seen[key].has(entry[key])) fail(`${entry.path} repeats the ${key} of ${seen[key].get(entry[key])}`);
    seen[key].set(entry[key], entry.path);
    if (/£\s?\d/.test(entry[key])) fail(`${entry.path} ${key} contains an amount in pounds. Rates change each year.`);
  }
  if (entry.title.length > 70) fail(`${entry.path} title is ${entry.title.length} characters`);
  if (entry.description.length > 170) fail(`${entry.path} description is ${entry.description.length} characters`);
  for (const key of ["published", "modified"]) {
    if (entry[key] !== null && !/^\d{4}-\d{2}-\d{2}$/.test(entry[key])) fail(`${entry.path} ${key} is not a date`);
    if (entry[key] && entry[key] > new Date().toISOString().slice(0, 10)) fail(`${entry.path} ${key} is in the future`);
  }
}

// 3. Each page: one h1, canonical on the configured host, language, social card, valid JSON-LD, robots rule.
for (const [url, html] of written) {
  const entry = register.find((item) => item.path === url);
  if (!entry) continue;
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${url} does not have exactly one h1`);
  if (!/<html lang="en-GB">/.test(html)) fail(`${url} does not declare en-GB`);
  const canonical = meta(html, /<link rel="canonical" href="([^"]+)"/);
  if (canonical !== `${site.url}${entry.canonical_path}`) fail(`${url} canonical is ${canonical}`);
  if (meta(html, /property="og:url" content="([^"]+)"/) !== canonical) fail(`${url} og:url differs from its canonical`);
  for (const name of ["og:title", "og:description", "og:image", "og:image:alt", "og:site_name", "og:locale"]) {
    if (!new RegExp(`property="${name}" content="[^"]+"`).test(html)) fail(`${url} has no ${name}`);
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"]) {
    if (!new RegExp(`name="${name}" content="[^"]+"`).test(html)) fail(`${url} has no ${name}`);
  }
  const image = meta(html, /property="og:image" content="([^"]+)"/);
  if (image && !existsSync(join(OUT, image.replace(site.url, "")))) fail(`${url} share image is missing: ${image}`);
  // The foot says where check dates are only on pages with figure cards, so the register must say which those are.
  const cards = /<summary[^>]*>More about this figure/.test(html);
  if (cards !== Boolean(entry.figure_cards)) fail(`${url} ${cards ? "has figure cards but" : "has no figure cards but"} figure_cards is ${Boolean(entry.figure_cards)} in the page register`);
  // Any spelling of a robots tag that carries noindex counts, so "noindex, nofollow" is not read as indexable.
  const noindex = /<meta name="robots"[^>]*noindex/i.test(html);
  if (site.production && entry.index && noindex) fail(`${url} is noindex in a production build`);
  if ((!site.production || !entry.index) && !noindex) fail(`${url} should be noindex`);
  // What separates a published page from a preview, checked in both directions.
  const banner = html.includes('class="preview-banner"');
  const beacon = html.includes("cloudflareinsights");
  if (site.production && banner) fail(`${url} carries the preview banner in a production build`);
  if (!site.production && !banner) fail(`${url} is a preview with no preview banner`);
  if (site.production && !html.includes(`"token": "${site.analyticsToken}"`)) fail(`${url} has no analytics script in a production build`);
  if (!site.production && beacon) fail(`${url} loads the analytics script outside production`);
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(block[1]);
      const page = data["@graph"].find((item) => item["@type"] === "WebPage");
      if (page.url !== canonical) fail(`${url} structured data url differs from its canonical`);
      if (page.dateModified !== undefined && page.dateModified !== entry.modified) fail(`${url} structured data date differs from the register`);
      if (/Dataset|FAQPage|NewsArticle|Review|Rating/.test(block[1])) fail(`${url} uses a structured data type this site has not approved`);
    } catch (error) {
      fail(`${url} structured data does not parse: ${error.message}`);
    }
  }
  for (const block of html.matchAll(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      fail(`${url} embedded data does not parse: ${error.message}`);
    }
  }
  if (/localhost|127\.0\.0\.1/.test(html) && site.production) fail(`${url} contains a local address`);
  if (/—/.test(html)) fail(`${url} contains an em dash`);
  if (/(undefined|NaN|\[object Object\])/.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) fail(`${url} shows undefined, NaN or an object`);
}

// 4. Internal links and anchors resolve. Every indexable page is linked from another page.
const ids = new Map([...written].map(([url, html]) => [url, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const linkedTo = new Set();
for (const [url, html] of written) {
  for (const match of html.matchAll(/<a [^>]*href="(\/[^"#]*)(#[^"]*)?"/g)) {
    const [, path, hash] = match;
    if (path.startsWith("/assets/")) {
      if (!existsSync(join(OUT, path))) fail(`${url} links to a missing file ${path}`);
      continue;
    }
    if (!written.has(path)) fail(`${url} links to ${path}, which does not exist`);
    else if (hash && hash.length > 1 && !ids.get(path).has(hash.slice(1))) fail(`${url} links to ${path}${hash}, but that anchor does not exist`);
    if (path !== url) linkedTo.add(path);
  }
  for (const match of html.matchAll(/<a [^>]*href="#([^"]+)"/g)) {
    if (!ids.get(url).has(match[1])) fail(`${url} links to #${match[1]}, but that anchor does not exist`);
  }
}
for (const entry of register) if (entry.index && entry.path !== "/" && !linkedTo.has(entry.path)) fail(`${entry.path} is not linked from any other page`);

// 5. Sitemap and robots file match the environment.
const sitemapPath = join(OUT, "sitemap.xml");
if (site.production) {
  const xml = readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const wanted = register.filter((entry) => entry.index).map((entry) => `${site.url}${entry.canonical_path}`);
  for (const loc of locs) if (!wanted.includes(loc)) fail(`sitemap lists ${loc}, which is not an indexable page in the register`);
  for (const loc of wanted) if (!locs.includes(loc)) fail(`sitemap leaves out ${loc}`);
  if (new Set(locs).size !== locs.length) fail("sitemap repeats an address");
  for (const loc of locs) if (!loc.startsWith("https://") || /[?#]/.test(loc)) fail(`sitemap address is not a clean https address: ${loc}`);
  for (const match of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    if (!register.some((entry) => entry.modified === match[1])) fail(`sitemap date ${match[1]} is not in the register`);
  }
  const robots = readFileSync(join(OUT, "robots.txt"), "utf8");
  if (!robots.includes(`Sitemap: ${site.url}/sitemap.xml`)) fail("robots.txt does not name the sitemap");
  if (/^Disallow: \/\s*$/m.test(robots.split("User-agent: *")[1].split("User-agent:")[0])) fail("robots.txt blocks all crawlers in production");
  // Any X-Robots-Tag line that is not a comment, whatever its value or quoting.
  if (existsSync("netlify.toml") && /^[ \t]*["']?X-Robots-Tag\b/im.test(readFileSync("netlify.toml", "utf8"))) fail("netlify.toml sends an X-Robots-Tag header to every context, the published site included. Previews get noindex from _headers.");
  if (existsSync(join(OUT, "_headers"))) fail("_headers was written in a production build");
} else {
  if (existsSync(sitemapPath)) fail("a sitemap was written in a build that is not production");
  // Decision 68: a preview's noindex comes from _headers, so it covers the CSV and images too.
  const headersPath = join(OUT, "_headers");
  if (!existsSync(headersPath) || !/^[ \t]+X-Robots-Tag: noindex$/m.test(readFileSync(headersPath, "utf8"))) fail("_headers does not send X-Robots-Tag: noindex in a build that is not production");
}

// 6. Registers: required fields and known sources. Unused entries are reported, not failed.
const FIGURE_FIELDS = ["label", "definition", "value", "display", "unit", "population", "basis", "geography", "period_label", "source_id", "table_reference", "classification", "checked_date", "review_status"];
for (const [id, record] of Object.entries(figures)) {
  for (const field of FIGURE_FIELDS) if (record[field] === undefined || record[field] === null || record[field] === "") fail(`figure ${id} has no ${field}`);
  if (!sources[record.source_id]) fail(`figure ${id} names unknown source ${record.source_id}`);
  if (record.classification === "derived-calculation" && (!record.formula || !record.inputs.length)) fail(`figure ${id} is calculated but has no formula or inputs`);
  for (const input of record.inputs || []) if (!figures[input]) fail(`figure ${id} names unknown input ${input}`);
}
for (const [id, record] of Object.entries(claims)) {
  if (record.kind === "not-found" ? record.source_id !== null : !sources[record.source_id]) fail(`claim ${id} has a wrong source: ${record.source_id}`);
  if (!record.passage && record.kind !== "not-found" && !record.note) fail(`claim ${id} has no passage and no note`);
}
for (const [id, record] of Object.entries(sources)) {
  for (const field of ["publisher", "title", "url", "checked_date", "licence"]) if (!record[field]) fail(`source ${id} has no ${field}`);
  if (!/^https:\/\//.test(record.url)) fail(`source ${id} address is not https`);
  if (record.status !== undefined && !["accredited", "official", "in-development", "suspended"].includes(record.status)) fail(`source ${id} has a status that is not accredited, official, in-development or suspended: ${record.status}`);
}
const templates = walk("src").filter((path) => /\.(njk|json|js)$/.test(path) && !/figures\.json|claims\.json|sources\.json/.test(path)).map((path) => readFileSync(path, "utf8")).join("\n");
const registersText = JSON.stringify(figures) + JSON.stringify(claims) + readFileSync("src/_data/tables.json", "utf8") + readFileSync("src/_data/budgets.json", "utf8") + readFileSync("src/_data/scenarios.json", "utf8");
const unused = { figures: [], claims: [], sources: [] };
for (const id of Object.keys(figures)) if (!templates.includes(`"${id}"`) && !Object.values(figures).some((f) => (f.inputs || []).includes(id))) unused.figures.push(id);
for (const id of Object.keys(claims)) if (!templates.includes(`"${id}"`)) unused.claims.push(id);
for (const id of Object.keys(sources)) if (!registersText.includes(`"${id}"`) && !templates.includes(`"${id}"`)) unused.sources.push(id);

// 7. Sister-site links: only live, checked destinations are used, and the link text names the site.
for (const link of links.outbound) {
  if (link.status === "live" && (!link.content_checked || link.http_status !== 200)) fail(`link ${link.id} is live without a content check`);
  const used = [...written.values()].some((html) => html.includes(`href="${link.url}"`));
  if (link.status !== "live" && used) fail(`link ${link.id} is used but is not live in the register`);
  if (link.status === "live" && !used) fail(`link ${link.id} is live in the register but is not used`);
  for (const [url, html] of written) {
    for (const piece of html.split(`<a href="${link.url}">`).slice(1)) {
      const text = piece.slice(0, piece.indexOf("</a>"));
      if (!text.includes(link.site)) fail(`${url} links to ${link.id} without naming ${link.site}`);
    }
  }
}

// 8. The markup conventions in the README that a pattern can hold. The others need reading.
for (const [url, html] of written) {
  for (const [div, attrs, inner] of html.matchAll(/<div class="scroll-x"([^>]*)>([\s\S]*?)<\/div>/g)) {
    const caption = (inner.match(/^\s*<table[^>]*>\s*<caption id="([^"]+)"/) || [])[1];
    const by = meta(attrs, /aria-labelledby="([^"]+)"/);
    if (/^\s*<table/.test(inner) && (!caption || by !== caption)) fail(`${url}: a scrolling table is not named by its caption: ${div.slice(0, 120)}`);
    if (!by && !/aria-label="[^"]+"/.test(attrs)) fail(`${url}: a scrolling region has no name`);
  }
  if (/<\/dt><dd>/.test(html)) fail(`${url}: a dt runs into its dd with no space`);
  // VoiceOver with Safari read a hint joined to a fieldset at every field in it (step 4): a group's
  // hint goes with its first field, through the field macro's groupHint.
  if (/<fieldset[^>]*aria-describedby/.test(html)) fail(`${url}: a fieldset has a description; join it to the group's first field`);
  // VoiceOver with Safari read a time element twice, and stopped at the edges of a span (step 4).
  if (/<time[\s>]|class="date"/.test(html)) fail(`${url}: a date in an element; print dates with dateText or monthOrDayText`);
}
// A heading a script draws later, in a result or an error state, is not in the built page, so the
// scripts are read for one without an id (W29). Every h2 and h3 keeps one id in every state.
for (const path of walk("src/assets/js")) {
  const bare = readFileSync(path, "utf8").match(/<h[23]\b(?![^>]*\sid=)[^>]*>[^<`$]*/);
  if (bare) fail(`${path}: a script draws a heading with no id: ${bare[0]}`);
  if (/<time[\s>]|class="date"/.test(readFileSync(path, "utf8"))) fail(`${path}: a script draws a date in an element`);
}
for (const [url, html] of written) {
  for (const [, svg, inner] of html.matchAll(/(<svg[^>]*role="img"[^>]*>)([\s\S]*?)<\/svg>/g)) {
    if (!/aria-labelledby="[^" ]+-title"/.test(svg) || /aria-describedby/.test(svg)) fail(`${url}: a chart's name is not its title alone: ${svg}`);
    // Inside a chart image only its title is exposed: everything drawn is in one hidden group that
    // closes at the end of the image (step 4). Depth counts the groups inside it.
    const drawing = inner.match(/^<title[^>]*>[^<]*<\/title>(<g aria-hidden="true">[\s\S]*)$/);
    let depth = 0;
    const closesAtEnd = drawing && [...drawing[1].matchAll(/<g[\s>]|<\/g>/g)].every((tag, i, all) => (depth += tag[0] === "</g>" ? -1 : 1) > 0 || i === all.length - 1) && depth === 0;
    if (!closesAtEnd) fail(`${url}: a chart image exposes what it draws: ${svg}`);
  }
  // A chart starts with its figcaption, and a paragraph of what it shows comes just before it, outside
  // the figure: VoiceOver with Safari left a description unheard, and passed over a paragraph inside
  // the figure (step 4, decision 104).
  // Its last sentence links to the chart's table, so a reader can skip the chart.
  for (const [, summary, inner] of html.matchAll(/(<p class="chart-summary">[^<]*<a href="#[^"]+">[^<]*<\/a>\.<\/p>)?\s*<figure class="chart"[^>]*>([\s\S]*?)<\/figure>/g)) {
    if (!/^\s*<figcaption>/.test(inner)) fail(`${url}: a chart does not start with its figcaption`);
    if (!summary) fail(`${url}: a chart has no summary just before it, ending in a link to its table`);
    else if (!new RegExp(`<div class="scroll-x" id="${summary.match(/href="#([^"]+)"/)[1]}"[^>]*><table`).test(html)) fail(`${url}: a chart's summary does not link to a table on the page`);
    if (inner.includes("chart-summary")) fail(`${url}: a chart's summary is inside its figure`);
  }
  for (const [, cls, first] of html.matchAll(/<div class="([^"]*)" role="note">\s*<([a-z0-9]+)/g)) {
    if (!/^h[2-6]$/.test(first) && !cls.includes("preview")) fail(`${url}: a ${cls} note does not start with a heading`);
  }
  for (const [section] of html.matchAll(/<section[^>]*aria-labelledby[^>]*>/g)) if (!section.includes('class="tool"')) fail(`${url}: a named section that is not a calculator: ${section}`);
  for (const [nav] of html.matchAll(/<nav\b[^>]*>/g)) if (!/aria-label(ledby)?="/.test(nav)) fail(`${url}: a nav has no name`);
}

console.log(`check-build: ${written.size} pages, ${Object.keys(figures).length} figures, ${Object.keys(claims).length} claims, ${Object.keys(sources).length} sources, environment "${site.env}".`);
for (const [kind, list] of Object.entries(unused)) if (list.length) console.log(`check-build: ${list.length} ${kind} in the register are not used on any page: ${list.join(", ")}`);
if (problems.length) {
  console.error(`check-build: ${problems.length} problem(s)`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log("check-build: no problems found in the checks listed in scripts/check-build.mjs.");
