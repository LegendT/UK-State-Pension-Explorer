// Line chart as an SVG string. Used by the build for the default view and by the
// browser when a reader changes a tool, so both draw the same picture. No DOM.
// Series are told apart by dash pattern and marker shape as well as colour.

const W = 720;
const H = 380;
// right leaves room for the name written after the end of each line.
const PAD = { top: 16, right: 120, bottom: 56, left: 64 };
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

const COUNT = { 2: "Two", 3: "Three", 4: "Four", 5: "Five" };

// Series whose values are the same in every year are drawn as one line, so no line hides another.
// A merged line keeps the style of its first series, so a series looks the same in every result.
function mergeIdentical(series, noun) {
  const groups = [];
  series.forEach((s, style) => {
    const same = groups.find((g) => g.values.length === s.values.length && g.values.every((v, i) => v === s.values[i]));
    if (same) same.members.push(s);
    else groups.push({ values: s.values, members: [s], style });
  });
  return groups.map((g) => {
    const names = g.members.map((m, i) => (i === 0 ? m.label : m.label.charAt(0).toLowerCase() + m.label.slice(1)));
    const joined = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
    const short = g.members[0].short || g.members[0].label;
    return {
      values: g.values,
      style: g.style,
      label: names.length === 1 ? joined : `${joined}: the same in every year`,
      short: names.length === 1 ? short : `${COUNT[names.length]} ${noun}`,
    };
  });
}

// series: [{ label, short?, values: [number|null] }]. labels: x-axis labels, one per value.
// noun names what the series are, for the label of a merged line: "Three rules".
// marks: [{ index, number }] draws a dotted line at a year with a numbered marker; the page lists what each number means.
export function lineChart({ id, title, description, labels, series: input, yLabel, yPrefix = "", xLabel, marks = [], noun = "lines" }) {
  const series = mergeIdentical(input, noun);
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
    .map((s) => {
      const index = s.style;
      const points = s.values.map((v, i) => (v === null ? null : [x(i).toFixed(1), y(v).toFixed(1)]));
      const d = points
        .map((p, i) => (p ? `${i === 0 || !points[i - 1] ? "M" : "L"}${p[0]} ${p[1]}` : ""))
        .join("");
      const marks = points.map((p) => (p ? marker(index, Number(p[0]), Number(p[1])) : "")).join("");
      return `<g class="chart-series chart-series--${index + 1}"><path d="${d}" fill="none" stroke-dasharray="${DASHES[index % DASHES.length]}"/><g class="chart-marks">${marks}</g></g>`;
    })
    .join("");

  // Each line is named at its end. Names closer than a line of text are moved apart.
  const ends = series
    .map((s) => {
      const i = s.values.findLastIndex((v) => v !== null);
      return { index: s.style, text: s.short, x: x(i) + 8, y: y(s.values[i]) + 4 };
    })
    .sort((a, b) => a.y - b.y);
  ends.forEach((end, i) => {
    if (i > 0 && end.y - ends[i - 1].y < 15) end.y = ends[i - 1].y + 15;
  });
  const endLabels = ends
    .map((end) => `<text class="chart-end chart-series--${end.index + 1}" x="${end.x.toFixed(1)}" y="${end.y.toFixed(1)}" text-anchor="start">${escape(end.text)}</text>`)
    .join("");

  const markLines = marks
    .map((m) => {
      const mx = x(m.index).toFixed(1);
      return (
        `<line class="chart-mark" x1="${mx}" x2="${mx}" y1="${PAD.top}" y2="${H - PAD.bottom}"/>` +
        `<circle class="chart-mark-dot" cx="${mx}" cy="${H - PAD.bottom - 11}" r="9"/>` +
        `<text class="chart-mark-number" x="${mx}" y="${H - PAD.bottom - 7}" text-anchor="middle">${m.number}</text>`
      );
    })
    .join("");

  const legend = series
    .map(
      ({ style, label }) =>
        `<li><svg class="chart-key chart-series chart-series--${style + 1}" viewBox="0 0 44 12" width="44" height="12" aria-hidden="true" focusable="false"><path d="M0 6H44" fill="none" stroke-dasharray="${DASHES[style % DASHES.length]}"/><g class="chart-marks">${marker(style, 22, 6)}</g></svg> ${escape(label)}</li>`,
    )
    .join("");

  return (
    `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-title ${id}-desc">` +
    `<title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(description)}</desc>` +
    grid +
    `<line class="chart-axis" x1="${PAD.left}" x2="${W - PAD.right}" y1="${H - PAD.bottom}" y2="${H - PAD.bottom}"/>` +
    xAxis +
    markLines +
    `<text class="chart-label" x="${PAD.left + innerW / 2}" y="${H - 8}" text-anchor="middle">${escape(xLabel)}</text>` +
    `<text class="chart-label" transform="rotate(-90)" x="${-(PAD.top + innerH / 2)}" y="16" text-anchor="middle">${escape(yLabel)}</text>` +
    lines +
    endLabels +
    `</svg><ul class="chart-legend">${legend}</ul>`
  );
}
