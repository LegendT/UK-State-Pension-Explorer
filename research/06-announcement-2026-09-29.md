# 06 — The announcement of 29 September 2026: the triple lock and a National Care Service

Research file for UK State Pension Explorer. Retrieval date for every record: **2026-09-30**, except section A2 and the notes marked 1 October 2026, which are **2026-10-01**.

## How to read this file

Status categories and check statuses are those of `05-reform-politics-care.md`. One status is added:

- **BROWSER-CHECKED** — the site refuses automated download. The page was opened in Chrome 154 and each quote was matched against the page text by script, after the same normalising as `scripts/check-passages.py`.

**Method note.** Pages were downloaded with `curl` and converted to text, and quotes were copied from that text. The GOV.UK story was read through the content API. Two sites refused automated download and were read in a browser: ifs.org.uk and reformparty.uk. Every quote that went into the registers was then checked by `python3 scripts/check-passages.py`, which found 167 by script and 21 by the browser record, with none missing. On 1 October 2026, after section A2, it found 178 by script and 21 by the browser record.

**Known limits, stated once:**

1. **The announcement rests on one government news story.** No Bill, no technical note from a department, no costing method, no cost for the care service and no parliamentary statement was found. Parliament was not sitting.
2. **The mechanism is the Institute for Fiscal Studies' description.** The government has not published which measure of earnings is used, from what starting point, or how the catch-up is tested.
3. **No official transcript of the speech was found.** The speech was read as printed by The New World. Policy is quoted from the GOV.UK story where it says the same thing.
4. Quotes from news reports are verbatim from the report. They are evidence that the outlet reported those words.
5. Search summaries were wrong twice and were not used. One gave an Age UK statement of 29 July 2026 as its response to this announcement. One said HuffPost reported that the earnings link was removed, which the GOV.UK story contradicts.

---

## A. The announcement

**Record `ann-govuk`**
- Claim: The triple lock is kept until April 2030. From then the State Pension rises by inflation or 2.5%, whichever is higher, and by more if needed to keep its value relative to earnings. The government will legislate during this Parliament. A National Care Service with free personal care for older people is to be set up in the next Parliament, in phases, not covering bed and board, funded without borrowing, using the savings from the pension change.
- Status: ANNOUNCED COMMITMENT · Who: Prime Minister's Office · Date: 29 September 2026 (first published 20:23) · Geography: not stated in the document
- Publisher / title / URL: Prime Minister's Office, 10 Downing Street, "Prime Minister Andy Burnham sets out plans for a new National Care Service", https://www.gov.uk/government/news/prime-minister-andy-burnham-sets-out-plans-for-a-new-national-care-service
- Quotes: "The current State Pension Triple Lock will be maintained until April 2030." · "From April 2030, the adjusted Triple Lock will mean the State Pension continues to rise by 2.5% or inflation - whichever is higher – and by even more if that is required to maintain its value relative to earnings." · "The Government will legislate for the change during this Parliament." · "Adjusting the Triple Lock is estimated to reduce state pension spending by £15 billion a year by the end of the 2030s, rising to £50 billion a year by 2050." · "A National Care Service will be established in the next Parliament, providing free personal care for older people, based on need rather than ability to pay." · "The service will not cover bed and board, for which existing means-tested council contributions will remain." · "It will be fully funded – and not through borrowing." · "Savings under the adjusted Triple Lock will be used for a new National Care Service, with Baroness Casey to recommend how and when it is built up." · "Nobody's pension will ever go down."
- Not used on the site: "increasing the State Pension by over £2,000". No base year or rate is given, so it cannot be checked. Also not used: "Around three in four adults over 65 are expected to need care and support during later life, with one in seven facing costs of more than £100,000." The story gives no source for either number.
- Check status: FETCHED-AND-QUOTED.

