// Tool 1: how the triple lock works. Presentation only.

import { mechanism, MEASURE_LABELS } from "../lib/uprating.js";
import { SERIES_LABELS } from "../lib/history.js";
import { money, percent, list } from "../lib/format.js";
import { markStale, STALE_MESSAGE, announce, escapeHtml, live, pinSummary, readAmount, readJson, readPercent, setError, updatedNote } from "./common.js";

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
const glance = document.getElementById("mechanism-glance");

let loaded = null; // the past decision now in the fields, or null for the reader's own figures

const MEASURE_NAMES = {
  prices: "prices (Consumer Prices Index)",
  earnings: "earnings",
  floor: "the 2.5% minimum",
  rpi: "prices (Retail Prices Index, that year only)",
};

function row(label, value) {
  return `<dt>${escapeHtml(label)}</dt> <dd>${value}</dd>`;
}

function previousRate(record, key) {
  const index = data.years.indexOf(record);
  return index > 0 ? data.years[index - 1][`${key}_pence`] : null;
}

function load(quiet) {
  const record = data.years.find((item) => item.tax_year === year.value);
  const from = previousRate(record, series.value);
  if (from === null) {
    loaded = null;
    // Nothing to keep if a figure is then half typed.
    hasResult = false;
    result.innerHTML = `<div class="unavailable" role="note"><h3>Not available: an increase for that choice</h3><p>The new State Pension began in 2016/17. Its first full rate was set, not increased from an earlier rate. Choose a later year, or choose the basic State Pension.</p></div>`;
    glance.innerHTML = `<p>No increase to show for that choice.</p>`;
    mode.textContent = "Past decision";
    announce(status, "No increase to show for that choice.");
    return;
  }
  prices.value = (record.prices_tenths / 10).toFixed(1);
  earnings.value = (record.earnings_tenths / 10).toFixed(1);
  start.value = (from / 100).toFixed(2);
  for (const field of [prices, earnings, start]) setError(field, "");
  loaded = { record, series: series.value, from };
  showPast(quiet);
}

function showPast(quiet) {
  hasResult = true;
  const { record, from } = loaded;
  const to = record[`${loaded.series}_pence`];
  mode.textContent = `Past decision: ${record.tax_year}, as published`;
  result.innerHTML =
    `<h3>${escapeHtml(SERIES_LABELS[loaded.series])}, ${escapeHtml(record.tax_year)}: what was decided</h3>` +
    `<p class="headline">${percent(record.applied_tenths)} increase, decided by ${escapeHtml(MEASURE_NAMES[record.measure])}</p>` +
    `<dl>` +
    row("Prices, year to the September before", percent(record.prices_tenths)) +
    row("Earnings, May to July before, as published at the time", percent(record.earnings_tenths) + (record.earnings_not_used ? " (not used)" : "")) +
    row("Minimum", "2.5%") +
    row("Weekly rate before", money(from)) +
    row("Weekly rate after, as published", money(to)) +
    row("Weekly increase", money(to - from)) +
    row("52 weeks at the new rate", money(to * 52)) +
    `</dl>` +
    (record.note ? `<div class="note" role="note"><h4>An exceptional year</h4><p>${escapeHtml(record.note)}</p></div>` : "") +
    `<p>These are the published decision and the published rates. This tool did not calculate them.</p>` +
    // In some years the rates and the decision are in one memorandum: one link, not two to one document.
    `<p class="source-line">${record.rate_source_url === record.decision_source_url
      ? `Source: <a href="${record.decision_source_url}">the explanatory memorandum to the Up-rating Order for ${escapeHtml(record.tax_year)}</a>`
      : `Sources: <a href="${record.rate_source_url}">the published rates for ${escapeHtml(record.tax_year)}</a> and <a href="${record.decision_source_url}">the explanatory memorandum to the Up-rating Order</a>`
    }, as recorded on <a href="/history/#decisions">the history page</a>. Checked against the sources on ${data.checked}.</p>`;
  glance.innerHTML =
    `<p>${escapeHtml(SERIES_LABELS[loaded.series])}, ${escapeHtml(record.tax_year)}, as published.</p>` +
    `<p class="headline">${percent(record.applied_tenths)} increase, decided by ${escapeHtml(MEASURE_NAMES[record.measure])}</p>` +
    `<dl><div><dt>Weekly rate after</dt> <dd>${money(to)}</dd></div><div><dt>Weekly increase</dt> <dd>${money(to - from)}</dd></div></dl>` +
    (quiet ? "" : updatedNote("The full result below has changed too."));
  if (!quiet) announce(status, `Showing the decision for ${record.tax_year}: ${percent(record.applied_tenths)}. The full result below has changed.`);
}

