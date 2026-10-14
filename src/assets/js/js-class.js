// Marks the page as script-capable, for styles that need a script to be running. Loaded before the
// stylesheet. A tool's form appears only when its own module calls ready() in tools/common.js (W32).
document.documentElement.classList.add("js");

// Module scripts and their imports run before the load event, so a tool not ready at load has lost
// its module: its notice, hidden while scripts run (decision 99), shows with the sentence saying so.
window.addEventListener("load", () => {
  for (const tool of document.querySelectorAll(".tool:not(.is-ready)")) tool.classList.add("load-failed");
});
