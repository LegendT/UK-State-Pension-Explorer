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

// A tool's result follows its form. A change redraws it after a short pause, so typing a figure is
// not announced at every key.
// Typing a figure and then leaving the field fires "input" and then "change" with nothing new, so
// a redraw happens only when a value differs from the last redraw's.
export function live(form, redraw) {
  let pending;
  let last = null;
  const values = () => [...form.querySelectorAll("input, select")].map((field) => (field.type === "checkbox" || field.type === "radio" ? field.checked : field.value)).join("|");
  const later = () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      const now = values();
      if (now === last) return;
      last = now;
      redraw();
    }, 400);
  };
  // A button (load, fill, reset, clear) or a form reset changes fields without this function, so
  // the last values no longer match what is drawn. Forget them, and the next change always redraws.
  const forget = () => {
    last = null;
  };
  document.addEventListener("click", (event) => {
    if (event.target.closest("button")) forget();
  });
  form.closest("form")?.addEventListener("reset", forget);
  form.addEventListener("input", later);
  form.addEventListener("change", later);
}

// The pinned summary's height changes with its contents, the width and the reader's text settings,
// so the page padding that keeps it from covering anything is its measured height, not a guess.
// A pinned summary that would take more than half the screen is not pinned: it follows the form
// (decision 79). It pins again only below two fifths, so a phone's address bar showing and hiding
// cannot flip it back and forth. In the page it is narrower than pinned, so taller, which also keeps
// it unpinned. At 1024 px and wider it sits beside the form, and the class is never set.
const wide = window.matchMedia("(min-width: 64rem)");
export function pinSummary(summary) {
  const fit = () => {
    const size = Math.ceil(summary.getBoundingClientRect().height);
    const share = size / window.innerHeight;
    const unpinned = summary.classList.contains("unpinned");
    if (unpinned && (wide.matches || share < 0.4)) summary.classList.remove("unpinned");
    else if (!unpinned && !wide.matches && share > 0.5) summary.classList.add("unpinned");
    document.documentElement.style.setProperty("--summary-size", `${size}px`);
  };
  new ResizeObserver(fit).observe(summary);
  window.addEventListener("resize", fit);
}

// A half-typed figure, such as "-", is not a reason to take away the result the reader is looking
// at. On a redraw that follows typing, the last result stays, marked as out of date, and the field
// shows its error. The next valid redraw replaces the region, which removes the mark.
export function markStale(...regions) {
  for (const region of regions) {
    region.querySelector(".tool-updated")?.remove();
    if (region.querySelector(".tool-stale")) continue;
    const note = document.createElement("p");
    note.className = "tool-stale";
    const label = document.createElement("span");
    label.className = "status";
    label.textContent = "Out of date";
    note.append(label, " A figure has an error. This is the last result, from before the change.");
    region.prepend(note);
  }
}
export const STALE_MESSAGE = "There is a problem with the figures entered. The result shown is out of date.";

// The summary stays in view, but the full result is below the form and easy to miss. After a
// change, the summary says the result below changed too. Text only: the pinned summary holds
// nothing that takes focus. Not shown on arrival, when nothing has changed.
export function updatedNote(sentence) {
  return `<p class="tool-updated"><span class="status">Updated</span> ${sentence}</p>`;
}
