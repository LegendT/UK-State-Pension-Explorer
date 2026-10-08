# Handover

Written 29 September 2026. Cut to the current state on 5 October 2026: decision 83.

The site is a **preview for review**. It is not published. The repository is https://github.com/LegendT/UK-State-Pension-Explorer. All work is merged into `main`. `gh pr list --state merged --limit 1` shows the latest merged pull request. This file does not name it, because a number here is out of date after every merge. The pre-launch review of 5 October 2026 and its corrections (pull request 23) are recorded in `docs/pre-launch-review.md`. Launch steps 1 and 2 are done.

**This file holds state only.** Do not add a dated section. The record of a change, with its checks, goes in the description of its pull request, and a decision goes in `docs/decision-log.md`. The record up to pull request 21 is this file as it stood before the cut: `git show 75d0574:docs/HANDOVER.md`.

**Next action:** the launch steps in `docs/launch-dependencies.md`. Each step is the owner's, except the edits the list gives to the assistant.

## How to look at it

```
npm ci
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

Run on 5 October 2026, Chrome 154, macOS, on the branch `pre-launch-review`, after its corrections.

| Check | Command | Result |
| --- | --- | --- |
| Calculator tests | `npm test` | 31 of 31 pass |
| Build checks | `npm run build` | No problems. 19 pages, 126 figures, 158 claims, 104 sources |
| Quoted passages | `python3 scripts/check-passages.py` | 210 checked. 189 found by the script, 21 found in a browser by hand on an earlier day, 0 not found, 0 unreadable |
| Figures with no quoted passage | `python3 scripts/check-values.py` | 53 of 65 found in the source text. The other 12 are in spreadsheets, which three reviewers opened and matched on the same day |
| Automated accessibility | `npm run a11y` | 0 violations in 130 audits of 19 pages, 1,983 incomplete. Every incomplete contrast result measured, 3,867, none below threshold |
| Scripted accessibility measurements | `npm run a11y:manual` | 0 problems |
| Production build | `npm run build` with production settings, so the build check ran in production mode, and a second copy in a scratch directory read by hand | 18 addresses in the sitemap, the 404 page `noindex`, canonicals on the registered domain, no preview banner, the analytics script on all 19 pages, an empty `_headers`, no local address |
| Figures and claims against their sources | Five reviewers with a fresh context, each fetching the sources | See `docs/pre-launch-review.md` |

The deployed preview was checked past the sign-in on 6 October 2026, in the owner's Chrome after the owner signed in, on the build of `25b1e74`: the overview, the State Pension page, the history page, and the budget explorer, rule comparison and history explorer running (the owner's budget sequence, the half-typed figure, the input that once froze the chart, the CSV fetched from a page). `/_headers` and `/sitemap.xml` answer 404, `robots.txt` is the preview's, a missing page gets the site's 404 page, and the console showed no error or policy violation. Not read: the headers as served, because the browser extension refuses a script that reads them; Netlify reports 3 header rules deployed. Seen twice: a direct request for the CSV address answered 503 while signed in, though the same file fetched from a page answered 200. Not pressed: the download link, which needs the owner's say-so. Check both on the live site after launch.

## Known defects and limits

1. **The announced rule is not in law and its detail is thin.** No Bill is on the UK Parliament's list of Bills: searched on 5 October 2026. The government has described the rule in outline, in the announcement and in an analysis the Department for Work and Pensions published on 29 September 2026. The site missed that analysis until 5 October 2026. The government has not published the measure of earnings, or the paths of earnings and prices behind its savings. The mechanism in the rule comparison is the Institute for Fiscal Studies' description, with four labelled assumptions: decision 38. The maintenance guide lists what should trigger a rewrite.
2. **Some responses to the announcement rest on news reports.** The statements of Reform UK, the Liberal Democrats and Age UK come from their own sites, and the speech from the Labour Party's. The statements of the Health Foundation and the King's Fund are as quoted in a trade report, because their own sites refuse automated reading. The Conservative, Scottish National Party, Green and Plaid Cymru positions are as reported.
3. **Example budgets are not like for like.** Private renters at the 2026 minimum, social renters at the 2025 minimum, owners at the 2025 moderate standard.
4. **Not found, and shown as gaps:** the share of people on the full rate, the number whose pension is not increased abroad, costings for a double lock and for means-testing, incomes of pensioner carers.
5. **Typed wording that will age:** the worked example on the triple lock page names months and years in words. The first year in the rule comparison starts at 2027/28. Both are in the maintenance guide.
6. **One check date is printed for two figures** in a few combined source notes. Where the dates differ, in the two table notes of the cost and saving section, the note prints both.
7. **The preview on Netlify uses basic authentication** and sends `noindex` on every file. Both were seen working on the deploy preview. Both must be removed from the production context at launch. Deploy previews and branch deploys keep them: decision 68. The user name and password are in the `BASIC_AUTH` variable in Netlify. Netlify's own password protection was switched off on 30 September 2026 with the Netlify CLI, on the owner's instruction. The main address then answered 401 with `WWW-Authenticate: Basic`, so basic authentication is the one sign-in.
8. **Field errors use `role="alert"`.** With many errors at once, screen reader announcements may compete. Not tested.
9. **The government's savings figures can be read but not reproduced.** The Department for Work and Pensions gives the baseline, the coverage and the prices. It does not give the paths of earnings and prices it assumed. The costs page says so.
10. **After launch, deploy previews and branch deploys would be open.** Closed: decision 68, built and merged in pull request 18 on 2 October 2026. The look at the deployed preview past the sign-in was done on 6 October 2026: see "Last checks".
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

See `docs/launch-dependencies.md`. Every item was decided on 2 October 2026, and "Launch steps" there is the one ordered list. The owner wants to launch on 5 October 2026 if possible, and before 20 October 2026 if not: decision 82.

## Declined: do not raise again

| Item | Where the reason is |
| --- | --- |
| A link to the migration fiscal-claim page | Decision 30 |
| Citing a source once for each paragraph, from point R3 of the UX review | Decision 47 |
| A7: the cash floor after rounding, in the history explorer too | Beside the code in `src/assets/js/lib/uprating.js` |
| The reports of `html-validate`: `prefer-native-element`, `wcag/h32`, `doctype-style` and `long-title` | `README.md`, "Markup conventions". `wcag/h32` is the four tool forms with no submit button: decisions 62 and 78 |
| W4 and W5 of the front-end sweep of 2 October 2026: the "All tools" link as a named `nav`, and the budget total row in a `tfoot` | Declined by the owner on 2 October 2026 |
| The analytics script loaded with `type="module"`, not `defer` | `docs/pre-launch-review.md`. Settled by the check of the beacon on the live site |
| A test for "up to 25p a week" in the model specification | `docs/pre-launch-review.md`. A dated record of a trial, not a published claim |
| A row for the Retail Prices Index figure of 2011/12 in the triple lock calculator | The year's note gives it |

The items under "Known defects and limits" are known. Do not raise them again unless the owner asks.

## Waiting on the owner

As at 5 October 2026.

| Item | What is needed |
| --- | --- |
| Launch | The steps, in order, are in `docs/launch-dependencies.md`, "Launch steps". Steps 1 and 2 were done on 6 October 2026. The next is step 3, the owner's review of every page |
| Budget explorer: the freeze the owner saw | Reported with decision 81 on 2 October 2026: "At a glance" stopped updating. Not reproduced. Needed from the owner: the browser, whether it was the deployed preview or a local build, and the steps. Rule out an old script first: reload the page without the cache and try again. A reviewer ran the owner's steps and 268 scripted steps at four screen sizes on 5 October 2026, and the summary matched the full result every time. The nearest things found: on a short screen the summary is not pinned and leaves the screen once a tax figure is added; and a press on a button that lies under the pinned summary does not reach the button. A different freeze was found and fixed the same day: the rule comparison stopped responding when every rule gave almost the same amount |
| "Back to contents" links | Settled on 8 October 2026: decision 88. Was: confirm keeping several on a page. Asked on 1 October 2026 and not yet answered. The assistant's reading: SC 2.4.4 is met, because each link goes to the same place. The cost is repetition in a screen reader's list of links, below 1024 px only |
| New since 30 September 2026, not yet on the site | Found on 5 October 2026 and listed with their addresses in `docs/pre-launch-review.md`: the Institute for Fiscal Studies' analysis of 30 September 2026, which puts the saving in 2039 to 2040 between £4 billion and £20 billion; the department's projection of pensioner poverty; the Scottish Government's letter of 1 October 2026; the Scottish National Party's statement of 2 October 2026; the pensions minister's article of 2 October 2026; a workforce plan promised for the end of the year; and two changes to the care commission's terms of reference on 1 October 2026. Each needs a source record and claims. The owner decided on 6 October 2026 that they go in after launch, in the first update: decision 87 |
| The Health Foundation and the King's Fund | Their statements are quoted from a trade report, because their sites refuse automated reading. A reviewer read both in a browser. If the owner opens the two addresses in `docs/pre-launch-review.md` and confirms the words, the claims can cite the organisations' own sites |
| Rendered pages, left from the pre-launch review | None is an error. On a short screen a tool's summary is not pinned, so it is out of view while typing; a one-line pinned strip would keep it. The pinned summary stays over the page from top to foot, not only beside the tool. On a phone the charts open at their left end with no cue that they scroll. The table of every rate scrolls sideways at both widths and loses its year column. In the rule comparison's table of yearly figures, an error wraps over ten lines on a phone. The history explorer does not use the "Out of date" note for an impossible range. Financial years are written three ways: 2026/27, 2026-27 and 2026 to 2027 |
| Code, left from the pre-launch review | A figure typed as ".5" is refused, with a message that does not say why. A tool whose script fails to load shows its form and nothing else. No test reaches the range limits of the fields, or the history table for a range that starts after the first year. Six filters and two exports are unused. None gives a wrong number |
| Rule comparison: phone keyboard | The pinned summary and an on-screen keyboard share a small screen. The alternative shrinks the summary to one line while a field has focus. Not tested on a real phone |
| Rule comparison: the gap shown | The summary gives the gap in the last year. The total over the period, in the full result's totals table, could be shown as well |
| Rule comparison: "less" is not a cut | The full result says a lower amount is a smaller rise, not a cut. The pinned summary does not, for want of room |
| Sweep, markup, W1 link | The source of a loaded example budget is plain text. Passing the source's address through the `budgetData` filter in `eleventy.config.js` would make it a link with a check date, like every other source. Changes a transform |
| Sweep, markup, K2 | Table source notes (`macros.njk` line 142, 11 places) and the budget "Left out" notes (6) are "Label:" paragraphs, not the `dl` the figure notes use. Pages get longer, as with decision 56 |
| Sweep, markup, K3 | "Showing:" on the triple lock tool (`triple-lock.njk` line 121) is a label and value in one paragraph; could be a one-pair `dl` |
| Sweep, markup, K4 | The calculated column in the history table uses `em` (`history-view.js` line 114). A `span` with a class says it without stress emphasis |
| Sweep, markup, K5 | Terms defined in running text are `strong` (`index.njk` lines 73 and 75, `state-pension.njk` line 39). `dfn` is the element; needs a reset for its italic |
| Sweep, markup, K6 | The budget headline is a label and value in one paragraph (`budget-view.js` line 45) |
| Sweep, markup, K7 | `next_review` is free text, so its dates cannot be `time`. Needs a date field in `figures.json` |
| Sweep, styles, C2 | Chart text renders at about 9 px on a 320 px screen (13 units in a 720-unit view box). Not an AA failure. Shared with the charts drawn at build time |
| Sweep, styles, C3 | Four links that stand alone in a paragraph are about 21 px tall. They pass AA by the spacing exception of SC 2.5.8: each centre is at least 14.5 px from any other target, more than the 12 px radius, and `npm run a11y:manual` counts none under 24. They are short of the 44 px house standard. A class on those paragraphs and the "Back to contents" padding would fix them |
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
