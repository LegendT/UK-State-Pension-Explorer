// Tool 2: compare the replacement rules. Presentation only.

import { renderComparison, renderSummary } from "../lib/compare-view.js";
import { announce, chartWidth, choose, fitChart, escapeHtml, focusFirstError, glanceText, live, markStale, pinSummary, STALE_MESSAGE, updatedNote, readAmount, readJson, readPercent, readSettings, ready, setError, copyLink, noteFollows } from "./common.js";

const data = readJson("compare-data");
const form = document.getElementById("compare-form");
const result = document.getElementById("compare-result");
const summary = document.getElementById("compare-summary");
const status = document.getElementById("compare-status");
const scenario = document.getElementById("compare-scenario");
const reason = document.getElementById("compare-reason");
const years = document.getElementById("compare-years");
const start = document.getElementById("compare-start");
const first = document.getElementById("compare-first");
const floor = document.getElementById("compare-floor");
const measure = document.getElementById("compare-measure");
const rows = document.getElementById("compare-rows");

let edited = false;

function chosen() {
  return data.scenarios.find((item) => item.id === scenario.value);
}

function readYears() {
  const count = Number(years.value);
  if (!/^\d{1,2}$/.test(years.value.trim()) || count < 1 || count > 30) {
    setError(years, "Enter a number of years from 1 to 30");
    return null;
  }
  setError(years, "");
  return count;
}

// One row of two inputs for each year. Existing edits are kept when the number of years changes.
function drawRows(count, source) {
  const firstYear = Number(first.value);
  // Text already typed is kept, valid or not, so a redraw never throws away an edit.
  const typed = edited ? [...rows.querySelectorAll("tr")].map((row) => Object.fromEntries([...row.querySelectorAll("input")].map((input) => [input.dataset.key, input.value]))) : [];
  const html = [];
  for (let i = 0; i < count; i += 1) {
    const label = `${firstYear + i}/${String((firstYear + i + 1) % 100).padStart(2, "0")}`;
    const year = source[i] || source[source.length - 1];
    html.push(
      `<tr><th scope="row">${label}</th>` +
        ["prices", "earnings"]
          .map((key) => {
            const id = `compare-${key}-${i}`;
            const name = `the rise in ${key} for ${label}`;
            return (
              `<td><label class="visually-hidden" for="${id}">Rise in ${key}, ${label}, per cent</label>` +
              `<input type="text" inputmode="decimal" id="${id}" data-key="${key}" data-name="${name}" value="${typed[i] ? escapeHtml(typed[i][key]) : (year[key] / 10).toFixed(1)}" autocomplete="off">` +
              `<span class="error" id="${id}-error" role="alert"></span></td>`
            );
          })
          .join("") +
        `</tr>`,
    );
  }
  rows.innerHTML = html.join("");
}

function currentPath() {
  const path = [];
  let ok = true;
  for (const row of rows.querySelectorAll("tr")) {
    const entry = {};
    for (const input of row.querySelectorAll("input")) {
      const tenths = readPercent(input, input.dataset.name);
      if (tenths === null) ok = false;
      entry[input.dataset.key] = tenths;
    }
    path.push(entry);
  }
  return ok ? path : null;
}

function showReason() {
  reason.textContent = edited
    ? "Your own figures. They started from the scenario chosen and you have changed them."
    : chosen().reason;
}

// mode: "load" shows the result without announcing it or moving focus. "live" announces it but
// leaves focus where the reader is typing. Otherwise an error also takes focus to the first field.
// The page is built with a result, so one is showing from the start.
let hasResult = true;
// The settings of the result on screen, for drawing its chart again at a new width.
let shown;
// The settings of the result on screen, as a link carries them. Kept when a result is drawn, so the
// copy button links to what is shown, not to a figure half typed since. Edited yearly figures are in
// it too, or a link would show a different result. Nothing is written to the address on its own
// (decision 96).
let linkSettings;
function linkSettingsFor(count, path) {
  const figures = (key) => path.map((year) => (year[key] / 10).toFixed(1)).join(",");
  return { scenario: scenario.value, years: String(count), start: start.value.trim(), first: first.value, measure: measure.value, floor: floor.checked ? "on" : "off", ...(edited ? { prices: figures("prices"), earnings: figures("earnings") } : {}) };
}
// Only the first letter, so a name such as the Institute for Fiscal Studies keeps its capitals.
const scenarioLabel = () => (edited ? "your own figures" : chosen().label.charAt(0).toLowerCase() + chosen().label.slice(1));
// The line under the chart names the source of each part the reader has not changed.
const sourceLine = (startPence) =>
  `${startPence === Math.round(Number(data.default_start) * 100) ? data.sources.start : data.sources.own_start} ${edited ? data.sources.own_figures : document.getElementById(`compare-source-${scenario.value}`).innerHTML}`;
