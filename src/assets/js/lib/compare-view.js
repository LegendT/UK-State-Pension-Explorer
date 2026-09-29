// Tool 2 results as an HTML string. Used by the build for the default view and by the
// browser after a reader changes an input, so both show the same thing. No DOM.

import { compareRules, RULES, RULE_LABELS, MEASURE_LABELS } from "./uprating.js";
import { lineChart } from "./chart.js";
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
    lines.push(`<p><strong>All four rules give the same result with these figures.</strong></p>`);
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
    let text = `<strong>${RULE_LABELS[rule]}:</strong> ${money(end.pence)} a week after ${years}.`;
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
    return `<li>${text}</li>`;
  });
  lines.push(`<ul>${items.join("")}</ul>`);
  lines.push(
    `<p>A lower amount than under the triple lock is a smaller rise, not a cut, unless the amount fell in pounds. All amounts are before tax and take no account of Pension Credit or other benefits.</p>`,
  );
  return lines.join("");
}

function table(caption, head, rows, label) {
  return (
    `<div class="scroll-x" tabindex="0" role="region" aria-label="${label}"><table><caption>${caption}</caption>` +
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

// options: { startPence, path, cashFloor, firstYear, measure, scenarioLabel }
export function renderComparison(options) {
  const { startPence, path, cashFloor, firstYear, measure, scenarioLabel } = options;
  const result = compareRules(startPence, path, cashFloor);
  const labels = yearLabels(firstYear, path.length);
  const ruleNames = RULES.map((rule) => RULE_LABELS[rule]);
  const info = MEASURES[measure];

  const chart = lineChart({
    id: "compare-chart",
    title: `${info.label}: weekly amount under four rules, ${scenarioLabel}`,
    description: `A line for each rule over ${path.length} years. The table after the chart gives every value.`,
    labels: labels.map((label, i) => (i === 0 ? "Start" : label)),
    series: RULES.map((rule) => ({
      label: RULE_LABELS[rule],
      values: result.rules[rule].years.map((entry) => value(entry, measure)),
    })),
    yLabel: measure === "earnings" ? "Index (start = 100)" : "Pounds a week",
    yPrefix: measure === "earnings" ? "" : "£",
    xLabel: "Tax year",
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
    "The figures used for each year",
  );

  const values = table(
    `${info.label}: ${info.unit}`,
    ["Tax year", ...ruleNames],
    labels.map((label, i) => [label, ...RULES.map((rule) => show(result.rules[rule].years[i], measure))]),
    `${info.label}, by rule and year`,
  );

  const difference = table(
    "Weekly difference from the triple lock, in the money of each year",
    ["Tax year", ...ruleNames.slice(1)],
    labels.slice(1).map((label, i) => [
      label,
      ...RULES.slice(1).map((rule) => signed(result.rules[rule].years[i + 1].differencePence)),
    ]),
    "Weekly difference from the triple lock",
  );

  const years = path.length === 1 ? "1 year" : `${path.length} years`;
  const totals = table(
    `Total paid over the ${years}, counting 52 weeks a year`,
    ["Rule", "Total in cash", "Cash total compared with the triple lock", "Total in starting-year prices", "That total compared with the triple lock"],
    RULES.map((rule) => [
      RULE_LABELS[rule],
      money(result.rules[rule].cashTotalPence),
      rule === "triple-lock" ? "Not applicable" : signed(result.rules[rule].cashTotalDifferencePence),
      money(Math.round(result.rules[rule].realTotalPence)),
      rule === "triple-lock" ? "Not applicable" : signed(result.rules[rule].realTotalDifferencePence),
    ]),
    "Totals over the period",
  );

  return (
    `<h3>Result: ${scenarioLabel}, starting from ${money(startPence)} a week</h3>` +
    `<p><span class="status">Hypothetical</span> An illustration using the figures shown. It is not a forecast and has no probability. ` +
    `The cash floor is ${cashFloor ? "on: no rule can lower the amount in pounds" : "off: a rule can lower the amount in pounds"}.</p>` +
    summary(result, labels) +
    `<figure class="chart"><figcaption><h4>${info.label}: ${info.unit}</h4></figcaption><div class="scroll-x" tabindex="0" role="region" aria-label="Chart: ${info.label}">${chart}</div></figure>` +
    values +
    difference +
    `<h4>Totals over the period</h4>` +
    `<p>These totals cover the ${years} chosen. They are not a lifetime figure, and they do not describe any person's payments. ` +
    `The cash total adds amounts from different years as they stand. The other total first puts every year into starting-year prices. ` +
    `The two totals are on different bases and must not be added or compared with each other.</p>` +
    totals +
    `<h4>How each year's increase was decided</h4>` +
    inputs
  );
}
