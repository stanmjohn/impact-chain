// The arithmetic of the chain.
//
//   everyone = 1,000 people the program was built for, a round number to count with
//              or, in tracking mode, the number the program counted at the start
//              or, with the organization step, 100 organizations
//              x org reach x org uptake x org staying x people per organization
//   reached  = everyone x reach
//   started  = reached x uptake
//   stayed   = started x staying
//   lost     = the count before a step minus the count after it
//   changed  = (the group the effect was measured over) x effect
//   gain     = changed x gain per changed household
//              + (a measured group) x gain per person in that group
//   cost     = sum over cost blocks of (the group it is charged to) x cost
//
// The measured-over rule is the heart of it. An effect measured over everyone
// offered already counts the people who never started or dropped out, so the
// links downstream of that group are shown and never multiplied in.
//
// Endings: household gain per dollar where money was measured, cost per
// counted outcome where only an effect was, and no final figure where nobody
// measured an effect at all.
//
// The service check holds each step's likely rate against its benchmark. The
// gap is how far the rate sits under the benchmark's likely value, as a share
// of that value. The step with the largest gap is where the service needs
// improvement. No step is named when none sits under its benchmark, or when
// no step has one.

import { rng, triangular, percentile } from "./simulate.mjs";
import { LINKS, ORG_LINKS, GAIN_KINDS, GROUPS } from "./parse.mjs";

export const DEFAULT_DRAWS = 20000;
export const DEFAULT_SEED = 20260918;
export const START_PEOPLE = 1000;
export const START_ORGS = 100;
// At or past this share of runs with nothing changed, no estimate is printed.
export const REFUSE_AT = 0.5;

const pick = (blocks, kind) => blocks.find((b) => b.kind === kind) ?? null;
const NAMES = { reach: "reached", uptake: "started", staying: "stayed" };

/** How the chain ends: "gain", "outcome", or "none". */
export function ending(chain) {
  if (chain.blocks.some((b) => GAIN_KINDS.includes(b.kind))) return "gain";
  if (pick(chain.blocks, "effect")) return "outcome";
  return "none";
}

/** True when the file carries the program's own counts. */
export function tracked(chain) {
  return chain.header?.countedStart != null;
}

/** The group furthest down the chain that any figure is measured over. */
function deepestGroupUsed(chain) {
  const used = chain.blocks.flatMap((b) => [b.over, b.kind === "cost" ? b.per : null]).filter((g) => GROUPS.includes(g));
  return used.reduce((deep, g) => (GROUPS.indexOf(g) > GROUPS.indexOf(deep) ? g : deep), "everyone");
}

/** Links shown for the reader and not multiplied into the final figure. */
export function shownOnly(chain) {
  if (ending(chain) === "none") return [];
  const deep = GROUPS.indexOf(deepestGroupUsed(chain));
  return LINKS.filter((link, i) => i >= deep && pick(chain.blocks, link)).map((link) => pick(chain.blocks, link));
}

/** One pass through the chain from one set of values. */
export function walk(chain, valueOf) {
  const { blocks } = chain;
  const orgStep = pick(blocks, "people per organization");
  const counts = {};
  const lost = {};

  if (orgStep) {
    let orgs = START_ORGS;
    counts.organizations = orgs;
    for (const kind of ORG_LINKS) {
      const b = pick(blocks, kind);
      if (b) orgs *= valueOf(b);
      counts[kind] = orgs;
    }
    counts.activeOrganizations = orgs;
    counts.everyone = orgs * valueOf(orgStep);
  } else {
    counts.everyone = tracked(chain) ? chain.header.countedStart : START_PEOPLE;
  }

  let people = counts.everyone;
  for (const link of LINKS) {
    const b = pick(blocks, link);
    if (b) {
      const before = people;
      people *= valueOf(b);
      lost[link] = before - people;
    }
    counts[NAMES[link]] = b ? people : null;
  }

  const effect = pick(blocks, "effect");
  const changed = effect ? Math.max(0, counts[effect.over] * valueOf(effect)) : null;

  let income = 0;
  let costsCut = 0;
  const keptShare = pick(blocks, "kept share");
  for (const b of blocks) {
    if (!GAIN_KINDS.includes(b.kind)) continue;
    const amount = b.per === "changed household" ? changed * valueOf(b) : counts[b.over] * valueOf(b);
    if (b.kind === "income raised") income += amount;
    else costsCut += amount;
  }

  let cost = 0;
  for (const b of blocks) {
    if (b.kind !== "cost") continue;
    cost += (b.per === "organization" ? counts.organizations : counts[b.per]) * valueOf(b);
  }

  const incomeKept = keptShare ? income * valueOf(keptShare) : income;
  const gain = incomeKept + costsCut;
  const end = ending(chain);
  let final = null;
  if (end === "gain") final = cost > 0 ? Math.max(0, gain) / cost : 0;
  if (end === "outcome") final = changed > 0 ? cost / changed : Infinity;
  const nothingChanged = end === "gain" ? gain <= 0 : end === "outcome" ? !(changed > 0) : false;

  return { counts, lost, changed, income, incomeKept, costsCut, gain, cost, final, nothingChanged };
}

