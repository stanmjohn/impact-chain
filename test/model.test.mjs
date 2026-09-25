// The chain arithmetic on hand-checkable cases, the double-count case first.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseChain } from "../src/parse.mjs";
import { walk, run, shownOnly, ending, ranking } from "../src/model.mjs";

const block = (kind, label, l, m, h, extra = "") => `[${kind}] ${label}\n${extra}low: ${l}\nlikely: ${m}\nhigh: ${h}\nevidence: measured\nsource: test\n`;
const head = `product: Example\nbuilt for: people\n`;
const gainExtra = `window: one year\nmeasured at: month twelve\nrepeats: recurring\n`;
const effectExtra = (over) => `measured over: ${over}\ncompared with: a lottery group\n`;
const likely = (b) => b.likely;

// 1,000 people x 50% reach x 40% uptake x 50% staying = 100 stayed.
const funnel = block("reach", "Reach", "50%", "50%", "50%") + block("uptake", "Uptake", "40%", "40%", "40%") + block("staying", "Staying", "50%", "50%", "50%");

test("an effect measured over those who stayed multiplies the whole chain", () => {
  const c = parseChain(head + funnel + block("effect", "Effect", "10%", "20%", "30%", effectExtra("stayed")) + block("income raised", "Gain", "1000", "1000", "1000", gainExtra) + block("cost", "Cost", "5", "5", "5"));
  const w = walk(c, likely);
  // 100 stayed x 20% = 20 changed. 20 x $1,000 = $20,000. Cost 1,000 x $5 = $5,000. Ratio 4.
  assert.equal(Math.round(w.changed), 20);
  assert.equal(Math.round(w.gain), 20000);
  assert.equal(Math.round(w.cost), 5000);
  assert.equal(Math.round(w.final * 100) / 100, 4);
  assert.deepEqual(shownOnly(c), []);
});

test("an effect measured over everyone is never multiplied by the links below it", () => {
  const c = parseChain(head + funnel + block("effect", "Effect", "1%", "2%", "3%", effectExtra("everyone")) + block("income raised", "Gain", "1000", "1000", "1000", gainExtra) + block("cost", "Cost", "5", "5", "5"));
  const w = walk(c, likely);
  // 1,000 x 2% = 20 changed, not 1,000 x 50% x 40% x 50% x 2% = 2.
  assert.equal(Math.round(w.changed), 20);
  assert.deepEqual(shownOnly(c).map((b) => b.kind), ["reach", "uptake", "staying"]);
  // Shown-only links cannot move the answer, so they are left out of the ranking.
  assert.ok(ranking(c).every((r) => r.block.kind === "effect"));
});

test("an effect measured over those who started skips only staying", () => {
  const c = parseChain(head + funnel + block("effect", "Effect", "10%", "10%", "10%", effectExtra("started")) + block("cost", "Cost", "5", "5", "5"));
  // 200 started x 10% = 20 changed. Cost 5,000 / 20 = $250 per outcome.
  const w = walk(c, likely);
  assert.equal(Math.round(w.changed), 20);
  assert.equal(ending(c), "outcome");
  assert.equal(Math.round(w.final), 250);
  assert.deepEqual(shownOnly(c).map((b) => b.kind), ["staying"]);
});

test("a gain measured in dollars over a whole group needs no effect block", () => {
  const c = parseChain(head + block("income raised", "Earnings added", "30000", "40000", "50000", gainExtra + "per: measured group\nmeasured over: everyone\ncompared with: lottery losers\n") + block("cost", "Cost", "20000", "20000", "20000"));
  const w = walk(c, likely);
  assert.equal(w.changed, null);
  assert.equal(w.final, 2);
});

test("income raised and costs cut are summed for the ratio and kept apart in the result", () => {
  const c = parseChain(head + block("effect", "Effect", "10%", "10%", "10%", effectExtra("everyone")) + block("income raised", "Wages", "1000", "1000", "1000", gainExtra) + block("costs cut", "Fees avoided", "200", "200", "200", gainExtra) + block("cost", "Cost", "10", "10", "10"));
  const w = walk(c, likely);
  assert.equal(Math.round(w.income), 100000);
  assert.equal(Math.round(w.costsCut), 20000);
  assert.equal(Math.round(w.final), 12);
});

test("costs are charged to the group the file names", () => {
  const c = parseChain(head + funnel + block("effect", "Effect", "10%", "10%", "10%", effectExtra("stayed")) + block("cost", "Texts", "1", "1", "1", "per: everyone\n") + block("cost", "Coaching", "50", "50", "50", "per: started\n"));
  // 1,000 x $1 + 200 started x $50 = $11,000.
  assert.equal(Math.round(walk(c, likely).cost), 11000);
});

test("the organization step turns 100 organizations into people", () => {
  const c = parseChain(head + block("org reach", "Heard of it", "50%", "50%", "50%") + block("org uptake", "Adopted", "20%", "20%", "20%") + block("people per organization", "Served", "300", "300", "300") + block("effect", "Effect", "10%", "10%", "10%", effectExtra("everyone")) + block("cost", "Cost", "1000", "1000", "1000", "per: organization\n"));
  const w = walk(c, likely);
  // 100 x 50% x 20% = 10 active x 300 = 3,000 people x 10% = 300 changed. Cost 100 x $1,000.
  assert.equal(Math.round(w.counts.everyone), 3000);
  assert.equal(Math.round(w.changed), 300);
  assert.equal(Math.round(w.cost), 100000);
});

test("a file with no effect and no gain stops early with no final figure", () => {
  const c = parseChain(head + funnel + block("cost", "Cost", "5", "5", "5"));
  const r = run(c, { draws: 500, seed: 1 });
  assert.equal(r.state, "stops-early");
  assert.equal(r.final, null);
  assert.deepEqual(r.ranking, []);
  assert.equal(Math.round(r.stats.stayed.p50), 100);
});

test("run is deterministic, and refuses when most runs change nothing", () => {
  const c = parseChain(head + block("effect", "Effect", "-10%", "-1%", "5%", effectExtra("everyone")) + block("income raised", "Gain", "1000", "1000", "1000", gainExtra) + block("cost", "Cost", "5", "5", "5"));
  const a = run(c, { draws: 2000, seed: 3 });
  const b = run(c, { draws: 2000, seed: 3 });
  assert.equal(a.final.p50, b.final.p50);
  assert.equal(a.state, "refused");
  assert.ok(a.nothingShare >= 0.5);
});

test("a kept share scales income raised and leaves costs cut alone", () => {
  const c = parseChain(head + block("effect", "Effect", "10%", "10%", "10%", effectExtra("everyone")) + block("income raised", "Wages", "1000", "1000", "1000", gainExtra) + block("costs cut", "Fees avoided", "200", "200", "200", gainExtra) + block("kept share", "Kept", "50%", "50%", "50%", "household: one adult\n") + block("cost", "Cost", "10", "10", "10"));
  const w = walk(c, likely);
  // 100 changed x $1,000 = $100,000 earned, half kept, plus $20,000 in fees avoided, over $10,000.
  assert.equal(Math.round(w.income), 100000);
  assert.equal(Math.round(w.incomeKept), 50000);
  assert.equal(Math.round(w.gain), 70000);
  assert.equal(Math.round(w.final), 7);
});
