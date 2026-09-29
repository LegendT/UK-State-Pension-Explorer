# Claude Code build prompt — UK State Pension Explorer

Build a complete, reviewable first version of **UK State Pension Explorer**, a sister site to:

- https://ukpublicfinances.org/
- https://ukmigrationexplorer.org/

Research, write, build and verify the site. Treat the supplied documents as the starting specification, not a completed research dossier. Conduct further research wherever needed to substantiate claims, test assumptions and identify omissions. If evidence challenges the scope, explain the finding and propose a correction. Continue through to a complete, reviewable implementation rather than stopping at a plan or visual prototype. Accuracy, precision, reader trust and WCAG 2.2 AA accessibility are release requirements. Use plain British English throughout.

## Read the supplied brief first

These three Markdown documents accompany this prompt. Locate them in the project, read each in full, and keep them available as implementation references:

1. **`uk-state-pension-explorer-scope.md`** — the controlling product specification: eight main pages, four tools, evidence requirements, accessibility, delivery, maintenance, sister-site links and metadata.
2. **`uk-state-pension-explorer-scope-review.md`** — the critique behind the revised scope. Treat its findings as regression risks to prevent, not a separate request to restore earlier proposals.
3. **`sibling-metadata-review.md`** — observations from six sibling-site pages and both sites' sitemaps and robots files, inspected on 29 September 2026. Use its lessons alongside section 10 of the scope. It is a representative inspection, not a full audit or proof of current behaviour.

If a document is unavailable, identify the missing file and request it rather than reconstructing its requirements from this prompt. Once the documents are available, follow the revised scope where older review wording differs. Treat this prompt as implementation guidance; it does not replace or narrow the scope. Record material contradictions or proposed scope changes instead of quietly resolving them by dropping requirements.

The documents contain dated facts and research leads. Recheck material facts against their underlying sources before using them as current content. Neither the planning documents nor the sibling sites substitute for primary evidence.

## Begin with the repository and a durable implementation plan

Read repository instructions and inspect the existing structure, dependencies and any supplied sibling-site code. Preserve unrelated work and use the established stack where suitable. For a new repository, choose a small, maintainable architecture that delivers core explanations and metadata in the initial HTML, with client-side interaction for the tools. Explain the choice briefly and proceed.

Inspect the live siblings for their restrained presentation, typography, navigation, citation patterns and progressive detail. Recheck relevant metadata where useful. Establish a recognisable family relationship without copying factual errors, inaccessible behaviour or assumptions. If live access is unavailable, record that limitation and continue from the supplied review.

Create a requirements matrix linking the scope to routes, components, evidence records and verification. Maintain a short decision log and a list of genuine launch dependencies. Make routine reversible implementation choices without repeated confirmation. Ask concise questions only when a missing answer materially affects correctness, ownership or publication, and continue independent work while waiting.

The working name is provisional. The production domain, hosting, correction contact, editorial responsibilities and crawler policy must not be invented. Keep them configurable. Local development must work without these decisions; production publication must not silently use placeholder values.

## Editorial and evidence requirements

The site is a neutral explainer. The owner's concern that removing the triple lock could be harmful is a question to test, not a conclusion to build into the wording, examples or defaults. Present the strongest supported arguments for retaining and changing the rule. Equal scrutiny does not require equal confidence in unequal evidence. The separately labelled editorial page is deferred.

Lead the homepage with the **current full new State Pension weekly rate**, its effective year and before-tax basis, followed visibly by the full basic rate, individual-entitlement qualification, sources and checking date. Reverify the dated figures in the scope. Calculate the 52-week equivalent from the same record and identify it as an equivalent, not an individual's exact tax-year receipts. Never call either headline rate everyone's entitlement or the maximum total pension.

Implement all eight main pages in scope section 2, plus the required utility pages. Give substantive treatment to pension adequacy, national expenditure, household income and wealth distribution, means-testing, alternative tax/support approaches, and social-care trade-offs. Distinguish entitlement changes from uprating changes, income from assets and needs, UK pension policy from nation-specific care policy, and enacted policy from proposals or reporting. Verify the political context afresh; do not repeat an earlier conversational premise as fact.

Build central numerical and qualitative evidence registers as specified in section 4. Include exact supporting tables or passages, definitions, periods, coverage, effective dates, source vintages, checking dates, calculation inputs, qualifications and actual review status. Reuse values across prose, charts, tools and metadata. Keep source checking, publication, substantive modification and statistical reference dates distinct.

Use primary sources for rules and official statistics, and accurately attributed research for analysis and benchmarks. Resolve differences in definitions and periods before comparing sources. Distinguish observed expenditure, research budgets and user-entered spending. Do not fill gaps with plausible invented numbers, fabricated citations, reviewer identities or verification badges. Keep unresolved claims out of publishable content and show honest unavailable-data states in the preview. Record the work needed to close each gap.

## Implement the four bounded tools

Follow section 3 in full. Write the calculation specification and separately calculated reference examples before coding the models.

