// Tool 3 results as an HTML string. No DOM.

import { budget, weekly, PERIOD_LABELS } from "./budget.js";
import { money } from "./format.js";

function pair(yearlyPence) {
  return `<td class="num">${money(Math.round(weekly(yearlyPence)))}</td><td class="num">${money(yearlyPence)}</td>`;
}

// input: { period, income: [{id,label,pence}], spending: [{id,label,pence}], taxPence, presetLabel }
function balance(result) {
  const balanceName = result.taxKnown ? "Balance after the tax you entered" : "Balance before tax";
  const amount = money(Math.abs(Math.round(weekly(result.balancePence))));
  const yearly = money(Math.abs(result.balancePence));
  let headline;
  if (result.balancePence < 0) headline = `Shortfall of ${amount} a week (${yearly} a year)`;
  else if (result.balancePence === 0) headline = "Income and spending are equal";
  else headline = `${amount} a week left over (${yearly} a year)`;
  return { balanceName, headline };
}

// The summary kept in view beside the form, or pinned to the foot of a narrow screen.
export function renderBudgetSummary(input) {
  const result = budget(input);
  const { balanceName, headline } = balance(result);
  const week = (pence) => money(Math.round(weekly(pence)));
  return (
    `<p><span class="status">Your own figures</span> ${balanceName}.</p>` +
    `<p class="headline">${headline}</p>` +
    `<dl><div><dt>Income</dt> <dd>${week(result.incomePence)} a week</dd></div>` +
    (result.taxKnown ? `<div><dt>Income Tax</dt> <dd>${week(result.taxPence)} a week</dd></div>` : "") +
    `<div><dt>Spending</dt> <dd>${week(result.spendingPence)} a week</dd></div></dl>`
  );
}

export function renderBudget(input) {
  const result = budget(input);
  const labels = Object.fromEntries([...input.income, ...input.spending].map((row) => [row.id, row.label]));
  const { balanceName, headline } = balance(result);

  const taxNote = result.taxKnown
    ? `<p>The balance uses the tax figure you entered. This tool did not work it out or check it.</p>`
    : `<p><strong>This balance is before tax.</strong> You did not enter a tax amount, so the balance is not money available to spend. If tax is due, the amount left is smaller.</p>`;

  const spendingRows = result.spendingRows
    .filter((row) => row.yearlyPence > 0)
    .map((row) => {
      const share = result.spendingPence ? Math.round((row.yearlyPence / result.spendingPence) * 100) : 0;
      return `<tr><th scope="row">${labels[row.id]}</th>${pair(row.yearlyPence)}<td class="num">${share}%</td></tr>`;
    })
    .join("");

  const incomeRows = result.incomeRows
    .filter((row) => row.yearlyPence > 0)
    .map((row) => `<tr><th scope="row">${labels[row.id]}</th>${pair(row.yearlyPence)}</tr>`)
    .join("");

  return (
    `<h3>Your result</h3>` +
    `<p><span class="status">Your own figures</span> The amounts you entered are for ${PERIOD_LABELS[input.period]}.` +
    (input.presetLabel ? ` Spending started from an example budget: ${input.presetLabel}.` : "") +
    `</p>` +
    `<p class="headline">${balanceName}: ${headline}</p>` +
    taxNote +
    (result.shortfall
      ? `<p>A shortfall means the spending entered is more than the income entered. The tool has not changed any of your figures to make them fit.</p>`
      : "") +
    `<div class="scroll-x" tabindex="0" role="region" aria-labelledby="budget-summary-caption"><table>` +
    `<caption id="budget-summary-caption">Summary of income, tax and spending</caption><thead><tr><th scope="col">Item</th><th scope="col" class="num">A week</th><th scope="col" class="num">A year</th></tr></thead><tbody>` +
    `<tr><th scope="row">Income before tax</th>${pair(result.incomePence)}</tr>` +
    (result.taxKnown
      ? `<tr><th scope="row">Tax you entered</th>${pair(result.taxPence)}</tr><tr><th scope="row">Income after that tax</th>${pair(result.incomeAfterTaxPence)}</tr>`
      : `<tr><th scope="row">Tax</th><td class="num" colspan="2">Not entered</td></tr>`) +
    `<tr><th scope="row">Spending</th>${pair(result.spendingPence)}</tr>` +
    `<tr><th scope="row">${balanceName}</th>${pair(result.balancePence)}</tr>` +
    `</tbody></table></div>` +
    (incomeRows
      ? `<div class="scroll-x" tabindex="0" role="region" aria-labelledby="budget-income-caption"><table><caption id="budget-income-caption">Income by source, before tax</caption>` +
        `<thead><tr><th scope="col">Source</th><th scope="col" class="num">A week</th><th scope="col" class="num">A year</th></tr></thead><tbody>${incomeRows}</tbody></table></div>`
      : "") +
    (spendingRows
      ? `<div class="scroll-x" tabindex="0" role="region" aria-labelledby="budget-spending-caption"><table><caption id="budget-spending-caption">Spending by category</caption>` +
        `<thead><tr><th scope="col">Category</th><th scope="col" class="num">A week</th><th scope="col" class="num">A year</th><th scope="col" class="num">Share of spending</th></tr></thead><tbody>${spendingRows}</tbody></table></div>`
      : "") +
    `<p>Weekly amounts are the yearly amount divided by 52, rounded to the nearest penny. A year is counted as 52 weeks, 13 four-week periods or 12 months.</p>` +
    `<p>This is a snapshot of the figures you entered. It is not a benefits award, a tax calculation or a forecast. To check what you may be entitled to, use an official or independent benefits calculator listed on <a href="https://www.gov.uk/benefits-calculators">GOV.UK</a>.</p>`
  );
}
