// Tool 4 results as an HTML string, and the same rows as CSV. No DOM.
// Published rates and decisions are read from the record. Only the comparison is calculated.

import { RULE_LABELS, upratingFor } from "./uprating.js";
import { earningsIndex, inLatestPrices, observed, reconstruct, SERIES_LABELS } from "./history.js";
import { lineChart, near } from "./chart.js";
import { money, percent } from "./format.js";

export const HISTORY_MEASURES = {
  cash: "Cash: pounds a week in the money of each year",
  real: "Buying power: pounds a week in the prices of the last year shown",
  earnings: "Compared with earnings: an index, first year shown = 100",
};

const DECIDED = {
  prices: "Prices (Consumer Prices Index)",
  earnings: "Earnings",
  floor: "The 2.5% minimum",
  rpi: "Prices (Retail Prices Index, this year only)",
  "pre-triple-lock": "Before the triple lock: the higher of 2.5% or the Retail Prices Index (RPI)",
};

// options: { years, series, from, to, measure, rule } where rule is "" or a rule id.
export function historyRows(options) {
  const { years, series, from, to, measure, rule } = options;
  const all = observed(years, series);
  const first = all.findIndex((year) => year.tax_year === from);
  const last = all.findIndex((year) => year.tax_year === to);
  const rows = all.slice(first, last + 1);
  const latest = rows[rows.length - 1];
  const index = earningsIndex(rows);
  const calculated = rule ? reconstruct(years, series, from, rule) : [];
  const key = `${series}_pence`;

  const convert = (pence, year, i) => {
    if (measure === "cash") return pence / 100;
    if (measure === "real") return inLatestPrices(pence, year, latest) / 100;
    return ((pence / rows[0][key]) / (index[i] / 100)) * 100;
  };

  return rows.map((year, i) => {
    const other = i === 0 ? year[key] : calculated[i - 1] ? calculated[i - 1].pence : null;
    return {
      tax_year: year.tax_year,
      effective_date: series === "new" ? year.new_effective_date : year.effective_date,
      published: convert(year[key], year, i),
      publishedCash: year[key] / 100,
      applied: i === 0 && series === "new" && year.tax_year === "2016/17" ? null : year.applied_tenths,
      decided: i === 0 && series === "new" && year.tax_year === "2016/17" ? "First rate, set not increased" : DECIDED[year.measure],
      calculated: rule ? convert(other, year, i) : null,
      calculatedCash: rule ? other / 100 : null,
      start: i === 0,
      exceptional: year.exceptional,
      annotation: year.annotation || "",
      note: year.note || "",
    };
  });
}

function show(value, measure) {
  return measure === "earnings" ? value.toFixed(1) : money(Math.round(value * 100));
}

// One sentence for each year in the range where Parliament departed from the triple lock's own
// rule and the calculation follows the rule, so the two differ: notes 11 and 12 of the page review.
function departures({ years, series, from, to, rule }) {
  if (!rule) return [];
  const rows = observed(years, series);
  const first = rows.findIndex((year) => year.tax_year === from);
  const last = rows.findIndex((year) => year.tax_year === to);
  return rows.slice(first + 1, last + 1)
    .filter((year) => {
      const calculated = upratingFor(rule, year.prices_tenths, year.earnings_tenths).tenths;
      const byTheRule = upratingFor("triple-lock", year.prices_tenths, year.earnings_tenths).tenths;
      return year.exceptional && calculated === byTheRule && calculated !== year.applied_tenths;
    })
    .map((year) => {
      if (year.earnings_not_used) return `For ${year.tax_year} the calculation uses earnings growth of ${percent(year.earnings_tenths)}, which Parliament set aside that year. The published rate rose by ${percent(year.applied_tenths)}.`;
      if (year.measure === "rpi") return `For ${year.tax_year} the calculation uses the Consumer Prices Index, ${percent(year.prices_tenths)}. That year only, the published rate used the Retail Prices Index: ${percent(year.applied_tenths)}.`;
      return `For ${year.tax_year} the calculation gives ${percent(upratingFor(rule, year.prices_tenths, year.earnings_tenths).tenths)}. The published rate rose by ${percent(year.applied_tenths)}.`;
    });
}