1. **Triple-lock mechanism:** demonstrate the determining measure or tie, percentage increase, weekly result and annual equivalent. Identify the pension component and separate sourced historical decisions from hypothetical inputs.
2. **Replacement-rule comparison:** implement triple lock, prices-or-earnings double lock, earnings link and prices link using the same economic path and starting amount. Specify timing, negative growth, floors, rounding, inflation base and earnings comparison. Label assumptions and before-tax results. Distinguish a lower counterfactual amount from a cash cut; a fixed-period cumulative difference is not a lifetime loss. Include scenarios where rules coincide as well as diverge.
3. **Current household budget:** use gross income, benefits actually received, a separate explicit tax line and editable expenditure. Unknown tax means a clearly labelled before-tax balance. Apply one consistent accounting convention so support, bill discounts and tax are not counted twice. Source and date presets; expose housing, disability/care exclusions and unsupported household types. Show a shortfall without manipulating costs to fit income.
4. **Historical explorer:** keep basic and new pension series separate. Store actual decisions separately from reconstructed alternatives, accounting for exceptional years and source revisions. Show the start year and amount for counterfactuals. Supply an accessible underlying table and download or copy facility.

Keep functions for arithmetic separate from presentation. Provide formulas, assumptions, readable results and equivalent data tables. Test meaningful boundary cases using independently calculated expected results, not expectations generated by the implementation being tested.

Do not add a personal entitlement engine, tax/benefit calculator, national means-testing savings model or social-care funding simulator. Do not multiply a personal pension difference by a generic pensioner count. Do not connect future gross policy results automatically to the current household budget.

## Accessibility, privacy and presentation

Meet all applicable WCAG 2.2 Level A and AA criteria across complete pages and tool processes. Follow section 6, including keyboard interaction, visible/unobscured focus, reflow, contrast, labels, errors, live results, non-drag alternatives, target sizing and chart alternatives. Keep essential qualifications visible rather than available only through a tooltip or accordion.

Use semantic HTML and a responsive, restrained design. Avoid policy-favouring colours or imagery. Core explanations must remain readable when interaction fails. Process personal budget inputs locally; keep them out of URLs, analytics, logs and transmitted diagnostics. Explain input persistence and clearing.

Maintain a criterion-by-criterion assessment with evidence and the actual test environments. Combine automated checks with manual keyboard, zoom/reflow, text spacing and screen-reader evaluation. Follow the scope's intended VoiceOver/Safari and NVDA/Windows coverage. If an environment or qualified assessment is unavailable, record the outstanding check accurately and continue other work. Automated success alone does not establish conformance. Never invent a completed audit or describe an incompletely assessed preview as WCAG-conformant or ready to launch.

## Metadata, sitemaps and family links

Implement scope sections 9 and 10, informed explicitly by `sibling-metadata-review.md`:

- Maintain a page register and generate unique descriptive titles, descriptions, absolute canonical URLs, appropriate language metadata, social cards and accurate structured data. Keep material limitations meaningful when a preview is read alone.
- Use the finance site's complete sharing metadata as a starting point, including image descriptions. Give the homepage a descriptive standalone sharing title. Give illustrative tools suitable previews. Do not use volatile, unqualified pension amounts in evergreen artwork.
- Use structured-data types only where appropriate to visible content. Dataset metadata requires a real documented dataset and checked provenance/licensing. Do not copy news or FAQ types indiscriminately.
- Generate a valid XML sitemap containing intended indexable canonical production pages, and an accessible HTML site map. Use genuine significant-change dates when known; never stamp every route with the latest build time.
- Implement environment-specific indexing controls. Keep previews, drafts, parameter variants and private input values out of production metadata and sitemaps. Ensure the production configuration does not inherit preview restrictions.
- Record the unresolved AI-crawler policy: the siblings differ. Do not silently choose one on the owner's behalf. Keep it a configurable launch decision.
- Implement the shared sister-site footer and justified contextual links, checking destination content as well as availability. Retain primary-source citations; siblings are not independent corroboration.
- Prepare the bounded reciprocal placements described in section 9. Track them separately from pension-site implementation. Do not modify another repository unless it is supplied as part of the authorised work, and do not publish links to a placeholder pension domain.

Check actual rendered metadata and HTTP responses where the environment permits. A local test does not establish deployed behaviour. Search Console verification, submission and indexing checks require real domain/account access and must be reported separately; never promise ranking or claim unseen results.

## Complete the work and provide a truthful handover

Proceed through the three delivery stages in scope section 7. Do not stop at a homepage mock-up, static calculator shells or an implementation plan. Complete the reviewable site and all verification possible in the available environment. Where evidence or external access is missing, continue unaffected work and record the exact remaining dependency without weakening the release standard.

Provide:

- The implemented site, reproducible setup/build/test instructions and a local preview where available.
- Evidence and page registers, model specification, reference calculations, correction process, and guidance for rate/source updates.
- Requirement-to-implementation coverage, calculation results, source checks, accessibility assessment and metadata/sitemap/link checks.
- A concise handover separating completed work, known defects, unperformed checks and owner decisions needed for launch. Identify reciprocal links and deployed checks separately.

Report only checks actually performed and their results. A separate arithmetic method is not an independent human review. Keep the site as a reviewable preview until the scope's evidence, accessibility, configuration and editorial launch requirements are met. This task prepares the build for review; it does not authorise automatic public deployment.
