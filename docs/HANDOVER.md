# Handover: first build

Written 29 September 2026, updated 2 October 2026. The site is a **preview for review**. It is not published. The repository is https://github.com/LegendT/UK-State-Pension-Explorer. All work is merged into `main`, up to pull request 17. Pull request 16, from `summary-differences`, carried decisions 63 and 64, and pull request 17, from `frontend-sweep`, the front-end sweep and decision 65. Both were merged on 1 October 2026. Pull request 10, from `handover-review-note`, added the marking of the current section in the "On this page" list, decision 53, and carried the handover note that records pull request 9. It was merged on 30 September 2026. Pull request 8 carried the work on the UX review of 30 September 2026, and pull request 9 recorded the owner's answers on it: see "UX review of 30 September 2026". Merged: pull request 1, the first build, on 29 September 2026; pull request 2, from `first-build`, pull request 3, from `april-2030-rule`, and pull request 4, from `homepage-orientation`, on 30 September 2026. Pull request 3 carried the markup sweep and stylesheet fixes of `html-semantics` and the update for the government's announcement of 29 September 2026. Pull request 4 added a table of State Pension age by date of birth to the overview: decision 44. Pull request 5 corrected the handover. Pull request 6, from `rule-2030-calculator`, adds the announced rule to the rule comparison: decision 38. It was merged on 30 September 2026. Pull request 7, from `handover-pr6`, recorded pull request 6 in this handover. Netlify builds `main` to the main address and a deploy preview of each pull request into `main`, all behind a sign-in.

**Pull request 11**, from `defect-11-and-research`, merged on 1 October 2026: defect 11 closed, decisions 54 to 57, and the two items the research of 30 September left out, decision 58. See "Defect 11, 1 October 2026" and "Two items added, 1 October 2026". The owner's answers of the same day were merged in pull request 12: see "Owner's answers of 1 October 2026". Review points W1 to W4 from its critique were merged in pull request 13. The corrections from an external factual audit were merged in pull request 14: see "External audit of 1 October 2026".

**Next action:** none is authorised. On 29 September 2026 the government announced a change to the triple lock from April 2030 and a National Care Service. The site was brought up to date on 30 September 2026, on the branch `april-2030-rule`: see "The announcement of 29 September 2026". It is merged into `main`. The rule is in the rule comparison, with its assumptions labelled: decisions 38 and 45.

## How to look at it

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install
npm run build
npm run serve        # http://127.0.0.1:8137
```

## Completed

- Eleven main pages, four utility pages, four calculators. Reform options is five pages: the options, the rule comparison (decision 62), costs, pensions and social care, and entitlement.
- On the overview, a section on State Pension age by date of birth, added on 30 September 2026.
- Registers of figures, claims and sources, a page register and a link register.
- Model specification, written before the code. Reference calculations by a separate method.
- Build checks for metadata, canonicals, indexing, sitemap, internal links, registers and sister links.
- Environment controls: development and preview are `noindex` with no sitemap. Production stops without its launch decisions.
- Documents: requirements matrix, decision log, launch dependencies, maintenance guide, accessibility assessment.

## Checks performed, with results

Run on 29 September 2026, Chrome 154, macOS.

| Check | Command | Result |
| --- | --- | --- |
| Calculator tests | `npm test` | 22 of 22 pass |
| Build checks | `npm run build` | No problems in development and preview. A production configuration passed before the `noindex` header was added to `netlify.toml`. It now stops on that header, as intended |
| Production gate | Build with settings missing, a placeholder domain, a wrong owner type, `BASIC_AUTH` set, and the `noindex` header present | Stopped each time, naming the cause |
| Preview gate | Preview build with `NETLIFY` set and no `BASIC_AUTH`. `BASIC_AUTH` in the wrong format | Stopped each time |
| Quoted passages | `python3 scripts/check-passages.py` | All found: most by the script, the rest in a browser because three sites refuse scripts |
| Figures with no quoted passage | `python3 scripts/check-values.py`, then the source spreadsheets | All values found. For two wealth figures the value was found but the row was not confirmed |
| Source addresses | One request each | All responded except sites that refuse scripts, which opened in a browser |
| Automated accessibility | `npm run a11y` | 0 violations. Every undecided contrast result measured: none below threshold |
| Scripted accessibility measurements | `node scripts/a11y-manual-assist.mjs` | 0 problems |
| Calculators in a browser | By script in Chrome | Results matched the reference values. See `docs/reference-calculations.md` |
| Critique | Self review plus an independent reader on a different model | Findings fixed or listed below |

The scripts print their own counts. They are not copied here because they change with the content.

The build, the tests and both accessibility scripts were run again on 29 September 2026 after each later change: the fold of the social care page, the wording edits, the markup sweep and the stylesheet fixes. The results were the same each time: no build problems, 22 of 22 tests, 0 violations, 0 problems. After the markup sweep the changed blocks were looked at in Chrome at 390 and 1280 pixels wide, with a result loaded in each calculator shown.

## The announcement of 29 September 2026

The research record is `research/06-announcement-2026-09-29.md`. The decisions are numbers 36 to 43 in `docs/decision-log.md`.

What changed on the site, on 30 September 2026:

- The registers gained the sources, claims and figures for the announcement and the responses to it. Seven claims that the announcement overtook were deleted.
- The news note on the overview was rewritten. The overview and the triple lock page each say that a change is announced for April 2030.
- The reform options page has a card for the announced rule, the government's and the Institute for Fiscal Studies' figures in the cost and saving section, and a rewritten social care section, moved to follow the rule comparison. The ten questions the page set before the announcement now show what it answers.
- Findings R7 to R17 of the critique of 30 September 2026 were dealt with: decision 43.

Checks run on 30 September 2026 after the change, Chrome 154, macOS:

| Check | Command | Result |
| --- | --- | --- |
| Build checks | `npm run build` | No problems |
| Calculator tests | `npm test` | 22 of 22 pass |
| Quoted passages | `python3 scripts/check-passages.py` | None missing. The passages from ifs.org.uk and reformparty.uk were matched in Chrome, because those sites refuse scripts |
| Figures with no quoted passage | `python3 scripts/check-values.py` | Four wealth figures could not be read: the Office for National Statistics answered 429. They were not changed by this work |
| Automated accessibility | `npm run a11y` | 0 violations. Every undecided contrast result measured: none below threshold |
| Scripted accessibility measurements | `node scripts/a11y-manual-assist.mjs` | 0 problems |
| Rendered pages | Screenshots in Chrome at 390 and 1280 pixels wide | The overview note, the law section of the triple lock page, and the option card, saving section, social care section and ten questions of the reform options page were looked at |

## Checks on the deployed preview

Run on 29 September 2026 against the deploy preview of pull request 1, commit `15744d9`, with `curl` and Chrome 154.

| Check | Result |
| --- | --- |
| No credentials | 401, Netlify's password page |
| Past the password page, no sign-in | 401, `WWW-Authenticate: Basic` |
| Past the password page, wrong sign-in | 401 |
| Past the password page, right sign-in | 200 |
| A page that does not exist | 404, with the site's own page |
| `/_headers` | 404. The file is not served |
| All 11 pages, `robots.txt`, the CSV, a share image, the stylesheet and a script | 200, with the expected content types |
| `/sitemap.xml` | 404, as intended for a preview |
| Headers as served | Content Security Policy, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy` and `X-Robots-Tag: noindex`, on pages and on the CSV |
| `http://` address | 301 to `https://` |
| Canonical address | The deploy's own address |
| History explorer in Chrome | Form shown, result updated, download started from a `blob:` address. No policy violation from the site's own code |

