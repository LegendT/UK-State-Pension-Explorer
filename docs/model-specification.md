# Model specification

Written 29 September 2026, before the models were coded. The code in `src/assets/js/lib/` implements this document. Where the code and this document disagree, the code is wrong.

The reference examples in `docs/reference-calculations.md` were worked separately from the JavaScript, with Python's `decimal` module and by hand. A separate arithmetic method is a check on the code. It is not an independent human review.

## 1. What is modelled

Every uprating model works on **one pension component that follows the rule being shown**: the full rate of the new State Pension or the full rate of the basic State Pension. It does not model a person's whole payment. Additional State Pension, a protected payment and extra pension from deferral follow different uprating rules and are excluded.

All amounts are **weekly and before tax**. No model estimates tax, Pension Credit or any other benefit.

## 2. Units and exact arithmetic

| Quantity | Stored as | Reason |
| --- | --- | --- |
| Money | Whole pence (integer) | Avoids binary floating-point error |
| Percentage | Tenths of a percentage point (integer), so 4.8% is `48` | Official figures are published to one decimal place |
| Index (prices, earnings) | Floating point, base year = 1 | Only used for display of constant-price amounts |

Percentage inputs accept one decimal place, from -10.0 to 25.0. A value outside the range, or with more than one decimal place, is an error and produces no result.

Starting amounts accept pounds and pence, from £1.00 to £1,000.00 a week.

## 3. The five rules

`prices` is the inflation input. `earnings` is the earnings growth input. Both are percentages for the same year.

| Rule | Increase applied |
| --- | --- |
| Triple lock | The highest of `prices`, `earnings` and 2.5% |
| Double lock (prices or earnings) | The higher of `prices` and `earnings` |
| Earnings link | `earnings` |
| Prices link | `prices` |
| The rule announced for April 2030 | The highest of `prices`, 2.5%, and the increase needed to bring the rate up to its earnings target. See "The rule announced for April 2030" below |

### Ties

Measures are compared as entered, to one decimal place. When two or three measures share the highest value, the result names every one of them. It does not pick one.

### Negative growth and the cash floor

The triple lock can never produce a negative increase, because 2.5% is always available.

The rule announced for April 2030 cannot either, for the same reason. The other three rules can produce a negative figure. The model has one declared option, **"The rate never falls in cash terms"**, which is on by default. With the option on, a negative result becomes 0% and the result says the cash floor decided the increase. The floor is applied again after rounding to 5p, so a starting amount that is not a multiple of 5p, such as £241.32, is kept as it is and not rounded down to £241.30. With the option off, the rate falls.

The cash floor is an assumption of these hypothetical rules. It is not a statement of enacted law, and the site must say so beside the option.

### What is excluded at launch

- A freeze. No specific proposal justifies it as a launch comparison.
- A smoothed earnings rule with temporary inflation protection and catch-up. It is described in prose only, until its catch-up mechanism is fully specified.

### The rule announced for April 2030

Added on 30 September 2026 (decision 38). The government announced the rule on 29 September 2026 but has not published how it works. This section follows the description by the Institute for Fiscal Studies: each year the rate rises by the highest of prices, 2.5%, and "the amount needed to ensure the state pension keeps up with average earnings growth since the introduction of the new policy".

**Earnings target.** For year *t*, target = year 0 rate × (1 + earnings in year 1 ÷ 100) × … × (1 + earnings in year *t* ÷ 100). It is the year 0 rate carried forward by all earnings growth since the rule began.

**Each year's increase.** Three unrounded amounts are compared:

| Candidate | Unrounded amount |
| --- | --- |
| Prices | previous rate × (1 + prices ÷ 100) |
| The 2.5% minimum | previous rate × 1.025 |
| Keeping pace with earnings | the earnings target for this year |

The highest wins, and it is rounded to the nearest 5p as in section 4. The previous rate is the rounded rate of the year before, as for every rule. When two or three candidates share the highest amount exactly, the result names each of them.

