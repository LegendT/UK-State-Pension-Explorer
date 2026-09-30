# Handover: first build

Written 29 September 2026, updated 30 September 2026. The site is a **preview for review**. It is not published. The repository is https://github.com/LegendT/UK-State-Pension-Explorer. Pull request 1, the first build, is merged into `main`. Pull request 2 is open from the branch `first-build`. The branch `html-semantics` follows `first-build` and holds the markup sweep and the stylesheet fixes. Netlify builds a deploy preview of each pull request, behind a sign-in.

**Next action:** none is authorised. The owner decides whether `html-semantics` joins `first-build`, and whether to merge pull request 2. Run `git log origin/first-build..html-semantics` to see what has not been pushed. The owner answered the six questions on 29 September 2026: see "Owner's answers". Two questions wait on the owner: whether to list the 2024 positions of the Greens, SNP and Plaid Cymru, marked as 2024 (decision 34), and whether social care should still be a section once the speech has been read (defect 1).

## How to look at it

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install
npm run build
npm run serve        # http://127.0.0.1:8137
```

## Completed

- Seven main pages, four utility pages, four calculators. Pensions and social care is a section of the reform options page.
- Registers of figures, claims and sources, a page register and a link register.
- Model specification, written before the code. Reference calculations by a separate method.
- Build checks for metadata, canonicals, indexing, sitemap, internal links, registers and sister links.
- Environment controls: development and preview are `noindex` with no sitemap. Production stops without its launch decisions.
- Documents: requirements matrix, decision log, launch dependencies, maintenance guide, accessibility assessment.

## Checks performed, with results

Run on 29 September 2026, Chrome 154, macOS.

| Check | Command | Result |
| --- | --- | --- |
| Calculator tests | `npm test` | 22 of 22 pass |
| Build checks | `npm run build` | No problems in development and preview. A production configuration passed before the `noindex` header was added to `netlify.toml`. It now stops on that header, as intended |
| Production gate | Build with settings missing, a placeholder domain, a wrong owner type, `BASIC_AUTH` set, and the `noindex` header present | Stopped each time, naming the cause |
| Preview gate | Preview build with `NETLIFY` set and no `BASIC_AUTH`. `BASIC_AUTH` in the wrong format | Stopped each time |
| Quoted passages | `python3 scripts/check-passages.py` | All found: most by the script, the rest in a browser because three sites refuse scripts |
| Figures with no quoted passage | `python3 scripts/check-values.py`, then the source spreadsheets | All values found. For two wealth figures the value was found but the row was not confirmed |
| Source addresses | One request each | All responded except sites that refuse scripts, which opened in a browser |
| Automated accessibility | `npm run a11y` | 0 violations. Every undecided contrast result measured: none below threshold |
| Scripted accessibility measurements | `node scripts/a11y-manual-assist.mjs` | 0 problems |
| Calculators in a browser | By script in Chrome | Results matched the reference values. See `docs/reference-calculations.md` |
| Critique | Self review plus an independent reader on a different model | Findings fixed or listed below |

The scripts print their own counts. They are not copied here because they change with the content.

The build, the tests and both accessibility scripts were run again on 29 September 2026 after each later change: the fold of the social care page, the wording edits, the markup sweep and the stylesheet fixes. The results were the same each time: no build problems, 22 of 22 tests, 0 violations, 0 problems. After the markup sweep the changed blocks were looked at in Chrome at 390 and 1280 pixels wide, with a result loaded in each calculator shown.

## Checks on the deployed preview

Run on 29 September 2026 against the deploy preview of pull request 1, commit `15744d9`, with `curl` and Chrome 154.

| Check | Result |
| --- | --- |
| No credentials | 401, Netlify's password page |
| Past the password page, no sign-in | 401, `WWW-Authenticate: Basic` |
| Past the password page, wrong sign-in | 401 |
| Past the password page, right sign-in | 200 |
| A page that does not exist | 404, with the site's own page |
| `/_headers` | 404. The file is not served |
| All 11 pages, `robots.txt`, the CSV, a share image, the stylesheet and a script | 200, with the expected content types |
| `/sitemap.xml` | 404, as intended for a preview |
| Headers as served | Content Security Policy, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy` and `X-Robots-Tag: noindex`, on pages and on the CSV |
| `http://` address | 301 to `https://` |
| Canonical address | The deploy's own address |
| History explorer in Chrome | Form shown, result updated, download started from a `blob:` address. No policy violation from the site's own code |

