// Tool 4: pension history explorer. Presentation only.

import { historyCsv, renderHistory, renderHistorySummary } from "../lib/history-view.js";
import { observed } from "../lib/history.js";
import { announce, chartWidth, choose, fitChart, live, pinSummary, readJson, readSettings, updatedNote, writeSettings } from "./common.js";

const data = readJson("history-data");
const form = document.getElementById("history-form");
const result = document.getElementById("history-result");
const status = document.getElementById("history-status");
const series = document.getElementById("history-series");
const from = document.getElementById("history-from");
const to = document.getElementById("history-to");
const measure = document.getElementById("history-measure");
const rule = document.getElementById("history-rule");
const error = document.getElementById("history-error");
const glance = document.getElementById("history-glance");

let current = null;

function fillYears() {
  const years = observed(data.years, series.value).map((year) => year.tax_year);
  const options = years.map((year) => `<option value="${year}">${year}</option>`).join("");
  from.innerHTML = options;
  to.innerHTML = options;
  from.value = years[0];
  to.value = years[years.length - 1];
}

// quiet: "load" shows the result without announcing it; "live" announces it but leaves focus alone.
function update(quiet) {
  if (from.value >= to.value) {
    error.textContent = "Choose a last year that is later than the first year";
    from.setAttribute("aria-invalid", "true");
    // The result below is unchanged, so the summary keeps describing it.
    glance.innerHTML = renderHistorySummary(current) + `<p class="tool-updated">Not changed: choose a last year that is later than the first year.</p>`;
    if (quiet === "load") return;
    if (!quiet) from.focus();
    announce(status, "There is a problem with the years chosen. The result has not changed.");
    return;
  }
  error.textContent = "";
  from.setAttribute("aria-invalid", "false");
  current = { years: data.years, series: series.value, from: from.value, to: to.value, measure: measure.value, rule: rule.value, sources: data.sources };
  result.innerHTML = renderHistory({ ...current, chartWidth: chartWidth(result) });
  glance.innerHTML = renderHistorySummary(current) + (quiet === "load" ? "" : updatedNote("The chart and table below have changed too."));
  writeSettings({ series: current.series, from: current.from, to: current.to, measure: current.measure, ...(current.rule ? { rule: current.rule } : {}) }, "explorer");
  if (quiet !== "load") announce(status, "Result updated. The chart and table below have changed.");
}

series.addEventListener("change", fillYears);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

document.getElementById("history-download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([historyCsv(current)], { type: "text/csv" }));
  link.download = `state-pension-history-${current.series}-${current.measure}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  announce(status, "The table shown has been downloaded as a CSV file.");
});

document.getElementById("history-copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(historyCsv(current));
    announce(status, "The table shown has been copied.");
  } catch {
    announce(status, "The table could not be copied. Use the download button.");
  }
});

// A browser can restore earlier choices on reload. Start from the state of the table the build wrote.
form.reset();
fillYears();
current = { years: data.years, series: series.value, from: from.value, to: to.value, measure: measure.value, rule: rule.value, sources: data.sources };
glance.innerHTML = renderHistorySummary(current);
// A new pension refills the year lists first, then the result follows.
live(form, () => update("live"));
pinSummary(glance.parentElement);
fitChart(result, () => renderHistory({ ...current, chartWidth: chartWidth(result) }));

// A link with settings in its address shows that result. Nothing is announced on arrival.
const settings = readSettings();
if (settings.has("series")) {
  choose(series, settings.get("series"));
  fillYears();
  choose(from, settings.get("from"));
  choose(to, settings.get("to"));
  choose(measure, settings.get("measure"));
  choose(rule, settings.get("rule") || "");
  update("load");
}