**Arithmetic.** The target is a product of up to 30 factors. It is kept as an exact fraction with whole-number (BigInt) arithmetic, so no rounding happens before the final 5p step. The percentage shown for a year when the target wins is (new unrounded amount ÷ previous rate − 1), shown to one decimal place for display only.

**Assumptions, listed on the page and linked from every result:**

1. **Starting point.** The rule starts from the year 0 rate, the rate in the year before the rule applies. The government's only example refers to the value "by 2030/31".
2. **Earnings measure.** The target uses the same yearly earnings figure as the other rules. The government has not said which measure it would use.
3. **Catching up.** Growth is compared on unrounded amounts, and the target is not itself rounded until the new rate is. The government has not said how the test would be run, or whether rounding carries forward.

4. **The first year.** The tool applies the rule from the first year the reader chooses, like the other rules. The government's rule would start in April 2030. This is a simplification of the tool, and the page says so.

No cash floor applies, because the 2.5% minimum is always available.

A rule that follows earnings can still differ from the earnings link by small amounts: 10p a week at most in the steady growth scenario over 30 years. For the same reason it can come out a few pence above the triple lock: up to 25p a week in 20,000 random 30-year paths tried on 30 September 2026. The earnings link rounds each year from the previous rounded rate. The target is carried forward exactly and rounded once. This is a result of the rounding, not a difference in policy, and the page says so.

## 4. From a percentage to a weekly rate

1. Unrounded amount = starting pence × (1000 + tenths) ÷ 1000.
2. The weekly rate is the unrounded amount **rounded to the nearest 5p**, with an exact half rounded up.
3. The increase in pounds is the rounded new rate minus the starting rate.
4. The annual equivalent is the rounded weekly rate × 52.

The 5p rounding is a model convention. It was chosen because it reproduces the published full rates in the years checked (see `docs/reference-calculations.md`, section 1). The model shows the unrounded amount next to the rounded one so a reader can see the effect.

The annual equivalent is 52 weekly amounts at one rate. It is not what a person receives in a tax year, because rates change in April and payment days vary.

## 5. Tool 1: how the triple lock works

**Inputs:** prices, earnings, starting weekly amount. Or one historical year, chosen from the record of actual decisions.

**Outputs:** the percentage applied, the measure or measures that decided it, the weekly increase, the new weekly rate and the 52-week equivalent.

**Historical mode** does not calculate the decision. It reads the published decision and the published rates for that year from `src/_data/history.json`. It shows the three measures as they stood when the decision was made. If the actual decision departed from the triple lock, the tool shows the actual decision and says why.

**Hypothetical mode** applies section 3 and section 4. As soon as a reader changes any input in historical mode, the tool switches to hypothetical mode and its label changes with it.

## 6. Tool 2: compare the replacement rules

### Timing

- Year 0 is the last year before the reform. Every rule starts from the same year 0 weekly amount.
- Year 1 is the first year under the rule being compared.
- Each year has one `prices` figure and one `earnings` figure. They set that year's increase.
- The rounded weekly rate of one year is the starting amount for the next year.

### Simplification of publication lags

In practice an April increase uses inflation for the year to the previous September and earnings growth for the previous May to July. The model does not reproduce those lags. It treats the figure that sets a year's increase as the change in prices, or earnings, between the previous year and that year. The site states this next to the results.

### Indexes

- Price index: year 0 = 1. Each year, index = previous index × (1 + prices ÷ 100).
- Earnings index: year 0 = 1. Each year, index = previous index × (1 + earnings ÷ 100).

### Outputs for each rule and each year

| Output | Calculation |
| --- | --- |
| Weekly rate, cash | Section 4 applied year by year |
| Weekly rate, year 0 prices | Cash rate ÷ price index |
| Relative to earnings | (Cash rate ÷ year 0 rate) ÷ earnings index × 100. Year 0 = 100 |
| Difference from the triple lock | Rule's cash rate − triple lock cash rate, same year |
| Cash change on the previous year | Rule's cash rate − the same rule's previous cash rate |

The earnings comparison is an index. It is not a share of any named earnings level in pounds, because no compatible earnings denominator has been verified.