Found by these checks:

- **The site was titled "ukstatepensionexplorer".** Netlify sets `SITE_NAME` on every build. The setting is now `SITE_TITLE`. Fixed after this deploy, so the deploy checked still shows the wrong name.
- **The Content Security Policy blocks Netlify's own preview toolbar**, which Netlify adds to deploy previews. Chrome reported one blocked inline style and one blocked frame from `app.netlify.com`. The site is not affected. The toolbar can be switched off in Netlify.

Not checked on the deployed preview: the other three calculators, any browser but Chrome, a fetched share preview on a social platform, and anything on the main site address. Pull request 1 has since been merged, so that address may now have a deploy. On 30 September 2026 the main address was checked for the sign-in only: it answered 401 with `WWW-Authenticate: Basic`. Nothing else on it was looked at.

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
10. **After launch, deploy previews and branch deploys would be open.** The launch steps first written would have deleted `BASIC_AUTH` everywhere. Keeping it for those two contexts needs the production guard to check the Netlify context. Deferred to launch planning. The approach was chosen on 2 October 2026, decision 68; the build work waits on the owner's go.
11. **Markup left after the sweep of 29 September 2026.** Dealt with on 1 October 2026 and merged in pull request 11. Decisions 54 to 57, confirmed by the owner the same day.
    - The lists of a bold label and a value: 33 items in 9 lists that pair a name with its description are now description lists. The other lists stay as they were: decision 55. Confirmed.
    - The source note under each figure: period, place, range and source are a description list, a line each. The costs page is about 10% longer: decision 56. Confirmed.
    - The names of scrolling table regions: each now comes from its caption. Done: decision 54.
    - The name of each chart: its title alone, with the description joined as a description. Done: decision 54.
    - The cards under "Where to go next": the link holds the name only. Done: decision 57.
    - A build check for the markup conventions: section 8 of `scripts/check-build.mjs` holds the rules a pattern can test. Each of its eight tests was shown to fail on a planted defect.

## Checks not performed

- Any test with a screen reader. VoiceOver with Safari and NVDA on Windows are both outstanding.
- Keyboard use, browser zoom and touch by a person. Firefox and Safari.
- Review of content by a second person.
- The download and copy buttons of the history explorer were not pressed in a test.
- The sister sites' tools were read from served HTML. They were not run.
- House of Commons Library briefings and Hansard could not be opened.
- Nothing on the main site address beyond the sign-in, and nothing on a production domain. The deploy preview of pull request 1 was checked, and the deploy previews of pull requests 2 to 13 were not: see "Checks on the deployed preview". Fetched share previews on a social platform were not checked.
- Search console verification, sitemap submission, indexing.

## Owner decisions needed for launch

See `docs/launch-dependencies.md`. Every item was decided on 2 October 2026: see "Launch dependencies, 2 October 2026". What is left is doing them.

## Owner's answers

Given on 29 September 2026. The record is `docs/decision-log.md`, numbers 29 to 34.

| Question | Answer | State |
| --- | --- | --- |
| Should pensions and social care stay a main page? | No. A dated section of the reform options page | Done in the working copy. After the change, `npm run build`, `npm test`, `npm run a11y` and `node scripts/a11y-manual-assist.mjs` were run again on 29 September 2026, with the results in "Checks performed". The section was looked at in Chrome at 390 and 1280 pixels wide. Committed, and merged into `main` on 30 September 2026. It was then rewritten after the announcement: see decision 36 |
| May `scripts/seed/` be deleted? | Yes | Deleted |
| Should the fiscal-claim page be linked? | No | Register entry marked declined |
| Should Netlify's own password page be turned off? | Yes | Done on 30 September 2026 with the Netlify CLI. Checked on the main address |
| May `.preview-password` be deleted? | Yes | Deleted |
| Are the decisions in the decision log accepted? | 22 accepted as written. Analytics amended to Cloudflare at launch. Number 21, the three parties left out, reopened | See number 34, overtaken by number 39 |

Answered on 29 September 2026: previews are protected with basic authentication, hosting is Netlify, and four unused variables were deleted from Netlify.

## Owner's answers of 30 September 2026

| Question | Answer | State |
| --- | --- | --- |
| Social care: section or page? | Section for now. Decide again when Casey reports | Done: decision 36 |
| The name of the rule? | "The rule announced for April 2030", with the government's name given where the rule is described | Done: decision 37 |
| Add the rule to the rule comparison? | Yes, as a later phase | Done on 30 September 2026: decision 38 |
| Responses from parties and other bodies? | Read them at source and add them now. Label what is left | Done: decision 39 |
| Findings R7 to R17? | All now | Done: decision 43 |
| A policy change entry in `corrections.json`? | No | Decision 40 |
| The uncommitted edits on `html-semantics`? | Commit them first | Done: commits `8c78a0b` and `ad5dbb6` |
| Which branch? | A new branch from `html-semantics` | Done: `april-2030-rule` |

## UX review of 30 September 2026

The review is `docs/ux-review.md`, a frozen record. The owner accepted these recommendations on 30 September 2026 and gave the go-ahead for all of them. All ten are done and were merged into `main` in pull request 8 on 30 September 2026. Neither its deploy preview nor the main address past the sign-in has been looked at.

