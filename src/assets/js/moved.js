// The rule comparison moved to its own page on 1 October 2026. A link made before then carries its
// settings in the address of the options page; send it on, settings and all.
if (new URLSearchParams(location.search).has("scenario")) location.replace(`/reform-options/compare/${location.search}#compare`);
else if (location.hash === "#rule-2030-assumptions") location.replace("/reform-options/compare/#rule-2030-assumptions");
