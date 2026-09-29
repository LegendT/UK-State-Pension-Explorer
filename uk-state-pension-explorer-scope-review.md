# Scope review — precision, quality and trust

29 September 2026. Review of the first site scope, with changes incorporated into the revised scope. This is a review of the specification, not an audit of a built website or certification of all research discussed so far.

## Overall assessment

The first scope had the right editorial purpose and a useful structure. Its principal weakness was that it described desirable qualities without consistently defining how to demonstrate them. Its greatest risk was not an obviously false headline: it was a plausible calculator or comparison that quietly combined incompatible amounts, time periods or assumptions.

The revised scope retains eight main pages and four tools, but narrows modelling and strengthens acceptance criteria. Adding more tools would currently do less for trust than making the existing ones fully specified and reproducible.

## Findings and changes

| Priority | Gap, contradiction or assumption challenged | Why it matters | Revision |
| --- | --- | --- | --- |
| Launch requirement | Accessibility was described through general checks without a named conformance level. | A usable-looking site or a clean automated report does not establish conformance. | WCAG 2.2 AA is now an explicit release requirement, assessed criterion by criterion across pages and tool states, with manual evaluation and a truthful accessibility statement. |
| High | The opening prioritised explanation rather than answering the immediate amount question. | Readers could leave without learning the basic fact they came for. | Lead with the current full new weekly rate, its year and before-tax basis; put the basic rate and individual-entitlement qualification alongside it. |
| High | A single large rate could be read as everyone's entitlement or a maximum. | Some recipients receive less; some have additional amounts. Older-system comparisons can also omit components. | Use precise full-rate labels, retain both systems visibly, and do not describe either as the maximum total pension. |
| High | The budget inputs mixed pension amounts, other net income and no unambiguous treatment of tax. | A supposed surplus could be money unavailable to spend, or tax could be counted twice. | Specify gross income, an explicit household tax line and benefits received; when tax is unknown, label results before tax. Set one accounting convention for benefits and bills. |
| High | A future gross-pension model was connected to a household budget, despite excluding tax and benefit interactions. | This could make a gross policy difference look like a future disposable-income result while keeping costs unchanged. | Remove that connection from launch. Keep the budget tool a current snapshot and the policy tool an explicitly limited before-tax comparison. |
| High | Public-finance costs appeared as a discussion topic without a defined evidence presentation. | Readers need to distinguish the total pension bill, past extra cost and prospective reform savings. | Require a sourced national-cost section, with demographic drivers, coverage, outturn/forecast status, price basis and reform baselines. |
| High | The plan promised “who gains and loses” mainly through example households. | Examples cannot establish how many people are affected or how resources are distributed. | Add explicit distributional evidence, definitions of household income and wealth, housing-cost treatment and limits on population inference. |
| High | A generic starting pension could include components outside the rule being demonstrated. | Applying one increase to a whole payment can give a wrong answer while the formula is correct. | Specify the modelled component, default to a sourced rate and distinguish whole entitlement from the amount subject to that rule. |
| High | Alternative rules were named but not fully specified. | Negative growth, floors, timing lags, catch-up and rounding can materially change results. | Four defined launch comparison rules; require a model specification before coding; keep more complex smoothing proposals explanatory until verified. |
| High | Historical comparisons could recompute observed policy from revised economic data. | A calculation using today's revised series may differ from the increase actually applied. | Store actual uprating decisions separately, record input vintages and exceptional rules, and label historical alternatives as counterfactuals. |
| High | Benchmark budgets could be mistaken for typical spending or current prices. | Publication date is not price date; a minimum basket is not observed behaviour. | Distinguish observed expenditure, researched adequacy and user-entered spending; expose price dates and separate any estimated updates. |
| Medium | Housing adaptation could mean removing rent from a renter's budget. | Owners have different repairs and insurance costs; the remainder is not automatically a homeowner budget. | Require a documented adaptation and complete housing assumptions. Include limitations for disability, care and unsupported household types. |
| Medium | Nominal cumulative differences could be called lifetime losses. | A fixed horizon is not a lifetime, and nominal totals across years differ from constant-price totals. | Specify horizon and price basis; label cumulative payments accurately and do not imply a lifetime estimate. |
| Medium | A freeze appeared among examples without a particular proposal justifying it. | A dramatic comparison could bias the perceived consequences of ordinary reform. | Remove it from launch policy choices; retain diverse economic paths rather than choosing examples that favour a conclusion. |
| Medium | Evidence rules were stronger for numbers than for causal or policy claims. | Precisely sourced numbers can sit inside an unsupported interpretation. | Add a qualitative claim register and explicit classification of inference and value judgement. |
| Medium | Maintenance was event-driven in principle but had no owner, deadline or stale-content behaviour. | A trustworthy launch can quickly become a misleading “current” site. | Make ownership and source-specific review arrangements launch dependencies; define dated notices or withdrawal for superseded results. |
| Medium | “Eight pages” could be read as excluding accessibility and privacy statements. | Necessary information might be omitted to preserve an arbitrary page count. | Define eight main subject pages plus essential utility pages, keeping the primary navigation compact. |
| Medium | Independent verification and accessible usability testing were desirable but not resourced. | The site could promise a review that never happened. | Record actual reviewers and test environments; distinguish self-review, separate review and conformance evaluation. Do not claim unperformed checks. |