// The summary kept in view beside the form, or pinned to the foot of a narrow screen.
export function renderHistorySummary(options) {
  const { series, from, to, measure, rule } = options;
  const rows = historyRows(options);
  const first = rows[0];
  const last = rows[rows.length - 1];
  return (
    `<p>${SERIES_LABELS[series]}, ${from} to ${to}. ${HISTORY_MEASURES[measure]}.</p>` +
    `<dl><div><dt>${from}, published</dt> <dd>${show(first.published, measure)}</dd></div>` +
    `<div><dt>${to}, published</dt> <dd>${show(last.published, measure)}</dd></div>` +
    (rule ? `<div><dt>${to}, calculated under the ${RULE_LABELS[rule].toLowerCase()}</dt> <dd>${show(last.calculated, measure)}</dd></div>` : "") +
    `</dl>` +
    departures(options).map((sentence) => `<p>${sentence}</p>`).join("")
  );
}

// As the menu names them: only the two locks had exceptions to leave out.
const RULE_IN_A_TITLE = { "triple-lock": "triple lock with no exceptions", "double-lock": "double lock with no exceptions", earnings: "earnings link", prices: "prices link" };

function ruleMessage(rule, calculated, published, measure, to) {
  const subject = `Calculated under the ${RULE_IN_A_TITLE[rule]}, the rate`;
  const where = { cash: "", real: " in buying power", earnings: " compared with earnings" }[measure];
  // Worked from the rounded values the table prints, so the title never contradicts them.
  const scale = measure === "earnings" ? 10 : 100;
  const d = Math.round(calculated * scale) - Math.round(published * scale);
  if (d === 0) return `${subject} ends at the published rate${where} in ${to}`;
  if (near(calculated, published)) return `${subject} ends less than 0.1% from the published rate${where} in ${to}`;
  const size = measure === "earnings" ? `${(Math.abs(d) / 10).toFixed(1)} points` : `${money(Math.abs(d))} a week`;
  return `${subject} ends ${size} ${calculated > published ? "above" : "below"} the published rate${where} in ${to}`;
}

// One muted line naming where the published figures come from, under the chart and under the table
// (R11 of the readability review). The rates and decisions have a source for each year, so the line
// links to the history page's table, which lists them by year. sources: { rates, decisions,
// listed_url, prices, prices_url, checked }, where checked is a time element as HTML; left out, no
// line is printed.
function sourceLine(sources, measure, rule) {
  if (!sources) return "";
  return (
    `<p class="source-line">Sources: the published rates and each year's decision, from ${sources.rates} and ${sources.decisions}, <a href="${sources.listed_url}">listed by year on the history page</a>` +
    (measure === "real" ? `; buying power uses <a href="${sources.prices_url}">${sources.prices}</a>` : "") +
    `. ${rule ? "The calculated figures are this site's calculation from those. " : ""}Checked against the sources on ${sources.checked}.</p>`
  );
}

