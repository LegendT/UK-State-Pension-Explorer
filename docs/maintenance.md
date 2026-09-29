# Maintenance: updating rates and sources, and handling corrections

## When rates change each April

Rates for the next tax year are usually announced in the autumn and confirmed in the rates publication. They take effect in the first full week of the tax year.

1. Read the new rates in the DWP publication "Benefit and pension rates" and in the Up-rating Order on legislation.gov.uk.
2. In `src/_data/history.json`, add a year to `years` with the rates in pence, the increase, what decided it, the prices and earnings figures as used, the effective date, the September price index and the two source addresses. Update `next_year`.
3. In `src/_data/figures.json`, update `nsp-full-weekly`, `bsp-full-weekly`, `nsp-full-52-weeks` (value and formula), `cpi-linked-uprating-2026`, `nsp-per-qualifying-year`, `pension-credit-single`, `pension-credit-couple`, `attendance-allowance-lower`, `attendance-allowance-higher` and `personal-allowance`. Change `period_label`, `effective_from`, `passage` and `checked_date` as well as the value.
4. Add a source record for the new rates publication and Order.
5. Do not publish a rate as current before its effective date. Until then it is an announced rate and must be labelled as one.
6. Run `npm test`. The history test fails if a new rate does not follow from the last one, the increase and 5p rounding. If it fails, check the data before anything else.
7. Run `python3 scripts/check-passages.py` and `npm run build`.
8. Read every page that names a tax year in its text. The worked example on the triple lock page names months and years in words.
9. Set `modified` in `src/_data/pageRegister.json` for each page whose content changed. Add a line to `policy_changes` in `src/_data/corrections.json`.
10. Titles, descriptions and share images carry no amounts, so they do not change. The build fails if an amount in pounds appears in a title or description.

## When a source publishes a new edition

Each figure has a `next_review` trigger. Known dates:

| Date | Source | Figures |
| --- | --- | --- |
| 20 October 2026 | ONS revised earnings, May to July 2026 | `earnings-first-estimate-2026`, `history.json` `next_year` |
| 21 October 2026 | ONS prices, year to September 2026 | `history.json` `next_year` |
| 22 October 2026 | DWP take-up estimates, financial year ending 2025 | `pension-credit-take-up`, `pension-credit-unclaimed`, `pension-credit-non-recipients` |
| 27 November 2026 | ONS Household Costs Indices | `hci-*` |
| Spring 2027 | Pensions Commission final report | Claims `pc-*` |
| Summer 2027 | Care commission report for England | Pensions and social care page |
| March 2027 | DWP Pensioners' Incomes and Households Below Average Income | `income-*`, `low-income-*`, `material-deprivation`, table `income-fifths` |
| July 2027 | OBR Fiscal risks and sustainability | `sp-share-gdp-*`, `tl-share-of-rise`, `saving-*-2075`, table `sp-longrun` |
| 21 September 2027 | DWP benefits statistics | `sp-recipients`, `*-mean-weekly*` |

For each: update the value, period, passage, table reference and `checked_date`. Keep the old value in `statistical_revisions` in the corrections log if a page reader could have relied on it.

Rechecking a source that has not changed updates `checked_date` only. It does not change a page's `modified` date.

## The news note

`src/_data/news.json` is a dated note. When policy status changes, rewrite it and change `as_of`. If nobody is maintaining it, leave the date in place. Never relabel an old note as current.

The note of 29 September 2026 was written before the Prime Minister's conference speech. Read the speech once a transcript is published and rewrite the note and the pensions and social care page.

## Corrections

1. Anyone can report an error through the route in `CORRECTION_URL`.
2. Decide which kind it is: an error by this site, a change in policy or rates, or a revision by the producer of a statistic.
3. Correct the register, not the page. Every page that uses the figure or claim then changes.
4. Search `src/` for the identifier to see every place it appears, including tables, scenarios and the news note.
5. Add an entry to `src/_data/corrections.json` with `date` and `text` in plain words: what was wrong, what it now says, and why.
6. If the claim cannot be corrected at once, remove it or mark it withdrawn. Do not leave a current label on a claim that is no longer supported.
7. Run the tests, the passage check, the build and the accessibility scripts. Update `modified` for the pages affected.
8. If the figure is shared with a sister site, tell that site's owner. The sites do not share data.

## Sister-site links

Open each destination in `src/_data/links.json` when the destination site changes, and at least with each April update. A link that still loads can lead to content that no longer fits. Update `content_checked` and `content_found`.

## After any change to markup, styles or scripts

Run `npm run a11y` and `node scripts/a11y-manual-assist.mjs`, and repeat the manual checks in `docs/accessibility-assessment.md` for the parts that changed.
