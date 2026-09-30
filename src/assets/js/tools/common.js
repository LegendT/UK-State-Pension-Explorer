// Shared presentation helpers for the tools. Arithmetic lives in ../lib.

import { parsePence, parseTenths, MIN_TENTHS, MAX_TENTHS, MIN_PENCE, MAX_PENCE } from "../lib/uprating.js";

export function readJson(id) {
  return JSON.parse(document.getElementById(id).textContent);
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

// Shows or clears the error for one input. The error text is linked to the input while it shows.
export function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  const hint = document.getElementById(`${input.id}-hint`);
  error.textContent = message || "";
  input.setAttribute("aria-invalid", message ? "true" : "false");
  const ids = [hint && hint.id, message && error.id].filter(Boolean).join(" ");
  if (ids) input.setAttribute("aria-describedby", ids);
  else input.removeAttribute("aria-describedby");
  return !message;
}

export function readPercent(input, name) {
  const tenths = parseTenths(input.value);
  if (tenths === null) {
    setError(input, `Enter ${name} as a number with no more than 1 decimal place, for example 3.5`);
    return null;
  }
  if (tenths < MIN_TENTHS || tenths > MAX_TENTHS) {
    setError(input, `Enter ${name} between -10 and 25`);
    return null;
  }
  setError(input, "");
  return tenths;
}

export function readAmount(input, name, { min = MIN_PENCE, max = MAX_PENCE, optional = false } = {}) {
  if (optional && input.value.trim() === "") {
    setError(input, "");
    return 0;
  }
  const pence = parsePence(input.value);
  if (pence === null) {
    setError(input, `Enter ${name} in pounds and pence, for example 241.30`);
    return null;
  }
  if (pence < min || pence > max) {
    setError(input, `Enter ${name} between £${(min / 100).toLocaleString("en-GB")} and £${(max / 100).toLocaleString("en-GB")}`);
    return null;
  }
  setError(input, "");
  return pence;
}

// One polite message for screen readers after a result changes.
export function announce(region, message) {
  region.textContent = "";
  window.setTimeout(() => {
    region.textContent = message;
  }, 100);
}

// After a failed submit, move focus to the first field in error.
export function focusFirstError(form) {
  const first = form.querySelector('[aria-invalid="true"]');
  if (first) first.focus();
}

// A result's settings go in the page address, so that a copied link shows the same result.
// Never used by the budget explorer, whose figures stay on the device.
export function writeSettings(settings, hash) {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams(settings).toString();
  url.hash = hash;
  window.history.replaceState(null, "", url);
}

export function readSettings() {
  return new URLSearchParams(window.location.search);
}

// The address can hold anything, so a value is used only if the list offers it.
export function choose(select, value) {
  if (value !== null && [...select.options].some((option) => option.value === value)) select.value = value;
}