Found by these checks:

- **The site was titled "ukstatepensionexplorer".** Netlify sets `SITE_NAME` on every build. The setting is now `SITE_TITLE`. Fixed after this deploy, so the deploy checked still shows the wrong name.
- **The Content Security Policy blocks Netlify's own preview toolbar**, which Netlify adds to deploy previews. Chrome reported one blocked inline style and one blocked frame from `app.netlify.com`. The site is not affected. The toolbar can be switched off in Netlify.

Not checked on the deployed preview: the other three calculators, any browser but Chrome, a fetched share preview on a social platform, and anything on the main site address. Pull request 1 has since been merged, so that address may now have a deploy. It was not looked at.

## Known defects and limits

1. **The news note and the social care section of the reform options page predate the Prime Minister's conference speech of 29 September 2026.** No transcript was found by mid-afternoon that day. Both must be rewritten once it is published. The owner then decides again whether social care is a section or a page. Later that day Pensions Age reported that the speech announced an "annual double lock" after the next general election, as part of plans to pay for a National Care Service. That is a news report, read at source, not the speech. If it is right, the section's statement that no proposal was found is out of date. Two changes wait for that rewrite: the Resolution Foundation saving appears three times on the reform options page, and the dated section sits in the middle of the page and is not mentioned in the opening paragraph.
2. **No published proposal ties the triple lock to social care.** The section says so. For that reason it is a dated section and not a main page.
3. **Example budgets are not like for like.** Private renters at the 2026 minimum, social renters at the 2025 minimum, owners at the 2025 moderate standard.
4. **Not found, and shown as gaps:** the share of people on the full rate, the number whose pension is not increased abroad, costings for a double lock and for means-testing, incomes of pensioner carers.
5. **Typed wording that will age:** the worked example on the triple lock page names months and years in words. The first year in the rule comparison starts at 2027/28. Both are in the maintenance guide.
6. **One check date is printed for two figures** in a few combined source notes. The dates are the same today.
7. **The preview on Netlify uses basic authentication** and sends `noindex` on every file. Both were seen working on the deploy preview. Both must be removed at launch. The user name and password are in the `BASIC_AUTH` variable in Netlify. Netlify's own password protection was switched off on 30 September 2026 with the Netlify CLI, on the owner's instruction. The main address then answered 401 with `WWW-Authenticate: Basic`, so basic authentication is the one sign-in.
8. **Field errors use `role="alert"`.** With many errors at once, screen reader announcements may compete. Not tested.
9. **Two party positions rest on news reports**, not party documents.
10. **After launch, deploy previews and branch deploys would be open.** The launch steps delete `BASIC_AUTH` everywhere. Keeping it for those two contexts needs the production guard to check the Netlify context. Deferred to launch planning.
11. **Markup left as it is after the sweep of 29 September 2026.** Each needs design work or a decision, and none is a failure of an automated check.
    - The lists of a bold label and a value, 87 items on six pages, should be description lists.
    - The source note under each figure packs kind, period, place and source into paragraphs. It should be a description list.
    - The names of scrolling table regions are typed apart from the captions, and some differ from them.
    - The name of each chart joins its title and its whole description.
    - Each card under "Where to go next" on the overview puts two sentences inside the link.
    - No build check holds the markup conventions in the README.

## Checks not performed

- Any test with a screen reader. VoiceOver with Safari and NVDA on Windows are both outstanding.
- Keyboard use, browser zoom and touch by a person. Firefox and Safari.
- Review of content by a second person.
- The download and copy buttons of the history explorer were not pressed in a test.
- The sister sites' tools were read from served HTML. They were not run.
- House of Commons Library briefings and Hansard could not be opened.
- Nothing on the main site address or a production domain. The deploy preview of pull request 1 was checked, and the deploy preview of pull request 2 was not: see "Checks on the deployed preview". Fetched share previews on a social platform were not checked.
- Search console verification, sitemap submission, indexing.

