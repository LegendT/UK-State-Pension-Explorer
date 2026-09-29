# 01 - State Pension rates and entitlement rules (tax year 2026/27)

Research record for UK State Pension Explorer. Retrieved 2026-09-29. British English throughout.

## How this was gathered

- **GOV.UK pages** were read through the GOV.UK content API (`https://www.gov.uk/api/content/<path>`), which returns the same body text as the rendered page. The rendered HTML pages were not opened separately. Every quote marked FETCHED-AND-QUOTED below was copied from the fetched body text.
- **Dates.** GOV.UK mainstream guides (for example `/new-state-pension`) do not show a "last updated" date on the page. For those, two API fields are given: `public_updated_at` (last change the publisher flagged as significant) and `updated_at` (last technical republish). Neither proves that a given figure was changed on that date. Publications and statistics show their dates on the page and those are given as shown.
- **Legislation** was read on legislation.gov.uk ("as made" version for 2026 instruments; "latest available" for older ones).
- **House of Commons Library** pages and PDFs returned HTTP 403 to both fetch methods. Nothing from the Commons Library is quoted as fetched. Where a Commons Library point is mentioned it is marked SECONDARY-ONLY (search-result snippet).
- **Check status values:** FETCHED-AND-QUOTED, SECONDARY-ONLY, NOT-FOUND.
- No figure in this file was calculated or estimated by the researcher, except where a line is explicitly labelled "researcher arithmetic".

## Summary of discrepancies and cautions

| # | Finding |
|---|---------|
| D1 | Expected figures confirmed: full new State Pension GBP 241.30 a week; full basic State Pension GBP 184.90 a week. No discrepancy. |
| D2 | "Your State Pension explained" (GOV.UK, updated 6 April 2026) says each qualifying year adds "about GBP 6.89 a week, this is GBP 230.25 divided by 35". GBP 230.25 is the 2025/26 full rate. The GBP 6.89 figure matches the 2026/27 rate (researcher arithmetic: 241.30 / 35 = 6.894). The page text is internally inconsistent; use GBP 6.89 with the 2026/27 rate and do not repeat the GBP 230.25 wording. |
| D3 | The GOV.UK "State Pension age timetable" says the Pensions Act 2014 provides for a review "at least once every 5 years". Section 27(3) of the Act as now in force says each report must be published within "6 years" of the previous one. Use the legislation. |
| D4 | The DWP rates publication gives rates but no effective dates. Effective dates come from the Social Security Benefits Up-rating Order 2026 (S.I. 2026/148), article 7. |
| D5 | The brief said payment is "in arrears". The current GOV.UK guide pages do not use the word "arrears". The rule is in legislation (Claims and Payments Regulations 1987, regs 22C and 22CA) and that is what is quoted. |
| D6 | The Budget 2025 State Pension / Simple Assessment measure is ANNOUNCED, not enacted. No provision for it was found in the Finance Act 2026 contents, and no GOV.UK publication setting out the detail was found. |
| D7 | The term "COPE" (Contracted Out Pension Equivalent) was not found on any fetched GOV.UK page. The contracting-out deduction itself is documented. |
| D8 | No published independent report or government report from the third State Pension age review was found on GOV.UK. |

---

## 1. Full new State Pension weekly rate 2026/27

- **id:** `nsp-full-rate-2026-27`
- **Definition:** The maximum standard weekly amount of the new State Pension, before any protected payment or deferral increase.
- **Value and unit:** GBP 241.30 per week. (2025/26: GBP 230.25.)
- **Annual equivalent:** GOV.UK states 52 weeks of the full rate is GBP 12,547.60 (deferral guide example). See caveats on the tax-year basis.
- **Population:** Men born on or after 6 April 1951 and women born on or after 6 April 1953 with a qualifying National Insurance record.
- **Geography:** Great Britain (the Order extends to England and Wales and Scotland). Northern Ireland has a parallel order (S.R. 2026/59), not examined.
- **Effective from:** 6 April 2026. **Effective to:** until changed by the next up-rating order; not yet made at retrieval.
- **Basis:** Gross, weekly.
- **Publisher / title / URL (a):** DWP, GOV.UK guide "The new State Pension", part "What you'll get". https://www.gov.uk/new-state-pension/what-youll-get
  - Dates: `public_updated_at` 2025-01-31; `updated_at` 2026-09-09.
  - Quote: "The full rate of new State Pension is £241.30 a week."
- **Publisher / title / URL (b):** DWP, "Benefit and pension rates 2026 to 2027". Row "New State Pension - Full rate | 230.25 | 241.30". URL in record 3.
- **Publisher / title / URL (c):** The Social Security Benefits Up-rating Order 2026, S.I. 2026/148, made 2 March 2026. https://www.legislation.gov.uk/uksi/2026/148/article/6/made and https://www.legislation.gov.uk/uksi/2026/148/article/7/made
  - Quote (art 6(1)): "In regulation 1A of the State Pension Regulations 2015 (full rate of state pension) for “£230.25” substitute “£241.30”."
  - Quote (art 7(10)): "Any increases in the sums mentioned in article 6 for state pension under Part 1 of the Pensions Act shall take effect on 6th April 2026."
- **Retrieved:** 2026-09-29.
- **Classification:** Published rate.
- **Caveats:** Many people get less or more than the full rate (records 5 and 9). HMRC bases a tax year's taxable State Pension on one week at the old rate plus 51 weeks at the new rate (record 10), so GBP 12,547.60 is 52 weeks at the new rate, not the HMRC taxable figure for 2026/27. The 4.8% increase figure is from Budget 2025 (record 10 source), not from the rates table.
- **Check status:** FETCHED-AND-QUOTED.

## 2. Basic State Pension rates 2026/27

- **id:** `bsp-rates-2026-27`
- **Definition:** Weekly rates of the pre-2016 ("old") State Pension categories.
- **Values (GBP per week), from the DWP rates publication, 2025/26 then 2026/27:**

| Category | 2025/26 | 2026/27 |
|---|---|---|
| Category A or B basic pension (the "full basic State Pension") | 176.45 | 184.90 |
| Category B (lower) basic pension - spouse or civil partner's insurance | 105.70 | 110.75 |
| Category C or D - non-contributory (Category D is the "over 80 pension") | 105.70 | 110.75 |
| Addition at age 80 | 0.25 | 0.25 |
| Maximum additional pension (own and inherited) | 222.10 | 230.54 |
| Graduated Retirement Benefit (unit) | 0.1783 | 0.1851 |

