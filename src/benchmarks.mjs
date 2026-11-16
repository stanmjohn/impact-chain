// Loads the benchmark file. Two jobs.
//
// 1. Fills in any block that names a benchmark with "benchmark:". A benchmark
//    is never used silently. The block is marked so the page can name it, and
//    any low, likely, or high written in the chain file wins over the shipped
//    value.
// 2. Attaches to each of reach, uptake, and staying the benchmark its rate is
//    checked against. By default that is the entry whose "step" names it. A
//    block can name another with "check against:", or opt out with
//    "check against: none". No benchmark is ever made up for a step.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LINKS } from "./parse.mjs";

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
  return attachChecks({ ...chain, blocks }, benchmarks);
}

/**
 * Each step's check. { entry } to compare with, { none: true } when the file
 * sets none, { missing: true } when the repo has none for the step, or
 * { self: true, entry } when the step's own number is that benchmark.
 */
export function attachChecks(chain, benchmarks) {
  const blocks = chain.blocks.map((b) => {
    if (!LINKS.includes(b.kind)) return b;
    if (b.checkAgainst === "none") return { ...b, check: { none: true } };
    let entry;
    if (b.checkAgainst) {
      entry = benchmarks.find((x) => x.id === b.checkAgainst);
      if (!entry) throw new Error(`Line ${b.line}: "check against:" names no benchmark called "${b.checkAgainst}". The file has: ${benchmarks.map((x) => x.id).join(", ")}.`);
      if (entry.unit !== "share") throw new Error(`Line ${b.line}: "${entry.id}" is in ${entry.unit}, so a step's rate cannot be checked against it.`);
    } else {
      entry = benchmarks.find((x) => x.step === b.kind);
    }
    if (!entry) return { ...b, check: { missing: true } };
    if (b.benchmarkEntry && b.benchmarkEntry.id === entry.id) return { ...b, check: { self: true, entry } };
    return { ...b, check: { entry } };
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
    lines.push(`Name in a chain file: \`${e.id}\`. Unit: ${e.unit}.${e.step ? ` A page checks the ${e.step} step against it, unless the file names another benchmark or none.` : ""}`);
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
