# Requirements matrix

Links each part of `uk-state-pension-explorer-scope.md` to where it is built, what evidence it rests on and how it was checked. Written 29 September 2026.

Status values: **Built**, **Built with a gap** (the gap is named), **Not built** (the reason is named), **Owner** (needs a decision or a person).

## Section 1: purpose and editorial position

| Requirement | Where | Check | Status |
| --- | --- | --- | --- |
| Neutral explainer, strongest arguments on each side | `/reform-options/#arguments`, same five questions for each option | Read through by the author only | Built with a gap: no second reader |
| Owner's concern is a question, not a conclusion | No default favours a rule. Default scenario is the one where three rules coincide, and the reason is stated | Tool 2 tested in a browser | Built |
| Editorial page deferred | None | | Not built, as the scope says |

## Section 2: eight main pages

| Page | Route | Evidence | Status |
| --- | --- | --- | --- |
| A Overview | `/` | `nsp-full-weekly`, `bsp-full-weekly`, `news.json` | Built |
| A Rate block first, both rates, qualification, sources, date visible | `/` `.rate-block` | Rates checked twice against GOV.UK | Built |
| A Forecast link and "Which pension applies?" | `/` | | Built |
| A Future rate separate from current | `/#next-year` | `earnings-first-estimate-2026` | Built |
| A Dated news context in four classes | `/#in-the-news` | `claims.json` | Built with a gap: written before the conference speech |
| A Shared footer | `base.njk` | `site.js` `siblings` | Built |
| B The State Pension | `/state-pension/` | GOV.UK, legislation, DWP statistics | Built with a gap: share on the full rate, and numbers with a pension that is not increased abroad, not found |
| C The triple lock | `/triple-lock/` | `history.json`, legislation | Built |
| D Living on a pension | `/living-on-a-pension/` | MIS 2026, RLS, ONS, DWP | Built with a gap: see decision log item A |
| E Reform options | `/reform-options/` | DWP, OBR, IFS, RF, PPI, ONS | Built with a gap: no costing found for a double lock or for means-testing |
| E Public-finance context | `#public-finances`, `#cost-and-saving` | Tables `sp-spending-series`, `sp-longrun` | Built |
| E Distributional context | `#who` | Tables `income-fifths`, `wealth-bands` | Built with a gap: carers' incomes and wealth by type for 65 and over not found |
| E Sister-site links in context | `#public-finances`, `#cost-and-saving` | `links.json` | Built. Destination tools not exercised in a browser |
| F Pensions and social care | `/reform-options/#social-care` | GOV.UK, nation governments, Health Foundation | Built as a dated section of the reform options page, not a page of its own. Owner's decision, 29 September 2026. Gap: dated before the speech |
| G History | `/history/` | `history.json` | Built |
| H Sources, method and corrections | `/sources-and-method/` | The three registers | Built with a gap: no correction route, no owner, no reviewer |
| Utility pages | `/accessibility/`, `/privacy/`, `/site-map/`, `/404.html` | | Built |

## Section 3: tools

| Requirement | Where | Check | Status |
| --- | --- | --- | --- |
| Specification before code | `docs/model-specification.md` | | Built |
| Tool 1: measure or tie, percentage, weekly, annual | `lib/uprating.js` `mechanism` | `test/uprating.test.js`, browser | Built |
| Tool 1: historical and hypothetical kept distinct after an edit | `tools/mechanism.js` | Browser: label changes on edit | Built |
| Tool 1: history from published decisions, not recalculated | Reads `history.json` | Browser: 2022/23 shows 3.1% with 8.3% earnings | Built |
| Tool 2: four rules, same path and start | `lib/uprating.js` `compareRules` | Tests, browser | Built |
| Tool 2: timing, negative growth, floors, rounding, base, earnings comparison stated | Spec section 6, and on the page | | Built |
| Tool 2: lower amount against cash cut | `lib/compare-view.js` `summary` | Test "a lower amount than the triple lock is not a cash cut" | Built |
| Tool 2: cumulative is for the period, cash and constant kept apart | Totals table and text | Tests | Built |
| Tool 2: scenarios where rules coincide | `scenarios.json` steady | Test | Built |
| Tool 2: reset | Reset button | Browser | Built |
| Tool 3: gross income, benefits received, separate tax, editable spending | `lib/budget.js` | Tests, browser | Built |
| Tool 3: unknown tax gives a before-tax balance | `lib/budget-view.js` | Test, browser | Built |
| Tool 3: one accounting convention | "How to enter amounts", field hints | Read through | Built |
| Tool 3: presets sourced and dated, exclusions shown | `budgets.json` | Each preset adds to its published total within 2p | Built with a gap: decision log item A |
| Tool 3: unsupported households stated at entry | "Before you start" | | Built |
| Tool 3: shortfall shown, costs not changed | | Test, browser | Built |
| Tool 4: series separate, new series from 2016/17 | `lib/history.js` | Test | Built |
| Tool 4: decisions stored apart from reconstructions | `history.json` against `reconstruct` | Test | Built |
| Tool 4: start year and amount visible | Note above the table | Browser | Built |
| Tool 4: table and download or copy | Buttons, and a static CSV | Browser: form. Download and copy buttons not pressed in a test | Built with a gap |
| Arithmetic separate from presentation | `lib/` has no DOM | | Built |
| Out of scope items not built | No entitlement engine, tax or benefit calculator, national model or care simulator | | As the scope says |

