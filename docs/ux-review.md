# UX review: length, layout, organisation and comprehension

Written 30 September 2026 by the assistant, at the owner's request. **A frozen record.** It is not edited after it is written. Which recommendations are accepted, and their state, belong in `docs/HANDOVER.md`, not here.

Scope: the seven content pages, as built from `main` at `5fbe6c3` in development mode. The sources page was measured and looked at only for its structure. The accessibility, privacy, site map and not-found pages were not reviewed. The owner asked for a review only. Nothing on the site was changed.

Audience assumed, on the owner's answer of 30 September 2026: the public and specialists equally. Recommendations are free to depart from the sister sites.

The claims cover structure and length. No reader was tested, so none of them shows that a reader understands more.

## Summary

Sentence length is not the problem. Sentences average 13 to 15 words on every page, and only 4 to 7% are longer than 25 words. Only sentence length was measured. The pages are long because of how much they hold and how often they repeat it.

1. **Reform options is several pages in one.** 17,350 words, 90 screens on a phone. The social care section alone is 24 screens. It answers at least seven separate questions.
2. **Each figure card shows everything at once.** Kind, period, coverage, caveat, source and check date are open on every card. One number takes a phone screen, and cards next to each other repeat the same caveat.
3. **Citations are a fifth of the text.** 20% of visible words on reform options and the State Pension page, 18% on the triple lock page, and 26% on the overview. The same government news story is cited in full 10 times on one page.
4. **The overview has become a news page.** Its "In the news" section is 6 phone screens, twice the 3 screens of "Find where you stand".
5. **Long pages have no way back.** There are no back-to-contents links on any page. On reform options the contents list starts on the second phone screen, below two callouts. At desktop width about 40% of the content area is empty beside the text.
6. **Headings name topics, not findings.** A reader who scans only the headings learns what each section is about, not what it says.
7. **Charts do not state their message.** The rule comparison's default view draws four of its five lines on top of each other, with a five-item legend. Both charts cut off their last year label.
8. **Specialists cannot reproduce a result from a link.** No calculator puts its settings in the page address.

Three recommendations make the biggest difference. Slimming the figure cards and shortening citations cut length on every page and remove no content. Splitting reform options does not cut the total, but gives each page one main question.

## Method

| Step | How | Result held in |
| --- | --- | --- |
| Research | A research agent read primary sources: Analysis Function, ONS Service Manual, Office for Statistics Regulation, GOV.UK Design System and style guidance, Nielsen Norman Group, and papers on communicating uncertainty. Three key quotes were then checked by the assistant against the raw pages with `curl` and matched word for word | "Evidence" below |
| Length and structure | A script over the built HTML: words in `main`, words inside `details` and tables, the heading outline, and the share of words in "Source:" lines | "Measurements" below |
| Rendered pages | Puppeteer with the local Chrome at 390 × 844 and 1280 × 900: page heights, the first screen of every content page, and nine sections sampled deeper down | Looked at by the assistant |
| Scanning checks | In the browser: sentence length, where the contents list starts, back-to-contents links, `id` on `h3`, chart titles, text outside the chart's drawing area | "Measurements" below |
| Guidelines supplied by the owner | `ux_guidelines_for_statistical_websites.md` tested line by line against the research | "Where the supplied guidelines fit" |

### What this review did not do

- No reader was tested, by the owner's decision of 30 September 2026. Every finding is the assistant's reading against published guidance, not an observation of use. The review's claims therefore cover structure and length only. Whether a change helps readers understand the site is not shown by this review.
- Content accuracy was not reviewed.
- Dark mode, keyboard use and screen readers were not looked at for this review. See `docs/accessibility-assessment.md`.
- Screens sampled: the first screen of all seven content pages at both widths, and nine sections below. Most of each page was measured by script, not looked at.
- Calculator results were seen in their default state only.
- Whether terms are defined where they first appear was not checked. The glossary exists on the sources page.
- Readability was measured by sentence length only.

