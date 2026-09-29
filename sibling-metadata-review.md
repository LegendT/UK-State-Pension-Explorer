# Sibling-site metadata review

Inspected: 29 September 2026. Purpose: inform the UK State Pension Explorer build.

## What was checked

Live HTML, head metadata and embedded structured data on six pages:

- UK Public Finances Explorer: [homepage](https://ukpublicfinances.org/), [budget simulator](https://ukpublicfinances.org/budget-simulator/), [August 2026 monthly update](https://ukpublicfinances.org/monthly/2026-08/).
- UK Migration Explorer: [homepage](https://ukmigrationexplorer.org/), [fiscal-contribution claim](https://ukmigrationexplorer.org/common-claims/immigrants-pay-far-more-than-they-cost/), [sources and method](https://ukmigrationexplorer.org/sources-and-method/).
- Both sites' live XML sitemaps and robots files, linked below.

All six sampled pages returned HTTP 200, had distinct HTML titles and descriptions, declared en-GB and supplied an absolute self-referencing canonical URL. Their Open Graph locale was en_GB. Embedded JSON-LD blocks parsed successfully where supplied.

## Useful patterns and opportunities

| Observation | Lesson for the pension site |
|---|---|
| The finance simulator's description explicitly identifies a simplified educational model. | Limitations must travel with search results and shared links, particularly for hypothetical pension comparisons. |
| Finance supplies Open Graph image metadata, image dimensions and image descriptions, plus explicit Twitter card fields. | Adopt complete, consistent card metadata and inspect actual rendered previews. Use tool-specific wording where generic branding might obscure that an output is illustrative. |
| The migration claim page puts its verdict first in its sharing title. | A detached preview should communicate the assessment, rather than simply repeat a disputed assertion. Keep essential qualifications concise enough to survive likely truncation. |
| Migration's homepage sharing title is simply “Overview”; sampled migration pages supply summary-card metadata without an Open Graph image. | Give the pension homepage a descriptive sharing title and deliberate visual identity. An absent share image is an opportunity, not evidence of a broken page. |
| Finance identifies website, publisher and page entities; its monthly update additionally uses article and FAQ structured data. | Choose types that match each pension page. Do not copy news or FAQ markup merely because a sibling uses it. |
| Both sites describe actual data compilations in Dataset metadata, with download distributions; migration links its own reuse explanation. | Dataset metadata should describe real available data, its provenance and appropriate licence. Compiling official statistics does not make the publisher an official statistics body. |

## Sitemaps and crawler policies

The [finance sitemap](https://ukpublicfinances.org/sitemap.xml) contains 19 unique URLs, with modification dates on 16. The [migration sitemap](https://ukmigrationexplorer.org/sitemap.xml) contains 24 unique URLs and no modification dates. Both parsed as sitemap XML and were referenced by their robots files. Neither contained duplicate URLs within the inspected file.

Missing modification dates are not inherently an error. For pensions, maintain real substantive-change dates and include them when reliable. This review did not verify the editing history behind the finance dates. Google's [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) requires accurate dates when used; sitemap inclusion does not guarantee indexing.

The [finance robots file](https://ukpublicfinances.org/robots.txt) allows general crawling and explicitly permits several AI agents/control tokens. The [migration robots file](https://ukmigrationexplorer.org/robots.txt) allows general crawling but blocks a list of AI/data-collection agents/control tokens. These are materially different policies. The pension build needs a deliberate recorded choice; neither should be copied automatically. A robots policy is not proof of crawler compliance.

## Limits of this review

This was a representative metadata inspection, not a complete SEO, accessibility or structured-data eligibility audit. It did not check every sitemap destination, dataset download or licence; render share images on social platforms; establish search-engine indexing; or verify that every structured-data assertion matches visible content. Valid JSON alone does not establish factual accuracy or eligibility for enhanced search results.

The resulting requirements are incorporated into section 10 of the [site scope](uk-state-pension-explorer-scope.md). No sibling-site changes were made.
