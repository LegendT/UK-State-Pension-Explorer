// Expected values come from scripts/reference.py (Python Decimal), sections 5 and 6.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { applyIncrease } from "../src/assets/js/lib/uprating.js";
import { earningsIndex, inLatestPrices, observed, reconstruct } from "../src/assets/js/lib/history.js";

const { years } = JSON.parse(readFileSync(new URL("../src/_data/history.json", import.meta.url)));
const pence = (rows) => rows.map((row) => row.pence);

test("every published rate follows from the previous one, the decision and 5p rounding", () => {
  for (const series of ["basic", "new"]) {
    const rows = observed(years, series);
    rows.slice(1).forEach((year, i) => {
      const expected = applyIncrease(rows[i][`${series}_pence`], year.applied_tenths).pence;
      assert.equal(year[`${series}_pence`], expected, `${series} ${year.tax_year}`);
    });
  }
});

test("the new State Pension series does not start before 2016/17", () => {
  assert.equal(observed(years, "new")[0].tax_year, "2016/17");
  assert.equal(observed(years, "basic")[0].tax_year, "2010/11");
});

test("the recorded decision matches the triple lock except in the exceptional years", () => {
  for (const year of years) {
    if (year.exceptional) continue;
    const highest = Math.max(year.prices_tenths, year.earnings_tenths, 25);
    assert.equal(year.applied_tenths, highest, year.tax_year);
  }
  const suspended = years.find((year) => year.tax_year === "2022/23");
  assert.equal(suspended.applied_tenths, 31);
  assert.equal(suspended.earnings_tenths, 83);
});

test("basic State Pension reconstructed from 2010/11", () => {
  assert.deepEqual(pence(reconstruct(years, "basic", "2010/11", "triple-lock")),
    [10070, 10595, 10860, 11155, 11435, 11765, 12060, 12420, 12745, 13240, 13570, 14695, 16180, 17555, 18275, 19150]);
  assert.deepEqual(pence(reconstruct(years, "basic", "2010/11", "double-lock")),
    [10070, 10595, 10830, 11120, 11255, 11580, 11860, 12215, 12535, 13025, 13090, 14175, 15605, 16930, 17625, 18470]);
  assert.deepEqual(pence(reconstruct(years, "basic", "2010/11", "earnings")),
    [9890, 10165, 10330, 10455, 10520, 10825, 11085, 11330, 11625, 12080, 12080, 13085, 13805, 14980, 15595, 16345]);
  assert.deepEqual(pence(reconstruct(years, "basic", "2010/11", "prices")),
    [10070, 10595, 10830, 11120, 11255, 11255, 11370, 11710, 11990, 12195, 12255, 12635, 13910, 14840, 15090, 15665]);
});

test("new State Pension reconstructed from 2016/17, and the start year changes the result", () => {
  assert.deepEqual(pence(reconstruct(years, "new", "2016/17", "triple-lock")),
    [15955, 16435, 16860, 17520, 17960, 19450, 21415, 23235, 24190, 25350]);
  assert.deepEqual(pence(reconstruct(years, "new", "2016/17", "prices")),
    [15720, 16190, 16580, 16860, 16945, 17470, 19235, 20525, 20875, 21670]);
  assert.deepEqual(pence(reconstruct(years, "basic", "2020/21", "earnings")),
    [13425, 14540, 15340, 16645, 17325, 18155]);
  assert.deepEqual(pence(reconstruct(years, "basic", "2020/21", "triple-lock")),
    [13760, 14900, 16405, 17800, 18530, 19420]);
});

test("constant prices and the earnings index", () => {
  const latest = years[years.length - 1];
  // 97.65 x 139.3 / 87.1 = 156.17273...
  assert.ok(Math.abs(inLatestPrices(9765, years[0], latest) - 15617.273) < 0.01);
  assert.equal(inLatestPrices(latest.basic_pence, latest, latest), latest.basic_pence);
  // 100 x 1.024 x 1.022 = 104.6528
  const index = earningsIndex(observed(years, "new").slice(0, 3));
  assert.ok(Math.abs(index[2] - 104.6528) < 1e-9);
});

