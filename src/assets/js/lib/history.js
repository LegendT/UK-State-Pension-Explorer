// Pension history arithmetic. No DOM and no formatting.
// Implements docs/model-specification.md section 8.
// Published rates and decisions are read, never recalculated. Only the comparison is calculated.

import { applyIncrease, upratingFor } from "./uprating.js";

export const SERIES_LABELS = {
  basic: "Full basic State Pension",
  new: "Full new State Pension",
};

// Years of one series that have a published rate.
export function observed(years, series) {
  return years.filter((year) => year[`${series}_pence`] !== null);
}

// Applies one rule from the rate of startYear, using the figures recorded for each later decision.
export function reconstruct(years, series, startYear, rule) {
  const rows = observed(years, series);
  const start = rows.findIndex((year) => year.tax_year === startYear);
  let pence = rows[start][`${series}_pence`];
  return rows.slice(start + 1).map((year) => {
    const { tenths, determining } = upratingFor(rule, year.prices_tenths, year.earnings_tenths);
    pence = applyIncrease(pence, tenths).pence;
    return { tax_year: year.tax_year, pence, tenths, determining };
  });
}

// Amount in the prices of the last year given, using the CPI index for the September before each rate.
export function inLatestPrices(pence, year, latestYear) {
  return (pence * latestYear.cpi_index) / year.cpi_index;
}

// Earnings index from the growth figures used in each decision. The first year given is 100.
export function earningsIndex(rows) {
  let index = 100;
  return rows.map((year, i) => {
    if (i > 0) index *= 1 + year.earnings_tenths / 1000;
    return index;
  });
}
