# 03 — Public finances: State Pension expenditure, the triple lock, and reform estimates

Retrieval date for every record: **2026-09-29**. British English throughout.

## How to read this file

- **Check status** values: `FETCHED-AND-QUOTED` (primary source opened today and the value seen in it), `SECONDARY-ONLY` (value seen only in a named secondary source), `NOT-FOUND`.
- **Classification** values: observed statistic, estimate, forecast, projection, derived calculation.
- No figure here is from memory. Derived calculations are labelled and show both input cells.
- Three different things are kept apart throughout:
  1. **The full pension bill** (sections 1 to 4).
  2. **The cost attributed to an uprating rule against a counterfactual** (section 5).
  3. **Prospective savings from a reform** (section 6).

## Access log (what could and could not be opened)

| Source | Result |
|---|---|
| DWP Benefit expenditure and caseload tables 2026 (.xlsx) | Downloaded and read cell by cell with openpyxl |
| OBR report web pages (EFO March 2026, FRS July 2025, FRS July 2026) | Full HTML text fetched and searched |
| OBR downloadable files (PDF, detailed forecast tables .xlsx, chart data) | **Blocked**: every `obr.uk/download/...` link redirected to `obr.uk/no-access/`. Not circumvented. EFO detailed expenditure Table 4.9 therefore **not seen** |
| IFS report PDFs (`ifs.org.uk/sites/default/files/...`) | Downloaded and read |
| IFS web articles and publication landing pages | **HTTP 403** to both curl and WebFetch. Not circumvented |
| House of Commons Library (CBP-7812 page and PDF) | **HTTP 403**. Not read |
| HMRC / GAD / DWP pages and PDFs on GOV.UK | Fetched |
| ONS 2024-based national population projections bulletin | Fetched |
| Resolution Foundation "What a ratchet!" web page | Fetched |
| PPI General Election 2024 triple lock briefing (PDF) | Fetched |
| DWP Stat-Xplore | Not queried directly; figures taken from DWP's own compendium, which cites Stat-Xplore |
| OBR Welfare trends reports | Not examined in this pass |

**Latest editions confirmed today:** OBR EFO = March 2026 (published 3 March 2026; the OBR site states "The latest update of our forecasts was published on 3 March 2026"). OBR FRS = July 2026 (published 7 July 2026). DWP tables = Spring Forecast 2026 (published 14 April 2026). ONS NPP = 2024-based (released 28 April 2026).

---

## 1. Annual State Pension expenditure

### Record `sp-spend-gb-nominal`

| Field | Value |
|---|---|
| Definition | Total DWP spending on the State Pension in a financial year, cash terms |
| Value | See table below (£ million) |
| Population / coverage | All State Pension components: basic, Graduated Retirement Benefit, lump sums, State Second Pension (additional), new State Pension, new State Pension protected payments, non-contributory Category D. **Includes State Pension paid to recipients living outside the UK** |
| Geography | **Great Britain**, plus people resident overseas receiving UK benefits. **Excludes Northern Ireland** |
| Reference period | Financial years 2022/23 to 2030/31 |
| Price basis | Nominal (cash) |
| Status | 2022/23 to 2024/25 outturn; 2025/26 to 2030/31 forecast |
| Publisher | Department for Work and Pensions |
| Publication | "Benefit expenditure and caseload tables 2026" (file: `outturn-and-forecast-tables-spring-forecast-2026.xlsx`) |
| URL | https://www.gov.uk/government/publications/benefit-expenditure-and-caseload-tables-2026 |
| Published | 14 April 2026 |
| Table / cell | Sheet **"State Pension"**, block "State Pension expenditure, £ million, nominal terms", rows 4 to 13. The total also appears in **Table 1a** row 63 and **Table 2a** row 115 |
| Classification | Observed statistic (outturn years); forecast (later years) |
| Check status | FETCHED-AND-QUOTED |

| £ million, nominal | 2022/23 | 2023/24 | 2024/25 | 2025/26 | 2026/27 | 2027/28 | 2028/29 | 2029/30 | 2030/31 |
|---|---|---|---|---|---|---|---|---|---|
| Status | Outturn | Outturn | Outturn | Forecast | Forecast | Forecast | Forecast | Forecast | Forecast |
| **Total** | 110,533.4 | 124,106.1 | 136,584.4 | 146,071.2 | 154,174.5 | 158,924.3 | 163,988.1 | 172,195.0 | 180,695.3 |
| Contributory State Pension | 110,355.5 | 123,883.8 | 136,357.0 | 145,838.5 | 153,931.5 | 158,668.0 | 163,720.2 | 171,922.7 | 180,422.2 |
| of which basic | 63,985.3 | 65,818.2 | 66,659.8 | 66,699.9 | 66,150.0 | 64,952.8 | 62,565.4 | 60,246.6 | 57,755.4 |
| of which Graduated Retirement Benefit | 1,815.1 | 1,903.4 | 1,899.2 | 1,847.2 | 1,809.4 | 1,742.5 | 1,662.9 | 1,585.4 | 1,503.7 |
| of which lump sum payments | 422.5 | 388.8 | 349.1 | 293.8 | 188.2 | 96.8 | 58.6 | 54.0 | 52.7 |
| of which State Second Pension | 17,247.5 | 19,188.9 | 19,900.4 | 19,554.3 | 19,541.4 | 19,030.8 | 18,355.4 | 17,685.1 | 16,960.6 |
| of which new State Pension (excl. protected payments) | 26,099.6 | 35,587.0 | 46,353.5 | 56,131.4 | 64,811.9 | 71,346.9 | 79,502.8 | 90,693.0 | 102,426.0 |
| of which nSP protected payments (incl. inherited elements) | 785.4 | 997.6 | 1,194.9 | 1,312.0 | 1,430.5 | 1,498.2 | 1,575.0 | 1,658.6 | 1,723.8 |
| Non-contributory (Category D) | 177.9 | 222.2 | 227.4 | 232.7 | 243.1 | 256.2 | 267.9 | 272.3 | 273.1 |
| *Memo: paid outside UK (included above)* | 4,541.0 | 5,107.0 | 5,329.9 | 5,629.1 | 5,905.2 | 6,077.4 | 6,227.2 | 6,419.8 | 6,630.5 |

Values shown to one decimal place; the workbook holds more. DWP notes say: "Expenditure figures have not been rounded... figures may not be robust to this level of expansion."

**Qualifications**
- Forecast basis, from the workbook Notes: "Forecast figures are consistent with the Spring 2026 Economic and Fiscal Outlook (EFO) published by the Office for Budget Responsibility (OBR) on the 3rd of March 2026."
- Geography, from the Notes: "Figures relate to Great Britain, or people resident overseas who are receiving United Kingdom benefits".
- Accounting basis: "Figures for 1999/00 onwards are on a Resource Accounting and Budgeting basis." This is not a cash-paid figure (see `sp-spend-2024-25-disagreement`).
- A label in Table 1a row 101 reads "...OBR Economic and Fiscal Outlook Published 26 November 2025". That conflicts with the Notes tab (3 March 2026). It looks like a label carried over from the previous edition; it is recorded here, not resolved.

