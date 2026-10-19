# UK State Pension Explorer

A plain-English explainer of the UK State Pension, the triple lock, what a pension can cover, and the evidence for and against reform. A sister site to UK Public Finances Explorer and UK Migration Explorer.

**Status: a preview for review. It is not published and must not be described as meeting WCAG 2.2 AA.** See `docs/HANDOVER.md`.

Found an error on the site? Open an issue at https://github.com/LegendT/UK-State-Pension-Explorer/issues. From launch, the correction link on every page goes there too.

## Set up

Needs Node 22.12 or later, the oldest version `puppeteer-core` supports; the project pins Node 24 in `.node-version`. The source checks need Python 3, `curl` and `pdftotext`.

```
npm ci
```

The accessibility and tool scripts use the Chrome already on the computer, through `puppeteer-core`, which downloads no browser of its own. Set `CHROME_PATH` if Chrome is not in the usual place on a Mac.

`npm audit` reports 9 packages. The two with no fixed version, `braces` and `sprintf-js`, are never loaded when the site is built, and nothing reaches the published site, which is static files. Do not run `npm audit fix --force`: it would downgrade Eleventy. The detail is in `docs/maintenance.md`, "Dependencies".

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Serves the site and rebuilds on change. |
| `npm run build` | Builds to `_site`, then runs the build checks in `scripts/check-build.mjs`. |
| `npm test` | Tests the calculators against separately worked values, and a chart's layout on a phone. |
| `npm run serve` | Serves `_site` at http://127.0.0.1:8137 |
| `npm run a11y` | axe-core on every page and state. Writes `reports/a11y.json`. Run it after any change to markup, styles or scripts, and after a data change that a page shows. |
| `npm run a11y:manual` | Scripted measurements for the manual part of the accessibility assessment: reflow, text spacing, target size, keyboard, headings, the "On this page" list, the "Back to top" link, and each tool with its script blocked or held back. Run it after a layout, focus or script-loading change; `docs/maintenance.md` says when to run every check. |
| `npm run test:tools` | Drives the four tools in a headless Chrome the way a reader does, after `npm run build`. Run it after changing a tool's script or template. |
| `npm run update-check` | Fetches every source and outbound link once and reports what may have gone stale (`--days`, `--today`), then runs the passage and value checks. Writes `reports/update-check.json`. What to do with each section: `docs/maintenance.md`, "The update check". |
| `node scripts/measure-loading.mjs` | Loads five pages as a slow phone would, cold and warm, and times each tool's redraw. With no `SITE_URL` it serves `_site`, after `npm run build`; with one it measures that site, and `SITE_USER` and `SITE_PASS` sign in to the preview. |
| `python3 scripts/check-passages.py` | Looks for every quoted passage in its live source. |
| `python3 scripts/check-values.py` | Looks for unquoted figure values in their source text. |
| `python3 scripts/reference.py` | Prints the reference calculations. |

Each script's header comment says what it checks.

## Environments

`SITE_ENV` is `development` (the default), `preview` or `production`.

| Environment | Indexing | Sitemap | Banner |
| --- | --- | --- | --- |
| development | `noindex` on every page | None | Preview banner |
| preview | `noindex` on every page | None | Preview banner |
| production | Indexable | `/sitemap.xml` | None |

A production build stops unless the launch values it can check are set, and set to values that can be right. It also stops while `BASIC_AUTH` is set, if `netlify.toml` sends an `X-Robots-Tag` header, or on Netlify outside the production context. A preview's `noindex` header is written to `_site/_headers`. See `docs/launch-dependencies.md`.

On Netlify the build also reads three variables Netlify sets: `NETLIFY` and `CONTEXT`, which stop a production build outside the production context, and `DEPLOY_PRIME_URL`, which a preview takes as its own address so that it never names the published site as its canonical. `SECRETS_SCAN_OMIT_PATHS` in `netlify.toml` leaves `_site/_headers` out of Netlify's secrets scan, since the build writes the preview's sign-in there on purpose.

A production build adds Cloudflare Web Analytics, with the token in `src/_data/site.js`, and the privacy page says so. Development and preview builds load nothing from any other website.