## Owner decisions needed for launch

See `docs/launch-dependencies.md`. In short: name, domain, the launch steps for hosting, correction route, owner, reviewer, AI crawler policy, accessibility assessment by a person. Analytics is decided: Cloudflare Web Analytics at launch, not added yet.

## Owner's answers

Given on 29 September 2026. The record is `docs/decision-log.md`, numbers 29 to 34.

| Question | Answer | State |
| --- | --- | --- |
| Should pensions and social care stay a main page? | No. A dated section of the reform options page | Done in the working copy. After the change, `npm run build`, `npm test`, `npm run a11y` and `node scripts/a11y-manual-assist.mjs` were run again on 29 September 2026, with the results in "Checks performed". The section was looked at in Chrome at 390 and 1280 pixels wide. Committed. Not deployed when this was written |
| May `scripts/seed/` be deleted? | Yes | Deleted |
| Should the fiscal-claim page be linked? | No | Register entry marked declined |
| Should Netlify's own password page be turned off? | Yes | Done on 30 September 2026 with the Netlify CLI. Checked on the main address |
| May `.preview-password` be deleted? | Yes | Deleted |
| Are the decisions in the decision log accepted? | 22 accepted as written. Analytics amended to Cloudflare at launch. Number 21, the three parties left out, reopened | See number 34 |

Answered on 29 September 2026: previews are protected with basic authentication, hosting is Netlify, and four unused variables were deleted from Netlify.

## Waiting on the owner

As at 30 September 2026.

| Item | What is needed |
| --- | --- |
| Critique of 30 September, findings R7 to R17 | A disposition for each: now, defer or no. R7: add the Pensions Age report of the speech to the "Reported" list of the social care section, with a claim and a source. R8: the accessibility statement says "visible focus outline" where the script only showed an outline style set (`src/_data/a11y.json`). R9: the privacy page still says "if analytics are added" (decision 31 settled it). R10: three connector colons remain, in the footer sentence of `base.njk`, in `compare-view.js` and in the "three times" sentence on the reform options page. R11: "The same questions are put to every option" on the method page names no actor. R12: "How to read this table." on the living page is a fragment. R13: three items under "What should not be assumed" repeat text elsewhere on the reform options page since the fold; defer to the rewrite. R14: the decision log says number 24 was "replaced" when its wording survives in the heading. R15: the reason in decision 29 was the assistant's option text, not the owner's words. R16: the requirements matrix heading still says eight main pages. R17: two hints on the budget form are not tied to their controls with `aria-describedby` |
| `html-semantics` | Whether it joins `first-build` and goes to pull request 2 |
| Push | The push gate wants a critique stamp for the tree. None was written, because the reader's command did not name the repository path in full. Either `/push uncritiqued` or a fresh critique |
| Social care | Section or page, once the speech transcript has been read (defect 1) |
| The Greens, SNP and Plaid Cymru | Whether to list their 2024 positions, marked as 2024 (decision 34) |
| Markup conventions in the README | Written by the assistant after the sweep of 29 September. Not yet accepted by the owner |

## Tracked separately

| Item | Status |
| --- | --- |
| Reciprocal links on UK Public Finances Explorer and UK Migration Explorer | Not started. Needs a live domain. No other repository was changed |
| Deployed checks | Done for the deploy preview of pull request 1. See "Checks on the deployed preview". Not done for pull request 2, the main site address or a production domain |
| Search console | Not started. Needs account and domain access |

## Found in passing

- UK Public Finances Explorer shows State Pension spending of £146 billion as a 2025-26 forecast graded "official". Its own backlog calls the file stale. This site did not reuse it.
- Port 8081 on this computer was in use by another process. This project uses 8137.
- A hook reported that `~/.claude/settings.json` changed at 09:57 on 29 September. No command in this build touched it.