## Section 4: evidence and trust

| Requirement | Where | Check | Status |
| --- | --- | --- | --- |
| Central numerical register with the listed fields | `figures.json` | `check-build.mjs` section 6 | Built with a gap: no retained snapshot of each source beyond the quoted passage and `research/` |
| Qualitative claim register | `claims.json` | `check-build.mjs` | Built |
| Value stored once | `fig` and `figure` filters | Build fails on an unknown id | Built with a gap: `news.json` and `tables.json` repeat a few values in text |
| Dated language, no badges | Source notes | | Built |
| Passage checks | `scripts/check-passages.py` | All passages found: by script, or in a browser for three sites that refuse scripts | Built |
| Values without a passage | `scripts/check-values.py` and direct look-up in the spreadsheets | All found. Two wealth figures: value found, row not confirmed | Built with a gap |
| Review status shown honestly | `review_status` = `checked-with-ai-assistance`, preview banner | | Owner: no human review |
| Conflicting sources not resolved silently | Decision log, source notes | | Built |

## Section 6: design and accessibility

See `docs/accessibility-assessment.md`. Status: **Built with a gap**. Automated and scripted checks found no failure. No assistive technology has been used and no person has tested.

## Section 7: delivery stages

| Stage | Status |
| --- | --- |
| 1 Evidence and content foundation | Built |
| 2 Complete first version | Built |
| 3 Verification | Part done. Done: tests, passage and value checks, build checks, automated accessibility, checks on the deploy preview. Not done: review by a second person, screen readers, checks on a production domain |

## Section 9: sister sites

| Requirement | Where | Status |
| --- | --- | --- |
| Footer "Our other explainers" | `base.njk` | Built |
| Contextual links, labelled with the site name | Four placed on `/reform-options/` | Built |
| Destination content checked | `links.json` `content_found` | Built. Read from served HTML. Tools not run |
| Reciprocal links | `links.json` `reciprocal` | Not started. Needs a live domain and changes to two other repositories |

## Section 10: metadata and sitemaps

| Requirement | Where | Check | Status |
| --- | --- | --- | --- |
| Page register | `pageRegister.json` | `check-build.mjs` | Built |
| Unique titles and descriptions, no volatile amounts | Register | Build check | Built |
| Absolute canonicals on the configured host | `base.njk` | Build check in three environments | Built |
| Open Graph and card fields with image descriptions | `base.njk`, `shareImages.json` | Build check | Built. Fetched preview on a platform not checked |
| Share images without amounts, one for pages with a calculator | `src/assets/img/` | Looked at | Built |
| Structured data: `WebSite` and `WebPage` only | `base.njk` | Build check parses it and refuses other types | Built |
| XML sitemap, production only, real dates | `sitemap.njk` | Parsed as XML in a test production build | Built |
| HTML site map | `/site-map/` | | Built |
| Environment indexing controls | `site.js`, `base.njk`, `robots.njk` | Builds in three environments | Built |
| AI crawler policy recorded as undecided | `launch-dependencies.md` item 7 | | Owner |
| Deployed checks | Netlify deploy preview of pull request 1 | `curl` and Chrome, recorded in `docs/HANDOVER.md` | Done for the deploy preview. Not done for the main site address or a production domain |
| Search console | | | Not done: needs account and domain |
