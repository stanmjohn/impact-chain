// The page is a document, so these tests pin the sentences that must never
// disappear: the measurement plan up top, the range beside the figure, the
// shown-not-multiplied note, the evidence line, the time window, the refusals.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseChain } from "../src/parse.mjs";
import { loadBenchmarks, applyBenchmarks } from "../src/benchmarks.mjs";
import { run } from "../src/model.mjs";
import { report, money } from "../src/report.mjs";
import { good } from "./fixture.mjs";

function page(text) {
  const c = applyBenchmarks(parseChain(text), loadBenchmarks());
  return report(c, run(c, { draws: 2000, seed: 5 }));
}

test("money keeps cents under a hundred dollars and rounds above", () => {
  assert.equal(money(4.031), "$4.03");
  assert.equal(money(606.4), "$606");
  assert.equal(money(2341234), "$2,340,000");
});

const assumed = page(good);

test("the page opens on the measurement plan", () => {
  assert.ok(assumed.indexOf("## The measurement plan") < assumed.indexOf("## The read"));
  assert.ok(assumed.includes("**No link in this file has been measured yet.**"));
  assert.ok(assumed.includes("**What the evaluation budget buys.**"));
});

test("the final figure never prints without its range, its window, or its soft spots", () => {
  assert.match(assumed, /Every dollar spent puts about \*\*\$[\d.,]+\*\* in a household's hands, over the first twelve months, in the middle run\. The middle 80 percent/);
  assert.ok(assumed.includes("**This figure rests on 4 numbers nobody has measured for this product:**"));
});

test("the time window section ships with every household gain", () => {
  assert.ok(assumed.includes("## The time window"));
  assert.ok(assumed.includes("Later dollars are not discounted."));
});

test("links below the measured group are shown and not multiplied in", () => {
  // The effect in the good file is measured over those who started, so nothing
  // below it exists. Measure it over everyone and reach and uptake drop out.
  const md = page(good.replace("measured over: started", "measured over: everyone"));
  assert.ok(md.includes("**Shown, not multiplied in.** Reach and uptake."));
  assert.ok(md.includes("would subtract them twice"));
});

test("a partly measured chain draws the line where measured numbers stop", () => {
  const md = page(good.replace("evidence: assumed\nsource: guess\n[uptake]", "evidence: measured\nsource: message logs\n[uptake]"));
  assert.ok(md.includes('**Measured numbers stop at uptake ("Started").**'));
});

test("a chain with no effect stops early and says which link to buy", () => {
  const md = page(good.replace(/\[effect\][\s\S]*?(?=\[cost\])/, ""));
  assert.ok(md.includes("**No final figure.**"));
  assert.ok(md.includes("That is the link an evaluation has to buy first"));
  assert.ok(!md.includes("Every dollar spent puts"));
});

test("a chain with an effect and no dollars ends on the counted result", () => {
  const md = page(good.replace(/\[income raised\][\s\S]*?(?=\[cost\])/, "").replace("built for: people who look eligible", "built for: people who look eligible\noutcome: one record cleared"));
  assert.ok(md.includes("One record cleared costs about **$"));
  assert.ok(md.includes("puts no dollar value on it"));
});

test("a benchmark is named inline and its points are listed", () => {
  const md = page(good.replace(/low: 900\nlikely: 1,000\nhigh: 1,100\nevidence: assumed\nsource: guess\n/, "benchmark: snap-dollars-per-new-household-per-year\n"));
  assert.ok(md.includes("Benchmark `snap-dollars-per-new-household-per-year` from `benchmarks/benefits.json`."));
  assert.ok(md.includes("## Benchmarks this page used"));
});

test("the refusals ship on every page", () => {
  assert.ok(assumed.includes("## What this page refuses to do"));
  assert.ok(assumed.includes("It never puts dollars on a result nobody measured in dollars."));
});