## Assumptions the evidence must test

- That the State Pension's current amount is adequate or inadequate for all pensioners. Adequacy depends on the definition, household, other resources and unavoidable costs.
- That recipients with high income and recipients with high housing wealth are interchangeable groups, or that either classification fully establishes need.
- That targeting entitlement necessarily improves outcomes for poorer pensioners. Take-up, transition, withdrawal rates, administration and saving incentives matter.
- That replacing the triple lock necessarily causes a cash cut, or that preserving cash purchasing power necessarily preserves living standards relative to workers.
- That money described as a triple-lock “cost” is all available for immediate reallocation. Baselines and the treatment of increases already embedded in pension rates matter.
- That receiving better care offsets losing pension income for the same people, over the same period and in the same nation.
- That a research body's recommended policy is an established fact rather than a conclusion based on evidence and values.
- That a historical period or a default scenario is representative of future conditions. The comparison must expose sensitivity instead of concealing it.

## Headline treatment verified for the revised scope

Use **£241.30 a week — full new State Pension, 2026/27, before tax**, followed by **£184.90 a week — full basic State Pension**. The proposed annual equivalent for the new rate is **£12,547.60**, explicitly calculated over 52 weeks. The figures need another effective-period check at publication, and they should be generated from central records.

Sources checked 29 September 2026: [GOV.UK new State Pension](https://www.gov.uk/new-state-pension/what-youll-get) and [GOV.UK basic State Pension](https://www.gov.uk/state-pension/how-much-you-get).

## Evidence needed before calling the site ready

1. Source records and claim-to-passage checks, including non-numerical claims and any disagreements between sources.
2. A model specification and independently calculated worked examples covering each supported rule and boundary condition.
3. Household budget accounting checks and evidence for each preset, including exclusions and price dates.
4. A documented WCAG 2.2 AA assessment, all identified failures resolved, and an accessibility statement matching actual testing. The governing sources are [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [W3C's accessibility evaluation guidance](https://www.w3.org/WAI/test-evaluate/).
5. Named responsibility for content review, publication, source refreshes and correction handling. A second review of the highest-impact claims is recommended; its completion must not be assumed.

## Limits of this review

This review changes the plan; it does not establish the accuracy of every proposed future dataset or forecast. The headline rates and accessibility references were checked, and the scope was read for contradictions. No website exists yet to test. No independent external content review or accessibility audit has been conducted. Obtaining and reconciling the source data, validating models and carrying out the accessibility assessment remain delivery work.
