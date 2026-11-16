// Tracking mode, where people leave, and where the service needs improvement.
// Counted steps take their rate from the count before them, the page names
// the step that loses the most people, and a step is named for improvement
// only when a published benchmark says it falls short.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseChain } from "../src/parse.mjs";
import { loadBenchmarks, applyBenchmarks } from "../src/benchmarks.mjs";
import { run, walk, serviceCheck } from "../src/model.mjs";
import { report } from "../src/report.mjs";
import { good } from "./fixture.mjs";

const benchmarks = loadBenchmarks();
const ready = (text) => applyBenchmarks(parseChain(text), benchmarks);
const page = (text) => {
  const c = ready(text);
  return report(c, run(c, { draws: 2000, seed: 5 }));
};

const tracked = `
program: Example line
built for: people on a list
made up: yes
replace with: The program's own logs.
counted start: 1,000
counted period: January to June 2026
[reach] Called back
counted: 100
source: call log
[uptake] Started an application
counted: 60
source: case records
[staying] Sent it in
counted: 45
source: case records
[effect] Approved who would not have been
measured over: stayed
compared with: a group mailed later
low: 40%
likely: 50%
high: 60%
evidence: assumed
source: guess
[cost] Letters
per: everyone
low: 5
likely: 5
high: 5
evidence: assumed
source: budget
`;

test("a counted step takes its rate from the count before it", () => {
  const c = parseChain(tracked);
  const [reach, uptake, staying] = c.blocks;
  assert.equal(c.header.countedStart, 1000);
  assert.equal(reach.likely, 0.1);
  assert.equal(uptake.likely, 0.6);
  assert.equal(staying.likely, 0.75);
  assert.equal(reach.low, reach.high);
  assert.equal(reach.evidence, "counted");
});

test("tracking mode starts the chain from the counted start", () => {
  const w = walk(parseChain(tracked), (b) => b.likely);
  assert.equal(w.counts.everyone, 1000);
  assert.equal(Math.round(w.counts.stayed), 45);
  // 45 stayed x 50% = 22.5 changed.
  assert.equal(w.changed, 22.5);
  assert.equal(Math.round(w.lost.reach), 900);
  assert.equal(Math.round(w.lost.uptake), 40);
});

test("a count that rises, a gap in the counts, or a counted effect is refused", () => {
  assert.throws(() => parseChain(tracked.replace("counted: 60", "counted: 160")), /more than the 100 at the step before it/);
  assert.throws(() => parseChain(tracked.replace("[uptake] Started an application\ncounted: 60\nsource: case records", "[uptake] Started an application\nlow: 50%\nlikely: 60%\nhigh: 70%\nevidence: assumed\nsource: guess")), /Counted steps run from the start with no gap/);
  assert.throws(() => parseChain(tracked.replace("low: 40%\nlikely: 50%\nhigh: 60%\nevidence: assumed", "counted: 20\nevidence: assumed")), /works only on \[reach\], \[uptake\], and \[staying\]/);
  assert.throws(() => parseChain(tracked.replace("counted: 100", "counted: 100\nlikely: 10%")), /gives a count and a range/);
});

test("counts need a counted start and a counted period", () => {
  assert.throws(() => parseChain(tracked.replace("counted start: 1,000\n", "")), /no "counted start:" line/);
  assert.throws(() => parseChain(tracked.replace("counted period: January to June 2026\n", "")), /no "counted period:" line/);
  assert.throws(() => parseChain(good.replace("built for: people who look eligible", "built for: people who look eligible\ncounted start: 500")), /no step with a "counted:" line/);
});

test("a made-up file has to say what real data replaces it", () => {
  assert.throws(() => parseChain(tracked.replace("replace with: The program's own logs.\n", "")), /no "replace with:" line/);
});

test("the tracked page shows the counted numbers, the period, and the PLACEHOLDER banner", () => {
  const md = page(tracked);
  assert.ok(md.includes("> **PLACEHOLDER. This program is made up.** The program's own logs."));
  assert.ok(md.includes("**Counted from the program's own records, January to June 2026.** The chain starts from the 1,000 people the program counted at the start, not from a round 1,000."));
  assert.ok(md.includes("| Reach | Called back | 10% | 100 | 900, 90% | counted |"));
  assert.ok(md.includes("Counted numbers are not drawn."));
});

