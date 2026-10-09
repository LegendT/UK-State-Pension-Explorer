// The line chart drawn for a phone (W20): its width, the years it names and the marked years.
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
