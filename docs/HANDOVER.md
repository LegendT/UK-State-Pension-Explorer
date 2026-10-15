# Handover

Written 29 September 2026. Cut to the current state on 5 October 2026: decision 83.

The site is a **preview for review**. It is not published. The repository is https://github.com/LegendT/UK-State-Pension-Explorer. Work merged into `main` is up to the latest merged pull request, which `gh pr list --state merged --limit 1` shows; this file does not name it, because a number here is out of date after every merge. Work since then is on the branch `launch-review`, whose pull request `gh pr list` shows: `git log main..launch-review` lists it. The pre-launch review of 5 October 2026 and its corrections (pull request 23) are recorded in `docs/pre-launch-review.md`. Launch steps 1 and 2 are done. Step 3, the owner's review of every page, was done on 8 October 2026. The work it led to, with the launch audit and the readability review of that day, is "Work before step 4" in `docs/launch-dependencies.md`.

**This file holds state only.** Do not add a dated section. The record of a change, with its checks, goes in the description of its pull request, and a decision goes in `docs/decision-log.md`. The record up to pull request 21 is this file as it stood before the cut: `git show 75d0574:docs/HANDOVER.md`.

**Next action:** the owner's. The only open row of "Work before step 4" in `docs/launch-dependencies.md` is W16, the owner's re-read of every page on the deploy preview. Then launch step 4. The assistant acts only on the owner's word.

## How to look at it

```
npm ci
npm run build
npm run serve        # http://127.0.0.1:8137
```

## What is built

- Nineteen pages: eleven main pages, the Tools page and three tool pages (decision 78), and four utility pages. Four calculators. Reform options is five pages: the options, the rule comparison (decision 62), costs, pensions and social care, and entitlement.
- On the overview, a section on State Pension age by date of birth, added on 30 September 2026.
- Navigation: a contents list on every long explainer, kept in view in a column of its own at 64em and wider, with the `h3` entries of a section over four phone screens nested; the calculator pages have none. On the reform pages the list also names the section's five pages, with this page's sections nested under its name. One "Back to top" link on a long page (decision 88, amended by 92). Next and Previous links at the foot of each reform page, and a Next link on the State Pension page. The site map follows the navigation (W7, 9 October 2026).
- Registers of figures, claims and sources, a page register and a link register.
- Model specification, written before the code. Reference calculations by a separate method.
- Build checks for metadata, canonicals, indexing, sitemap, internal links, registers and sister links.
- Environment controls: development and preview are `noindex` with no sitemap. Production stops without its launch decisions.
- The rule comparison and the triple lock calculator write nothing to the page address on their own: a button copies a link to the result shown (W31, decision 96). A tool's form appears only once its module has run (W32); while it loads, neither the form nor the notice that JavaScript is needed shows, and the notice appears if the module has not run by the page's load event (decision 99). Every heading, table and chart has an id typed in a template or a script (W29).
- The sources and method page gathers the known limits and likely misreadings, and says what changed after the owner's review of 8 October 2026 (W15).
- Documents: requirements matrix, decision log, launch dependencies, maintenance guide, accessibility assessment.

## Last checks

Run on 13 October 2026, Chrome 155, macOS, on the branch `launch-review` after W33, W26, W27, W29, W31, W32, W35, W12, W34 and W15. The build, the tests, the tool tests and both accessibility runs were run again on 14 October 2026 after the changes of decision 99, with the results below. W33 added three claims and two sources, and the quoted passages were checked that day: 225 found. No row since then changed a claim's passage or a figure's value; W27 reworded one claim's statement without changing its passage. The values check was last run on 8 October 2026.

