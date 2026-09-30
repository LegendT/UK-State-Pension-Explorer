// Marks the contents link for the section being read. A section counts as current once its heading
// passes the top quarter of the window. A link that was just followed stays current while its
// heading is on screen and the reader has not scrolled back up, because the last sections on a
// page cannot scroll up to the top.

const nav = document.querySelector("main > .contents:not(.section-nav)");
const links = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
const targets = links.map((link) => document.getElementById(link.hash.slice(1)));
let followed = null;
let followedTop = Infinity;
let queued = false;

function onScreen(el) {
  const box = el.getBoundingClientRect();
  return box.top < innerHeight && box.bottom > 0;
}

function update() {
  queued = false;
  if (followed !== null) {
    const top = targets[followed].getBoundingClientRect().top;
    // A heading moving down the window means the reader has scrolled back up, away from it.
    if (!onScreen(targets[followed]) || top > followedTop + 1) followed = null;
    else followedTop = top;
  }
  let current = followed;
  if (current === null) {
    const line = innerHeight / 4;
    targets.forEach((target, i) => { if (target.getBoundingClientRect().top <= line) current = i; });
  }
  links.forEach((link, i) => {
    if (i === current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  // Keeps the current link visible when the sticky list is taller than the window.
  const link = links[current];
  if (link && nav.scrollHeight > nav.clientHeight) {
    const top = link.offsetTop; // the sticky list is the link's offsetParent
    if (top < nav.scrollTop || top + link.offsetHeight > nav.scrollTop + nav.clientHeight) nav.scrollTop = top - nav.clientHeight / 2;
  }
}

function queue() {
  if (!queued) { queued = true; requestAnimationFrame(update); }
}

if (targets.length && targets.every(Boolean)) {
  nav.addEventListener("click", (event) => {
    // A modified click opens the section elsewhere, so this page does not move.
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const i = links.indexOf(event.target.closest("a"));
    if (i >= 0) { followed = i; followedTop = Infinity; queue(); }
  });
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  const fromHash = links.findIndex((link) => link.hash === location.hash);
  if (fromHash >= 0) followed = fromHash;
  update();
}