### Record `sp-spend-gb-real`

| Field | Value |
|---|---|
| Definition | As above, adjusted for inflation |
| Value | See table (£ million, 2026/27 prices) |
| Geography | Great Britain plus overseas recipients; excludes Northern Ireland |
| Price basis | **Real terms, 2026/27 prices, GDP deflator** |
| Publication / table | Same workbook, sheet **"State Pension"**, block "£million, real terms, 2026/27 prices", row 17 |
| Supporting quote | "Real terms expenditure... using price levels from 2026/27 (the base year), has been calculated using the GDP deflator, as published by HMT" |
| Classification | Derived by DWP from outturn/forecast and the HMT GDP deflator |
| Check status | FETCHED-AND-QUOTED |

| £ million, 2026/27 prices | 2022/23 | 2023/24 | 2024/25 | 2025/26 | 2026/27 | 2027/28 | 2028/29 | 2029/30 | 2030/31 |
|---|---|---|---|---|---|---|---|---|---|
| Total | 127,479.2 | 135,957.5 | 143,836.4 | 149,001.0 | 154,174.5 | 155,896.8 | 157,918.5 | 162,786.7 | 167,446.8 |

**Qualification:** deflated by the GDP deflator, not CPI. A CPI-deflated series would differ.

### Record `sp-spend-gb-pct-gdp-derived`

| Field | Value |
|---|---|
| Definition | GB State Pension spending divided by the GDP denominator printed in the same DWP workbook |
| Value | 2024/25 **4.66%**; 2025/26 4.78%; 2026/27 4.87%; 2027/28 4.85%; 2028/29 4.84%; 2029/30 4.91%; 2030/31 4.98% |
| Inputs | Numerator: "State Pension" sheet row 4. Denominator: "GB welfare" sheet row 50 "GDP denominator" (£ million): 2,934,021; 3,054,666; 3,164,074; 3,277,008; 3,390,825; 3,506,679; 3,631,831 |
| Geography | **Mismatch:** GB spending over what appears to be a UK GDP figure |
| Classification | **Derived calculation (by this research, not published by DWP)** |
| Check status | FETCHED-AND-QUOTED for both inputs; the ratio itself is not a published figure |

**Qualification:** DWP does not publish a State Pension share of GDP in this workbook. It publishes shares only for group totals. Prefer the OBR's own UK figure (`sp-spend-uk-pct-gdp-obr`) for publication.

### Record `sp-spend-uk-pct-gdp-obr`

| Field | Value |
|---|---|
| Definition | State Pension spending as a share of GDP, OBR long-term baseline |
| Value | **4.8% of GDP in 2025-26** (labelled "Estimate"); **5.0% in 2030-31** |
| Geography | UK (OBR public finances coverage); the table does not restate coverage |
| Price basis | Share of GDP |
| Status | 2025-26 estimate "consistent with the March 2026 Economic and fiscal outlook"; 2030-31 onwards projection |
| Publisher | Office for Budget Responsibility |
| Publication | "Fiscal risks and sustainability – July 2026" |
| URL | https://obr.uk/frs/fiscal-risks-and-sustainability-july-2026/ |
| Published | 7 July 2026 |
| Table | **Table 3.1: Baseline primary spending scenario**, row "State pension" |
| Classification | Estimate / projection |
| Check status | FETCHED-AND-QUOTED |

### Record `sp-spend-2024-25-disagreement`

Four official figures exist for 2024-25. They are not errors; they measure different things.

| Figure | Source | Coverage and basis | Check status |
|---|---|---|---|
| **£136,584.4m** | DWP tables 2026, "State Pension" sheet row 4 | GB + overseas; contributory **and** non-contributory; resource accounting basis | FETCHED-AND-QUOTED |
| **£136,924.3m** | HMRC, "Great Britain National Insurance Fund Account for the year ended 31 March 2025" (HC 1360), note 5.8 | GB Fund; **cash receipts-and-payments basis**; contributory only, net of recoveries | FETCHED-AND-QUOTED |
| **£137.4 billion** | Same NIF account, quoting DWP's accounts: "the £137.4 billion of State Pension expenditure in DWP's 2024 to 2025 AR&A" | DWP Annual Report and Accounts | FETCHED-AND-QUOTED (as quoted in the NIF account; the AR&A itself was not opened) |
| **£138 billion** | OBR FRS July 2025: "expenditure on the state pension, at £138 billion (around 5 per cent of GDP) in 2024-25" | Coverage not stated in the sentence. Published July 2025, so likely a forecast-vintage figure rather than final outturn. **Not reconciled** | FETCHED-AND-QUOTED |

Northern Ireland, separately: **£3,462.9m** State Pension paid from the Northern Ireland National Insurance Fund in 2024-25 (HMRC, "Northern Ireland National Insurance Fund Account for the year ended 31 March 2025", HC 1361, note 5.7). Cash basis. FETCHED-AND-QUOTED.

**Do not add the GB DWP figure and the NI Fund figure to make a "UK total".** They are on different accounting bases and no source seen today publishes that sum.

### Record `sp-spend-uk-cash-obr` — NOT-FOUND

The OBR's own State Pension cash forecast sits in the EFO "Detailed forecast tables: expenditure" (the DWP Notes cite "Table 4.9"). The file could not be downloaded. **NOT-FOUND.** The EFO main text gives only a wider "pensioner spending" line (see `pensioner-spend-obr-efo`).

---

## 2. Caseload

### Record `sp-caseload-gb-march-2026`

| Field | Value |
|---|---|
| Definition | People receiving the State Pension at a point in time |
| Value | **13,308,000** (Figure 1); text rounds to "13 million" |
| Split | **New State Pension: 5.4 million.** Pre-2016 State Pension: not stated as a number in the text read |
| Geography | Release "covers DWP benefits in Great Britain"; page header "Applies to England, Scotland and Wales". Whether overseas recipients are inside the 13,308,000 is **not stated** in the text read |
| Reference period | March 2026 |
| Status | Outturn (administrative data) |
| Publisher | Department for Work and Pensions |
| Publication | "Annual DWP Benefits Statistics Compendium: 2026" (Accredited official statistics) |
| URL | https://www.gov.uk/government/statistics/annual-dwp-benefits-statistics-compendium-2026/annual-dwp-benefits-statistics-compendium-2026 |
| Published | 15 September 2026 |
| Quote | "There were 13 million people receiving the State Pension at March 2026, an increase of 260,000 compared to February 2025." and "At March 2026 there were 5.4 million people receiving nSP" |
| Classification | Observed statistic |
| Check status | FETCHED-AND-QUOTED |

