# 02 — Triple lock, legal uprating requirement, and rate history

Retrieved: 2026-09-29. Machine-readable companion: `02-history-data.json`.

Check status values: **FQ** = FETCHED-AND-QUOTED, **SEC** = SECONDARY-ONLY, **NF** = NOT-FOUND.

## Read this first: what was and was not checked

- **Fetched directly (primary):** legislation.gov.uk (SSAA 1992 ss150, 150A, 151A; Up-rating Acts 2020 and 2021; Social Security Act 1980 s1; Pensions Act 2007 s5; SI 2010/2650; all 17 Up-rating Orders 2010-2026 and their Explanatory Memoranda); GOV.UK (DWP rates publications 2014/15 to 2026/27; DWP Abstract of benefit rate statistics 2025 and its methodology statement; Budgets June 2010, Autumn 2024, 2025; Coalition programme); Parliament written statements API (uprating statements 2015-2025); ONS series CSVs and archived vintages.
- **Not retrievable: House of Commons Library CBP-7812 and SN05649.** `commonslibrary.parliament.uk`, `researchbriefings.files.parliament.uk`, `hansard.parliament.uk` and `publications.parliament.uk` all returned a bot-verification challenge (HTTP 403). I did not attempt to get round it. Nothing in this document rests on the Commons Library. Someone needs to open those two briefings in a browser to cross-check.
- **Not found:** ONS release dates for 2010-2015; ONS first-published earnings figures before September 2016 (the ONS version archive for KAC3 starts December 2015); party manifesto texts; an authoritative source on the 2023 "including or excluding bonuses" debate.
- Effective dates: article 1 of each Order was read in full for 2015, 2016 and 2026. For the other years the date was taken from the dates appearing in article 1 and confirmed to be a Monday; 2021, 2022, 2024 and 2025 are also confirmed by the ministerial statements.

---

## A. The rule

### A1. Legal requirement (all FQ, legislation.gov.uk, revised text retrieved 2026-09-29)

| Provision | What it covers | Minimum | Verbatim |
|---|---|---|---|
| SSAA 1992 s150A(1)-(2) | Full rate of new State Pension; basic pension; specified Category B, C, D amounts; specified industrial death benefit amounts; Pension Credit standard minimum guarantee | Earnings | "increases each of the amounts referred to in subsection (1) above by a percentage not less than the percentage by which the general level of earnings is greater at the end of the period" |
| s150A(8) | Discretion over the earnings measure | — | "the Secretary of State shall estimate the general level of earnings in such manner as he thinks fit" |
| s150A(4) | Rounding power | — | "adjust the amount of the increase so as to round the sum in question up or down to such extent as he thinks appropriate" |
| s150A(7) | Effective date | — | "in the week beginning with the first Monday in the tax year following that in which the order is made" |
| s150(1)-(3) | Additional pension (1)(c); shared additional pension; Schedule 5 increments (1)(d); increments to new State Pension under s17 Pensions Act 2014 (1)(p) | Prices (for sums within subsection (3)) | "by a percentage not less than the percentage by which the general level of prices is greater at the end of the period" |
| s151A(2)-(3) | Pensions Act 2014 s9, Sch 2 para 4(3), Sch 4 paras 5(3) and 6, Sch 9 paras 5(3) and 6 (transitional amounts above the full rate, i.e. protected payments, and inherited amounts) | Prices | "The percentage specified in the order must not be less than the percentage by which the general level of prices has increased during the review period." |

URLs: https://www.legislation.gov.uk/ukpga/1992/5/section/150 , `/section/150A` , `/section/151A`.

Caveat on s150: subsection (1)(p) (increments to new State Pension) is in the review list but is not listed in subsection (3), so on the text fetched the mandatory prices floor in s150(2)(a) does not reach it; it is uprated under the s150(2)(b) discretion. In practice DWP applies CPI (see A2). I did not find an official statement explaining this; treat as my reading of the statute.

Note that s150A has no floor when earnings do not rise. DWP Abstract 2025 (FQ): s150A "prevents the Secretary of State from bringing forward an Up-rating Order if earnings growth is negative."

### A2. The triple lock commitment

