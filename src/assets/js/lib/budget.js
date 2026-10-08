// Household budget arithmetic. No DOM and no formatting.
// Implements docs/model-specification.md section 7.
// Amounts arrive in whole pence for the chosen period and are held as yearly pence.

export const PERIODS = { week: 52, "four-weeks": 13, month: 12, year: 1 };

export const PERIOD_LABELS = {
  week: "a week",
  "four-weeks": "4 weeks",
  month: "a calendar month",
  year: "a year",
};

// An amount for one period as the same amount for another, to the nearest penny.
export function convert(pence, from, to) {
  return Math.round((pence * PERIODS[from]) / PERIODS[to]);
}

// A weekly amount for the chosen period. The helpers publish weekly amounts.
export const fromWeekly = (weeklyPence, period) => convert(weeklyPence, "week", period);

// income and spending are [{ id, pence }]. taxPence is null when the reader has not entered tax.
export function budget({ period, income, spending, taxPence }) {
  const perYear = PERIODS[period];
  const yearly = (rows) => rows.map((row) => ({ id: row.id, yearlyPence: row.pence * perYear }));
  const total = (rows) => rows.reduce((sum, row) => sum + row.yearlyPence, 0);

  const incomeRows = yearly(income);
  const spendingRows = yearly(spending);
  const incomePence = total(incomeRows);
  const spendingPence = total(spendingRows);
  const taxKnown = taxPence !== null;
  const yearlyTaxPence = taxKnown ? taxPence * perYear : 0;
  const balancePence = incomePence - yearlyTaxPence - spendingPence;

  return {
    taxKnown,
    incomeRows,
    spendingRows,
    incomePence,
    taxPence: taxKnown ? yearlyTaxPence : null,
    incomeAfterTaxPence: taxKnown ? incomePence - yearlyTaxPence : null,
    spendingPence,
    balancePence,
    shortfall: balancePence < 0,
  };
}

export function weekly(yearlyPence) {
  return yearlyPence / 52;
}