| No. | Recommendation | State |
| --- | --- | --- |
| R1 | Split reform options into four pages, option A: decision 46 | Done. `/reform-options/`, `/reform-options/costs/`, `/reform-options/social-care/` and `/reform-options/entitlement/`, with a list of the four pages on each. On a phone the old page was 90 screens before R2 and R3. With R2 and R3 the four are 27, 24, 23 and 11, 85 in all, so the split alone saves little length. It gives each page one main question |
| R2 | Slim figure cards | Done. The first sentence of a figure's qualifications is shown open, and the rest is under "More about this figure". The two spending figures had their caveat moved to the front. The card markup was unchanged then. On 1 October 2026 the source note under each card became a description list, a line for each pair, and the costs page grew about 10%: decision 56, confirmed by the owner the same day |
| R3 | Short citations, and the check date once per section. Decision 17 keeps its words | Done in part. Citations show the publisher and date, and keep the title for screen readers. The registers on the sources page keep full titles. The check date moved into "More about this figure". Citing a source once per paragraph was not done: decision 47 |
| R4 | Back-to-contents links, a contents list of `h2` headings that stays in view at 1024 px and wider, and an `id` on every `h3` | Done. A build step in `eleventy.config.js` gives every `h3` an `id` from its words and adds "Back to contents" before each section on a page with a contents list. At 1024 px and wider the list sits in its own column and stays in view, and the back links are hidden |
| R5 | Shorten the overview's news section to a few sentences and a link | Done. Three short paragraphs built from the claims register, and a link to the social care page. Every item it dropped is on another page. The overview went from 15.7 to 10.2 phone screens. `news.json` keeps only its date |
| R6 | Statement headings where a section reports evidence. Needs the owner's reading | Done for seven headings, on the costs and social care pages. Each keeps its topic words and adds the finding its section states. The rest were kept as labels: reference sections, figure cards, and the options, which keep matching labels for neutrality. Six more were kept on purpose. On the costs page, "Differences between men and women" and "Disability and caring" would lose half their subject. On the State Pension page, "What people actually receive" would narrow to one finding. "The cost so far: a difference, not a bill" already states one. On living on a pension, "What retired households spend" could read as saying they need less, and "The Minimum Income Standard, 2026" has its finding in a table only. The owner accepted all seven on 30 September 2026 |
| R7 | Chart message titles and labels worked out from each result, annotations for policy events | Done. Each chart's title is worked out from the result shown. Lines that are the same in every year are drawn as one, with one legend entry. Each line is named at its end. The history chart marks four years by number and lists them under the chart, from a new `annotation` field in `history.json` |
| R8 | Settings in the page address for the rule comparison and the history explorer. Never for the budget tool | Done. Edited yearly figures go in the address too. A link reproduces the result, and values the form does not offer are ignored. The privacy page, the tool note and the sources page say so |
| R9 | Widen the drop-down lists that cut their text. A defect | Done at 1280 px. At 390 px one scenario name is still longer than the screen, so the closed list cuts it. Phones show it in full when the list opens, and the note under the settings repeats it |
| R10 | Put the budget tool's instructions next to the fields they govern | Done. The five instructions are hints on the income, Income Tax and spending fieldsets. "Before you start" stays above the form |

The cut-off last year label on both charts, in F6 of the review, was fixed on its own, apart from R7.

The review's measurements section says visible words "leave out `details` and tables". That is wrong: its figures left out `details` only, and tables were counted. No conclusion of the review depends on it. The review is frozen, so the correction is recorded here, on the owner's decision of 30 September 2026.

Checks run on 30 September 2026 after this work, Chrome 154, macOS:

| Check | Command | Result |
| --- | --- | --- |
| Build checks | `npm run build` | No problems. 14 pages |
| Calculator tests | `npm test` | 25 of 25 pass |
| Automated accessibility | `npm run a11y` | 100 audits of 14 pages. 0 violations, 0 audits with sideways scroll. 1,976 results incomplete: every incomplete contrast result measured, 3,910, none below threshold, lowest 8.81:1 |
| Scripted accessibility measurements | `node scripts/a11y-manual-assist.mjs` | 0 problems |
| Chart label | `getBBox` of every chart label in Chrome | None outside the drawing area on the history and rule comparison charts |
| Drop-down lists | Width of each option against its control in Chrome, 390 and 1280 px | All fit at 1280 px. At 390 px the longest scenario name is wider than the screen |
| Content kept | Every line of the old reform options template compared with the four new ones | 16 lines not found, all changed on purpose: headings, contents lists, three edited sentences |
| Rendered pages | Screenshots in Chrome | First screens of the four reform options pages at 390 and 1280 px, the figure cards on the State Pension and costs pages, the rule card at 390 px, and the history and rule comparison forms |

Checks run on 30 September 2026 after R4 to R8 and R10, Chrome 154, macOS:

| Check | Command | Result |
| --- | --- | --- |
| Build checks | `npm run build` | No problems. 14 pages |
| Calculator tests | `npm test` | 25 of 25 pass |
| Automated accessibility | `npm run a11y` | 100 audits of 14 pages. 0 violations, 0 audits with sideways scroll. 1,994 results incomplete: every incomplete contrast result measured, 4,110, none below threshold, lowest 8.81:1 |
| Scripted accessibility measurements | `node scripts/a11y-manual-assist.mjs` | 0 problems, including no focused control covered |
| Charts | Every scenario of the rule comparison in Chrome, and `getBBox` of every chart label | Each title matched its result. No text outside the drawing area |
| Settings in the address | Both tools in Chrome: settings changed, a figure edited, the address opened in a new page, and two tampered addresses | Results reproduced exactly. Nothing announced or focused on arrival. A choice the lists do not offer is ignored. A typed value that fails the form's own checks shows the form's error and no result. No script errors |
| Rendered pages | Screenshots in Chrome | The contents column at 1024 and 1280 px, back links at 390 px, the overview's news section at 390 px, both charts at 1280 px |

## "On this page" marking, 30 September 2026

Asked for by the owner: the contents list shows which section is being read, while scrolling and after following a link. Decision 53. Merged in pull request 10. It was pushed with `/push uncritiqued`: the second reader's last run came before the final changes to the check script.

| Check | Command | Result |
| --- | --- | --- |
| Behaviour | `npm run a11y:manual` | 0 problems. With the hold on a followed link removed from the built script, 6 problems; with the marking removed, 9 |
| Calculator tests | `npm test` | 25 of 25 pass |
| Automated accessibility | `npm run a11y` | 0 violations. Every incomplete contrast result measured, 4,110, none below threshold |
| Rendered | Screenshots in Chrome | The list at 1400 px in light, dark and forced colours, and at 390 px |

Not checked: a screen reader, a real phone, smooth scrolling.

## Defect 11, 1 October 2026

Merged in pull request 11, from `defect-11-and-research`. Decisions 54 to 57. The outcome of each item is under "Known defects and limits", number 11.

