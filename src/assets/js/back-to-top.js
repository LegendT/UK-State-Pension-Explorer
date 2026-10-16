// One "Back to top" link on a long page, after Nielsen Norman Group's guidelines: decision 88.
// Without this script the link sits at the end of the page. With it, on a page longer than four
// screens, the link is fixed in the lower right. It appears when the reader scrolls up, stays where
// it is until the reader is near the top, and hides while the focused element would sit under it.
// The stylesheet hides it at desktop width on a page whose contents list stays in view.

const box = document.querySelector(".back-to-top");
const html = document.documentElement;
let last = scrollY;
let shown = false;

const long = () => html.scrollHeight > 4 * innerHeight;

function underFocus() {
  const el = document.activeElement;
  if (!el || el === document.body || box.contains(el)) return false;
  const a = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

// The class is written only when it changes (step 4: it was rewritten on every focus move). A link
// under focus is hidden with visibility, so it keeps the size it is measured by.
function check() {
  box.classList.toggle("is-under", shown && underFocus());
}

function show(on) {
  if (on === shown) return;
  shown = on;
  box.classList.toggle("is-shown", on);
  check();
}

function onScroll() {
  const y = scrollY;
  if (y < innerHeight / 2) show(false);
  else if (y < last && long()) show(true);
  last = y;
}

box.classList.add("is-fixed");
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", () => { if (!long()) show(false); });
// After the browser has scrolled the newly focused element into view.
addEventListener("focusin", () => requestAnimationFrame(check));
addEventListener("focusout", () => requestAnimationFrame(check));
