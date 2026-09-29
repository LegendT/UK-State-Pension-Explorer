// Tool 3: what does the pension cover? Presentation only.
// Nothing entered here is stored, put in the address bar or sent anywhere.

import { renderBudget } from "../lib/budget-view.js";
import { announce, focusFirstError, readAmount, readJson, setError } from "./common.js";

const data = readJson("budget-data");
const form = document.getElementById("budget-form");
const result = document.getElementById("budget-result");
const status = document.getElementById("budget-status");
const period = document.getElementById("budget-period");
const preset = document.getElementById("budget-preset");
const about = document.getElementById("budget-preset-about");
const tax = document.getElementById("budget-tax");
const EMPTY = result.innerHTML;

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

function loadPreset() {
  const chosen = data.presets.find((item) => item.id === preset.value);
  if (!chosen) {
    about.innerHTML = "<p>Choose an example budget first.</p>";
    return;
  }
  period.value = "week";
  for (const category of data.categories) {
    const pence = chosen.pence[category.id] || 0;
    input(category.id).value = pence ? (pence / 100).toFixed(2) : "";
    setError(input(category.id), "");
  }
  presetLabel = chosen.label;
  about.innerHTML =
    `<p><strong>Loaded: ${chosen.label}.</strong> Amounts are weekly, so the period is now set to a week. Change any amount to match your own spending.</p>` +
    `<ul><li>A research budget: what research found a standard of living costs. It is not what people spend and not an entitlement.</li>` +
    `<li>Prices: ${chosen.price_date}. Area: ${chosen.geography}.</li>` +
    `<li>Housing: ${chosen.housing}</li>` +
    `<li>Left out: ${chosen.exclusions}</li>` +
    (chosen.note ? `<li>${chosen.note}</li>` : "") +
    `<li>Source: ${chosen.source}. ${chosen.table_reference}</li></ul>`;
  announce(status, `Example budget loaded into the spending fields: ${chosen.label}.`);
}

function fillPension() {
  period.value = "week";
  input("state-pension").value = data.full_new_rate;
  setError(input("state-pension"), "");
  announce(status, `State Pension set to the full new rate, ${data.full_new_rate} pounds a week. The period is set to a week.`);
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
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
    focusFirstError(form);
    result.innerHTML = `<h3>No result</h3><p>Correct the amounts marked with an error, then select Show my budget.</p>`;
    announce(status, "There is a problem with the amounts entered. No result is shown.");
    return;
  }
  result.innerHTML = renderBudget({ period: period.value, income, spending, taxPence, presetLabel });
  announce(status, "Result updated. It follows the form.");
});

document.getElementById("budget-clear").addEventListener("click", () => {
  form.reset();
  for (const field of form.querySelectorAll('input[type="text"]')) setError(field, "");
  presetLabel = "";
  showHousehold();
  result.innerHTML = EMPTY;
  announce(status, "Everything you entered has been cleared.");
});

for (const radio of form.querySelectorAll('input[name="budget-household"]')) radio.addEventListener("change", showHousehold);
document.getElementById("budget-load").addEventListener("click", loadPreset);
document.getElementById("budget-fill-pension").addEventListener("click", fillPension);

// A page restored from the browser's history can bring typed values back. Clear them.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) form.reset();
  showHousehold();
});