**Qualifications**
- The annual comparison is February 2025 to March 2026, a one-off 13-month gap caused by a move to financial-year reporting.
- Source cited by DWP: "DWP State Pension dataset on Stat-Xplore". Stat-Xplore itself was not queried.
- Mean weekly amount at March 2026: £211.31 overall; nSP £216.42 (including protected payments); pre-2016 £207.78.

### Record `sp-caseload-gb-annual-average`

| Field | Value |
|---|---|
| Definition | State Pension caseload, **average over the financial year**, thousands |
| Geography | GB plus overseas recipients |
| Publication / table | DWP tables 2026, sheet **"State Pension"**, caseload block rows 29 to 38; also **Table 1c** row 55 and **Table 2c** rows 78 to 86 |
| Classification | Observed statistic (outturn); forecast |
| Check status | FETCHED-AND-QUOTED |

| Thousands | 2022/23 | 2023/24 | 2024/25 | 2025/26 | 2026/27 | 2027/28 | 2028/29 | 2029/30 | 2030/31 |
|---|---|---|---|---|---|---|---|---|---|
| Status | Outturn | Outturn | Outturn | Forecast | Forecast | Forecast | Forecast | Forecast | Forecast |
| **Total** | 12,597 | 12,776 | 12,987 | 13,204 | 13,220 | 13,083 | 13,167 | 13,431 | 13,697 |
| Basic State Pension | 9,632 | 9,102 | 8,591 | 8,127 | 7,666 | 7,218 | 6,777 | 6,342 | 5,907 |
| New State Pension | 2,967 | 3,675 | 4,393 | 5,045 | 5,527 | 5,841 | 6,369 | 7,072 | 7,775 |
| Category D only | 79 | 87 | 90 | 70 | 72 | 74 | 76 | 76 | 75 |
| **Paid outside UK (included above)** | 1,120 | 1,112 | 1,102 | 1,088 | 1,068 | 1,042 | 1,025 | 1,014 | 1,005 |

**Qualifications**
- DWP Notes: "Caseload figures represent an average over the full financial year... Forecasts may use different sources to those on Stat-Xplore, and so may differ slightly." Rounded to the nearest 1,000.
- Component rows overlap (one person can hold basic, Graduated Retirement Benefit and State Second Pension). Do not sum them.
- **Internal inconsistency in the workbook:** "of which contributory" for 2024/25 is **12,897** on the "State Pension" sheet (row 30) but **12,984** in Table 2c (row 79). Totals agree at 12,987. Recorded, not resolved.
- The dip in 2027/28 coincides with the rise in State Pension age from 66 to 67.
- Point-in-time (13,308,000 at March 2026) and annual-average (13,204,000 forecast for 2025/26) figures are different measures and should not be compared as if they disagreed.

---

## 3. Share of welfare and of total managed expenditure; pensioner benefits

### Record `pensioner-benefits-gb-breakdown`

| Field | Value |
|---|---|
| Definition | DWP benefit expenditure directed at pensioners, by benefit |
| Geography | GB, with exceptions: Attendance Allowance, DLA, PIP are **England and Wales only** from 2020/21; Winter Fuel Payment is **England and Wales only** from 2024/25 |
| Price basis | Nominal, £ million |
| Publication / table | DWP tables 2026, **Table 2a**, block "Expenditure Directed at Pensioners", rows 82 to 129 |
| Classification | Observed statistic (2024/25); forecast |
| Check status | FETCHED-AND-QUOTED |

| £ million, nominal | 2024/25 (outturn) | 2025/26 (forecast) | 2026/27 (forecast) | 2030/31 (forecast) |
|---|---|---|---|---|
| **State Pension** | 136,584.4 | 146,071.2 | 154,174.5 | 180,695.3 |
| Attendance Allowance | 7,766.6 | 8,497.2 | 9,228.3 | 11,068.2 |
| Housing benefits (pensioners) | 6,851.0 | 7,114.7 | 7,268.9 | 7,941.3 |
| Pension Credit | 6,007.7 | 6,144.5 | 6,054.9 | 5,821.8 |
| Personal Independence Payment (pensioners) | 4,072.3 | 4,666.0 | 5,070.8 | 7,748.5 |
| Disability Living Allowance (pensioners) | 2,355.5 | 2,159.2 | 2,018.5 | 1,141.8 |
| Winter Fuel Payments | 301.7 | 1,912.1 | 1,911.4 | 2,006.0 |
| Industrial injuries benefits | 491.0 | 492.2 | 493.2 | 457.9 |
| Financial Assistance Scheme | 162.0 | 254.5 | 259.6 | 277.9 |
| Christmas Bonus (contributory) | 130.3 | 131.9 | 130.9 | 137.0 |
| **Total directed at pensioners** | **164,942.6** | **177,653.1** | **186,803.2** | **217,465.0** |

