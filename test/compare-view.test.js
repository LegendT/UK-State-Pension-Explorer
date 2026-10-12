// The rule comparison's summary: the gap from the triple lock in each measure. The chart's title (W21).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gap, renderComparison } from "../src/assets/js/lib/compare-view.js";

const text = (html) => html.replace(/<[^>]+>/g, "");

test("the gap from the triple lock says less, more or the same, in the measure shown", () => {
  assert.equal(text(gap({ pence: 33345 }, { pence: 34540 }, "cash")), "£11.95 less than the triple lock");
  assert.equal(text(gap({ pence: 34545 }, { pence: 34540 }, "cash")), "£0.05 more than the triple lock");
  assert.equal(gap({ pence: 34540 }, { pence: 34540 }, "cash"), "the same");
  assert.equal(text(gap({ realPence: 29004.6 }, { realPence: 29104.4 }, "real")), "£0.99 less than the triple lock");
});

test("an index gap is worked from the rounded values shown, so it agrees with them", () => {
  // 100.04 and 100.06 print as 100.0 and 100.1, so the gap is 0.1, not "the same".
  assert.equal(text(gap({ earningsIndex: 100.04 }, { earningsIndex: 100.06 }, "earnings")), "0.1 points less than the triple lock");
});

test("the chart is drawn when every rule gives almost the same value", () => {
  // From £250.00 at 4.0% and 4.0%, the rules differ only by floating-point noise in buying power
  // and against earnings. The tick loop once never ended on that input, which froze the page.
  const equal = [{ prices: 40, earnings: 40 }, { prices: 40, earnings: 40 }];
  for (const [startPence, path] of [[25000, equal], [20000, [{ prices: 100, earnings: 100 }, { prices: 100, earnings: 100 }]], [24130, [{ prices: 40, earnings: 40 }]]]) {
    for (const measure of ["cash", "real", "earnings"]) {
      const html = renderComparison({ startPence, path, cashFloor: true, firstYear: 2027, measure, scenarioLabel: "your own figures" });
      // The y-axis labels are the ticks anchored at the end.
      const labels = [...html.matchAll(/<text class="chart-tick"[^>]*text-anchor="end">([^<]*)<\/text>/g)].map((m) => m[1]);
      assert.ok(labels.length > 1, `${startPence} ${measure}: no axis labels`);
      assert.ok(html.includes("<svg"), `${startPence} ${measure}: no chart`);
      assert.equal(new Set(labels).size, labels.length, `${startPence} ${measure}: axis labels repeat: ${labels.join(" | ")}`);
    }
  }
});

test("the chart's title counts rules less than 0.1% apart as level, and says so", () => {
  // Steady growth over 30 years: the April 2030 rule ends 10p above the three rules that follow earnings.
  const steady = JSON.parse(readFileSync(new URL("../src/_data/scenarios.json", import.meta.url))).scenarios.find((s) => s.id === "steady");
  const title = (path) => renderComparison({ startPence: 24130, path, cashFloor: true, firstYear: 2027, measure: "cash", scenarioLabel: "x" }).match(/<h4>([^<]*)<\/h4>/)[1];
  assert.equal(title(steady.path.slice(0, 30)), "The triple lock, double lock, earnings link and April 2030 rule end highest, less than 0.1% apart, after 30 years, and the prices link ends lowest");
  assert.equal(title(steady.path.slice(0, 10)), "The triple lock, double lock, earnings link and April 2030 rule end highest after 10 years, and the prices link ends lowest");
  assert.equal(title(Array(30).fill({ prices: 37, earnings: 37 })), "All five rules end less than 0.1% apart after 30 years");
  assert.equal(title(Array(30).fill({ prices: 33, earnings: 33 })), "All five rules end at the same amount after 30 years");
  // The two links end 25p apart on about £253.
  assert.equal(title([{ prices: 40, earnings: 10 }, { prices: 10, earnings: 41 }]), "The triple lock and the double lock end highest after 2 years, and the earnings link and the prices link end lowest, less than 0.1% apart");
});

test("totals in starting-year prices are shown to the pound, with their sign (W23)", () => {
  const html = renderComparison({ startPence: 24130, path: [{ prices: 40, earnings: 10 }, { prices: 40, earnings: 10 }], cashFloor: true, firstYear: 2027, measure: "cash", scenarioLabel: "your own figures" });
  const row = html.match(/<th scope="row">Earnings link<\/th>((?:<td[^>]*>[^<]*<\/td>){4})<\/tr><tr><th scope="row">Prices link/)[1];
  const cells = [...row.matchAll(/>([^<]*)</g)].map((m) => m[1]).filter(Boolean);
  assert.match(cells[0], /^£[\d,]+\.\d\d$/, "the cash total keeps its pence");
  assert.match(cells[2], /^£[\d,]+$/, "the starting-year total is to the pound");
  assert.match(cells[3], /^−£[\d,]+$/, "the difference is to the pound, with its sign");
});
