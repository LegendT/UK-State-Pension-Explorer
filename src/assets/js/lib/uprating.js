// Uprating arithmetic. No DOM and no formatting.
// Implements docs/model-specification.md sections 2 to 6 and 8.
// Money is whole pence. Percentages are tenths of a percentage point, so 4.8% is 48.

export const FLOOR_TENTHS = 25;
export const MIN_TENTHS = -100;
export const MAX_TENTHS = 250;
export const MIN_PENCE = 100;
export const MAX_PENCE = 100000;
export const WEEKS = 52;

// The first four are applied one year at a time, and the history explorer uses them.
// "rule-2030" depends on the whole path, so compareRules handles it separately.
export const RULES = ["triple-lock", "double-lock", "earnings", "prices", "rule-2030"];

export const RULE_LABELS = {
  "triple-lock": "Triple lock",
  "double-lock": "Double lock (prices or earnings)",
  earnings: "Earnings link",
  prices: "Prices link",
  "rule-2030": "Rule announced for April 2030",
};

export const MEASURE_LABELS = {
  prices: "prices",
  earnings: "earnings",
  floor: "the 2.5% minimum",
  "cash-floor": "the cash floor (0%)",
  "catch-up": "keeping pace with earnings",
};

// "4.8" -> 48. Returns null when the text is not a number with at most one decimal place.
export function parseTenths(text) {
  // Any number of digits, so a figure too large is refused by the caller's range check, which names the
  // limits, not as a malformed figure (as parsePence, W30).
  const match = /^\s*(-?)(\d+)(?:\.(\d))?\s*$/.exec(String(text));
  if (!match) return null;
  const tenths = Number(match[2]) * 10 + Number(match[3] || 0);
  return match[1] && tenths ? -tenths : tenths;
}

// "241.30" -> 24130. Returns null when the text is not pounds with at most two decimal places.
// A comma is accepted between thousands only, so "241,30" is refused, not read as £24,130.
export function parsePence(text) {
  // Any number of digits, so an amount too large is refused by the caller's range check, which
  // names the limit, not as a malformed amount (W30).
  const match = /^\s*£?\s*(\d+|\d{1,3}(?:,\d{3})+)(?:\.(\d{1,2}))?\s*$/.exec(String(text));
  if (!match) return null;
  return Number(match[1].replace(/,/g, "")) * 100 + Number((match[2] || "").padEnd(2, "0"));
}

export function upratingFor(rule, pricesTenths, earningsTenths, cashFloor = true) {
  const candidates = {
    "triple-lock": { prices: pricesTenths, earnings: earningsTenths, floor: FLOOR_TENTHS },
    "double-lock": { prices: pricesTenths, earnings: earningsTenths },
    earnings: { earnings: earningsTenths },
    prices: { prices: pricesTenths },
  }[rule];
  const highest = Math.max(...Object.values(candidates));
  if (highest < 0 && cashFloor) return { tenths: 0, determining: ["cash-floor"] };
  return {
    tenths: highest,
    determining: Object.keys(candidates).filter((name) => candidates[name] === highest),
  };
}

// Nearest 5p, exact half rounded up. Integer arithmetic throughout.
export function applyIncrease(pence, tenths) {
  const thousandths = pence * (1000 + tenths);
  return {
    unroundedPence: thousandths / 1000,
    pence: Math.floor((thousandths + 2500) / 5000) * 5,
  };
}

export function mechanism(startPence, pricesTenths, earningsTenths) {
  const { tenths, determining } = upratingFor("triple-lock", pricesTenths, earningsTenths);
  const { pence, unroundedPence } = applyIncrease(startPence, tenths);
  return {
    tenths,
    determining,
    unroundedPence,
    pence,
    increasePence: pence - startPence,
    annualPence: pence * WEEKS,
  };
}

// One year of the rule announced for April 2030 (docs/model-specification.md, section 3).
// The earnings target is startPence × targetNumerator ÷ targetDenominator, kept exact in
// BigInt. Every candidate is put over the common denominator 1000 × targetDenominator.
export function step2030(previousPence, input, startPence, targetNumerator, targetDenominator) {
  const common = 1000n * targetDenominator;
  const candidates = {
    prices: BigInt(previousPence) * BigInt(1000 + input.prices) * targetDenominator,
    floor: BigInt(previousPence) * BigInt(1000 + FLOOR_TENTHS) * targetDenominator,
    "catch-up": BigInt(startPence) * targetNumerator * 1000n,
  };
  const highest = Object.values(candidates).reduce((a, b) => (b > a ? b : a));
  const determining = Object.keys(candidates).filter((name) => candidates[name] === highest);
  // Nearest 5p, exact half rounded up: floor((2x + 5c) / 10c) × 5.
  const pence = Number(((2n * highest + 5n * common) / (10n * common)) * 5n);
  const tenths = determining.includes("prices") ? input.prices
    : determining.includes("floor") ? FLOOR_TENTHS
    : (Number(highest) / Number(common) / previousPence - 1) * 1000;
  return { pence, tenths, determining };
}

// path is [{ prices, earnings }] in tenths, one entry per year from year 1.
export function compareRules(startPence, path, cashFloor = true) {
  const indexes = [{ prices: 1, earnings: 1 }];
  for (const year of path) {
    const last = indexes[indexes.length - 1];
    indexes.push({
      prices: last.prices * (1 + year.prices / 1000),
      earnings: last.earnings * (1 + year.earnings / 1000),
    });
  }

  const rules = {};
  for (const rule of RULES) {
    const years = [{ year: 0, pence: startPence, tenths: null, determining: [], changePence: 0 }];
    let cashTotalPence = 0;
    let realTotalPence = 0;
    let targetNumerator = 1n;
    let targetDenominator = 1n;
    path.forEach((input, i) => {
      const previous = years[i].pence;
      let tenths, determining, pence;
      if (rule === "rule-2030") {
        targetNumerator *= BigInt(1000 + input.earnings);
        targetDenominator *= 1000n;
        ({ pence, tenths, determining } = step2030(previous, input, startPence, targetNumerator, targetDenominator));
      } else {
        ({ tenths, determining } = upratingFor(rule, input.prices, input.earnings, cashFloor));
        ({ pence } = applyIncrease(previous, tenths));
        // Rounding to 5p can take a starting amount that is not a multiple of 5p below where it
        // was, so the cash floor is applied after rounding as well. The history explorer does not
        // need this: it starts from published rates, which are always multiples of 5p.
        if (cashFloor) pence = Math.max(pence, previous);
      }
      years.push({ year: i + 1, pence, tenths, determining, changePence: pence - previous });
      cashTotalPence += pence * WEEKS;
      realTotalPence += (pence / indexes[i + 1].prices) * WEEKS;
    });
    years.forEach((entry, i) => {
      entry.realPence = entry.pence / indexes[i].prices;
      entry.earningsIndex = (entry.pence / startPence / indexes[i].earnings) * 100;
    });
    rules[rule] = { years, cashTotalPence, realTotalPence };
  }

  for (const rule of RULES) {
    rules[rule].years.forEach((entry, i) => {
      entry.differencePence = entry.pence - rules["triple-lock"].years[i].pence;
    });
    rules[rule].cashTotalDifferencePence =
      rules[rule].cashTotalPence - rules["triple-lock"].cashTotalPence;
    rules[rule].realTotalDifferencePence =
      rules[rule].realTotalPence - rules["triple-lock"].realTotalPence;
  }
  return { indexes, rules };
}