```
SITE_ENV=production SITE_TITLE="..." SITE_URL=https://... CORRECTION_URL=https://... \
OWNER_NAME="..." OWNER_TYPE=Person REVIEWER_NAME="..." REVIEW_DATE=2026-10-01 \
A11Y_ASSESSMENT_DATE=2026-10-01 AI_CRAWLER_POLICY=allow npm run build
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/*.njk` | The pages. |
| `src/tools/` | The Tools page and three tools, each on a page of its own. The rule comparison is `src/reform-compare.njk`. |
| `src/_includes/` | Layout and shared components. |
| `src/_data/figures.json` | Register of figures. Numbers in page text come from here. Exceptions: `tables.json`, `history.json`, `budgets.json` and `scenarios.json` hold their own sourced values, and `links.json` quotes three amounts in a note, two of this site's and one of the destination's. |
| `src/_data/claims.json` | Register of statements that are not figures. |
| `src/_data/sources.json` | Register of sources. |
| `src/_data/history.json` | Published rates and decisions, 2010/11 to 2026/27. A year with an `annotation` is marked on the history chart, with that text in the list under it. |
| `src/_data/tables.json` | Sourced tables. |
| `src/_data/budgets.json` | Budget categories and example budgets. |
| `src/_data/scenarios.json` | Hypothetical scenarios for the rule comparison. |
| `src/_data/pageRegister.json` | Title, description, dates and indexing for each page. `figure_cards` marks the pages with figure cards; `npm run build` fails if it does not match the page. |
| `src/_data/links.json` | Links to the sister sites, and the planned links back. |
| `src/_data/news.json` | The date of the note "In the news" on the overview page, whose text is in `src/index.njk`. The same date dates the pensions and social care page. |
| `src/_data/a11y.json` | What the accessibility statement reports. |
| `src/assets/js/lib/` | Calculations and views. No DOM. Used by the build and the browser. |
| `src/assets/js/tools/` | The four calculators' page scripts. |
| `src/assets/js/*.js` | The page scripts: `contents.js` marks the section being read in the "On this page" list, `back-to-top.js` fixes the "Back to top" link, `scroll-cue.js` shows "Scroll sideways for more" on a wide table or chart, `cards.js` makes the overview's cards clickable, `js-class.js` marks the page as running scripts, and `moved.js` forwards the old rule comparison's address to `/reform-options/compare/`. |
| `test/` | Tests. |
| `scripts/` | Build check, accessibility runs, tool checks, source checks, the update check, loading measurements, reference calculations. |
| `research/` | The research record behind the registers. |
| `docs/` | Specification, reference calculations, requirements matrix, decisions, launch dependencies, markup conventions, accessibility assessment, maintenance, handover, and the three frozen reviews. The handover holds the current state only. |
| `LICENCE` | MIT for the code and the site's own writing; the figures and quoted passages stay under their sources' terms. |

## Hosting

Netlify builds a preview from `main`, using `netlify.toml`, until `SITE_ENV` under `[context.production.environment]` is set to `production` at launch. Deploy previews and branch deploys stay previews after launch. A preview asks for a user name and password, set in the `BASIC_AUTH` variable in Netlify as `user:password`; the build writes them to `_site/_headers`. `BASIC_AUTH=user:password npm run build` shows that the rule is written, not that the sign-in works, because the local server ignores that file.

## Markup

The rules for figure cards, notes, charts, tables, citations, dates, the contents list and the tools are in `docs/markup-conventions.md`. Section 8 of `scripts/check-build.mjs` tests the ones a pattern can hold, listed at the head of `docs/markup-conventions.md`; the others need reading.

## Conventions

- British English. No em dashes. No emoji. Straight quotation marks.
- No figure is typed into a page. Use `{{ "id" | fig }}` or the `figure` filter. Two exceptions (decision 84): the 2.5% of the triple lock, which is part of the rule's wording and rests on the claims register, and a result of the model that a test holds, such as "10p a week at most" in the rule comparison.
- A date the site does not hold is left out. It is never taken from a build.
- Tools calculate in whole pence and tenths of a per cent.
