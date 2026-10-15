// A scroll cue (W20). A table or chart wider than its region gets the class "can-scroll", and the
// stylesheet then shows "Scroll sideways for more" at the region's left edge. Regions a tool draws
// later are watched as they appear. Without this script a wide region still scrolls, with no cue.

const sizes = new ResizeObserver((entries) => {
  for (const { target } of entries) target.classList.toggle("can-scroll", target.scrollWidth > target.clientWidth + 1);
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
