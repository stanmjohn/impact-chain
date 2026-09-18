// The benchmark file keeps its promises: every entry carries its source,
// year, place, and limits, and a chain file can override any value.

import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBenchmarks, applyBenchmarks, REQUIRED_ENTRY_FIELDS, REQUIRED_POINT_FIELDS } from "../src/benchmarks.mjs";
import { parseChain } from "../src/parse.mjs";
import { good } from "./fixture.mjs";

const benchmarks = loadBenchmarks();

test("every benchmark carries every required field", () => {
  assert.ok(benchmarks.length >= 2);
  for (const e of benchmarks) {
    for (const f of REQUIRED_ENTRY_FIELDS) assert.ok(e[f] != null && e[f] !== "", `${e.id ?? "?"} lacks ${f}`);
    assert.ok(e.low <= e.likely && e.likely <= e.high, `${e.id} range out of order`);
    for (const p of e.points) {
      for (const f of REQUIRED_POINT_FIELDS) assert.ok(p[f] != null && p[f] !== "", `${e.id} point lacks ${f}`);
      assert.ok(p.url.startsWith("https://"), `${e.id} point url`);
    }
  }
});

test("low and high never fall outside the points behind them", () => {
  for (const e of benchmarks) {
    const values = e.points.map((p) => p.value);
    assert.ok(e.low >= Math.min(...values), `${e.id} low below its lowest point`);
    assert.ok(e.high <= Math.max(...values), `${e.id} high above its highest point`);
  }
});

const withBenchmark = good.replace(/low: 900\nlikely: 1,000\nhigh: 1,100\nevidence: assumed\nsource: guess\n/, "benchmark: snap-dollars-per-new-household-per-year\n");

test("a benchmark fills the block and marks its evidence as a benchmark", () => {
  const c = applyBenchmarks(parseChain(withBenchmark), benchmarks);
  const b = c.blocks[3];
  assert.equal(b.likely, 1385);
  assert.equal(b.evidence, "benchmark");
  assert.deepEqual(b.overridden, []);
});

test("a value in the chain file wins over the benchmark", () => {
  const c = applyBenchmarks(parseChain(withBenchmark.replace("benchmark: snap-dollars", "likely: 1,300\nbenchmark: snap-dollars")), benchmarks);
  assert.equal(c.blocks[3].likely, 1300);
  assert.deepEqual(c.blocks[3].overridden, ["likely"]);
});

test("an unknown benchmark name is refused with the list", () => {
  assert.throws(() => applyBenchmarks(parseChain(withBenchmark.replace("snap-dollars-per-new-household-per-year", "nope")), benchmarks), /no benchmark named "nope"/);
});
