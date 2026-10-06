# Launch dependencies

Things only the owner can supply or decide. The build works locally without them. A production build stops until items 1, 2, 4, 5, 6, 7 and 8 are set. Item 3 is enforced in part: a production build stops while `BASIC_AUTH` is set, while `netlify.toml` sends an `X-Robots-Tag` header, or on Netlify outside the production context. Items 9 and 10 are not enforced by the build. Item 9 is built: what is left is a look at the beacon's request on the live site.

The owner decided each item on 2 October 2026, from options the assistant put: decisions 66 to 75 in `docs/decision-log.md`. The decision says what to do. The value is set at launch. The item that was number 11, the three releases of October 2026, was moved out of this list because it is upkeep: decision 76. Its dates are in `docs/maintenance.md`.

| No. | Dependency | How it is supplied | Blocks | Decided, 2 October 2026 |
| --- | --- | --- | --- | --- |
| 1 | Name of the site: "UK State Pension Explorer". | `SITE_TITLE`. The two share images in `scripts/share/` carry the name and must be made again if it changes. | Publication | Keep "UK State Pension Explorer": decision 66 |
| 2 | Production domain, with HTTPS and no path. | `SITE_URL` | Canonicals, sitemap, social cards, reciprocal links | `https://ukstatepensionexplorer.org`, registered by the owner through Netlify on 2 October 2026 (WHOIS: created 09:06 UTC, registrar Name.com). Not yet attached to the Netlify project: decision 67 |
| 3 | Hosting. | Netlify, project `ukstatepensionexplorer`, set by the owner on 29 September 2026. `netlify.toml` builds a preview with security headers. The build writes the preview's `noindex` header and basic authentication, from the `BASIC_AUTH` variable in Netlify, to `_headers`. | Publication | Split by deploy context, so deploy previews and branch deploys keep the sign-in after launch. Built and merged in pull request 18; the launch steps are below: decision 68 |
| 4 | A working route to report an error or an accessibility barrier. | `CORRECTION_URL` | Publication. Scope sections 2H and 6 | A new GitHub issue on the repository, for launch. The repository must be public by then, after its history is checked: decision 69 |
| 5 | Owner of the content, and whether a person or an organisation. | `OWNER_NAME`, `OWNER_TYPE` | Publication. Structured data publisher | Anthony George, `Person`: decision 70 |
| 6 | A reviewer who is not the author, and the date of the review. | `REVIEWER_NAME`, `REVIEW_DATE` | Publication. Scope section 7, stage 3 | The owner, for launch. A second person later if one is found: decision 71 |
| 7 | AI crawler policy. The sister sites differ: UK Public Finances allows named AI crawlers, UK Migration Explorer refuses training crawlers. | `AI_CRAWLER_POLICY` = `allow` or `refuse-training`. The list for `refuse-training` is in `src/_data/crawlers.json` and was copied from UK Migration Explorer without checking each operator's documentation. | Publication | `allow`: decision 72 |
| 8 | Accessibility assessment by a person, with VoiceOver and Safari and with NVDA on Windows. | `A11Y_ASSESSMENT_DATE`, and update `src/_data/a11y.json` and `docs/accessibility-assessment.md`. | Publication, because the production build stops without the date. Any claim of conformance | A round by the owner before launch, with what the owner's own equipment allows. NVDA and sessions with users after launch. The statement stays "incomplete": decision 73 |
| 9 | Analytics. | Cloudflare Web Analytics, as on the sister sites. The owner added the site in Cloudflare on 2 October 2026, and its token is in `src/_data/site.js`. The privacy page and the Content Security Policy are ready for it. Cloudflare's FAQ says it does not log query strings, where the rule comparison and the history explorer put their settings. Check the beacon's request on the live site. The privacy page says, on Cloudflare's word, that the part of an address after a question mark is not recorded. | Nothing now | Built in production builds, with the owner's token: decision 74 |
| 10 | Review owner and review date for each source. | Every figure in the registers carries a `next_review` trigger: the 51 that had none were filled on 2 October 2026. | Scope section 8 | The owner reviews every source. Dated triggers become ToneBan tickets: decision 75. The owner named a new ToneBan project for them on 5 October 2026: see step 6 below |

## Launch steps

The owner wants to launch on 5 October 2026 if possible, and before 20 October 2026 if not: decision 82. The releases of 20 to 22 October 2026 in `docs/maintenance.md` are then the first update of the published site.