| Item | Finding | Status | Source |
|---|---|---|---|
| Definition | "a government commitment to up-rate the basic and new State Pensions every year by the highest of earnings growth, inflation, or 2.5%" | FQ | DWP, Abstract of DWP benefit rate statistics 2025 (published 2026-01-28), glossary |
| Policy, not statute | "The statutory minimum increase to the basic State Pension is the rise in earnings. The government has given a commitment to increase the basic State Pension in line with the Triple Lock" | FQ | EM to SI 2026/148, para 5.3 |
| Announced | Coalition programme, 20 May 2010: "restore the earnings link for the basic state pension from April 2011, with a 'triple guarantee' that pensions are raised by the higher of earnings, prices or 2.5%" | FQ | GOV.UK, The Coalition: our programme for government |
| Confirmed | June 2010 Budget (22 June 2010), para 1.107: "CPI will be used as the measure of prices in the triple guarantee" and the basic pension will rise "in April 2011 by at least the equivalent of RPI" | FQ | HM Treasury, Budget June 2010 |
| First applied | April 2011 (with RPI as the prices measure that year only); CPI from April 2012 | FQ | DWP Abstract 2025 Table 1; EM to SI 2011/821 para 7.4 |
| Prices measure | CPI annual rate, year to September | FQ | EM 2026 para 6.4: "the increase in the Consumer Prices Index (“CPI”) in the year to September 2025" |
| Earnings measure | AWE, whole economy, total pay (including bonuses), seasonally adjusted, three-month average May-July, year on year. ONS series KAC3 | FQ | EM 2020 fn: "Average Weekly Earnings (AWE) revised statistic, whole economy, including bonuses, seasonally adjusted"; DWP Abstract Note 16: "the May-July seasonally adjusted total pay figures"; Abstract Table 5 column header "Earnings (KAC3)" |
| Which vintage | The **revised** figure from the October ONS release, not the September first estimate | FQ | EM 2025 fn 7: "The year to May-July 2024 AWE figure was adjusted upwards to 4.1% (from 4.0%) in the October statistics release." |

Components:

| Component | Rule | Status | Source |
|---|---|---|---|
| Basic State Pension (Category A/B full rate) | Triple lock; statutory floor earnings | FQ | EM 2026 para 5.3 |
| Full rate of new State Pension | Triple lock; statutory floor earnings | FQ | EM 2026 para 5.6 |
| New State Pension below the full rate | Uprated by the exact ratio of new to old full rate after rounding (4.7991% in 2026/27, not 4.8%) | FQ | DWP rates 2026/27, "Transitional rate below full rate 4.0913% 4.7991%"; EM 2019 fn: "accounting for the rounding of the full rate to the nearest five pence" |
| Protected payment | CPI: 3.80% in 2026/27 | FQ | DWP rates 2026/27; DWP Abstract: "Protected payments are up-rated in line with CPI" |
| Additional State Pension | CPI: 3.80% in 2026/27 | FQ | DWP rates 2026/27; HCWS1101 |
| Deferral increments (old and new) | CPI: 3.80% in 2026/27 | FQ | DWP rates 2026/27, rows "Increments - own", "Increments - inherited" |
| Pension Credit standard minimum guarantee | Statutory floor earnings (s150A(1)(d)); **not** covered by the triple lock; government has often paid more | FQ | HCWS268 (2017): "The legislative requirement ... is that it is increased at least in line with earnings"; DWP Abstract: 1.9% in April 2021, CPI in 2022 and 2023, 8.5%, 4.1%; HCWS1101: 4.8% in 2026 |

### A3. Timing

