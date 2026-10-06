# Pre-launch review, 5 October 2026

The last review before launch, asked for by the owner on 5 October 2026. The owner wants to launch the same day if possible.

This file records what was checked, how, and what was found. It holds no list of things to do. The steps to launch are in `docs/launch-dependencies.md`, "Launch steps". Anything that waits on the owner is in `docs/HANDOVER.md`, "Waiting on the owner". This file is a record. It is not edited after the review ends.

Branch: `pre-launch-review`, from `main` at `22b3934`.

## The result in short

The site was not ready to launch as it stood on the morning of 5 October 2026. Four things would have damaged trust:

1. **The site said the government had published no costing method for the rule announced for April 2030. It had.** The Department for Work and Pensions published an analysis on the day of the announcement. It gives the baseline, the coverage and the prices of the two savings figures. The site's search of 30 September 2026 missed it. Six pages repeated the error.
2. **The rule comparison could freeze the page.** When every rule gave almost the same amount, the chart's code looped without end. A starting amount of £250 with prices and earnings both at 4.0%, in buying power, did it. A link could carry those settings.
3. **A comma typed as a decimal mark was read as thousands.** "241,30" became £24,130, without a message.
4. **The accessibility statement would have called itself a preview after launch**, and would have gone on saying that no person had tested with a screen reader after the owner had.

All four are corrected on the branch, with the smaller findings below. The data held up well: about 180 figures and claims, and every amount in the example budgets and the history of rates, were checked against sources fetched on the day, and no figure had a wrong value.

What the review could not do is in "Not checked".

## How the review was run

- The critique skill, in its refine mode. The second reader was Opus 5.5, with no tools, on the calculator code, the build gates and the two statements: one turn, cost $1.65.
- Seven reviewers with a fresh context and no edit rights. Five checked figures and claims against their live sources. One tested the calculators and the build code. One looked at pages as rendered.
- The project's own checks: tests, build checks, the two source checks, the two accessibility scripts.
- A production build in a scratch directory, read by hand.
- Each finding was checked again by the assistant before a change: the quote in the fetched source, or the defect reproduced.

The owner's answers of 5 October 2026: launch today if possible; fix the deferred items that touch precision, trust or accessibility; keep decision 84; the owner signs in so that the deployed preview can be checked.

A session limit stopped the work for part of the day. Three reviewers were cut off and resumed with narrower briefs.

## Checks and results

| Check | How | Result |
| --- | --- | --- |
| Calculator tests | `npm test` | 31 of 31 pass |
| Build checks | `npm run build` | No problems. 19 pages, 126 figures, 158 claims, 104 sources |
| Quoted passages | `python3 scripts/check-passages.py`, after the changes | 210 checked. 189 found by the script, 21 found in a browser by hand on an earlier day, 0 not found, 0 unreadable. 74 register entries carry no quoted passage |
| Figures with no quoted passage | `python3 scripts/check-values.py` | 53 of 65 found in the source text. The other 12 are in spreadsheets. Three reviewers opened those spreadsheets and matched all 12 |
| Automated accessibility | `npm run a11y` | 0 violations in 130 audits of 19 pages, 1,983 incomplete. Every incomplete contrast result measured, 3,867, none below threshold |
| Scripted accessibility measurements | `npm run a11y:manual` | 0 problems |
| Reference calculations | `python3 scripts/reference.py` against the recorded output | Identical, apart from the new section 8 |
| Launch gate | `src/_data/site.js` loaded with production settings | Passes with the right values. Stops on a wrong domain, a correction route of "tbc", a review date in the future, and an accessibility date that differs from the statement's |
| Production build | `npm run build` with production settings, which ran the build check in production mode with no problems, and a second copy in a scratch directory read by hand | 18 addresses in the sitemap, the 404 page `noindex`, canonicals on the registered domain, no preview banner, the analytics script on all 19 pages, an empty `_headers`, no local address, the publisher in the structured data |
| The old chart code on the input that froze | The chart module from `main`, run for 5 seconds | Still running after 5 seconds. The corrected code returns in 21 ms |
| Bills before Parliament | The UK Parliament's bills service, searched for "pension", "triple lock", "up-rating" and "social security" | No Bill on the change |

## What the reviewers checked against sources

| Scope | Checked | Result |
| --- | --- | --- |
| The State Pension page | 34 figures, 28 claims, two tables | No error. 6 points of precision |
| The history of rates, the triple lock page, the overview | All 17 years of `history.json`: rates, dates, increases, the prices and earnings figures, the price index. 35 claims. The State Pension age table | No wrong value. 1 wrong label and 4 points of precision |
| Living on a pension, and the budget explorer's data | 24 figures, 8 claims, 60 table cells, 90 example-budget amounts | No wrong value. 2 errors of description and 13 points of precision |
| The costs page and the scenarios | 49 figures, 4 tables, 7 claims, 6 scenarios | No wrong value. 10 errors, 7 of them from the missed analysis |
| Reform options, entitlement, social care, and the news since 30 September | 78 claims about what a named body said | 2 errors and 8 points of precision. 11 sentences out of date |
| The calculators and the build code | Every rounding of 35 million pairs of amount and rate. 20,000 random paths through all five rules. 2,865 history views. Tampered addresses in a browser. 24 launch settings | 4 errors and 13 weaker points. No wrong calculation |

