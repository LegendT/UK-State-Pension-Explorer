# UK State Pension Explorer

A plain-English explainer of the UK State Pension, the triple lock, what a pension can cover, and the evidence for and against reform. A sister site to UK Public Finances Explorer and UK Migration Explorer. The name is a working title.

**Status: a preview for review. It is not published and must not be described as meeting WCAG 2.2 AA.** See `docs/HANDOVER.md`.

## Set up

Needs Node 22 or later. The project pins Node 24 in `.node-version`.

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install
```

The accessibility scripts use the Chrome already on the computer. Set `CHROME_PATH` if it is not in the usual place on a Mac. The source checks need Python 3, `curl` and `pdftotext`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Serves the site and rebuilds on change. |
| `npm run build` | Builds to `_site`, then runs `scripts/check-build.mjs`. |
| `npm test` | Tests the calculators against separately worked values. |
| `npm run serve` | Serves `_site` at http://127.0.0.1:8137 |
| `npm run a11y` | axe-core on every page and state. Writes `reports/a11y.json`. |
| `node scripts/a11y-manual-assist.mjs` | Reflow, text spacing, target size, keyboard, headings, no JavaScript. |
| `python3 scripts/check-passages.py` | Looks for every quoted passage in its live source. |
| `python3 scripts/check-values.py` | Looks for unquoted figure values in their source text. |
| `python3 scripts/reference.py` | Prints the reference calculations. |

## Environments

`SITE_ENV` is `development` (the default), `preview` or `production`.

| Environment | Indexing | Sitemap | Banner |
| --- | --- | --- | --- |
| development | `noindex` on every page | None | Preview banner |
| preview | `noindex` on every page | None | Preview banner |
| production | Indexable | `/sitemap.xml` | None |

A production build stops unless the launch decisions it can check are set. It also stops while `BASIC_AUTH` is set or while `netlify.toml` still sends the `noindex` header. See `docs/launch-dependencies.md`.

The command below passes only after that header has been removed from `netlify.toml`.

```
SITE_ENV=production SITE_TITLE="..." SITE_URL=https://... CORRECTION_URL=https://... \
OWNER_NAME="..." OWNER_TYPE=Person REVIEWER_NAME="..." REVIEW_DATE=2026-10-01 \
A11Y_ASSESSMENT_DATE=2026-10-01 AI_CRAWLER_POLICY=allow npm run build
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/*.njk` | The pages. |
| `src/_includes/` | Layout and shared components. |
| `src/_data/figures.json` | Register of figures. Numbers in page text come from here. Exceptions: `tables.json`, `history.json`, `budgets.json` and `scenarios.json` hold their own sourced values, and `links.json` quotes two figures in a note. |
| `src/_data/claims.json` | Register of statements that are not figures. |
| `src/_data/sources.json` | Register of sources. |
| `src/_data/history.json` | Published rates and decisions, 2010/11 to 2026/27. |
| `src/_data/tables.json` | Sourced tables. |
| `src/_data/budgets.json` | Budget categories and example budgets. |
| `src/_data/scenarios.json` | Hypothetical scenarios for the rule comparison. |
| `src/_data/pageRegister.json` | Title, description, dates and indexing for each page. |
| `src/_data/links.json` | Links to the sister sites, and the planned links back. |
| `src/_data/news.json` | The dated note on the overview page. |
| `src/_data/a11y.json` | What the accessibility statement reports. |
| `src/assets/js/lib/` | Calculations and views. No DOM. Used by the build and the browser. |
| `src/assets/js/tools/` | The four calculators' page scripts. |
| `test/` | Tests. |
| `scripts/` | Build check, accessibility runs, source checks, reference calculations. |
| `research/` | The research record behind the registers. |
| `docs/` | Specification, decisions, assessment, maintenance, handover. |

`scripts/seed/`, if present locally, holds the one-off scripts that first wrote the registers. It is not committed. **Do not run them.** The registers have been edited since.

## Hosting

Netlify builds a preview from `main`, using `netlify.toml`. The preview asks for a user name and password. They are set in the `BASIC_AUTH` variable in Netlify, as `user:password`, and the build writes them to `_site/_headers`. `BASIC_AUTH=user:password npm run build` shows that the rule is written. It does not show that the sign-in works, because the local server ignores that file. That was checked on the Netlify deploy preview on 29 September 2026. Repository: https://github.com/LegendT/UK-State-Pension-Explorer

## Conventions

- British English. No em dashes. No emoji.
- No figure is typed into a page. Use `{{ "id" | fig }}` or the `figure` filter.
- A date the site does not hold is left out. It is never taken from a build.
- Tools calculate in whole pence and tenths of a per cent.
