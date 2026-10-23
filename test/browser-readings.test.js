import { test } from "node:test";
import assert from "node:assert/strict";
import { readingOf } from "../scripts/browser-readings.mjs";

const figures = { a: { source_id: "s", passage: "one" }, b: { source_id: "s", passage: "two" }, c: { source_id: "s" } };
const claims = { d: { source_id: "t", passage: "three" } };
const at = (date) => ({ date, browser: "Chrome 155" });

test("a refused source's reading is due once its oldest passage is past the limit", () => {
  const readings = { a: at("2026-09-07"), b: at("2026-10-19") };
  assert.equal(readingOf("s", figures, claims, readings, "2026-10-22", 45).due, false);
  const late = readingOf("s", figures, claims, readings, "2026-10-23", 45);
  assert.equal(late.due, true);
  assert.deepEqual(late.old, ["a"]);
  assert.equal(late.oldest.date, "2026-09-07");
  assert.equal(late.passages, 2);
});

test("a passage never read in a browser makes the reading due", () => {
  const r = readingOf("s", figures, claims, { b: at("2026-10-19") }, "2026-10-23", 45);
  assert.deepEqual([r.due, r.unread, r.old], [true, ["a"], []]);
});

test("a source that quotes no passage is never due", () => {
  assert.equal(readingOf("u", figures, claims, {}, "2026-10-23", 45).due, false);
});