/** Blocks that vary from run to run. */
export function inputs(chain) {
  return chain.blocks;
}

/** Move one input from its low to its high with the rest at likely. */
export function ranking(chain) {
  if (ending(chain) === "none") return [];
  const skip = new Set(shownOnly(chain));
  const rows = chain.blocks
    .filter((b) => b.high > b.low && !skip.has(b))
    .map((b) => {
      const atLow = walk(chain, (x) => (x === b ? b.low : x.likely)).final;
      const atHigh = walk(chain, (x) => (x === b ? b.high : x.likely)).final;
      const span = atLow === Infinity || atHigh === Infinity ? Infinity : Math.abs(atHigh - atLow);
      return { block: b, atLow, atHigh, span };
    });
  return rows.sort((a, b) => (a.span === b.span ? 0 : b.span - a.span));
}

/**
 * Each step held against its benchmark. A row per step, and the weakest step,
 * the one furthest under its benchmark's likely value, or null.
 */
export function serviceCheck(chain) {
  const rows = LINKS.map((kind) => pick(chain.blocks, kind)).filter(Boolean).map((b) => {
    const check = b.check ?? { missing: true };
    const row = { block: b, check, rate: b.likely, compared: false, shortfall: 0, belowLow: false };
    if (check.entry && !check.self) {
      row.compared = true;
      row.shortfall = b.likely < check.entry.likely ? (check.entry.likely - b.likely) / check.entry.likely : 0;
      row.belowLow = b.likely < check.entry.low;
    }
    return row;
  });
  const under = rows.filter((r) => r.compared && r.shortfall > 0);
  const weakest = under.reduce((w, r) => (w === null || r.shortfall > w.shortfall ? r : w), null);
  return { rows, weakest, anyCompared: rows.some((r) => r.compared) };
}

function summarize(values) {
  return { p10: percentile(values, 0.1), p50: percentile(values, 0.5), p90: percentile(values, 0.9) };
}

/** Each step with the people who got to it, the people left, and the people lost. */
function steps(chain, series) {
  let before = "everyone";
  const rows = [];
  for (const kind of LINKS) {
    const b = pick(chain.blocks, kind);
    if (!b) continue;
    rows.push({ block: b, arrived: summarize(series[before]), left: summarize(series[NAMES[kind]]), lost: summarize(series.lost[kind]), lostShare: 1 - b.likely });
    before = NAMES[kind];
  }
  const most = rows.reduce((m, r) => (m === null || r.lost.p50 > m.lost.p50 ? r : m), null);
  return { rows, most };
}

export function run(chain, { draws = DEFAULT_DRAWS, seed = DEFAULT_SEED } = {}) {
  const next = rng(seed);
  const series = { reached: [], started: [], stayed: [], everyone: [], changed: [], final: [], gain: [], cost: [], income: [], incomeKept: [], costsCut: [], activeOrganizations: [], lost: { reach: [], uptake: [], staying: [] } };
  let nothing = 0;
  for (let i = 0; i < draws; i++) {
    const values = new Map();
    for (const b of chain.blocks) values.set(b, triangular(next, b.low, b.likely, b.high));
    const w = walk(chain, (b) => values.get(b));
    if (w.nothingChanged) nothing++;
    for (const k of ["reached", "started", "stayed", "everyone", "activeOrganizations"]) if (w.counts[k] != null) series[k].push(w.counts[k]);
    for (const k of LINKS) if (w.lost[k] != null) series.lost[k].push(w.lost[k]);
    if (w.changed != null) series.changed.push(w.changed);
    if (w.final != null) series.final.push(w.final);
    series.gain.push(w.gain);
    series.cost.push(w.cost);
    series.income.push(w.income);
    series.incomeKept.push(w.incomeKept);
    series.costsCut.push(w.costsCut);
  }
  const end = ending(chain);
  const nothingShare = nothing / draws;
  const final = series.final.length ? summarize(series.final) : null;
  let state = "ranged";
  if (end === "none") state = "stops-early";
  else if (nothingShare >= REFUSE_AT || final.p50 === Infinity) state = "refused";
  else if (final.p90 === Infinity) state = "open-ended";

  const stats = {};
  for (const [k, v] of Object.entries(series)) if (k !== "final" && k !== "lost" && v.length) stats[k] = summarize(v);

  return {
    draws, seed, end, state, nothingShare, final, stats,
    tracked: tracked(chain),
    steps: steps(chain, series),
    service: serviceCheck(chain),
    atLikely: walk(chain, (b) => b.likely),
    ranking: ranking(chain),
    shownOnly: shownOnly(chain),
  };
}