| Check | Command | Result |
| --- | --- | --- |
| Build and registers | `npm run build` | No problems. Section 8 is new. Each of its eight tests was planted against a built page and failed with its own message: a typed region name, a caption with no `id`, `</dt><dd>`, a chart that does not start with its `figcaption`, a note that does not start with a heading, a `nav` with no name, a named section that is not a calculator, a chart named by its title and description |
| Calculator tests | `npm test` | 25 of 25 pass |
| Budget tables | `renderBudget` called in Node | Each of the three regions is named by its caption. These tables are drawn only after a reader submits, so the build check does not see them |
| Automated accessibility | `npm run a11y` | 0 violations. 1,940 incomplete results, the same count as before. Every incomplete contrast result measured, 4,110, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems. The first run found 5. The overview cards drew focus on `::after`, which the checker cannot see: moved back to the link. Citations alone in a `dd` were under 24px: given padding. The "On this page" check scrolled a fixed 4,000 px, shorter than the first section of the costs page once its notes grew: it now scrolls to the second section. With the hold on a followed link made permanent in the built script, the changed step failed on all 9 pages with the list |
| Rendered | Screenshots in Chrome | Figure cards before and after, at 1400 px. Overview cards with keyboard focus at 1400 px light, and at 390 px dark. The situations list at 390 px. The history of the triple lock at 1400 px dark. "Distinctions that matter" before and after |

Not checked: a screen reader, forced colours, a real phone.

The base style for `dt` and `dd` is new. It also changes about 15 description lists that were there before, such as "Distinctions that matter", which used the browser's default indent and normal weight.

## Two items added, 1 October 2026

Decision 58. Records in `research/06-announcement-2026-09-29.md`, section A2 and record `ann-speech`.

| Check | Command | Result |
| --- | --- | --- |
| Passages | `python3 scripts/check-passages.py` | 199 checked, 178 by script and 21 by the browser record. None missing. The three new passages are among those found by script |
| Build and registers | `npm run build` | No problems. 150 claims, 96 sources |
| Automated accessibility | `npm run a11y` | 0 violations. 1,955 incomplete results, 15 more than before, from the new text. Every incomplete contrast result measured, 4,125, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems |
| Rendered | Screenshots in Chrome | The note on the State Pension page at 1400 px, the poll section at 390 px |

The Income Tax commitment rests on the speech as printed by a newspaper. No government document states it. Hansard could not be read: parliament.uk refused automated requests.

## Owner's answers of 1 October 2026

Merged in pull request 12, from `owner-answers-1-oct`, on 1 October 2026.

| Question | Answer | Done |
| --- | --- | --- |
| Decisions 54, 55 and 56 | Confirmed | Recorded in the decision log |
| Decision 57 | Confirmed, with Heydon Pickering's fixes from the cards chapter of Inclusive Components | `src/assets/js/cards.js`: a click anywhere on a card follows its link unless it looks like selecting text. The overlay stays for pages without script. The card shows a focus ring |
| Launch dependency 11 | Say three releases | Reworded |
| Markup conventions in the README | Accepted | Recorded in the README |
| Primary source for a spoken commitment | The best full printing, labelled, replaced if an official text appears | Decision 59 |
| Critique suggestions | Rounding note on the poll, a link from question 10 to the tax note, and the check's scroll: yes. Two more build checks: not asked for | All three done. The behaviour check now scrolls to the second section and at least a window past the first heading |
| "Back to contents" links | Confirm keeping several on a page. The assistant's reading: SC 2.4.4 is met, because each goes to the same place. See "Sources and the rule comparison, 1 October 2026" |
| Launch dependencies 1 to 10 | Later on 1 October 2026, not next | Done on 2 October 2026: decisions 66 to 75 |

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems |
| Calculator tests | `npm test` | 25 of 25 pass |
| Automated accessibility | `npm run a11y` | 0 violations. Every incomplete contrast result measured, 4,125, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems. With the hold on a followed link made permanent in the built script, the changed step failed on all 9 pages with the list |
| Cards | A script in Chrome | A short click on a description opened the page. A 300 ms press, and a drag, did not. A slow drag selected the text and stayed. Without script, a click on a description opened the page. The card had its focus ring with its link focused |
| Rendered | Screenshots in Chrome | The cards with keyboard focus at 1400 px, question 10 at 390 px |

Not checked: touch, a double-click on a card's description, a screen reader, forced colours, a real phone.

## Review points of 1 October 2026

From the critique of pull request 12. Merged in pull request 13, from `review-points-1-oct`, on 1 October 2026. The owner asked for the recommendations to be applied, and chose the fix for W3.

| ID | Point | Done |
| --- | --- | --- |
| W1 | The overlay was removed by the page's general `js` class, so a card lost its overlay if `cards.js` failed to load | Overtaken by W3: the overlay now stays in every case. `cards.js` still marks the list itself, and only the description's pointer cursor depends on that mark |
| W2 | The card's focus ring was a box-shadow, which forced colours do not draw | Now a 3px outline, shown for keyboard focus only (`:has(a:focus-visible)`), on the owner's answer. Seen in Chrome with forced colours emulated. In Chrome, keyboard focus drew it and a mouse click did not |
| W3 | A double-click on a card's description followed the link before it could select a word | Done on the owner's answer. Heydon Pickering's page and the other sources read have no fix for double-click. The description is raised above the overlay, his "raise" idea, and `cards.js` makes a click on it follow the link after 300 ms unless a second click comes. The wait is the one in the option the owner chose. The name and padding follow at once. Without script the description is not a link target |
| W4 | The decision log's header did not say that number 59 refines number 42 | The header now says so |
| `NEXT-SESSION.md` | Edited by hand during the session, against the README | The owner confirmed on 1 October 2026 that only the handoff check writes it |
| W5 | Launch dependency 11 is upkeep, not an owner's decision | Taken off the list on 2 October 2026: decision 76 |

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems |
| Calculator tests | `npm test` | 25 of 25 pass |
| Automated accessibility | `npm run a11y` | 0 violations. Every incomplete contrast result measured, 4,125, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems |
| Cards | A script in Chrome | A single click on the description followed the link after the wait. A double-click selected the word and stayed. A drag selected text and stayed. A click on the padding followed the link in 130 ms. Without script, the padding followed and the description did not. Keyboard focus drew the ring and a mouse click did not |

Not checked: touch, a screen reader, a real phone. Forced colours were emulated, not tested on Windows.

## External audit of 1 October 2026

An AI-assisted factual audit by another tool, of commit `82632cb` (pull request 4), in `~/Documents/Codex/2026-09-30/ver/outputs/pension-explorer-audit.html`. Verified against `main` at pull request 13 and against the sources: all 16 findings were still true. Decision 60. Merged in pull request 14, from `audit-corrections`, on 1 October 2026.

