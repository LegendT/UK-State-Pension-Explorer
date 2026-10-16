// Line chart as an SVG string. Used by the build for the default view and by the
// browser when a reader changes a tool, so both draw the same picture. No DOM.
// Series are told apart by dash pattern and marker shape as well as colour.

// The width the build draws at. A tool draws at the width it has, up to this, so the chart's text
// keeps the size the stylesheet sets: a 720 chart shown at 320 px had 8 px text (W20).
export const CHART_WIDTH = 720;
// Narrower than this, the chart is laid out for a phone: names inside the plot, fewer years named.
const NARROW = 600;
const DASHES = ["", "8 4", "2 4", "10 4 2 4", "12 3 3 3 3 3"];
// Values closer than this share of the larger read as the same in titles and lines (W21): rounding to
// 5p alone moves rules this far apart, 10p in 30 years of steady growth, which no chart can show.
export const NEAR = 0.001;
export const near = (a, b) => a === b || (a !== null && b !== null && Math.abs(a - b) <= NEAR * Math.max(Math.abs(a), Math.abs(b)));
// A short range is drawn on a value axis at least this share of its highest value tall, so a rise
// of £8.45 does not fill the plot (W21).
const MIN_SPAN = 0.1;
const LINE = 15;

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
  // Counted in whole steps: adding a step that is tiny beside the value would never move it,
  // and the loop would not end.
  for (let k = Math.ceil(min / step); k * step <= max + step / 1000; k += 1) out.push(Number((k * step).toFixed(6)));
  return out;
}