| Step | Finding | Status |
|---|---|---|
| Earnings reference period | May-July, compared with May-July a year earlier | FQ |
| Prices reference period | 12 months to September | FQ |
| AWE first release | Mid-September. Dates from ONS CSV vintages: 14-09-2016, 13-09-2017, 11-09-2018, 10-09-2019, 15-09-2020, 14-09-2021, 13-09-2022, 12-09-2023, 10-09-2024, 16-09-2025, 15-09-2026 | FQ |
| AWE revised release | Mid-October: 19-10-2016, 18-10-2017, 16-10-2018, 15-10-2019, 13-10-2020, 12-10-2021, 11-10-2022, 15-10-2024, 14-10-2025; next 20-10-2026. No October 2023 vintage is in the archive (next vintage 14-11-2023) | FQ |
| September CPI release | Mid-October: 18-10-2016, 17-10-2017, 17-10-2018, 16-10-2019, 21-10-2020, 20-10-2021, 19-10-2022, 18-10-2023, 16-10-2024, 22-10-2025; next 21-10-2026. Inferred from the date each archived D7G7 version was superseded | FQ (inferred from archive) |
| 2010-2015 release dates | — | NF |
| Secretary of State's announcement | Written statements: 26-11-2015, 28-11-2016, 27-11-2017, 23-11-2018, 04-11-2019, 25-11-2020, 25-11-2021, 17-11-2022, 22-11-2023, 30-10-2024, 26-11-2025 | FQ |
| Order | Draft laid, approved by both Houses (s150A(6)) | FQ |
| Effect | "the first full week of the tax year" (HCWS287 and others); statute: week beginning with the first Monday in the tax year | FQ |

### A4. Rounding

**Authoritative statement found (FQ).** EM to SI 2018/281, para 4.11: "Each benefit has an individual rounding convention for how new rates are calculated. The majority of new rates are rounded to the nearest 5p. This includes, for example, the standard (full) rates of Category A and Category B basic State Pension and the full rate of new State Pension." Same wording in the 2017 and 2019-2024 EMs and (without the example) 2026.

DWP, "Gain from the triple guarantee" (July 2011) (FQ): "At each uprating, the projected full bSP rate is rounded to the nearest 5p."

**Disagreement:** EM to SI 2025/295 para 5.13 says "rounded **up** to the nearest 5 pence". That year's new State Pension was rounded **down** (230.2692 to 230.25), so the 2025 wording is contradicted by the rates it accompanied. Use nearest 5p.

Model specification: `new_rate = round_to_nearest_0.05(previous_published_rate * (1 + pct/100))`, applied to the previous **published** (already rounded) rate. No year produced an exact half-way case, so the tie-breaking rule is untested.

---

## B. Year-by-year table

Sources: rates 2010/11-2013/14 from the Order EMs; 2014/15-2026/27 from the DWP rates publications; all basic rates to 2025/26 cross-checked against DWP Abstract 2025 Table 6, and new State Pension against Table 8 (all agree). Percentage, measure, CPI and earnings from the EM for each year. All cells FQ unless marked. URLs for every cell are in the JSON.

| Tax year | Basic SP | New SP | Applied | Measure | CPI Sept | Earnings used | Effective (Monday) |
|---|---|---|---|---|---|---|---|
| 2010/11 | 97.65 | — | 2.5% | 2.5% (pre-triple-lock) | not a test | not a test | 12 Apr 2010 |
| 2011/12 | 102.15 | — | 4.6% | RPI (one-off) | 3.1 | 1.3 | 11 Apr 2011 |
| 2012/13 | 107.45 | — | 5.2% | CPI | 5.2 | 2.8 | 9 Apr 2012 |
| 2013/14 | 110.15 | — | 2.5% | 2.5% | 2.2 | 1.6 | 8 Apr 2013 |
| 2014/15 | 113.10 | — | 2.7% | CPI | 2.7 | 1.2 | 7 Apr 2014 |
| 2015/16 | 115.95 | — | 2.5% | 2.5% | 1.2 | 0.6 | 6 Apr 2015 |
| 2016/17 | 119.30 | 155.65 | 2.9% | Earnings | -0.1 | 2.9 | 11 Apr 2016 (new SP from 6 Apr 2016) |
| 2017/18 | 122.30 | 159.55 | 2.5% | 2.5% | 1.0 | 2.4 | 10 Apr 2017 |
| 2018/19 | 125.95 | 164.35 | 3.0% | CPI | 3.0 | 2.2 | 9 Apr 2018 |
| 2019/20 | 129.20 | 168.60 | 2.6% | Earnings | 2.4 | 2.6 | 8 Apr 2019 |
| 2020/21 | 134.25 | 175.20 | 3.9% | Earnings | 1.7 | 3.9 | 6 Apr 2020 |
| 2021/22 | 137.60 | 179.60 | 2.5% | 2.5% (2020 Act) | 0.5 | -1.0 | 12 Apr 2021 |
| 2022/23 | 141.85 | 185.15 | 3.1% | CPI (2021 Act) | 3.1 | 8.3 set aside | 11 Apr 2022 |
| 2023/24 | 156.20 | 203.85 | 10.1% | CPI | 10.1 | 5.5 | 10 Apr 2023 |
| 2024/25 | 169.50 | 221.20 | 8.5% | Earnings | 6.7 | 8.5 | 8 Apr 2024 |
| 2025/26 | 176.45 | 230.25 | 4.1% | Earnings | 1.7 | 4.1 | 7 Apr 2025 |
| 2026/27 | 184.90 | 241.30 | 4.8% | Earnings | 3.8 | 4.8 | 6 Apr 2026 |
| 2027/28 | **not determined** | **not determined** | — | — | Sept 2026 CPI due 21 Oct 2026 | input only: 3.9 (first estimate) | — |