| Check | Command | Result |
| --- | --- | --- |
| Tool behaviour in a browser | `npm run test:tools` | 51 checks, 0 problems, on 14 October 2026, on the built site: fields kept through a change, a blank or zero tax field, recovery from a wrong entry, example and scenario changes, malformed and restored addresses, history subranges and the table export, the copied link, and the focus and announcements that go with each (W12) |
| Calculator and chart tests | `npm test` | 46 of 46 pass on 14 October 2026. Each test added by W11, W21, W23 and W30 fails on a planted defect in the logic it covers; W26, W31 and W12 added tests for the tools' source lines, the link a result copies and the table export |
| Build checks | `npm run build` | No problems on 14 October 2026. 19 pages, 128 figures, 171 claims, 110 sources. The check W24 added stops the build on a planted defect; the checks W29 added stop it on a heading or caption without an id, an id used twice, or a script drawing a heading without one, shown with a planted bare heading |
| Quoted passages | `python3 scripts/check-passages.py` | 225 checked on 13 October 2026, after W33. 202 found by the script, 23 found in a browser by hand, 0 not found, 0 unreadable. Of the 23, 7 were read again on 8 October 2026 and 2 first read on 12 October 2026 (W10); 14 keep their first dates (W4) |
| Figures with no quoted passage | `python3 scripts/check-values.py` | 53 of 65 found in the source text. The other 12 are in 11 spreadsheets and one PDF; each record names its file and cell, or its page (W4) |
| Automated accessibility | `npm run a11y` | 0 violations in 130 audits of 19 pages on 14 October 2026, 2,249 distinct incomplete results. Every incomplete contrast result measured, 4,180 occurrences across the audits, none below threshold. axe does not measure the scroll cue of W20, which is generated text: worked by hand, 6.6:1 or more in both colour schemes |
| Scripted accessibility measurements | `npm run a11y:manual` | 0 problems after W15, and in every run since W35 on 13 October 2026: four full runs and 20 settled keyboard passes of the costs page. The intermittent failure on the costs page was the check, not the page (row W35): it now measures each stop two animation frames after the Tab, and compares the stops reached with those expected by key. On the costs page it reaches 109 stops of 108 expected, the extra being the "Back to top" link, which a focus move shows. Since W32 each tool page is also checked with its module running and with its module blocked, and since decision 99 with its module held back two seconds, when neither the form nor the notice may show: that check reports all four tools on the rule as it was. 0 problems on 14 October 2026 |
| Loading on a phone | `node scripts/measure-loading.mjs` | Run on 13 October 2026 on the built site, served by the script itself without compression or cache headers, as a slow phone: the values Chrome's DevTools applies for "Slow 4G" (562.5 ms latency), CPU slowed four times. Cold loads in a fresh browser context, DOMContentLoaded then largest paint: overview 1,486 ms and 1,504 ms, 64 kB over 7 requests; costs 1,607 and 1,496 ms, 116 kB; sources and method 2,861 and 1,596 ms, 312 kB; rule comparison 2,967 and 1,480 ms, 140 kB over 12 requests; history explorer 2,907 and 1,488 ms, 113 kB. Warm loads 2% to 5% quicker, nothing answered from cache: the local server sends no cache headers. Each of the four tools redraws 405 to 419 ms after the last keystroke or choice, of which 400 ms is its own pause. The source register opens in under a millisecond and scrolls 20,000 px at 600 px a frame in 32 frames, 17 of them over 16.7 ms, the longest 28 ms. Sizes decoded, gzip, brotli, from the script: overview 26.5, 6.7, 5.4 kB; stylesheet 28.2, 8.0, 6.8 kB; the comparison's main script 9.8, 3.4, 2.8 kB; register page 276.3, 51.7, 36.8 kB; costs page 80.9, 14.9, 12.0 kB. Deployed preview, 13 October 2026, in the owner's Chrome after the owner signed in, on the build of `main` (`ccdf841`), read through the Claude in Chrome extension with fetches from the page: every file is served with brotli over HTTP/2 and `vary: Accept-Encoding`; pages carry `cache-control: private,max-age=0,stale-if-error=3600` and assets `public,max-age=0,must-revalidate`, each with an etag, so a second request is a 304 of about 300 bytes on the wire; `x-robots-tag: noindex` is on every file. On the wire, cold: overview 6.5 kB (25.6 kB decoded), costs 13.8 kB (83.6 kB), sources and method 40.9 kB (245.5 kB), rule comparison 9.4 kB (47.6 kB), history explorer 6.8 kB (29.9 kB). Cold fetch times on the owner's connection, not throttled, 145 to 374 ms; warm 143 to 158 ms. The extension cannot throttle to a phone, so the phone timings are the local ones above; with brotli the register page moves 41 kB where the local run moved 312 kB. No measurement says a page should change |
| Dependencies | `npm audit` | 9 packages, 5 high and 4 moderate, none loaded when the site is built: `README.md`, "Set up" |
| Production build | `npm run build` with every step 7 value set | Run on 14 October 2026 after the critique of pull request 26: 19 pages, no problems; no preview banner, the GitHub route and the reviewer shown. Not read page by page since 5 October 2026 |
| Readability | `statistics-ux` skill, expert review | `docs/ux-review-2026-10-08.md` |
| Figures and claims against their sources | Five reviewers with a fresh context, 5 October 2026 | See `docs/pre-launch-review.md` |

The deployed preview was checked past the sign-in on 6 October 2026, in the owner's Chrome after the owner signed in, on the build of `25b1e74`: the overview, the State Pension page, the history page, and the budget explorer, rule comparison and history explorer running (the owner's budget sequence, the half-typed figure, the input that once froze the chart, the CSV fetched from a page). `/_headers` and `/sitemap.xml` answer 404, `robots.txt` is the preview's, a missing page gets the site's 404 page, and the console showed no error or policy violation. Not read: the headers as served, because the browser extension refuses a script that reads them; Netlify reports 3 header rules deployed. Seen twice: a direct request for the CSV address answered 503 while signed in, though the same file fetched from a page answered 200. Not pressed: the download link, which needs the owner's say-so. Check both on the live site after launch.