Smaller lines (Carer's Allowance, Cold Weather Payments, Severe Disablement Allowance, Mesothelioma, Pneumoconiosis, Funeral Expenses, State Pension Transfers, Support for Mortgage Interest, Cost of Living Payments) are in the table but omitted here; the total row includes them.

**Qualification:** the Winter Fuel Payment figure of £301.7m in 2024/25 reflects both the 2024 restriction of eligibility and the removal of Scotland from the series. The two effects cannot be separated from this table.

### Record `pensioner-share-gdp-tme-dwp`

| Field | Value |
|---|---|
| Definition | GB welfare spending on pensioners as a share of GDP and of Total Managed Expenditure (TME) |
| Value | Share of GDP: 2024/25 **5.62%**, 2025/26 5.82%, 2026/27 5.90%. Share of TME: 2024/25 **12.77%**, 2025/26 12.99%, 2026/27 13.16% |
| Underlying | Pensioners, £ billion nominal: 164.93 (2024/25), 177.66 (2025/26), 186.80 (2026/27) |
| Publication / table | DWP tables 2026, sheet **"GB welfare"**, rows 7, 33 and 40. Cells hold unrounded ratios (for example 0.05621278...) |
| Classification | Published ratio (DWP calculation) |
| Check status | FETCHED-AND-QUOTED |

**Qualification:** this is **all pensioner benefits**, not the State Pension alone.

### Record `welfare-total-uk-dwp`

| Field | Value |
|---|---|
| Definition | Total UK welfare spending (DWP GB social security, local-authority-funded benefits, Child Benefit, tax credits, Tax-Free Childcare, Northern Ireland social security) |
| Value | £ billion nominal: **314.92** (2024/25 outturn), 333.78 (2025/26), 354.15 (2026/27), 408.55 (2030/31). Share of GDP: 10.73%, 10.93%, 11.19% for the first three years. Share of TME: 24.38%, 24.40%, 24.95% |
| Related | GB total welfare: 304.64, 322.66, 342.81 (£ billion). Northern Ireland social security: 9.71, 10.66, 10.88 |
| Publication / table | DWP tables 2026, sheets **"UK welfare"** (rows 15, 19, 55, 61) and **"GB welfare"** (row 8) |
| Check status | FETCHED-AND-QUOTED |

**Qualification:** the same sheet also gives a "Total (consistent with OBR's Economic & Fiscal Outlook definition)": 314.76, 332.89, 352.80. The OBR's Table 4.6 matches that line (314.8, 332.9, 352.8).

### Record `sp-share-derived`

| Field | Value |
|---|---|
| Definition | State Pension (GB) as a share of several DWP totals |
| Classification | **Derived calculation (by this research).** Not published as ratios by DWP |
| Check status | Inputs FETCHED-AND-QUOTED; ratios are not published figures |

| Ratio | 2024/25 | 2025/26 | 2026/27 | Denominator cell |
|---|---|---|---|---|
| Share of GB pensioner benefit expenditure | 82.8% | 82.2% | 82.5% | Table 2a row 129 |
| Share of total DWP benefit expenditure | 47.2% | 47.3% | 46.9% | Table 2a row 132 |
| Share of GB total welfare | 44.8% | 45.3% | 45.0% | "GB welfare" row 8 |
| Share of Total Managed Expenditure | 10.57% | 10.68% | 10.86% | "GB welfare" row 51, TME denominator |

**Qualification:** the TME and GDP denominators appear to be UK-wide while the numerator is GB. Each ratio understates the UK position slightly. "Share of welfare" changes by several points depending on which total is used; always name the denominator.

### Record `pensioner-spend-obr-efo`

| Field | Value |
|---|---|
| Definition | OBR "pensioner spending" |
| Value | £ billion: **151.0** (2024-25 outturn), 161.2, 169.2, 173.9, 178.9, 187.5, **196.2** (2030-31) |
| Coverage | "Pensioner spending includes pensioner housing benefit, pension credit, winter fuel payment, and state pension expenditure." **Excludes** Attendance Allowance and other disability benefits paid to pensioners. Northern Ireland sits in "Other spending" |
| Publisher / publication | OBR, "Economic and fiscal outlook – March 2026", **Table 4.6: Welfare spending** |
| URL | https://obr.uk/efo/economic-and-fiscal-outlook-march-2026/ |
| Published | 3 March 2026 |
| Classification | Observed statistic (2024-25); forecast |
| Check status | FETCHED-AND-QUOTED |

**Trap:** OBR "pensioner spending" (£151.0bn) and DWP "expenditure directed at pensioners" (£164.9bn) for the same year differ because DWP includes disability and other benefits received by pensioners.

Medium-term drivers, same source, paragraph 4.23: "Larger state pension cohorts and the triple lock uprating together increase pensioner spending by 0.6 per cent of GDP by 2030-31." The State Pension age rise "reduces pensioner spending by roughly 0.3 per cent of GDP in 2030-31."

### Record `sp-share-obr-explainer` — dated, do not use as current

OBR web page "Welfare spending: pensioner benefits" (https://obr.uk/forecasts-in-depth/tax-by-tax-spend-by-spend/welfare-spending-pensioner-benefits/) states the State Pension is "forecast to make up 42 per cent of the total in 2023-24" and that GB pensioner benefit spending in 2023-24 "represents 11.3 per cent of total public spending... and 5.1 per cent of GDP." FETCHED-AND-QUOTED, but the page still refers to 2023-24 forecasts. It has not been updated to the March 2026 forecast.

---

## 4. Long-run projections

### Record `sp-longrun-obr-2026`

| Field | Value |
|---|---|
| Definition | Projected State Pension spending as a share of GDP, baseline scenario |
| Value | 2025-26 **4.8**; 2030-31 **5.0**; 2035-36 **5.4**; 2045-46 **5.8**; 2055-56 **6.7**; 2065-66 **7.9**; 2075-76 **8.6** (per cent of GDP) |
| Geography | UK |
| Horizon | 50 years to 2075-76 |
| Status | Projection. The OBR describes these as scenarios under unchanged policy, not forecasts |
| Publisher / publication | OBR, "Fiscal risks and sustainability – July 2026", **Table 3.1** |
| URL | https://obr.uk/frs/fiscal-risks-and-sustainability-july-2026/ |
| Published | 7 July 2026 |
| Quote | "In the baseline scenario, state pension spending is projected to increase from 5 per cent to 9 per cent of GDP in the 50 years to 2075-76." (para 3.51) |
| Check status | FETCHED-AND-QUOTED |

**Baseline assumptions (FETCHED-AND-QUOTED, same report)**
- Uprating: "After 2030-31, basic state pension, additional state pension and new state pension payments are uprated using the triple lock." To 2030-31: "The additional state pension is uprated using CPI."
- Triple lock premium: "Our latest estimate of this wedge is 0.56 percentage points" above earnings growth, estimated "on the basis of observed inflation and earnings trends since 1990" (footnote 80).
- Policy stance: "We also take the Government's commitment to maintain triple lock uprating... for the rest of this Parliament, and assume it remains in place beyond this point in the absence of a firm policy alternative".
- State Pension age: 67 between 2026 and 2028; "reaches 68 between 2037 and 2039, which the Government has confirmed is its current policy position rather than the rise to 68 happening between 2044 and 2046 as is currently legislated for"; "reaches 69 between 2073 and 2075".
- Economy: "earnings growth is assumed to average 3.7 per cent a year while CPI inflation averages 2.0 per cent a year" (footnote 79).
- Population: "the latest 2024-based ONS principal population projection".

**Decomposition (2026 edition)**
- "In the baseline scenario, the triple lock drives 1.2 per cent of GDP out of the overall 3.6 per cent of GDP long-term increase in state pension spending." (para 3.52)
- "The triple lock is estimated to account for around a third of this rise by the end of the projection period."
- The 2026 edition gives no separate number for demographics or State Pension age. It refers readers to the 2025 edition.

**Tension inside the 2026 report, recorded not resolved:** the triple lock "drives 1.2 per cent of GDP" of the rise, yet "If the state pension were to be uprated by average earnings, spending would be reduced by 1.8 per cent of GDP compared to baseline by the end of the projection period". The Executive Summary gives "around 9" against "around 7" per cent. These may differ because the first measures a contribution to the rise from 2030-31 and the second a level difference in 2075-76; the report text read does not explain it. Quote each with its own wording.

### Record `sp-longrun-obr-2025`

| Field | Value |
|---|---|
| Definition | Projected State Pension spending, central projection, previous edition |
| Value | "from around 5 per cent of GDP in 2024-25 to **7.7 per cent of GDP in 2073-74**" |
| Publisher / publication | OBR, "Fiscal risks and sustainability – July 2025", Chapter 2, para 2.18 |
| URL | https://obr.uk/frs/fiscal-risks-and-sustainability-july-2025/ |
| Published | 8 July 2025 |
| Assumed premium | "triple lock uprating averages **0.53 percentage points** above earnings growth in the long run", based on outturns "since 1992-93" |
| Population basis | "2021-based ONS population projections underpinning our 2024 FRS projection" |
| Check status | FETCHED-AND-QUOTED |

**Decomposition (2025 edition)**

| Driver | Effect by early 2070s | Quote |
|---|---|---|
| Demographics | +1.6 percentage points of GDP | "These demographic changes explain 1.6 percentage points of the projected 2.7 percentage point rise" |
| Triple lock rather than earnings uprating | +1.6 percentage points of GDP | "explains a further 1.6 percentage points of the 2.7 per cent of GDP rise in state pension spending by the early 2070s" |
| State Pension age rises to 67, 68, 69 | around −1 per cent of GDP | "collectively expected to reduce annual state pension spending by around 1 per cent of GDP by the early 2070s, relative to the SPA staying at 66" |

**Inconsistency inside the 2025 report:** the Executive Summary gives the total rise as "2.7" percentage points; Chapter 2 para 2.15 says the triple lock "explains 1.6 percentage points of the **3.1** percentage point rise". Both are verbatim. Note also that 1.6 + 1.6 − 1.0 = 2.2, so the three drivers do not sum to either total; the OBR does not present them as an exhaustive sum.

**Sensitivities (2025 edition)**
- More volatile economy (like 2010-11 onwards): premium 0.93 points; spending "would reach 9.1 per cent by the early 2070s".
- Less volatile (early 1990s to 2009-10): premium 0.11 points; spending "would reach 6.3 per cent".
- Life expectancy: high scenario +0.7, low scenario −0.8 per cent of GDP.
- Chart 2.6 note: "Spending on the basic and new state pension only, to which the triple lock applies."

### Editions compared

| | FRS July 2025 | FRS July 2026 |
|---|---|---|
| End year | 2073-74 | 2075-76 |
| End value | 7.7% of GDP | 8.6% of GDP |
| Triple lock premium | 0.53 points | 0.56 points |
| Population projections | 2021-based | 2024-based |
| Triple lock contribution | 1.6 points | 1.2 points of a 3.6 point rise |

The two editions are not directly comparable: different population projections, end years and start points. The 2026 report notes the new population figures give "a UK population that is around 10 million lower by 2074" than the 2022-based projections used in the 2024 FRS.

---

## 5. What the triple lock has cost, against a stated counterfactual

Every record here is a **difference from a counterfactual**, not a bill.

### Record `tl-cost-obr-vs-earnings-2029-30`

| Field | Value |
|---|---|
| Definition | Extra annual State Pension spending because the triple lock was used since 2012 rather than earnings uprating |
| Value | **£15.5 billion (0.5 per cent of GDP)** |
| Annual or cumulative | **Annual**, in the single year 2029-30. It is the accumulated effect of all upratings since 2012 on one year's spending, not a running total of past years |
| Counterfactual | **Earnings uprating** from 2012 |
| Price basis | Not stated explicitly. Expressed as spending "by 2029-30", so read as 2029-30 cash. **Do not describe as today's prices** |
| Gross or net | **Gross** State Pension spending. No offset for income tax or means-tested benefits is mentioned |
| Coverage | Basic and new State Pension only (the parts the triple lock applies to) |
| Status | Part outturn (2012-13 onwards), part forecast (to 2029-30, on the March 2025 forecast) |
| Publisher / publication | OBR, "Fiscal risks and sustainability – July 2025", para 2.17 and Chart 2.4 |
| Quote | "we estimate that uprating by the triple lock rather than earnings will have added £15.5 billion (0.5 per cent of GDP) to state pension spending annually by 2029-30" |
| Classification | Estimate |
| Check status | FETCHED-AND-QUOTED. Repeated in FRS July 2026 footnote 80 |

Accounts for the 2022-23 double lock: "in 2022-23 it was superseded by one-off 'double lock' policy" (footnote 22).

### Record `tl-cost-obr-three-times`

| Field | Value |
|---|---|
| Definition | The OBR's "three times" comparison |
| Value | £15.5 billion against **£5.2 billion** |
| What the £5.2bn is | What the triple lock "would have cost by that point under initial assumptions", that is, the 2010 assumption that it would average **0.2 percentage points** above earnings growth |
| Year | 2029-30, annual |
| Quote | "This is around three times higher than the £5.2 billion we estimate the triple lock would have cost by that point under initial assumptions" |
| Check status | FETCHED-AND-QUOTED |

**Trap:** "three times initial expectations" compares two *costs relative to earnings uprating*. It does **not** mean State Pension spending is three times what was expected. The £5.2bn is a reconstruction by the OBR in 2025, not a number published in 2010. The original 2010 costing was: "£0.5 billion a year" by 2014-15, relative to earnings uprating (para 2.16). OBR's 2015 Welfare trends report found the actual cost was "£2.9 billion by 2014-15, which is £2.4 billion higher than the original estimate" (footnote 22, as quoted in FRS 2025; the 2015 report itself was not opened).

### Record `tl-cost-obr-vs-cpi-2029-30`

| Field | Value |
|---|---|
| Value | **£22.9 billion**, annual, by 2029-30 |
| Counterfactual | **CPI uprating** since 2012 |
| Gross or net | Gross |
| Quote | "Relative to CPI uprating, we expect that the triple lock will have added £22.9 billion to annual state pension spending by 2029-30." |
| Source | OBR FRS July 2025 para 2.17 |
| Check status | FETCHED-AND-QUOTED |

### Record `tl-cost-ifs-2023`

| Field | Value |
|---|---|
| Value | **£11 billion per year** |
| Year | "now", that is 2023-24 at publication |
| Counterfactual | Prices **or** earnings since 2011. IFS says price indexation "has a very similar result to increasing it in line with earnings" over that period |
| Price basis | Current (2023) terms |
| Gross or net | Gross; no offsets mentioned |
| Publisher / publication | Institute for Fiscal Studies, "The triple lock: uncertainty for pension incomes and the public finances", IFS Report R272, Cribb, Emmerson and Karjalainen |
| URL | https://ifs.org.uk/sites/default/files/2023-09/R272-The-triple-lock-costs-and-uncertainty.pdf |
| Published | September 2023 |
| Quote | "the government now spends an additional £11 billion per year on state pensions as a result of the triple lock" |
| Classification | Estimate |
| Check status | FETCHED-AND-QUOTED |

### Record `tl-cost-ifs-later-figures` — SECONDARY-ONLY

Search-engine excerpts of the IFS article "What do you need to know about the triple lock?" (https://ifs.org.uk/articles/what-do-you-need-know-about-triple-lock) show two figures: "around £16 billion, compared with uprating in line with average earnings growth since 2010" and, for 2025–26, "£12 billion more per year than... if the state pension had been uprated in line with average earnings since 2011". **The page returned HTTP 403 and could not be opened.** The two excerpts differ in value and in start year, and may come from different versions of the page. **Check status: SECONDARY-ONLY (WebSearch result excerpt). Do not publish without reading the page.**

### Record `tl-cost-rf-2026`

| Field | Value |
|---|---|
| Value | **£12.6 billion** gross; **around £9 billion** net |
| Year | "this year" / "now" = 2026-27 |
| Annual or cumulative | Annual |
| Counterfactual | **Unclear between two statements.** Summary: "higher than it would have been under a smoothed earnings link since 2012". Body: "The OBR estimates spending... would have been £12.6 billion lower this year with earnings-linked uprating" |
| Gross or net | Both given. Net figure allows for "higher income tax receipts and lower means-tested benefit spending". The netting is the Resolution Foundation's own estimate |
| Publisher / publication | Resolution Foundation, "What a ratchet! Why it's time to stop being polite about the triple lock", Ruth Curtice and Alex Clegg |
| URL | https://www.resolutionfoundation.org/publications/what-a-ratchet/ |
| Published | 10 June 2026 |
| Classification | Estimate |
| Check status | FETCHED-AND-QUOTED for the RF text. The **OBR origin of £12.6bn was not located** in any OBR page read; treat the attribution as RF's |

This is the only estimate found that states a figure **net of tax and benefit offsets**.

### Record `tl-cost-forecast-errors-ifs-2024`

IFS, "Pensions: five key decisions for the next government" (June 2024), FETCHED-AND-QUOTED from PDF: "OBR forecasts prior to the 2019 general election suggested the triple lock would cost nothing compared to earnings indexation, but in fact it pushed up spending by around £3.2 billion this year alone." Useful as evidence on forecast uncertainty. "This year" is 2024-25.

---

## 6. Prospective savings from specified reforms

None of the sources read states explicitly whether **existing entitlement is preserved**. All the uprating options below change future increases only; none describes a cut to pensions in payment. That reading is an inference from the descriptions, not a quoted statement.

| id | Reform | Saving | Baseline | Start | Horizon | Price basis | Gross/net | Source | Check status |
|---|---|---|---|---|---|---|---|---|---|
| `reform-earnings-obr-2075` | Uprate by average earnings | **1.8% of GDP** lower spending | OBR baseline with triple lock | After 2030-31 | 2075-76 | Share of GDP | Gross | OBR FRS July 2026 para 3.52, Chart 3.11 | FETCHED-AND-QUOTED |
| `reform-cpi-obr-2075` | Uprate by CPI | **5.4% of GDP** lower spending | OBR baseline with triple lock | After 2030-31 | 2075-76 | Share of GDP | Gross | Same | FETCHED-AND-QUOTED |
| `reform-earnings-gad-2031` | Earnings (AWE) instead of triple lock | National Insurance Fund balance "approximately **£2bn** higher" | GAD principal projection | April 2026 | End of 2030-31 | Nominal | Fund balance effect only | GAD Up-rating report January 2026, para 3.15 | FETCHED-AND-QUOTED |
| `reform-smoothed-rf-2030` | Smoothed earnings link | "around **£650 million** in 2029-30" | Maintaining triple lock | 2027-28 | 2029-30 | Not stated | **Net** of means-tested benefits and income tax | Resolution Foundation, June 2026 | FETCHED-AND-QUOTED |
| `reform-earnings-ifs-2050` | Hold new State Pension at current share of average earnings | "around **£21 billion** in 2050" | IFS central expectation under triple lock | 2025 | 2050 | "today's terms" (2025) | Gross | IFS, "The Pensions Review: final recommendations", July 2025, Table 2.1 | FETCHED-AND-QUOTED |
| `reform-target33-ifs-2050` | Triple lock until 33% of average earnings, then earnings link | "£5 billion" (text) / "£5.5 billion" (elsewhere in the same report) | IFS central triple lock case | Target reached about 2043 | 2050 | Today's terms | Gross | Same | FETCHED-AND-QUOTED |
| `reform-tl-range-ifs-2050` | Cost of keeping the triple lock over earnings indexation | "between **£5 billion and £40 billion** a year in 2050" | Earnings indexation | — | 2050 | Today's terms | Gross | Same (80% interval) | FETCHED-AND-QUOTED |
| `reform-tl-parliament-ifs-2024` | Cost of triple lock over one parliament | "around **£1.5 billion** per year... by 2029–30" | Earnings indexation | 2024 | 2029–30 | "today's prices" (2024) | Gross | IFS, "Pensions: five key decisions for the next government", June 2024 | FETCHED-AND-QUOTED; superseded by later forecasts |
| `reform-spa-ifs` | Raise State Pension age by one year | "around **£6 billion** per year" | — | — | Not stated | Not stated | Exchequer saving | IFS Pensions Review July 2025, citing Cribb, Emmerson and Karjalainen (2024) | FETCHED-AND-QUOTED |
| `reform-spa68-obr` | Cost of delaying the rise to 68 from 2037-39 to legislated 2044-46 | "average additional **£6 billion** in today's terms in each of the years" delayed | OBR baseline | — | Late 2030s to mid 2040s | Today's terms (2026-27) | Gross | OBR FRS July 2026 para 3.53 | FETCHED-AND-QUOTED |

**Notes on these records**
- `reform-earnings-gad-2031` is a **cumulative** effect on a fund balance over about five years, Great Britain only. It is small because, on the March 2026 forecast, earnings is already the highest element in most years; only April 2028, 2029 and 2030 differ (the 2.5% floor binds).
- `reform-tl-range-ifs-2050`: the 2023 IFS report gave "£5 billion and £45 billion"; the 2025 report gives "£5 billion and £40 billion". Use the later one and cite its date.
- IFS also notes that "even with earnings indexation from 2025, spending on the state pension would rise by 0.2% of GDP, or £5 billion in today's terms, by 2050" because of rising pensioner numbers. Removing the triple lock does not freeze the bill.
- IFS scale marker: "Increasing the new state pension by 1% of earnings – a boost of around £7.60 per week – would cost about £4 billion in the current year".

### Options with no verified costed estimate

| Option | Finding |
|---|---|
| **Double lock** (drop the 2.5% floor, or drop the earnings leg) | **NOT-FOUND.** The IFS article "Moving from a Triple to a Double Lock does little to long-run state pension affordability" exists but returned HTTP 403. The PPI 2024 briefing discusses the double lock without a fiscal saving figure in the passages read |
| **Means-testing the State Pension** | **No credible costed estimate found** in OBR, IFS, PPI or Resolution Foundation material read. The IFS Pensions Review recommends against it: "The state pension will not be means-tested." Media reports of think-tank proposals were seen in search results but not verified and are not recorded |
| **PPI estimates** | PPI "General Election 2024: Triple Lock Briefing Paper" (29 May 2024) gives spending context only: "State Pension... comprising 4.6% of GDP in 2023/24". No reform saving found. FETCHED-AND-QUOTED for that sentence |

---

## 7. National Insurance Fund

### Record `nif-gb-2024-25`

| Field | Value |
|---|---|
| Definition | Receipts and payments of the Great Britain National Insurance Fund |
| Geography | Great Britain |
| Reference period | Year ended 31 March 2025 |
| Price basis | Nominal, **cash receipts-and-payments basis** |
| Status | Outturn, audited |
| Publisher | HM Revenue and Customs |
| Publication | "Great Britain National Insurance Fund Account for the year ended 31 March 2025", HC 1360, ISBN 978-1-5286-6003-7 |
| URL | https://www.gov.uk/government/publications/national-insurance-fund-accounts |
| Published | Page last updated 27 November 2025; account signed 19 November 2025 |
| Table | Section 4 "Receipts and payments account"; notes 5.2 and 5.8 |
| Classification | Observed statistic |
| Check status | FETCHED-AND-QUOTED |

| £000 | 2024-25 | 2023-24 |
|---|---|---|
| National Insurance contributions | 130,901,352 | 138,649,520 |
| Income from NIF Investment Account | 4,158,579 | 3,881,306 |
| Compensation for statutory pay | 3,173,000 | 2,969,000 |
| **Total receipts** | **138,262,155** | **145,529,469** |
| Benefit payments | (143,197,101) | (129,827,870) |
| *of which State Pension* | *136,924,327* | *123,809,641* |
| Administrative costs | (856,212) | (491,201) |
| Transfers to Northern Ireland NIF | (690,900) | (672,856) |
| **Total payments** | **(145,332,433)** | **(131,596,794)** |
| **Receipts less payments** | **(7,070,278)** | **13,932,675** |
| Balance at 31 March | 79,348,510 | 86,418,788 |

State Pension was 95.6% of Fund benefit payments in 2024-25 (derived calculation: 136,924,327 / 143,197,101).

**Qualifications**
- The contributions figure is what reaches the Fund. The account text read does not set out the separate NHS allocation of National Insurance; that was not checked.
- The account explains the 2024-25 deficit: NICs fell "mainly due to a reduction in some employee rates" and "benefits were uprated".
- No Treasury Grant was needed in 2024-25.

### Record `nif-payg-principle`

| Field | Value |
|---|---|
| Definition | How the scheme is financed |
| Quote | "The National Insurance scheme is financed on a pay as you go basis with contribution rates set at a level broadly necessary to meet the expected benefits expenditure in that year" |
| Further | "a working balance is necessary as the NIF has no borrowing powers." Minimum working balance for 2024-25: "£24.2 billion, representing 16.7% of estimated benefit expenditure" |
| Source | Same account, section 1.5 |
| Check status | FETCHED-AND-QUOTED |

Plain meaning: today's contributions pay today's pensions. There is no invested pot belonging to each contributor.

### Record `nif-ni-2024-25`

Northern Ireland National Insurance Fund, year ended 31 March 2025 (HC 1361): National Insurance contributions **£2,751,428 thousand**; benefit payments **£3,861,647 thousand**, of which State Pension **£3,462,926 thousand**; balance at 31 March 2025 **£2,245,335 thousand**. FETCHED-AND-QUOTED.

### Record `nif-gad-projection-2026`

| Field | Value |
|---|---|
| Definition | Projected receipts, payments and balance of the GB Fund |
| Geography | Great Britain |
| Price basis | Nominal, £ billion |
| Status | Projection |
| Publisher | Government Actuary's Department |
| Publication | "Report by the Government Actuary on: The draft Social Security Benefits Up-rating Order 2026; and the draft Social Security (Contributions) (Rates, Limits and Thresholds Amendments, National Insurance Funds Payments and Extension of Veteran's Relief) Regulations 2026" |
| URL | https://www.gov.uk/government/publications/report-to-parliament-on-the-2026-re-rating-and-up-rating-orders |
| Published | 13 January 2026 |
| Table | Table 2.1 and **Table 2.4 – Fund projections from 2025-2026 to 2030-2031** |
| Check status | FETCHED-AND-QUOTED |

| £ billion | 2025-26 | 2026-27 | 2027-28 | 2028-29 | 2029-30 | 2030-31 |
|---|---|---|---|---|---|---|
| Total receipts | 164.2 | 173.6 | 179.8 | 186.1 | 195.0 | 202.1 |
| Total payments | 154.0 | 161.6 | 165.9 | 170.6 | 178.1 | 186.1 |
| Excess of receipts over payments | 10.2 | 12.0 | 13.9 | 15.4 | 16.9 | 15.9 |
| Balance at end of year | 89.6 | 101.6 | 115.5 | 130.9 | 147.8 | 163.7 |
| Balance as % of benefit payments | 59% | 64% | 71% | 78% | 84% | 89% |

**Qualifications**
- Based on the **November 2025** EFO, not March 2026 (the report cites "Table 1.6 of the economy detailed forecast tables published alongside the November 2025 EFO").
- Benefits 2026-27: £152.5bn at present rates plus £6.9bn "Increase due to proposed changes" = £159.4bn.
- April 2026 uprating: basic and new State Pension "by 4.8% in line with the May-July 2025 AWE". Full new State Pension £230.25 to £241.30 a week.
- A growing Fund balance is **not** evidence that the State Pension is "in surplus" in any wider fiscal sense. The Fund is an accounting arrangement within the public finances, and the receipts shown do not cover all pensioner spending.

---

## 8. Demographic context

### Record `pop-pensionable-age-ons-2024based`

| Field | Value |
|---|---|
| Definition | Number of people of pensionable age, on the State Pension age applying in each year under current legislation |
| Value | **12.4 million (mid-2024)**; **14.2 million (mid-2034)**, a rise of 1.8 million (14.6%); **15.3 million (mid-2049)**, a rise of 23.7% |
| Geography | **UK** |
| Status | Mid-2024 base estimate; later years are projections, not forecasts |
| Publisher | Office for National Statistics |
| Publication | "National population projections: 2024-based" (statistical bulletin) |
| URL | https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationprojections/bulletins/nationalpopulationprojections/2024based |
| Published | 28 April 2026 |
| Quote | "the number of people of pensionable age is projected to increase by 1.8 million (14.6%), from 12.4 million to 14.2 million" |
| Classification | Estimate (2024); projection |
| Check status | FETCHED-AND-QUOTED |

**Qualifications**
- "Working age and pensionable age populations are based on State Pension age for the stated year according to current legislation." The 2034 figure therefore reflects State Pension age 67.
- This is a **resident population** count. It is not the number of State Pension recipients: 12.4 million UK residents of pensionable age (mid-2024) against a caseload of 12,987,000 (GB plus about 1.1 million overseas, 2024/25 average). The populations differ in geography, in overseas coverage and in entitlement.
- Total UK population: 69.3 million mid-2024 (table value 69,281 thousand), 71.0 million mid-2034.
- Underlying data tables were not opened; all values are from the bulletin text.

### Record `oadr-ons-2024based`

| Field | Value |
|---|---|
| Definition | "The number of people of pensionable age for every 1,000 people of working age." |
| Value | **280 (mid-2024)**; **310 (mid-2034)**; **329 (mid-2049)** |
| Geography | UK |
| Source | ONS, same bulletin |
| Quote | "OADR will increase from 280 in mid-2024 to 310 in mid-2034, and reach 329 by mid-2049" |
| Comparison | The 2022-based projections gave 311 for mid-2049 |
| Check status | FETCHED-AND-QUOTED |

### Record `oadr-obr-2026`

| Field | Value |
|---|---|
| Definition | "the population at or above state pension age (SPA), divided by the number of adults (sixteen and older) below the SPA" |
| Value | "rises more than 10 percentage points over the next 50 years, reaching **over 40 per cent by 2075**"; "held steady at around 30 per cent since the 1970s" |
| Source | OBR FRS July 2026, paras 2.12 and 2.13 |
| Check status | FETCHED-AND-QUOTED |

### Other ratio definitions in circulation

| Source | Definition | Value |
|---|---|---|
| OBR FRS July 2025 | Adults below State Pension age **per pensioner** (the inverse ratio) | "from 3.4 today to 2.7 by the early-2070s" |
| Resolution Foundation, June 2026 | People aged **16-64 per person aged 65+** (fixed ages) | "projected to fall from 3.3 to 1.9 between 2025 and 2075" |

**Trap:** these four measures are not interchangeable. ONS and OBR use a moving State Pension age, so legislated age rises hold the ratio down. Fixed-age measures (65+) show a much steeper change. ONS expresses the ratio per 1,000; OBR as a percentage; others as its inverse.

---

## 9. Tax paid by pensioners

### Record `pensioner-taxpayers-hmrc`

| Field | Value |
|---|---|
| Definition | Income Tax payers above State Pension age |
| Value | **8.16 million (22.2% of Income Tax payers)** in 2023 to 2024; **9.58 million (23.5%)** projected for 2026 to 2027 |
| Geography | UK |
| Status | 2023 to 2024: "Published estimates" based on survey outturn. 2026 to 2027: **projection** |
| Publisher | HM Revenue and Customs |
| Publication | "Income Tax liabilities statistics: tax year 2023 to 2024 to tax year 2026 to 2027", Bulletin – Commentary |
| URL | https://www.gov.uk/government/statistics/income-tax-liabilities-statistics-tax-year-2023-to-2024-to-tax-year-2026-to-2027/bulletin-commentary |
| Published | 15 July 2026 |
| Quote | "an estimated 18.9 million (46.3%) Income Tax payers are female, 21.9 million (53.7%) are male, and 9.58 million (23.5%) are above the state pension age" |
| Classification | Estimate; projection |
| Check status | FETCHED-AND-QUOTED |

**Qualifications**
- State Pension age is set at 66 for 2023 to 2024 through 2025 to 2026; for 2026 to 2027 "we have set the state pension age in 2026 to 2027 to a decimal value of 66.25".
- HMRC context: "21.8% of the population who were 16 or over were of state pension age, indicating that this demographic are slightly underrepresented in the Income Tax payer population."
- These are people **above State Pension age who pay Income Tax on any income**. It is not the number paying tax on their State Pension, and not the number of State Pension recipients who pay tax.

### Record `pensioner-tax-amount` — NOT-FOUND

**The amount of Income Tax paid by people above State Pension age was not found** in the HMRC commentary text read. The accompanying tables (Tables 2.1 to 2.6) were not opened. No figure for tax paid on State Pension income specifically was found in any source. The Resolution Foundation's net figure (`tl-cost-rf-2026`) implies a tax-and-benefit offset of roughly a quarter of the gross cost, but that is a think-tank estimate of a marginal effect, not an official statistic.

---

## Main definitional traps

1. **GB is not UK.** DWP tables are Great Britain plus overseas recipients. Northern Ireland is separate. OBR long-run figures are UK.
2. **"State Pension" is not "pensioner benefits" is not "pensioner spending".** 2024-25: £136.6bn (State Pension, DWP GB), £151.0bn (OBR pensioner spending), £164.9bn (DWP all benefits directed at pensioners).
3. **Accounting basis.** Resource basis (DWP tables), cash basis (NIF accounts) and DWP accounts give £136.6bn, £136.9bn and £137.4bn for the same year.
4. **Real terms means GDP deflator** in DWP tables, at 2026/27 prices.
5. **Caseload: point-in-time against annual average;** components overlap and must not be summed; about 1.1 million recipients live outside the UK.
6. **A triple lock "cost" always needs four labels:** counterfactual (earnings, CPI, smoothed earnings), year, annual or cumulative, gross or net. £11bn, £12.6bn, £15.5bn and £22.9bn are all defensible and all different.
7. **"Three times" is a ratio of two differences,** £15.5bn against a reconstructed £5.2bn, both relative to earnings uprating in 2029-30.
8. **The triple lock applies to the basic and new State Pension only.** Additional State Pension and protected payments are CPI-linked.
9. **Past cost is not future saving.** Ending the triple lock now does not recover the £15.5bn; it only stops further divergence. Short-run savings are small (GAD about £2bn cumulative to 2030-31; RF £650m in 2029-30) while long-run effects are large (OBR 1.8% of GDP by 2075-76).
10. **Projection editions differ.** FRS 2025 (7.7% by 2073-74) and FRS 2026 (8.6% by 2075-76) use different population projections and premia.
11. **Dependency ratios** come in at least four definitions.
12. **Pensioners paying tax** counts people above State Pension age with any taxable income, not tax on the State Pension.

## Not verified — needs a human or a later pass

- OBR EFO March 2026 detailed expenditure tables (State Pension line, UK): download blocked.
- IFS web articles (current triple lock cost figure; double lock analysis): HTTP 403.
- House of Commons Library briefing CBP-7812: HTTP 403.
- DWP Stat-Xplore State Pension dataset: not queried; overseas split at March 2026 not obtained.
- ONS NPP data tables; HMRC Income Tax liabilities tables: not opened.
- OBR Welfare trends reports: not examined.
- Origin of the £12.6bn figure attributed to the OBR by the Resolution Foundation.
- DWP Annual Report and Accounts 2024-25 (£137.4bn seen only as quoted in the NIF account).