**2027/28:** ONS, 15 September 2026: "Annual growth in total earnings (including bonuses) was 3.9% in May to July 2026". This is an input, not a decision, and the figure used has in past years been the October revision. August 2026 CPI was 3.1%. Press projections of 2027/28 rates seen in search results are not official and are not recorded here.

### Exceptional years

- **2010/11.** EM to SI 2010/793 para 7.2: increased "by 2.5% in line with the Government's commitment to up-rate basic State Pension by the higher of 2.5% or growth in the RPI (increasing the standard rate by £2.40 from £95.25 to £97.65 a week)". RPI to September 2009 was -1.4% (DWP Abstract Table 5).
- **2011/12: yes, RPI was used.** EM to SI 2011/821 para 7.4: "increased in line with the growth in the RPI for the 12 months to September 2010, which was 4.6%". DWP Abstract Note 17: CPI replaced RPI "with the exception of the basic State Pension, which retained RPI for that year only."
- **2021/22.** Social Security (Up-rating of Benefits) Act 2020 (c. 23), Royal Assent 23 November 2020, inserted a one-year s150A(2A): where earnings are "no greater", the Secretary of State "may ... lay before Parliament the draft of an order which increases each of the amounts ... by such a percentage as the Secretary of State thinks fit." EM 2021 fn 5: AWE "showed a fall of 1.0 per cent for the quarter ending July 2020."
- **2022/23.** Social Security (Up-rating of Benefits) Act 2021 (c. 32), Royal Assent 17 November 2021: for that year the review is "by reference to the general level of prices", with an increase "not less than 2.5%" where prices rose by less. Earnings set aside: 8.3% (DWP methodology statement: "exceptional earnings growth (8.3%)"; ONS vintages of 14-09-2021 and 12-10-2021). DWP Abstract Note 50: "The presented earnings figure of 8.3% has since been revised to 8.6%". Current series: 8.4.
- **2023/24.** EM 2023 para 6.7: "growth in Average Weekly Earnings in the year to May-July 2022 (5.5%)"; CPI 10.1% applied.
- **2024/25.** Total pay, including bonuses. ONS, 12 September 2023: total pay 8.5% "is affected by the NHS and civil service one-off payments made in June and July 2023"; regular pay 7.8%. The 8.5% was revised to 8.3 in the September and October 2024 vintages and is 8.5 in the current series. No primary source fetched for the public debate itself (NF).
- **2025/26.** First estimate 4.0% (10-09-2024), revised to 4.1% (15-10-2024); 4.1% used.
- **2026/27.** Confirmed 4.8%, earnings. HCWS1101, 26 November 2025: "the basic and new State Pensions will be increased by 4.8%, in line with the increase in average weekly earnings in the year to May-July 2025."

### Arithmetic check

Nearest-5p rounding reproduces **every** published rate (27 of 27). Rounding up alone or down alone does not; nearest penny matches only three.

