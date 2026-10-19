# Maintenance: updating rates and sources, and handling corrections

## When rates change each April

Rates for the next tax year are usually announced in the autumn and confirmed in the rates publication. They take effect in the first full week of the tax year.

1. Read the new rates in the DWP publication "Benefit and pension rates" and in the Up-rating Order on legislation.gov.uk.
2. In `src/_data/history.json`, add a year to `years` with the rates in pence, the increase, what decided it, the prices and earnings figures as used, the effective date, the September price index and the two source addresses. Add an `annotation` only for a year that the history chart should mark: one short sentence, taken from the year's `note`. Update `next_year`.
3. In `src/_data/figures.json`, update `nsp-full-weekly`, `bsp-full-weekly`, `nsp-full-52-weeks` (value and formula), `cpi-linked-uprating-2026`, `nsp-per-qualifying-year`, `pension-credit-single`, `pension-credit-couple`, `attendance-allowance-lower`, `attendance-allowance-higher` and `personal-allowance`. Change `period_label`, `effective_from`, `passage` and `checked_date` as well as the value.
4. Add a source record for the new rates publication and Order.
5. Do not publish a rate as current before its effective date. Until then it is an announced rate and must be labelled as one.
6. Run `npm test`. The history test fails if a new rate does not follow from the last one, the increase and 5p rounding. If it fails, check the data before anything else.
7. Run `python3 scripts/check-passages.py`, `npm run build` and `npm run a11y`: the update changes data that pages show.
8. Read every page that names a tax year in its text. The worked example on the triple lock page names months and years in words. The headings and opening sentences that state what a section's figures show (W27, 13 October 2026) rest on those figures and are typed: on the State Pension page, what people receive; on living on a pension, the research budgets, spending, income and prices sections; on costs, all three sections; on social care, the sums involved. Reread each against its section after the figures change.
9. Set `modified` in `src/_data/pageRegister.json` for each page whose content changed. Once the site is published, add a line to `policy_changes` in `src/_data/corrections.json`. Before publication there is nothing to correct: decision 40.
10. Titles, descriptions and share images carry no amounts, so they do not change. The build fails if an amount in pounds appears in a title or description.

## When a source publishes a new edition

Each figure has a `next_review` trigger; the 51 that had none were filled on 2 October 2026. The owner reviews every source: decision 75. Known dates:

| Date | Source | Figures |
| --- | --- | --- |
| 20 October 2026 | ONS revised earnings, May to July 2026 | `earnings-first-estimate-2026`, `history.json` `next_year` |
| 21 October 2026 | ONS prices, year to September 2026 | `history.json` `next_year` |
| 22 October 2026 | DWP take-up estimates, financial year ending 2025 | `pension-credit-take-up`, `pension-credit-unclaimed`, `pension-credit-non-recipients` |
| 28 October 2026 | Office for Budget Responsibility forecast, published with the Budget. The date is from the Office's forecast timetable, read on 5 October 2026 at obr.uk | The forecasts in table `sp-spending-series`, and any costing of the rule announced for April 2030: `saving-rule-2030-*` |
| 27 November 2026 | ONS Household Costs Indices | `hci-*` |
| Spring 2027 | Pensions Commission final report | Claims `pc-*` |
| 2026 and by 2028 under the published terms; summer 2027 according to the Prime Minister's Office | Care commission report for England | The pensions and social care page, `/reform-options/social-care/` |
| March 2027 | DWP Pensioners' Incomes and Households Below Average Income | `income-*`, `low-income-*`, `material-deprivation`, table `income-fifths` |
| July 2027 | OBR Fiscal risks and sustainability | `sp-share-gdp-*`, `tl-share-of-rise`, `saving-*-2075`, table `sp-longrun` |
| 21 September 2027 | DWP benefits statistics | `sp-recipients`, `*-mean-weekly*` |

For each: update the value, period, passage, table reference and `checked_date`. Keep the old value in `statistical_revisions` in the corrections log if a page reader could have relied on it.

Rechecking a source that has not changed updates `checked_date` only. It does not change a page's `modified` date.

## The news note

`src/_data/news.json` holds the date of the note "In the news" on the overview, whose text is in `src/index.njk`. When policy status changes, rewrite the note and change `as_of`. If nobody is maintaining it, leave the date in place. Never relabel an old note as current.

The note was written on 30 September 2026, after the announcement of 29 September 2026, corrected on 5 October 2026, and checked again on 8 October 2026, when the Department for Work and Pensions' factsheet and the two changes to the care commission's terms were added, and on 19 October 2026, when the new material of decision 110 was added and the status was unchanged. The first search missed an analysis the Department for Work and Pensions published with the announcement. Search GOV.UK publications as well as news, and the UK Parliament's list of Bills. Rewrite the note, the option card for the announced rule and the pensions and social care page when any of these is published:

