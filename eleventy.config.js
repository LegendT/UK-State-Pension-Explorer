import { lineChart } from "./src/assets/js/lib/chart.js";
import { renderComparison } from "./src/assets/js/lib/compare-view.js";
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

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