test("At a glance names the years where Parliament set the rule aside and the calculation did not", async () => {
  const { renderHistorySummary } = await import("../src/assets/js/lib/history-view.js");
  const glance = (series, from, to, rule) => renderHistorySummary({ years, series, from, to, measure: "cash", rule });
  const earnings = "For 2022/23 the calculation uses earnings growth of 8.3%, which Parliament set aside that year. The published rate rose by 3.1%.";
  const rpi = "For 2011/12 the calculation uses the Consumer Prices Index, 3.1%. That year only, the published rate used the Retail Prices Index: 4.6%.";
  for (const rule of ["triple-lock", "double-lock", "earnings"]) assert.ok(glance("new", "2016/17", "2026/27", rule).includes(earnings), rule);
  assert.ok(!glance("new", "2016/17", "2026/27", "prices").includes("<p>For "), "prices link used 3.1% as Parliament did");
  assert.ok(!glance("new", "2022/23", "2026/27", "triple-lock").includes("<p>For "), "a start year is not calculated");
  assert.ok(!glance("new", "2016/17", "2026/27", "").includes("<p>For "), "no rule, no line");
  for (const rule of ["triple-lock", "double-lock", "prices"]) assert.ok(glance("basic", "2010/11", "2012/13", rule).includes(rpi), rule);
  assert.ok(!glance("basic", "2010/11", "2026/27", "earnings").includes(rpi), "the earnings link differs by its own rule");
  assert.ok(!glance("basic", "2020/21", "2021/22", "double-lock").includes("<p>For "), "2021/22 kept the triple lock");
  const unflagged = years.map((year) => year.tax_year === "2022/23" ? { ...year, earnings_not_used: false } : year);
  assert.ok(renderHistorySummary({ years: unflagged, series: "new", from: "2016/17", to: "2026/27", measure: "cash", rule: "triple-lock" })
    .includes("For 2022/23 the calculation gives 8.3%. The published rate rose by 3.1%."), "a departure with no known reason still gets a line");
});

test("with a rule added, the chart's title says how far the calculation ends from the published rate", async () => {
  const { renderHistory } = await import("../src/assets/js/lib/history-view.js");
  const title = (from, to, rule, measure = "cash") => renderHistory({ years, series: "new", from, to, measure, rule }).match(/<h4>([^<]*)<\/h4>/)[1];
  assert.equal(title("2016/17", "2026/27", "triple-lock"), "Calculated under the triple lock with no exceptions, the rate ends £12.20 a week above the published rate in 2026/27");
  assert.equal(title("2023/24", "2026/27", "triple-lock"), "Calculated under the triple lock with no exceptions, the rate ends at the published rate in 2026/27");
  assert.match(title("2016/17", "2026/27", "prices"), /^Calculated under the prices link, the rate ends £[\d.]+ a week below the published rate in 2026\/27$/);
  assert.match(title("2016/17", "2026/27", ""), /^The full new State Pension rose in pounds in every year/);
  // A published rate 10p above the calculation, on £241.30.
  const nudged = years.map((year) => (year.tax_year === "2026/27" ? { ...year, new_pence: year.new_pence + 10 } : year));
  const near = renderHistory({ years: nudged, series: "new", from: "2023/24", to: "2026/27", measure: "cash", rule: "triple-lock" });
  assert.match(near, /<h4>Calculated under the triple lock with no exceptions, the rate ends less than 0.1% from the published rate in 2026\/27<\/h4>/);
  // Merged, the two lines read as one name in the legend.
  const merged = renderHistory({ years, series: "new", from: "2023/24", to: "2026/27", measure: "cash", rule: "triple-lock" });
  assert.match(merged, /Published rate and calculated under the triple lock from 2023\/24: the same in every year/);
});
