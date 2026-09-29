// Formatting shared by the build and the browser. No DOM.

const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

export function money(pence) {
  const text = pounds.format(Math.abs(pence) / 100);
  return pence < -0.5 ? `-${text}` : text;
}

export function percent(tenths) {
  return `${(tenths / 10).toFixed(1)}%`;
}

export function plain(value, digits = 1) {
  return digits === 1 ? number.format(value) : value.toLocaleString("en-GB", { maximumFractionDigits: digits });
}

export function list(items) {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