- **Population:** Men born before 6 April 1951 and women born before 6 April 1953.
- **Geography:** Great Britain.
- **Effective from:** 6 April 2026 (Order art 7(2)). **Effective to:** next up-rating.
- **Basis:** Gross, weekly.
- **Sources:**
  - DWP, GOV.UK guide "The basic State Pension", part "How much you get". https://www.gov.uk/state-pension/how-much-you-get - `public_updated_at` 2015-03-17; `updated_at` 2026-09-09. Quote: "The full basic State Pension is £184.90 per week."
  - DWP, GOV.UK guide "Over 80 pension". https://www.gov.uk/over-80-pension - `public_updated_at` 2015-04-06. Quote: "It can give you £110.75 a week in the 2026 to 2027 tax year."
  - S.I. 2026/148 art 4(2): "for “£176.45” substitute “£184.90”". Art 7(2): increases for "Category A, Category B, Category C and Category D retirement pension and graduated retirement benefit ... shall take effect on 6th April 2026."
- **Retrieved:** 2026-09-29.
- **Classification:** Published rate.
- **Caveats:** The over 80 pension is not based on National Insurance contributions and has a residence test. The GBP 0.25 age addition is unchanged. The label "Category D = over 80 pension" is the researcher's mapping of the GOV.UK guide to the rates table; the guide itself does not use the category letter.
- **Check status:** FETCHED-AND-QUOTED.

## 3. Official rates publication 2026/27

- **id:** `dwp-rates-publication-2026-27`
- **Definition:** DWP's annual list of benefit and pension rates.
- **Publisher:** Department for Work and Pensions.
- **Exact title:** "Benefit and pension rates 2026 to 2027" (policy paper).
- **URL:** https://www.gov.uk/government/publications/benefit-and-pension-rates-2026-to-2027
  - HTML version: https://www.gov.uk/government/publications/benefit-and-pension-rates-2026-to-2027/proposed-benefit-and-pension-rates-2026-to-2027
  - PDF: https://assets.publishing.service.gov.uk/media/69931706ceeaa48d377f6bd5/Benefit-and-pension-rates-2026-2027.pdf (PDF not opened; HTML version read)
- **Published:** 27 November 2025. **Last updated:** 16 February 2026.
- **Change history quote (16 Feb 2026):** "Removed 'proposed' from the titles of the PDF and page as the figures have been confirmed."
- **Basis:** "Weekly rates unless otherwise stated." Gross.
- **Geography:** Great Britain rates.
- **Rows - State Pension (2025/26 | 2026/27):**

| Row | 2025/26 | 2026/27 |
|---|---|---|
| New State Pension - Full rate | 230.25 | 241.30 |
| Transitional rate below full rate | 4.0913% | 4.7991% |
| Protected Payment | 1.70% | 3.80% |
| Increments - own (based on deferred new State Pension) | 1.70% | 3.80% |
| Increments - inherited (based on deferred old State Pension) | 1.70% | 3.80% |
| Old State Pension - Category A or B basic pension | 176.45 | 184.90 |
| Category B (lower) basic pension | 105.70 | 110.75 |
| Category C or D - non-contributory | 105.70 | 110.75 |
| Additional pension (AP) | 1.70% | 3.80% |
| Maximum additional pension (own and inherited) | 222.10 | 230.54 |
| Increments to basic pension / additional pension / GRB / inheritable lump sum | 1.70% | 3.80% |
| Contracted-out deduction from AP, pre-April 1988 earnings | Nil | Nil |
| Contracted-out deduction from AP, April 1988 to 1997 earnings | 1.70% | 3.00% |
| Graduated Retirement Benefit (unit) | 0.1783 | 0.1851 |
| Addition at age 80 | 0.25 | 0.25 |

- **Rows - Pension Credit (2025/26 | 2026/27):**

| Row | 2025/26 | 2026/27 |
|---|---|---|
| Standard minimum guarantee - single | 227.10 | 238.00 |
| Standard minimum guarantee - couple | 346.60 | 363.25 |
| Additional amount for severe disability - single | 82.90 | 86.05 |
| Additional amount for severe disability - couple (both qualify) | 165.80 | 172.10 |
| Additional amount for carers | 46.40 | 48.15 |
| Savings credit threshold - single | 198.27 | 208.07 |
| Savings credit threshold - couple | 314.34 | 329.75 |
| Savings credit maximum - single | 17.30 | 17.96 |
| Savings credit maximum - couple | 19.36 | 20.10 |

- **Rows - Attendance Allowance:** Higher rate 110.40 | 114.60. Lower rate 73.90 | 76.70.
- **Retrieved:** 2026-09-29.
- **Classification:** Published rate.
- **Caveats:** The HTML page's URL slug still contains "proposed"; the title and change note confirm the figures are final. The publication gives no effective dates (see D4). Percentages in the table are up-rating percentages, not weekly amounts.
- **Check status:** FETCHED-AND-QUOTED.

## 4. Which system applies (date of birth)

- **id:** `sp-system-by-date-of-birth`
- **Definition:** The rule that decides whether a person is under the new or the basic State Pension.
- **Value:** New State Pension: man born on or after 6 April 1951; woman born on or after 6 April 1953. Basic State Pension: born before those dates. Equivalent test: reaching State Pension age on or after 6 April 2016.
- **Population / geography:** All State Pension claimants; UK-wide rule (NI has parallel legislation).
- **Effective from:** 6 April 2016. **Effective to:** open-ended.
- **Sources:**
  - https://www.gov.uk/new-state-pension (part "Eligibility"). Quote: "You’ll be able to claim the new State Pension when you reach State Pension age if you’re: a man born on or after 6 April 1951, a woman born on or after 6 April 1953".
  - https://www.gov.uk/state-pension (part "Who gets the basic State Pension"). Quote: "Everyone eligible for the basic State Pension has now reached State Pension age."
- **Dates:** as records 1 and 2. **Retrieved:** 2026-09-29.
- **Classification:** Published rule.
- **Caveats:** For people born before 6 December 1953, GOV.UK says State Pension age is worked out using "legal sex and date of birth".
- **Check status:** FETCHED-AND-QUOTED.

## 5. Qualifying years

### 5a. New State Pension

- **id:** `nsp-qualifying-years`
- **Definition:** The National Insurance record needed for the new State Pension.
- **Values:**
  - Minimum: 10 qualifying years to get any new State Pension (normally).
  - 35 qualifying years for the full rate ONLY where the National Insurance record started after April 2016.
  - Record started before April 2016: a "starting amount" is calculated as at 5 April 2016; a deduction is made for contracted-out periods; more than 35 years is usually needed if contracted out.
  - Each qualifying year added after 5 April 2016: about GBP 6.89 a week, up to the full rate (see D2).
