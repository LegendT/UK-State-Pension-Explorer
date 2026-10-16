// Tool 2 results as an HTML string. Used by the build for the default view and by the
// browser after a reader changes an input, so both show the same thing. No DOM.

import { compareRules, RULES, RULE_LABELS, MEASURE_LABELS } from "./uprating.js";
import { chartSummary, lineChart, near } from "./chart.js";
import { money, percent, list } from "./format.js";

export const MEASURES = {
  cash: { label: "Cash", unit: "pounds a week, in the money of each year" },
  real: { label: "Buying power", unit: "pounds a week, in the prices of the starting year" },
  earnings: { label: "Compared with earnings", unit: "index, starting year = 100" },
};

export function yearLabels(firstYear, count) {
  const labels = [`Start (${taxYear(firstYear - 1)})`];
  for (let i = 0; i < count; i += 1) labels.push(taxYear(firstYear + i));
  return labels;
}

function taxYear(start) {
  return `${start}/${String((start + 1) % 100).padStart(2, "0")}`;
}

function value(entry, measure) {
  if (measure === "cash") return entry.pence / 100;
  if (measure === "real") return entry.realPence / 100;
  return entry.earningsIndex;
}

function show(entry, measure) {
  if (measure === "cash") return money(entry.pence);
  if (measure === "real") return money(Math.round(entry.realPence));
  return entry.earningsIndex.toFixed(1);
}

// Rules equal to the penny in every year, for the written summary. The chart merges lines by the
// values it plots instead, which differ by measure, so the two are kept apart on purpose.
function groupsOfEqualRules(result) {
  const groups = [];
  for (const rule of RULES) {
    const key = result.rules[rule].years.map((year) => year.pence).join(",");
    const group = groups.find((item) => item.key === key);
    if (group) group.rules.push(rule);
    else groups.push({ key, rules: [rule] });
  }
  return groups;
}

function summary(result, labels) {
  const last = labels.length - 1;
  const years = last === 1 ? "1 year" : `${last} years`;
  const lines = [];
  const equal = groupsOfEqualRules(result).filter((group) => group.rules.length > 1);

  if (equal.length === 1 && equal[0].rules.length === RULES.length) {
    lines.push(`<p><strong>All five rules give the same result with these figures.</strong></p>`);
  } else {
    for (const group of equal) {
      lines.push(`<p><strong>${list(group.rules.map((rule) => RULE_LABELS[rule]))} give the same result with these figures.</strong></p>`);
    }
  }

  const items = RULES.map((rule) => {
    const end = result.rules[rule].years[last];
    const falls = result.rules[rule].years.filter((year) => year.changePence < 0).length;
    const held = result.rules[rule].years.filter((year) => year.determining[0] === "cash-floor").length;
    const flat = result.rules[rule].years.slice(1).filter((year) => year.changePence === 0).length;
    let text = `${money(end.pence)} a week after ${years}.`;
    if (rule !== "triple-lock") {
      text +=
        end.differencePence === 0
          ? " The same as under the triple lock."
          : ` That is ${money(Math.abs(end.differencePence))} a week ${end.differencePence < 0 ? "lower" : "higher"} than under the triple lock.`;
    }
    if (falls) text += ` The amount fell in pounds in ${falls} of the years.`;
    else if (held) text += ` The amount did not rise in ${held} of the years, because the cash floor applied. It did not fall in pounds in any year.`;
    else if (flat) text += ` The amount did not change in ${flat} of the years. It did not fall in pounds in any year.`;
    else text += " The amount rose in pounds in every year.";
    return `<dt>${RULE_LABELS[rule]}</dt> <dd>${text}</dd>`;
  });
  lines.push(`<dl>${items.join("")}</dl>`);
  lines.push(
    `<p>A lower amount than under the triple lock is a smaller rise, not a cut, unless the amount fell in pounds. All amounts are before tax and take no account of Pension Credit or other benefits.</p>`,
  );
  return lines.join("");
}

function table(caption, head, rows, id) {
  return (
    `<div class="scroll-x" tabindex="0" role="region" aria-labelledby="${id}"><table><caption id="${id}">${caption}</caption>` +
    `<thead><tr>${head.map((cell, i) => `<th scope="col"${i ? ' class="num"' : ""}>${cell}</th>`).join("")}</tr></thead>` +
    `<tbody>${rows
      .map((row) => `<tr>${row.map((cell, i) => (i ? `<td class="num">${cell}</td>` : `<th scope="row">${cell}</th>`)).join("")}</tr>`)
      .join("")}</tbody></table></div>`
  );
}

function signed(pence) {
  if (Math.round(pence) === 0) return "£0.00";
  return `${pence < 0 ? "−" : "+"}${money(Math.abs(Math.round(pence)))}`;
}