function update(message, mode) {
  const count = readYears();
  const startPence = readAmount(start, "the starting weekly amount");
  const path = count === null ? null : currentPath();
  if (count === null || startPence === null || path === null) {
    if (count !== null && path === null) document.getElementById("compare-edit").open = true;
    if (!mode) focusFirstError(form);
    if (mode === "live" && hasResult) {
      markStale(result, summary);
      announce(status, STALE_MESSAGE);
      return;
    }
    hasResult = false;
    result.innerHTML = `<div class="unavailable" role="note"><h3 id="compare-result-heading">Not available: a result</h3><p>Correct the figures marked with an error.</p></div>`;
    summary.innerHTML = `<p>No result. Correct the figures marked with an error.</p>`;
    if (mode !== "load") announce(status, "There is a problem with the figures entered. No result is shown.");
    return;
  }
  hasResult = true;
  const options = { startPence, path, cashFloor: floor.checked, firstYear: Number(first.value), measure: measure.value };
  shown = { ...options, scenarioLabel: scenarioLabel(), sourceLine: sourceLine(startPence) };
  result.innerHTML = renderComparison({ ...shown, chartWidth: chartWidth(result) });
  summary.innerHTML = renderSummary(options) + (mode === "load" ? "" : updatedNote("The chart and tables below have changed too."));
  linkSettings = linkSettingsFor(count, path);
  if (mode !== "load") announce(status, `${message || "Result updated."} ${glanceText(summary)} The chart and tables below have changed.`);
}

function reset() {
  edited = false;
  const count = readYears() || data.default_years;
  years.value = String(count);
  drawRows(count, chosen().path);
  showReason();
}

scenario.addEventListener("change", reset);
first.addEventListener("change", () => drawRows(readYears() || data.default_years, chosen().path));
// On input as well as change, so the rows match the number typed before the result follows it.
const redraw = () => {
  const count = readYears();
  if (count !== null && count !== rows.querySelectorAll("tr").length) drawRows(count, chosen().path);
};
years.addEventListener("input", redraw);
years.addEventListener("change", redraw);
rows.addEventListener("input", () => {
  edited = true;
  showReason();
});

document.getElementById("compare-copy-link").addEventListener("click", () => {
  if (!hasResult) {
    announce(status, "There is no result to link to. Correct the figures marked with an error.");
    return;
  }
  copyLink(linkSettings, "compare", status, document.getElementById("compare-copy-note"));
});
noteFollows(form, document.getElementById("compare-copy-note"));

document.getElementById("compare-reset").addEventListener("click", () => {
  scenario.value = data.default;
  years.value = String(data.default_years);
  start.value = data.default_start;
  first.value = String(data.default_first);
  floor.checked = true;
  measure.value = "cash";
  setError(start, "");
  reset();
  update("All settings are back to the starting scenario.");
});

// There is no submit button, so Enter does not submit. The handler stays for a scripted submit,
// which the accessibility checks use to show a result.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

live(form, () => update(undefined, "live"));

reset();
pinSummary(summary.parentElement);
// The page is built with the starting scenario's result, from the settings the form now holds.
shown = { startPence: readAmount(start, "the starting weekly amount"), path: currentPath(), cashFloor: floor.checked, firstYear: Number(first.value), measure: measure.value, scenarioLabel: scenarioLabel() };
shown.sourceLine = sourceLine(shown.startPence);
linkSettings = linkSettingsFor(Number(years.value), shown.path);
fitChart(result, () => hasResult && renderComparison({ ...shown, chartWidth: chartWidth(result) }));

// A link with settings in its address shows that result. Nothing is announced or focused on arrival.
// Typed values are checked by the same rules as the form before anything is shown.
const settings = readSettings();
if (settings.has("scenario")) {
  choose(scenario, settings.get("scenario"));
  choose(first, settings.get("first"));
  choose(measure, settings.get("measure"));
  if (settings.has("years")) years.value = settings.get("years");
  if (settings.has("start")) start.value = settings.get("start");
  floor.checked = settings.get("floor") !== "off";
  reset();
  const prices = (settings.get("prices") || "").split(",");
  const earnings = (settings.get("earnings") || "").split(",");
  const inputs = [...rows.querySelectorAll("tr")].map((row) => row.querySelectorAll("input"));
  if (settings.has("prices") && prices.length === inputs.length && earnings.length === inputs.length) {
    inputs.forEach(([p, e], i) => {
      p.value = prices[i];
      e.value = earnings[i];
    });
    edited = true;
    showReason();
  }
  update(undefined, "load");
}
ready(form);