| ID | Finding | Correction |
| --- | --- | --- |
| F01 | Qualifying years for the full basic State Pension gave the men's bands to everyone | Claim `bsp-30-years` gives the bands for men and for women, from GOV.UK |
| F02 | "Workplace or personal pension" was described as a pot | Says defined contribution, and what a defined benefit pension is. No claim on how common each is |
| F03 | "None is paid automatically" | Says some are paid automatically. New claim `wfp-automatic` in the Winter Fuel Payment section |
| F04 | Housing Benefit left out mixed-age couples | Claim `housing-benefit` gives the couple rule. New claim `pc-mixed-age` and source `govuk-pension-credit` |
| F05 | "A means test does not look at rent, disability or care" | Says some allow for what a person has to spend. New claim `care-means-test-allowances` and source `dhsc-care-statutory-guidance`, Annex C, paragraph 49 |
| F06 | 71% and 23% applied to all pensioners | Says recent retirees, as the IFS does. The register's quoted passage now starts with "For recent retirees", the definitions say recent retirees, and the period names the 2023 study |
| F07 to F09 | The rule comparison said what the rules always do | Says what they tend to do. The calculator shows cases where the rules coincide |
| F10 | Attendance Allowance in Northern Ireland was left out | Table row and State Pension page say it is also paid there, with claim packs from the Disability and Carers Service. New claim `aa-northern-ireland` and source `nidirect-attendance-allowance` |
| F11 | Rounding could take an amount below the cash floor | `compareRules` applies the floor after rounding. New test, which failed without the fix |
| F12 | The page promised to clear entries on leaving, but a restored page kept the result | Every showing of the page clears the form and the result. The privacy wording says what the page does |
| F13 | CPI was "the main official measure" | "An official measure". ONS calls CPIH its lead measure |
| F14 | "Every figure used on the site" is in the register | Says headline figures, and that other records exist |
| F15 | "6 April 2027 when they take effect" | Says April 2027 and points to the up-rating order. 6 April 2027 is a Tuesday |
| F16 | The budget helpers changed the period without converting amounts | `toWeekly` in `budget.js` converts entered amounts first and says so |
| Wording | Tax, the 30.2% ratio, "cannot be predicted" | Changed. The full name of a spending category was not checked against its source and is left |

| Check | Command | Result |
| --- | --- | --- |
| Passages | `python3 scripts/check-passages.py` | 204 checked, none missing, including the new and changed ones. Re-run after the A points |
| Build | `npm run build` | No problems. 154 claims, 99 sources |
| Calculator tests | `npm test` | 26 of 26 pass. Without the F11 fix, the new test fails |
| Automated accessibility | `npm run a11y` | 0 violations. Every incomplete contrast result measured, 4,137, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems |
| Budget tool | A script in Chrome | A monthly £1,000 became £230.77 a week when the pension helper ran, and the status said so. A yearly £5,200 became £100.00 when a budget loaded. A restored-page event cleared the result; with the old code the result kept the amounts. An ordinary page show also clears it |

Not checked: a real restore from the browser's back-forward cache (headless Chrome reloaded the page instead), and the audit's register of 271 items, which was not supplied.

The critique of the corrections raised ten smaller points, A1 to A10, put to the owner the same day. Applied on the owner's answer: each claim's quoted passage now covers every fact it states (A1), the richest-fifth figure has a passage (A2), the year of the earnings ratio comes from the register (A3), the budget tool's conversion note names only conversions that stay (A4), and the Pension Credit couple rule sits before the take-up paragraph (A10). A5 needed no change: the triple lock page makes no promise about reloading. A7, applying the cash floor after rounding in the history explorer too, was declined on the owner's answer, and the reason is beside the code in `uprating.js`. A6, A8 and A9 are deferred, in the table below.

## Sources and the rule comparison, 1 October 2026

Asked for by the owner. Merged in pull request 15, from `compare-page-and-sources`, on 1 October 2026. Decisions 61 and 62.

- **Sources** are drawn as chips, so they read apart from the sentence: decision 61.
- **The rule comparison** has its own page, `/reform-options/compare/`. Its result redraws as the figures change, and a summary of each rule's amount stays in view: decision 62.
- **"Back to contents" links.** The owner asked whether several on one page break the guideline on link text. They do not, in the assistant's reading. SC 2.4.4 asks that a link's purpose be clear from its text or context, and every one goes to the same place. The cost is repetition in a screen reader's list of links, below 1024 px only. Kept as they are, on the assistant's recommendation. Not yet confirmed by the owner.

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems. 15 pages |
| Calculator tests | `npm test` | 26 of 26 pass |
| Automated accessibility | `npm run a11y` | 0 violations in 106 audits of 15 pages. Every incomplete contrast result measured, 4,027, none below threshold. The two states of the rule comparison now run on its new page |
| Behaviour | `npm run a11y:manual` | 0 problems. The first run found three: a link in the pinned summary under 24 px, which also read as focus moving backwards because the summary is fixed, and a site map link under 24 px. The summary link was removed and the site map line follows the others. After the review, a 320 px run found the page 20 px too wide: the form in a grid column could not shrink, and the summary's four columns did not fit. Both fixed |
| Rule comparison | A script in Chrome | A new starting amount changed the summary at 1400 and 390 px, wrote the address and announced "Result updated." A link to the old page with settings opened the new page with them. The options page without settings stayed |
| Rendered | Screenshots in Chrome | Chips at 390 px light and dark and at 1400 px. The comparison at 1400 px, summary beside the form, and at 390 px, pinned summary about a fifth of the screen |

The critique of this work (Sonnet 5.5) found a real fault: typing a new number of years left the rows at the old count, so a copied link lost its figures. The rows now redraw as the number is typed. Also fixed after it: the bar's styles were written for wide screens first, against the house rule, and are now mobile-first; the bar pins only on a screen at least 32rem tall, so at 400% zoom it follows the form; it no longer scrolls inside itself; the summary carries the "Hypothetical" label; the scenario sources use `m.ref`; the "No result" block is a note; "The other scenarios" is "The scenarios"; and an old link to the assumptions is sent on. Three points were not applied and wait on the owner, in the table below.

Not checked: a screen reader, a real phone, touch, an on-screen keyboard.

## Asset caching, 1 October 2026

After pull request 15 was merged, the owner found the rule comparison on the deployed preview not updating when the inputs changed. The owner then ran a deploy without the cache, and it worked. The likely cause, not proven: `netlify.toml` let browsers reuse anything under `/assets/` for an hour without asking, and the file names do not change between versions, so a browser could run the old `compare.js`, which waits for a button the new page no longer has. A Netlify deploy without cache clears the build cache, not a browser's copy, so that deploy may not be what fixed it.

