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

  // A date the site does not hold is left out. It is never replaced by today's date.
  eleventyConfig.addFilter("timeTag", (iso) => (iso ? `<time datetime="${iso}">${displayDate(iso)}</time>` : ""));
  eleventyConfig.addFilter("displayDate", displayDate);
  eleventyConfig.addFilter("monthOrDay", monthOrDay);
  // The same, as a time element. A month with no day is a valid datetime.
  eleventyConfig.addFilter("monthOrDayTag", (iso) => `<time datetime="${iso}">${monthOrDay(iso)}</time>`);
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
  eleventyConfig.addFilter("splitCaveat", (text) => {
    const match = String(text || "").match(/^(.+?\.)\s+(?=[A-Z£0-9"'])([\s\S]+)$/);
    return match ? [match[1], match[2]] : [text || "", ""];
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

  // A scrolling table region with no name is named by its table's caption, so the two cannot differ.
  eleventyConfig.addTransform("tableRegions", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    let n = 0;
    return content.replace(/<div class="scroll-x" tabindex="0" role="region">(\s*<table[^>]*>\s*)<caption>/g, (whole, table) => {
      const id = `table-caption-${++n}`;
      return `<div class="scroll-x" tabindex="0" role="region" aria-labelledby="${id}">${table}<caption id="${id}">`;
    });
  });

  // Every h3 without an id gets one taken from its words, so a reader can link to it.
  eleventyConfig.addTransform("anchors", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const used = new Set([...content.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    return content.replace(/<h3>([\s\S]*?)<\/h3>/g, (whole, inner) => {
      const base = inner.replace(/<[^>]+>/g, "").replace(/&[a-z0-9#]+;/gi, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-|-$/g, "");
      if (!base) return whole;
      let id = base;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);
      return `<h3 id="${id}">${inner}</h3>`;
    });
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
