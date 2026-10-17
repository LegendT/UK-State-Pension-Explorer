// Shared presentation helpers for the tools. Arithmetic lives in ../lib.

import { settingsLink } from "../lib/format.js";

import { CHART_WIDTH } from "../lib/chart.js";
import { parsePence, parseTenths, MIN_TENTHS, MAX_TENTHS, MIN_PENCE, MAX_PENCE } from "../lib/uprating.js";

// The tool's module has run: its form, summary and result show, and the no-script notice goes (W32).
// Called last, after the first result is drawn.
export function ready(form) {
  form.closest(".tool").classList.add("is-ready");
}

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
  // Only what changes is written. Every redraw checks every field, and rewriting unchanged values,
  // about 40 for one key in the budget explorer, cut VoiceOver off at "Result U…" in Safari
  // (step 4).
  const set = (name, value) => input.getAttribute(name) !== value && input.setAttribute(name, value);
  if (error.textContent !== (message || "")) error.textContent = message || "";
  set("aria-invalid", message ? "true" : "false");
  // A group's hint, read with its first field only, stays joined to it (step 4).
  const ids = [input.dataset.groupHint, hint && hint.id, message && error.id].filter(Boolean).join(" ");
  if (ids) set("aria-describedby", ids);
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
// A message waits while the reader is still in the text field they last typed in, and is said when
// they leave it, press Enter or press a button. VoiceOver with Safari cut a result's message short
// while the reader was still in the field it came from, and read the field again over it (step 4,
// decision 105; WebKit bugs 222190 and 257953). The result on screen still follows the typing.
// Menus, buttons and a submit are said at once.
// A touch screen says it at once too: VoiceOver on the iPhone moves on by swiping, which leaves focus
// in the field, so a held message was never said, and Done took VoiceOver to the field's label over
// it (step 4, decision 106).
const touch = window.matchMedia("(hover: none) and (pointer: coarse)");
let typing = null;
let held = null;
export function announce(region, message) {
  if (typing && document.activeElement === typing && !touch.matches) held = { region, message };
  else say(region, message);
}

// A later message replaces one not yet written, so an earlier one cannot overwrite it.
function say(region, message) {
  clearTimeout(region.pending);
  region.textContent = "";
  region.pending = window.setTimeout(() => {
    region.textContent = message;
  }, 100);
}

// Stops holding, and says what is held. Run after the page's own handler: a button's or a submit's
// message is held first if the cursor is still in a field (Safari does not focus a clicked button).
function release() {
  typing = null;
  if (!held) return;
  const { region, message } = held;
  held = null;
  say(region, message);
}
document.addEventListener("input", (event) => {
  if (event.target.matches('input[type="text"]')) typing = event.target;
});
document.addEventListener("focusout", (event) => {
  if (event.target === typing) release();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target === typing) setTimeout(release);
});
document.addEventListener("click", (event) => {
  if (event.target.closest("button")) setTimeout(release);
});
document.addEventListener("submit", () => setTimeout(release));

// The tool's "At a glance" as sentences, for the message that announces a result: a screen reader
// hears what the summary shows, which is not otherwise read (step 4). The note that the result
// was updated is left out; the message says so itself. A term and its values read as "term: value".
export function glanceText(glance) {
  return [...glance.querySelectorAll("p:not(.tool-updated):not(.tool-stale), dl > div")]
    .map((part) => {
      if (part.matches("dl > div")) return `${part.querySelector("dt").textContent}: ${[...part.querySelectorAll("dd")].map((dd) => dd.textContent).join(", ")}`;
      const label = part.querySelector(".status");
      return label ? `${label.textContent}: ${[...part.childNodes].filter((node) => node !== label).map((node) => node.textContent).join("").trim()}` : part.textContent.trim();
    })
    .map((text) => (/[.!?]$/.test(text) ? text : `${text}.`))
    .join(" ");
}

// After a failed submit, move focus to the first field in error.
export function focusFirstError(form) {
  const first = form.querySelector('[aria-invalid="true"]');
  if (first) first.focus();
}

// A result's settings go in the page address, so that a copied link shows the same result.
// Never used by the budget explorer, whose figures stay on the device.
// The history explorer alone writes its settings as a result shows (decision 96 took the other two
// tools off this: they copy a link instead).
export function writeSettings(settings, hash) {
  window.history.replaceState(null, "", settingsLink(window.location.href, settings, hash));
}

// Copies a link to the result shown. The address is not written on its own (decision 96): only when
// the clipboard refuses is the link put in the address bar, and the reader is told to copy it there.
// The outcome is announced through the status region and shown in the note beside the button.
export async function copyLink(settings, hash, status, note) {
  const link = settingsLink(window.location.href, settings, hash);
  let message;
  try {
    await navigator.clipboard.writeText(link);
    message = "A link to this result has been copied.";
  } catch {
    window.history.replaceState(null, "", link);
    message = "The link could not be copied. The page address now holds this result: copy it from the address bar.";
  }
  announce(status, message);
  note.textContent = message;
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
  // One string, so that two reads with the same values compare equal: as arrays they never did, and the
  // change event a field fires on losing focus redrew and announced a result already shown (W12).
  const values = () => JSON.stringify([...form.querySelectorAll("input, select")].map((field) => (field.type === "checkbox" || field.type === "radio" ? field.checked : field.value)));
  const later = () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      const now = values();
      if (now === last) return;
      last = now;
      redraw();
    }, 400);
  };
  // A button (load, fill, reset, clear) changes fields without this function, so the last values no
  // longer match what is drawn: forget them, and the next change always redraws. Only when the click
  // changed a field, read before the button's own handler runs and again after: forgetting after a
  // button that changes nothing (copy a link, copy the table) made the change event of a field just
  // typed in redraw and announce the result again, over the button's own announcement (W12).
  const forget = () => {
    last = null;
  };
  document.addEventListener(
    "click",
    (event) => {
      if (!event.target.closest("button")) return;
      const before = values();
      setTimeout(() => {
        if (values() !== before) forget();
      }, 0);
    },
    true,
  );
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

// A tool's chart is drawn at the width of its result, up to the width the build draws at, so its
// text keeps the size the stylesheet sets on a phone (W20). The build's width while the result is hidden.
export function chartWidth(result) {
  const style = getComputedStyle(result);
  const width = Math.floor(result.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
  return width > 0 ? Math.min(width, CHART_WIDTH) : CHART_WIDTH;
}

// Draws the chart again when the result's width changes, starting with the one the build drew.
// html() returns the result on screen at chartWidth(result), or nothing when there is no result.
// Only the chart is replaced, so focus elsewhere in the result stays where it is.
export function fitChart(result, html) {
  new ResizeObserver(() => {
    const old = result.querySelector("figure.chart");
    if (!old || old.querySelector("svg").viewBox.baseVal.width === chartWidth(result)) return;
    const fresh = document.createRange().createContextualFragment(html() || "").querySelector("figure.chart");
    if (!fresh) return;
    const focused = old.contains(document.activeElement);
    old.replaceWith(fresh);
    if (focused) fresh.querySelector(".scroll-x").focus();
  }).observe(result);
}

// The link before a chart to its table moves focus onto the table. Safari scrolled to it without
// moving focus, so VoiceOver announced nothing on arrival (step 4). Nothing is written to the
// address (decision 96). Without this script the link still works as an ordinary link.
document.addEventListener("click", (event) => {
  const link = event.target.closest(".chart-summary a[href^='#']");
  const table = link && document.getElementById(link.hash.slice(1));
  if (!table) return;
  event.preventDefault();
  table.focus();
});
