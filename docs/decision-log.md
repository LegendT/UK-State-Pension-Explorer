# Decision log

Short record of decisions made during the first build, 29 September 2026. Newest last.

**Who decided.** Numbers 13, 26 and 29 to 33 are the owner's. Numbers 1 to 11, 14 to 17, 19, 20, 22, 23, 25, 27 and 28 were made by the assistant during the build and accepted by the owner on 29 September 2026. The count of routes in number 2 was replaced by number 29. Number 12 was amended by number 31. Number 18 was confirmed by number 30. Number 24 was replaced by number 29. Number 21 was reopened by the owner: see number 34, which records a search made by the assistant and leaves a question for the owner.

| No. | Decision | Reason | Reversible |
| --- | --- | --- | --- |
| 1 | Eleventy 3.1.6, Nunjucks, vanilla JavaScript, one stylesheet, system fonts, JSON data. | Both sister sites use this stack. Pages and metadata are in the first HTML. | Yes |
| 2 | The four tools sit inside their subject pages, not on routes of their own. | Scope section 2 asks for the tool on the page. It keeps eight main routes. | Yes |
| 3 | Money in whole pence, percentages in tenths of a per cent. | Exact arithmetic. | Yes |
| 4 | Rates round to the nearest 5p. | DWP explanatory memoranda say so, and it reproduces every published full rate from 2010/11 to 2026/27. | Yes |
| 5 | The hypothetical rules have a cash floor of 0%, on by default, which can be switched off. | The ordinary law provides for no increase when earnings do not rise, not for a cut. The floor is labelled as an assumption. | Yes |
| 6 | A smoothed earnings link and a freeze are not in the calculator. | The proposals set the smoothed link differently, so a model would be invented. No current proposal for a freeze was found. | Yes |
| 7 | Tools update when a button is pressed, not as the reader types. | Simpler for screen reader users and meets SC 3.2.2 without argument. | Yes |
| 8 | Charts are SVG strings made by one module used by both the build and the browser. | The default chart needs no JavaScript, and the two cannot drift apart. | Yes |
| 9 | Observed spending is a table, not a budget preset. | The ONS suppresses health and education for retired households, so the categories do not add up to the total. A preset would need an invented remainder. | Yes |
| 10 | Budget presets show each source's own published budget, unchanged. No owner budget at the minimum standard, no London budget, no inflation update. | None is published in a form that could be checked. A renter's budget without rent is not an owner's budget. | Yes |
| 11 | Each preset switches the period to a week. | The sources publish weekly amounts. Converting to a month would round. | Yes |
| 12 | No analytics and no third-party requests in the preview. | Privacy by default. The sister sites use Cloudflare Web Analytics, which is an owner decision for launch. | Yes |
| 13 | `netlify.toml` builds a preview and sends `X-Robots-Tag: noindex` on every file. The preview uses basic authentication. The build writes the rule to `_headers` from the `BASIC_AUTH` variable, so no password is in the repository. | The owner chose Netlify and asked for basic authentication with the password kept out of `netlify.toml`. A preview build on Netlify stops without `BASIC_AUTH`. A production build stops with it, or while the `noindex` header is still in the file. | Yes |
| 14 | No `Dataset`, `FAQPage` or article structured data. `WebSite` and `WebPage` only. | The CSV download is a small compilation. Licensing of each source has not been reviewed for a dataset claim. The build refuses the other types. | Yes |
| 15 | Dark colour scheme included, following the device setting. | UK Migration Explorer has one. The sister sites disagree, so this is a choice, not an inheritance. | Yes |
| 16 | Focus style is a 3px outline in the accent colour. | The simpler of the two sister patterns, with no per-component overrides. | Yes |
| 17 | Citations read "Checked against the source on [date]". | Says what was done without naming who, because the check was made with an AI assistant and no person has reviewed it. | Yes |
| 18 | The link to the migration fiscal-claim page is in the register but not placed. | No passage on this site discusses the fiscal contribution of migrants. | Yes |
| 19 | The Trades Union Congress claim about international comparison was removed. | The source refused both automated and browser reading in this session, and its figures date from 2019 to 2021. | Yes |
| 20 | The April 2026 decision is cited to the explanatory memorandum, not the written statement. | The parliamentary site refused reading. The memorandum could be read and says the same. | Yes |
| 21 | Party positions for the Greens, SNP and Plaid Cymru are left out. | Only 2024 statements were found, two through other people's summaries. | Yes |
| 22 | `published` is empty for every page. `modified` is 29 September 2026, the date the content was first written. | The site is not published. Dates are never taken from a build. | Yes |
| 23 | Production builds stop unless the name, domain, correction route, owner and owner type, reviewer, accessibility assessment date and crawler policy are set. | The brief says production must not use placeholder values silently. | Yes |
| 24 | The title of the social care page says "a reported trade-off", not "the proposed trade-off" as in the scope. | No published proposal was found. | Yes |
| 25 | A claim that something was not found has no source. The register shows it as a record of a search. | No source can show an absence. | Yes |
| 26 | Only `BASIC_AUTH` is set in Netlify. `SITE_ENV`, `NODE_VERSION`, `PUPPETEER_SKIP_DOWNLOAD` and `PREVIEW_PASSWORD` were deleted there. | Owner's decision. They were marked secret on import, and Netlify's secrets scan failed the build on their values. The first three are set in `netlify.toml`. | Yes |
| 27 | The generated `_site/_headers` is left out of Netlify's secrets scan. | It must contain the sign-in. The scan still covers every other file. Follows from the owner's choice of basic authentication. | Yes |
| 28 | The site name is read from `SITE_TITLE`. | Netlify sets `SITE_NAME` to the project name on every build. | Yes |
| 29 | Pensions and social care is a dated section of the reform options page, at `/reform-options/#social-care`, not a page of its own. The site has seven main pages. Replaces number 24, and the count of routes in number 2. | Owner's decision. No published proposal ties the triple lock to social care, so a main page would rest on reporting. Nothing was published, so no redirect is needed. | Yes |
| 30 | The fiscal-claim page on UK Migration Explorer is not linked. The register entry is marked declined. | Owner's decision. Confirms number 18. | Yes |
| 31 | No analytics in the preview. Cloudflare Web Analytics at launch. | Owner's decision. Matches the sister sites. The privacy page and the Content Security Policy must change first. | Yes |
| 32 | `scripts/seed/` and `.preview-password` were deleted from the owner's computer. Neither was ever committed. | Owner's decision. The seed scripts could overwrite the registers. The owner has stored the sign-in elsewhere. | No |
| 33 | Netlify's own password page is to be turned off, leaving basic authentication as the one sign-in. | Owner's decision. Visitors were asked twice. The setting is in the Netlify screen and had not been changed when this was written. | Yes |
| 34 | The Greens, SNP and Plaid Cymru are still left out of the party positions, after a second search on 29 September 2026. Whether to list their 2024 positions, marked as 2024, is for the owner. | No statement of position from 2025 or 2026 was found. The 2024 general election manifestos were read at source this time: the SNP and Plaid Cymru commit to keeping the triple lock, and the Greens commit to uprating by inflation and wages without naming it. Plaid Cymru's page is now 404 and was read in an Internet Archive copy of 14 January 2026. The 2026 Holyrood and Senedd manifestos of the SNP and Plaid Cymru do not mention the State Pension. Not searched: written questions, social media, and news sites that refuse scripts. Replaces the reason given in number 21. | Yes |

