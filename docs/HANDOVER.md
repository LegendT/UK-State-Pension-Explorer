# Handover: first build

Written 29 September 2026, updated 30 September 2026. The site is a **preview for review**. It is not published. The repository is https://github.com/LegendT/UK-State-Pension-Explorer. All work is merged into `main`: pull request 1, the first build, on 29 September 2026; pull request 2, from `first-build`, pull request 3, from `april-2030-rule`, and pull request 4, from `homepage-orientation`, on 30 September 2026. Pull request 3 carried the markup sweep and stylesheet fixes of `html-semantics` and the update for the government's announcement of 29 September 2026. Pull request 4 added a table of State Pension age by date of birth to the overview: decision 44. Netlify builds `main` to the main address and a deploy preview of each pull request into `main`, all behind a sign-in.

**Next action:** none is authorised. On 29 September 2026 the government announced a change to the triple lock from April 2030 and a National Care Service. The site was brought up to date on 30 September 2026, on the branch `april-2030-rule`: see "The announcement of 29 September 2026". It is merged into `main`. The owner decides when the calculator work in decision 38 starts.

## How to look at it

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install
npm run build
npm run serve        # http://127.0.0.1:8137
```

## Completed

- Seven main pages, four utility pages, four calculators. Pensions and social care is a section of the reform options page.
- On the overview, a section on State Pension age by date of birth, added on 30 September 2026.
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

## The announcement of 29 September 2026

The research record is `research/06-announcement-2026-09-29.md`. The decisions are numbers 36 to 43 in `docs/decision-log.md`.

What changed on the site, on 30 September 2026:

- The registers gained the sources, claims and figures for the announcement and the responses to it. Seven claims that the announcement overtook were deleted.
- The news note on the overview was rewritten. The overview and the triple lock page each say that a change is announced for April 2030.
- The reform options page has a card for the announced rule, the government's and the Institute for Fiscal Studies' figures in the cost and saving section, and a rewritten social care section, moved to follow the rule comparison. The ten questions the page set before the announcement now show what it answers.
- Findings R7 to R17 of the critique of 30 September 2026 were dealt with: decision 43.

Checks run on 30 September 2026 after the change, Chrome 154, macOS:

| Check | Command | Result |
| --- | --- | --- |
| Build checks | `npm run build` | No problems |
| Calculator tests | `npm test` | 22 of 22 pass |
| Quoted passages | `python3 scripts/check-passages.py` | None missing. The passages from ifs.org.uk and reformparty.uk were matched in Chrome, because those sites refuse scripts |
| Figures with no quoted passage | `python3 scripts/check-values.py` | Four wealth figures could not be read: the Office for National Statistics answered 429. They were not changed by this work |
| Automated accessibility | `npm run a11y` | 0 violations. Every undecided contrast result measured: none below threshold |
| Scripted accessibility measurements | `node scripts/a11y-manual-assist.mjs` | 0 problems |
| Rendered pages | Screenshots in Chrome at 390 and 1280 pixels wide | The overview note, the law section of the triple lock page, and the option card, saving section, social care section and ten questions of the reform options page were looked at |

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

Not checked on the deployed preview: the other three calculators, any browser but Chrome, a fetched share preview on a social platform, and anything on the main site address. Pull request 1 has since been merged, so that address may now have a deploy. On 30 September 2026 the main address was checked for the sign-in only: it answered 401 with `WWW-Authenticate: Basic`. Nothing else on it was looked at.

## Known defects and limits

1. **The announced rule rests on one government news story.** No Bill, no technical note, no costing method and no cost for the care service was found on 30 September 2026. The mechanism on the site is the Institute for Fiscal Studies' description, not the government's. The rule is described in prose and is not yet in the rule comparison: decision 38. The maintenance guide lists what should trigger a rewrite.
2. **Most responses to the announcement rest on news reports.** Only Reform UK's comes from the party's own page. The statements of Age UK, the Health Foundation and the King's Fund are as quoted in a trade report. No official transcript of the speech was found.
3. **Example budgets are not like for like.** Private renters at the 2026 minimum, social renters at the 2025 minimum, owners at the 2025 moderate standard.
4. **Not found, and shown as gaps:** the share of people on the full rate, the number whose pension is not increased abroad, costings for a double lock and for means-testing, incomes of pensioner carers.
5. **Typed wording that will age:** the worked example on the triple lock page names months and years in words. The first year in the rule comparison starts at 2027/28. Both are in the maintenance guide.
6. **One check date is printed for two figures** in a few combined source notes. Where the dates differ, in the two table notes of the cost and saving section, the note prints both.
7. **The preview on Netlify uses basic authentication** and sends `noindex` on every file. Both were seen working on the deploy preview. Both must be removed at launch. The user name and password are in the `BASIC_AUTH` variable in Netlify. Netlify's own password protection was switched off on 30 September 2026 with the Netlify CLI, on the owner's instruction. The main address then answered 401 with `WWW-Authenticate: Basic`, so basic authentication is the one sign-in.
8. **Field errors use `role="alert"`.** With many errors at once, screen reader announcements may compete. Not tested.
9. **The government's savings figures cannot be checked.** They come with no price basis, baseline or method. The page says so, and says why they cannot be set beside the Institute for Fiscal Studies' range for 2050.
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
- Nothing on the main site address beyond the sign-in, and nothing on a production domain. The deploy preview of pull request 1 was checked, and the deploy previews of pull requests 2 to 4 were not: see "Checks on the deployed preview". Fetched share previews on a social platform were not checked.
- Search console verification, sitemap submission, indexing.

## Owner decisions needed for launch

See `docs/launch-dependencies.md`. In short: name, domain, the launch steps for hosting, correction route, owner, reviewer, AI crawler policy, accessibility assessment by a person. Analytics is decided: Cloudflare Web Analytics at launch, not added yet.

## Owner's answers

Given on 29 September 2026. The record is `docs/decision-log.md`, numbers 29 to 34.

| Question | Answer | State |
| --- | --- | --- |
| Should pensions and social care stay a main page? | No. A dated section of the reform options page | Done in the working copy. After the change, `npm run build`, `npm test`, `npm run a11y` and `node scripts/a11y-manual-assist.mjs` were run again on 29 September 2026, with the results in "Checks performed". The section was looked at in Chrome at 390 and 1280 pixels wide. Committed, and merged into `main` on 30 September 2026. It was then rewritten after the announcement: see decision 36 |
| May `scripts/seed/` be deleted? | Yes | Deleted |
| Should the fiscal-claim page be linked? | No | Register entry marked declined |
| Should Netlify's own password page be turned off? | Yes | Done on 30 September 2026 with the Netlify CLI. Checked on the main address |
| May `.preview-password` be deleted? | Yes | Deleted |
| Are the decisions in the decision log accepted? | 22 accepted as written. Analytics amended to Cloudflare at launch. Number 21, the three parties left out, reopened | See number 34, overtaken by number 39 |

Answered on 29 September 2026: previews are protected with basic authentication, hosting is Netlify, and four unused variables were deleted from Netlify.

## Owner's answers of 30 September 2026

| Question | Answer | State |
| --- | --- | --- |
| Social care: section or page? | Section for now. Decide again when Casey reports | Done: decision 36 |
| The name of the rule? | "The rule announced for April 2030", with the government's name given where the rule is described | Done: decision 37 |
| Add the rule to the rule comparison? | Yes, as a later phase | Not started: decision 38 |
| Responses from parties and other bodies? | Read them at source and add them now. Label what is left | Done: decision 39 |
| Findings R7 to R17? | All now | Done: decision 43 |
| A policy change entry in `corrections.json`? | No | Decision 40 |
| The uncommitted edits on `html-semantics`? | Commit them first | Done: commits `8c78a0b` and `ad5dbb6` |
| Which branch? | A new branch from `html-semantics` | Done: `april-2030-rule` |

## Waiting on the owner

As at 30 September 2026.

| Item | What is needed |
| --- | --- |
| The rule comparison | The go-ahead for the later phase in decision 38: specification, code, tests and a reference calculation for the announced rule |
| The deployed site | Netlify built `main` at commit `82632cb` on 30 September 2026, and the main address answered 401 with `WWW-Authenticate: Basic`. Nobody has looked at the pages past the sign-in. Doing so needs the sign-in, which the owner enters |
| Two items the research left out | The speech's commitment on Income Tax for pensioners on low incomes, and a YouGov poll of 29 September 2026. See `research/06-announcement-2026-09-29.md` |
| Markup conventions in the README | Written by the assistant after the sweep of 29 September. Not yet accepted by the owner |

## Tracked separately

| Item | Status |
| --- | --- |
| Reciprocal links on UK Public Finances Explorer and UK Migration Explorer | Not started. Needs a live domain. No other repository was changed |
| Deployed checks | Done for the deploy preview of pull request 1. See "Checks on the deployed preview". Not done for pull requests 2 to 4, for the main site address beyond the sign-in, or for a production domain |
| Search console | Not started. Needs account and domain access |

## Found in passing

- UK Public Finances Explorer shows State Pension spending of £146 billion as a 2025-26 forecast graded "official". Its own backlog calls the file stale. This site did not reuse it.
- Port 8081 on this computer was in use by another process. This project uses 8137.
- A hook reported that `~/.claude/settings.json` changed at 09:57 on 29 September. No command in this build touched it.
