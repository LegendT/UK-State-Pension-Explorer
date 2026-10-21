// One "Back to top" link on a long page, after Nielsen Norman Group's guidelines: decision 88.
// Without this script the link sits at the end of the page. With it, on a page longer than four
// screens, the link is fixed in the lower right. It appears when the reader scrolls up, or when it
// has focus, stays where it is until the reader is near the top, and hides while the focused element
// would sit under it. Until then it is below the window, still in the tab order (decision 108).
// The stylesheet hides it at desktop width on a page whose contents list stays in view.
// It goes to the very top, the site header with the menu, and takes focus there, without writing a
// fragment to the address. One already there, from a link to a section or the skip link, is taken out,
// so a refresh, such as a pull down on an iPhone, does not scroll back past the menu (decision 131).
// The tools keep their settings in the query, which stays.

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

const header = document.getElementById("top");
box.querySelector("a").addEventListener("click", (event) => {
  event.preventDefault();
  scrollTo(0, 0);
  header.focus({ preventScroll: true });
  history.replaceState(history.state, "", location.pathname + location.search);
});

// A page of four screens or fewer has no link (decision 88).
box.classList.add("is-fixed");
box.hidden = !long();
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", () => {
  box.hidden = !long();
  if (!long()) show(false);
});
// After the browser has scrolled the newly focused element into view.
addEventListener("focusin", () => requestAnimationFrame(check));
addEventListener("focusout", () => requestAnimationFrame(check));