## Findings corrected on the branch

**The April 2030 rule and its savings**

- A source record for the department's analysis. The two savings figures now cite it: cash, Great Britain, 2039 to 2040 and 2049 to 2050, measured against keeping the triple lock, direct spending only.
- Two new figures: the same savings in 2025 to 2026 prices, £11 billion and £30 billion.
- The costs page no longer says the figures cannot be checked. It says they can be read but not reproduced, because the department does not give the paths of earnings and prices it assumed. In 2025 to 2026 prices the figure for 2049 to 2050 is inside the Institute for Fiscal Studies' range, not above it.
- The claim "we found no Bill, no technical note and no costing method" now says what is still true: no Bill, no measure of earnings, no assumed paths.
- The note "In the news" and the social care page are dated 5 October 2026.

**Responses to the announcement**

- Age UK's and the Liberal Democrats' statements now cite the organisations' own sites. The speech cites the Labour Party's text, not a newspaper's printing of it.
- The Conservative leader was reported the next day as saying the triple lock is her party's policy. The site said she had not said. A second claim now records it, as reported.
- The Pensions Policy Institute "notes the argument that" the triple lock helps today's workers more. The site had recorded it as the Institute's finding.
- A proposal of 2018 is now dated. A sentence beginning "It argues" now names the Institute for Fiscal Studies.

**The calculators**

- The chart's tick loop counts in whole steps, and nearly equal values get an axis. A new test draws the chart for the inputs that froze.
- A comma is accepted between thousands only.
- The triple lock calculator showed the amount before rounding to 4 places, which could show a half that then rounded down. It now shows all 5 places, worked in whole numbers.
- The budget explorer said "Income and spending are equal" when the balance after tax was nil. An emptied field kept its error. A shortfall and a surplus of the same size could print different weekly amounts.
- A half-typed figure keeps the last result, marked "Out of date": decision 85.
- Two methods that Safari before 15.4 does not have are replaced.
- The downloadable file of rates took its last year from a typed value. It now follows the data.

**The launch gates**: decision 86.

**The accessibility statement**: "This is a preview" shows outside production only. The dates of the tests are those of the last run.

**History**: the 8.3% earnings figure for 2022/23 was published but not used in the decision. Both tables and the calculator now say "(not used)", and the column is headed "at the time".

**Living on a pension**: eating out is in the food line of every example budget, and the form said to put it under social activities. One rent was cited to the wrong table. Thirteen sentences made more exact.

**The State Pension page**: six precisions, among them that the Finance Act 2026 extends the fixed allowance by three years, not four.

**Deferred items closed**: A6, A8, K1, the budget explorer's status message, the half-typed figure.

## The critique of the changes

The owner asked whether a critique had run. One had, on part of the project before any change. No second reader had read the changes. So a second critique ran on the uncommitted work: the assistant read its own diff, and Opus 5.5 read the changed code in full and the other changes as a diff. One turn, cost $1.77.

The assistant's own reading found two things: a comment left above the wrong function, and a review-date check that could refuse today's date for an hour after midnight. The second reader found nine more that were false or broken, and each was traced and corrected:

- The social care page said its party statements came from news reports of 29 September. One now comes from 30 September.
- The same page was dated 5 October 2026 while it leaves out statements published since 30 September. It now says so.
- The four savings figures were to be reviewed "when the government publishes its method". The method is published. The trigger is now the paths of earnings and prices.
- The README said all four tools use the "Out of date" note. Three do.
- The triple lock calculator labelled a published decision "Hypothetical" while it was marked out of date, and could mark a "Not available" block as the last result.
- "The rules vary by area" for Council Tax Reduction was left unqualified on a site for pensioners. A second claim now cites the regulation that sets pensioners' rules for England.
- The page and the register described the same incomes two ways. Both now say after Council Tax and after housing costs.
- The review-date check accepted tomorrow and 30 February. It now needs a real date, not after today in the UK.

Also corrected from it: "no guarantee" removed from a reported statement, because the quoted words do not say it; the passages of the four savings figures are now the table cells, so the passage check finds the amounts themselves; an inference about recipients abroad reworded as the fact behind it; a test that no longer tested what its name said; an entry in the accessibility statement for the "Out of date" note, which no automated rule scanned; and the source of the Budget date.