- **Population:** People reaching State Pension age on or after 6 April 2016.
- **Geography:** UK rule as described on GOV.UK.
- **Effective from:** 6 April 2016. Thresholds quoted are 2026 to 2027.
- **Sources and quotes:**
  - https://www.gov.uk/new-state-pension/eligibility - "You’ll need 10 qualifying years on your National Insurance record to get any new State Pension."
  - https://www.gov.uk/new-state-pension/what-youll-get - "If you were contracted out, you will usually need more than 35 qualifying years to get the full rate of new State Pension."
  - Same page - "If your National Insurance record started after April 2016 you will need 35 qualifying years to get the full rate of new State Pension."
  - DWP guidance "Your new State Pension explained", HTML page titled "Your State Pension explained". https://www.gov.uk/government/publications/your-new-state-pension-explained/your-state-pension-explained - last updated 6 April 2026.
    - Starting amount: "we work out a ‘starting amount’ for you for the new State Pension. It is the higher of either" the old-rules amount or the new-rules amount on the record to 6 April 2016.
    - "Both amounts reflect any periods when you were contracted out of the Additional State Pension. Your ‘starting amount’ could be less than, more than or equal to the full new State Pension."
    - "It is possible to have some gaps in your National Insurance record and still get the full new State Pension."
    - Qualifying year by earnings: "you are employed and earning over £242 a week (2026 to 2027) from one employer and paying National Insurance contributions"; treated as paid between "£129 and £242 a week".
    - Voluntary contributions: "£18.40 a week in 2026 to 2027"; Class 2 "£3.65 a week in 2026 to 2027".
  - DWP guide "Contracted out of the Additional State Pension". https://www.gov.uk/contracted-out - `public_updated_at` 2024-11-08. Quote: "If you were contracted out before 6 April 2016, you might not get the full rate new State Pension of £241.30 a week."
- **Why 35 years does not guarantee the full rate:** the pre-2016 record is converted into a starting amount, reduced for contracting out. Someone with 35 or more years can therefore have a starting amount below the full rate, and must add post-2016 years to close the gap. Someone can also reach the full rate with fewer than 35 years if the old-rules starting amount was high.
- **Retrieved:** 2026-09-29.
- **Classification:** Published rule.
- **Caveats:** D2 (stale GBP 230.25 wording). D7: the term "COPE" was not found on fetched pages - NOT-FOUND for that term. The "Your State Pension explained" page carries a footer saying information is correct "as of April 2019" although it was updated in April 2026. Exceptions exist to the 10-year minimum (for example women with a Reduced Rate Election; years worked abroad).
- **Check status:** FETCHED-AND-QUOTED (COPE term: NOT-FOUND).

### 5b. Basic State Pension

- **id:** `bsp-qualifying-years`
- **Values (years usually needed):**

| Group | For any basic State Pension | For the full basic State Pension |
|---|---|---|
| Men born between 1945 and 1951 | 1 | 30 |
| Men born before 1945 | 11 | 44 |
| Women born between 1950 and 1953 | 1 | 30 |
| Women born before 1950 | 10 | 39 |

- **Source:** https://www.gov.uk/state-pension (parts "Who gets the basic State Pension" and "How much you get"). Quote: "30 qualifying years if you were born between 1945 and 1951".
- **Retrieved:** 2026-09-29. **Classification:** Published rule.
- **Caveats:** GOV.UK says "usually"; people with fewer years "might still be eligible". The birth-year bands on GOV.UK are stated by year, not exact date.
- **Check status:** FETCHED-AND-QUOTED.

## 6. National Insurance credits

- **id:** `ni-credits`
- **Definition:** Credits added to a National Insurance record when a person is not paying contributions (for example unemployed, ill, a parent or carer), to fill gaps and protect State Pension entitlement.
- **Value:** Not a monetary value. Two types: Class 1 credits (count towards State Pension and some other benefits) and Class 3 credits (count towards State Pension only).
- **Population / geography:** UK National Insurance record holders meeting the conditions.
- **Source:** HMRC/DWP, GOV.UK guide "National Insurance credits". https://www.gov.uk/national-insurance-credits - `public_updated_at` 2025-01-21; `updated_at` 2026-09-25.
- **Quotes:** "Credits can help to fill gaps in your National Insurance record, to make sure you qualify for certain benefits including the State Pension." / "Class 3 - these count towards your State Pension only".
- **Related quote ("Your State Pension explained"):** "You need to apply for Child Benefit in order to receive your National Insurance credit even if you choose not to receive a payment."
- **Retrieved:** 2026-09-29. **Classification:** Published rule.
- **Caveats:** Some credits are automatic, others must be claimed and cannot always be backdated. The full eligibility table was not transcribed.
- **Check status:** FETCHED-AND-QUOTED.

## 7. State Pension age

- **id:** `state-pension-age-timetable`
- **Definition:** The earliest age at which the State Pension can be claimed.
- **Values (current law):**
  - Born 6 October 1954 to 5 April 1960: 66th birthday.
  - 66 to 67 phase-in (Pensions Act 2014), by date of birth:

| Date of birth | State Pension age |
|---|---|
| 6 April 1960 - 5 May 1960 | 66 years and 1 month |
| 6 May 1960 - 5 June 1960 | 66 years and 2 months |
| 6 June 1960 - 5 July 1960 | 66 years and 3 months |
| 6 July 1960 - 5 August 1960 | 66 years and 4 months |
| 6 August 1960 - 5 September 1960 | 66 years and 5 months |
| 6 September 1960 - 5 October 1960 | 66 years and 6 months |
| 6 October 1960 - 5 November 1960 | 66 years and 7 months |
| 6 November 1960 - 5 December 1960 | 66 years and 8 months |
| 6 December 1960 - 5 January 1961 | 66 years and 9 months |
| 6 January 1961 - 5 February 1961 | 66 years and 10 months |
| 6 February 1961 - 5 March 1961 | 66 years and 11 months |
| 6 March 1961 - 5 April 1977 | 67 |

  - 67 to 68 (Pensions Act 2007): phased between 2044 and 2046, for those born from 6 April 1977. First row of Table 5: born 6 April 1977 - 5 May 1977 reaches State Pension age on 6 May 2044.
- **Population / geography:** Men and women; Great Britain legislation (NI parallel).
- **Effective period:** 66 to 67 increase runs between 2026 and 2028; it is under way at the retrieval date.
- **Publisher / title / URL:** DWP, "State Pension age timetable" (policy paper). https://www.gov.uk/government/publications/state-pension-age-timetable/state-pension-age-timetable - page date shown: updated 15 May 2014.
- **Quotes:**
  - "The State Pension age for men and women will now increase to 67 between 2026 and 2028."
  - "Under the Pensions Act 2007 the State Pension age for men and women will increase from 67 to 68 between 2044 and 2046."
  - "the timetable for the increase in the State Pension age from 67 to 68 could change as a result of a future review."
