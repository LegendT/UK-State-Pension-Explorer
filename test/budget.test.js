// Expected values come from scripts/reference.py, recorded in docs/reference-calculations.md.
import { test } from "node:test";
import assert from "node:assert/strict";
import { budget, weekly } from "../src/assets/js/lib/budget.js";

test("weekly entry with tax entered", () => {
  const result = budget({
    period: "week",
    income: [{ id: "state-pension", pence: 24130 }, { id: "other", pence: 5000 }],
    spending: [{ id: "a", pence: 12000 }, { id: "b", pence: 9550 }, { id: "c", pence: 6025 }],
    taxPence: 300,
  });
  assert.equal(result.incomePence, 1514760);
  assert.equal(result.taxPence, 15600);
  assert.equal(result.incomeAfterTaxPence, 1499160);
  assert.equal(result.spendingPence, 1433900);
  assert.equal(result.balancePence, 65260);
  assert.equal(result.shortfall, false);
  assert.equal(weekly(result.balancePence).toFixed(2), "1255.00");
});

test("monthly entry, tax not entered, shortfall left as it is", () => {
  const result = budget({
    period: "month",
    income: [{ id: "all", pence: 100000 }],
    spending: [{ id: "all", pence: 110000 }],
    taxPence: null,
  });
  assert.equal(result.taxKnown, false);
  assert.equal(result.taxPence, null);
  assert.equal(result.incomeAfterTaxPence, null);
  assert.equal(result.spendingPence, 1320000);
  assert.equal(result.balancePence, -120000);
  assert.equal(result.shortfall, true);
  assert.equal((weekly(result.balancePence) / 100).toFixed(2), "-23.08");
});

test("tax entered as zero is known, not missing", () => {
  const result = budget({ period: "year", income: [{ id: "a", pence: 100 }], spending: [], taxPence: 0 });
  assert.equal(result.taxKnown, true);
  assert.equal(result.incomeAfterTaxPence, 100);
});

test("four-weekly entry of the full new State Pension matches 52 weeks", () => {
  const result = budget({
    period: "four-weeks",
    income: [{ id: "state-pension", pence: 96520 }],
    spending: [{ id: "all", pence: 90000 }],
    taxPence: null,
  });
  assert.equal(result.incomePence, 1254760);
  assert.equal(result.balancePence, 84760);
});

test("grouped spending rows add up to the total", () => {
  const result = budget({
    period: "week",
    income: [],
    spending: [{ id: "a", pence: 1 }, { id: "b", pence: 2 }, { id: "c", pence: 3 }],
    taxPence: null,
  });
  assert.equal(result.spendingRows.reduce((sum, row) => sum + row.yearlyPence, 0), result.spendingPence);
});