Left open from it: the launch gate holds the domain in two places, the code and Netlify (decision 86, for the owner). The reader also raised, as the first critique did, that a launch today sets a review date before the review.

## The rendered check

A reviewer drove Chrome over the built site and looked at the screenshots. It found no error.

- The "Out of date" note appears at the top of the summary and of the full result in the triple lock calculator, the budget explorer and the rule comparison, at both widths. It goes when the figure is valid again. The pinned summary never covered the field being typed into.
- The input that froze the rule comparison now draws in all three measures, with axis labels that differ.
- The budget explorer's summary: the owner's steps, and 268 scripted steps at four screen sizes, with the summary compared with the full result after each. It never failed to update. The freeze the owner saw was not reproduced.
- A scan of all 19 pages found no "undefined", "NaN", "null", doubled word, empty section or dead in-page link.

Corrected from it: a sentence on the social care page that said "the Institute" before naming it; a source line on the overview that read "Department for Work and Pensions, and Department for Work and Pensions"; an error message that wrote "state pension" in lower case; trailing noughts on the amount before rounding; and dates in the table of rates that broke over three lines.

Left as it found them, none an error: see "Rendered pages" in `docs/HANDOVER.md`, "Waiting on the owner".

## Findings not corrected

| Finding | Why |
| --- | --- |
| New since 30 September 2026 and not on the site: the Institute for Fiscal Studies' analysis of 30 September (`ifs.org.uk/articles/savings-triple-lock-reform-could-be-large-will-not-be-able-fund-social-care`); the department's projection of pensioner poverty, in the analysis now cited; the Scottish Government's letter of 1 October (`gov.scot/publications/deputy-first-minister-letter-to-finance-and-public-administration-committee/`); the Scottish National Party's statement of 2 October (`snp.org/the-great-scottish-pensions-robbery/`); the pensions minister's article of 2 October (`torstenbell.substack.com/p/the-future-of-the-triple-lock`); a workforce plan promised on 30 September (`gov.uk/government/news/support-for-families-and-babies-rolled-out-to-all-family-hubs`); two changes to the care commission's terms of reference on 1 October | Each needs a source record and claims, and a choice by the owner of what belongs on the site. None makes a sentence on the site false |
| The Health Foundation's and the King's Fund's own statements (`health.org.uk/media-office/press-releases/the-health-foundation-responds-to-prime-minister-andy-burnhams-labour-party-conference-speech`, `kingsfund.org.uk/insight-and-analysis/press-releases/pm-lpc-speech-scr`) | Both sites answered 403 to the assistant. A reviewer read both in a browser and found the quoted words |
| Launching with a review date and an accessibility date set, before the owner's review and accessibility round | The owner's decision. The build cannot tell whether a review took place |
| Reporting a problem needs a GitHub account | The owner's decision 69. An email address beside it would help |
| The Cloudflare script is loaded with `type="module"`, not `defer` | Declined. A reviewer fetched the script: it is served with open cross-origin access and finds its token either way. The check on the live site settles it |
| ".5" is refused in a figure field | Not done. No wrong number |
| A tool whose script fails to load shows its form and nothing else | Not done. Needs a ready mark per tool |
| No test for the fields' range limits, or for a history range that starts after the first year | Not done. A reviewer ran all 2,865 combinations by hand and they hold |
| Six unused filters and two unused exports | Not done |
| "Up to 25p a week in 20,000 random paths" in the specification has no test | Declined. A dated record of a trial in an internal document |
| Four stand-alone links about 21 px tall; chart text about 9 px on a 320 px screen | Not done. Neither fails AA |
| In England the Council Tax Reduction rules for pensioners are set nationally; the basic State Pension can be paid weekly in advance to some people | Each needs a second sourced claim |
| Could not be verified: that HMRC has not published how the 2027 change to simple assessment will work; the 26% response rate in one source note; that repairs are inside "Other housing costs" in two example budgets; that no costed double lock or means test exists | Findings of absence, or a source that was not fetched |

## Not checked

- The deployed preview past the sign-in. Chrome showed a blank page at the sign-in and the owner had not signed in.
- A screen reader, a person using a keyboard, a phone, Firefox and Safari.
- The Content Security Policy against real response headers, and the analytics script on a live page.
- The "Out of date" note with the accessibility scripts: their error states use a scripted submit.
- The Northern Ireland up-rating order.
- Of the rendered pages, the reviewer looked at 112 screenshots: the four tools in their states at 390 and 1280 px, six pages, dark mode and the keyboard order of one tool. Not looked at after the last build: the other 13 pages' first screens, the open menu on a phone, the wide tables on the costs and sources pages on a phone, and 200% zoom on a long page. The assistant looked at three screenshots of the final build: the overview, the table of every rate and the triple lock calculator.