- **Review status (2026):**
  - DWP collection "Third State Pension age review". https://www.gov.uk/government/collections/third-state-pension-age-review - published 21 July 2025, last updated 18 August 2025.
  - Quote: "The government announced the launch of the third review of State Pension age in July 2025."
  - Quote: "The first review of State Pension age concluded in 2017 and the second review concluded in 2023."
  - Two evidence reports: an independent report led by Dr Suzy Morrissey, and a Government Actuary's Department report. Documents listed in the collection at retrieval: call for evidence (18 August 2025) and two terms of reference (21 July 2025). No final report listed.
  - Statutory duty: Pensions Act 2014 s.27. https://www.legislation.gov.uk/ukpga/2014/19/section/27 - "Each subsequent report must be published before the end of the period of 6 years beginning with the day on which the previous report was published."
  - GOV.UK "Check your State Pension age" tool text: "The State Pension age is under review and may change in the future." https://www.gov.uk/state-pension-age
- **Retrieved:** 2026-09-29.
- **Classification:** Published rule (timetable); review status is an observed state of publication, not a rule.
- **Caveats:** D3 (5 years v 6 years). D8: absence of a published report on GOV.UK was checked on the collection page and by GOV.UK search only; it is not proof that nothing has been published elsewhere. A search-result snippet (secondary, a pensions blog dated June 2026) suggested the independent report was expected in spring 2026 and was overdue - SECONDARY-ONLY, not verified. The timetable page dates from 2014 and includes a 2013 Autumn Statement passage about 68 "by the mid-2030s" that it describes as "indicative only" and not legislated. The exact publication date of the second review report was not fetched.
- **Check status:** FETCHED-AND-QUOTED (timetable, review launch, s.27). Review-report status: NOT-FOUND.

## 8. Claiming and deferral

- **id:** `sp-claiming-and-deferral`
- **Definition:** How the State Pension starts, and what happens if it is not claimed at State Pension age.
- **Claiming:** Not automatic. Quote: "You will not get your new State Pension automatically - you have to claim it." https://www.gov.uk/new-state-pension/how-to-claim
- **Deferral is the default if no claim is made.** Quote: "If you do not claim your State Pension at State Pension age, it automatically defers." https://www.gov.uk/deferring-state-pension
- **Values:**

| | Reached State Pension age on or after 6 April 2016 (new) | Reached it before 6 April 2016 (basic) |
|---|---|---|
| Minimum deferral for extra pension | 9 weeks | 5 weeks |
| Rate of increase | 1% for every 9 weeks | 1% for every 5 weeks |
| Equivalent per 52 weeks | just under 5.8% | just under 10.4% |
| Lump-sum option | One-off arrears payment of up to 52 weeks, no interest | Lump sum if deferred at least 12 months, with interest of 2% above Bank of England base rate |
| GOV.UK worked example | Extra GBP 13.99 a week after 52 weeks on GBP 241.30 | Extra GBP 19.22 a week after 52 weeks on GBP 184.90 |

