# Sibling inspection: UK Public Finances Explorer and UK Migration Explorer

Inspected 29 September 2026, read-only. Nothing in either sibling repository was modified,
created or deleted, and neither build was run. Live pages were fetched with `curl` at
08:22 UTC on 29 September 2026.

Short names used below:

- **UKPF** = `/Users/anthonygeorge/Projects/UK Public Finances` (live: https://ukpublicfinances.org/), `main` at `4f1deba`.
- **MIA** = `/Users/anthonygeorge/Projects/Migration Immigration and Asylum` (live: https://ukmigrationexplorer.org/), `main` at `9203a98`.

## What was and was not checked

Read in full: both `package.json`, both `netlify.toml`, both `.pa11yci.json`, UKPF
`.eleventy.js`, UKPF `base.njk`, `macros.njk`, `main.css`, `nav.js`, `calc.js`,
`big-numbers.js`, `budget-simulator.js`, `timeline.js`, `site.json`, `meta.json`,
`assumptions.json`, `robots.njk`, `sitemap.njk`, `llms.njk`, four UKPF page templates, three of
the four UKPF test files, UKPF `HANDOFF.md` and `NEXT-SESSION.md`; MIA `base.njk`, `claim.njk`,
`style.css`, `site.js`, `sitemap.njk`, `robots.txt`, `meta.json`, the CI workflow.

Read in part or digested (comments stripped, long lines truncated, or headings only):
MIA `eleventy.config.js` (code read, comments stripped), MIA `lib/citation.mjs`,
`lib/provenance.mjs`, `lib/structured-data.mjs`, `lib/charts.mjs` (structure and the figure
markup only), MIA `README.md` (layout, data contract, build, checks, markup conventions and
known gaps sections), MIA `docs/HANDOFF.md` (sibling, house style, decisions, and the first line
of each working practice), UKPF `README.md`, `docs/NEXT-STEPS.md` and `docs/UPDATING-DATA.md`
(lines truncated at 500 to 700 characters), UKPF `test/data.test.js` (test names plus three
tests).

Not read: MIA `docs/BACKLOG.md` (3,192 lines), `docs/foundation.md` beyond section 10,
`docs/UPDATING-DATA.md`, `docs/UPDATE-AUTOMATION.md`, `CHANGELOG.md`, the bodies of the MIA
check scripts (only their header comments and the README's description of them),
`lib/published.mjs`, `lib/claim-links.mjs`, `lib/fetch-retry.mjs`, `lib/series.mjs`; UKPF
`lifetime.js`, the gitignored UKPF audit and outreach documents. Neither repository has a
`CLAUDE.md` or `AGENTS.md` at its root (UKPF has a `.claude/` directory holding only
`worktrees/`). No check, test or build was executed, so every statement about what passes is
the repositories' own claim, not something verified here.

Pre-existing working tree state, not caused by this inspection: MIA shows `.gitignore`
modified and two untracked files (`UK Migration Explorer-pre.md`, `changes.txt`).

---

## 1. Stack

| | UKPF | MIA |
| --- | --- | --- |
| Generator | Eleventy, `"@11ty/eleventy": "^3.0.0"`, 3.1.6 installed | Eleventy, `"@11ty/eleventy": "^3.1.6"`, 3.1.6 installed |
| Config file | `.eleventy.js` (123 lines, ESM) | `eleventy.config.js` (about 780 lines, ESM) |
| Template language | Nunjucks for everything; `markdownTemplateEngine: "njk"`, `templateFormats: ["njk","md","html"]` | Nunjucks layouts and theme pages, Markdown content; `markdownTemplateEngine: false`, `setTemplateFormats(['md','njk','css'])` |
| Module type | `"type": "module"` | `"type": "module"` |
| Dependencies | none | none |
| devDependencies | `@11ty/eleventy` only | `@11ty/eleventy`, `http-server` 14.1.1, `pa11y-ci` 4.1.1, `start-server-and-test` 3.0.11 (all three pinned exactly) |
| Node | 24, in `.node-version` and `netlify.toml`. README says "Requires Node.js 18+" | 22, in `netlify.toml` and the CI workflow. No `.node-version` or `.nvmrc` |
| Hosting | Netlify, `npm run build`, publish `_site` | Netlify, `npm test && npm run build`, publish `_site` |
| CI | None. No `.github/` directory | GitHub Actions, `.github/workflows/validate-data.yml` |
| Analytics | Cloudflare Web Analytics, token in `site.json`, rendered conditionally | Cloudflare Web Analytics, token hard-coded in `base.njk` |
| Client JavaScript | Vanilla, five scripts plus one ESM library | None except the analytics beacon |
| Licence | MIT (`LICENSE`) | MIT for code, OGL v3 for figures in `data/` (`LICENCE`) |

### npm scripts

UKPF (`package.json`):

```json
"start": "eleventy --serve",
"dev": "eleventy --serve",
"build": "eleventy",
"test": "node --test 'test/**/*.test.js'",
"a11y": "npx --yes pa11y --standard WCAG2AA http://localhost:8080",
"a11y:all": "npm run build && npx --yes start-server-and-test a11y:serve http://127.0.0.1:8081 a11y:ci",
"a11y:serve": "npx --yes http-server _site -p 8081 -s -c-1",
"a11y:ci": "npx --yes pa11y-ci --sitemap http://127.0.0.1:8081/sitemap.xml --sitemap-find \"https://[^/]+\" --sitemap-replace http://127.0.0.1:8081"
```

MIA (`package.json`):

```json
"test": "node scripts/validate-data.mjs && node scripts/validate-content.mjs",
"validate": "node scripts/validate-data.mjs --verbose && node scripts/validate-content.mjs && node scripts/check-fetch-retry.mjs && node scripts/check-pipeline.mjs",
"check-sources": "node scripts/check-sources.mjs",
"check-evidence": "node scripts/check-evidence.mjs",
"check-releases": "node scripts/check-releases.mjs",
"build": "rm -rf _site && eleventy && node scripts/check-build.mjs",
"serve": "eleventy --serve",
"check-build": "node scripts/check-build.mjs",
"a11y": "npm run build && start-server-and-test a11y:serve http://127.0.0.1:8081 \"npm run a11y:ci\"",
"a11y:serve": "http-server _site -p 8081 -s -c-1",
"a11y:ci": "pa11y-ci && node scripts/check-a11y-dark.mjs"
```

Difference that matters: UKPF fetches its audit tools with `npx --yes` at run time; MIA pins
them as devDependencies, and its README gives the reason: "Pinned rather than fetched at run
time, so two runs a month apart test against the same code".

### Hosting config

UKPF `netlify.toml` headers:

```toml
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
X-Frame-Options = "DENY"
Permissions-Policy = "geolocation=(), microphone=(), camera=(), interest-cohort=()"
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests"
```

It sets no asset cache header, deliberately: "Assets are not fingerprinted, so we deliberately
do NOT set a long max-age".

MIA `netlify.toml` headers:

```toml
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
Content-Security-Policy = "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

MIA's CSP is the stricter of the two: no `'unsafe-inline'` for scripts or styles. UKPF needs
`'unsafe-inline'` because `base.njk` carries an inline `<script>` that adds the `js` class.
Note that JSON-LD and `type="application/json"` blocks are data, not executed script, so MIA
ships JSON-LD under its strict policy.

---

## 2. Directory layout

### UKPF

```
.eleventy.js                     config and filters
netlify.toml, .node-version, .pa11yci.json, .editorconfig
src/                             Eleventy input
  *.njk                          one file per page, at the root of src/
  _includes/layouts/base.njk     the only layout
  _includes/components/macros.njk  every component, as Nunjucks macros
  _data/*.json                   all figures, plus site.json and meta.json
  assets/css/main.css            the only stylesheet (461 lines)
  assets/js/                     nav.js, big-numbers.js, budget-simulator.js, lifetime.js, timeline.js
  assets/js/lib/calc.js          pure calculation module, imported by browser and tests
  assets/                        favicon.svg, og-image.png, icon-192.png, icon-512.png, apple-touch-icon.png
  favicon.ico, site.webmanifest  passthrough to site root
  robots.njk, sitemap.njk, llms.njk, feed.njk   generated crawl files
test/                            data.test.js, calc.test.js, lastmod.test.js, no-emdash.test.js
docs/                            DATA-SOURCES.md, UPDATING-DATA.md, NEXT-STEPS.md (tracked); audits and outreach (gitignored)
HANDOFF.md, NEXT-SESSION.md      gitignored session records
```

### MIA

```
eleventy.config.js               config, shortcodes, filters, seven HTML transforms
netlify.toml, .pa11yci.json
content/                         Eleventy input
  index.njk, migration.njk, asylum.njk, costs.njk, returns.njk, common-claims.njk
  glossary.md, sources-and-method.md, style-guide.md, about.md, 404.md
  claims/*.md                    fourteen claim checks
  _includes/base.njk, claim.njk  layouts (no components directory)
  _data/site.js                  name, strapline, url, nav
  assets/style.css               the only stylesheet (719 lines, includes print)
  assets/favicon.svg             the only image asset
  robots.txt                     static file, passthrough
  sitemap.njk
data/                            governed data layer, OUTSIDE content/, passthrough-copied to /data/
  asylum.json, migration.json, fiscal.json, population.json   theme files holding metric records
  *Timeseries.json (four)        series files
  dashboard.json                 card references only, no values
  sources.json, meta.json
  evidence/*.json                one file per release, a quote behind every figure
lib/                             build-time modules: charts, citation, provenance, structured-data, escape, series, tables, published, claim-links, fetch-retry
scripts/                         nine check scripts (.mjs)
docs/                            BACKLOG.md, HANDOFF.md, foundation.md, UPDATING-DATA.md, MONTHLY-CHECK.md and review records
.github/workflows/validate-data.yml
CHANGELOG.md                     public record of every data change (185 KB)
```

Structural difference: UKPF uses Eleventy's `_data` directory so JSON is auto-loaded as
global data. MIA keeps data outside the input directory, reads it in the config, builds a
`registry` Map keyed `theme/id`, and publishes the raw JSON at `/data/`.

---

## 3. CSS

### Methodology

Neither sibling uses CUBE CSS, and neither names a methodology. Both are a single
hand-written stylesheet, mobile first with `min-width` queries, no preprocessor, no
framework, no utility layer beyond `.wrap` and `.visually-hidden`.

- UKPF uses BEM-style class names (`.metric-card__label`, `.site-nav__toggle`,
  `.metric-card--feature`) plus state classes (`.is-open`, `.is-active`, `.js`).
- MIA uses short flat class names scoped by descendant selectors (`.card .value`,
  `.claim-list h2 a`, `.site-header nav a`).

Neither uses cascade layers, container queries, logical-property-only layout or custom
property scales for type or space. If the new site wants CUBE CSS it would be a departure
from both, not an inheritance.

### Design tokens, UKPF (`src/assets/css/main.css`, lines 5 to 29)

```css
:root {
  --ink: #1a2230;
  --ink-soft: #46505f;
  --paper: #f7f8fa;
  --card: #ffffff;
  --line: #d8dde4;
  --line-strong: #767d87; /* form control borders: 4.2:1 on white, WCAG 1.4.11 needs 3:1 */
  --brand: #1d4e6b;       /* calm civic teal-blue */
  --brand-deep: #123a51;
  --accent: #5a6b3b;      /* muted olive for the chart line */
  --warn-bg: #fdf6e3;
  --warn-line: #c99a06;
  --focus: #ffdd00;       /* GOV.UK-style yellow focus */
  --ink-black: #0b0c0c;   /* GOV.UK near-black, paired with the focus yellow */

  /* confidence badges, muted, never alarmist */
  --c-official: #2f5d3a;
  --c-provisional: #6b5a1e;
  --c-estimated: #4a4f5a;
  --c-calculated: #3a5566;

  --radius: 8px;
  --wrap: 64rem;
  --gap: 1rem;
}
```

Type and measure:

```css
html { -webkit-text-size-adjust: 100%; font-size: 106.25%; }
@media (min-width: 48rem) { html { font-size: 118.75%; } }
body { font: 400 1rem/1.6 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
h1, h2, h3 { line-height: 1.2; color: var(--brand-deep); }
h1 { font-size: clamp(1.7rem, 5vw, 2.4rem); }
h2 { font-size: clamp(1.3rem, 3.5vw, 1.7rem); margin-top: 2.5rem; }
h3 { font-size: 1.15rem; }
.lede { font-size: 1.15rem; color: var(--ink-soft); max-width: 60ch; }
.prose { max-width: 70ch; }
.wrap { width: min(100% - 2rem, var(--wrap)); margin-inline: auto; }
```

There is no spacing scale and no type-scale tokens; sizes are literals. Several colours are
also literals outside `:root` (`#eef1f4`, `#e7f0e9`, `#f4efdc`, `#e8ebef`, `#8a2b1f`,
`#b9a06a`, `#7a6526`, the three `.sim-goal--*` sets).

Breakpoints in use: `34rem`, `38rem`, `44rem`, `48rem` (nav and root font size), `56rem`,
`60rem`, plus one `max-width: 55.99rem` for the simulator's fixed mobile banner.

### Design tokens, MIA (`content/assets/style.css`, lines 9 to 32)

```css
:root {
  --ink: #1a1a1a;
  --ink-soft: #4a4a48;
  --paper: #fdfdfc;
  --panel: #f4f3f0;
  --rule: #d5d2cc;            /* 1.5:1, quiet separators inside a component */
  --rule-strong: #8a8781;     /* 3.5:1 on --paper, 3.2:1 on --panel */
  --accent: #14508c;          /* 7.4:1 on --paper */
  --accent-soft: #e8eef5;
  --measure: 38rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #eceae6;
    --ink-soft: #b3afa8;
    --paper: #16171a;
    --panel: #1f2126;
    --rule: #3a3d44;
    --rule-strong: #6b6e77;   /* 3.5:1 on --paper, 3.2:1 on --panel */
    --accent: #8fbcec;        /* 7.9:1 on --paper */
    --accent-soft: #22303f;
  }
}
```

Type and measure:

```css
body { font: 400 1.0625rem/1.65 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
.wrap { width: 100%; max-width: 58rem; margin: 0 auto; padding: 0 1.25rem; }
main > * { max-width: var(--measure); }
h1, h2, h3 { line-height: 1.2; letter-spacing: -0.015em; text-wrap: balance; }
h1 { font-size: 1.875rem; }  h2 { font-size: 1.375rem; }  h3 { font-size: 1.125rem; }
p, li { text-wrap: pretty; }
@media (min-width: 40em) { body { font-size: 1.125rem; } h1 { font-size: 2.375rem; } h2 { font-size: 1.5rem; } }
```

Every colour in the MIA stylesheet is a custom property, which is what makes its dark scheme
work. Breakpoints: `34.5em` (chart rendering swap), `40em` (nav, type, grids), `60em`
(three-column cards). Again no spacing scale.

### Shared between the two

- The same system font stack, character for character.
- The same token names for the basics: `--ink`, `--ink-soft`, `--paper`.
- Heading `line-height: 1.2`.
- 44px minimum target size on nav links, summaries, buttons and inputs.
- Card grids of one, two then three columns.
- Identical `.visually-hidden` recipe.
- `prefers-reduced-motion: reduce` block.
- `font-variant-numeric: tabular-nums` on figures and numeric table cells.
- Pill-shaped confidence marker with `text-transform: capitalize` (`.badge` in UKPF, `.grade` in MIA).

### Where they differ

| | UKPF | MIA |
| --- | --- | --- |
| Dark mode | None. Light only, single `theme-color` `#123a51` | `prefers-color-scheme: dark` on `:root`, two `theme-color` metas, separately audited |
| Header | Solid `--brand-deep` band, white text | Page-coloured, bottom rule, ink text |
| Brand colour | `#1d4e6b` / `#123a51` teal-blue | `#14508c` blue |
| Focus | GOV.UK yellow `#ffdd00` with near-black companion | `outline: 3px solid var(--accent); outline-offset: 2px` |
| Type scaling | On `html` (root) | On `body` |
| Measure | `60ch` / `70ch` | `--measure: 38rem`, pinned to rem |
| Print styles | None | Full `@media print` block |
| Radius | `--radius: 8px` | `6px` literal |

MIA's `HANDOFF.md` records why the scaling difference matters: UKPF "scales the root font
size (`html { font-size: 106.25% }`) where this project scales `body`, which is why
`--measure` and the chart's `min-width` are pinned to 16px and do not grow with the type
scale."

### Focus styles, verbatim

UKPF:

```css
:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 0;
  box-shadow: inset 0 0 0 2px var(--ink-black);
}
a:focus-visible {
  outline: 3px solid transparent;
  color: var(--ink-black);
  background-color: var(--focus);
  box-shadow: 0 -2px var(--focus), 0 4px var(--ink-black);
  text-decoration: none;
}
input[type="range"]:focus-visible,
input[type="radio"]:focus-visible {
  box-shadow: 0 0 0 2px var(--ink-black);
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}
```

UKPF has to re-assert the focus colours wherever a component sets its own link colour
(`.site-header a:focus-visible`, `.card-links a:focus-visible`), because those rules tie on
specificity. That is a recurring cost of the yellow-fill pattern.

MIA:

```css
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### Fonts

Both use the system font stack only. No web fonts, no `@font-face`, no font files, no Google
Fonts. MIA's stylesheet header says so: "No web fonts, no frameworks, the page should render
before anything loads." UKPF's CSP allows `font-src 'self'` but nothing uses it. UKPF's
favicon SVG names Georgia for its pound sign; that is the only serif anywhere.

---

## 4. Page shell

### UKPF `<head>` (`src/_includes/layouts/base.njk`)

Title, description and canonical are computed once and reused:

```njk
{%- set pageTitle = (title + " | " + site.title) if title else site.title %}
{%- set pageDesc = description or site.description %}
{%- set canonical = canonicalUrl or (site.url + page.url) %}
<title>{{ pageTitle }}</title>
<meta name="description" content="{{ pageDesc }}">
<link rel="canonical" href="{{ canonical }}">
```

Also present: `theme-color`, an inline script adding the `js` class before the stylesheet,
four icon links (`favicon.ico` with `sizes="any"`, SVG, apple-touch-icon, manifest), full Open
Graph (`og:type`, `og:site_name`, `og:locale` `en_GB`, `og:title`, `og:description`, `og:url`,
`og:image` with width 1200, height 630 and alt), Twitter `summary_large_image` with title,
description, image and alt, `<link rel="sitemap">`, an Atom `<link rel="alternate">`, and
site-wide JSON-LD as a `@graph` of `WebSite`, `Organization` and `WebPage`. `dateModified` is
emitted only when the page has `dataUpdated`:

```njk
"inLanguage": "en-GB"{% if dataUpdated %},
"dateModified": "{{ dataUpdated | isoDate }}"{% endif %}
```

Per-page JSON-LD is added in page templates: `Dataset` on the home page, `FAQPage` on
`deficit-vs-debt`, `DefinedTermSet` on the glossary, `NewsArticle` on monthly entries (the
last two per the README; those templates were not opened).

### MIA `<head>` (`content/_includes/base.njk`)

```njk
<title>{% if claim and paused %}Claim check paused: {{ claim }} | {{ site.name }}{% elif claim %}Claim checked: {{ claim }} | {{ site.name }}{% elif title %}{{ title }} | {{ site.name }}{% else %}{{ site.name }}{% endif %}</title>
<meta name="description" content="{% if claim and paused %}This claim check is paused pending re-review. The page says what the claim was.{% else %}{{ description or short_answer or strapline or site.strapline }}{% endif %}">
<meta name="theme-color" content="#fdfdfc" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16171a" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="{% if claim %}article{% else %}website{% endif %}">
<meta property="og:site_name" content="{{ site.name }}">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="{{ site.url }}{{ page.url }}">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="{{ site.url }}{{ page.url }}">
{% structuredData %}
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/style.css">
```

Deliberate absences in MIA: no `og:image` (a documented decision, "the foundation document at
8.5.4 refuses a share image"), no Twitter title or description tags, no manifest, no
`favicon.ico`, no apple-touch-icon. JSON-LD appears on two pages only: `WebSite` plus
`Organization` on `/`, `Dataset` on `/sources-and-method/`. `ClaimReview` is refused by
`check-build.mjs`.

Live observation: the MIA home page's `<title>` is "Overview | UK Migration Explorer", because
`index.njk` sets `title: Overview`. UKPF's home page title is the bare site name.

### Skip link

Identical markup in both, first element in `<body>`:

```html
<a class="skip-link" href="#main">Skip to main content</a>
```

UKPF's target is `<main id="main" class="wrap" tabindex="-1">`. MIA's is
`<main id="main" class="wrap">` with no `tabindex`.

### UKPF header and nav, verbatim

```njk
<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="site-header__brand" href="{{ '/' | url }}">{{ site.title }}</a>
    <nav class="site-nav" aria-label="Primary">
      <button class="site-nav__toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
      <ul id="primary-nav" class="site-nav__list">
        {%- for item in site.nav %}
          {%- if item.children %}
          <li class="site-nav__group">
            <details class="nav-group{% if item.children | findBy('url', page.url) %} is-active{% endif %}">
              <summary>{{ item.text }}</summary>
              <ul class="nav-group__menu">
                {%- for child in item.children %}
                <li><a href="{{ child.url | url }}"{% if page.url == child.url %} aria-current="page"{% endif %}>{{ child.text }}</a></li>
                {%- endfor %}
              </ul>
            </details>
          </li>
          {%- else %}
          <li>
            <a href="{{ item.url | url }}"{% if page.url == item.url %} aria-current="page"{% endif %}>{{ item.text }}</a>
          </li>
          {%- endif %}
        {%- endfor %}
      </ul>
    </nav>
  </div>
</header>
```

Nav data is `site.json` `nav`, items shaped `{ "text", "url" }` or `{ "text", "children": [...] }`.
Five top-level items: Dashboard, The data (5 children), Tools (3), Learn (3), Sources. The
mobile collapse depends on `nav.js` and the `.js` class; without JavaScript the button is
hidden and the list renders open.

### MIA header and nav, verbatim

```njk
<header class="site-header">
  <div class="wrap">
    <p class="brand"><a href="/">{{ site.name }}</a></p>
    <nav aria-label="Main">
      <details class="nav-menu">
        <summary>Menu</summary>
        <ul>
          {%- for item in site.nav %}
          <li><a href="{{ item.href }}"{% if page.url == item.href %} aria-current="page"{% endif %}>{{ item.label }}</a></li>
          {%- endfor %}
        </ul>
      </details>
    </nav>
  </div>
</header>
```

Nav data is `site.js` `nav`, items shaped `{ href, label }`. Ten flat items. No JavaScript:
above `40em` the summary is hidden and the list revealed through `::details-content`, guarded
by `@supports selector(details::details-content)`.

Naming is inconsistent between the siblings: `site.title` / `text` / `url` /
`aria-label="Primary"` in UKPF against `site.name` / `label` / `href` / `aria-label="Main"`
in MIA. UKPF pipes internal links through Eleventy's `url` filter (it supports
`PATH_PREFIX`); MIA writes root-relative hrefs directly.

### UKPF footer, verbatim

```njk
<footer class="site-footer">
  <div class="wrap">
    <p>{{ site.title }} is an educational project. Figures show their source and date, and may be revised.</p>
    <p class="site-footer__warn">{{ meta.footerNote }}</p>
    <nav aria-label="Footer"><ul class="site-footer__links"><li><a href="{{ '/about/' | url }}">About &amp; methodology</a></li><li><a href="{{ '/sources/' | url }}">All data sources</a></li><li><a href="{{ '/glossary/' | url }}">Glossary</a></li><li><a href="{{ '/privacy/' | url }}">Privacy</a></li></ul></nav>
    <p>Sister site: <a href="https://ukmigrationexplorer.org" rel="noopener">UK Migration Explorer</a>, a plain-English guide to what UK migration and asylum statistics do, and do not, show.</p>
  </div>
</footer>
```

### MIA footer, verbatim

```njk
<footer class="site-footer">
  <div class="wrap">
    <p>{{ site.strapline }}</p>
    <p>{{ meta.footerNote }}</p>
    <p>Contains public sector information licensed under the
      <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence v3.0</a>.
      <a href="https://github.com/LegendT/UK-Migration-Explorer">Source and data on GitHub</a>.</p>
    <p><strong>Found an error?</strong> Tell us which figure and what you think it should be:
      <a href="https://github.com/LegendT/UK-Migration-Explorer/issues/new">open an issue</a>.
      Every change to a published figure is recorded in the
      <a href="https://github.com/LegendT/UK-Migration-Explorer/blob/main/CHANGELOG.md">public changelog</a>.</p>
  </div>
</footer>
```

### The sister-site block: what actually exists

**There is no "Our other explainers" block in either sibling.** A search of both repositories
for "other explainers", "sister" and the other site's domain found only:

- UKPF footer, every page: a single sentence, "Sister site: UK Migration Explorer, ..."
  (quoted above, confirmed on the live site).
- MIA: no footer link at all. The only reference to UKPF is in the body of `content/about.md`:
  "It is the companion to the [UK Public Finances Explorer](https://ukpublicfinances.org),
  which applies the same method to government debt and borrowing".

So the cross-linking is asymmetric and uses two different words ("Sister site" and
"companion"). A three-site "Our other explainers" block would be new in all three places, and
adding it to the siblings is a change to those repositories that is outside this inspection.

Both footers share one convention worth keeping: `meta.footerNote`, a data-driven caveat
sentence rendered on every page.

---

## 5. Citation and provenance

Both sites use the same core record and the same four confidence levels. MIA's `meta.json`
says its data layer was "modelled on the UK Public Finances Explorer data contract".

Confidence levels (UKPF `src/_data/meta.json`, MIA `data/meta.json`, same four keys):

```json
"official": "Taken directly from an official published release.",
"provisional": "Official but flagged by the publisher as subject to revision.",
"estimated": "An estimate, interpolation, or nowcast, not a published official figure.",
"calculated": "Derived by this site from other figures, such as debt per person."
```

### UKPF

Representative record (`src/_data/dashboard.json`, first metric):

```json
{
  "id": "net-debt",
  "display": "poundsShort",
  "metric_name": "Public sector net debt (excluding public sector banks)",
  "shortLabel": "Public sector net debt",
  "value": 2986,
  "unit": "£ billion",
  "explanation": "The headline measure of how much the UK government owes, after subtracting liquid assets. This is the main measure used in the monthly public finance statistics.",
  "whatThisMeans": "Think of it as everything the government has borrowed and not yet repaid, less the cash it holds. ...",
  "date": "2026-08-31",
  "source_name": "ONS, Public sector finances, UK: August 2026",
  "source_url": "https://www.ons.gov.uk/economy/governmentpublicsectorandtaxes/publicsectorfinance/bulletins/publicsectorfinances/august2026",
  "retrieved_date": "2026-09-22",
  "notes": "£2,985.5bn at end August 2026, the latest published cash figure, ...",
  "confidence_level": "provisional"
}
```

Required by `test/data.test.js`: `metric_name`, `value`, `unit`, `source_name`, `source_url`,
`retrieved_date`, `confidence_level`.

Rendering is by Nunjucks macros in `src/_includes/components/macros.njk`, imported per page
(`{% from "components/macros.njk" import metricCard, sourceNote, caveatBox %}`):

```njk
{% macro dataFreshnessBadge(confidence, date) %}
<span class="badge badge--{{ confidence }}">
  <span class="badge__dot" aria-hidden="true"></span>
  {{ confidence }}{% if date %} · {{ date | timeTag | safe }}{% endif %}
</span>
{% endmacro %}

{% macro sourceNote(record) %}
<p class="source-note">
  Source:
  {% if record.source_url %}<a href="{{ record.source_url }}" rel="noopener">{{ record.source_name }}</a>{% else %}{{ record.source_name }}{% endif %}.
  {% if record.date %}Figure dated {{ record.date | timeTag | safe }}.{% endif %}
  {% if record.retrieved_date %}Retrieved {{ record.retrieved_date | timeTag | safe }}.{% endif %}
  {% if record.confidence_level %}{{ dataFreshnessBadge(record.confidence_level, "") }}{% endif %}
</p>
{% endmacro %}

{% macro caveatBox(text, heading, level) %}
{%- set tag = level or "h2" %}
<div class="caveat" role="note">
  <{{ tag }} class="caveat__heading">{{ heading or "Important" }}</{{ tag }}>
  <p>{{ text }}</p>
</div>
{% endmacro %}

{% macro metricCard(metric, formattedValue, extraClass) %}
<article class="metric-card{% if extraClass %} {{ extraClass }}{% endif %}">
  <h3 class="metric-card__label">{{ metric.shortLabel or metric.metric_name }}</h3>
  <p class="metric-card__value">{{ formattedValue }}</p>
  <p class="metric-card__explain">{{ metric.explanation }}</p>
  {% if metric.whatThisMeans %}
  <details class="metric-card__more">
    <summary>What this means</summary>
    <p>{{ metric.whatThisMeans }}</p>
  </details>
  {% endif %}
  {{ sourceNote(metric) }}
</article>
{% endmacro %}
```

Other macros: `monthlyBody`, `glossaryTerm`, `spendingRow`. Figures in UKPF prose are reached
through template expressions against global data, such as
`(dashboard.metrics | findBy("id", "net-debt")).value`. There is no inline figure token.

### MIA

Representative record (`data/migration.json`, first metric):

```json
{
  "id": "net-migration",
  "metric_name": "Net migration (long-term international migration)",
  "value": 171000,
  "series_ref": "netMigration@2025",
  "unit": "people",
  "date": "2025-12-31",
  "period_label": "year ending December 2025",
  "geography": "United Kingdom",
  "source_name": "ONS, Long-term international migration, provisional: year ending December 2025",
  "source_id": "ons-ltim",
  "source_url": "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration/bulletins/longterminternationalmigrationprovisional/yearendingdecember2025",
  "published_date": "2026-05-21",
  "retrieved_date": "2026-08-11",
  "notes": "Provisional. Nearly halved from the year ending December 2024; lowest since early 2021.",
  "confidence_level": "provisional"
}
```

Fields MIA adds to the UKPF contract: `period_label`, `geography`, `source_id` (joins to
`sources.json`), `published_date`, and optionally `table_reference` (array), `series_ref`, and
`value_type: "range"` with bounds and a null `value`. `date` is "the **end of the period
covered**, never the publication date".

Evidence record (`data/evidence/ons-population-mid-2024.json`), one per figure per release:

```json
{
  "ref": "population/total-uk-population",
  "previous_value": 69281400,
  "value": 69281400,
  "source_url": "https://www.ons.gov.uk/.../annualmidyearpopulationestimates/mid2024",
  "fetched_at": "2026-08-03",
  "quote": "The population of the UK continued to grow in the year to mid-2024, reaching an estimated 69.3 million people (69,281,400)."
}
```

Four rendering routes, all defined in `eleventy.config.js`:

1. **Inline figure in Markdown prose**, by token `{{theme/id}}`, resolved by the
   `resolve-citations` transform after render. Unresolved tokens throw. Output:

   ```js
   return `<span class="figure" data-metric="${escape(ref)}">${escape(metric.value.toLocaleString('en-GB'))}</span>`;
   ```

   There is also a link token, `{{link:/path/#anchor|link text}}`.
2. **Inline figure in a Nunjucks page**, by shortcode `{% figure "migration/total-long-term-immigration" %}`
   or the `metric` filter (`{% set m = card.ref | metric %}`).
3. **Dashboard card**, in `content/index.njk`. `dashboard.json` holds references only:

   ```json
   { "id": "net-migration", "ref": "migration/net-migration", "shortLabel": "Net migration", "whatThisMeans": "..." }
   ```

   rendered as:

   ```njk
   <article class="card">
   <h3>{{ card.shortLabel }}</h3>
   <p class="value" data-metric="{{ card.ref }}">...{{ m.value | number }}... <span class="unit">{{ m.unit }}</span></p>
   <p class="period">{{ m.period_label }}</p>
   <p class="means">{{ card.whatThisMeans }}</p>
   <dl class="source">
     <div><dt>Source</dt> <dd><a href="{{ m.source_url }}">{{ m.source_name }}</a></dd></div>
     <div><dt>Published</dt> <dd>{% if m.published_date %}{{ m.published_date | timeTag | safe }}{% else %}not recorded{% endif %}</dd></div>
     <div><dt>Checked by us</dt> <dd><time class="checked" datetime="{{ m.retrieved_date }}">{{ m.retrieved_date | longDate }}</time></dd></div>
     <div><dt>Confidence</dt> <dd><span class="grade">{{ m.confidence_level }}</span></dd></div>
   </dl>
   </article>
   ```
4. **Citation and provenance blocks**, by shortcode:
   - `{% citation figures, claim %}` calls `citationBlock()` in `lib/citation.mjs`, output
     `<details class="cite"><summary>How to cite this<span class="visually-hidden">: label</span></summary>`
     with one `<li>` per publication (name, tables, "Cited for", "Published", the URL printed as
     its own link text, "Checked by us on") and a closing "Via UK Migration Explorer" line.
     Charts call it automatically.
   - `{% figureProvenance figures %}` calls `provenanceList()` in `lib/provenance.mjs`, output
     `<details class="provenance-block">` with summary "Show each figure's confidence grade and
     the date it was checked" and a `<dl class="provenance">`.
   - `{% claimsUsing refs, claims %}` lists claim checks resting on a page's figures.

   Pages declare the figures they use in front matter (`figures:` list of `theme/id`), and
   the validator and the `figure-currency-audit` transform hold the page to that declaration.

The page footer states figure currency per page, derived not typed:

```njk
<p class="reviewed">This page was last reviewed on {{ last_reviewed | timeTag | safe }}.
{%- if content | carriesAFigure %} Its figures are not a live count;<span class="figure-currency-clause"> every one was checked against its source on or after <time class="figure-currency" datetime="pending">pending</time></span>.{% endif %}</p>
```

The `figure-currency` transform replaces `pending` with the earliest `retrieved_date` on the
page. Every MIA page also carries `last_reviewed` and `review_due` in front matter, and a
passed review date fails the build.

### Wording conventions

| Concept | UKPF | MIA |
| --- | --- | --- |
| When the site checked the source | "Retrieved 22 September 2026" | "Checked by us on 11 August 2026" |
| The period the figure covers | "Figure dated ..." | `period_label`, shown on its own line |
| When the source published | not recorded | "Published ..." |
| Marker name | confidence badge (`.badge`) | confidence grade (`.grade`) |

MIA chose "Checked by us" deliberately: "the bare form does not say who did the checking and
the owner read it as ambiguous".

---

## 6. Charts and tools

### Charts

| | UKPF | MIA |
| --- | --- | --- |
| Where drawn | In the browser, by `src/assets/js/timeline.js` | At build time, by `lib/charts.mjs` |
| Technology | Hand-written inline SVG via `createElementNS`. No library, no canvas | Hand-written SVG strings. No library, no canvas |
| Works without JavaScript | No chart, but the table is server-rendered | Yes, fully |
| Accessible name | Container `<div role="img" aria-label="...">`, the SVG itself `aria-hidden="true"` | `<svg role="img" aria-labelledby aria-describedby>` with `<title>` and `<desc>` |
| Table alternative | `<details class="data-table-wrap" open>` with summary "Show the data as a table", server-rendered | `<details class="chart-data">` with summary "Show the figures behind this chart", closed by default |
| Responsive | One SVG, `viewBox="0 0 760 360"`, scales | Two renderings per chart (`chart-svg--wide`, `chart-svg--narrow`), swapped at `34.5em` with `display: none` |
| Series distinction | Single series | Stroke pattern (`dashed`) plus direct labels, "never by colour alone" |
| Data breaks | Event markers as dashed vertical lines | `breakAfter` draws the methodology break on the chart |

UKPF chart markup (`src/timeline.njk`):

```njk
<figure class="chart">
  <div id="chart" class="chart__canvas" role="img" aria-label="Line chart of UK debt over time. The same data is in the table below.">
  </div>
  <figcaption id="chart-caption" class="chart__caption">
    UK debt over time. <span id="chart-measure-label">Debt as a share of GDP</span>.
  </figcaption>
</figure>
```

Data reaches the script through an embedded JSON block using the `jsonScript` filter:
`<script id="timeline-data" type="application/json">`. UKPF also has CSS proportion bars
(`.compare__bar`) on the debt-in-context page.

MIA chart markup (`lib/charts.mjs`, `lineChart`):

```html
<figure class="chart" id="${id}">
  <figcaption>
    <h3>${title}</h3>
    <p class="chart-summary">${summary}</p>
  </figcaption>
  <div class="scroll-x">${svg(wide)}${svg(narrow)}</div>
  <p class="chart-note">${note}</p>
  <details class="chart-data">
    <summary>Show the figures behind this chart<span class="visually-hidden">: ${title}</span></summary>
    <div class="scroll-x"><table><caption>${title} (${unit})</caption>...</table></div>
  </details>
  <p class="chart-source">Source: <a href="${sourceUrl}">${source}</a>. The vertical axis starts at zero.</p>
  ${citationBlock(...)}
</figure>
```

Called from a page as `{% lineChart { id, series, title, summary, unit, source, sourceUrl, breakAfter, note } %}`
or `{% barChart {...} %}`. Rules enforced in code: a bar carrying a literal `value` throws
("Cite a record with ref instead"); a typed source line naming a publication the points do
not cite is refused (`checkSourceLine`); axes start at zero. MIA chart principles
(`docs/foundation.md` section 10) include "Do not use red/green moral coding", "Give users
the table beneath important charts", "Always allow users to see the source and period
without hovering" and "Do not create pseudo-live counters".

Both wrap scrolling tables as `<div tabindex="0" role="region" aria-label="...">`. UKPF writes
that by hand; MIA's `scrollable-regions` transform adds it and names it from the caption or
the heading above.

### Interactive tools (UKPF only; MIA has none)

Structure, the same for the big numbers translator and the budget simulator:

1. **Data** in `src/_data/assumptions.json`, with its own `lastUpdated` per tool.
2. **Template** (`src/big-numbers.njk`, `src/budget-simulator.njk`) renders the form, an empty
   results container, a table, a `caveatBox`, a `<noscript>` notice, and the assumptions as
   `<script id="translator-assumptions" type="application/json">`.
3. **Calculation** in `src/assets/js/lib/calc.js`: pure ESM, "No DOM and no formatting". Exports:

   ```js
   export function translateAmount(billions, a)        // returns [{ label, kind, value }]
   export function simulateBudget(cfg, spendValues, taxPoints)  // returns { totalSpending, totalRevenue, borrowing, trajectory }
   ```

   `kind` (`gbp`, `pct`, `millions`, `months`) tells the caller how to format.
4. **Presentation** in `src/assets/js/big-numbers.js` and `budget-simulator.js`, loaded with
   `<script type="module">`, importing from `./lib/calc.js`. They read the JSON block, format
   with `Intl.NumberFormat("en-GB")`, and write the DOM.
5. **Tests** in `test/calc.test.js` import the same module from `../src/assets/js/lib/calc.js`
   and run under `node --test`. Fixtures are "Synthetic round-number fixtures, deliberately not
   the site's live figures".

Accessibility patterns in the tools, all worth copying:

- The results grid is not a live region. A separate visually hidden `<p role="status">` carries
  one debounced announcement (400 ms translator, 500 ms simulator), and the first render on
  page load is not announced.
- Validation errors wait for blur or submit. The error paragraph has `role="alert"` and is
  linked through `aria-describedby` only while showing.
- Range inputs get `aria-valuetext` ("£222 billion", "20%") and a visible `<output>`.
- The simulator container is a `<div>`, not a `<form>`: "pa11y rightly refuses a form with no
  submit button (WCAG 3.2.2, H32.2)".
- Injected cards use `dl`/`dt`/`dd`, matching the server-rendered ones.
- `yearOf` deliberately throws on malformed data, "Netlify deploys run the build alone, so
  this is the only check between malformed data and a live page".

Weakness to note: neither tool has a no-JavaScript result. Both show a `<noscript>` notice
pointing elsewhere. Under the owner's progressive-enhancement rule, a pension tool could do
better by server-rendering a default worked example.

---

## 7. Checks

### UKPF

- **Unit and data tests**: `node --test 'test/**/*.test.js'`, Node's built-in runner, no test
  dependency. 23 tests at the last handoff (repository's own count, not run here).
  - `test/data.test.js`: required metrics, provenance fields, ISO date shape, ascending
    series, valid confidence levels, cross-file consistency ("no silent drift"), and "every
    human-checked date is current" (a 45-day limit per `UPDATING-DATA.md`).
  - `test/calc.test.js`: tool maths.
  - `test/lastmod.test.js`: no page dated by file timestamp; any page with `canonicalUrl` must
    be listed in `.pa11yci.json`.
  - `test/no-emdash.test.js`: no U+2014, literal or URL-encoded, in `src`, `docs` or `README.md`.
- **Accessibility**: pa11y-ci at `WCAG2AA`, routes taken from the built `sitemap.xml` with
  `--sitemap-find` / `--sitemap-replace`, plus two URLs in `.pa11yci.json` that the sitemap
  omits (`/404.html`, `/monthly/`). 21 routes at the last handoff.
- **Link check**: none.
- **Metadata check**: none beyond `lastmod.test.js`.
- **CI**: none. Netlify runs `npm run build` only, so tests do not gate a deploy. The README
  and handoff treat `npm test` and `npm run a11y:all` as things run by hand before a merge.
- **Release watch**: none in the repository. Two report-only cloud routines are scheduled for
  21 and 29 October 2026 (per `HANDOFF.md`).

### MIA

Nine scripts in `scripts/`, all plain Node `.mjs`, no test framework:

| Script | Role | Gates |
| --- | --- | --- |
| `validate-data.mjs` | Data contract: metadata, dates, catalogue links, one vintage per series, `series_ref` agreement, staleness against cadence | Yes (`npm test`, Netlify, CI) |
| `validate-content.mjs` | Tokens resolve, review dates, mirror claims paired, language rules, no em-dashes, no figure written longhand | Yes (`npm test`, Netlify, CI) |
| `check-evidence.mjs` | Every changed or new figure against `origin/main` carries a quote from a fetched source | CI |
| `check-build.mjs` | The built HTML: anchors, links, sitemap against pages both ways, robots Admits line, structured data origins, heading levels, markup conventions | Yes (part of `npm run build`) |
| `check-a11y-dark.mjs` | pa11y again with `--force-dark-mode`, same URL list | CI (`npm run a11y`) |
| `check-pipeline.mjs` | That `npm run validate`, the workflow and `scripts/` name the same checks | CI |
| `check-fetch-retry.mjs` | Unit probe of the retry logic, no network | CI |
| `check-sources.mjs` | Every source URL resolves | No, `continue-on-error` |
| `check-releases.mjs` | Newer edition, or a correction inside the cited one | No, reports and opens an issue |

- **Accessibility**: pa11y-ci at `WCAG2AA` over a hand-kept list of 25 URLs in
  `.pa11yci.json`, then the dark pass. Not part of `npm run build`, so it "does not gate the
  Netlify deploy".
- **CI**: `.github/workflows/validate-data.yml`, on push to `main`, pull requests, manual
  dispatch, a weekly cron (`0 7 * * 1`) and a monthly cron (`0 7 1 * *`). Node 22, `npm ci`,
  then the steps in the order above. The monthly run opens a single issue titled "Monthly
  check: run docs/MONTHLY-CHECK.md".

Both pa11y configs share the same defaults:

```json
"defaults": {
  "standard": "WCAG2AA",
  "timeout": 30000,
  "wait": 1000,
  "chromeLaunchConfig": { "args": ["--no-sandbox", "--disable-setuid-sandbox"] }
}
```

A caution for the new site: pa11y's `WCAG2AA` standard is HTML_CodeSniffer's WCAG 2.1
ruleset. It does not test the 2.2 additions (target size 2.5.8, focus not obscured 2.4.11,
dragging 2.5.7 and others), whatever the script names say. Both READMEs describe pa11y as "a
floor, not a verdict" and MIA records that it "flagged none of the accessibility defects that
were found by hand". Neither sibling runs axe. The owner's global rule names
`npx @axe-core/cli` as the fallback runner.

---

## 8. Sitemap and robots

### Site URL

- UKPF: `src/_data/site.json`, `"url": "https://ukpublicfinances.org"` (no trailing slash).
- MIA: `content/_data/site.js`, `url: 'https://ukmigrationexplorer.org'` (no trailing slash).

Both are hard-coded. Neither reads the URL from an environment variable.

### Environment-specific noindex

**Neither sibling has any.** A search of both repositories for `noindex`, `X-Robots`,
`DEPLOY_PRIME` and `process.env` found only UKPF's `pathPrefix: process.env.PATH_PREFIX || "/"`
and MIA's `EVIDENCE_BASE` in a check script. No live page carries a `<meta name="robots">`.
Netlify deploy previews of both sites are therefore served with production canonicals and no
noindex of their own. (Netlify may add its own `X-Robots-Tag` to preview hosts; that was not
checked.) MIA's pre-launch approach was a `robots.txt` that disallowed everything plus a
visible banner, both removed at launch. If the new site wants preview-specific noindex it has
no sibling precedent to copy.

### UKPF sitemap (`src/sitemap.njk`)

Generated from `collections.all`, restricted to URLs ending `/`, skipping pages that
canonicalise elsewhere, then the monthly permalinks from data. `lastmod` comes only from
`dataUpdated`, which pages compute from the data they render:

```njk
eleventyComputed:
  dataUpdated: "{{ [dashboard.lastUpdated, assumptions.translator.lastUpdated] | latestOf }}"
```

```njk
{%- if item.data.dataUpdated %}
<lastmod>{{ item.data.dataUpdated | isoDate }}</lastmod>
{%- endif %}
```

The reasoning, in the template: "Falling back to the file date restamped every page on every
deploy, because Netlify builds from a fresh clone. No date is better than a date that is not
true." `test/lastmod.test.js` refuses `page.date` or `item.date` in either the sitemap or the
JSON-LD. Live: 19 URLs, 16 with `lastmod`.

Known open item in `NEXT-STEPS.md`: three pages (`deficit-vs-debt`, `privacy`, `glossary`)
carry no date, and "no date" currently means both "deliberately undated" and "nobody wired it
up".

### MIA sitemap (`content/sitemap.njk`)

```njk
{%- for item in collections.all | sort(false, false, "url") %}
{%- if item.outputPath and item.outputPath.endsWith(".html") %}
  <url><loc>{{ site.url }}{{ item.url }}</loc></url>
{%- endif %}
{%- endfor %}
```

No `lastmod`, deliberately: "The only per-page date this site holds is last_reviewed, which
records what a review READ, not when the file changed". Sorted by URL so two builds of one
commit diff cleanly. `check-build.mjs` compares the sitemap against the pages written, in both
directions. Live: 24 URLs, no `lastmod`.

### robots.txt

UKPF generates it from `src/robots.njk` (so the sitemap URL comes from `site.url`). MIA ships
a static `content/robots.txt` by passthrough copy, with the sitemap URL typed.

**The two siblings take opposite positions on AI training crawlers.** UKPF allows GPTBot,
ClaudeBot and Google-Extended by name. MIA refuses the same three. The new site has to choose.

#### UKPF live robots.txt, verbatim (fetched 29 September 2026, HTTP 200)

```
# UK Public Finances Explorer
# Open to all crawlers, including AI/LLM crawlers. Discovery is the point.

User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://ukpublicfinances.org/sitemap.xml
```

#### MIA live robots.txt, verbatim (fetched 29 September 2026, HTTP 200, 8,182 bytes, byte-identical to `content/robots.txt` by `diff`)

```
# UK Migration Explorer. https://ukmigrationexplorer.org
#
# Backlog call 26, decided 4 August 2026: allow retrieval bots that emit a linked citation,
# refuse crawlers whose stated purpose is collecting training data. It is not binary and it
# is not a copyright position. Retrieval citation is the most likely route to success
# measure 2, and refusing keeps that option open where allowing does not.
#
# The UX review asked for this file to be WRITTEN rather than only deleted, which is why it
# still exists after launch. Its predecessor disallowed everything, because the pre-publication
# review the sources page promises had not been recorded as passed.
#
# Search engines and retrieval assistants are permitted by the wildcard group below and are not
# given a named allow group, because that would be a second statement of the same decision. The
# line below is the ONLY list of them, and scripts/check-build.mjs parses it out of this file and
# refuses a build that puts any of them in a group disallowing everything. Edit the line, not a
# copy of it. As at 5 August 2026:
# Admits: Googlebot, Bingbot, DuckDuckBot, Applebot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, DuckAssistBot
#
# THE REFUSAL LIST BELOW IS A SNAPSHOT AND WILL GO STALE. It names the tokens that keep this
# site's content out of model training: crawlers whose operators document them as gathering data
# to train, AND the control tokens some operators use instead, which crawl nothing and only say
# how data their sibling already took may be used. Google-Extended, Applebot-Extended and
# Webzio-Extended are the second kind. Apple states it outright, "Applebot-Extended does not crawl
# webpages", and Webz.io describes Webzio-extended as taking "the data collected by Webzio" and
# "tagging the data as usable or not usable for AI/ML training". A header saying every entry
# gathers data was false of all three; it said that until 11 August 2026, and this sentence named
# two of the three for several hours after, which is the same enumeration defect one layer down.
# A crawler that is not on the list is
# allowed, which is the safe direction for this site and means the list has to be re-read
# rather than assumed. Check it against the operators' own published documentation. Every
# omission below is deliberate. **FIVE ENTRIES ARE REFUSED ON SOMETHING OTHER THAN THEIR
# OPERATOR'S OWN WORDS, and saying which is the only honest version of this list.** CCBot: Common
# Crawl's page documents an open repository "universally accessible and analyzable by anyone" and
# says nothing about training, so it is refused for what its corpus feeds. Bytespider: ByteDance's
# Toutiao webmaster platform documents it as a SEARCH crawler, "帮助Bytespider收录您的网站", and no
# ByteDance page stating a training purpose was found. cohere-ai: Cohere's crawler page says "We
# do not use Cohere bots or user agents for the purpose of crawling or scraping web content to
# train generative AI foundation models at this time" and its bot table reads N/A, so this refuses
# a crawler its operator says it does not run. PanguBot: Huawei's documented crawler is PetalBot,
# and "PanguBot" is a Huawei Cloud chatbot product rather than a crawler. Timpibot: Timpi
# documents its crawler as the "Collector" and nowhere uses this name, though the user agent is
# observed in the wild. **All five stay refused, because refusing costs this site nothing and
# admitting a training crawler by mistake costs it the thing it is protecting.** What changed on
# 11 August 2026 is that the list stopped implying an operator said something it did not.
# **THIS PARAGRAPH SAID "CCBot IS THE ONE ENTRY" EARLIER THE SAME DAY.** It was written after
# checking some of the list and before checking the rest, which is the shape of every other
# correction in this file.
# **APPLEBOT IS ADMITTED ON APPLE'S OWN OPT-OUT, NOT ON ITS PURPOSE.** Apple documents that
# "the data crawled by Applebot may also be used to help train Apple foundation models" and that
# publishers opt out "by disallowing Applebot-Extended", which this file does. Until 11 August
# 2026 this said Apple described Applebot as serving answers rather than training. Apple says no
# such thing, and the opt-out is the whole of why admitting it is consistent with call 26.
# **AMAZONBOT IS REFUSED, decided by the owner on 11 August 2026.** Until that day this named it
# beside Applebot as serving answers rather than training. Amazon's own page reads "Amazonbot is
# used to improve our products and services. This helps us provide more accurate information to
# customers and may be used to train Amazon AI models", so the reason for leaving it off had gone
# and the test above reached it. **Amazon's answer to publishers who want the search half without
# the training half is two other tokens rather than an opt-out**: Amzn-SearchBot and Amzn-User,
# both documented as not crawling content for generative AI training. Neither is named on the
# Admits line, because that line is the named list rather than everything the open wildcard group
# lets through, and adding them is a separate call this file has not been given.
# FacebookExternalHit fetches a
# page to build the link preview shown when somebody shares it, which Meta documents as gathering
# "the title, description and thumbnail image": distribution rather than training, and a thing this
# site wants. THAT SENTENCE NAMED "FacebookBot" UNTIL 11 AUGUST 2026 AND WAS FALSE. Meta's crawler
# documentation does not mention FacebookBot at all, and attributes link previews to
# FacebookExternalHit, so the line named a token that does nothing while the crawler actually doing
# the work went unnamed. Nothing behaved differently, because no Meta crawler answers to the name
# this file used; what was wrong was the explanation, on a site whose product is explanations. It
# was caught by doing what the line above tells the reader to do.
# **Diffbot is not refused and its operator gives a better reason than this file did.** It says
# outright "Diffbot does not crawl pages for training generative AI foundation models" and
# describes citing what it finds, so it is the admit class rather than merely a data seller.
# **WEBZIO IS REFUSED, decided by the owner on 11 August 2026, and it goes further than the
# training test above.** Webz.io's own page names its current pair as Webzio, which "crawls
# websites", and Webzio-extended, which takes "the data collected by Webzio" and tags it "as
# usable or not usable for AI/ML training". So refusing Webzio-extended alone is the documented
# consent route and would leave the crawling in place; refusing Webzio stops the collection. That
# is a decision about a data broker rather than about a model trainer, and this file says so
# rather than filing it under a test it does not meet. Until that decision Webzio was named
# nowhere here while its sibling was refused, which was a gap rather than a choice.
# **Omgilibot is refused with it**, being the retired name of the same company's crawler and still
# sent: Webz.io writes "Omgilibot served us well" in the past tense. Refusing one and not the other
# would have left Webz.io refused under its current name and admitted under its old one, which is
# the whole of what the Webzio decision was for. **That leaves "sells web data" as a ground this
# file still does not refuse on by itself**: Diffbot stays admitted on its operator's own words
# that it "does not crawl pages for training generative AI foundation models", and the Webz.io pair
# is refused for collection its own consent token exists to gate rather than for being a broker.

User-agent: *
Disallow:

# Training data collection. Refused under call 26.
User-agent: Amazonbot
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: Bytespider
User-agent: meta-externalagent
User-agent: cohere-ai
User-agent: AI2Bot
User-agent: PanguBot
User-agent: Timpibot
User-agent: Omgilibot
User-agent: Webzio
User-agent: Webzio-Extended
Disallow: /

Sitemap: https://ukmigrationexplorer.org/sitemap.xml
```

The claims that file makes about what each operator documents were not verified here.

UKPF also publishes `/llms.txt` (from `src/llms.njk`) and an Atom feed at `/feed.xml`. MIA
has neither.

---

## 9. Lessons, conventions and known defects

### Conventions both siblings enforce

- **British English.** **No em-dashes** in source or docs, enforced by a test in both
  (`test/no-emdash.test.js`; `validate-content.mjs`). En-dashes are allowed in numeric ranges.
  No emoji.
- **No figure hard-coded in a template or in prose.** Data files are the single source of
  truth. MIA goes further: `dashboard.json` "holds no values", and a figure also published as
  a series point declares `series_ref` so the two copies cannot drift.
- **Four confidence levels**: `official`, `provisional`, `estimated`, `calculated`.
- **A date the site did not have is worse than no date.** Filters return empty rather than
  falling back to today or the file timestamp.
- **Editorial stance**: neutral, plain English, facts separated from interpretation, no
  party-political blame, no pseudo-live counters. UKPF follows the GOV.UK content style guide.
- **Cookieless analytics** (Cloudflare), no consent banner, a privacy page (UKPF).
- **Counts of the project's own work are not typed into documents.** MIA's README repeats this
  many times after being wrong repeatedly: the run prints the count.

### Markup conventions (the same checklist in both READMEs)

- A headline figure with explanation and source is an `article` with an `h3`.
- A label with one value is a `dl` of `dt`/`dd`, label first, including in scripts that
  inject cards.
- A caveat or correction is a `div` with `role="note"` and a real heading, not an `aside`.
- `section` with `aria-labelledby` only where a block needs a heading the design hides or is
  a distinct labelled region such as a tool (UKPF); nowhere (MIA).
- Scrollable table wrappers keep `tabindex="0"`, `role="region"` and an accessible name.
- ARIA never repeats a name native HTML already gives.
- Abbreviations are expanded in the glossary, not inline; no `abbr`.
- Dates a template prints go through `timeTag`, so they carry `datetime`.

MIA checks five of these mechanically in `check-build.mjs`; UKPF checks none of them
mechanically.

### Lessons recorded in UKPF (`HANDOFF.md`, `docs/NEXT-STEPS.md`, `docs/UPDATING-DATA.md`)

- "Name the exact measure. Most errors come from a figure that is self-consistent but the
  wrong measure or year".
- "Take a published ratio from its publisher rather than dividing it yourself."
- "The identity tests cannot catch this class of error, because a fabricated figure satisfies
  the identity perfectly." A derived total revenue figure "had been reverse-engineered to make
  the identity hold and passed every test for weeks".
- "`npm test` proves the figures are consistent, not current." Nothing in UKPF watches
  sources for a new release.
- An append-only habit on a time series let a row sit £28bn out for a year; reconcile the back
  series on revision releases.
- A `form` around sliders with no submit button fails pa11y (WCAG 3.2.2), so that container
  stays a `div`.
- Per-tool `lastUpdated` so "editing one tool does not restamp the pages that render the other".
- A refresh is done "when every figure traces to a named publisher and a named vintage".
- Mobile viewport was not rendered in the last CSS change "because the automation browser
  would not resize below 1100 wide".

### UKPF known defects relevant to a pension site

- `spendingComparisons.json` "still declares `fiscalYear: 2025-26` and the site presents it as
  the current year, five months into 2026-27", and mixes vintages. The **state pension record
  is part of this**: £146bn, a 2025-26 forecast from "DWP benefit expenditure tables / OBR
  November 2025", retrieved 11 June 2026, graded `official` although its own notes call it a
  forecast. The new site should source its own figure and not inherit this one.
- The pre-2015 timeline rows are on an undetermined measure.
- The README says "Requires Node.js 18+" while the project pins Node 24; Eleventy 3 itself
  requires Node 18 or later, so this is not wrong, only loose.

### Lessons recorded in MIA (`README.md`, `docs/HANDOFF.md`)

- "A checker here has repeatedly passed while a real defect shipped, and every instance had
  one shape: the check verified a property of the *source or the declaration* rather than the
  property a reader depends on". Hence `check-build.mjs` checks the built site.
- "Negative-test every new check" and "Probe a check by DELETING what it guards, not only by
  corrupting it."
- "`npm run validate` passing does not mean the site builds."
- "Research subagents must quote a fetched URL and verbatim text per figure." Eight fabricated
  figures once reached the repository from a research subagent; `data/evidence/` and
  `check-evidence.mjs` exist because of it.
- "Open the primary table, not the summary page."
- "One vintage per series": refresh the whole array each release, never append.
- ONS throttles anonymous datacentre traffic: retry HTTP 429 with backoff and send a
  `User-Agent`. Commons Library hosts answer Node `fetch` with 403 but answer `curl` over
  HTTP/1.1.
- "Render with a real layout viewport. Headless Chrome's `--window-size` clamps the layout".
  A long unbroken string pushed a page 54px sideways at 320px; `overflow-wrap: anywhere` on
  printed URLs is load-bearing.
- "Beware a rule that reaches inside a utility class."
- "A SECOND CLONE SWALLOWS A PUSH AND REPORTS SUCCESS."
- "Do not fix by bulk substitution."
- "A second model has found the most serious defect in every piece of work it has read here
  ... It is also wrong about roughly one finding in six, so verify each before acting."
- pa11y never looked at the dark theme until `check-a11y-dark.mjs` existed, because headless
  Chrome answers `prefers-color-scheme: dark` with no.
- "Prose about figures is unprotected. Nothing verifies that a chart summary describes the
  data it sits beside."
- "No real screen reader has been run over the pages." Print rules "have still not been
  checked in a real print preview."

### A process warning from MIA's own documents

MIA's documentation is very large: `docs/BACKLOG.md` 3,192 lines, `docs/HANDOFF.md` 2,191,
`docs/PRE-LAUNCH-AUDIT.md` 1,681, `CHANGELOG.md` 185 KB, a 51 KB config of which most is
comment, and a `robots.txt` that is 8 KB of commentary around 20 lines of rules. That is the
pattern the owner's global instructions now warn against ("Past roughly 500 lines a working
document has become a system"). The conventions are worth inheriting; the document volume is
not. UKPF's documents are an order of magnitude smaller and cover the same ground.

### What MIA says about UKPF as a precedent

"UK Public Finances is a precedent for grouping a hierarchy, not a working precedent for a
no-JavaScript mobile nav". MIA's `<details>` nav is the no-JavaScript precedent.

---

## 10. Live site checks

All fetched 29 September 2026, 08:22 UTC, with `curl -L`. All returned HTTP 200 with no
redirect. No page carries a `<meta name="robots">`. Interactive behaviour was not exercised:
these are readings of the served HTML, not of a browser session.

| URL | HTTP | `<title>` | Main heading (`h1`) |
| --- | --- | --- | --- |
| https://ukpublicfinances.org/ | 200 | UK Public Finances Explorer | UK Public Finances Explorer |
| https://ukmigrationexplorer.org/ | 200 | Overview \| UK Migration Explorer | UK migration statistics are often discussed as if they are one number. They are not. |
| https://ukpublicfinances.org/budget-simulator/ | 200 | Budget simulator \| UK Public Finances Explorer | Budget simulator |
| https://ukpublicfinances.org/deficit-vs-debt/ | 200 | Debt vs deficit \| UK Public Finances Explorer | Debt vs deficit, in plain English |
| https://ukpublicfinances.org/big-numbers/ | 200 | Big numbers translator \| UK Public Finances Explorer | Big numbers translator |
| https://ukmigrationexplorer.org/migration/ | 200 | Migration \| UK Migration Explorer | Migration |
| https://ukmigrationexplorer.org/common-claims/immigrants-pay-far-more-than-they-cost/ | 200 | Claim checked: Immigrants pay more in tax than they cost. \| UK Migration Explorer | The claim: Immigrants pay more in tax than they cost. ("The claim: " is visually hidden) |
| https://ukpublicfinances.org/robots.txt | 200 | n/a | n/a |
| https://ukmigrationexplorer.org/robots.txt | 200 | n/a | n/a |

### Summaries and stated limitations

**UKPF home.** A dashboard of five headline figures for August 2026 (net debt, debt as a share
of GDP, debt per person, annual debt interest, monthly borrowing), each with an explanation,
source note and confidence badge, followed by eleven links to the rest of the site. Stated
limitation: figures "are provisional and routinely revised", and monthly borrowing "should not
be multiplied up to estimate a year".

**MIA home.** Three panels setting out distinctions (migration is not asylum, net migration is
not arrivals, a visa granted is not a person arriving), eight headline cards each with period,
source, publication date, checked date and confidence grade, a generated list of the periods
each card covers, and three claim checks. Stated limitation: the figures do not share a period
or a unit, and comparing across them "is not valid".

**Budget simulator.** Five spending sliders (Health, Education, Defence, Welfare excluding
pension, **State pension**, the last at a £146bn baseline with a range of £73bn to £219bn) and
three tax-rate sliders, showing total spending, revenue, borrowing and a ten-year debt path.
Stated limitation, as a heading: "This is a teaching model, not a forecast", "static,
first-round effects only", with growth, behavioural responses and inflation not modelled and a
round 4% assumed interest rate. It needs JavaScript. *Suitability for a pension link*: it is a
whole-budget toy. It treats the state pension as one number to slide and says nothing about
the triple lock, entitlement, State Pension age or demographics. A link should be framed as
"see the state pension beside other spending", not as a pension model. Note the welfare slider
is labelled "excl. pension" so the two do not double count.

**Debt vs deficit.** A prose explainer defining debt, deficit, borrowing, GDP, gilts and debt
interest, then who lends to the government, why debt-to-GDP and interest rates matter, and
where the household analogy helps and breaks. Stated limitation: the household comparison "is
a starting point for intuition, not an accurate model of government finance". It carries no
figures and no date, and has `FAQPage` JSON-LD. *Suitability*: a sound target for a link
explaining stock against flow. It does not mention pensions, the National Insurance Fund or
unfunded liabilities.

**Migration page.** Net migration 2012 to 2025 as a line chart with the June 2021 methodology
break drawn on it, the two gross flows, the reason breakdown for non-EU+ arrivals, why ONS and
Home Office figures never match, and how far estimates have been revised (the 2022 estimate
moved from 606,000 to 891,000). Stated limitations: counts only moves intended to last 12
months or more, estimates are provisional, points either side of June 2021 are not like for
like, and the series is calendar-year so it cannot show the year-ending-March 2023 peak. Latest
figure is 171,000 for the year ending December 2025. *Suitability*: good for a link about
migration as a demographic input. It contains no age breakdown, no working-age or dependency
figures and no population projection, so it cannot support a claim about migration's effect on
the pensioner-to-worker ratio.

**Claim page, "Immigrants pay more in tax than they cost".** Short answer: "Not established as
a general claim", because pre-Brexit studies find effects under 1% of GDP in either direction
and none covers the post-Brexit system. It discusses the OBR lifetime scenario as "this site's
own reading of that chart at age 82", pairs itself with the mirror claim, and carries a dated
correction (27 July 2026). Stated limitations: "This is the most contested area covered by
this site"; reviewed 27 July 2026, figures checked 11 August 2026. *Suitability*: relevant to a
pension page only through the lifetime fiscal profile. It does not mention pensions or State
Pension age directly, and the age-82 endpoint is the site's choice. Link to it as evidence
that the question is unsettled, not as a source for a number.

### Big numbers translator: inputs and definitions

One user input: **"Amount in £ billion"**, a number field (`min="0"`, `step="0.1"`, default
`50`). Validation accepts any finite number of zero or more; the error text is "Enter a
positive number." Results update on input, and a Convert button submits.

Fixed assumptions, from `src/_data/assumptions.json` `translator` (`lastUpdated` 2026-09-22)
and `spendingComparisons.json`, confirmed identical in the live page's embedded JSON:

| Key | Value | Definition used |
| --- | --- | --- |
| `population` | 69,500,000 | UK population |
| `adults` | 55,000,000 | UK adults aged 18 and over, on the mid-2024 age breakdown, one vintage behind population |
| `taxpayers` | 36,700,000 | Income tax payers (HMRC) |
| `gdpGbpBillion` | 3,183 | GDP implied by the published debt-to-GDP ratio, not a published GDP release |
| `annualBorrowingGbpBillion` | 134 | Financial year 2025-26 public sector net borrowing |
| `annualDebtInterestGbpBillion` | 110 | OBR March 2026 forecast debt interest |
| Budget: NHS / health | 222 | £ billion per year |
| Budget: Education | 126 | |
| Budget: Defence | 62 | MoD Total DEL, not the NATO definition |
| Budget: State pension | 146 | 2025-26 forecast |
| Budget: Welfare and social protection (total) | 334 | Includes the state pension shown separately |
| Budget: Central government receipts | 1,122 | Labelled without "spending" |

Calculations (`translateAmount` in `src/assets/js/lib/calc.js`), thirteen output rows:

```js
{ label: "Per person in the UK", kind: "gbp", value: pounds / a.population },
{ label: "Per adult (18 and over)", kind: "gbp", value: pounds / a.adults },
{ label: "Per income tax payer", kind: "gbp", value: pounds / a.taxpayers },
{ label: "In millions", kind: "millions", value: billions * 1000 },
{ label: "Share of GDP", kind: "pct", value: (billions / a.gdpGbpBillion) * 100 },
{ label: "Share of a year's borrowing", kind: "pct", value: (billions / a.annualBorrowingGbpBillion) * 100 },
{ label: "Months of debt interest", kind: "months", value: (billions / a.annualDebtInterestGbpBillion) * 12 },
// then one "Share of annual <name> spending" row per budget
```

Stated limitations, from the live "How to read these" box: "Comparisons show scale only. They
do not imply one budget could be swapped for another, or that debt could be redirected." Share
of GDP "will not exactly match a ratio the ONS publishes itself"; the year's borrowing shows as
4.2% of GDP against the published 4.4%.

Things the page does not say that matter for a link from a pension site:

- The per-person figures are simple division. They are not what anyone pays or receives.
- There is no per-pensioner or per-recipient denominator, and no per-household figure.
- The tool needs JavaScript; without it the reader gets a notice and a link to the sources page.
- Individual assumptions are not cited on the page itself; the sources sit in the data files
  and on `/sources/`.
- The input does not accept a query-string value, so a link cannot pre-fill an amount (read
  from `big-numbers.js`, which reads only the input field).

---

## 11. Implications for the new site

These are inferences from the above, offered as recommendations, not findings.

- **Stack**: Eleventy 3.1.x, Nunjucks, ESM config, vanilla JavaScript, one stylesheet, system
  fonts, JSON data files, Netlify, Cloudflare Web Analytics. Pick one Node version; the
  siblings disagree (24 and 22).
- **Data contract**: take MIA's superset (`period_label`, `geography`, `source_id`,
  `published_date`, `table_reference`) over UKPF's smaller one. It is backward compatible with
  UKPF's field names.
- **Tools**: take UKPF's pattern (pure `lib/calc.js`, `node --test`, JSON assumptions block,
  debounced status region).
- **Charts**: take MIA's build-time SVG, since it works without JavaScript and meets the
  progressive-enhancement rule; UKPF's client-side chart does not.
- **Checks**: run tests before the build in `netlify.toml` as MIA does; check the built
  output, not only the source; add an axe run, because pa11y's ruleset stops at WCAG 2.1.
- **Decisions the siblings do not settle**, because they disagree: dark mode, focus style,
  header treatment, brand colour, share image, AI-crawler policy in `robots.txt`, sitemap
  `lastmod`, nav data field names, and the wording for the checked date ("Retrieved" against
  "Checked by us").
- **No precedent exists** for an "Our other explainers" block or for preview-only noindex.
