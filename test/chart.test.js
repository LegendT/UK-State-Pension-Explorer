// The line chart drawn for a phone (W20): its width, the years it names and the marked years. Its
// tolerance, minimum span and zero mark (W21).
import { test } from "node:test";
import assert from "node:assert/strict";
import { chartSummary, lineChart } from "../src/assets/js/lib/chart.js";

const labels = Array.from({ length: 11 }, (_, i) => `${2016 + i}/${String(17 + i).padStart(2, "0")}`);
const options = {
  id: "c",
  title: "Title",
  labels,
  series: [{ label: "Rate", values: labels.map((_, i) => 200 + i * 5) }],
  yLabel: "Pounds a week",
  xLabel: "Tax year",
  // Two marked years side by side, and one at the first year.
  marks: [{ index: 0, number: 1 }, { index: 5, number: 2 }, { index: 6, number: 3 }],
};
const ticks = (svg) => [...svg.matchAll(/class="chart-tick" x="[\d.]+" y="[\d.]+" text-anchor="(\w+)">([^<]+)</g)].map((m) => m[2]).filter((t) => t.includes("/"));
const dots = (svg) => [...svg.matchAll(/class="chart-mark-dot" cx="([\d.]+)" cy="([\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2])]);
const plotTop = (svg) => Math.min(...[...svg.matchAll(/class="chart-grid" x1="[\d.]+" x2="[\d.]+" y1="([\d.]+)"/g)].map((m) => Number(m[1])));

test("a phone draws at the width it is given and names the first and last years", () => {
  const svg = lineChart({ ...options, width: 290 });
  assert.match(svg, /viewBox="0 0 290 300"/);
  assert.match(svg, /chart-svg--narrow/);
  const named = ticks(svg);
  assert.equal(named[0], "2016/17");
  assert.equal(named[named.length - 1], "2026/27");
  assert.ok(named.length <= 4);
  // The line's name sits inside the plot, ending at its last point.
  assert.match(svg, /class="chart-end chart-series--1" x="274.0" y="[\d.]+" text-anchor="end"/);
});

test("at 320 px, a 220 chart names only the first and last years, inside its width", () => {
  const svg = lineChart({ ...options, width: 220 });
  assert.match(svg, /viewBox="0 0 220 300"/);
  assert.deepEqual(ticks(svg), ["2016/17", "2026/27"]);
  assert.match(svg, /class="chart-tick" x="204.0" y="[\d.]+" text-anchor="end">2026\/27</);
  assert.match(svg, /class="chart-end chart-series--1" x="204.0" y="[\d.]+" text-anchor="end"/);
});

test("on a phone no two year names overlap, the last one right-aligned (W37)", () => {
  const year = (y) => `${y}/${String((y + 1) % 100).padStart(2, "0")}`;
  // The rule comparison's axis, "Start" then ten years: at 400 px "2043/44" ran into "2045/46".
  // The history explorer's, 2010/11 to 2026/27.
  const axes = [
    ["Start", ...Array.from({ length: 10 }, (_, i) => year(2036 + i))],
    Array.from({ length: 17 }, (_, i) => year(2010 + i)),
  ];
  // Measured in Chrome on 15 October 2026: "2039/40" is 53 px wide at 13 px, about 7.5 a
  // character. The code uses the same estimate; the drawn chart was looked at at 360 to 430 px.
  const edges = (m) => {
    const w = m[4].length * 7.5;
    const at = Number(m[1]);
    return m[3] === "end" ? [at - w, at] : [at - w / 2, at + w / 2];
  };
  for (const years of axes) {
    for (let width = 260; width < 600; width += 10) {
      const svg = lineChart({ ...options, labels: years, series: [{ label: "Rate", values: years.map((_, i) => 240 + i * 10) }], marks: [], width });
      const named = [...svg.matchAll(/class="chart-tick" x="([\d.]+)" y="([\d.]+)" text-anchor="(\w+)">([^<]+)</g)].filter((m) => years.includes(m[4]));
      const lastName = named[named.length - 1];
      assert.equal(named[0][4], years[0], `first name at ${width}`);
      assert.equal(lastName[4], years[years.length - 1], `last name at ${width}`);
      assert.equal(lastName[3], "end", `last name right-aligned at ${width}`);
      for (let k = 1; k < named.length; k += 1) {
        const gap = edges(named[k])[0] - edges(named[k - 1])[1];
        assert.ok(gap >= 12, `${named[k - 1][4]} and ${named[k][4]} are ${gap.toFixed(1)} px apart at ${width}`);
      }
    }
  }
});

test("the build draws at 720 with the names after the lines", () => {
  const svg = lineChart(options);
  assert.match(svg, /viewBox="0 0 720 380"/);
  assert.doesNotMatch(svg, /chart-svg--narrow/);
  assert.match(svg, /class="chart-end chart-series--1" x="[\d.]+" y="[\d.]+" text-anchor="start"/);
});

test("marked years sit above the plot, and side by side on a phone they take two rows", () => {
  const svg = lineChart({ ...options, width: 290 });
  const [first, second, third] = dots(svg);
  // Above every grid line, so a number never covers a point.
  for (const [, cy] of [first, second, third]) assert.ok(cy + 9 <= plotTop(svg), `${cy} is in the plot`);
  assert.equal(first[1], second[1]);
  assert.ok(third[1] < second[1], "the next year's number goes up a row");
  // At 720 the same years are far enough apart for one row.
  assert.equal(new Set(dots(lineChart(options)).map(([, cy]) => cy)).size, 1);
});

// W21: lines less than 0.1% apart read as one and are named, short ranges get a minimum span, and an
// axis that does not start at zero says so.
test("lines less than 0.1% apart in every year are drawn as one line that names each of them", () => {
  const series = [
    { label: "Triple lock", short: "Triple lock", values: [241.3, 300, 717.55] },
    { label: "Rule announced for April 2030", short: "April 2030 rule", values: [241.3, 300, 717.65] },
    { label: "Prices link", short: "Prices link", values: [241.3, 260, 436.9] },
  ];
  const svg = lineChart({ ...options, labels: ["a", "b", "c"], marks: [], series });
  assert.equal((svg.match(/<g class="chart-series /g) || []).length, 2);
  assert.match(svg, /<tspan[^>]*>Triple lock<\/tspan><tspan[^>]*>April 2030 rule<\/tspan>/);
  assert.match(svg, /Triple lock and rule announced for April 2030: less than 0.1% apart in every year/);
  // 20p apart on £300 is more than 0.1%, so two lines.
  const apart = lineChart({ ...options, labels: ["a", "b"], marks: [], series: [{ label: "A", values: [300, 300] }, { label: "B", values: [300, 300.4] }] });
  assert.equal((apart.match(/<g class="chart-series /g) || []).length, 2);
});

test("a short range is drawn on an axis at least a tenth of its highest value tall, and says it is not from zero", () => {
  const svg = lineChart({ ...options, labels: ["2025/26", "2026/27"], marks: [], series: [{ label: "Rate", values: [230.25, 241.3] }] });
  const values = [...svg.matchAll(/class="chart-tick" x="[\d.]+" y="[\d.]+" text-anchor="end">([\d,.]+)</g)].map((m) => Number(m[1].replace(",", "")));
  // The axis spans at least a tenth of 241.3, which is 24.13; the ticks on it are rounded to 5, so the
  // labelled ticks span at least 20. The bound is on the ticks, the only thing the markup shows.
  assert.ok(Math.max(...values) - Math.min(...values) >= 20, values.join(","));
  assert.match(svg, /class="chart-break"/);
  assert.match(svg, /<p class="chart-note">The scale starts above zero.<\/p>/);
  const fromZero = lineChart({ ...options, labels: ["a", "b"], marks: [], series: [{ label: "Rate", values: [0, 50] }] });
  assert.doesNotMatch(fromZero, /chart-break|chart-note/);
});

// Step 4: VoiceOver with Safari left a chart's description unheard, so what it shows is a paragraph.
test("a chart's summary gives each line's first and last value, and a shared start once", () => {
  const format = (v) => `£${v.toFixed(2)}`;
  const apart = chartSummary({ description: "Two series.", labels: ["2025/26", "2026/27"], series: [{ label: "Published rate", values: [230.25, 241.3] }, { label: "Calculated", values: [229, 240] }], format });
  assert.equal(apart, `<p class="chart-summary">Two series. Published rate: £230.25 in 2025/26, £241.30 in 2026/27. Calculated: £229.00 in 2025/26, £240.00 in 2026/27. The table after the chart gives every value.</p>`);
  // Lines ending at the same amount are named together, as the chart draws them as one line.
  const together = chartSummary({
    description: "Three rules.",
    labels: ["Start", "2027/28"],
    series: [{ label: "Triple lock", values: [241.3, 260] }, { label: "Prices link", values: [241.3, 250] }, { label: "Earnings link", values: [241.3, 260] }],
    format,
  });
  assert.equal(together, `<p class="chart-summary">Three rules. All start at £241.30. In 2027/28: Triple lock and earnings link £260.00; Prices link £250.00. The table after the chart gives every value.</p>`);
  assert.doesNotMatch(lineChart(options), /<desc|aria-describedby/);
});