| Year | Basic: unrounded | Published | Direction | New SP: unrounded | Published | Direction |
|---|---|---|---|---|---|---|
| 2010/11 | 97.63125 | 97.65 | up | | | |
| 2011/12 | 102.14190 | 102.15 | up | | | |
| 2012/13 | 107.46180 | 107.45 | down | | | |
| 2013/14 | 110.13625 | 110.15 | up | | | |
| 2014/15 | 113.12405 | 113.10 | down | | | |
| 2015/16 | 115.92750 | 115.95 | up | | | |
| 2016/17 | 119.31255 | 119.30 | down | | 155.65 (set, not uprated) | |
| 2017/18 | 122.28250 | 122.30 | up | 159.54125 | 159.55 | up |
| 2018/19 | 125.96900 | 125.95 | down | 164.33650 | 164.35 | up |
| 2019/20 | 129.22470 | 129.20 | down | 168.62310 | 168.60 | down |
| 2020/21 | 134.23880 | 134.25 | up | 175.17540 | 175.20 | up |
| 2021/22 | 137.60625 | 137.60 | down | 179.58000 | 179.60 | up |
| 2022/23 | 141.86560 | 141.85 | down | 185.16760 | 185.15 | down |
| 2023/24 | 156.17685 | 156.20 | up | 203.85015 | 203.85 | down |
| 2024/25 | 169.47700 | 169.50 | up | 221.17725 | 221.20 | up |
| 2025/26 | 176.44950 | 176.45 | up | 230.26920 | 230.25 | down |
| 2026/27 | 184.91960 | 184.90 | down | 241.30200 | 241.30 | down |

Consequence for the model: when the rate rounds down, the actual increase is below the headline percentage (2026/27 basic: 4.7889%; 2019/20 basic: 2.5804% against earnings of 2.6%). Section 150A(4) permits this. The two pensions can round in opposite directions in the same year.

---

## C. ONS input series as currently published

All FQ. Retrieved 2026-09-29 from the ONS CSV generator.

- **KAC3** — "AWE: Whole Economy Year on Year Three Month Average Growth (%): Seasonally Adjusted Total Pay Excluding Arrears". Dataset LMS. Release 15-09-2026, next 20 October 2026. https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/timeseries/kac3/lms . The row labelled "YYYY JUL" is May-July.
- **D7G7** — "CPI ANNUAL RATE 00: ALL ITEMS 2015=100". Dataset MM23. Release 16-09-2026, next 21 October 2026. https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7g7/mm23
- **D7BT** — "CPI INDEX 00: ALL ITEMS 2015=100". Same dataset and dates. https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7bt/mm23

| Reference year | CPI Sept % (D7G7) | CPI index Sept (D7BT) | AWE May-Jul current (KAC3) | AWE used in decision | AWE first published | AWE October vintage | For tax year |
|---|---|---|---|---|---|---|---|
| 2009 | 1.1 | 87.1 | — | — | — | — | 2010/11 |
| 2010 | 3.1 | 89.8 | 1.2 | 1.3 | NF | NF | 2011/12 |
| 2011 | 5.2 | 94.4 | 2.8 | 2.8 | NF | NF | 2012/13 |
| 2012 | 2.2 | 96.5 | 1.5 | 1.6 | NF | NF | 2013/14 |
| 2013 | 2.7 | 99.1 | 1.2 | 1.2 | NF | NF | 2014/15 |
| 2014 | 1.2 | 100.3 | 0.5 | 0.6 | NF | NF | 2015/16 |
| 2015 | -0.1 | 100.2 | 2.8 | 2.9 | NF | NF | 2016/17 |
| 2016 | 1.0 | 101.1 | 2.5 | 2.4 | 2.3 | 2.4 | 2017/18 |
| 2017 | 3.0 | 104.1 | 2.2 | 2.2 | 2.1 | 2.2 | 2018/19 |
| 2018 | 2.4 | 106.6 | 2.7 | 2.6 | 2.6 | 2.6 | 2019/20 |
| 2019 | 1.7 | 108.5 | 4.0 | 3.9 | 4.0 | 3.9 | 2020/21 |
| 2020 | 0.5 | 109.1 | -0.9 | -1.0 | -1.0 | -1.0 | 2021/22 |
| 2021 | 3.1 | 112.4 | 8.4 | 8.3 (set aside) | 8.3 | 8.3 | 2022/23 |
| 2022 | 10.1 | 123.8 | 5.5 | 5.5 | 5.5 | 5.5 | 2023/24 |
| 2023 | 6.7 | 132.0 | 8.5 | 8.5 | 8.5 | 8.5 (14-11-2023 vintage) | 2024/25 |
| 2024 | 1.7 | 134.2 | 4.4 | 4.1 | 4.0 | 4.1 | 2025/26 |
| 2025 | 3.8 | 139.3 | 4.9 | 4.8 | 4.7 | 4.8 | 2026/27 |
| 2026 | not published | not published | 3.9 | not decided | 3.9 | due 20-10-2026 | 2027/28 |

