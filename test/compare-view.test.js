// The rule comparison's summary: the gap from the triple lock in each measure.
import { test } from "node:test";
import assert from "node:assert/strict";
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