## Contradictions and proposed scope changes

| Item | In the brief | Found | Proposal |
| --- | --- | --- | --- |
| A | Scope section 2D asks for examples covering owners without a mortgage, social renters and private renters, for single and couple households. | Published budgets exist for private renters (minimum, 2026), social renters (minimum, 2025) and owners (moderate only, 2025). They differ in standard and in price date. | Keep the six presets with their differences stated. Do not describe them as a like-for-like set. |
| B | Scope section 5 names the September 2026 Minimum Income Standard. | It exists. It changed pensioner housing from social to private rent, which breaks the series. | Done: stated on the page. |
| C | Scope section 9 lists the migration fiscal-claim page as a contextual destination. | The page does not mention pensions. | Not linked. Owner's decision, number 30. |
| D | Scope section 9 asks for a shared "Our other explainers" footer. | Neither sister site has one. UK Public Finances has a one-line "Sister site" sentence. UK Migration Explorer has no footer link. | Built here. The reciprocal change is new work on both sister sites. |
| E | The brief's premise that the trade-off between the triple lock and social care has been proposed. | Not found as a published proposal. Reported and inferred only. | The text says so, and is dated. It is now a section of the reform options page: number 29. |
| F | Scope section 6 asks for a larger 44px target for primary controls. | Buttons, inputs, summaries, menu links and links that stand alone in lists are 44px or close to it. Links inside table cells are smaller. | Done for list links. |