The rule now makes a browser check with the server before reusing a file (`max-age=0, must-revalidate`, which is also Netlify's default for files that are not fingerprinted). A browser that cached a file under the old rule can still keep it for up to an hour after this is deployed. On the branch `summary-differences`, with decision 63; merged in pull request 16 on 1 October 2026. Not checked on the deployed site: that needs the sign-in, and the header is set by Netlify, not by the local server.

## The saving in the rule comparison, 1 October 2026

The owner noted that the comparison did not seem to save any money. It did, but the summary listed five amounts with no gap shown, for one person. Decision 63: the summary now gives each rule's gap from the triple lock, and a paragraph after it gives the number of people receiving the State Pension (13.3 million in March 2026; the DWP forecast for 2030/31) and the average new State Pension, with a link to what a change would save. The tool does not multiply them. On the branch `summary-differences`, with the asset caching change; merged in pull request 16 on 1 October 2026.

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems |
| Calculator tests | `npm test` | 28 of 28 pass. A new test of the summary's gap failed on the first version of its index rounding |
| Automated accessibility | `npm run a11y` | 0 violations. Every incomplete contrast result measured, 4,031, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems |
| Rendered | Screenshots in Chrome | The summary at 1400 and 390 px. The pinned summary is now about 235 px on a phone, so the page's padding at the foot went from 14rem to 16rem |

A sentence first written as "Most get less than the full rate" was changed to the sourced average, because the share on the full rate is a known gap (number 4 under "Known defects and limits"). After the critique (Sonnet 5.5), the gap says "than the triple lock" to screen readers, and the triple lock's row says "for comparison".

## Front-end sweep, 1 October 2026

An axe baseline of every page, then the markup (`html-engineering`), then the styles (`css-engineering`), then the same axe run again to compare. Merged in pull request 17 on 1 October 2026. The runners and saved results are in `frontend-sweep/`, which `.gitignore` leaves out, on the owner's decision of 2 October 2026.

What changed, file by file:

| File | Change | Finding |
| --- | --- | --- |
| `src/assets/js/tools/budget.js` | The details of a loaded example budget were run-on "Label: value" lines in a `ul`, two pairs on one line. Now a `dl`, a pair each for prices, area, housing, left out and source. The text before it is paragraphs | W1 |
| `src/assets/js/tools/compare.js` | A `ResizeObserver` writes the pinned summary's height to `--summary-size` | C1, decision 65 |
| `src/assets/css/main.css` | The padding and scroll padding under the pinned summary are `var(--summary-size, 16rem)`. The comment said "two rules to a row"; it is one | C1, C4 |

No template changed. The page map of the built output is identical before and after; W1 is markup the browser draws when an example is loaded.

| Check | Command | Before | After |
| --- | --- | --- | --- |
| Automated accessibility | `node frontend-sweep/run.mjs`: axe-core 4.11.4, Chrome 154, 15 pages at 320, 768 and 1280 px, at rest, reduced motion and dark, 135 audits | 0 violations, 2,712 incomplete | 0 violations, 2,712 incomplete. Nothing new, nothing fixed |
| Incomplete contrast | `node frontend-sweep/measure.mjs after` | | All 2,712 measured, none below threshold, lowest 8.81:1. All are table cells cut off by the scrolling wrappers |
| Project's own checks | `npm run a11y`, `npm run a11y:manual` | | 0 violations, 4,031 incomplete measured, none below threshold; 0 problems. Its `tool3-preset-result` state loads an example budget, so it is the axe run that covers W1: 0 violations at 390 and 1280 |
| Validator | `npx html-validate "_site/**/*.html"` | 103 | 103, the same rules. Left as they are: `prefer-native-element` on the 35 scroll regions, as the README says; trailing whitespace 45, `doctype-style` 15 and `long-title` 7, which are style, not markup; `wcag/h32` on the comparison form, which has no submit button because it updates as it changes (decision 62) |
| Calculator tests | `npm test` | 28 of 28 | 28 of 28 |
| Screenshots | Every page at 3 widths | | Only the comparison page differs, at 320 and 768, by the padding under the summary |
| Focus not obscured | Tab through the comparison, 1.4.12 text spacing | 320x568: 15 of 42 stops fully hidden, footer 141 px under | 320x568 and 320x512: none fully hidden, footer clear |

Checked by hand or by script, not by axe: focus visible on every focusable element on every page, light and dark, 3:1 or better; no tab index above 0 and no reordered layout; no images, dragging or content shown on hover; error messages name the field and say how to fix it; there is no animation, so reduced motion has nothing to stop. Not checked: Safari, Firefox, forced colours, a screen reader, a real phone.

Items left open are in "Waiting on the owner", each marked with its step and finding. Critique: a second reader (Sonnet 5.5) found two weak points, R1 and R2 below.

## Launch dependencies, 2 October 2026

Gone through one by one with the owner, with options and recommendations. Decisions 66 to 76. The record of each is in `docs/launch-dependencies.md`, in its last column.

| No. | Decided |
| --- | --- |
| 1 | Name: "UK State Pension Explorer" |
| 2 | Domain: `ukstatepensionexplorer.org`, registered through Netlify the same day. Not attached to the project |
| 3 | Netlify split by deploy context, so previews keep the sign-in. Needs build work |
| 4 | Corrections and barriers by GitHub issue, for launch. The repository goes public first. Against the assistant's recommendation of email, because an issue needs an account |
| 5 | Owner: Anthony George, `Person` |
| 6 | Reviewer: the owner, for launch |
| 7 | AI crawlers: `allow`. Against the assistant's recommendation of `refuse-training` |
| 8 | The owner's own accessibility round before launch; NVDA and user sessions after. Statement stays "incomplete" |
| 9 | Cloudflare Web Analytics at launch, in the build work of item 3 |
| 10 | The owner reviews every source. Blank triggers filled and dated triggers made ToneBan tickets |
| 11 | Taken off the list: upkeep, already in `docs/maintenance.md` (W5) |

Checks made while deciding: WHOIS for three `.org` names (all "Domain not found"; the `.uk` names gave no answer either way); Cloudflare's Web Analytics FAQ on query strings; `src/_data/site.js` for what the production guard needs; a word count of `main` in the built pages, about 58,000 words in 14 of them; `src/_data/figures.json`, 51 of 124 figures with no `next_review`. No code was changed.

## Launch preparation, 2 October 2026

On the owner's go of the same day, on the branch `launch-prep`, not pushed.

**History check, decision 69.** 81 commits, every branch. No scanner is installed, so the history was searched by pattern: secret and token shapes, private keys, `password` and `secret` assignments, and the values in the local `.env`. Nothing secret was found. `.env` was never committed, and holds no secret. The `BASIC_AUTH` value was not searched for, because reading it from Netlify would put it in the session. Never committed and never in `_site`: `.env`, `.preview-password`, `scripts/seed/`. What a public repository would show: the author email `legendarytone@gmail.com` on every commit; three lines with the path `/Users/anthonygeorge/Projects/...` in `research/00-sibling-inspection.md` and `NEXT-SESSION.md`; `_archive/`, which holds the two scope documents; and the handover and decision log as they are. No session links. UK Migration Explorer's repository is public.

**Review triggers, decision 75.** The 51 figures with no `next_review` now have one: each April for rules, a single study until newer work replaces it, or the date of the next edition where `docs/maintenance.md` gives one. Three Office for Budget Responsibility figures cite the July 2025 report although a July 2026 edition is in the registers; their trigger says to check it. The ToneBan tickets are not added: ToneBan has no project for this site.

**Context split and analytics, decisions 68 and 74.** The changes:

| File | Change |
| --- | --- |
| `netlify.toml` | No `X-Robots-Tag` header. `[context.production.environment]` holds `SITE_ENV = "preview"`, the launch switch. The Content Security Policy allows the Cloudflare script and its endpoint |
| `src/_headers.njk` and its data file | Written for every build that is not production: `X-Robots-Tag: noindex`, and the sign-in when `BASIC_AUTH` is set |
| `src/_data/site.js` | A production build on Netlify outside the production context stops. Outside production the canonical is the deploy's own address even when `SITE_URL` is set. `analyticsToken`, the Cloudflare token the owner supplied on 2 October 2026, in production only |
| `scripts/check-build.mjs` | A build that is not production fails without `noindex` in `_headers` |
| `src/_includes/base.njk`, `src/privacy.njk` | The Cloudflare script, and the privacy wording for it, in production builds only. The token was typed into `site.js` on 2 October 2026, after these checks: see below |

| Check | Command | Result |
| --- | --- | --- |
| Contexts | Builds with Netlify's variables set by hand | Production in a deploy preview context: stopped. Production context with every launch variable and a token: passes, the script and token in the page, the privacy wording shown, no `_headers`, no `noindex`, canonical on the domain. Without the token: no script, "This site has no analytics". Deploy preview with `SITE_URL` set: canonical on the deploy's address, no script, `_headers` with `noindex` and the sign-in. Branch deploy with no `BASIC_AUTH`: stopped. Production with `BASIC_AUTH`: stopped |
| Build check | Planted defects | `noindex` removed from a built `_headers`: failed with its message. `X-Robots-Tag` put back in `netlify.toml` with a production build: failed with its message |
| Build | `npm run build` | No problems |
| Calculator tests | `npm test` | 28 of 28 pass |
| Automated accessibility | `npm run a11y` | 0 violations in 106 audits of 15 pages. Every incomplete contrast result measured, 4,031, none below threshold. These run on a development build, so the privacy wording for a set token was not audited |
| Behaviour | `npm run a11y:manual` | 0 problems |

After the owner supplied the Cloudflare token, the script became the dashboard's own form, `type="module"`, and the token moved into `site.js`, as on UK Public Finances. Run again then: a production context build passes with the script and token in the page and the Cloudflare wording on the privacy page; a deploy preview build passes with no Cloudflare reference anywhere in `_site` and the preview wording; `npm run build` and `npm test`, 28 of 28. The beacon answers with `access-control-allow-origin: *`, which a module script loaded from another site needs.

Not checked: anything on Netlify. Whether Netlify applies `_headers` and `netlify.toml` headers together as expected needs a deploy preview, which needs a push. What the Cloudflare beacon sends needs the live site.

## Sources on their own line, 2 October 2026

Asked for by the owner, who found the source chips of decision 61 still clumsy. Decision 77. On the branch `sources-own-line`, from `launch-prep`, not pushed.

- `.ref` is a line of its own under the sentence: small, muted, no border. Its links are padded to at least 24 px, and a date in a source does not break.
- `m.more`, drawn by `.onward`, puts a link onward on a line of its own, "More: …". Used in the overview's short entries: the situations list and the two notes on the April 2030 rule, the four places where a source ran straight into a link.

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems |
| Calculator tests | `npm test` | 28 of 28 pass |
| Automated accessibility | `npm run a11y` | 0 violations. Every incomplete contrast result measured, 4,031, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems |
| Source and onward link height | A script in Chrome, 11 pages at 320, 390 and 1280 px | Before the padding, 6 at 390 px and 10 at 1280 px were under 24 px and too close to another link for the spacing exception. After it, none under 24 px: lowest 24.8 px |
| Rendered | Screenshots in Chrome | The situations list at 390 px light and 1280 px dark, a source in a list item and in a paragraph, a source with a date, and a source link with keyboard focus. The focus ring first covered the line above; the space above a source was raised from 0.15rem to 0.45rem |

Not checked: a screen reader, a real phone, forced colours. The checker's count of inline links still counts a source link as inline, because its line holds other text; the height script above is what shows they meet 24 px.

## Tools on their own pages, 2 October 2026

Asked for by the owner: take the tools out into their own sections, as on UK Public Finances, and keep their results from being lost below the fold. Decision 78. On the branch `tools-section`, from `sources-own-line`, not pushed.

- `/tools/` lists the four tools, and "Tools" is in the main menu. `/tools/triple-lock/`, `/tools/history/` and `/tools/budget/` are new. The rule comparison stays at `/reform-options/compare/`.
- Each tool works like the rule comparison: the result follows the form 400 ms after the last change, and an "At a glance" summary stays in view. The shared parts are `live` and `pinSummary` in `common.js`, and `.tool-layout` and `.tool-summary` in the stylesheet, renamed from the comparison's own classes.
- The triple lock, history and living on a pension pages keep their headings and a short pointer where the tool was, so links to `#tool`, `#explorer` and `#budget` still land.
- Form fields sit in two columns only where each column is at least 20rem, so the lists in a tool's narrower form column are not cut.

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems. 19 pages |
| Calculator tests | `npm test` | 28 of 28 pass |
| Automated accessibility | `npm run a11y` | 0 violations in 130 audits of 19 pages, the tool states on their new pages. Every incomplete contrast result measured, 3,686, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems on 19 pages, including no focused control covered by a pinned summary |
| Tools in Chrome | A script, at 390 and 1280 px | Triple lock: the summary shows the published decision on arrival; typing 9 in prices gave "9.0% increase, decided by prices", £250.95, labelled hypothetical; loading 2022/23 gave 3.1%. History: a new pension and a rule redrew the summary and wrote the address; a first year after the last showed the error and kept the result. Budget: empty until an amount is typed; £241.30 gave £241.30 left over; a loaded example gave a shortfall of £169.19; clearing emptied both and the address stayed empty. No script errors |
| Rendered | Screenshots | The three tools at 390 px with the summary pinned to the foot, and at 1280 px with it beside the form |

Known limit: at 1024 px and wider the closed "Example budget" list on the budget explorer cuts its longest names, because the form column is narrower than the full width it had. The open list shows each name in full, and the note after loading repeats it, as on a phone since R9.

Not done: an address with history explorer settings on `/history/` is not sent on to `/tools/history/`, as `moved.js` does for the rule comparison. Nothing is published, so no such link is known outside previews.

Not checked: a screen reader, a real phone, forced colours. Whether announcing "Result updated." 400 ms after each pause in typing is too frequent for a screen reader user needs a person.

## Form spacing on the tools, 2 October 2026

Asked for by the owner: inputs and the text around them were too close together on the tools pages. One set of rules in `main.css`, under "Form rhythm", for every form. A label and its hint read as one unit, 0.2rem apart. The control sits 0.5rem below them. Each part of a fieldset is 1rem from the next, and fields are 1.5rem apart. A hint that belongs to a button or a checkbox sits 0.5rem below it. A group of fields adds no margin of its own inside a fieldset, so every fieldset ends 1rem below its last item: measured 17 px on each fieldset of the triple lock and budget forms. Before, an input touched the hint above it, a button touched the text after it, and fieldsets ending in a group of fields were twice as deep at the foot.

Left as it is: hints written directly in a fieldset, such as "Enter income before tax", are body size and colour, while hints under a field are smaller and grey. Styling them all as hints would make those instructions quieter, which is a choice about emphasis, not spacing.

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems |
| Calculator tests | `npm test` | 28 of 28 pass |
| Automated accessibility | `npm run a11y` | 0 violations in 130 audits. Every incomplete contrast result measured, 3,687, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems, including text spacing |
| Rendered | Screenshots, before and after | Every fieldset of the budget explorer at 390 px with an example loaded; the triple lock form at 1280 px; the rule comparison and history forms at 390 px |

## "Updated" in the tool summaries, 2 October 2026

Asked for by the owner: on the history explorer the chart below the form changes and is easy to miss. After any change, each tool's "At a glance" summary now ends with an "Updated" label and a sentence: "The chart and table below have changed too" on the history explorer, "The chart and tables below" on the rule comparison, "The full result below" on the triple lock calculator, "The full breakdown below" on the budget explorer. It is not shown on arrival. Screen readers hear the same sentence in the status message, including after loading a past decision or an example budget, filling in the pension, and resetting the comparison. A redraw now happens only when a value differs from the last one, so typing a figure and then leaving the field is announced once. On the history explorer, choosing a first year after the last keeps the summary of the result still shown and adds the error under it. On the branch `tools-section`, not pushed. No decision number: it follows decision 78. Text only, because the pinned summary holds nothing that takes focus (a link there was removed on 1 October 2026), and not a pop-up or a flash, which can be missed or gone before it is read.

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | No problems |
| Calculator tests | `npm test` | 28 of 28 pass |
| Automated accessibility | `npm run a11y` | 0 violations in 130 audits. 1,885 incomplete results; every incomplete contrast result measured, 3,690, none below threshold |
| Behaviour | `npm run a11y:manual` | 0 problems, including no focused control covered by the taller pinned summary at its default text spacing |
| Tools in Chrome | A script at 390 px | All four: no note on arrival, then the note in the summary after a change. The status message read back on each path: a change, a loaded decision, a loaded example, the pension helper, the comparison's reset. One announcement for a change followed by Tab on the history explorer; none for Tab with nothing new on the triple lock calculator. No script errors |
| Rendered | Screenshots | Summaries with the note: history at 390 and 1280 px, triple lock, budget and comparison at 390 px |
| Pinned height | Text spacing of SC 1.4.12 at 320 x 512, comparison after a change | 478 px of 512. It was 396 px without the note: see R2 under "Waiting on the owner" |

Not checked: a screen reader, a real phone. The note is the same after every change, so a second change looks like the first.

## Waiting on the owner

As at 2 October 2026.

| Item | What is needed |
| --- | --- |
| The deployed site | Netlify builds `main` after every merge, and each build on 30 September 2026 was ready. `netlify api listSiteDeploys` shows the latest. The main address answered 401 with `WWW-Authenticate: Basic`. Nobody has looked at the pages past the sign-in. Doing so needs the sign-in, which the owner enters |
| Launch: the owner's own steps | Attach `ukstatepensionexplorer.org` to the Netlify project at launch (decision 67); registered on 2 October 2026, and on that day the project had no custom domain and the name gave no DNS answer. Review every page (71). The accessibility round (73). Scope `BASIC_AUTH` to previews in Netlify, when the build work of decision 68 is ready |
| Launch: `launch-prep` | Built and checked locally: see "Launch preparation, 2 October 2026". Needs a push, then a look at its deploy preview. The launch steps are in `docs/launch-dependencies.md` |
| Launch: ToneBan tickets | Decision 75. ToneBan has no project for this site. Create one, or name the project the tickets go under |
| Launch: repository public | Decision 69. History checked: nothing secret. The owner decides whether the email, the home paths and `_archive/` may be public, then makes it public |
| A6, deferred | Add the expected values of the new cash-floor test, 241.32 pounds at minus 1%, to `scripts/reference.py` and `docs/reference-calculations.md` |
| A8, deferred | The register sentence on the method page says "headline figures". Name every kind of record instead |
| A9, deferred | The 71% and 23% figures have the basis "individual", but the underlying 2023 study counted households. Check the study, then align the basis |
| Tools: while typing | A half-typed figure, such as "-", replaces the result and the summary with "Not available" after 400 ms. Since decision 78 this applies to all four tools, not only the rule comparison. The alternative keeps the last result, marked out of date, until the figure is valid |
| Rule comparison: phone keyboard | The pinned summary and an on-screen keyboard share a small screen. The alternative shrinks the summary to one line while a field has focus. Not tested on a real phone |
| Rule comparison: typed figures | The page types "10p a week at most" and "2.5%" in its text. Under the README rule they would come from the registers |
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
| Sweep, critique, R1 | The CSS comment above the pinned summary does not say that `pinSummary` in `common.js` sets `--summary-size`, or that 16rem is the fallback. One clause |
| Sweep, critique, R2 | With text spacing at 320x512 the pinned summary of the comparison was 396 px, leaving 116 px; since the "Updated" note of 2 October 2026 it is 478 px after a change, leaving 34 px. No focus stop was fully hidden on 1 October; not re-measured with the note. The observer could unpin the summary when it passes half the screen. Changes when decision 62 pins it; overlaps "phone keyboard" above |

## Tracked separately

| Item | Status |
| --- | --- |
| Reciprocal links on UK Public Finances Explorer and UK Migration Explorer | Not started. Needs a live domain. No other repository was changed |
| Deployed checks | Done for the deploy preview of pull request 1. See "Checks on the deployed preview". Not done for pull requests 2 to 13, for the main site address beyond the sign-in, or for a production domain |
| Search console | Not started. Needs account and domain access |

## Found in passing

- UK Public Finances Explorer shows State Pension spending of £146 billion as a 2025-26 forecast graded "official". Its own backlog calls the file stale. This site did not reuse it.
- Port 8081 on this computer was in use by another process. This project uses 8137.
- A hook reported that `~/.claude/settings.json` changed at 09:57 on 29 September. No command in this build touched it.