// Series that are the same, or nearly the same, in every year are drawn as one line, so no line
// hides another, and the line is named by every series in it. A merged line keeps the style of
// its first series, so a series looks the same in every result.
// "A, b and c": the first name as written, the rest lower-cased to sit inside a sentence.
function joinNames(names) {
  const words = names.map((name, i) => (i === 0 ? name : name.charAt(0).toLowerCase() + name.slice(1)));
  return words.length === 1 ? words[0] : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function mergeClose(series) {
  const groups = [];
  series.forEach((s, style) => {
    const same = groups.find((g) => g.values.length === s.values.length && g.values.every((v, i) => near(v, s.values[i])));
    if (same) same.members.push(s);
    else groups.push({ values: s.values, members: [s], style });
  });
  return groups.map((g) => {
    const names = g.members.map((m) => m.label);
    const joined = joinNames(names);
    const exact = g.members.every((m) => m.values.every((v, i) => v === g.values[i]));
    return {
      values: g.values,
      style: g.style,
      label: names.length === 1 ? joined : `${joined}: ${exact ? "the same" : "less than 0.1% apart"} in every year`,
      short: g.members.map((m) => m.short || m.label),
    };
  });
}

// series: [{ label, short?, values: [number|null] }]. labels: x-axis labels, one per value.
// marks: [{ index, number }] draws a dotted line at a year with a numbered marker; the page lists what each number means.
// width: the width to draw at, in CSS pixels.
export function lineChart({ id, title, labels, series: input, yLabel, yPrefix = "", xLabel, marks = [], width = CHART_WIDTH }) {
  const series = mergeClose(input);
  const W = Math.round(width);
  const narrow = W < NARROW;
  const H = narrow ? 300 : 380;
  // right leaves room for the name written after the end of each line; a phone has the names inside.
  const left = 64;
  const right = narrow ? 16 : 120;
  const innerW = W - left - right;
  const x = (i) => left + (labels.length > 1 ? (i / (labels.length - 1)) * innerW : innerW / 2);
  // A marked year's number sits in a band above the plot, so it never covers a point. A number
  // closer than a marker's width to the one before it goes up a row.
  const rowOf = [];
  const rowEnds = [];
  marks.forEach((m) => {
    let row = 0;
    while (rowEnds[row] !== undefined && x(m.index) - rowEnds[row] < 22) row += 1;
    rowEnds[row] = x(m.index);
    rowOf.push(row);
  });
  const PAD = { top: marks.length ? 10 + rowEnds.length * 22 : 16, right, bottom: narrow ? 48 : 56, left };
  const all = series.flatMap((s) => s.values).filter((v) => v !== null);
  let low = Math.min(...all);
  let high = Math.max(...all);
  const minSpan = Math.abs(high) * MIN_SPAN;
  if (high - low < minSpan) {
    const middle = (high + low) / 2;
    low = middle - minSpan / 2;
    high = low + minSpan;
  }
  // After the minimum span, only values that are all zero leave no spread.
  const spread = high - low;
  const margin = spread ? spread * 0.08 : 0.08;
  const yTicks = ticks(low - margin, high + margin);
  const yMin = Math.min(yTicks[0], low - margin);
  const yMax = Math.max(yTicks[yTicks.length - 1], high + margin);
  const innerH = H - PAD.top - PAD.bottom;
  const y = (v) => PAD.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
  // A phone names the first and last years and those between that sit at least 72 px after the one
  // before. The last is right-aligned to the line's end, so its centre is half its width further left:
  // 7.5 px a character at 13 px. 72 px keeps names of up to 7 characters, "Start" or "2026/27",
  // about 20 px clear. Spacing them evenly put two years too close: rounding, and the right-aligned
  // last year, which the old pick ignored (W37).
  const last = labels.length - 1;
  const named = new Set(narrow ? [0, last] : labels.map((_, i) => i).filter((i) => i % Math.ceil(labels.length / 10) === 0));
  if (narrow) {
    const lastCentre = x(last) - (String(labels[last]).length * 7.5) / 2;
    let previous = x(0);
    for (let i = 1; i < last; i += 1) {
      if (x(i) - previous >= 72 && lastCentre - x(i) >= 72) {
        named.add(i);
        previous = x(i);
      }
    }
  }

  const grid = yTicks
    .map(
      (t) =>
        `<line class="chart-grid" x1="${PAD.left}" x2="${W - PAD.right}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}"/>` +
        `<text class="chart-tick" x="${PAD.left - 8}" y="${(y(t) + 5).toFixed(1)}" text-anchor="end">${yPrefix}${t.toLocaleString("en-GB")}</text>`,
    )
    .join("");

  const xAxis = labels
    .map((label, i) =>
      named.has(i)
        ? `<text class="chart-tick" x="${x(i).toFixed(1)}" y="${H - PAD.bottom + 20}" text-anchor="${narrow && labels.length > 1 && i === labels.length - 1 ? "end" : "middle"}">${escape(label)}</text>`
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

  // Each line is named at its end: after it, or on a phone above it, inside the plot. Names
  // closer than a line of text are moved apart, and on a phone kept above the axis.
  const ends = series
    .map((s) => {
      // Not findLastIndex: Safari before 15.4 does not have it.
      let i = s.values.length - 1;
      while (i > 0 && s.values[i] === null) i -= 1;
      // y is the first name's baseline. After a line the names are centred on its end. On a phone one
      // name sits above the end, and the names of a merged line are centred beside it, to its left,
      // where a stack above would run down over the line.
      const extra = (s.short.length - 1) * LINE;
      const stacked = narrow && extra > 0;
      const top = y(s.values[i]) + (narrow && !stacked ? -10 : 4 - extra / 2);
      return { index: s.style, text: s.short, x: narrow ? x(i) - (stacked ? 10 : 0) : x(i) + 8, y: Math.max(12, top) };
    })
    .sort((a, b) => a.y - b.y);
  ends.forEach((end, i) => {
    const below = i > 0 ? ends[i - 1].y + ends[i - 1].text.length * LINE : 0;
    if (i > 0 && end.y < below) end.y = below;
  });
  const lastEnd = ends[ends.length - 1];
  const over = narrow ? Math.max(0, lastEnd.y + (lastEnd.text.length - 1) * LINE - (H - PAD.bottom - 6)) : 0;
  const endLabels = ends
    .map(
      (end) =>
        `<text class="chart-end chart-series--${end.index + 1}" x="${end.x.toFixed(1)}" y="${(end.y - over).toFixed(1)}" text-anchor="${narrow ? "end" : "start"}">` +
        end.text.map((text, k) => `<tspan x="${end.x.toFixed(1)}" dy="${k ? LINE : 0}">${escape(text)}</tspan>`).join("") +
        `</text>`,
    )
    .join("");

  const markLines = marks
    .map((m, k) => {
      const mx = x(m.index).toFixed(1);
      const cy = PAD.top - 13 - rowOf[k] * 22;
      return (
        `<line class="chart-mark" x1="${mx}" x2="${mx}" y1="${cy + 9}" y2="${H - PAD.bottom}"/>` +
        `<circle class="chart-mark-dot" cx="${mx}" cy="${cy}" r="9"/>` +
        `<text class="chart-mark-number" x="${mx}" y="${cy + 4}" text-anchor="middle">${m.number}</text>`
      );
    })
    .join("");

  // A value axis that does not start at zero is marked on the axis and said in words (W21).
  const fromZero = yMin <= 0;
  const zeroBreak = fromZero
    ? ""
    : `<path class="chart-break" d="M${PAD.left - 10} ${H - PAD.bottom + 5}l6 -10M${PAD.left - 4} ${H - PAD.bottom + 5}l6 -10"/>`;
  const zeroNote = fromZero ? "" : `<p class="chart-note">The scale starts above zero.</p>`;

  const legend = series
    .map(
      ({ style, label }) =>
        `<li><svg class="chart-key chart-series chart-series--${style + 1}" viewBox="0 0 44 12" width="44" height="12" aria-hidden="true" focusable="false"><path d="M0 6H44" fill="none" stroke-dasharray="${DASHES[style % DASHES.length]}"/><g class="chart-marks">${marker(style, 22, 6)}</g></svg> ${escape(label)}</li>`,
    )
    .join("");

  return (
    // Named by its title alone. What it shows is in chartSummary, printed before it. Everything drawn
    // is hidden from screen readers: VoiceOver with Safari read the text inside an image, an axis
    // value or a line's name, in place of its title (step 4).
    `<svg class="chart-svg${narrow ? " chart-svg--narrow" : ""}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-title">` +
    `<title id="${id}-title">${escape(title)}</title><g aria-hidden="true">` +
    grid +
    `<line class="chart-axis" x1="${PAD.left}" x2="${W - PAD.right}" y1="${H - PAD.bottom}" y2="${H - PAD.bottom}"/>` +
    zeroBreak +
    xAxis +
    markLines +
    `<text class="chart-label" x="${PAD.left + innerW / 2}" y="${H - 8}" text-anchor="middle">${escape(xLabel)}</text>` +
    `<text class="chart-label" transform="rotate(-90)" x="${-(PAD.top + innerH / 2)}" y="16" text-anchor="middle">${escape(yLabel)}</text>` +
    lines +
    endLabels +
    `</g></svg><ul class="chart-legend">${legend}</ul>${zeroNote}`
  );
}

// What a chart shows, as a paragraph printed before it: what its lines are, and each line's first
// and last value, which a sighted reader takes from the chart at a glance. A paragraph, not the
// image's description: VoiceOver with Safari read a description only as a hint, after a pause, so
// it went unheard (step 4, decision 104).
export function chartSummary({ description, labels, series, format }) {
  const last = labels.length - 1;
  const at = (i) => (labels[i] === "Start" ? "at the start" : `in ${labels[i]}`);
  const lines = series.map(({ label, values }) => ({ label, from: format(values[0]), to: format(values[last]) }));
  let ends;
  if (lines.length > 1 && lines.every((line) => line.from === lines[0].from)) {
    // Lines that start together, as the rules do: the start once, then where they end, with the
    // lines that end at the same amount named together.
    const groups = [];
    for (const line of lines) {
      const group = groups.find((item) => item.to === line.to);
      if (group) group.names.push(line.label);
      else groups.push({ to: line.to, names: [line.label] });
    }
    const start = labels[0] === "Start" ? "" : ` ${at(0)}`;
    ends = `All start at ${lines[0].from}${start}. ${at(last).replace(/^i/, "I")}: ${groups.map((group) => `${joinNames(group.names)} ${group.to}`).join("; ")}.`;
  } else {
    ends = lines.map((line) => `${line.label}: ${line.from} ${at(0)}, ${line.to} ${at(last)}.`).join(" ");
  }
  return `<p class="chart-summary">${escape(`${description} ${ends} The table after the chart gives every value.`)}</p>`;
}