## Known defects and limits

1. **The announced rule is not in law and its detail is thin.** No Bill is on the UK Parliament's list of Bills: searched on 5 October 2026. The government has described the rule in outline, in the announcement and in an analysis the Department for Work and Pensions published on 29 September 2026. The site missed that analysis until 5 October 2026. The government has not published the measure of earnings, or the paths of earnings and prices behind its savings. The mechanism in the rule comparison is the Institute for Fiscal Studies' description, with four labelled assumptions: decision 38. The maintenance guide lists what should trigger a rewrite.
2. **Some responses to the announcement rest on news reports.** The statements of Reform UK, the Liberal Democrats, Age UK, the Health Foundation and the King's Fund come from their own sites, and the speech from the Labour Party's. The Health Foundation and the King's Fund were cited from a trade report until W10, on 12 October 2026. Unite's statement is as reported by PA News. The Conservative, Scottish National Party, Green and Plaid Cymru positions are as reported.
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
- The download and copy buttons of the history explorer are pressed by `npm run test:tools` (W12), which checks the announcement and the copied table; the downloaded file itself has not been opened by a person.
- The sister sites' tools were read from served HTML. They were not run.
- House of Commons Library briefings and Hansard could not be opened.
- Nothing on a production domain. The main site address was checked past the sign-in on 6 October 2026: see "Last checks". Deploy previews after pull request 1 were not checked. Fetched share previews on a social platform were not checked.
- Search console verification, sitemap submission, indexing.
- Loading on a phone on the deployed preview: the throttled phone timings are from the built site served locally. The deployed preview's headers, sizes on the wire and unthrottled fetch times were read on 13 October 2026 (row W34).

## Launch

See `docs/launch-dependencies.md`. Every item was decided on 2 October 2026, and "Launch steps" there is the one ordered list. The owner wants to launch before 20 October 2026: decision 82.

## Declined: do not raise again

| Item | Where the reason is |
| --- | --- |
| A link to the migration fiscal-claim page | Decision 30 |
| Citing a source once for each paragraph, from point R3 of `docs/ux-review.md` | Decision 47 |
| A7: the cash floor after rounding, in the history explorer too | Beside the code in `src/assets/js/lib/uprating.js` |
| The reports of `html-validate`: `prefer-native-element`, `wcag/h32`, `doctype-style` and `long-title` | `README.md`, "Markup conventions". `wcag/h32` is the four tool forms with no submit button: decisions 62 and 78 |
| W4 and W5 of the front-end sweep of 2 October 2026: the "All tools" link as a named `nav`, and the budget total row in a `tfoot` | Declined by the owner on 2 October 2026 |
| The analytics script loaded with `type="module"`, not `defer` | `docs/pre-launch-review.md`. Settled by the check of the beacon on the live site |
| A test for "up to 25p a week" in the model specification | `docs/pre-launch-review.md`. A dated record of a trial, not a published claim |
| A row for the Retail Prices Index figure of 2011/12 in the triple lock calculator | The year's note gives it |
| Note 7 of the owner's page review: the argument that a fixed rule takes the increase out of each government's hands | Row W8 of `docs/launch-dependencies.md`. No source found on 12 October 2026; dropped by the owner the same day |
| Four smaller points of the readability review of 8 October 2026: public spending covered on both the State Pension and costs pages (item 53), a second current section on the compare page (item 51), a download of the compare tables (item 22), and adding more than one rule at a time in the history explorer (item 64) | Decision 93 |
| The two figures cited with `m.cite` of their source, not `m.ref`, in "Effect on the pension" under the 2030 rule in `src/reform-options.njk` | The owner's answer of 12 October 2026, from the critique of W10 to W13. It predates that day, and the build check of W24 passes it |

The items under "Known defects and limits" are known. Do not raise them again unless the owner asks.

## Waiting on the owner

As at 14 October 2026.

| Item | What is needed |
| --- | --- |
| Launch | The steps, in order, are in `docs/launch-dependencies.md`, "Launch steps". Steps 1 to 3 are done. Before step 4 comes "Work before step 4" in the same file, where W16 is the owner's last row. The work of decision 99 was pushed on 14 October 2026 and the pull request's deploy preview, https://deploy-preview-26--ukstatepensionexplorer.netlify.app, was built from it, so W16 can start there. The assistant does each row on the owner's word |

Every other open item is in `docs/launch-dependencies.md`: before launch in "Work before step 4", after it in "After launch, first update". `docs/pre-launch-review.md`, which is frozen, points here for its "Rendered pages" and "Code" items. They are rows of that table.

## Found in passing

- UK Public Finances Explorer shows State Pension spending of £146 billion as a 2025-26 forecast graded "official". Its own backlog calls the file stale. This site did not reuse it.
- Port 8081 on this computer was in use by another process. This project uses 8137.
