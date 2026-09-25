#!/usr/bin/env node
// impact-chain <chain.txt> [--stdout | --out file.md] [--draws n] [--seed n]
// impact-chain benchmarks
// impact-chain price <chain.txt> [--write]     ask the tax and benefit model what the household keeps
//
// One chain file in, one markdown page out. No server, no key, no account.

import { readFileSync, writeFileSync } from "node:fs";
import { parseChain } from "../src/parse.mjs";
import { loadBenchmarks, applyBenchmarks, benchmarksPage } from "../src/benchmarks.mjs";
import { run } from "../src/model.mjs";
import { report } from "../src/report.mjs";
import { price, block } from "../src/price.mjs";
import { number } from "../src/parse.mjs";

const args = process.argv.slice(2);

function usage(code) {
  console.log(`Usage:
  impact-chain <chain.txt>              Write the page beside the file, as <chain>.md
  impact-chain <chain.txt> --stdout     Print the page instead
  impact-chain <chain.txt> --out x.md   Write to a chosen path
  impact-chain benchmarks                 Print the benchmark file as a readable page
  impact-chain price <chain.txt>          Ask PolicyEngine what the named household keeps of the raise, print the block
  impact-chain price <chain.txt> --write  Same, and write the [kept share] block into the file

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

async function runPrice(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(`Cannot read "${path}". Check the path.`);
    process.exitCode = 1;
    return;
  }
  const head = (key) => text.match(new RegExp("^" + key + ":\\s*(.+)$", "mi"))?.[1]?.trim();
  const state = head("household state");
  const agesText = head("household ages");
  const incomeText = head("household income");
  const gainText = head("household gain per year");
  const missing = [["household state", state], ["household ages", agesText], ["household income", incomeText], ["household gain per year", gainText]]
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    console.error(`The file needs these header lines before it can be priced: ${missing.join(", ")}. For example "household state: PA", "household ages: 24", "household income: 27,338", "household gain per year: 8,251".`);
    process.exitCode = 1;
    return;
  }
  const ages = agesText.split(/[,\s]+/).filter(Boolean).map((a) => number(a, 0));
  const year = Number(head("household rules year") ?? new Date().getFullYear());
  let priced;
  try {
    priced = await price({ state: state.toUpperCase(), ages, income: number(incomeText, 0), gain: number(gainText, 0), year });
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  const blockText = block(priced, today);
  if (!args.includes("--write")) return console.log(blockText);
  const cleaned = text.replace(/\n\[kept share\][\s\S]*?(?=\n\[|\s*$)/, "");
  writeFileSync(path, cleaned.replace(/\s*$/, "") + "\n\n" + blockText + "\n", "utf8");
  console.log(`Wrote a [kept share] block into ${path}. The household keeps ${Math.round(priced.share * 100)} percent of the raise.`);
}

async function main() {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") return usage(args.length ? 0 : 1);
  if (args[0] === "benchmarks") return console.log(benchmarksPage(loadBenchmarks()));
  if (args[0] === "price") return args[1] ? runPrice(args[1]) : usage(1);

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
