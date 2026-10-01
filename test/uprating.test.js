// Expected values come from scripts/reference.py (Python Decimal), recorded in
// docs/reference-calculations.md. They were not produced by the code under test.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyIncrease,
  compareRules,
  mechanism,
  parsePence,
  parseTenths,
  upratingFor,
} from "../src/assets/js/lib/uprating.js";

const pence = (rule, result) => result.rules[rule].years.slice(1).map((year) => year.pence);
const path = (pairs) => pairs.map(([prices, earnings]) => ({ prices, earnings }));
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.01, `${actual} is not ${expected}`);

test("published full rates are reproduced by nearest-5p rounding", () => {
  assert.equal(applyIncrease(22120, 41).pence, 23025);
  assert.equal(applyIncrease(23025, 48).pence, 24130);
  assert.equal(applyIncrease(16950, 41).pence, 17645);
  assert.equal(applyIncrease(17645, 48).pence, 18490);
});

test("an exact half of 5p rounds up, zero leaves the rate alone, a negative lowers it", () => {
  assert.deepEqual(applyIncrease(2500, 1), { unroundedPence: 2502.5, pence: 2505 });
  assert.equal(applyIncrease(10000, 0).pence, 10000);
  assert.equal(applyIncrease(20000, -15).pence, 19700);
});

test("the mechanism reports the increase and the 52-week equivalent", () => {
  const result = mechanism(23025, 38, 48);
  assert.equal(result.tenths, 48);
  assert.deepEqual(result.determining, ["earnings"]);
  assert.equal(result.increasePence, 1105);
  assert.equal(result.annualPence, 1254760);
});

test("ties name every measure that shares the highest value", () => {
  assert.deepEqual(upratingFor("triple-lock", 25, 25).determining, ["prices", "earnings", "floor"]);
  assert.deepEqual(upratingFor("triple-lock", 30, 30).determining, ["prices", "earnings"]);
  assert.deepEqual(upratingFor("triple-lock", 25, 10).determining, ["prices", "floor"]);
  assert.deepEqual(upratingFor("triple-lock", 10, 20), { tenths: 25, determining: ["floor"] });
  assert.deepEqual(upratingFor("triple-lock", 0, 0), { tenths: 25, determining: ["floor"] });
});

test("negative growth: the cash floor applies only when switched on", () => {
  assert.deepEqual(upratingFor("triple-lock", -5, -10), { tenths: 25, determining: ["floor"] });
  assert.deepEqual(upratingFor("double-lock", -5, -10), { tenths: 0, determining: ["cash-floor"] });
  assert.deepEqual(upratingFor("double-lock", -5, -10, false), { tenths: -5, determining: ["prices"] });
  assert.deepEqual(upratingFor("earnings", -5, -10, false), { tenths: -10, determining: ["earnings"] });
  assert.deepEqual(upratingFor("prices", 0, 0), { tenths: 0, determining: ["prices"] });
});

test("steady growth: three rules coincide and the prices link diverges", () => {
  const result = compareRules(24130, path([[30, 40], [30, 40], [30, 40]]));
  for (const rule of ["triple-lock", "double-lock", "earnings"]) {
    assert.deepEqual(pence(rule, result), [25095, 26100, 27145]);
    assert.equal(result.rules[rule].cashTotalPence, 4073680);
  }
  assert.deepEqual(pence("prices", result), [24855, 25600, 26370]);
  assert.equal(result.rules.prices.cashTotalPence, 3994900);
  assert.equal(result.rules.prices.cashTotalDifferencePence, 3994900 - 4073680);
  near(result.rules["triple-lock"].realTotalPence, 3837982.26);
  near(result.rules.prices.years[3].realPence, 24132.29);
  near(result.rules.prices.years[3].earningsIndex, 97.1522);
  near(result.rules["triple-lock"].years[3].earningsIndex, 100.0075);
});

test("low growth: only the 2.5% minimum separates the triple lock from the first three alternatives", () => {
  const result = compareRules(24130, path([[15, 20], [15, 20], [15, 20]]));
  assert.deepEqual(pence("triple-lock", result), [24735, 25355, 25990]);
  assert.deepEqual(pence("double-lock", result), [24615, 25105, 25605]);
  assert.deepEqual(pence("earnings", result), [24615, 25105, 25605]);
  assert.deepEqual(pence("prices", result), [24490, 24855, 25230]);
  assert.equal(result.rules["double-lock"].years[3].differencePence, 25605 - 25990);
});

test("volatile prices: the lock takes the higher measure each year", () => {
  const result = compareRules(24130, path([[60, 20], [10, 50], [60, 20]]));
  assert.deepEqual(pence("triple-lock", result), [25580, 26860, 28470]);
  assert.deepEqual(pence("double-lock", result), [25580, 26860, 28470]);
  assert.deepEqual(pence("earnings", result), [24615, 25845, 26360]);
  assert.deepEqual(pence("prices", result), [25580, 25835, 27385]);
  assert.equal(result.rules.earnings.cashTotalPence, 3994640);
  near(result.rules.earnings.realTotalPence, 3670700.43);
});

