// The chain file reader. Good files parse, bad files name their line, and
// the three refusals about what a file may leave out are enforced here.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseChain, number } from "../src/parse.mjs";
import { good } from "./fixture.mjs";


test("numbers accept dollars, commas, and percents", () => {
  assert.equal(number("$4,000", 1), 4000);
  assert.equal(number("12%", 1), 0.12);
  assert.throws(() => number("four", 9), /Line 9/);
});

test("a good file parses, with defaults filled in", () => {
  const c = parseChain(good);
  assert.equal(c.blocks.length, 5);
  assert.equal(c.blocks[2].over, "started");
  assert.equal(c.blocks[3].per, "changed household");
  assert.equal(c.blocks[4].per, "everyone");
});

test("an effect with no group it was measured over is refused", () => {
  assert.throws(() => parseChain(good.replace("measured over: started\n", "")), /needs a "measured over:" line/);
});

test("an effect with no named comparison is refused", () => {
  assert.throws(() => parseChain(good.replace("compared with: a group texted three months later\n", "")), /needs a "compared with:" line/);
});

test("an effect measured over a group the file cannot count is refused", () => {
  const bad = good.replace(/\[uptake\][\s\S]*?source: guess\n/, "");
  assert.throws(() => parseChain(bad), /no \[uptake\] block/);
});

test("a household gain with no time window is refused", () => {
  assert.throws(() => parseChain(good.replace("window: over the first twelve months\n", "")), /needs a "window:" line/);
  assert.throws(() => parseChain(good.replace("repeats: recurring monthly\n", "")), /needs a "repeats:" line/);
});

test("every number has to say whether it was measured", () => {
  assert.throws(() => parseChain(good.replace("evidence: assumed\nsource: budget", "source: budget")), /needs "evidence: measured" or "evidence: assumed"/);
});

test("a number with no range or no source is refused with its line", () => {
  assert.throws(() => parseChain(good.replace("high: 6\n", "")), /Line \d+: the \[cost\] block "Running the product" needs low, likely, and high/);
  assert.throws(() => parseChain(good.replace("source: budget\n", "")), /has no source/);
});

test("organization links need a way to get to people", () => {
  const bad = good.replace("[reach]", "[org reach] Cities that heard of it\nlow: 10%\nlikely: 20%\nhigh: 30%\nevidence: assumed\nsource: guess\n[reach]");
  assert.throws(() => parseChain(bad), /no \[people per organization\] block/);
});