- a Bill or draft clauses for the change to the triple lock;
- an updated version of the care commission's terms of reference, which GOV.UK said on 1 October 2026 would follow;
- the adult social care workforce plan, promised on 30 September 2026 for the end of the year;
- a technical note from the Department for Work and Pensions or the Treasury, above all one that gives the earnings measure, the starting point or the method behind the savings;
- the next forecast from the Office for Budget Responsibility;
- the report of the Casey commission: summer 2027 according to the Prime Minister's Office, 2026 and by 2028 under its published terms of reference;
- the final report of the Pensions Commission, due in spring 2027;
- a statement from a party on its own site, to replace one that rests on a news report;
- an official transcript of the Prime Minister's speech;
- any government statement on which nations the care service covers;
- any government estimate of what the care service costs.

Read these parts of the reform options pages in full: on `/reform-options/`, the note at the top, the card `#opt-2030` and `#how-2030-works`. On `/reform-options/costs/`, `#saving-2030`. The whole of `/reform-options/social-care/`. Then search `src/` for "April 2030" and for `pm-care-2026-09-29` to find typed sentences elsewhere. The register entries of the announcement and the responses to it are the claims and figures with `checked_date` 2026-09-30.

## The update check

`npm run update-check` says what may have gone stale. Run it before launch, at each release in the table above, and at least monthly. It edits nothing, and it fails only when the passage or value check of its last section does: everything else it prints is for a person to act on. The record of each run is the "Last checks" table in `docs/HANDOVER.md`, not this file.

The run is clean when it exits 0, every source it reports with a newer edition has been read and its record updated or left with a reason, every release it reports as due has been handled under "When a source publishes a new edition", and the run is recorded in the handover.

What to do with each section:

1. **Addresses.** A dead address: find the page's new home, change `url` in the register, and recheck the passage. A refused address, one that answers with a robot check: read it in a browser; the passages this applies to are listed in `scripts/passages-checked-in-browser.json`. A redirected address: change `url` to where it now points. GOV.UK answers a missing part of a guide with a redirect to the guide's first page, not a 404, so a redirected GOV.UK address may be a page that has gone: open it.
2. **Newer editions.** The script reads a last-updated signal where the site prints one: GOV.UK's updated-at metas, legislation.gov.uk's modified date, the ONS release date and the generic modified-time metas. A signal later than the record's `checked_date` means the page changed since it was checked: read it, and either update the record under "When a source publishes a new edition" or, if nothing the site uses changed, update `checked_date` only. The sources with no readable signal are listed by publisher: take them a publisher at a time, and read each in a browser. The Office for National Statistics answers 429 to a second run within the hour, since the script, the passage check and the value check each fetch its pages: wait before running again.
3. **Check dates.** A record over the limit, 45 days unless `--days` says otherwise, is rechecked against its source: `checked_date` moves, nothing else, unless the source changed. The news note's `as_of` and the pages' `modified` dates are printed for information only: "The news note" says when `as_of` changes.
4. **Releases due.** Each is a row of the table above whose date has passed and whose figures were last checked before it: handle it under "When a source publishes a new edition". A row whose date the script could not read, a season or a sentence, is checked by hand. A figure whose `next_review` disagrees with the table is corrected in whichever is wrong.
5. **Typed wording.** Every line in a template or script that carries the previous, current or next tax year, in any of its three forms, or a month of those years, is listed: step 8 of "When rates change each April" says how to read them. The script judges nothing here.
6. **The passage and value checks.** `scripts/check-passages.py` and `scripts/check-values.py`, both run whichever fails. A passage not found or a source unreadable fails the run.

What no script can see, read each time: the news note, by its own section's list; the responses to the announcement that rest on news reports, defect 2 of the handover, for a statement on the party's own site; and the sister links, under "Sister-site links".

## Corrections

1. Anyone can report an error through the route in `CORRECTION_URL`.
2. Decide which kind it is: an error by this site, a change in policy or rates, or a revision by the producer of a statistic.
3. Correct the register, not the page. Every page that uses the figure or claim then changes. In a figure's `qualifications`, put first the caveat that changes what the figure means: the first sentence is the one shown open on the page (decision 49).
4. Search `src/` for the identifier to see every place it appears, including tables, scenarios and the news note.
5. Add an entry to `src/_data/corrections.json` with `date` and `text` in plain words: what was wrong, what it now says, and why.
6. If the claim cannot be corrected at once, remove it or mark it withdrawn. Do not leave a current label on a claim that is no longer supported.
7. Run the tests, the passage check, the build and the accessibility scripts. Update `modified` for the pages affected.
8. If the figure is shared with a sister site, tell that site's owner. The sites do not share data.

## Sister-site links

Open each destination in `src/_data/links.json` when the destination site changes, and at least with each April update. A link that still loads can lead to content that no longer fits. Update `content_checked` and `content_found`.

## After any change to markup, styles or scripts, or to data a page shows

Run `npm run a11y`, `npm run a11y:manual` and `npm run test:tools`, and repeat the manual checks in `docs/accessibility-assessment.md` for the parts that changed.
