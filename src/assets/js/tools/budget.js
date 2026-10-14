// Tool 3: what does the pension cover? Presentation only.
// Nothing entered here is stored, put in the address bar or sent anywhere.

import { PERIOD_LABELS, convert, fromWeekly } from "../lib/budget.js";
import { renderBudget, renderBudgetSummary } from "../lib/budget-view.js";
import { money } from "../lib/format.js";
import { parsePence } from "../lib/uprating.js";
import { announce, focusFirstError, live, markStale, pinSummary, readAmount, readJson, ready, setError, STALE_MESSAGE, updatedNote } from "./common.js";

const data = readJson("budget-data");
const form = document.getElementById("budget-form");
const result = document.getElementById("budget-result");
const status = document.getElementById("budget-status");
const period = document.getElementById("budget-period");
const preset = document.getElementById("budget-preset");
const about = document.getElementById("budget-preset-about");
const tax = document.getElementById("budget-tax");
const glance = document.getElementById("budget-glance");
const periodNote = document.getElementById("budget-period-note");
const EMPTY = result.innerHTML;
const GLANCE_EMPTY = glance.innerHTML;
let lastResult = "";
let stale = false;

let presetLabel = "";
// The period the amounts in the fields are for, so a change of period knows what to convert from.
let enteredPeriod = period.value;

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

// The helpers hold weekly amounts. They are converted to the period the reader chose, which stays as it is.
// The note after loading names the period at the time; a later change of period converts the fields again.
const asPeriod = (weeklyPence) => (fromWeekly(weeklyPence, period.value) / 100).toFixed(2);
const convertedNote = () =>
  period.value === "week" ? "" : ` Weekly amounts were converted to amounts for ${PERIOD_LABELS[period.value]}, to the nearest penny.`;

function loadPreset() {
  const chosen = data.presets.find((item) => item.id === preset.value);
  if (!chosen) {
    about.innerHTML = "<p>Choose an example budget first.</p>";
    return;
  }
  const note = convertedNote();
  for (const category of data.categories) {
    const pence = chosen.pence[category.id] || 0;
    input(category.id).value = pence ? asPeriod(pence) : "";
    setError(input(category.id), "");
  }
  presetLabel = chosen.label;
  about.innerHTML =
    `<p><strong>Loaded: ${chosen.label}.</strong><span id="budget-preset-period">${note}</span> The weekly amounts as published are under <a href="#example-budgets">The example budgets</a>. Change any amount to match your own spending.</p>` +
    `<p>A research budget: what research found a standard of living costs. It is not what people spend and not an entitlement.</p>` +
    (chosen.note ? `<p>${chosen.note}</p>` : "") +
    `<dl><div><dt>Prices</dt> <dd>${chosen.price_date}</dd></div>` +
    `<div><dt>Area</dt> <dd>${chosen.geography}</dd></div>` +
    `<div><dt>Housing</dt> <dd>${chosen.housing}</dd></div>` +
    `<div><dt>Left out</dt> <dd>${chosen.exclusions}</dd></div>` +
    `<div><dt>Source</dt> <dd>${chosen.source}. ${chosen.table_reference}</dd></div></dl>`;
  // Read before update sets it: the breakdown has "changed" only when one was already showing.
  const shown = lastResult;
  update("quiet");
  announce(status, `Example budget loaded into the spending fields: ${chosen.label}.${note}${shown && lastResult !== shown ? " The breakdown below has changed." : ""}`);
}

function fillPension() {
  const pence = fromWeekly(parsePence(data.full_new_rate), period.value);
  const note = period.value === "week" ? "" : ` Entered as ${money(pence)} for ${PERIOD_LABELS[period.value]}, to the nearest penny.`;
  input("state-pension").value = (pence / 100).toFixed(2);
  setError(input("state-pension"), "");
  const shown = lastResult;
  update("quiet");
  announce(status, `State Pension set to the full new rate, ${data.full_new_rate} pounds a week.${note}${shown && lastResult !== shown ? " The breakdown below has changed." : ""}`);
}

