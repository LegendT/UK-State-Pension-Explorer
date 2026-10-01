// Cards under "Where to go next". The link's ::after overlay makes the name and padding of each card
// follow the link at once. The description is raised above the overlay (see main.css), so it can be
// selected by dragging, double-clicking or triple-clicking. This script makes a click on the
// description follow the link too, after a short wait: a second click in that time is a double-click
// to select a word, so the link is not followed. Neither Heydon Pickering's cards pattern nor the
// other sources read on 1 October 2026 had a fix for double-click, because the first click of a
// double-click cannot be told from a single click until the second arrives. A double-click slower
// than the wait still follows the link.

const WAIT = 300; // ms
const list = document.querySelector(".journeys");
list.classList.add("cards-scripted");

for (const text of list.querySelectorAll("li > p")) {
  const link = text.parentElement.querySelector("a");
  let timer;
  text.addEventListener("mousedown", (event) => { if (event.detail > 1) clearTimeout(timer); });
  text.addEventListener("click", (event) => {
    clearTimeout(timer);
    // A double-click selects a word. A modified click does nothing here: to open the page in a new
    // tab, use the card's name, which is the link.
    if (event.detail > 1 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    timer = setTimeout(() => { if (getSelection().isCollapsed) link.click(); }, WAIT);
  });
}
