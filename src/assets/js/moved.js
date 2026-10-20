// The rule comparison moved to its own page on 1 October 2026, and to /tools/compare/ on 20 October
// 2026 (decision 123). A link made before 1 October carries its settings in the address of the options
// page; send it on, settings and all.
if (new URLSearchParams(location.search).has("scenario")) location.replace(`/tools/compare/${location.search}#compare`);
else if (location.hash === "#rule-2030-assumptions") location.replace("/tools/compare/#rule-2030-assumptions");