- **Quotes:** "For every 9 weeks you defer, you’ll get 1% added to your regular weekly pension payment for life." / "For every 5 weeks you defer, you’ll get 1% of that amount added to your regular payment for life."
- **Up-rating of the deferral increase:** "the extra amount you get because you deferred will usually increase each year based on the Consumer Price Index. It will not increase for some people who live abroad."
- **Publisher / title / URL:** DWP, GOV.UK guide "Defer (delay) your State Pension". https://www.gov.uk/deferring-state-pension - `public_updated_at` 2024-11-08; `updated_at` 2026-09-21.
- **Population / geography:** GOV.UK guide covers Great Britain; different claim routes for Northern Ireland and abroad.
- **Basis:** Gross; extra payments "could be taxed".
- **Retrieved:** 2026-09-29. **Classification:** Published rule.
- **Caveats:** Extra State Pension cannot be built up while the person or their partner gets certain benefits (including Pension Credit, Universal Credit, Carer's Allowance) or for time in prison. GOV.UK states it takes "over 15 years to get back 52 weeks of deferred full new State Pension". Additional State Pension itself is automatic once the basic State Pension is claimed.
- **Check status:** FETCHED-AND-QUOTED.

## 9. Additional State Pension, protected payment, Graduated Retirement Benefit - and how each is uprated

- **id:** `sp-extra-components-uprating`
- **Definitions:**
  - **Additional State Pension:** earnings-related extra amount on top of the basic State Pension (SERPS 1978 to 2002; State Second Pension 2002 to 2016; State Pension top up 2015 to 2017). No fixed amount.
  - **Protected payment:** the amount by which a person's 2016 starting amount exceeds the full new State Pension; paid on top of the full rate.
  - **Graduated Retirement Benefit (GRB):** benefit from graduated contributions paid between 1961 and 1975, bought as "units".
- **Values 2026/27:**

| Component | 2026/27 up-rating | Basis stated by source |
|---|---|---|
| Basic State Pension (Cat A/B) | GBP 176.45 to GBP 184.90 | Highest of earnings, CPI, 2.5% (GOV.UK) |
| New State Pension full rate | GBP 230.25 to GBP 241.30 | Highest of earnings, CPI, 2.5% (GOV.UK) |
| Protected payment | 3.80% | CPI (GOV.UK) |
| Additional pension | 3.80% | Percentage set in Order art 4(3) |
| Graduated Retirement Benefit | 3.80% (unit 17.83p to 18.51p) | Percentage set in Order art 11 |
| Deferral increments (both systems) | 3.80% | CPI (GOV.UK deferral guide) |
| Maximum additional pension | GBP 222.10 to GBP 230.54 | Order art 13 |

- **Quotes:**
  - GOV.UK new State Pension: "If you have a protected payment, it increases each year in line with the CPI."
  - GOV.UK new State Pension: "The new State Pension increases each year by whichever is the highest: earnings ... prices ... 2.5%".
  - S.I. 2026/148 art 4(3): "additional pensions in long-term benefits calculated by reference to any final relevant year earlier than the tax year 2025-2026 ... shall in each case be increased by 3.8 per cent."
  - S.I. 2026/148 art 6(3)(b): amounts "at the transitional rate which exceed the full rate ... shall in each case be increased by 3.8 per cent."
  - S.I. 2026/148 art 11(1): "the sum of “17.83” pence shall be increased by 3.8 per cent".
  - HMRC manual EIM75700 on GRB: "Between 1961 and 1975 individuals could pay contributions into the Graduated Retirement Benefit." https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim75700 (updated 28 March 2022).
- **Sources:** https://www.gov.uk/new-state-pension/what-youll-get ; https://www.gov.uk/additional-state-pension (`public_updated_at` 2015-04-06; `updated_at` 2026-09-09); S.I. 2026/148 arts 4, 6, 11, 13; DWP rates publication (record 3).
- **Population:** Additional State Pension and GRB: people who reached State Pension age before 6 April 2016 (and some inheritors). Protected payment: new State Pension recipients with a starting amount above the full rate.
- **Geography:** Great Britain. **Effective from:** 6 April 2026. **Basis:** Gross, weekly.
- **Retrieved:** 2026-09-29. **Classification:** Published rate / rule.
- **Caveats:** The Order states the percentage (3.8) but does not itself say "CPI". The link between 3.8% and CPI for additional pension and GRB was seen only in a search snippet of the Lords debate on the Order ("3.8%, in line with the rise in the consumer prices index in the year to September 2025") - SECONDARY-ONLY for that attribution. GOV.UK states the CPI basis directly for the protected payment and deferral increments. The "triple lock" label is not used on the GOV.UK guide pages; Budget 2025 uses "Triple Lock". Additional State Pension may be reduced or nil for contracted-out periods.
- **Check status:** FETCHED-AND-QUOTED (rates, percentages, protected payment CPI rule). CPI attribution for additional pension and GRB: SECONDARY-ONLY.

## 10. Tax treatment

- **id:** `sp-tax-treatment`
- **Definition:** How Income Tax applies to the State Pension.
- **Rules and values:**
  - The State Pension is taxable income. It is paid without tax taken off.
  - Standard Personal Allowance 2026/27: GBP 12,570 per year. Tax year 6 April 2026 to 5 April 2027.
  - Collection: through the tax code on a private pension or wages; by Self Assessment; or by a Simple Assessment bill from HMRC where State Pension is the only income and tax is due.
  - HMRC taxes the entitlement for the year, not the payments received: one week at the old rate plus 51 weeks at the new rate.
- **Quotes and sources:**
  - HMRC, "How your State Pension is taxed" (guidance, first published 7 July 2026). https://www.gov.uk/guidance/how-your-state-pension-is-taxed - "Your State Pension is taxable income, but tax is not taken off before you get it."
  - HMRC, "Income Tax rates and Personal Allowances". https://www.gov.uk/income-tax-rates - `public_updated_at` 2024-11-07; `updated_at` 2026-09-25. "The standard Personal Allowance is £12,570" / "The current tax year is from 6 April 2026 to 5 April 2027."
  - HMRC/DWP, "Tax when you get a pension", part "How your tax is paid". https://www.gov.uk/tax-on-pension/how-your-tax-is-paid - "If you go over your Personal Allowance and you have tax to pay, HMRC will send you a Simple Assessment tax bill."
  - HMRC manual EIM75700: "If the State Pension is the individual’s only income it will be paid to the individual without deduction of tax and the recipient is responsible for paying any tax due."
- **ENACTED - Personal Allowance freeze:** Finance Act 2026 (c. 11, Royal Assent 18 March 2026) s.10 extends the GBP 12,570 Personal Allowance to tax years "2027-28, 2028-29, 2029-30 and 2030-31". https://www.legislation.gov.uk/ukpga/2026/11/section/10
- **ANNOUNCED, NOT ENACTED - State Pension and Simple Assessment:** HM Treasury, "Budget 2025" (HTML), published 26 November 2025, updated 28 November 2025. https://www.gov.uk/government/publications/budget-2025-document/budget-2025-html
  - Quote: "The government will ease the administrative burden for pensioners whose sole income is the basic or new State Pension without any increments so that they do not have to pay small amounts of tax via Simple Assessment from 2027-28".
  - Quote: "The government is exploring the best way to achieve this and will set out more detail next year."
- **Population / geography:** UK taxpayers (Personal Allowance applies UK-wide; Scottish rate bands differ).
- **Basis:** State Pension gross; Personal Allowance annual.
- **Retrieved:** 2026-09-29.
- **Classification:** Published rule (tax treatment, allowance); announced policy (Simple Assessment measure).
- **Caveats:**
  - For 2026/27 the full new State Pension for 52 weeks (GBP 12,547.60, GOV.UK figure) is below GBP 12,570. People with a protected payment, deferral increments or Additional State Pension can exceed the allowance on State Pension alone.
  - The announced measure applies from 2027-28, is limited to people whose sole income is the basic or new State Pension "without any increments", and its mechanism has not been published. No matching section was found in the Finance Act 2026 contents list (searched for "state pension" and "simple assessment"). Do not present it as law.
  - No official source was fetched stating the 2027/28 State Pension rate or that it will exceed the Personal Allowance. Figures circulating for 2027/28 (for example GBP 12,862.20 and a tax bill of about GBP 58) were seen only in search snippets of non-government sites and the Commons Library briefing CBP-10250 - SECONDARY-ONLY, and they are forecasts. Do not publish them as fact.
  - A ministerial statement in the Commons on 12 January 2026 (that such pensioners "will not have to pay income tax over this Parliament") was seen only in a search snippet attributed to CBP-10250 - SECONDARY-ONLY; Hansard was not fetched.
- **Check status:** FETCHED-AND-QUOTED (rules, allowance, Finance Act s.10, Budget text). 2027/28 figures and the January 2026 statement: SECONDARY-ONLY.

## 11. Payment frequency

- **id:** `sp-payment-frequency`
- **Definition:** How often, and for which period, the State Pension is paid.
- **Value:** Usually every 4 weeks, in arrears, on a weekday set by the last 2 digits of the National Insurance number (00-19 Monday; 20-39 Tuesday; 40-59 Wednesday; 60-79 Thursday; 80-99 Friday).
- **Population / geography:** Both systems; regulations extend to England, Wales and Scotland. Abroad: choice of every 4 or 13 weeks.
- **Sources and quotes:**
  - https://www.gov.uk/new-state-pension/when-youre-paid - "The new State Pension is usually paid into your account every 4 weeks."
  - Same page - "Your first payment will be no later than 5 weeks after the date you choose."
  - https://www.gov.uk/state-pension/when-youre-paid - "The basic State Pension is usually paid every 4 weeks into an account of your choice."
  - Social Security (Claims and Payments) Regulations 1987, S.I. 1987/1968, reg 22CA(2): "State pension is to be paid in arrears." https://www.legislation.gov.uk/uksi/1987/1968/regulation/22CA
  - Same regulations, reg 22C(2) (retirement pension, people reaching pensionable age on or after 6 April 2010): "paid weekly, fortnightly or four weekly (as the Secretary of State may in any case determine) in arrears". https://www.legislation.gov.uk/uksi/1987/1968/regulation/22C
  - https://www.gov.uk/state-pension-if-you-retire-abroad - "You can choose to be paid every 4 or 13 weeks."
- **Retrieved:** 2026-09-29. **Classification:** Published rule.
- **Caveats:** D5. Reg 22C covers those reaching pensionable age on or after 6 April 2010; the rule for older basic State Pension recipients (who may be paid differently, including weekly in advance) was not fetched. A DWP easy-read leaflet (NSP3ER 01/22) says "Your payment will be for the past 4 weeks" but it dates from January 2022. Payment may be earlier around bank holidays. State Pension under GBP 5 a week abroad is paid once a year in December.
- **Check status:** FETCHED-AND-QUOTED.

## 12. Pension Credit and other help

### 12a. Pension Credit eligibility and rates

- **id:** `pension-credit-2026-27`
- **Definition:** Income-related benefit topping up weekly income for people over State Pension age on a low income.
- **Values 2026/27 (GBP per week):** Guarantee Credit tops income up to 238.00 (single) or 363.25 (couple). Savings Credit up to 17.96 (single) or 20.10 (couple). Severe disability addition 86.05. Carer addition 48.15.
- **Eligibility outline:** Live in England, Scotland or Wales; reached State Pension age; for couples, both have reached State Pension age (or one gets Housing Benefit for people over State Pension age). Savings of GBP 10,000 or less are ignored; every GBP 500 above counts as GBP 1 a week income. Savings Credit only if State Pension age was reached before 6 April 2016.
- **Source:** DWP, GOV.UK guide "Pension Credit". https://www.gov.uk/pension-credit - `public_updated_at` 2024-10-14; `updated_at` 2026-09-09. Rates cross-checked to record 3.
- **Quotes:** "Pension Credit tops up: your weekly income to £238 if you’re single, your joint weekly income to £363.25 if you have a partner". / "You’ll get up to £17.96 Savings Credit a week if you’re single."
- **Geography:** Great Britain (Northern Ireland has its own scheme). **Effective from:** first benefit week on or after 6 April 2026 (Order art 1(3)(k)). **Basis:** Weekly. The tax status of Pension Credit was not checked.
- **Retrieved:** 2026-09-29. **Classification:** Published rate / rule.
- **Caveats:** State Pension counts as income for Pension Credit. The full new State Pension (GBP 241.30) is above the single standard minimum guarantee (GBP 238.00), so a single person on the full new rate does not qualify on the standard guarantee alone, but may through additions. Tax status of Pension Credit was not checked.
- **Check status:** FETCHED-AND-QUOTED.

### 12b. Pension Credit take-up

- **id:** `pension-credit-take-up-fye2024`
- **Definition:** Estimated share of entitled pensioners who claim Pension Credit.
- **Values:** Caseload take-up 62% (FYE 2023: 65%). Expenditure take-up 71% (FYE 2023: 78%). Up to 910,000 entitled families not claiming. Up to GBP 2.5 billion unclaimed. Average around GBP 2,600 a year per non-claiming family.
- **Reference period:** Financial year ending 2024 (April 2023 to March 2024).
- **Population / geography:** Entitled pensioner population, Great Britain. Not available below GB level.
- **Publisher / title:** DWP, "Income-related benefits: estimates of take-up: financial year ending 2024".
- **URL:** https://www.gov.uk/government/statistics/income-related-benefits-estimates-of-take-up-financial-year-ending-2024/income-related-benefits-estimates-of-take-up-financial-year-ending-2024
- **Published:** 30 October 2025. **Retrieved:** 2026-09-29.
- **Quote:** "62% of those entitled to Pension Credit claimed the benefit in FYE 2024, which was a decrease from FYE 2023, when 65% claimed the benefit – this difference is not statistically significant".
- **Classification:** Estimate (survey-based, with confidence intervals).
- **Caveats:** This is the latest release at retrieval. The collection page says the FYE 2025 estimates "will be published 22 October 2026" - after the retrieval date, so this record will go stale within weeks. The "up to" figures are upper bounds. Methodology changed from FYE 2024 and was not backdated. The expenditure fall is statistically significant; the caseload fall is not. Figures pre-date the 2024 Winter Fuel Payment change and any resulting rise in claims.
- **Check status:** FETCHED-AND-QUOTED.

### 12c. Housing Benefit and Council Tax Reduction

- **id:** `housing-benefit-and-ctr`
- **Housing Benefit:** New claims only if State Pension age has been reached, or in supported, sheltered or temporary housing. Source: https://www.gov.uk/housing-benefit (`public_updated_at` 2024-10-17). Quote: "You can only make a new claim for Housing Benefit if either of the following apply: you have reached State Pension age".
  - Take-up (same DWP release as 12b): 85% of entitled pensioners claimed in FYE 2024; up to 230,000 pensioner families not claiming.
- **Council Tax Reduction:** Run by local councils; rules vary by area. Source: https://www.gov.uk/apply-council-tax-reduction (`public_updated_at` 2022-05-27). Quote: "You could be eligible if you’re on a low income or claim benefits. Your bill could be reduced by up to 100%."
- **Geography:** Housing Benefit guide - Great Britain. Council Tax Reduction - England, Scotland, Wales; "There’s a different scheme in Northern Ireland."
- **Classification:** Published rule; take-up is an estimate. **Retrieved:** 2026-09-29.
- **Caveats:** No national rate exists for either; amounts are case-specific.
- **Check status:** FETCHED-AND-QUOTED.

### 12d. Attendance Allowance

- **id:** `attendance-allowance-2026-27`
- **Values:** Lower rate GBP 76.70 a week; higher rate GBP 114.60 a week. (2025/26: 73.90; 110.40.)
- **Population:** People of State Pension age or older with a disability or health condition needing care or supervision; not means-tested.
- **Geography:** England and Wales (Scotland: Pension Age Disability Payment).
- **Effective from:** 6 April 2026 (Order art 7(4)).
- **Source:** DWP, https://www.gov.uk/attendance-allowance and record 3. Quote: "You could get £76.70 or £114.60 a week to help with personal support".
- **Classification:** Published rate. **Retrieved:** 2026-09-29.
- **Check status:** FETCHED-AND-QUOTED.

### 12e. Winter Fuel Payment (winter 2026 to 2027)

- **id:** `winter-fuel-payment-2026-27`
- **Values:** Between GBP 100 and GBP 300. Born on or before 27 June 1960. Qualifying week 21 to 27 September 2026. Living alone: GBP 200 (born 28 September 1946 to 27 June 1960) or GBP 300 (born before 28 September 1946). Claim deadline 31 March 2027.
- **Income rule:** The payment is made regardless of income, but is recovered through the tax system where the individual's total income is over GBP 35,000. A partner's income does not count.
- **Geography:** England, Wales and Northern Ireland. Scotland: Pension Age Winter Heating Payment instead.
- **Sources and quotes:**
  - DWP, https://www.gov.uk/winter-fuel-payment - `public_updated_at` 2024-11-04; `updated_at` 2026-09-25. "If your total income is over £35,000, HMRC will take your Winter Fuel Payment back. Your partner’s income does not count towards your total."
  - Finance Act 2026, s.57 and Sch 10 para 1 (ENACTED, Royal Assent 18 March 2026): charge applies if "P’s total income for the tax year exceeds £35,000" and "The amount of the charge is equal to the amount of the winter fuel payment." https://www.legislation.gov.uk/ukpga/2026/11/schedule/10
  - The Social Fund Winter Fuel Payment Regulations 2025, S.I. 2025/969, made 22 August 2025, in force 15 September 2025. https://www.legislation.gov.uk/uksi/2025/969/made (existence and dates confirmed; eligibility provisions not read in detail).
  - HMRC policy paper "Winter Fuel Payments charge", 26 November 2025: recovery "through PAYE tax codes unless they already file a Self Assessment tax return". https://www.gov.uk/government/publications/income-tax-charge-on-winter-fuel-payments/winter-fuel-payments-charge
- **Classification:** Published rule / rate. **Retrieved:** 2026-09-29.
- **Caveats:** People on Pension Credit and certain other income-related benefits in the qualifying week are exempt from the charge. HMRC's policy paper says PAYE deductions in 2027 to 2028 "will temporarily rise" because two winters are recovered in one year. People can opt out of receiving the payment. It was not checked whether the 2025 Regulations have been amended for winter 2026.
- **Check status:** FETCHED-AND-QUOTED (S.I. 2025/969 detailed provisions: not read).

### 12f. Free TV licence

- **id:** `free-tv-licence-pension-credit`
- **Rule:** Free TV licence for people aged 75 or over who get Pension Credit, or who live with a partner who gets it.
- **Source:** https://www.gov.uk/free-discount-tv-licence - `public_updated_at` 2017-04-01; `updated_at` 2026-09-17. Quote: "If you’re 75 or over and you get Pension Credit, you can get a free TV licence."
- **Geography:** UK (as presented on GOV.UK). **Classification:** Published rule. **Retrieved:** 2026-09-29.
- **Caveats:** TV licence fee amount not researched.
- **Check status:** FETCHED-AND-QUOTED.

## 13. How the State Pension is financed

- **id:** `ni-fund-financing`
- **Definition:** The State Pension is paid from the National Insurance Fund, which is financed from current National Insurance contributions rather than from invested savings.
- **Primary passage:** HMRC, "Great Britain National Insurance Fund Account for the year ended 31 March 2025", published 27 November 2025. https://www.gov.uk/government/publications/national-insurance-fund-accounts
  - Quote: "The National Insurance scheme is financed on a pay as you go basis with contribution rates set at a level broadly necessary to meet the expected benefits expenditure in that year".
  - Quote: "a working balance is necessary as the NIF has no borrowing powers."
- **Projections (forecast, not observed):** Government Actuary's Department, "Report by the Government Actuary on: The draft Social Security Benefits Up-rating Order 2026; and the draft Social Security (Contributions) Regulations 2026", dated 13 January 2026. https://www.gov.uk/government/publications/report-to-parliament-on-the-2026-re-rating-and-up-rating-orders
  - 2026-2027 projected Fund income GBP 173.6 billion; expenditure GBP 161.6 billion; balance at 31 March 2027 GBP 101.6 billion.
  - Quote (para 1.12): balance "will be around 64% of estimated benefit expenditure of £159.9 billion".
  - Quote (Note 3): "Fund income represents around 80% of NICs, with the balance being paid to the NHS."
  - Quote (para 1.12): "A Treasury Grant was last paid in the 2015-2016 financial year."
- **Population / geography:** Great Britain National Insurance Fund (Northern Ireland has a separate Fund).
- **Reference period:** Account year ended 31 March 2025; projections to 2030-2031.
- **Classification:** Published rule (financing basis); forecast (GAD projections).
- **Retrieved:** 2026-09-29.
- **Caveats:** The Fund pays other contributory benefits as well as the State Pension. Non-contributory pensions (Category C/D) and Pension Credit are not contributory benefits; their funding source was not checked. GAD figures are projections on stated assumptions. The URL slug of the HTML account page says "2024" but the title says year ended 31 March 2025. GAD's news release notes longer-term demographic pressure and that the Triple Lock raises expenditure relative to income.
- **Check status:** FETCHED-AND-QUOTED.

## 14. Overseas up-rating ("frozen pensions")

- **id:** `overseas-uprating-frozen`
- **Definition:** Whether the State Pension receives annual increases when the recipient lives outside the UK.
- **Rule:** Annual increases are paid only to people living in the European Economic Area, Gibraltar, Switzerland, or a country with a UK social security agreement that provides for it (Canada and New Zealand excluded). Elsewhere the pension stays at the rate first paid abroad. It rises to the current rate on return to live in the UK.
- **Sources and quotes:**
  - DWP, GOV.UK guide "State Pension if you retire abroad", part "How your pension is affected". https://www.gov.uk/state-pension-if-you-retire-abroad/rates-of-state-pension - `public_updated_at` 2024-11-06; `updated_at` 2026-09-09.
    - "countries that have a social security agreement with the UK (but you cannot get increases in Canada or New Zealand)"
    - "You will not get yearly increases if you live outside these countries."
    - "Your pension will go up to the current rate if you return to live in the UK."
  - State Pension Regulations 2015, S.I. 2015/173, reg 21(1): "An overseas resident who is entitled to a state pension under Part 1 of the 2014 Act is not entitled to up-rating increases in accordance with this regulation." https://www.legislation.gov.uk/uksi/2015/173/regulation/21
  - The Social Security Benefits Up-rating Regulations 2026, S.I. 2026/218, made 4 March 2026, in force 6 April 2026, reg 3 ("Persons not ordinarily resident in Great Britain") applies reg 21 and the Persons Abroad Regulations 1975 reg 5 to the 2026 increases. https://www.legislation.gov.uk/uksi/2026/218/made
- **Population:** State Pension recipients resident overseas. **Geography:** Worldwide by country of residence.
- **Effective period:** Applies to the April 2026 up-rating; re-applied each year by regulations.
- **Classification:** Published rule. **Retrieved:** 2026-09-29.
- **Caveats:** The number of people affected, the cost of unfreezing, and the government's stated policy position were NOT fetched from a primary source. A Commons Library briefing (SN01457, "Frozen Overseas Pensions") exists but returned HTTP 403; its points (policy "longstanding", cost estimates of GBP 600 million for 2019/20) were seen only in a search snippet - SECONDARY-ONLY and dated. The list of agreement countries that do provide up-rating was not fetched. "Frozen" is the common term, not GOV.UK wording.
- **Check status:** FETCHED-AND-QUOTED (rule). Numbers affected and cost: SECONDARY-ONLY / NOT-FOUND.

---

## Source list

| Source | Publisher | URL | Date shown / API date |
|---|---|---|---|
| The new State Pension (guide) | DWP | https://www.gov.uk/new-state-pension | public_updated_at 2025-01-31 |
| The basic State Pension (guide) | DWP | https://www.gov.uk/state-pension | public_updated_at 2015-03-17 |
| Over 80 pension (guide) | DWP | https://www.gov.uk/over-80-pension | public_updated_at 2015-04-06 |
| Benefit and pension rates 2026 to 2027 | DWP | https://www.gov.uk/government/publications/benefit-and-pension-rates-2026-to-2027 | Published 2025-11-27; updated 2026-02-16 |
| Social Security Benefits Up-rating Order 2026, S.I. 2026/148 | UK Statutory Instrument | https://www.legislation.gov.uk/uksi/2026/148/contents/made | Made 2026-03-02 |
| Social Security Benefits Up-rating Regulations 2026, S.I. 2026/218 | UK Statutory Instrument | https://www.legislation.gov.uk/uksi/2026/218/made | Made 2026-03-04 |
| Your new State Pension explained | DWP | https://www.gov.uk/government/publications/your-new-state-pension-explained | Updated 2026-04-06 |
| Contracted out of the Additional State Pension | DWP | https://www.gov.uk/contracted-out | public_updated_at 2024-11-08 |
| National Insurance credits (guide) | HMRC/DWP | https://www.gov.uk/national-insurance-credits | public_updated_at 2025-01-21 |
| State Pension age timetable | DWP | https://www.gov.uk/government/publications/state-pension-age-timetable | Updated 2014-05-15 |
| Third State Pension age review (collection) | DWP | https://www.gov.uk/government/collections/third-state-pension-age-review | Published 2025-07-21; updated 2025-08-18 |
| Pensions Act 2014 s.27 | UK Public General Act | https://www.legislation.gov.uk/ukpga/2014/19/section/27 | Latest available version |
| Defer (delay) your State Pension (guide) | DWP | https://www.gov.uk/deferring-state-pension | public_updated_at 2024-11-08 |
| Additional State Pension (guide) | DWP | https://www.gov.uk/additional-state-pension | public_updated_at 2015-04-06 |
| EIM75700 | HMRC | https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim75700 | Updated 2022-03-28 |
| How your State Pension is taxed | HMRC | https://www.gov.uk/guidance/how-your-state-pension-is-taxed | Published 2026-07-07 |
| Income Tax rates and Personal Allowances | HMRC | https://www.gov.uk/income-tax-rates | public_updated_at 2024-11-07 |
| Tax when you get a pension (guide) | HMRC/DWP | https://www.gov.uk/tax-on-pension | public_updated_at 2024-11-11 |
| Budget 2025 (HTML) | HM Treasury | https://www.gov.uk/government/publications/budget-2025-document/budget-2025-html | Published 2025-11-26; updated 2025-11-28 |
| Finance Act 2026 (c. 11) | UK Public General Act | https://www.legislation.gov.uk/ukpga/2026/11/contents | Royal Assent 2026-03-18 |
| Claims and Payments Regulations 1987, regs 22C, 22CA | UK Statutory Instrument | https://www.legislation.gov.uk/uksi/1987/1968/regulation/22CA | Latest available version |
| Pension Credit (guide) | DWP | https://www.gov.uk/pension-credit | public_updated_at 2024-10-14 |
| Income-related benefits: estimates of take-up: FYE 2024 | DWP | https://www.gov.uk/government/statistics/income-related-benefits-estimates-of-take-up-financial-year-ending-2024 | Published 2025-10-30 |
| Housing Benefit (guide) | DWP | https://www.gov.uk/housing-benefit | public_updated_at 2024-10-17 |
| Apply for Council Tax Reduction | GOV.UK | https://www.gov.uk/apply-council-tax-reduction | public_updated_at 2022-05-27 |
| Attendance Allowance (guide) | DWP | https://www.gov.uk/attendance-allowance | public_updated_at 2024-10-21 |
| Winter Fuel Payment (guide) | DWP | https://www.gov.uk/winter-fuel-payment | public_updated_at 2024-11-04 |
| Winter Fuel Payments charge | HMRC | https://www.gov.uk/government/publications/income-tax-charge-on-winter-fuel-payments/winter-fuel-payments-charge | Published 2025-11-26 |
| Social Fund Winter Fuel Payment Regulations 2025, S.I. 2025/969 | UK Statutory Instrument | https://www.legislation.gov.uk/uksi/2025/969/made | Made 2025-08-22 |
| Get a free or discounted TV licence | GOV.UK | https://www.gov.uk/free-discount-tv-licence | public_updated_at 2017-04-01 |
| Great Britain National Insurance Fund Account, year ended 31 March 2025 | HMRC | https://www.gov.uk/government/publications/national-insurance-fund-accounts | Published 2025-11-27 |
| Report by the Government Actuary on the draft Up-rating Order 2026 | GAD | https://www.gov.uk/government/publications/report-to-parliament-on-the-2026-re-rating-and-up-rating-orders | 2026-01-13 |
| State Pension if you retire abroad (guide) | DWP | https://www.gov.uk/state-pension-if-you-retire-abroad | public_updated_at 2024-11-06 |
| State Pension Regulations 2015, reg 21 | UK Statutory Instrument | https://www.legislation.gov.uk/uksi/2015/173/regulation/21 | Latest available version |

## Not verified - do not publish without a further check

1. Any 2027/28 State Pension rate, or any statement that the State Pension "will" exceed the Personal Allowance in 2027/28 (secondary sources and forecasts only).
2. The 12 January 2026 ministerial statement on State Pension-only pensioners and Income Tax (Hansard not fetched).
3. All House of Commons Library content (HTTP 403): CBP-10250, SN01457, SN04517, SN00260.
4. Whether the third State Pension age review has reported (nothing found on GOV.UK; absence not proven).
5. The term and definition of "COPE".
6. Numbers of overseas pensioners with frozen pensions and the cost of up-rating them.
7. That the 3.8% applied to additional pension and GRB is formally "CPI" (stated on GOV.UK for protected payment and deferral increments only).
8. Payment arrangements for basic State Pension recipients who reached pensionable age before 6 April 2010.
9. Northern Ireland rates and instruments (S.R. 2026/59 noted, not read).
10. Tax status of Pension Credit; TV licence fee.