The build work of decisions 68 and 74 was merged in pull request 18 on 2 October 2026. A production build was made in a scratch directory on 5 October 2026 and read by hand: see "Last checks" in `docs/HANDOVER.md`. The preview was looked at past the sign-in on 6 October 2026, step 2 below; the headers as served were not read.

This is the one ordered list. Each step is the owner's unless it says otherwise.

1. Merge the branch `pre-launch-review`. It holds the corrections of the pre-launch review, and the site should not launch without them. One of them: the site said no costing method had been published for the rule announced for April 2030, and one had.
2. Look at the deployed preview past the sign-in. Done on 6 October 2026 in the owner's browser: see "Last checks" in `docs/HANDOVER.md`. Not read: the `X-Robots-Tag: noindex` header as served, which the browser extension would not let a script read. Netlify reports the 3 header rules deployed, and the same rule was seen served on 29 September 2026.
3. Review every page: item 6, decision 71. The date of the review becomes `REVIEW_DATE`. The build refuses a date in the future.
4. Do the accessibility round, with what the owner's own equipment allows: item 8, decision 73. The assistant then records what was found in `src/_data/a11y.json` and `docs/accessibility-assessment.md`. `A11Y_ASSESSMENT_DATE` must be the same date as `assessed_on` in `a11y.json`, or the build stops. On 5 October 2026 `assessed_on` is 2026-10-05, the date of the last automated run. The statement stays "incomplete".
5. Decide what the repository may show, then make it public: item 4, decision 69. `CORRECTION_URL` is a new issue on the repository, so the public gets a 404 from it while the repository is private. The build cannot check this. The history was searched by pattern on 2 October 2026 and nothing secret was found. The repository has no licence file. A public repository would show the author email on every commit, three lines with a home path in `research/00-sibling-inspection.md` and `NEXT-SESSION.md`, `_archive/` with the two scope documents, and the handover and decision log as they are.
6. Merge the ToneBan tickets for the review dates: item 10, decision 75. The owner chose a new ToneBan project, State Pension Explorer, on 5 October 2026. The project and nine tickets are on the branch `data/pension-review-triggers` of the ToneBan repository, commit `fccf84d`, not pushed. They reach the board when the owner merges that branch. The build does not check this step. The first dates are 20, 21 and 22 October 2026.
7. In Netlify, set these variables for all contexts, or for production at least. Outside production, `SITE_URL` is ignored.

   | Variable | Value |
   | --- | --- |
   | `SITE_TITLE` | `UK State Pension Explorer` |
   | `SITE_URL` | `https://ukstatepensionexplorer.org`. The build stops on any other address |
   | `CORRECTION_URL` | `https://github.com/LegendT/UK-State-Pension-Explorer/issues/new` |
   | `OWNER_NAME` | `Anthony George` |
   | `OWNER_TYPE` | `Person` |
   | `REVIEWER_NAME` | `Anthony George` |
   | `REVIEW_DATE` | The date of step 3, as `2026-10-05` |
   | `A11Y_ASSESSMENT_DATE` | The date in `a11y.json`, as `2026-10-05` |
   | `AI_CRAWLER_POLICY` | `allow` |

8. Attach `ukstatepensionexplorer.org` to the Netlify project: decision 67.
9. The launch itself, at one time. In Netlify, scope `BASIC_AUTH` to deploy previews and branch deploys only. Then, on the owner's word, the assistant sets `SITE_ENV` under `[context.production.environment]` in `netlify.toml` to `production`, and the change is merged. Not before: until that merge the production context is still a preview, and a preview build stops without `BASIC_AUTH`. A production build stops while `BASIC_AUTH` is set.

## After publication, reported separately

| Task | Needs |
| --- | --- |
| Check HTTP status, redirects, response headers, robots file, sitemap and canonicals on the live domain. | The live site |
| Look at the fetched share preview of the overview, one explainer and one page with a calculator. | The live site |
| Verify the domain in a search console, submit the sitemap, read the processing report. | Account and domain access |
| Reciprocal links on both sister sites. See `src/_data/links.json`, `reciprocal`. | The live domain, and changes to two other repositories |
| Confirm that the Cloudflare beacon's request carries no query string. | The live site, with analytics added |

None of these has been done. A local build passing does not show how the deployed site behaves.