## Measurements

Phone screens are 844 CSS px tall, desktop screens 900. Reading time assumes 230 words a minute. Visible words leave out `details` and tables. The citation share counts every visible "Source:" line, in running text and on figure cards. Sentence figures leave out `details`, tables and charts.

| Page | Words in `main` | Visible words | Phone screens | Desktop screens | Citation share of visible words | Mean sentence, words | Sentences over 25 words | Contents list starts at (phone) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Overview | 2,789 | 2,395 | 15.7 | 9.6 | 26% | 13.6 | 5% | No list |
| The State Pension | 4,902 | 3,245 | 22.1 | 13.8 | 20% | 13.0 | 5% | 777 px |
| The triple lock | 1,946 | 1,946 | 14.2 | 9.0 | 18% | 13.9 | 6% | 532 px |
| History | 1,777 | 1,777 | 15.9 | 10.0 | 5% | 15.6 | 7% | 598 px |
| Living on a pension | 5,602 | 3,512 | 27.1 | 16.5 | 6% | 12.9 | 4% | 532 px |
| Reform options | 17,350 | 14,390 | 90.2 | 53.8 | 20% | 13.8 | 7% | 1,644 px |
| Sources and method | 19,429 | about 2,000 before the registers | 16.1 | 11.3 | Not measured | Not measured | Not measured | Not measured |

The sources page's registers sit in three `details` elements. That is the right use of `details`: the registers are for the few readers who want them.

Tallest sections on a phone:

| Page | Section | Phone screens |
| --- | --- | --- |
| Reform options | Pensions and social care | 23.8 |
| Reform options | Try it: compare the rules | 13.7 |
| Reform options | Options for the yearly increase | 11.1 |
| Living on a pension | Try it: what does the pension cover? | 9.1 |
| Living on a pension | What research says a standard of living costs | 7.0 |
| History | Try it: explore the history | 7.2 |
| Overview | In the news | 6.0 |
| Overview | Find where you stand | 3.0 |

Repetition on reform options:

- "Checked against the source on 29 September 2026": 28 times.
- The Prime Minister's Office news story, cited in full: 10 times.
- Each of two Institute for Fiscal Studies publications: 9 or 10 times.
- "April 2030": 42 times.

Anchors: `h2` elements have an `id` on every page. `h3` elements mostly do not: 0 of 17 on the State Pension page, 1 of 7 on the overview, 20 of 43 on reform options.

## Evidence

The principles this review applies. Quotes marked **[checked]** were compared by the assistant with the raw page or PDF. The rest were read by the research agent through a tool that summarises. Check them on the page before quoting them anywhere public.

