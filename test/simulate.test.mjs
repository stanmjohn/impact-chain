// The draws. Same seed, same numbers, and a spread that stays inside its bounds.

import { test } from "node:test";
import assert from "node:assert/strict";
import { rng, triangular, percentile } from "../src/simulate.mjs";

test("the same seed gives the same draws", () => {
  const a = rng(7);
  const b = rng(7);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
});

test("a triangle draw never leaves its bounds and lands near likely on average", () => {
  const next = rng(1);
  let sum = 0;
  const n = 20000;
  for (let i = 0; i < n; i++) {
    const x = triangular(next, 10, 20, 60);
    assert.ok(x >= 10 && x <= 60);
    sum += x;
  }
  // The mean of a triangle is (low + likely + high) / 3, here 30.
  assert.ok(Math.abs(sum / n - 30) < 0.5);
});

test("a fixed input stays fixed", () => {
  assert.equal(triangular(rng(1), 5, 5, 5), 5);
});

test("percentile keeps no-answer runs as the most expensive", () => {
  const v = [1, 2, 3, Infinity, Infinity];
  assert.equal(percentile(v, 0.5), 3);
  assert.equal(percentile(v, 0.9), Infinity);
  assert.equal(percentile(v, 0.1), 1);
});