The CPI September rates in the current series match the decision figure in every year. The earnings figure differs from the current series in 11 of the 16 decision years (2011/12 to 2026/27). A model that recomputes the lock from today's KAC3 will not reproduce the published percentages. The winning measure stays the same in each year, with one edge case: for 2017/18 the current earnings figure is 2.5, which ties with the 2.5% floor.

Latest observations: CPI August 2026 3.1% (index 143.6); KAC3 2026 JUL 3.9.

---

## D. Policy history

| Date | Event | Status | Source |
|---|---|---|---|
| 23 May 1980 | Social Security Act 1980 s1(1): in the annual review "the Secretary of State shall have regard only to prices" | FQ | https://www.legislation.gov.uk/ukpga/1980/30/section/1/enacted |
| 1974-1980 | Long-term benefits "linked to the higher of one of two annual increases, as measured by the Retail Prices Index (RPI) and the Average Earnings Index" | FQ | DWP Abstract methodology statement, Annex C |
| 2007 | Pensions Act 2007 s5 inserts s150A (earnings link), to start from a designated tax year | FQ | legislation.gov.uk annotation to s150A |
| 26 Oct 2010 | SI 2010/2650: "The designated tax year ... is the tax year 2010-11" | FQ | https://www.legislation.gov.uk/uksi/2010/2650/made |
| Pensions Act 2011 | I found **no** role for the 2011 Act in restoring the earnings link; the restoration is the 2007 Act plus SI 2010/2650. The 2011 Act appears in s150(1A) only for guaranteed minimum pensions | FQ (negative finding on the text fetched) | s150, s150A annotations |
| Before 2010 | "In the last Parliament, the basic State Pension was uprated by the higher of prices or 2.5 per cent." | FQ | Budget June 2010 para 1.107 |
| 20 May 2010 | Coalition programme: triple guarantee | FQ | see A2 |
| 22 Jun 2010 | Budget: triple guarantee from April 2011, CPI as prices measure | FQ | see A2 |
| 6 Apr 2016 | New State Pension introduced; full rate £155.65; s150A(1)(za) inserted by Pensions Act 2014 | FQ | DWP Abstract 2025; s150A annotation |
| 2016, 2020, 2022 | Ministers describe the lock as a "manifesto commitment" (HCWS287: "the Government's 'triple lock' manifesto commitment"; HCWS600; HCWS374) | FQ | Written statements |
| Manifesto texts | Not fetched | NF | — |
| 30 Oct 2024 | "The government will maintain the State Pension Triple Lock for the duration of this Parliament." | FQ | HM Treasury, Autumn Budget 2024, para 2.33 |
| 26 Nov 2025 | "its commitment to the Triple Lock for the duration of this Parliament" | FQ | HM Treasury, Budget 2025, para 2.21 |
| 4 Apr 2026 | "The Government's Triple Lock commitment means pensioners' incomes will rise by up to £2,100 over this parliament." | FQ | GOV.UK news, "Over 12 million pensioners to receive £575 State Pension boost" |

### What the triple lock is for (official statements only)

- Budget June 2010 para 1.107, on the RPI exception: "to ensure the value of a basic State Pension is at least as generous as under the previous uprating rules".
- Same paragraph, on Pension Credit: "To ensure the lowest income pensioners benefit from the triple guarantee".
- GOV.UK, 6 April 2025, Secretary of State: the commitment "gives pensioners across the country the certainty and security they need to live a full life in retirement."
- DWP Abstract 2025: since April 2011 "the value of the basic State Pension has either exceeded or kept pace with CPI inflation at the up-rating period".
- The Commons Library's account of the purpose could not be retrieved (NF). I found no single official statement of purpose from 2010; the above are the nearest.

