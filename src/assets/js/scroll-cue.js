// A scroll cue (W20). A table or chart wider than its region gets the class "can-scroll", and the
// stylesheet then shows "Scroll sideways for more" at the region's left edge. Regions a tool draws
// later are watched as they appear. Without this script a wide region still scrolls, with no cue.

// The cue changes the region's height, so the class is set in the next frame. Set inside the
// observer, it set the observer off again in the same frame, a loop the browser reported as an
// error on every redraw of the rule comparison (step 4). toggle with a second argument writes
// nothing when the class is already right.
const sizes = new ResizeObserver((entries) => {
  requestAnimationFrame(() => {
    for (const { target } of entries) {
      target.classList.toggle("can-scroll", target.scrollWidth > target.clientWidth + 1);
    }
  });
});
const seen = new Set();
const watch = () => {
  // A region a tool's redraw replaced is let go, so a long session does not keep every old result.
  for (const region of seen) {
    if (region.isConnected) continue;
    sizes.unobserve(region);
    seen.delete(region);
  }
  for (const region of document.querySelectorAll(".scroll-x")) {
    if (seen.has(region)) continue;
    seen.add(region);
    sizes.observe(region);
  }
};
watch();
new MutationObserver(watch).observe(document.querySelector("main"), { childList: true, subtree: true });