test("falling prices and earnings, with and without the cash floor", () => {
  const floorOn = compareRules(24130, path([[-10, -20], [20, 10]]));
  assert.deepEqual(pence("triple-lock", floorOn), [24735, 25355]);
  assert.deepEqual(pence("double-lock", floorOn), [24130, 24615]);
  assert.deepEqual(pence("earnings", floorOn), [24130, 24370]);
  assert.equal(floorOn.rules.earnings.years[1].changePence, 0);
  near(floorOn.rules.earnings.realTotalPence, 2522375.92);

  const floorOff = compareRules(24130, path([[-10, -20], [20, 10]]), false);
  assert.deepEqual(pence("double-lock", floorOff), [23890, 24370]);
  assert.deepEqual(pence("earnings", floorOff), [23645, 23880]);
  assert.equal(floorOff.rules.earnings.years[1].changePence, -485);
  assert.equal(floorOff.rules.earnings.cashTotalPence, 2471300);
});

test("a lower amount than the triple lock is not a cash cut", () => {
  const result = compareRules(24130, path([[10, -20], [20, 30]]));
  assert.deepEqual(pence("earnings", result), [24130, 24855]);
  assert.ok(result.rules.earnings.years.every((year) => year.changePence >= 0));
  assert.ok(result.rules.earnings.years[2].differencePence < 0);
});

test("inputs are parsed exactly and bad text is refused", () => {
  assert.equal(parseTenths("4.8"), 48);
  assert.equal(parseTenths("-0.5"), -5);
  assert.equal(parseTenths("-0"), 0);
  assert.equal(parseTenths("3"), 30);
  assert.equal(parseTenths("4.85"), null);
  assert.equal(parseTenths("abc"), null);
  assert.equal(parseTenths(""), null);
  assert.equal(parsePence("241.30"), 24130);
  assert.equal(parsePence("241.3"), 24130);
  assert.equal(parsePence("£1,000"), 100000);
  assert.equal(parsePence("12.345"), null);
  assert.equal(parsePence("-5"), null);
});

test("the rule announced for April 2030 follows the reference in docs/reference-calculations.md, section 7", () => {
  const ifs = compareRules(24130, path([[20, 40], [20, 40], [20, 40], [20, 10], [20, 10], [20, 10], [20, 40], [20, 40], [20, 40], [20, 40]]));
  assert.deepEqual(pence("rule-2030", ifs), [25095, 26100, 27145, 27825, 28520, 29235, 29965, 30715, 31485, 32715]);
  assert.deepEqual(ifs.rules["rule-2030"].years.slice(1).map((year) => year.determining.join("+")),
    ["catch-up", "catch-up", "catch-up", "floor", "floor", "floor", "floor", "floor", "floor", "catch-up"]);
  assert.deepEqual(pence("rule-2030", compareRules(24130, path([[20, 37], [20, 37], [20, 37], [20, 37], [20, 37]]))),
    [25025, 25950, 26910, 27905, 28935]);
  const falling = compareRules(24130, path([[10, -10], [30, 60], [20, 35]]));
  assert.deepEqual(pence("rule-2030", falling), [24735, 25475, 26210]);
  assert.deepEqual(falling.rules["rule-2030"].years.slice(1).map((year) => year.determining[0]), ["floor", "prices", "catch-up"]);
});

test("the rule announced for April 2030 names every candidate in a tie, and the cash floor does not change it", () => {
  const tie = compareRules(24130, path([[40, 40]]));
  assert.deepEqual(tie.rules["rule-2030"].years[1].determining, ["prices", "catch-up"]);
  assert.equal(tie.rules["rule-2030"].years[1].pence, 25095);
  const deflation = path([[-10, -20], [20, 10]]);
  assert.deepEqual(pence("rule-2030", compareRules(24130, deflation, true)), pence("rule-2030", compareRules(24130, deflation, false)));
});

test("the rule announced for April 2030: the percentage shown, ties with the minimum, and 30 years", () => {
  const shown = (result, year) => (result.rules["rule-2030"].years[year].tenths / 10).toFixed(1);
  const ifs = compareRules(24130, path([[20, 40], [20, 40], [20, 40], [20, 10], [20, 10], [20, 10], [20, 40], [20, 40], [20, 40], [20, 40]]));
  assert.equal(shown(ifs, 10), "3.9");
  assert.equal(shown(compareRules(24130, path([[10, -10], [30, 60], [20, 35]])), 3), "2.9");
  const pricesAndFloor = compareRules(24130, path([[25, 10]])).rules["rule-2030"].years[1];
  assert.deepEqual([pricesAndFloor.pence, pricesAndFloor.determining], [24735, ["prices", "floor"]]);
  const allThree = compareRules(24130, path([[25, 25]])).rules["rule-2030"].years[1];
  assert.deepEqual([allThree.pence, allThree.determining], [24735, ["prices", "floor", "catch-up"]]);
  const thirty = compareRules(24130, path(Array(30).fill([20, 37]))).rules["rule-2030"];
  assert.equal(thirty.years[30].pence, 71765);
  assert.equal(thirty.cashTotalPence, 69425720);
});

test("the cash floor holds after rounding a starting amount that is not a multiple of 5p", () => {
  const amounts = (floor) => Object.fromEntries(Object.entries(compareRules(24132, path([[-10, -10]]), floor).rules).map(([rule, r]) => [rule, r.years[1].pence]));
  const on = amounts(true);
  for (const rule of ["double-lock", "earnings", "prices"]) assert.equal(on[rule], 24132, rule);
  assert.equal(amounts(false).prices, 23890);
});