test("where people leave names the step that loses the most people, in both modes", () => {
  assert.ok(page(tracked).includes('**Where people leave.** The most people leave at reach ("Called back"). 900 of the 1,000 counted at the step before go no further, 90%.'));
  const modeled = page(good);
  assert.ok(modeled.includes("The chain starts from 1,000 people, a round number to count with, not a count of real people."));
  assert.match(modeled, /\*\*Where people leave\.\*\* The most people leave at reach \("Opened the message"\)\. About \d+ of the 1,000 who got that far go no further in the middle run, 50%\./);
});

test("the step furthest under its benchmark is named, and a guess is called a guess", () => {
  // Reach at 10% sits under the whole reach range. Uptake at 60% and staying at 75% sit above their likely values.
  const s = serviceCheck(ready(tracked));
  assert.equal(s.weakest.block.kind, "reach");
  assert.ok(s.weakest.belowLow);
  const md = page(tracked);
  assert.ok(md.includes('**Reach ("Called back") falls furthest below its benchmark.**'));
  assert.ok(md.includes("and under the whole published range of 17.6% to 53%"));
  assert.ok(md.includes("That is the step where the service needs improvement first."));
  const guessed = page(good.replace("low: 40%\nlikely: 50%\nhigh: 60%\nevidence: assumed\nsource: guess\n[uptake]", "low: 5%\nlikely: 10%\nhigh: 20%\nevidence: assumed\nsource: guess\n[uptake]"));
  assert.ok(guessed.includes("This rate is a guess, so the gap is a guess too."));
});

test("no step is named when every step is at or above its benchmark", () => {
  const md = page(tracked.replace("counted: 100", "counted: 400").replace("counted: 60", "counted: 300").replace("counted: 45", "counted: 250"));
  assert.ok(md.includes("**No step falls below its benchmark's likely value.** The page names no step for improvement."));
});

test("a step with no benchmark says so, and no benchmark is invented", () => {
  const none = tracked.replace(/counted: (\d+)\nsource/g, "counted: $1\ncheck against: none\nsource");
  const md = page(none);
  assert.ok(md.includes("No benchmark. The file sets none for this step"));
  assert.ok(md.includes("**No step is held against a published benchmark.** The page names no step for improvement and does not invent one."));
  const bare = applyBenchmarks(parseChain(tracked), benchmarks.filter((e) => !e.step));
  assert.ok(serviceCheck(bare).rows.every((r) => r.check.missing));
  assert.equal(serviceCheck(bare).weakest, null);
});

test("a step can name its own benchmark, and a dollar benchmark is refused for a rate", () => {
  const c = ready(tracked.replace("counted: 100\n", "counted: 100\ncheck against: uptake-share-of-responders-who-start\n"));
  assert.equal(c.blocks[0].check.entry.id, "uptake-share-of-responders-who-start");
  assert.throws(() => ready(tracked.replace("counted: 100\n", "counted: 100\ncheck against: snap-dollars-per-new-household-per-year\n")), /cannot be checked against it/);
  assert.throws(() => ready(tracked.replace("counted: 100\n", "counted: 100\ncheck against: nope\n")), /names no benchmark called "nope"/);
});

test("a step whose number is the benchmark is not compared with itself", () => {
  const c = ready(good.replace(/\[reach\] Opened the message\nlow: 40%\nlikely: 50%\nhigh: 60%\nevidence: assumed\nsource: guess/, "[reach] Opened the message\nbenchmark: reach-share-who-respond-to-outreach"));
  const row = serviceCheck(c).rows.find((r) => r.block.kind === "reach");
  assert.ok(row.check.self);
  assert.equal(row.compared, false);
});

test("the plan lists counted and modeled numbers and never prints a double period", () => {
  const md = page(tracked);
  assert.ok(md.includes("- **Counted from the program's own records, January to June 2026.** Reach, uptake and staying."));
  assert.ok(md.includes("Compared with: a group mailed later."));
  assert.ok(!md.includes(".."));
  const kept = page(good + "[kept share] Kept\nlow: 50%\nlikely: 50%\nhigh: 50%\nevidence: modeled\nsource: PolicyEngine US model, version 1.0.0, 2025 rules, priced on 2026-09-25\nhousehold: one adult, age 24, in PA\nnote: A raise of $1,000 leaves $500.\n");
  assert.ok(kept.includes("- **Modeled.** Kept share."));
});
