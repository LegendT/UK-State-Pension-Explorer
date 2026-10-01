// The rule comparison's summary: the gap from the triple lock in each measure.
import { test } from "node:test";
import assert from "node:assert/strict";
import { gap } from "../src/assets/js/lib/compare-view.js";

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
