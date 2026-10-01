# Launch dependencies

Things only the owner can supply or decide. The build works locally without them. A production build stops until items 1, 2, 4, 5, 6, 7 and 8 are set. Item 3 is enforced in part: the build stops while `BASIC_AUTH` is set or the `noindex` header is in `netlify.toml`. Items 9, 10 and 11 are not enforced by the build. Item 9 blocks adding analytics, not publication.

| No. | Dependency | How it is supplied | Blocks |
| --- | --- | --- | --- |
| 1 | Name of the site. The working title is "UK State Pension Explorer". | `SITE_TITLE`. The two share images in `scripts/share/` carry the name and must be made again if it changes. | Publication |
| 2 | Production domain, with HTTPS and no path. | `SITE_URL` | Canonicals, sitemap, social cards, reciprocal links |
| 3 | Hosting. | Netlify, project `ukstatepensionexplorer`, set by the owner on 29 September 2026. `netlify.toml` builds a preview with security headers and a `noindex` header. The preview uses basic authentication, written at build time from the `BASIC_AUTH` variable in Netlify. For launch: change `SITE_ENV` to `production` in `netlify.toml` (a value set in the Netlify screen is overridden by the file), remove the `X-Robots-Tag` header and delete `BASIC_AUTH`. | Publication |
| 4 | A working route to report an error or an accessibility barrier. | `CORRECTION_URL` | Publication. Scope sections 2H and 6 |
| 5 | Owner of the content, and whether a person or an organisation. | `OWNER_NAME`, `OWNER_TYPE` | Publication. Structured data publisher |
| 6 | A reviewer who is not the author, and the date of the review. | `REVIEWER_NAME`, `REVIEW_DATE` | Publication. Scope section 7, stage 3 |
| 7 | AI crawler policy. The sister sites differ: UK Public Finances allows named AI crawlers, UK Migration Explorer refuses training crawlers. | `AI_CRAWLER_POLICY` = `allow` or `refuse-training`. The list for `refuse-training` is in `src/_data/crawlers.json` and was copied from UK Migration Explorer without checking each operator's documentation. | Publication |
| 8 | Accessibility assessment by a person, with VoiceOver and Safari and with NVDA on Windows. | `A11Y_ASSESSMENT_DATE`, and update `src/_data/a11y.json` and `docs/accessibility-assessment.md`. | Any claim of conformance |
| 9 | Analytics. | Cloudflare Web Analytics at launch, as on the sister sites. Owner's decision, 29 September 2026. Not added yet. Before it is added, update the privacy page and the Content Security Policy, and confirm that it does not record the settings that the rule comparison and the history explorer put in the page address. The privacy page promises that amounts entered in a calculator are never included. | Adding analytics |
| 10 | Review owner and review date for each source. | The registers carry a `next_review` trigger for each figure. No person is assigned. | Scope section 8 |
| 11 | Decision on the three releases due in October 2026: the revised earnings figure (20 October), the September prices figure (21 October) and Pension Credit take-up (22 October). | Update the registers when published. | Currency of three figures |

## After publication, reported separately

| Task | Needs |
| --- | --- |
| Check HTTP status, redirects, response headers, robots file, sitemap and canonicals on the live domain. | The live site |
| Look at the fetched share preview of the overview, one explainer and one page with a calculator. | The live site |
| Verify the domain in a search console, submit the sitemap, read the processing report. | Account and domain access |
| Reciprocal links on both sister sites. See `src/_data/links.json`, `reciprocal`. | The live domain, and changes to two other repositories |

None of these has been done. A local build passing does not show how the deployed site behaves.
