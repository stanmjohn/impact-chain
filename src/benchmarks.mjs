// Loads the benchmark file and fills in any block that names a benchmark.
// A benchmark is never used silently: the block is marked so the brief can
// name it, and any low, likely, or high written in the chain file wins
// over the shipped value.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DEFAULT_PATH = fileURLToPath(new URL("../benchmarks/benefits.json", import.meta.url));

export const REQUIRED_ENTRY_FIELDS = ["id", "label", "unit", "low", "likely", "high", "how_set", "does_not_cover", "points"];
export const REQUIRED_POINT_FIELDS = ["value", "what", "source", "url", "year", "place", "measured"];

export function loadBenchmarks(path = DEFAULT_PATH) {
  return JSON.parse(readFileSync(path, "utf8")).benchmarks;
}

export function applyBenchmarks(chain, benchmarks) {
  const blocks = chain.blocks.map((b) => {
    if (!b.benchmark) return b;
    const entry = benchmarks.find((x) => x.id === b.benchmark);
    if (!entry) {
      throw new Error(`Line ${b.line}: no benchmark named "${b.benchmark}". The file has: ${benchmarks.map((x) => x.id).join(", ")}.`);
    }
    const overridden = ["low", "likely", "high"].filter((f) => b[f] != null);
    const filled = {
      ...b,
      low: b.low ?? entry.low,
      likely: b.likely ?? entry.likely,
      high: b.high ?? entry.high,
      benchmarkEntry: entry,
      overridden,
    };
    if (!(filled.low <= filled.likely && filled.likely <= filled.high)) {
      throw new Error(`Line ${b.line}: after the override, low, likely, and high in "${b.label}" no longer run in order.`);
    }
    return filled;
  });
  return { ...chain, blocks };
}

/** The benchmark file as a markdown page, for readers who never open JSON. */
export function benchmarksPage(benchmarks) {
  const lines = [];
  lines.push(`# Benefits access benchmarks`);
  lines.push("");
  lines.push(`Built from \`benchmarks/benefits.json\` by \`node bin/impact-chain.mjs benchmarks\`. Every number is a default, never a fact. A chain file can override any of them.`);
  for (const e of benchmarks) {
    lines.push("");
    lines.push(`## ${e.label}`);
    lines.push("");
    lines.push(`Name in a chain file: \`${e.id}\`. Unit: ${e.unit}.`);
    lines.push("");
    lines.push(`Low ${e.low}, likely ${e.likely}, high ${e.high}. ${e.how_set}`);
    lines.push("");
    lines.push(`**What it does not cover.** ${e.does_not_cover}`);
    lines.push("");
    lines.push(`| Value | What it is | Year | Place | How it was measured | Source |`);
    lines.push(`|---|---|---|---|---|---|`);
    for (const p of e.points) {
      lines.push(`| ${p.value} | ${p.what} | ${p.year} | ${p.place} | ${p.measured} | [${p.source}](${p.url}) |`);
    }
  }
  lines.push("");
  return lines.join("\n");
}
