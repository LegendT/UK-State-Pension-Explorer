// Tool 1: how the triple lock works. Presentation only.

import { mechanism, MEASURE_LABELS } from "../lib/uprating.js";
import { SERIES_LABELS } from "../lib/history.js";
import { money, percent, list } from "../lib/format.js";
import { announce, escapeHtml, focusFirstError, readAmount, readJson, readPercent } from "./common.js";

const data = readJson("mechanism-data");
const form = document.getElementById("mechanism-form");
const result = document.getElementById("mechanism-result");
const status = document.getElementById("mechanism-status");
const year = document.getElementById("mechanism-year");
const series = document.getElementById("mechanism-series");
const prices = document.getElementById("mechanism-prices");
const earnings = document.getElementById("mechanism-earnings");
const start = document.getElementById("mechanism-start");
const mode = document.getElementById("mechanism-mode");

let loaded = null; // the past decision now in the fields, or null for the reader's own figures

const MEASURE_NAMES = {
  prices: "prices (Consumer Prices Index)",
  earnings: "earnings",
  floor: "the 2.5% minimum",
  rpi: "prices (Retail Prices Index, that year only)",
};

function row(label, value) {
  return `<dt>${escapeHtml(label)}</dt><dd>${value}</dd>`;
}

function previousRate(record, key) {
  const index = data.years.indexOf(record);
  return index > 0 ? data.years[index - 1][`${key}_pence`] : null;
}

function load() {
  const record = data.years.find((item) => item.tax_year === year.value);
  const from = previousRate(record, series.value);
  if (from === null) {
    loaded = null;
    result.innerHTML = `<h3>No increase to show</h3><p>The new State Pension began in 2016/17. Its first full rate was set, not increased from an earlier rate. Choose a later year, or choose the basic State Pension.</p>`;
    mode.textContent = "Past decision";
    announce(status, "No increase to show for that choice.");
    return;
  }
  prices.value = (record.prices_tenths / 10).toFixed(1);
  earnings.value = (record.earnings_tenths / 10).toFixed(1);
  start.value = (from / 100).toFixed(2);
  loaded = { record, series: series.value, from };
  showPast();
}

function showPast() {
  const { record, from } = loaded;
  const to = record[`${loaded.series}_pence`];
  mode.textContent = `Past decision: ${record.tax_year}, as published`;
  result.innerHTML =
    `<h3>${escapeHtml(SERIES_LABELS[loaded.series])}, ${escapeHtml(record.tax_year)}: what was decided</h3>` +
    `<p class="headline">${percent(record.applied_tenths)} increase, decided by ${escapeHtml(MEASURE_NAMES[record.measure])}</p>` +
    `<dl>` +
    row("Prices, year to the September before", percent(record.prices_tenths)) +
    row("Earnings, May to July before, as used in the decision", percent(record.earnings_tenths)) +
    row("Minimum", "2.5%") +
    row("Weekly rate before", money(from)) +
    row("Weekly rate after, as published", money(to)) +
    row("Weekly increase", money(to - from)) +
    row("52 weeks at the new rate", money(to * 52)) +
    `</dl>` +
    (record.note ? `<p><strong>An exceptional year.</strong> ${escapeHtml(record.note)}</p>` : "") +
    `<p>These are the published decision and the published rates. They are not calculated by this tool.</p>`;
  announce(status, `Showing the decision for ${record.tax_year}: ${percent(record.applied_tenths)}.`);
}

function showOwn() {
  const p = readPercent(prices, "the rise in prices");
  const e = readPercent(earnings, "the rise in earnings");
  const s = readAmount(start, "the starting weekly amount");
  if (p === null || e === null || s === null) {
    focusFirstError(form);
    announce(status, "There is a problem with the figures entered. No result is shown.");
    result.innerHTML = `<h3>No result</h3><p>Correct the figures marked with an error, then select Show the result.</p>`;
    return;
  }
  const out = mechanism(s, p, e);
  const names = out.determining.map((name) => MEASURE_LABELS[name]);
  const decided = out.determining.length > 1 ? `a tie between ${list(names)}` : names[0];
  mode.textContent = "Hypothetical: your own figures";
  result.innerHTML =
    `<h3>Hypothetical result</h3>` +
    `<p class="headline">${percent(out.tenths)} increase, decided by ${escapeHtml(decided)}</p>` +
    `<dl>` +
    row("Prices", percent(p)) +
    row("Earnings", percent(e)) +
    row("Minimum", "2.5%") +
    row("Weekly amount before", money(s)) +
    row("Weekly amount after, before rounding", `£${(out.unroundedPence / 100).toFixed(4)}`) +
    row("Weekly amount after, rounded to the nearest 5p", money(out.pence)) +
    row("Weekly increase", money(out.increasePence)) +
    row("52 weeks at the new amount", money(out.annualPence)) +
    `</dl>` +
    `<p>This is an example using figures you entered. It is not a forecast and it is not your entitlement. It is before tax.</p>`;
  announce(status, `Hypothetical result: ${percent(out.tenths)} increase, new weekly amount ${money(out.pence)}.`);
}

document.getElementById("mechanism-load").addEventListener("click", load);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const same =
    loaded &&
    prices.value === (loaded.record.prices_tenths / 10).toFixed(1) &&
    earnings.value === (loaded.record.earnings_tenths / 10).toFixed(1) &&
    start.value === (loaded.from / 100).toFixed(2);
  if (same) {
    showPast();
  } else {
    loaded = null;
    showOwn();
  }
});

// The label changes as soon as a loaded figure is edited, before any result is shown.
for (const input of [prices, earnings, start]) {
  input.addEventListener("input", () => {
    if (loaded) mode.textContent = "Hypothetical: your own figures (select Show the result)";
  });
}