// typing: the redraw follows a keystroke, so an invalid figure may be half typed.
let hasResult = true;
function showOwn(typing) {
  const p = readPercent(prices, "the rise in prices");
  const e = readPercent(earnings, "the rise in earnings");
  const s = readAmount(start, "the starting weekly amount");
  if (p === null || e === null || s === null) {
    // The label is left alone while the last result stays: it still names what is shown.
    if (typing && hasResult) {
      markStale(result, glance);
      announce(status, STALE_MESSAGE);
      return;
    }
    hasResult = false;
    mode.textContent = "Hypothetical: your own figures";
    announce(status, "There is a problem with the figures entered. No result is shown.");
    result.innerHTML = `<h3>No result</h3><p>Correct the figures marked with an error.</p>`;
    glance.innerHTML = `<p>No result. Correct the figures marked with an error.</p>`;
    return;
  }
  hasResult = true;
  mode.textContent = "Hypothetical: your own figures";
  const out = mechanism(s, p, e);
  const names = out.determining.map((name) => MEASURE_LABELS[name]);
  const decided = out.determining.length > 1 ? `a tie between ${list(names)}` : names[0];
  result.innerHTML =
    `<h3>Hypothetical result</h3>` +
    `<p class="headline">${percent(out.tenths)} increase, decided by ${escapeHtml(decided)}</p>` +
    `<dl>` +
    row("Prices", percent(p)) +
    row("Earnings", percent(e)) +
    row("Minimum", "2.5%") +
    row("Weekly amount before", money(s)) +
    // Worked in whole numbers and shown to all five places, so it cannot show a half that then rounds down.
    row("Weekly amount after, before rounding", `£${((s * (1000 + out.tenths)) / 100000).toFixed(5).replace(/(\.\d\d\d*?)0+$/, "$1")}`) +
    row("Weekly amount after, rounded to the nearest 5p", money(out.pence)) +
    row("Weekly increase", money(out.increasePence)) +
    row("52 weeks at the new amount", money(out.annualPence)) +
    `</dl>` +
    `<p>This is an example using figures you entered. It is not a forecast and it is not your entitlement: for that, <a href="https://www.gov.uk/check-state-pension">check your State Pension forecast</a> on GOV.UK. It is before tax.</p>` +
    `<p class="source-line">Source: the figures you entered, calculated by this site, following the steps below.</p>`;
  glance.innerHTML =
    `<p><span class="status">Hypothetical</span> Your own figures, before tax.</p>` +
    `<p class="headline">${percent(out.tenths)} increase, decided by ${escapeHtml(decided)}</p>` +
    `<dl><div><dt>Weekly amount after</dt> <dd>${money(out.pence)}</dd></div><div><dt>Weekly increase</dt> <dd>${money(out.increasePence)}</dd></div></dl>` +
    updatedNote("The full result below has changed too.");
  announce(status, `Hypothetical result: ${percent(out.tenths)} increase, new weekly amount ${money(out.pence)}. The full result below has changed.`);
}

document.getElementById("mechanism-load").addEventListener("click", () => load());

// The result follows the figures: the published decision until one is changed, then a hypothetical
// result, until a decision is loaded again. There is no submit button; the handler stays for a scripted submit.
function update(typing) {
  const same =
    loaded &&
    prices.value === (loaded.record.prices_tenths / 10).toFixed(1) &&
    earnings.value === (loaded.record.earnings_tenths / 10).toFixed(1) &&
    start.value === (loaded.from / 100).toFixed(2);
  if (same) {
    showPast();
  } else {
    loaded = null;
    showOwn(typing);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});
// Only the figures redraw the result. Choosing a year or a pension waits for "Load this decision",
// because loading replaces the figures.
const figures = document.getElementById("mechanism-figures");
live(figures, () => update(true));

// The decision the page was built with is in the fields, so it is the one loaded at the start.
form.reset();
load(true);
pinSummary(glance.parentElement);