// chartWidth: the width to draw the chart at; the build leaves it out.
export function renderHistory(options) {
  const { series, from, to, measure, rule, chartWidth, sources } = options;
  const rows = historyRows(options);
  const name = SERIES_LABELS[series];
  const ruleName = rule ? RULE_LABELS[rule] : "";
  const seriesList = [{ label: "Published rate", short: "Published rate", values: rows.map((row) => row.published) }];
  if (rule) seriesList.push({ label: `Calculated under the ${ruleName.toLowerCase()} from ${from}`, short: "Calculated", values: rows.map((row) => row.calculated) });

  // Years with a short annotation are marked on the chart and listed under it by number. Labels at
  // the marks overlapped, because 2021/22 and 2022/23 are next to each other.
  const marked = rows.map((row, index) => ({ row, index })).filter(({ row }) => row.annotation);
  const marks = marked.map(({ index }, i) => ({ index, number: i + 1 }));
  const markList = marked.length
    ? `<ol class="chart-marks-key" aria-label="Years marked on the chart">${marked.map(({ row }) => `<li>${row.tax_year}: ${row.annotation}.</li>`).join("")}</ol>`
    : "";

  // The title states what the chart shows: with a rule added, how far the calculation ends from the
  // published rate (W21); without one, whether the published rate rose in every year.
  const falls = rows.slice(1).filter((row, i) => row.published < rows[i].published).length;
  const rises = rows.slice(1).filter((row, i) => row.published > rows[i].published).length;
  const measureWords = { cash: "in pounds", real: "in buying power", earnings: "compared with earnings" }[measure];
  const subject = `The ${name.charAt(0).toLowerCase()}${name.slice(1)}`;
  const last = rows[rows.length - 1];
  const message = rule
    ? ruleMessage(rule, last.calculated, last.published, measure, to)
    : falls
    ? `${subject} fell ${measureWords} in ${falls} of the ${rows.length - 1} years to ${to}`
    : rises === rows.length - 1
      ? `${subject} rose ${measureWords} in every year from ${from} to ${to}`
      : `${subject} did not fall ${measureWords} in any year from ${from} to ${to}`;

  const chart = lineChart({
    marks,
    width: chartWidth,
    id: "history-chart",
    title: message,
    description:
      `Published weekly rate for each tax year${rule ? `, and a calculation of the ${ruleName.toLowerCase()} applied from ${from}` : ""}. ` +
      `The table after the chart gives every value.`,
    labels: rows.map((row) => row.tax_year),
    series: seriesList,
    yLabel: measure === "earnings" ? "Index (first year = 100)" : "Pounds a week",
    yPrefix: measure === "earnings" ? "" : "£",
    xLabel: "Tax year",
  });

  const head =
    `<th scope="col">Tax year</th><th scope="col" class="num">Published rate</th>` +
    (rule ? `<th scope="col" class="num">Calculated: ${ruleName}</th>` : "") +
    `<th scope="col" class="num">Increase applied</th><th scope="col">Decided by</th><th scope="col">Notes</th>`;

  const body = rows
    .map(
      (row) =>
        `<tr><th scope="row">${row.tax_year}</th><td class="num">${show(row.published, measure)}</td>` +
        (rule ? `<td class="num"><em>${show(row.calculated, measure)}</em>${row.start ? " (start)" : ""}</td>` : "") +
        `<td class="num">${row.applied === null ? "None" : percent(row.applied)}</td><td>${row.decided}</td>` +
        `<td>${row.exceptional ? "<strong>Exceptional year.</strong> " : ""}${row.note}</td></tr>`,
    )
    .join("");

  const comparison = rule
    ? `<div class="note" role="note"><h4>About the calculated column</h4>` +
      `<p><span class="status">Calculated by this site</span> The ${ruleName.toLowerCase()}, applied every year from a starting rate of ` +
      `<strong>${money(Math.round(rows[0].publishedCash * 100))} in ${from}</strong>.</p>` +
      `<p>In ${to} the published rate was ${money(Math.round(last.publishedCash * 100))} and the calculated amount is ${money(Math.round(last.calculatedCash * 100))}. ` +
      `A different starting year gives a different result.</p>` +
      `<p>This is a calculation. It is not what anyone was paid, and it is not an estimate of what any person would have received under a different system. ` +
      `It leaves out the special rules of exceptional years, which is one reason it can differ from the published rate even for the triple lock.</p></div>`
    : "";

  return (
    `<h3>${name}, ${from} to ${to}</h3>` +
    `<p>Full rate, before tax.</p>` +
    `<figure class="chart"><figcaption><h4>${message}</h4><p>${HISTORY_MEASURES[measure]}</p></figcaption><div class="scroll-x" tabindex="0" role="region" aria-label="Chart: ${name}, ${from} to ${to}">${chart}</div>${markList}</figure>` +
    sourceLine(sources, measure, rule) +
    comparison +
    `<div class="scroll-x" tabindex="0" role="region" aria-labelledby="history-table-caption"><table>` +
    `<caption id="history-table-caption">${name}, ${from} to ${to}. ${HISTORY_MEASURES[measure]}</caption>` +
    `<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
    sourceLine(sources, measure, rule)
  );
}

export function historyCsv(options) {
  const rows = historyRows(options);
  const { series, measure, rule, from } = options;
  const quote = (text) => `"${String(text).replace(/"/g, '""')}"`;
  const head = [
    "tax_year",
    "effective_date",
    "series",
    "measure",
    "published_rate",
    "published_rate_cash_gbp",
    ...(rule ? [`calculated_${rule}_from_${from}`, "calculated_cash_gbp"] : []),
    "increase_applied_percent",
    "decided_by",
    "exceptional_year",
    "notes",
  ];
  const lines = rows.map((row) =>
    [
      row.tax_year,
      row.effective_date,
      series,
      measure,
      row.published.toFixed(2),
      row.publishedCash.toFixed(2),
      ...(rule ? [row.calculated.toFixed(2), row.calculatedCash.toFixed(2)] : []),
      row.applied === null ? "" : (row.applied / 10).toFixed(1),
      quote(row.decided),
      row.exceptional ? "yes" : "no",
      quote(row.note),
    ].join(","),
  );
  return [head.join(","), ...lines].join("\n") + "\n";
}
