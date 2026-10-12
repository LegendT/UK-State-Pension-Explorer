// The line chart drawn for a phone (W20): its width, the years it names and the marked years. Its
// tolerance, minimum span and zero mark (W21).
import { test } from "node:test";
import assert from "node:assert/strict";
import { lineChart } from "../src/assets/js/lib/chart.js";

const labels = Array.from({ length: 11 }, (_, i) => `${2016 + i}/${String(17 + i).padStart(2, "0")}`);
const options = {
  id: "c",
  title: "Title",
  description: "Description",
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
  assert.ok(Math.max(...values) - Math.min(...values) >= 20, values.join(","));
  assert.match(svg, /class="chart-break"/);
  assert.match(svg, /<p class="chart-note">The scale starts above zero.<\/p>/);
  assert.match(svg, /<desc[^>]*>[^<]*The scale starts above zero.<\/desc>/);
  const fromZero = lineChart({ ...options, labels: ["a", "b"], marks: [], series: [{ label: "Rate", values: [0, 50] }] });
  assert.doesNotMatch(fromZero, /chart-break|chart-note/);
});