**Record `ann-speech`**
- Claim: In the speech the Prime Minister said the promise to keep the triple lock this Parliament would be honoured and that it would be adjusted in April 2030.
- Status: ANNOUNCED COMMITMENT · Date: 29 September 2026
- Publisher / title / URL: The New World, "'We will hope again': Andy Burnham's full speech to the 2026 Labour Party Conference", https://www.thenewworld.co.uk/we-will-hope-again-andy-burnhams-full-speech-to-the-2026-labour-party-conference/
- Quotes: "From there, in April 2030, we will adjust it." · "The state pension will continue to rise every year at least by prices or 2.5%." · "And it will hold its value relative to earnings over time so that pensioners will always share in the rising prosperity of the nation."
- Used on the site from 1 October 2026, as claim `pm-speech-income-tax`, on the State Pension page under "Tax and how it is paid": "I can also confirm today our commitment to ensure that the low-income pensioners won't be dragged into paying income tax in this Parliament." Searched on 1 October 2026: the whole speech on the page mentions Income Tax once, in this sentence; the GOV.UK story does not mention it; and no government document on or after 29 September states the commitment. NOT-FOUND: who counts as on a low income, and how it would be done. The nearest official text is Budget 2025's commitment on Simple Assessment from 2027-28, already claim `simple-assessment-2027`. The Chancellor's "In this Parliament, they won't have to pay the tax" of 27 November 2025 was found only in a trade report (Pensions Age, 28 November 2025) and was not used. Hansard could not be read: parliament.uk refused automated requests.
- Check status: FETCHED-AND-QUOTED from a newspaper's transcript. Only the paragraphs on pensions and care were read.

## B. Research bodies

**Record `ifs-comment`**
- Claim: The rule is the highest each year of CPI inflation, 2.5%, or the amount needed for the pension to keep up with average earnings growth since the rule began. It removes the permanent ratchet. Early savings are small.
- Status: RESEARCH FINDING · Who: Jonathan Cribb, Heidi Karjalainen, Helen Miller · Date: 29 September 2026
- URL: https://ifs.org.uk/articles/how-will-new-triple-lock-work-and-what-effects-will-it-have
- Quotes: "the amount needed to ensure the state pension keeps up with average earnings growth since the introduction of the new policy" · "It removes the most expensive and unattractive element of the old triple lock which is the permanent ratchet effect." · "If the new triple lock had been in place instead, expenditure in 2026–27 would be £9 billion lower than it currently is." · "the old triple lock has increased annual state pension expenditure by £16 billion by 2026–27 compared with indexation in line with average earnings growth" · "the state pension would still have risen in real terms (i.e. faster than inflation) by 6%"
- A point to keep: the comment's ten-year example says the pension returns to following earnings "By year 9". Worked from the stated inputs, the rise in year 9 is still 2.5%, and year 10 is the first rise led by earnings. The example is stylised. It cannot be an exact test for a calculator without the figures behind the chart.
- Check status: BROWSER-CHECKED.

**Record `ifs-response`**
- Status: COMMENTARY · Who: Jonathan Cribb · Date: 29 September 2026
- URL: https://ifs.org.uk/articles/new-triple-lock-much-improved-not-perfect-and-not-enough-fund-universal-social-care
- Quotes: "We should not expect this reform to save enough that it could fund universal social care in the next parliament." · "the minimum 2.5% increase each year remains an arbitrary and potentially costly part of the system"
- A point to keep: he speaks of universal care. The announcement is free personal care, in phases.
- Check status: BROWSER-CHECKED.

**Record `rf-response`**
- Status: COMMENTARY, with two figures · Date: 29 September 2026
- URL: https://www.resolutionfoundation.org/press-releases/recycling-savings-from-ending-the-triple-lock-into-social-care-is-good-news-for-vulnerable-pensioners/
- Quotes: "recycling the savings into social care is especially good news for vulnerable pensioners" · "it would have left the State Pension 4.5 per cent higher than just a link to earnings, but 5.9 per cent lower than it is with the triple lock this year"
- Check status: FETCHED-AND-QUOTED. No method is given for the figures.

## C. Parties