---

## Disagreements between sources

1. **2026/27 earnings, first estimate.** EM to SI 2026/148 fn 10 says the figure "remained at 4.8% in the October statistics release". The ONS September 2025 bulletin says "4.7% in May to July 2025" and the ONS vintage of 16-09-2025 shows 4.7; the 14-10-2025 vintage shows 4.8. The EM footnote appears to be wrong. The decision figure (4.8%) is not affected.
2. **Rounding wording.** EM 2025 says "rounded up to the nearest 5 pence"; every other EM says "to the nearest"; the arithmetic supports nearest.
3. **2018/19 earnings.** DWP Abstract Table 5 shows 2.30%; the EM and the ONS October 2017 vintage show 2.2%. The EM is the decision document.
4. **2015 effective date.** DWP Abstract Table 5 shows 13-Apr-15; the Order (SI 2015/457 art 1(2)) says "on 6th April 2015". The Order governs. The Abstract's date column should not be used.
5. **EM 2021 footnote 12** repeats the previous year's rates ("£168.60 and £175.20") beside the correct 2.5114%. Drafting slip; the rates publication is correct.
6. **Revisions.** See section C.

## Source register

| Source | Publisher | Published | URL |
|---|---|---|---|
| Social Security Administration Act 1992 ss150, 150A, 151A | legislation.gov.uk | revised text | https://www.legislation.gov.uk/ukpga/1992/5/section/150A |
| Social Security (Up-rating of Benefits) Act 2020 | legislation.gov.uk | 2020-11-23 | https://www.legislation.gov.uk/ukpga/2020/23 |
| Social Security (Up-rating of Benefits) Act 2021 | legislation.gov.uk | 2021-11-17 | https://www.legislation.gov.uk/ukpga/2021/32 |
| Up-rating Orders and EMs: SI 2010/793, 2011/821, 2012/780, 2013/574, 2014/516, 2015/457, 2016/230, 2017/260, 2018/281, 2019/480, 2020/234, 2021/162, 2022/292, 2023/316, 2024/242, 2025/295, 2026/148 | legislation.gov.uk | annual | https://www.legislation.gov.uk/uksi/2026/148 (pattern) |
| Benefit and pension rates 2026 to 2027 | DWP | 2025-11-27, updated 2026-02-16 | https://www.gov.uk/government/publications/benefit-and-pension-rates-2026-to-2027 |
| Benefit and pension rates, earlier years | DWP | annual | per-year URLs in JSON |
| Abstract of DWP benefit rate statistics 2025, and data tables | DWP | 2026-01-28 | https://www.gov.uk/government/statistics/abstract-of-dwp-benefit-rate-statistics-2025 |
| Abstract methodology statement | DWP | updated 2026-01-28 | https://www.gov.uk/government/statistics/dwp-abstract-of-statistics-policies-and-statements |
| Written statements HCWS328, 287, 268, 1104, 74, 600, 420, 374, 63, 175, 1101 | UK Parliament | 2015-2025 | https://questions-statements.parliament.uk/written-statements/detail/2025-11-26/hcws1101 (pattern) |
| Average weekly earnings in Great Britain, September 2021, 2023, 2024, 2025, 2026; October 2024, 2025 | ONS | as dated | https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/averageweeklyearningsingreatbritain/september2026 |
| KAC3 previous versions | ONS | archive | https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/timeseries/kac3/lms/previous |
| Budget June 2010; Autumn Budget 2024; Budget 2025 | HM Treasury | 2010-06-22; 2024-10-30; 2025-11-26 | https://www.gov.uk/government/publications/budget-2025-document |
| The Coalition: our programme for government | Cabinet Office | 2010-05-20 | https://www.gov.uk/government/publications/the-coalition-our-programme-for-government |
| Gain from the triple guarantee | DWP | July 2011 | https://assets.publishing.service.gov.uk/media/5a7ce77f40f0b6629523c827/gains_from_triple_lock_and_breakeven_point.pdf |
