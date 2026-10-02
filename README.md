# UK State Pension Explorer

A plain-English explainer of the UK State Pension, the triple lock, what a pension can cover, and the evidence for and against reform. A sister site to UK Public Finances Explorer and UK Migration Explorer. The name was confirmed on 2 October 2026: decision 66.

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
| `npm run a11y:manual` | Reflow, text spacing, target size, keyboard, headings, no JavaScript, and the "On this page" marking. Run it after changing `contents.js`, the contents macro or the `.contents` styles. |
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

A production build stops unless the launch decisions it can check are set. It also stops while `BASIC_AUTH` is set, if `netlify.toml` sends an `X-Robots-Tag` header, or on Netlify outside the production context. A preview's `noindex` header is written to `_site/_headers`. See `docs/launch-dependencies.md`.

A production build adds Cloudflare Web Analytics, with the token in `src/_data/site.js`, and the privacy page says so. Development and preview builds load nothing from any other website: decision 74.

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
| `src/_data/figures.json` | Register of figures. Numbers in page text come from here. Exceptions: `tables.json`, `history.json`, `budgets.json` and `scenarios.json` hold their own sourced values, and `links.json` quotes two figures in a note. |
| `src/_data/claims.json` | Register of statements that are not figures. |
| `src/_data/sources.json` | Register of sources. |
| `src/_data/history.json` | Published rates and decisions, 2010/11 to 2026/27. A year with an `annotation` is marked on the history chart, with that text in the list under it. |
| `src/_data/tables.json` | Sourced tables. |
| `src/_data/budgets.json` | Budget categories and example budgets. |
| `src/_data/scenarios.json` | Hypothetical scenarios for the rule comparison. |
| `src/_data/pageRegister.json` | Title, description, dates and indexing for each page. `figure_cards` marks the pages with figure cards, where the page foot says check dates are under "More about this figure"; `npm run build` fails if it does not match the page. |
| `src/_data/links.json` | Links to the sister sites, and the planned links back. |
| `src/_data/news.json` | The date of the note "In the news" on the overview page, whose text is in `src/index.njk`. The same `as_of` date dates the pensions and social care page. |
| `src/_data/a11y.json` | What the accessibility statement reports. |
| `src/assets/js/lib/` | Calculations and views. No DOM. Used by the build and the browser. |
| `src/assets/js/tools/` | The four calculators' page scripts. |
| `src/assets/js/contents.js` | Marks the section being read in the "On this page" list. |
| `src/assets/js/moved.js` | Sends a link to the old rule comparison, with settings in its address, on to `/reform-options/compare/`. |
| `src/assets/js/cards.js` | Makes a click on the description of each card under "Where to go next" on the overview follow the card's link after 300 ms, unless a second click makes it a double-click or the reader has selected text. |
| `test/` | Tests. |
| `scripts/` | Build check, accessibility runs, source checks, reference calculations. |
| `research/` | The research record behind the registers. |
| `docs/` | Specification, decisions, assessment, maintenance, handover. |
| `NEXT-SESSION.md` | A prompt for the first message of a new session. Written by the handoff check. Not edited by hand. |

## Hosting

Netlify builds a preview from `main`, using `netlify.toml`, until `SITE_ENV` under `[context.production.environment]` is set to `production` at launch. Deploy previews and branch deploys stay previews after launch: decision 68. A preview asks for a user name and password. They are set in the `BASIC_AUTH` variable in Netlify, as `user:password`, and the build writes them to `_site/_headers`. `BASIC_AUTH=user:password npm run build` shows that the rule is written. It does not show that the sign-in works, because the local server ignores that file. That was checked on the Netlify deploy preview on 29 September 2026. Repository, private: https://github.com/LegendT/UK-State-Pension-Explorer

## Markup conventions

Set on 29 September 2026 after a sweep of every built page, and changed on 1 October 2026 for defect 11 of the handover. Accepted by the owner on 1 October 2026. The rule for sources changed on 2 October 2026: decision 77. Section 8 of `scripts/check-build.mjs` holds the rules a pattern can test: table regions named by their captions, a space between `</dt>` and `<dd>`, a chart named by its title alone and starting with its `figcaption`, notes that start with a heading, named sections for calculators only, and named `nav` elements. The others need reading.