| No. | Principle | Source | Strength |
| --- | --- | --- | --- |
| E1 | Put the answer first, then detail in falling order of importance. | GOV.UK, [Clear structure](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-structure/): "Put the most important information first." NN/g, [Inverted pyramid](https://www.nngroup.com/articles/inverted-pyramid/) | Official guidance, research-backed |
| E2 | Attention falls sharply down a page. | NN/g, [Scrolling and attention](https://www.nngroup.com/articles/scrolling-and-attention/): "57% of their page-viewing time above the fold. 74% of the viewing time was spent in the first two screenfuls" **[checked]**. Analysis Function, [Writing about statistics](https://analysisfunction.civilservice.gov.uk/policy-store/writing-about-statistics/): "only 20% of users scroll a quarter of the way down a bulletin" **[checked]** | Research-backed |
| E3 | A long page is acceptable when it is built for scanning. Headings carry the meaning, with the key words first. | NN/g, [Layer-cake pattern](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) | Research-backed |
| E4 | Active headings that state the main message are more memorable. | Analysis Function, Writing about statistics | Official guidance |
| E5 | Long pages need a labelled contents list near the top, and back-to-top links. On a phone, a single intro paragraph can push the list below the first screen. | NN/g, [Table of contents](https://www.nngroup.com/articles/table-of-contents/) and [In-page links](https://www.nngroup.com/articles/in-page-links-content-navigation/) | Small study, practitioner guidance |
| E6 | Do not hide what most readers need. Use `details` for what only some need. | GOV.UK Design System, [Details](https://design-system.service.gov.uk/components/details/): "Do not use the details component to hide information that the majority of your users will need." **[checked]** | Official guidance |
| E7 | Progressive disclosure works for two levels at most. | NN/g, [Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Research-backed |
| E8 | Cite a public source for every figure, with its context and limits alongside. | OSR, [Intelligent transparency](https://osr.statisticsauthority.gov.uk/wp-content/uploads/2022/02/regulatory_guidance_intelligent_transparency_updated_Sept_2023.pdf) **[checked by the research agent against the PDF]** | Official guidance |
| E9 | Test the one sentence a journalist is likely to lift out. It must not mislead on its own. | OSR, Intelligent transparency **[checked by the research agent against the PDF]** | Official guidance |
| E10 | Caveats that change what a figure means go up front. The rest can be layered. | Analysis Function, [Communicating quality, uncertainty and change](https://analysisfunction.civilservice.gov.uk/policy-store/communicating-quality-uncertainty-and-change/) | Official guidance |
| E11 | A chart title states the main trend, in 15 words or fewer. Label lines directly and avoid legends. | ONS Service Manual, [Chart text](https://service-manual.ons.gov.uk/data-visualisation/guidance/chart-text). Analysis Function, [Charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/) | Official guidance |
| E12 | Annotate the feature to be noticed, in 10 to 12 words, next to it. | ONS Service Manual, [Annotations](https://service-manual.ons.gov.uk/data-visualisation/guidance/annotations) | Official guidance |
| E13 | Calculators: embedded on the relevant page, inputs explained, results framed in words, defaults that do not read as advice. Readers can "Change individual inputs without having to reenter all the other inputs". | NN/g, [Calculator recommendations](https://www.nngroup.com/articles/recommendations-calculator/) | Research-backed, qualitative |
| E14 | A result a journalist quotes is better when it can be reproduced. | Derived from E8 and the Analysis Function's reuse guidance. No source specific to calculators | Practitioner opinion |
| E15 | Dashboards push interpretation onto the reader and do not suit data that needs explaining. | ONS Service Manual, [Dashboards](https://service-manual.ons.gov.uk/data-visualisation/guidance/dashboards). OSR, [Dashboards](https://osr.statisticsauthority.gov.uk/guidance/regulatory-guidance-dashboards/pages/4/) | Official guidance |
| E16 | Chart decoration did not reduce accuracy and improved recall. The authors warn against applying this to all charts. | Bateman and others, [Useful junk?](https://sites.stat.columbia.edu/gelman/communication/Bateman2010.pdf), CHI 2010 **[checked by the research agent against the PDF]** | Research-backed, one small study |

## Findings across the site

### F1. Figure cards open every detail on the page

Seen on the State Pension page at 390 px: the two cards for the full rates take a phone screen and a half. Each prints the kind badge, the period, the coverage, a caveat of about 40 words, the source and the check date, before "More about this figure". The two cards repeat the same caveat word for word: "A full rate, not everyone's payment. The amount a person gets depends on their National Insurance record..."

On reform options at 1280 px, three cards side by side hold 60 to 90 words of detail each under a single number.

The details are right to exist and right to be on the page (E8). A caveat that changes what the figure means belongs open next to it. The rest can be layered below it (E10). Specialists lose nothing: every detail stays one click away.

### F2. Citations after every sentence

Reform options, "The rule announced for April 2030", at 390 px: in one screen the reader meets four full citations, two of them the same Prime Minister's Office story. That citation alone is 19 words.

Citing every figure is right (E8). Printing the full title of the publication in running text is a choice. Together with the source lines on figure cards, citations are a fifth of each page, so R2 and R3 overlap.

### F3. The same check date on every figure

"Checked against the source on 29 September 2026" appears 28 times on reform options, 17 on the State Pension page and 9 on living on a pension. On reform options 28 of the 32 check lines carry that date. On the other two pages all of them do. Decision 17 set the words. Their placement is open.

### F4. Long pages without navigation

- No page has a back-to-contents link (E5).
- At 1280 px paragraphs are 640 px wide in a content area of 1,056 px, so about 40% of the content area is empty beside the text. Measured on four pages. Figure cards, tables and calculators use the full width. The contents list is a plain list that scrolls away.
- On reform options the contents list starts at 1,644 px on a phone, below "How to read this page" and "A change was announced on 29 September 2026" (E5).
- Most `h3` elements have no `id`, so a journalist cannot link to "Pension Credit" or "Means-test by income".

### F5. Headings name topics

Most headings are labels: "Tax and how it is paid", "Income", "Housing and wealth", "What the State Pension costs". A few already state a finding and show what is possible: "Next year's rate is not yet decided", "35 years does not guarantee the full rate for everyone", "A 4-week payment is not a month's money" (E3, E4).

Not every heading needs to state a finding. Reference sections, such as the rules for deferring, are better as labels. A section that reports evidence needs a heading that says what the evidence shows.

### F6. Charts

- **Titles name the measure, not the message** (E11). The history chart is captioned "Cash: pounds a week in the money of each year", under a heading that names the series and years. The rule comparison chart is captioned "Cash: pounds a week, in the money of each year".
- **Lines that coincide are not explained on the chart.** In the rule comparison's default scenario, the triple lock, the double lock, the earnings link and the rule announced for April 2030 are drawn as one line. The reader sees two lines and a five-item legend. The fact that four rules give the same result is the message, and it is only in the note under the settings, "Why this scenario is here".
- **The last year label is cut off.** In both charts, the last label on the horizontal axis runs from x = 678 to x = 730 in a 720-wide `viewBox`, so "2036/37" shows as "2036/3" and "2026/27" as "2026/2". Measured with `getBBox` in Chrome.
- **Policy events are not annotated** on the history chart: the years the earnings measure was suspended, and the start of the new State Pension (E12). They are explained in "The exceptional years", above the tool.

### F7. Calculators

- **Drop-down lists cut their text** at 390 and 1280 px: "Cash: the money of ea" in the rule comparison and the history explorer, and "Full basic State Pensio" and "None: published rates only" in the history explorer. The text is wider than the 220 px control, less its arrow.
- **No shareable state.** No script writes to the page address. The rule comparison and the history explorer would benefit from it, so that a quoted result can be reproduced (E14, practitioner opinion). The budget tool must not use it, because its privacy promise says nothing goes in the page address.
- **Instructions before the form.** On living on a pension, "Before you start" and "How to enter amounts" take about two phone screens before the first field. All of it is needed. It can sit beside the fields it governs.
- Decision 7, results on a button press rather than as the reader types, stands. The research's point is that changing one input must not mean entering the others again (E13), which the tools already meet.

### F8. What works, and is to be kept

- The overview answers its question in the first screen at both widths: "£241.30 a week", in words, with what it is and is not (E1).
- Sentences are short and plain on every page.
- Every chart has a full table, and the history data downloads as CSV.
- Figures are labelled by kind: published rate, observed statistic, forecast, estimate. That is the distinction between exact figures and estimates that the uncertainty research asks for.
- The sources page puts its registers in `details`, which is the right use.
- "Not available" blocks say what was searched for and not found.

## Page by page

### Overview (15.7 phone screens)

The first screen is right. After "Find where you stand" the page turns into news: "In the news: what is decided and what is not" has six sub-sections over 6 phone screens. The page cites the same news story in full 7 times. It then has "Next year's rate is not yet decided", "Distinctions that matter" and "About this site".

Recommendation: keep the rates, "Find where you stand" and "Where to go next". Cut "In the news" to three or four sentences on what was announced, what is law and what is not decided, with one link to the full account on reform options. Expected length: about 10 phone screens, from 15.7 less most of the 6.

### The State Pension (22.1 phone screens)

Well ordered. The length is F1 and F2: 5 figure cards, 17 "More about this figure" panels with their open source notes, and 20% citations. Pension Credit and other help is 3 screens.

Recommendation: slim the cards (R2). Give every `h3` an `id`. If reform options is split under option A, consider moving "How it is paid for", on the National Insurance Fund, to the new costs page. It answers a question about the public finances rather than about what a person receives.

### The triple lock (14.2 phone screens)

The shortest content page on a phone, with a calculator in 3.3 screens. The order is sound: measures, timing, law, worked example, tool, compounding, history, limits. Citations are 18%.

Recommendation: short citations (R3). A statement heading or two: "Why one year's increase affects every later year" already works as one.

### History (15.9 phone screens)

Citations are only 5%. The explorer is 7.2 screens, most of it the full table under the chart. The chart title and the axis label repeat each other.

Recommendation: a message title on the chart, annotations for the suspended years and 2016, and settings in the page address. Fix the cut label.

### Living on a pension (27.1 phone screens)

The page keeps three different questions apart, which is its point, and it says so in its introduction. The length comes from the Minimum Income Standard section (7 screens, with two long budget tables) and the budget tool (9 screens: two screens of instructions, the form, and six example budgets).

Recommendation: slim the cards. Put the instructions for entering amounts next to the fields they govern. Move the example budget descriptions under the example chooser, shown when chosen. Consider a message title on each budget table.

### Reform options (90.2 phone screens)

It answers at least seven questions:

1. What is the rule announced for April 2030, and how would it work?
2. What does the State Pension cost, and what would a change save?
3. Who receives what: income, poverty, wealth, sex, disability and caring?
4. What would each rule give over time? (the calculator)
5. How are pensions tied to social care?
6. Should entitlement change: means-testing and the alternatives?
7. What are the arguments, and what can evidence settle?

A reader who wants the social care plan must scroll past 11,000 words: the section starts at word 11,038. A journalist who wants the cost figures is on the right page but faces 90 screens with a contents list below two callouts.

Options, for the owner:

- **A. Split into pages.** For example, four pages:
  - "The April 2030 rule and the options for the yearly increase", with the calculator.
  - "Costs and who is affected".
  - "Pensions and social care".
  - "Means-testing and entitlement", with the arguments and what evidence can settle.

   Each page becomes, by estimate, 12 to 30 phone screens. The first page holds the options (11.1) and the calculator (13.7), so it is the longest. This reverses part of decision 36, which kept social care as a section until the Casey commission reports. Nothing is published, so no redirects are needed.
- **B. Keep one page and shorten it.** Apply R2 and R3, merge the two opening callouts into one sentence, and cut repetition of the announcement between the callout, the option card and the social care section. The page stays long, likely 50 phone screens or more. R4 makes it easier to move through.
- **C. Split out social care only.** The smallest structural change: one section of 24 screens becomes its own page. This is the part of decision 36 that the evidence most bears on.

The assistant recommends A. The page does not have one main question, which is the test that decides whether a long page can work (E1, E3).

### Sources and method (16.1 phone screens, most of it in `details`)

Works as a reference page. The registers are rightly hidden. Not reviewed further.

## Where the supplied guidelines fit

`ux_guidelines_for_statistical_websites.md` is written for an exploratory data dashboard. This site is an explainer. The ONS and OSR both say dashboards suit data that needs no explanation and push interpretation onto the reader (E15).

| Guideline | Fit | Why |
| --- | --- | --- |
| Overview first, zoom and filter, details on demand | The idea fits, the mechanics do not | For prose the equivalent is the inverted pyramid (E1) |
| Landing view shows only aggregations | Does not fit | Decision 44 reasons that readers need to recognise themselves on the first page. Not tested with readers |
| Dashboard with key metrics at the top | Does not fit | Key figures first, yes, but as sentences with context |
| Cross-filtering | Does not apply | No linked charts |
| Progressive disclosure | Fits, with a limit the document leaves out | Only for what most readers do not need (E6, E7). This is R2 |
| Data-ink ratio, remove non-data pixels | Overstated | Titles, annotations and source lines are required by official guidance. A study found chart decoration did not reduce accuracy (E16) |
| Label directly, no legend | Fits | E11. This is R7 |
| Plain English with tooltips or a glossary | Plain English fits. Tooltips do not | Tooltips need hover and fail on touch. Define terms in place |
| Annotate method changes on the chart | Fits | Also policy events. R7 |
| Confidence bands for survey data | Rarely applies | Most figures here are set in law. Projections are the live case, and the site already labels them |
| Bar axes at zero | Fits | A line chart can start above zero if the break is shown |
| Deep-linked state | Fits for the rule comparison and the history explorer. Not for the budget tool | R8 |
| Export of the filtered view | Fits in spirit | The history explorer offers a download of the table shown. Its buttons have not been pressed in a test |
| Colour independence, table for every chart, SVG | Fits | Already done |
| Mobile tables: a fixed first column, or stacked cards | Partly fits | Scrolling fits, and the site uses it. Card layouts can break table semantics for screen readers. Whether the site's first column stays fixed was not checked |

## Recommendations, ranked

Ranked by the assistant's judgement of effect on length and comprehension, then by cost. Only one bound was measured: R3 acts on at most 18 to 26% of visible words on four pages. Sizes are the assistant's estimates.

| No. | Recommendation | Pages | Size | Touches a recorded decision |
| --- | --- | --- | --- | --- |
| R1 | Split reform options into pages (option A above), or option B or C | Reform options, navigation, site map, page register | Large | Decision 36, and decision 29's count of seven main pages |
| R2 | Slim figure cards to the number, one line on what it is, the kind badge and a short source. Keep a caveat open only where it changes what the figure means (E10). Move the rest into "More about this figure" | All pages with cards, and `m.stat` | Medium | The markup convention for figure cards in the README |
| R3 | Short citations. Name the organisation and date in running text, linked to the source: "(Institute for Fiscal Studies, 29 September 2026)". Cite a source once per paragraph. Keep full titles in the register and in "More about this figure". Print the check date once per section, or inside "More about this figure" | Every page | Medium | Decision 17 keeps its words. Only their place changes |
| R4 | Navigation for long pages. A back-to-contents link at the end of each `h2` section. At 1024 px and wider, a contents list of `h2` headings that stays in view in the empty right-hand column, scrolls on its own if taller than the screen, and never covers focused controls (SC 2.4.11). An `id` on every `h3` | Every long page | Small to medium | None |
| R5 | Shorten the overview's news section to a few sentences and a link | Overview | Small | None. Decision 44 is untouched |
| R6 | Statement headings where a section reports evidence | Reform options, living on a pension, the State Pension | Small, but needs the owner's reading | None |
| R7 | Charts: a message title, direct labels, one label for lines that coincide, and annotations for policy events. On the two calculator charts, the chart module works out the title and the coinciding-line label from each result, because a typed title is false once the inputs change | History, reform options, and the chart module | Medium | Decision 8, one module for build and browser, holds |
| R8 | Settings in the page address for the rule comparison and the history explorer. Never for the budget tool | Two tool scripts | Medium | None |
| R9 | Widen the drop-down lists so their text shows | Rule comparison, history explorer | Small | None |
| R10 | Put the budget tool's instructions next to the fields they govern | Living on a pension | Small | None |

R9 and the cut-off chart label in F6 are defects, and each can be fixed on its own. R1 to R3 change the most. Look at them together in the browser before the rest, because they change what every page looks like.

After any change of this size: `npm run build`, `npm test`, `npm run a11y` and `node scripts/a11y-manual-assist.mjs`, with every changed page looked at in Chrome at 390 and 1280 px.
