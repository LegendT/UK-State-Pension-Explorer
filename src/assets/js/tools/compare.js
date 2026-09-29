// Tool 2: compare the replacement rules. Presentation only.

import { renderComparison } from "../lib/compare-view.js";
import { announce, focusFirstError, readAmount, readJson, readPercent, setError } from "./common.js";

const data = readJson("compare-data");
const form = document.getElementById("compare-form");
const result = document.getElementById("compare-result");
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
              `<input type="text" inputmode="decimal" id="${id}" data-key="${key}" data-name="${name}" value="${typed[i] ? typed[i][key].replace(/"/g, "") : (year[key] / 10).toFixed(1)}" autocomplete="off">` +
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

function update(message) {
  const count = readYears();
  const startPence = readAmount(start, "the starting weekly amount");
  const path = count === null ? null : currentPath();
  if (count === null || startPence === null || path === null) {
    if (path === null) document.getElementById("compare-edit").open = true;
    focusFirstError(form);
    result.innerHTML = `<h3>No result</h3><p>Correct the figures marked with an error, then select Show the result.</p>`;
    announce(status, "There is a problem with the figures entered. No result is shown.");
    return;
  }
  result.innerHTML = renderComparison({
    startPence,
    path,
    cashFloor: floor.checked,
    firstYear: Number(first.value),
    measure: measure.value,
    scenarioLabel: edited ? "your own figures" : chosen().label.toLowerCase(),
  });
  announce(status, message || "Result updated. It follows the form.");
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
years.addEventListener("change", () => {
  const count = readYears();
  if (count !== null) drawRows(count, chosen().path);
});
rows.addEventListener("input", () => {
  edited = true;
  showReason();
});

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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});

reset();