| Party | What was found | Source | Check status |
| --- | --- | --- | --- |
| Reform UK | "Reform UK will always protect our pensioners and maintain the triple lock" | The party's own news page, 29 September 2026 | BROWSER-CHECKED |
| Conservatives | The leader said the change "won't generate enough savings to fund a nationalised care system for another two decades". No statement on keeping the lock after 2030 was found | LBC, 29 September 2026. PA News carries other words of hers | SECONDARY-ONLY |
| Liberal Democrats | The leader: "cannot wait until after another election, and it can't be funded from the pockets of our poorest pensioners" | LBC, quoting a post on X that was not opened | SECONDARY-ONLY |
| Scottish National Party | The First Minister: "I think it's a bad idea." and "Scotland has provided free personal care for the elderly without punishing pensioners into the bargain." | BBC News, published by Yahoo News, 29 September 2026 | SECONDARY-ONLY |
| Plaid Cymru | The Westminster leader responded to the speech. No position on the pension change in the report | Nation.Cymru, 29 September 2026 | SECONDARY-ONLY |
| Green Party | The leader called the speech "half measures, reannouncements and tinkering". No position on the pension change in the report | LBC, citing PA News | SECONDARY-ONLY |

Searched and not found on the parties' own sites: conservatives.com, libdems.org.uk, greenparty.org.uk, snp.org, plaid.cymru.

## D. Charities, unions and others

All SECONDARY-ONLY. Age UK, the Health Foundation and the King's Fund are as quoted by Healthcare Management, 29 September 2026. Their own sites were searched and the statements were not found there. Unite is as quoted by PA News.

- Age UK: "we postpone judgment on the overall impact of their proposed reform until we can scrutinise the detail"
- The Health Foundation: "additional public investment will be needed to deliver a fairer and more universal system"
- The King's Fund: "Many genuine questions remain about how these reforms will work in practice and how much it will cost."
- Unite: "Going to the well of pensioners before going for the super rich is wrong."

## E. Geography

- PA News: "creating a NHS-style care service in England". SECONDARY-ONLY.
- The Secretary of State for Wales, reported by Nation.Cymru from a television interview: "The right proportion of that funding will come to Wales, it will then be up to the government of the day to implement a new national care service." SECONDARY-ONLY.
- The GOV.UK story names no nation. NOT-FOUND: any government statement on Scotland or Northern Ireland.

## A2. Added on 1 October 2026

**Record `yougov-2026-09-29`**
- Claim: In an online poll of 4,503 adults in Great Britain on 29 September 2026, 48% supported the change to the triple lock from 2030 to help fund a care service, 28% opposed it and 25% did not know.
- Status: OPINION POLL · Who: YouGov, self-commissioned · Date: 29 September 2026 · Geography: Great Britain
- Publisher / title / URL: YouGov, "Britons support changing triple lock to fund care service by 48% to 28%", https://yougov.com/en-gb/articles/55654-britons-support-changing-triple-lock-to-fund-care-service-by-48-to-28
- Quotes: "Sample size: An online survey of 4,503 adults aged 18+ in Great Britain" · "Fieldwork: 29 September 2026" · "Andy Burnham has announced he plans to change the triple lock in 2030 so that pensions only increase by whatever is highest out of inflation or 2.5%. The money will be used to help fund part of a national care service. Do you support or oppose this policy?" · "Connecting the triple lock change with contributing funding to a National Care Service increases support – but not by much, at 48%, while the number opposed remains largely the same at 28%"
- Chart data, https://datawrapper.dwcdn.net/1WFlo/1/dataset.csv, for that question: strongly support 17, somewhat support 31, somewhat oppose 14, strongly oppose 14, don't know 25. The poll also asked about the change without the care service (43% for, 30% against) and about a free care service alone (74% for, 11% against). Not used: the site reports the question about the announced plan only.
- Not used: support by party vote. Subgroups are smaller samples and the article gives no margins.
- Limit: the question describes the rule as "inflation or 2.5%" and leaves out the earnings part of the announced rule. The site says so.
- Check status: FETCHED-AND-QUOTED on 1 October 2026, page and chart data.

## F. Not found

- A Bill, draft clauses or a technical note.
- The earnings measure, the starting point and the scope of the rule (which parts of a payment).
- The price basis, baseline and method of the £15 billion and £50 billion.
- A government cost for the care service. News reports give about £18 billion a year without naming a source.
- Any analysis of who gains and who loses.
- Anything on Pension Credit.
- A costing by the Office for Budget Responsibility.

## G. Not used

- A YouGov poll of 29 September 2026 on support for the change. Used from 1 October 2026: see record `yougov-2026-09-29` in section A2.
- Nuffield Trust comments, seen only in a trade report.
- A Reuters line, seen in a search summary only, that the change depends on winning the next election. The GOV.UK story says the government will legislate during this Parliament.
