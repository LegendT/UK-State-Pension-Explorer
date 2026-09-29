// Uprating arithmetic. No DOM and no formatting.
// Implements docs/model-specification.md sections 2 to 6 and 8.
// Money is whole pence. Percentages are tenths of a percentage point, so 4.8% is 48.

export const FLOOR_TENTHS = 25;
export const MIN_TENTHS = -100;
export const MAX_TENTHS = 250;
export const MIN_PENCE = 100;
export const MAX_PENCE = 100000;
export const WEEKS = 52;

export const RULES = ["triple-lock", "double-lock", "earnings", "prices"];

export const RULE_LABELS = {
  "triple-lock": "Triple lock",
  "double-lock": "Double lock (prices or earnings)",
  earnings: "Earnings link",
  prices: "Prices link",
};

export const MEASURE_LABELS = {
  prices: "prices",
  earnings: "earnings",
  floor: "the 2.5% minimum",
  "cash-floor": "the cash floor (0%)",
};

// "4.8" -> 48. Returns null when the text is not a number with at most one decimal place.
export function parseTenths(text) {
  const match = /^\s*(-?)(\d{1,3})(?:\.(\d))?\s*$/.exec(String(text));
  if (!match) return null;
  const tenths = Number(match[2]) * 10 + Number(match[3] || 0);
  return match[1] && tenths ? -tenths : tenths;
}

// "241.30" -> 24130. Returns null when the text is not pounds with at most two decimal places.
export function parsePence(text) {
  const match = /^\s*£?\s*(\d{1,7})(?:\.(\d{1,2}))?\s*$/.exec(String(text).replace(/,/g, ""));
  if (!match) return null;
  return Number(match[1]) * 100 + Number((match[2] || "").padEnd(2, "0"));
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
    path.forEach((input, i) => {
      const previous = years[i].pence;
      const { tenths, determining } = upratingFor(rule, input.prices, input.earnings, cashFloor);
      const { pence } = applyIncrease(previous, tenths);
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
