// Line chart as an SVG string. Used by the build for the default view and by the
// browser when a reader changes a tool, so both draw the same picture. No DOM.
// Series are told apart by dash pattern and marker shape as well as colour.

const W = 720;
const H = 380;
const PAD = { top: 16, right: 16, bottom: 56, left: 64 };
const DASHES = ["", "8 4", "2 4", "10 4 2 4", "12 3 3 3 3 3"];

const escape = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function marker(index, x, y) {
  const shapes = [
    `<circle cx="${x}" cy="${y}" r="4"/>`,
    `<rect x="${x - 4}" y="${y - 4}" width="8" height="8"/>`,
    `<path d="M${x} ${y - 5}L${x + 5} ${y + 4}L${x - 5} ${y + 4}Z"/>`,
    `<path d="M${x} ${y - 5}L${x + 5} ${y}L${x} ${y + 5}L${x - 5} ${y}Z"/>`,
    `<path d="M${x} ${y + 5}L${x + 5} ${y - 4}L${x - 5} ${y - 4}Z"/>`,
  ];
  return shapes[index % shapes.length];
}

function ticks(min, max) {
  const span = max - min || 1;
  const rough = span / 5;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => span / s <= 6);
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step / 1000; v += step) out.push(Number(v.toFixed(6)));
  return out;
}

// series: [{ label, values: [number|null] }]. labels: x-axis labels, one per value.
export function lineChart({ id, title, description, labels, series, yLabel, yPrefix = "", xLabel }) {
  const all = series.flatMap((s) => s.values).filter((v) => v !== null);
  const low = Math.min(...all);
  const high = Math.max(...all);
  const margin = (high - low || 1) * 0.08;
  const yTicks = ticks(low - margin, high + margin);
  const yMin = Math.min(yTicks[0], low - margin);
  const yMax = Math.max(yTicks[yTicks.length - 1], high + margin);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (labels.length > 1 ? (i / (labels.length - 1)) * innerW : innerW / 2);
  const y = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  const every = Math.ceil(labels.length / 10);

  const grid = yTicks
    .map(
      (t) =>
        `<line class="chart-grid" x1="${PAD.left}" x2="${W - PAD.right}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>` +
        `<text class="chart-tick" x="${PAD.left - 8}" y="${(y(t) + 5).toFixed(1)}" text-anchor="end">${yPrefix}${t.toLocaleString("en-GB")}</text>`,
    )
    .join("");

  const xAxis = labels
    .map((label, i) =>
      i % every === 0
        ? `<text class="chart-tick" x="${x(i).toFixed(1)}" y="${H - PAD.bottom + 20}" text-anchor="middle">${escape(label)}</text>`
        : "",
    )
    .join("");

  const lines = series
    .map((s, index) => {
      const points = s.values.map((v, i) => (v === null ? null : [x(i).toFixed(1), y(v).toFixed(1)]));
      const d = points
        .map((p, i) => (p ? `${i === 0 || !points[i - 1] ? "M" : "L"}${p[0]} ${p[1]}` : ""))
        .join("");
      const marks = points.map((p) => (p ? marker(index, Number(p[0]), Number(p[1])) : "")).join("");
      return `<g class="chart-series chart-series--${index + 1}"><path d="${d}" fill="none" stroke-dasharray="${DASHES[index % DASHES.length]}"/><g class="chart-marks">${marks}</g></g>`;
    })
    .join("");

  const legend = series
    .map(
      (s, index) =>
        `<li><svg class="chart-key chart-series chart-series--${index + 1}" viewBox="0 0 44 12" width="44" height="12" aria-hidden="true" focusable="false"><path d="M0 6H44" fill="none" stroke-dasharray="${DASHES[index % DASHES.length]}"/><g class="chart-marks">${marker(index, 22, 6)}</g></svg> ${escape(s.label)}</li>`,
    )
    .join("");

  return (
    `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-title ${id}-desc">` +
    `<title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(description)}</desc>` +
    grid +
    `<line class="chart-axis" x1="${PAD.left}" x2="${W - PAD.right}" y1="${H - PAD.bottom}" y2="${H - PAD.bottom}"/>` +
    xAxis +
    `<text class="chart-label" x="${PAD.left + innerW / 2}" y="${H - 8}" text-anchor="middle">${escape(xLabel)}</text>` +
    `<text class="chart-label" transform="rotate(-90)" x="${-(PAD.top + innerH / 2)}" y="16" text-anchor="middle">${escape(yLabel)}</text>` +
    lines +
    `</svg><ul class="chart-legend">${legend}</ul>`
  );
}
