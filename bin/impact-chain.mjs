#!/usr/bin/env node
// impact-chain <chain.txt> [--stdout | --out file.md] [--draws n] [--seed n]
// impact-chain benchmarks
//
// One chain file in, one markdown page out. No server, no key, no account.

import { readFileSync, writeFileSync } from "node:fs";
import { parseChain } from "../src/parse.mjs";
import { loadBenchmarks, applyBenchmarks, benchmarksPage } from "../src/benchmarks.mjs";
import { run } from "../src/model.mjs";
import { report } from "../src/report.mjs";

const args = process.argv.slice(2);

function usage(code) {
  console.log(`Usage:
  impact-chain <chain.txt>              Write the page beside the file, as <chain>.md
  impact-chain <chain.txt> --stdout     Print the page instead
  impact-chain <chain.txt> --out x.md   Write to a chosen path
  impact-chain benchmarks                 Print the benchmark file as a readable page

Options:
  --draws n   Number of runs, default 20000
  --seed n    Seed for the random draws, default 20260918`);
  process.exitCode = code;
}

function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

/** Chain file text in, page markdown out. */
export function build(text, options = {}) {
  const chain = applyBenchmarks(parseChain(text), loadBenchmarks());
  return report(chain, run(chain, options));
}

function main() {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") return usage(args.length ? 0 : 1);
  if (args[0] === "benchmarks") return console.log(benchmarksPage(loadBenchmarks()));

  const path = args[0];
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(`Cannot read "${path}". Check the path.`);
    process.exitCode = 1;
    return;
  }

  const options = {};
  if (flag("--draws")) options.draws = Number(flag("--draws"));
  if (flag("--seed")) options.seed = Number(flag("--seed"));

  let md;
  try {
    md = build(text, options);
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
    return;
  }

  if (args.includes("--stdout")) return console.log(md);
  const out = flag("--out") ?? path.replace(/\.[^./\\]+$/, "") + ".md";
  writeFileSync(out, md, "utf8");
  console.log(`Wrote ${out}`);
}

// Run only when called from the command line, so tests can import build().
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
