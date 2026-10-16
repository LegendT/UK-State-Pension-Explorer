import { lineChart } from "./src/assets/js/lib/chart.js";
import { renderComparison, renderSummary } from "./src/assets/js/lib/compare-view.js";
import { historyCsv, renderHistory } from "./src/assets/js/lib/history-view.js";
import { money, percent } from "./src/assets/js/lib/format.js";
import { compareRules, mechanism, RULES, RULE_LABELS } from "./src/assets/js/lib/uprating.js";

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

function displayDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) throw new Error(`Not an ISO date: "${iso}"`);
  return longDate.format(new Date(`${iso}T00:00:00Z`));
}

// Some sources give a month and no day. The day is never made up.
function monthOrDay(iso) {
  if (/^\d{4}-\d{2}$/.test(String(iso))) return monthYear.format(new Date(`${iso}-01T00:00:00Z`));
  return displayDate(iso);
}

const DISPLAY = {
  money: (v) => money(Math.round(v * 100)),
  pounds: (v) => `£${v.toLocaleString("en-GB")}`,
  billions: (v) => `£${v.toLocaleString("en-GB", { maximumFractionDigits: 1 })} billion`,
  millionPounds: (v) => `£${v.toLocaleString("en-GB")} million`,
  millions: (v) => `${v.toLocaleString("en-GB", { maximumFractionDigits: 1 })} million`,
  percent: (v) => `${v.toLocaleString("en-GB")}%`,
  percentGdp: (v) => `${v.toLocaleString("en-GB")}% of GDP`,
  number: (v) => v.toLocaleString("en-GB"),
  text: (v) => String(v),
};

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/assets/");

  // A date the site does not hold is left out. It is never replaced by today's date. Plain text, its spaces
  // non-breaking so it never splits across lines. No element: VoiceOver with Safari read a time element
  // twice, and stopped at the edges of a span (step 4).
  const unbroken = (text) => text.replace(/ /g, "\u00a0");
  eleventyConfig.addFilter("dateText", (iso) => (iso ? unbroken(displayDate(iso)) : ""));
  eleventyConfig.addFilter("displayDate", displayDate);
  eleventyConfig.addFilter("monthOrDay", monthOrDay);
  // The same, for a source that gives a month only.
  eleventyConfig.addFilter("monthOrDayText", (iso) => unbroken(monthOrDay(iso)));
  eleventyConfig.addFilter("money", (pence) => money(pence));
  eleventyConfig.addFilter("percent", (tenths) => percent(tenths));
  // Plain values for form fields: "230.25" and "3.8".
  eleventyConfig.addFilter("plainPounds", (pence) => (pence / 100).toFixed(2));
  eleventyConfig.addFilter("plainPercent", (tenths) => (tenths / 10).toFixed(1));
  eleventyConfig.addFilter("renderHistory", (options) => renderHistory(options));
  eleventyConfig.addFilter("historyCsv", (options) => historyCsv(options));
  eleventyConfig.addFilter("renderComparison", (options) => renderComparison(options));
  eleventyConfig.addFilter("renderSummary", (options) => renderSummary(options));
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("where", (rows, key, value) => rows.filter((row) => row[key] === value));
  eleventyConfig.addFilter("fail", (message) => {
    throw new Error(message);
  });
  eleventyConfig.addFilter("absolute", function (path) {
    return `${this.ctx.site.url}${path}`;
  });

  // Every figure in prose comes from the register. An unknown id stops the build.
  eleventyConfig.addFilter("fig", function (id) {
    const record = this.ctx.figures[id];
    if (!record) throw new Error(`No figure "${id}" in src/_data/figures.json (${this.page.inputPath})`);
    return DISPLAY[record.display](record.value);
  });
  // A figure as shown, with "around" where the source gives an approximate amount.
  eleventyConfig.addFilter("figShown", function (id) {
    const record = this.ctx.figures[id];
    if (!record) throw new Error(`No figure "${id}" in src/_data/figures.json (${this.page.inputPath})`);
    const shown = DISPLAY[record.display](record.value);
    return record.approximate ? `around ${shown}` : shown;
  });
  // The first sentence of a figure's qualifications is the caveat that changes what the figure
  // means, and is shown open. The rest is shown under "More about this figure".
  const splitCaveat = (text) => {
    const match = String(text || "").match(/^(.+?\.)\s+(?=[A-Z£0-9"'])([\s\S]+)$/);
    return match ? [match[1], match[2]] : [text || "", ""];
  };
  eleventyConfig.addFilter("splitCaveat", splitCaveat);
  // The caveat a source line opens with must say what changes the figure's meaning (W19, from F3 of
  // the readability review). The kind is printed beside it, so a first sentence that only restates
  // the kind or the status, such as "A survey estimate.", "A 50-year projection, not a forecast." or
  // "Official statistics in development.", stops the
  // build, as does an empty one. Tested where the line is drawn, so a figure reaching a source line
  // through a variable or a loop is tested too.
  const BARE_KIND = /^(an? |the )?([\w-]+ ){0,2}(estimate|benchmark|projection|forecast|count|statistic|calculation|figure|rate|rule)s?( only)?(, not an? \w+)?\.$|^indicative only\.$|^(accredited )?official statistics( in development|, not accredited)?(, which can be revised)?\.$|^accreditation (is )?suspended\.$/i;
  eleventyConfig.addFilter("openCaveat", function (f) {
    const caveat = splitCaveat(f.qualifications);
    if (!caveat[0]) throw new Error(`Figure "${f.id}" is shown with a source line but has no caveat to open with (${this.page.inputPath})`);
    if (BARE_KIND.test(caveat[0])) throw new Error(`Figure "${f.id}" opens with a kind, not a caveat: "${caveat[0]}" (${this.page.inputPath})`);
    return caveat;
  });
  // What a group of figures has in common, for one line above the group (W18, from R14 of the
  // readability review): the kind, the period, the source and the key caveat, each only where every
  // figure in the group has it. Each figure's own note then leaves those parts out.
  eleventyConfig.addFilter("shared", function (ids) {
    if (ids.length < 2) throw new Error(`A shared line needs two or more figures: ${ids.join(", ")}`);
    const records = ids.map((id) => {
      if (!this.ctx.figures[id]) throw new Error(`No figure "${id}" in src/_data/figures.json (${this.page.inputPath})`);
      return this.ctx.figures[id];
    });
    const same = (key) => records.every((r) => r[key] === records[0][key]);
    const caveat = splitCaveat(records[0].qualifications)[0];
    const statuses = records.map((r) => this.ctx.sources[r.source_id].status);
    const g = {
      kind: same("classification") && same("provisional") && statuses.every((s) => s === statuses[0]) ? { ...records[0], status: statuses[0] } : null,
      period: same("period_label") ? records[0].period_label : null,
      source: same("source_id") ? this.ctx.sources[records[0].source_id] : null,
      caveat: caveat && records.every((r) => splitCaveat(r.qualifications)[0] === caveat) ? caveat : null,
    };
    if (!g.kind && !g.period && !g.source && !g.caveat) throw new Error(`Figures ${ids.join(", ")} share nothing to say once`);
    return g;
  });
  eleventyConfig.addFilter("upperFirst", (text) => text.charAt(0).toUpperCase() + text.slice(1));
  eleventyConfig.addFilter("figPence", function (id) {
    const record = this.ctx.figures[id];
    if (!record || record.display !== "money") throw new Error(`No money figure "${id}"`);
    return Math.round(record.value * 100);
  });
  eleventyConfig.addFilter("pounds4", (pence) => `£${(pence / 100).toFixed(4)}`);
  eleventyConfig.addFilter("factor", (tenths) => (1 + tenths / 1000).toFixed(3));
  eleventyConfig.addFilter("figure", function (id) {
    const record = this.ctx.figures[id];
    if (!record) throw new Error(`No figure "${id}" in src/_data/figures.json (${this.page.inputPath})`);
    const source = this.ctx.sources[record.source_id];
    if (!source) throw new Error(`Figure "${id}" names unknown source "${record.source_id}"`);
    return { ...record, id, shown: DISPLAY[record.display](record.value), source };
  });
  // What the budget tool needs in the browser: categories, income rows and presets with a readable source.
  eleventyConfig.addFilter("budgetData", function (budgets) {
    return {
      categories: budgets.categories,
      income: budgets.income,
      full_new_rate: this.ctx.figures["nsp-full-weekly"].value.toFixed(2),
      presets: budgets.presets.map((preset) => {
        const source = this.ctx.sources[preset.source_id];
        return { ...preset, source: `${source.publisher}, ${source.title}` };
      }),
    };
  });
  eleventyConfig.addFilter("claim", function (id) {
    const record = this.ctx.claims[id];
    if (!record) throw new Error(`No claim "${id}" in src/_data/claims.json (${this.page.inputPath})`);
    return { ...record, id, source: record.source_id ? this.ctx.sources[record.source_id] : null };
  });
  eleventyConfig.addFilter("link", function (id) {
    const record = this.ctx.links.outbound.find((link) => link.id === id);
    if (!record || record.status !== "live") throw new Error(`No live link "${id}" in src/_data/links.json`);
    return record;
  });
  eleventyConfig.addFilter("sourceRecord", function (id) {
    const source = this.ctx.sources[id];
    if (!source) throw new Error(`No source "${id}" in src/_data/sources.json (${this.page.inputPath})`);
    return { ...source, id };
  });

  eleventyConfig.addFilter("lineChart", (options) => lineChart(options));
  eleventyConfig.addFilter("mechanism", (input) => mechanism(input.startPence, input.prices, input.earnings));
  eleventyConfig.addFilter("compareRules", (input) => ({
    ...compareRules(input.startPence, input.path, input.cashFloor !== false),
    order: RULES,
    labels: RULE_LABELS,
  }));

  // A short citation shows only the publisher. When two citations next to each other in one
  // paragraph or list item name the same publisher but different sources, both show their title,
  // so they do not look like the same source twice.
  const CITE = /(Source: <a class="cite" href="([^"]+)">)([^<]+)<span class="visually-hidden">([^<]*)<\/span>/g;
  const BLOCK = /<(p|dd|li)\b[^>]*>(?:(?!<\1\b|<\/\1>)[\s\S])*<\/\1>/g;
  eleventyConfig.addTransform("tellCitationsApart", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(BLOCK, (block) => {
      const refs = [...block.matchAll(CITE)];
      const show = new Set();
      refs.forEach((ref, i) => {
        const next = refs[i + 1];
        if (next && next[3] === ref[3] && next[2] !== ref[2]) show.add(i).add(i + 1);
      });
      let i = -1;
      return block.replace(CITE, (whole, open, href, publisher, title) => (show.has(++i) ? `${open}${publisher}${title}` : whole));
    });
  });

  // A figure in running text (m.f) must be followed by its own source's citation before any other
  // and before the next heading, so it never sits under another body's citation (W24, from F4 of the
  // readability review). m.f leaves a comment naming the figure and its source's address; this
  // checks it and removes it, so the published page carries no trace.
  // ponytail: looks only at the first citation after the figure, so a figure cited by its own source
  // two paragraphs later passes. Bound the search to the figure's block if that is ever abused.
  const FIG_MARK = /<!--fig:(\S+) (\S*)-->/g;
  eleventyConfig.addTransform("proseCitations", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const problems = [];
    for (const mark of content.matchAll(FIG_MARK)) {
      const after = content.slice(mark.index + mark[0].length);
      const stop = after.search(/<h[1-6]\b/);
      const cite = (stop < 0 ? after : after.slice(0, stop)).match(/<a class="cite" href="([^"]+)"/);
      if (!cite) problems.push(`"${mark[1]}" has no citation before the next heading`);
      else if (cite[1] !== mark[2]) problems.push(`"${mark[1]}" is followed first by a citation of ${cite[1]}, not its own source ${mark[2]}`);
    }
    if (problems.length) throw new Error(`A figure in running text sits under another source's citation, or none (${this.page.inputPath}):\n  ${problems.join("\n  ")}`);
    return content.replace(FIG_MARK, "");
  });

  // A scrolling table region with no name is named by its table's caption, so the two cannot differ.
  // The caption's id is typed in the template (W29): a caption without one stops the build.
  eleventyConfig.addTransform("tableRegions", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    if (/<caption\b(?![^>]*\sid=)/.test(content)) throw new Error(`A table caption has no id (${this.page.inputPath})`);
    return content.replace(/<div class="scroll-x" tabindex="0" role="region">(\s*<table[^>]*>\s*)<caption id="([^"]+)">/g, (whole, table, id) => {
      return `<div class="scroll-x" tabindex="0" role="region" aria-labelledby="${id}">${table}<caption id="${id}">`;
    });
  });

  // Every h2 and h3 carries an id typed in the template, so an address does not change when a heading
  // is reworded (W29, from R16 of the readability review). Until 13 October 2026 an h3 without one was
  // given an id made from its words at build time. A page with two elements of one id also stops.
  eleventyConfig.addTransform("anchors", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const bare = [...content.matchAll(/<h[23]\b[^>]*>[^<]*/g)].find((m) => !/\sid="/.test(m[0]));
    if (bare) throw new Error(`A heading has no id: ${bare[0]} (${this.page.inputPath})`);
    const ids = [...content.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const twice = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (twice.length) throw new Error(`An id is used twice: ${[...new Set(twice)].join(", ")} (${this.page.inputPath})`);
    return content;
  });

  // A page's one name: its label in the reform section list, else in the main navigation, else its
  // register title. The Next and Previous links and the site map use it (W7).
  eleventyConfig.addFilter("pageName", function (path) {
    const { site, pages } = this.ctx;
    const hit = site.reformPages.find((p) => p.href === path) || site.nav.find((p) => p.href === path);
    return hit ? hit.label : pages.find((p) => p.path === path).title;
  });
  // The pages before and after this one: the reform section's reading order, or a "next" in the page
  // register. Null where there is none.
  eleventyConfig.addFilter("pager", function (path) {
    const order = this.ctx.site.reformPages.map((p) => p.href);
    const i = order.indexOf(path);
    if (i >= 0) return { previous: order[i - 1] || null, next: order[i + 1] || null };
    const entry = this.ctx.pages.find((p) => p.path === path);
    return { previous: null, next: (entry && entry.next) || null };
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
