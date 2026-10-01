// Makes each card under "Where to go next" follow its link when clicked anywhere, after Heydon
// Pickering's cards pattern in Inclusive Components. It replaces the link's ::after overlay, so the
// description can be selected: a press of 200 ms or more, a pointer that moves while pressed, or a
// click that leaves text selected is taken as selecting text and ignored. Without this script the
// overlay does the same job.

for (const card of document.querySelectorAll(".journeys li")) {
  const link = card.querySelector("a");
  let down = 0, x = 0, y = 0;
  card.addEventListener("mousedown", (event) => { down = Date.now(); x = event.clientX; y = event.clientY; });
  card.addEventListener("mouseup", (event) => {
    // The link handles its own clicks, and a modified click is the reader's to decide.
    if (event.target.closest("a") || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (Date.now() - down >= 200 || Math.hypot(event.clientX - x, event.clientY - y) > 4 || String(getSelection())) return;
    link.click();
  });
}
