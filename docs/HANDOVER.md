# Handover

Written 29 September 2026. Cut to the current state on 5 October 2026: decision 83.

The site is a **preview for review**. It is not published. The repository is https://github.com/LegendT/UK-State-Pension-Explorer. All work is merged into `main`, up to pull request 21. The branch `critique-recommendations` holds the changes of 5 October 2026: decisions 82 to 84, the corrected basis of two figures, one ordered list of launch steps, and this cut.

**This file holds state only.** Do not add a dated section. The record of a change, with its checks, goes in the description of its pull request, and a decision goes in `docs/decision-log.md`. The record up to pull request 21 is this file as it stood before the cut: `git show 75d0574:docs/HANDOVER.md`.

**Next action:** the launch steps in `docs/launch-dependencies.md`. Each step is the owner's, except the edits the list gives to the assistant.

## How to look at it

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install
npm run build
npm run serve        # http://127.0.0.1:8137
```

## What is built

- Nineteen pages: eleven main pages, the Tools page and three tool pages (decision 78), and four utility pages. Four calculators. Reform options is five pages: the options, the rule comparison (decision 62), costs, pensions and social care, and entitlement.
- On the overview, a section on State Pension age by date of birth, added on 30 September 2026.
- Registers of figures, claims and sources, a page register and a link register.
- Model specification, written before the code. Reference calculations by a separate method.
- Build checks for metadata, canonicals, indexing, sitemap, internal links, registers and sister links.
- Environment controls: development and preview are `noindex` with no sitemap. Production stops without its launch decisions.
- Documents: requirements matrix, decision log, launch dependencies, maintenance guide, accessibility assessment.

## Last checks

Run on 5 October 2026, Chrome 154, macOS, on the branch `critique-recommendations`.

| Check | Command | Result |
| --- | --- | --- |
| Calculator tests | `npm test` | 30 of 30 pass |
| Build checks | `npm run build` | No problems. 19 pages |
| Automated accessibility | `npm run a11y` | 0 violations, 1,885 incomplete. Every incomplete contrast result measured, 3,690, none below threshold |
| Scripted accessibility measurements | `npm run a11y:manual` | 0 problems |
| The two figures of the corrected basis | The Institute for Fiscal Studies' reports of July 2025 and December 2023, read as text | Both passages found. The 2023 report counts households |

Not run on 5 October 2026: `scripts/check-passages.py` and `scripts/check-values.py`, last run on 2 October 2026. Nothing was rendered and looked at, because no page's layout changed.

The deployed preview was checked on 29 September 2026, for pull request 1 only, with `curl` and Chrome: the sign-in, the status codes, the headers as served and one calculator. Since then only the sign-in on the main address has been checked. It answered 401 on 5 October 2026.

## Known defects and limits

1. **The announced rule rests on one government news story.** No Bill, no technical note, no costing method and no cost for the care service was found on 30 September 2026. The mechanism on the site is the Institute for Fiscal Studies' description, not the government's. The rule is in the rule comparison on the Institute's description, with four labelled assumptions: decision 38. The maintenance guide lists what should trigger a rewrite.
2. **Most responses to the announcement rest on news reports.** Only Reform UK's comes from the party's own page. The statements of Age UK, the Health Foundation and the King's Fund are as quoted in a trade report. No official transcript of the speech was found.
3. **Example budgets are not like for like.** Private renters at the 2026 minimum, social renters at the 2025 minimum, owners at the 2025 moderate standard.
4. **Not found, and shown as gaps:** the share of people on the full rate, the number whose pension is not increased abroad, costings for a double lock and for means-testing, incomes of pensioner carers.
5. **Typed wording that will age:** the worked example on the triple lock page names months and years in words. The first year in the rule comparison starts at 2027/28. Both are in the maintenance guide.
6. **One check date is printed for two figures** in a few combined source notes. Where the dates differ, in the two table notes of the cost and saving section, the note prints both.
7. **The preview on Netlify uses basic authentication** and sends `noindex` on every file. Both were seen working on the deploy preview. Both must be removed from the production context at launch. Deploy previews and branch deploys keep them: decision 68. The user name and password are in the `BASIC_AUTH` variable in Netlify. Netlify's own password protection was switched off on 30 September 2026 with the Netlify CLI, on the owner's instruction. The main address then answered 401 with `WWW-Authenticate: Basic`, so basic authentication is the one sign-in.
8. **Field errors use `role="alert"`.** With many errors at once, screen reader announcements may compete. Not tested.
9. **The government's savings figures cannot be checked.** They come with no price basis, baseline or method. The page says so, and says why they cannot be set beside the Institute for Fiscal Studies' range for 2050.
10. **After launch, deploy previews and branch deploys would be open.** Closed: decision 68, built and merged in pull request 18 on 2 October 2026. What is left is the look at the deployed preview past the sign-in.
11. **Markup left after the sweep of 29 September 2026.** Closed on 1 October 2026 and merged in pull request 11: decisions 54 to 57. Section 8 of `scripts/check-build.mjs` holds the rules a pattern can test.

## Checks not performed

- Any test with a screen reader. VoiceOver with Safari and NVDA on Windows are both outstanding.
- Keyboard use, browser zoom and touch by a person. Firefox and Safari.
- Review of content by a second person.
- The download and copy buttons of the history explorer were not pressed in a test.
- The sister sites' tools were read from served HTML. They were not run.
- House of Commons Library briefings and Hansard could not be opened.
- Nothing on the main site address beyond the sign-in, and nothing on a production domain. The deploy preview of pull request 1 was checked, and the deploy previews of pull requests 2 to 21 were not: see "Last checks". Fetched share previews on a social platform were not checked.
- Search console verification, sitemap submission, indexing.

## Launch

See `docs/launch-dependencies.md`. Every item was decided on 2 October 2026, and "Launch steps" there is the one ordered list. The owner aims to launch before 20 October 2026: decision 82.

## Declined: do not raise again

| Item | Where the reason is |
| --- | --- |
| A link to the migration fiscal-claim page | Decision 30 |
| Citing a source once for each paragraph, from point R3 of the UX review | Decision 47 |
| A7: the cash floor after rounding, in the history explorer too | Beside the code in `src/assets/js/lib/uprating.js` |
| The reports of `html-validate`: `prefer-native-element`, `wcag/h32`, `doctype-style` and `long-title` | `README.md`, "Markup conventions". `wcag/h32` is the four tool forms with no submit button: decisions 62 and 78 |
| W4 and W5 of the front-end sweep of 2 October 2026: the "All tools" link as a named `nav`, and the budget total row in a `tfoot` | Declined by the owner on 2 October 2026 |
| R7 of the critique of decision 80 | Beside `convertedNote` in the budget tool's script |

The items under "Known defects and limits" are known. Do not raise them again unless the owner asks.

## Waiting on the owner

As at 5 October 2026.

| Item | What is needed |
| --- | --- |
| Launch | The steps, in order, are in `docs/launch-dependencies.md`, "Launch steps". The first is a look at the deployed preview past the sign-in. Nobody has had one since the deploy preview of pull request 1 on 29 September 2026 |
| Budget explorer: the freeze the owner saw | Reported with decision 81 on 2 October 2026: "At a glance" stopped updating. Not reproduced locally in Chrome at 1280 or 390 px, and not looked into since. Needed from the owner: the browser, whether it was the deployed preview or a local build, and the steps. Rule out an old script first. On 1 October 2026 the rule comparison did the same on the deployed preview, and a browser's old copy of the script was the likely cause. Reload the page without the cache and try again |
| "Back to contents" links | Confirm keeping several on a page. Asked on 1 October 2026 and not yet answered. The assistant's reading: SC 2.4.4 is met, because each link goes to the same place. The cost is repetition in a screen reader's list of links, below 1024 px only |
| Decision 84 | Made by the assistant on 5 October 2026 and not yet confirmed. The 2.5% of the triple lock and "10p a week at most" stay typed, as two stated exceptions to the rule that no figure is typed into a page. A test now holds the 10p to the model. The other choice is a register entry and a filter on 17 lines in 7 templates |
| A6, deferred | Add the expected values of the new cash-floor test, 241.32 pounds at minus 1%, to `scripts/reference.py` and `docs/reference-calculations.md` |
| A8, deferred | The register sentence on the method page says "headline figures". Name every kind of record instead |
| Tools: while typing | A half-typed figure, such as "-", replaces the result and the summary with "Not available" after 400 ms. Since decision 78 this applies to all four tools, not only the rule comparison. The alternative keeps the last result, marked out of date, until the figure is valid |
| Rule comparison: phone keyboard | The pinned summary and an on-screen keyboard share a small screen. The alternative shrinks the summary to one line while a field has focus. Not tested on a real phone |
| Rule comparison: the gap shown | The summary gives the gap in the last year. The total over the period, in the full result's totals table, could be shown as well |
| Rule comparison: "less" is not a cut | The full result says a lower amount is a smaller rise, not a cut. The pinned summary does not, for want of room |
| Sweep, markup, W1 link | The source of a loaded example budget is plain text. Passing the source's address through the `budgetData` filter in `eleventy.config.js` would make it a link with a check date, like every other source. Changes a transform |
| Sweep, markup, K1 | About 16 dates typed in templates are not `time` elements: `index.njk` lines 29 and 38 to 43, `state-pension.njk` lines 39 and 61, `history.njk` line 23 |
| Sweep, markup, K2 | Table source notes (`macros.njk` line 142, 11 places) and the budget "Left out" notes (6) are "Label:" paragraphs, not the `dl` the figure notes use. Pages get longer, as with decision 56 |
| Sweep, markup, K3 | "Showing:" on the triple lock tool (`triple-lock.njk` line 121) is a label and value in one paragraph; could be a one-pair `dl` |
| Sweep, markup, K4 | The calculated column in the history table uses `em` (`history-view.js` line 114). A `span` with a class says it without stress emphasis |
| Sweep, markup, K5 | Terms defined in running text are `strong` (`index.njk` lines 73 and 75, `state-pension.njk` line 39). `dfn` is the element; needs a reset for its italic |
| Sweep, markup, K6 | The budget headline is a label and value in one paragraph (`budget-view.js` line 45) |
| Sweep, markup, K7 | `next_review` is free text, so its dates cannot be `time`. Needs a date field in `figures.json` |
| Sweep, styles, C2 | Chart text renders at about 9 px on a 320 px screen (13 units in a 720-unit view box). Not an AA failure. Shared with the charts drawn at build time |
| Sweep, styles, C3 | Four links that stand alone in a paragraph are about 21 px tall. They pass AA by the spacing exception of SC 2.5.8: each centre is at least 14.5 px from any other target, more than the 12 px radius, and `npm run a11y:manual` counts none under 24. They are short of the 44 px house standard. A class on those paragraphs and the "Back to contents" padding would fix them |
| Budget explorer: status after a helper | Deferred from the critique of decision 80 (R8). `loadPreset` and `fillPension` in `budget.js` read `lastResult` after `update` has set it, so "The breakdown below has changed" is announced when the breakdown first appears. Save `lastResult` before `update`. There before decision 80 |
| Sweep, critique, R1 | The CSS comment above the pinned summary does not say that `pinSummary` in `common.js` sets `--summary-size`, or that 16rem is the fallback. One clause |

## Tracked separately

| Item | Status |
| --- | --- |
| Reciprocal links on UK Public Finances Explorer and UK Migration Explorer | Not started. Needs a live domain. No other repository was changed |
| Deployed checks | Done for the deploy preview of pull request 1. See "Last checks". Not done for pull requests 2 to 21, for the main site address beyond the sign-in, or for a production domain |
| Search console | Not started. Needs account and domain access |

## Found in passing

- UK Public Finances Explorer shows State Pension spending of £146 billion as a 2025-26 forecast graded "official". Its own backlog calls the file stale. This site did not reuse it.
- Port 8081 on this computer was in use by another process. This project uses 8137.
