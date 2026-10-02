# Launch dependencies

Things only the owner can supply or decide. The build works locally without them. A production build stops until items 1, 2, 4, 5, 6, 7 and 8 are set. Item 3 is enforced in part: the build stops while `BASIC_AUTH` is set or the `noindex` header is in `netlify.toml`. Items 9 and 10 are not enforced by the build. Item 9 blocks adding analytics, not publication.

The owner decided each item on 2 October 2026, from options the assistant put: decisions 66 to 75 in `docs/decision-log.md`. The decision says what to do. The value is set at launch. The item that was number 11, the three releases of October 2026, was moved out of this list because it is upkeep: decision 76. Its dates are in `docs/maintenance.md`.

| No. | Dependency | How it is supplied | Blocks | Decided, 2 October 2026 |
| --- | --- | --- | --- | --- |
| 1 | Name of the site: "UK State Pension Explorer". | `SITE_TITLE`. The two share images in `scripts/share/` carry the name and must be made again if it changes. | Publication | Keep "UK State Pension Explorer": decision 66 |
| 2 | Production domain, with HTTPS and no path. | `SITE_URL` | Canonicals, sitemap, social cards, reciprocal links | `https://ukstatepensionexplorer.org`, registered by the owner through Netlify on 2 October 2026 (WHOIS: created 09:06 UTC, registrar Name.com). Not yet attached to the Netlify project: decision 67 |
| 3 | Hosting. | Netlify, project `ukstatepensionexplorer`, set by the owner on 29 September 2026. `netlify.toml` builds a preview with security headers and a `noindex` header. The preview uses basic authentication, written at build time from the `BASIC_AUTH` variable in Netlify. | Publication | Split by deploy context, so deploy previews and branch deploys keep the sign-in after launch. Needs build work before launch, on the owner's go: decision 68. This replaces the launch steps that were written here |
| 4 | A working route to report an error or an accessibility barrier. | `CORRECTION_URL` | Publication. Scope sections 2H and 6 | A new GitHub issue on the repository, for launch. The repository must be public by then, after its history is checked: decision 69 |
| 5 | Owner of the content, and whether a person or an organisation. | `OWNER_NAME`, `OWNER_TYPE` | Publication. Structured data publisher | Anthony George, `Person`: decision 70 |
| 6 | A reviewer who is not the author, and the date of the review. | `REVIEWER_NAME`, `REVIEW_DATE` | Publication. Scope section 7, stage 3 | The owner, for launch. A second person later if one is found: decision 71 |
| 7 | AI crawler policy. The sister sites differ: UK Public Finances allows named AI crawlers, UK Migration Explorer refuses training crawlers. | `AI_CRAWLER_POLICY` = `allow` or `refuse-training`. The list for `refuse-training` is in `src/_data/crawlers.json` and was copied from UK Migration Explorer without checking each operator's documentation. | Publication | `allow`: decision 72 |
| 8 | Accessibility assessment by a person, with VoiceOver and Safari and with NVDA on Windows. | `A11Y_ASSESSMENT_DATE`, and update `src/_data/a11y.json` and `docs/accessibility-assessment.md`. | Publication, because the production build stops without the date. Any claim of conformance | A round by the owner before launch, with what the owner's own equipment allows. NVDA and sessions with users after launch. The statement stays "incomplete": decision 73 |
| 9 | Analytics. | Cloudflare Web Analytics, as on the sister sites. Before it is added, update the privacy page and the Content Security Policy. Cloudflare's FAQ says it does not log query strings, where the rule comparison and the history explorer put their settings. Check the beacon's request on the live site. The privacy page promises that amounts entered in a calculator are never included. | Adding analytics | At launch, in the same build work as item 3: decision 74 |
| 10 | Review owner and review date for each source. | Most figures in the registers carry a `next_review` trigger. 51 of 124 have none. | Scope section 8 | The owner reviews every source. The 51 blank triggers are to be filled, "each April" unless the source says otherwise, and the dated triggers made ToneBan tickets, on the owner's go: decision 75 |

## Launch steps under decision 68, not yet built

1. `[context.production]` in `netlify.toml` sets `SITE_ENV` to `production`. Other contexts stay `preview`.
2. The `noindex` header moves out of `netlify.toml` into the `_headers` file the build writes, for preview builds only.
3. `BASIC_AUTH` is scoped in Netlify to deploy previews and branch deploys only.
4. The guard in `src/_data/site.js` reads Netlify's `CONTEXT`.
5. The launch variables of items 1, 2 and 4 to 8 are set in Netlify for the production context only, so a preview keeps its own address as its canonical.
6. Tested on a real deploy preview and on the production deploy.

## After publication, reported separately

| Task | Needs |
| --- | --- |
| Check HTTP status, redirects, response headers, robots file, sitemap and canonicals on the live domain. | The live site |
| Look at the fetched share preview of the overview, one explainer and one page with a calculator. | The live site |
| Verify the domain in a search console, submit the sitemap, read the processing report. | Account and domain access |
| Reciprocal links on both sister sites. See `src/_data/links.json`, `reciprocal`. | The live domain, and changes to two other repositories |
| Confirm that the Cloudflare beacon's request carries no query string. | The live site, with analytics added |

None of these has been done. A local build passing does not show how the deployed site behaves.
