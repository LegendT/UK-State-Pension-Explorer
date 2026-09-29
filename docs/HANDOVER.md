# Handover: first build

29 September 2026. The site is a **preview for review**. It is not published. The work is committed on the branch `first-build` and has not been pushed, so Netlify has not yet built it.

## How to look at it

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install
npm run build
npm run serve        # http://127.0.0.1:8137
```

## Completed

- Eight main pages, four utility pages, four calculators.
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

Not checked on the deployed preview: the other three calculators, any browser but Chrome, a fetched share preview on a social platform, and anything on the main site address, which has no deploy of this code until the pull request is merged.

## Known defects and limits

1. **The news note and the social care page predate the Prime Minister's conference speech.** No transcript was found by mid-afternoon. Both must be rewritten once it is published.
2. **No published proposal ties the triple lock to social care.** The page says so. Its title differs from the scope for that reason.
3. **Example budgets are not like for like.** Private renters at the 2026 minimum, social renters at the 2025 minimum, owners at the 2025 moderate standard.
4. **Not found, and shown as gaps:** the share of people on the full rate, the number whose pension is not increased abroad, costings for a double lock and for means-testing, incomes of pensioner carers.
5. **Typed wording that will age:** the worked example on the triple lock page names months and years in words. The first year in the rule comparison starts at 2027/28. Both are in the maintenance guide.
6. **One check date is printed for two figures** in a few combined source notes. The dates are the same today.
7. **The preview on Netlify uses basic authentication** and sends `noindex` on every file. Both were seen working on the deploy preview. Both must be removed at launch. The user name and password are in the `BASIC_AUTH` variable in Netlify and in the local `.preview-password` file, which is not committed. Netlify's own password protection is also switched on, so a visitor is asked twice until it is turned off.
8. **Field errors use `role="alert"`.** With many errors at once, screen reader announcements may compete. Not tested.
9. **`scripts/seed/` should be deleted.** Running it would overwrite the registers. A delete was attempted and declined by the permission settings, so it is still there.
10. **Two party positions rest on news reports**, not party documents.
11. **After launch, deploy previews and branch deploys would be open.** The launch steps delete `BASIC_AUTH` everywhere. Keeping it for those two contexts needs the production guard to check the Netlify context. Deferred to launch planning.
12. **The sign-in is also in a local plain-text file**, `.preview-password`. It can be deleted once the owner has stored the password elsewhere.

## Checks not performed

- Any test with a screen reader. VoiceOver with Safari and NVDA on Windows are both outstanding.
- Keyboard use, browser zoom and touch by a person. Firefox and Safari.
- Review of content by a second person.
- The download and copy buttons of the history explorer were not pressed in a test.
- The sister sites' tools were read from served HTML. They were not run.
- House of Commons Library briefings and Hansard could not be opened.
- Nothing about a deployed site: HTTP status, headers, redirects, fetched share previews.
- Search console verification, sitemap submission, indexing.

## Owner decisions needed for launch

See `docs/launch-dependencies.md`. In short: name, domain, the launch steps for hosting, correction route, owner, reviewer, AI crawler policy, accessibility assessment by a person, analytics.

## Questions for the owner

1. **Should pensions and social care stay a main page?** It rests on reporting that may change within days. The alternative is a dated section of the reform options page until a proposal is published.
2. **May `scripts/seed/` be deleted?**
3. **Should the fiscal-claim page on UK Migration Explorer be linked?** It does not mention pensions.

## Tracked separately

| Item | Status |
| --- | --- |
| Reciprocal links on UK Public Finances Explorer and UK Migration Explorer | Not started. Needs a live domain. No other repository was changed |
| Deployed checks | Done for the deploy preview. See "Checks on the deployed preview". Not done for the main site address or a production domain |
| Search console | Not started. Needs account and domain access |

## Found in passing

- UK Public Finances Explorer shows State Pension spending of £146 billion as a 2025-26 forecast graded "official". Its own backlog calls the file stale. This site did not reuse it.
- Port 8081 on this computer was in use by another process. This project uses 8137.
- A hook reported that `~/.claude/settings.json` changed at 09:57 on 29 September. No command in this build touched it.
