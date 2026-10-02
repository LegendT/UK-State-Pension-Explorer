// Tool 3: what does the pension cover? Presentation only.
// Nothing entered here is stored, put in the address bar or sent anywhere.

import { PERIODS, PERIOD_LABELS } from "../lib/budget.js";
import { renderBudget, renderBudgetSummary } from "../lib/budget-view.js";
import { parsePence } from "../lib/uprating.js";
import { announce, live, pinSummary, readAmount, readJson, setError } from "./common.js";

const data = readJson("budget-data");
const form = document.getElementById("budget-form");
const result = document.getElementById("budget-result");
const status = document.getElementById("budget-status");
const period = document.getElementById("budget-period");
const preset = document.getElementById("budget-preset");
const about = document.getElementById("budget-preset-about");
const tax = document.getElementById("budget-tax");
const glance = document.getElementById("budget-glance");
const EMPTY = result.innerHTML;
const GLANCE_EMPTY = glance.innerHTML;
let lastResult = "";

let presetLabel = "";

const household = () => form.querySelector('input[name="budget-household"]:checked').value;
const input = (id) => document.getElementById(`budget-${id}`);

function showHousehold() {
  const couple = household() === "couple";
  for (const row of form.querySelectorAll("[data-couple-only]")) {
    row.hidden = !couple;
    if (!couple) row.querySelector("input").value = "";
  }
  for (const option of preset.options) {
    option.hidden = Boolean(option.dataset.household) && option.dataset.household !== household();
    option.disabled = option.hidden;
  }
  preset.value = "";
  about.innerHTML = "";
}

// The helpers fill in weekly amounts, so they set the period to a week. Amounts already entered
// for another period are converted first, so that none of them changes its meaning. Fields the
// helper is about to fill are left alone, so the note names only conversions that stay.
function toWeekly(filled = []) {
  const from = period.value;
  period.value = "week";
  if (from === "week") return "";
  let converted = false;
  for (const field of [...data.income, ...data.categories].filter((item) => !filled.includes(item.id)).map((item) => input(item.id)).concat(tax)) {
    const pence = parsePence(field.value);
    if (field.value.trim() === "" || pence === null) continue;
    field.value = (Math.round((pence * PERIODS[from]) / PERIODS.week) / 100).toFixed(2);
    converted = true;
  }
  return converted ? ` Amounts you had entered for ${PERIOD_LABELS[from]} were converted to a week.` : "";
}

function loadPreset() {
  const chosen = data.presets.find((item) => item.id === preset.value);
  if (!chosen) {
    about.innerHTML = "<p>Choose an example budget first.</p>";
    return;
  }
  const note = toWeekly(data.categories.map((category) => category.id));
  for (const category of data.categories) {
    const pence = chosen.pence[category.id] || 0;
    input(category.id).value = pence ? (pence / 100).toFixed(2) : "";
    setError(input(category.id), "");
  }
  presetLabel = chosen.label;
  about.innerHTML =
    `<p><strong>Loaded: ${chosen.label}.</strong> Amounts are weekly, so the period is now set to a week. Change any amount to match your own spending.</p>` +
    `<p>A research budget: what research found a standard of living costs. It is not what people spend and not an entitlement.</p>` +
    (chosen.note ? `<p>${chosen.note}</p>` : "") +
    `<dl><div><dt>Prices</dt> <dd>${chosen.price_date}</dd></div>` +
    `<div><dt>Area</dt> <dd>${chosen.geography}</dd></div>` +
    `<div><dt>Housing</dt> <dd>${chosen.housing}</dd></div>` +
    `<div><dt>Left out</dt> <dd>${chosen.exclusions}</dd></div>` +
    `<div><dt>Source</dt> <dd>${chosen.source}. ${chosen.table_reference}</dd></div></dl>`;
  update("quiet");
  announce(status, `Example budget loaded into the spending fields: ${chosen.label}.${note}`);
}

function fillPension() {
  const note = toWeekly(["state-pension"]);
  input("state-pension").value = data.full_new_rate;
  setError(input("state-pension"), "");
  update("quiet");
  announce(status, `State Pension set to the full new rate, ${data.full_new_rate} pounds a week. The period is set to a week.${note}`);
}

function rows(list) {
  let ok = true;
  const out = [];
  for (const item of list) {
    const field = input(item.id);
    if (field.closest("[hidden]")) continue;
    const pence = readAmount(field, `an amount for ${item.label.toLowerCase()}`, { min: 0, max: 100000000, optional: true });
    if (pence === null) ok = false;
    out.push({ id: item.id, label: item.label, pence: pence || 0 });
  }
  return ok ? out : null;
}

// The result follows the form. Until an amount is entered there is nothing to show.
// mode: "quiet" redraws without announcing, for a helper that announces what it did.
function update(mode) {
  const fields = [...form.querySelectorAll('input[type="text"]')].filter((field) => !field.closest("[hidden]"));
  if (fields.every((field) => field.value.trim() === "")) {
    lastResult = "";
    result.innerHTML = EMPTY;
    glance.innerHTML = GLANCE_EMPTY;
    return;
  }
  const income = rows(data.income);
  const spending = rows(data.categories);
  let taxPence = null;
  let taxOk = true;
  if (tax.value.trim() !== "") {
    taxPence = readAmount(tax, "the tax amount", { min: 0, max: 100000000 });
    taxOk = taxPence !== null;
  } else {
    setError(tax, "");
  }
  if (!income || !spending || !taxOk) {
    lastResult = "";
    result.innerHTML = `<h3>No result</h3><p>Correct the amounts marked with an error.</p>`;
    glance.innerHTML = `<p>No result. Correct the amounts marked with an error.</p>`;
    if (mode !== "quiet") announce(status, "There is a problem with the amounts entered. No result is shown.");
    return;
  }
  const figures = { period: period.value, income, spending, taxPence, presetLabel };
  const html = renderBudget(figures);
  // Choosing an example or a household fires a change without changing any amount. Say nothing then.
  if (html === lastResult) return;
  lastResult = html;
  result.innerHTML = html;
  glance.innerHTML = renderBudgetSummary(figures);
  if (mode !== "quiet") announce(status, "Result updated.");
}

// There is no submit button; the handler stays for a scripted submit.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});
live(form, update);
pinSummary(glance.parentElement);

function clearAll() {
  form.reset();
  for (const field of form.querySelectorAll('input[type="text"]')) setError(field, "");
  presetLabel = "";
  showHousehold();
  result.innerHTML = EMPTY;
  glance.innerHTML = GLANCE_EMPTY;
  lastResult = "";
}

document.getElementById("budget-clear").addEventListener("click", () => {
  clearAll();
  announce(status, "Everything you entered has been cleared.");
});

for (const radio of form.querySelectorAll('input[name="budget-household"]')) radio.addEventListener("change", showHousehold);
document.getElementById("budget-load").addEventListener("click", loadPreset);
document.getElementById("budget-fill-pension").addEventListener("click", fillPension);

// A page restored from the browser's history can bring back typed values and the result that shows
// them, so every showing of the page starts clear.
window.addEventListener("pageshow", () => {
  clearAll();
  status.textContent = "";
});