// A total in starting-year prices is shown to the pound: a weekly amount is naturally in pounds and
// pence, but a total over years to the penny claims more than a price index can give (smaller point
// 15 of the readability review).
const wholePounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function pounds(pence, sign) {
  const whole = Math.round(pence / 100);
  if (whole === 0) return "£0";
  return `${sign ? (whole < 0 ? "−" : "+") : ""}${wholePounds.format(Math.abs(whole))}`;
}

const SHORT = { "triple-lock": "Triple lock", "double-lock": "Double lock", earnings: "Earnings link", prices: "Prices link", "rule-2030": "April 2030 rule" };
const IN_A_SENTENCE = { "triple-lock": "the triple lock", "double-lock": "the double lock", earnings: "the earnings link", prices: "the prices link", "rule-2030": "the rule announced for April 2030" };
// Three or more rules are named in a list with one article, so the title stays short enough to read.
const IN_A_LIST = { "triple-lock": "triple lock", "double-lock": "double lock", earnings: "earnings link", prices: "prices link", "rule-2030": "April 2030 rule" };

// The chart's title states which rules end highest and lowest in this result. Worked out each time,
// because a typed title would be false for another scenario. Rules less than 0.1% apart count as
// level, as the chart's lines do (W21), and the title says so where they are not equal.
function message(result, measure, years) {
  const ends = RULES.map((rule) => ({ rule, v: Math.round(value(result.rules[rule].years[result.rules[rule].years.length - 1], measure) * (measure === "earnings" ? 10 : 100)) }));
  const top = Math.max(...ends.map((e) => e.v));
  const bottom = Math.min(...ends.map((e) => e.v));
  if (top === bottom) return `All five rules end at the same amount after ${years}`;
  if (near(top, bottom)) return `All five rules end less than 0.1% apart after ${years}`;
  const who = (rules) => (rules.length >= 3 ? `the ${list(rules.map((rule) => IN_A_LIST[rule]))}` : rules.map((rule) => IN_A_SENTENCE[rule]).join(" and "));
  const verb = (rules) => (rules.length === 1 ? "ends" : "end");
  const apart = (group) => (group.length > 1 && group.some((e) => e.v !== group[0].v) ? ", less than 0.1% apart," : "");
  const high = ends.filter((e) => near(e.v, top));
  const low = ends.filter((e) => near(e.v, bottom) && !high.includes(e));
  const names = (group) => group.map((e) => e.rule);
  const text = `${who(names(high))} ${verb(high)} highest${apart(high)} after ${years}, and ${who(names(low))} ${verb(low)} lowest${apart(low).replace(/,$/, "")}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// options: { startPence, path, cashFloor, firstYear, measure, scenarioLabel, chartWidth, sourceLine }.
// chartWidth: the width to draw the chart at; the build leaves it out.
// sourceLine: a "Sources:" sentence as HTML, with its citations, naming where the starting amount
// and the yearly figures come from. Printed under the chart and under the tables (R11 of the
// readability review).
export function renderComparison(options) {
  const { startPence, path, cashFloor, firstYear, measure, scenarioLabel, chartWidth, sourceLine } = options;
  const source = sourceLine ? `<p class="source-line">${sourceLine}</p>` : "";
  const result = compareRules(startPence, path, cashFloor);
  const labels = yearLabels(firstYear, path.length);
  const ruleNames = RULES.map((rule) => RULE_LABELS[rule]);
  const info = MEASURES[measure];

  const years = path.length === 1 ? "1 year" : `${path.length} years`;

  const chartLabels = labels.map((label, i) => (i === 0 ? "Start" : label));
  const chartSeries = RULES.map((rule) => ({
    label: RULE_LABELS[rule],
    short: SHORT[rule],
    values: result.rules[rule].years.map((entry) => value(entry, measure)),
  }));
  const chart = lineChart({
    id: "compare-chart",
    width: chartWidth,
    title: message(result, measure, years),
    labels: chartLabels,
    series: chartSeries,
    yLabel: measure === "earnings" ? "Index (start = 100)" : "Pounds a week",
    yPrefix: measure === "earnings" ? "" : "£",
    xLabel: "Tax year",
  });
  const chartText = chartSummary({
    description: `The chart below shows the five rules over ${path.length} years. Rules with the same result, or less than 0.1% apart, in every year share one line.`,
    labels: chartLabels,
    series: chartSeries,
    format: (value) => (measure === "earnings" ? value.toFixed(1) : money(Math.round(value * 100))),
  });

  const inputs = table(
    "The figures used for each year",
    ["Tax year", "Rise in prices", "Rise in earnings", ...ruleNames.map((name) => `${name}: increase and what decided it`)],
    path.map((year, i) => [
      labels[i + 1],
      percent(year.prices),
      percent(year.earnings),
      ...RULES.map((rule) => {
        const entry = result.rules[rule].years[i + 1];
        return `${percent(entry.tenths)}, ${list(entry.determining.map((name) => MEASURE_LABELS[name]))}`;
      }),
    ]),
    "compare-inputs-caption",
  );

  const values = table(
    `${info.label}, by rule and year: ${info.unit}`,
    ["Tax year", ...ruleNames],
    labels.map((label, i) => [label, ...RULES.map((rule) => show(result.rules[rule].years[i], measure))]),
    "compare-values-caption",
  );

  const difference = table(
    "Weekly difference from the triple lock, in the money of each year",
    ["Tax year", ...ruleNames.slice(1)],
    labels.slice(1).map((label, i) => [
      label,
      ...RULES.slice(1).map((rule) => signed(result.rules[rule].years[i + 1].differencePence)),
    ]),
    "compare-difference-caption",
  );

  const totals = table(
    `Total paid over the ${years}, counting 52 weeks a year`,
    ["Rule", "Total in cash", "Cash total compared with the triple lock", "Total in starting-year prices", "That total compared with the triple lock"],
    RULES.map((rule) => [
      RULE_LABELS[rule],
      money(result.rules[rule].cashTotalPence),
      rule === "triple-lock" ? "Not applicable" : signed(result.rules[rule].cashTotalDifferencePence),
      pounds(result.rules[rule].realTotalPence),
      rule === "triple-lock" ? "Not applicable" : pounds(result.rules[rule].realTotalDifferencePence, true),
    ]),
    "compare-totals-caption",
  );

  return (
    `<h3 id="compare-result-heading">Result: ${scenarioLabel}, starting from ${money(startPence)} a week</h3>` +
    `<p><span class="status">Hypothetical</span> An illustration using the figures shown. It is not a forecast and has no probability. ` +
    `The cash floor is ${cashFloor ? "on, so no rule can lower the amount in pounds" : "off, so a rule can lower the amount in pounds"}.</p>` +
    `<p>The rule announced for April 2030 is our reading of it, on four assumptions. It is not what the government's rule will pay. <a href="#rule-2030-assumptions">The assumptions</a>.</p>` +
    summary(result, labels) +
    `${chartText}<figure class="chart" id="compare-chart"><figcaption><h4>${message(result, measure, years)}</h4><p>Illustration, not a forecast. ${info.label}: ${info.unit}</p></figcaption><div class="scroll-x" tabindex="0" role="region" aria-label="Chart: ${info.label}">${chart}</div></figure>` +
    source +
    values +
    difference +
    `<h4>Totals over the period</h4>` +
    `<p>These totals cover the ${years} chosen. They are not a lifetime figure, and they do not describe any person's payments. ` +
    `The cash total adds amounts from different years as they stand. The other total first puts every year into starting-year prices, and is rounded to the pound. ` +
    `The two totals are on different bases and must not be added or compared with each other.</p>` +
    totals +
    `<h4>How each year's increase was decided</h4>` +
    inputs +
    source
  );
}

