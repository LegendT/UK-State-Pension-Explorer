// Expected values come from scripts/reference.py, recorded in docs/reference-calculations.md.
import { test } from "node:test";
import assert from "node:assert/strict";
import { budget, fromWeekly, weekly } from "../src/assets/js/lib/budget.js";

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
  // 1p, 2p and 3p a week for 52 weeks, worked by hand: the total, and the rows that make it up.
  assert.equal(result.spendingPence, 312);
  assert.equal(result.spendingRows.reduce((sum, row) => sum + row.yearlyPence, 0), 312);
});

test("a helper's weekly amount in the chosen period", () => {
  // Worked by hand, not from scripts/reference.py: the conversion is one multiplication and one division.
  // 241.30 a week is 12,547.60 a year: 1,045.63 a month (1,045.6333 rounded), 965.20 every 4 weeks.
  assert.equal(fromWeekly(24130, "week"), 24130);
  assert.equal(fromWeekly(24130, "four-weeks"), 96520);
  assert.equal(fromWeekly(24130, "month"), 104563);
  assert.equal(fromWeekly(24130, "year"), 1254760);
  // 241.31 a week is 1,045.6767 a month, which rounds up.
  assert.equal(fromWeekly(24131, "month"), 104568);
});

test("the summary and the headline give amounts for the period the reader enters", async () => {
  const { renderBudget, renderBudgetSummary } = await import("../src/assets/js/lib/budget-view.js");
  const figures = (period, income, spending) => ({ period, income: [{ id: "a", label: "A", pence: income }], spending: [{ id: "b", label: "B", pence: spending }], taxPence: null });
  const plain = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const text = (...args) => plain(renderBudgetSummary(figures(...args)));
  // Worked by hand, not from scripts/reference.py: each amount is the yearly amount divided by the periods in a year.
  // 1,045.63 and 2,000.00 a month: 12,547.56 and 24,000.00 a year, a shortfall of 954.37 a month.
  const month = text("month", 104563, 200000);
  assert.match(month, /Shortfall of £954\.37 a calendar month \(£11,452\.44 a year\)/);
  assert.match(month, /Income £1,045\.63 a calendar month/);
  assert.match(month, /Spending £2,000\.00 a calendar month/);
  assert.match(plain(renderBudget(figures("month", 104563, 200000))), /Balance before tax: Shortfall of £954\.37 a calendar month \(£11,452\.44 a year\)/);
  assert.match(text("week", 24130, 10000), /£141\.30 left over a week \(£7,347\.60 a year\)/);
  assert.match(text("four-weeks", 96520, 0), /£965\.20 left over every 4 weeks \(£12,547\.60 a year\)/);
  // A year needs no yearly figure in brackets.
  assert.match(text("year", 1254760, 0), /£12,547\.60 left over a year Income/);
});