### Cumulative totals

- Cash total: the sum over years 1 to N of (weekly rate × 52).
- Constant-price total: the sum over years 1 to N of (weekly rate ÷ price index × 52), in year 0 prices.

The two totals are never added together or compared with each other. A total covers the fixed period chosen (1 to 30 years). It is not a lifetime figure.

### Wording rules for results

- A rule that pays less than the triple lock pays a **lower amount than under the triple lock**. It is a cash cut only if the cash change on the previous year is negative.
- Differences are before tax and before any change in means-tested benefits.
- A scenario is an illustration. It is not a forecast and has no probability.

### Scenarios

Each scenario is a list of yearly `prices` and `earnings` figures with a named reason. They are hypothetical. They are stored in `src/_data/scenarios.json`.

| Scenario | Reason for including it |
| --- | --- |
| Steady growth, earnings above prices, both above 2.5% | Triple lock, double lock and earnings link give the same result |
| Low inflation and low earnings growth, both below 2.5% | Only the 2.5% floor separates the triple lock from the double lock, the earnings link and the prices link. It also decides the rule announced for April 2030 |
| Weak earnings, prices above earnings | Prices decide; the earnings link falls behind prices |
| Volatile prices, alternating years | Shows the ratchet: the lock takes the higher measure each year |
| A year of falling earnings | Tests negative growth and the cash floor |
| The Institute for Fiscal Studies' example | Its stylised ten years for the rule announced for April 2030: prices 2.0% every year, earnings 4.0% except three years at 1.0%. Shows the catch-up |

## 7. Tool 3: what does the pension cover?

### Accounting convention

1. Income is entered **gross**, before tax.
2. Cash benefits actually received are entered once, as income.
3. Bills are entered at the amount actually charged. A discount or reduction (for example Council Tax Reduction) is reflected in the bill. It is not entered again as income.
4. Income tax for the household is one separate line, entered by the reader. It must not also be taken off an income line.
5. The tool calculates no tax and no benefit.

### Periods

The reader chooses one period for all inputs. Amounts are converted to a yearly amount in whole pence:

| Period entered | Yearly amount |
| --- | --- |
| Week | × 52 |
| 4 weeks | × 13 |
| Calendar month | × 12 |
| Year | × 1 |

When the reader changes the period, every amount already entered is converted to the new period: the amount × the periods in a year for the old period ÷ the periods in a year for the new one, to the nearest penny (decision 90). An amount that cannot be read is left as typed.

Weekly results are the yearly amount ÷ 52, rounded to the nearest penny for display only. The headline balance and the summary kept in view give amounts for the period the reader entered: the yearly amount ÷ the periods in a year, with the yearly amount after it unless the period is a year (decision 81).

### Outputs

- Total income before tax.
- Tax entered, or "not entered".
- Income after the tax entered. Shown only when tax has been entered.
- Total spending, and spending by category.
- Balance = income − tax − spending.

If tax is not entered, the balance is labelled **"Balance before tax"** and is not described as money available to spend. A negative balance is shown as a shortfall. The tool never changes a spending figure to fit income.

### Presets

A preset fills the spending fields from a published research budget or from a published survey of observed spending. Every preset carries its source, price date, geography, housing assumption and exclusions. A preset never fills the income fields with anything except a published pension rate. A preset without verified evidence is not offered.

## 8. Tool 4: pension history explorer

- Observed rates and decisions are read from `src/_data/history.json`. They are never recalculated.
- The basic State Pension and the new State Pension are separate series. The new State Pension series starts in 2016/17.
- A reconstructed comparison applies one of the first four rules of section 3, with the rounding of section 4, from a start year and start amount that are both displayed. It uses the prices and earnings figures recorded as used for each year's decision.
- A reconstructed value is marked as a calculation in the table, in the chart and in the download.
- A year in which the actual decision departed from the usual rule is annotated.
- Constant-price amounts use the consumer prices index level for the September before each rate took effect. If that index has not been verified, constant-price amounts are not offered.