// How far a rule ends from the triple lock, in the measure shown. Worked from the rounded values
// the summary prints, so the gap never contradicts the two amounts beside it.
export function gap(entry, base, measure) {
  const d =
    measure === "cash" ? entry.pence - base.pence
    : measure === "real" ? Math.round(entry.realPence) - Math.round(base.realPence)
    : Math.round(entry.earningsIndex * 10) - Math.round(base.earningsIndex * 10);
  if (d === 0) return "the same";
  const size = measure === "earnings" ? `${(Math.abs(d) / 10).toFixed(1)} points` : money(Math.abs(d));
  return `${size} ${d < 0 ? "less" : "more"}<span class="visually-hidden"> than the triple lock</span>`;
}

// The amount under each rule in the last year, and how far it is from the triple lock, for the
// summary that stays in view while the figures change. For one person on the full rate: the
// full result, with the chart and tables, follows the form.
export function renderSummary({ startPence, path, cashFloor, firstYear, measure }) {
  const result = compareRules(startPence, path, cashFloor);
  const last = path.length;
  const info = MEASURES[measure];
  const base = result.rules["triple-lock"].years[last];
  const rows = RULES.map((rule) => {
    const entry = result.rules[rule].years[last];
    return `<div><dt>${SHORT[rule]}</dt> <dd>${show(entry, measure)}</dd> <dd>${rule === "triple-lock" ? "for comparison" : gap(entry, base, measure)}</dd></div>`;
  }).join("");
  return `<p><span class="status">Hypothetical</span> One person on the full rate, after ${last === 1 ? "1 year" : `${last} years`}, in ${taxYear(firstYear + last - 1)}. ${info.label}: ${info.unit}.</p><dl>${rows}</dl>`;
}