| Rule | Where it applies |
| --- | --- |
| A figure card is an `article` with a heading, inside a list item. Its heading is one level below the heading of the section it sits in. Pass the level to `m.stat`. | The cards on the State Pension, living on a pension and reform options pages |
| A note or a "not available" block is a `div` with `role="note"` and a heading as its first child, one level below the section it sits in. Pass the level to `m.note` and `m.unavailable`. | Every page, and the results the calculators write |
| An option is an `article` with its own `h3`. It has no `aria-labelledby`, so it is not a region landmark. | Reform options |
| A `section` with `aria-labelledby` is for a calculator only. | The four calculators |
| A label with one value is a `dl`. So is a list of names, each with its description. Keep a space between `</dt>` and `<dd>`. A list of points that each open with a bold sentence stays a `ul`: the sentence is the point, not a name. A numbered sequence stays an `ol`. | Figure details, calculator results, the options, the measures, the situations on the overview, the history of the triple lock, the accessibility statement |
| The period, place, range and source under a figure are a `dl` with a `div` round each pair. The status labels come before it and the caveat after it, each in its own paragraph. | Every source note, from `m.sourceNote` |
| A chart is a `figure` with its title in a `figcaption`. The title states what the chart shows and is worked out from the result, never typed. The image is named by its `title` alone. Its `desc` is joined with `aria-describedby`. | The history explorer and the rule comparison |
| A source after a sentence is `m.ref`, or `m.c` for a claim. `.ref` puts it on a line of its own under the sentence, small and muted. Do not type "Source:" and a citation by hand. A link onward from a short entry is `m.more`, drawn by `.onward` on a line of its own after the source, so the two do not run together. | Every page; `m.more` in the overview's short entries |
| A calculator whose result is below its form keeps a summary of the result in view: beside the form when there is room, pinned to the foot of the screen when there is not, unless it would take more than half the screen: then it follows the form (decision 79). The pinned summary holds nothing that takes focus. The result follows the form 400 ms after the last change: `live` and `pinSummary` in `src/assets/js/tools/common.js`. The triple lock calculator follows its figures only; choosing a year waits for its load button. After a change, not on arrival, the summary ends with "Updated" and a sentence saying the result below changed too (`updatedNote`), and the status message says the same. | All four tools |
| A link that stands for a card holds the card's name only. The description follows it as a paragraph. The link's `::after` covers the card, so the name and padding follow the link. The description is raised above it, so it can be selected by dragging or double-clicking. Once `cards.js` runs, a click on the description follows the link after 300 ms, unless a second click makes it a double-click. Without script the description is not a link target. The card shows a 3px outline while its link has keyboard focus. | "Where to go next" on the overview |
| An `h3` without an `id` gets one at build time, made from its words, so changing the words changes the link. Give it an `id` by hand if another page links to it. Result headings that a calculator draws in the browser get no `id`. A page with a contents list gets "Back to contents" links at build time. Both are in `eleventy.config.js`. | Every page |
| A date that a template prints is a `time` element: `timeTag` for a day, `monthOrDayTag` for a source that gives a month only. Dates typed inside register text stay plain. | Citations, check dates, the register of sources |
| Words taken from a source are in `q` or in quotation marks. | Quoted passages |
| Lists of links in the footer are `nav` elements with names. | Every page |
| A wrapper that scrolls a table or chart keeps `tabindex="0"`, `role="region"` and a name. A table's wrapper is named by its `caption` with `aria-labelledby`. In a template, leave the name off and the `tableRegions` transform in `eleventy.config.js` adds it. A script that draws a table gives the caption an `id` itself. A chart's wrapper keeps a short typed name, "Chart: …". Naming it from the `figcaption` would make a screen reader hear the title twice, once for the region and once for the image inside it. `html-validate` reports each wrapper under `prefer-native-element`. That report is declined. | Every wide table and chart |

The exception is the preview banner. It has `role="note"` and no heading, because a heading there would come before the `h1`. It goes at launch.

`scripts/a11y-manual-assist.mjs` counts skipped heading levels. It cannot tell whether a heading sits under the right parent. Check that by reading the outline.

## Conventions

- British English. No em dashes. No emoji. Straight quotation marks.
- No figure is typed into a page. Use `{{ "id" | fig }}` or the `figure` filter.
- A date the site does not hold is left out. It is never taken from a build.
- Tools calculate in whole pence and tenths of a per cent.