// A change of period converts every amount already entered, so £241.30 a week becomes £1,045.63 a
// calendar month, not £241.30 a month: decision 90. An amount that cannot be read is left as typed.
// A select fires input and then change. Both stop here, so the form's own redraw, 400 ms later, cannot
// talk over the news of the conversion; this function redraws and announces once instead.
function convertAmounts() {
  const from = enteredPeriod;
  enteredPeriod = period.value;
  let count = 0;
  let unread = 0;
  for (const field of form.querySelectorAll('input[type="text"]')) {
    if (field.value.trim() === "") continue;
    const pence = parsePence(field.value);
    if (pence === null) {
      unread += 1;
      continue;
    }
    field.value = (convert(pence, from, enteredPeriod) / 100).toFixed(2);
    count += 1;
  }
  // An amount that could not be read stays as typed, and is read as an amount for the new period.
  const left = unread === 1 ? " One amount could not be read and is now read as an amount for the new period." : unread ? ` ${unread} amounts could not be read and are now read as amounts for the new period.` : "";
  if (!count) {
    // Nothing converted, so a note from an earlier conversion would name the wrong period.
    periodNote.textContent = "";
    periodNote.hidden = true;
    if (!unread) {
      update("live");
      return;
    }
    update("converted");
    announce(status, `Period changed to ${PERIOD_LABELS[enteredPeriod]}.${left}${stale ? ` ${STALE_MESSAGE}` : ""}`);
    return;
  }
  const done = `Amounts converted from ${PERIOD_LABELS[from]} to ${PERIOD_LABELS[enteredPeriod]}, to the nearest penny.`;
  periodNote.textContent = done;
  periodNote.hidden = false;
  const presetPeriod = document.getElementById("budget-preset-period");
  if (presetPeriod) presetPeriod.textContent = ` The amounts were then converted to amounts for ${PERIOD_LABELS[enteredPeriod]}.`;
  const shown = lastResult;
  // As typing does: with an amount in error, the last result stays, marked out of date (decision 85).
  update("converted");
  const after = stale ? ` ${STALE_MESSAGE}` : shown && lastResult !== shown ? " The breakdown below has changed." : "";
  announce(status, `${done}${left}${after}`);
}
period.addEventListener("input", (event) => event.stopPropagation());
period.addEventListener("change", (event) => {
  event.stopPropagation();
  convertAmounts();
});

function rows(list) {
  let ok = true;
  const out = [];
  for (const item of list) {
    const field = input(item.id);
    if (field.closest("[hidden]")) continue;
    const pence = readAmount(field, `an amount for ${item.label}`, { min: 0, max: 100000000, optional: true });
    if (pence === null) ok = false;
    out.push({ id: item.id, label: item.label, pence: pence || 0 });
  }
  return ok ? out : null;
}

// The result follows the form. Until an amount is entered there is nothing to show.
// mode: "quiet" redraws without announcing, for a helper that announces what it did.
// "converted" is "live" without announcing, for a change of period, which announces what it did.
function update(mode) {
  const silent = mode === "quiet" || mode === "converted";
  const fields = [...form.querySelectorAll('input[type="text"]')].filter((field) => !field.closest("[hidden]"));
  if (fields.every((field) => field.value.trim() === "")) {
    // An emptied field may still carry the error of what was typed in it.
    for (const field of fields) setError(field, "");
    stale = false;
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
    if ((mode === "live" || mode === "converted") && lastResult) {
      stale = true;
      markStale(result, glance);
      if (!silent) announce(status, STALE_MESSAGE);
      return;
    }
    stale = false;
    lastResult = "";
    result.innerHTML = `<h3 id="budget-result-heading">No result</h3><p>Correct the amounts marked with an error.</p>`;
    glance.innerHTML = `<p>No result. Correct the amounts marked with an error.</p>`;
    // A submit, not a keystroke: take the reader to the first field in error, as the comparison does.
    if (!mode) focusFirstError(form);
    if (!silent) announce(status, "There is a problem with the amounts entered. No result is shown.");
    return;
  }
  const figures = { period: period.value, income, spending, taxPence, presetLabel };
  const html = renderBudget(figures);
  // Choosing an example or a household fires a change without changing any amount. Say nothing then.
  // While the result is marked out of date, the same figures typed again must still redraw it.
  if (html === lastResult && !stale) return;
  stale = false;
  lastResult = html;
  result.innerHTML = html;
  glance.innerHTML = renderBudgetSummary(figures) + updatedNote("The full breakdown below has changed too.");
  if (!silent) announce(status, "Result updated. The breakdown below has changed.");
}

// There is no submit button; the handler stays for a scripted submit.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
});
live(form, () => update("live"));
pinSummary(glance.parentElement);

function clearAll() {
  form.reset();
  for (const field of form.querySelectorAll('input[type="text"]')) setError(field, "");
  presetLabel = "";
  enteredPeriod = period.value;
  periodNote.textContent = "";
  periodNote.hidden = true;
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
ready(form);
