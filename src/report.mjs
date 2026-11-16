// Writes the page as markdown. All arithmetic lives in model.mjs. The page
// carries no date, so the same file and seed give the same page byte for byte.
// It opens on the measurement plan because its first use is the measurement
// section of a grant application, where most links are still unmeasured.

import { LINKS, ORG_LINKS, GAIN_KINDS } from "./parse.mjs";
import { START_PEOPLE, START_ORGS } from "./model.mjs";

const KIND_NAMES = {
  "org reach": "Organizations reached",
  "org uptake": "Organizations that start",
  "org staying": "Organizations still using it",
  "people per organization": "People per active organization",
  "reach": "Reach",
  "uptake": "Uptake",
  "staying": "Staying",
  "effect": "Effect",
  "income raised": "Household gain, income raised",
  "costs cut": "Household gain, costs cut",
  "kept share": "Share of the raise the household keeps",
  "cost": "Cost",
};
const COUNT_NAMES = { reach: "reached", uptake: "started", staying: "stayed" };
const CHAIN_ORDER = [...ORG_LINKS, "people per organization", ...LINKS, "effect", ...GAIN_KINDS, "kept share"];

/** Dollars at three significant figures. */
export function money(n) {
  if (n === Infinity) return "no finite answer";
  if (n == null || Number.isNaN(n)) return "not computable";
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a < 100) return sign + "$" + a.toFixed(2);
  if (a < 1000) return sign + "$" + Math.round(a).toLocaleString("en-US");
  const mag = Math.pow(10, Math.floor(Math.log10(a)) - 2);
  return sign + "$" + (Math.round(a / mag) * mag).toLocaleString("en-US");
}

function share(v) {
  return (Math.round(v * 1000) / 10).toLocaleString("en-US") + "%";
}

function count(v) {
  if (v == null) return "";
  return (v < 10 ? Math.round(v * 10) / 10 : Math.round(v)).toLocaleString("en-US");
}

/** A value with its spread, or the value alone when it has no spread. */
function span(fmt, mid, lo, hi) {
  if (fmt(lo) === fmt(hi) && fmt(lo) === fmt(mid)) return fmt(mid);
  return `${fmt(mid)} (${fmt(lo)} to ${fmt(hi)})`;
}

function value(b, v) {
  if (b.kind === "cost" || GAIN_KINDS.includes(b.kind)) return money(v);
  if (b.kind === "people per organization") return count(v);
  return share(v);
}

function pct(s) {
  const p = s * 100;
  if (p > 0 && p < 1) return "under 1 percent";
  return Math.round(p) + " percent";
}

function list(items) {
  if (items.length === 0) return "none";
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

/** Ends a phrase with exactly one period. */
function sentence(s) {
  const t = String(s).trim();
  return /[.!?]$/.test(t) ? t : t + ".";
}

function sourceCell(b) {
  if (b.benchmarkEntry) {
    const over = b.overridden.length ? ` The file overrides its ${b.overridden.join(" and ")}.` : "";
    return `Benchmark \`${b.benchmarkEntry.id}\` from \`benchmarks/benefits.json\`.${over}`;
  }
  return b.url ? `[${b.source}](${b.url})` : b.source;
}

const SHORT = { "income raised": "income raised", "costs cut": "costs cut", "kept share": "kept share" };
const short = (kind) => SHORT[kind] ?? KIND_NAMES[kind].toLowerCase();
const name = (b) => `${short(b.kind)} ("${b.label}")`;
const isMeasured = (b) => b.evidence === "measured" || b.evidence === "counted";
const SOFT_WORDS = [["assumed", "guesses"], ["benchmark", "benchmarks"], ["modeled", "a tax and benefit model"]];
const softKinds = (blocks) => SOFT_WORDS.filter(([e]) => blocks.some((b) => b.evidence === e)).map(([, w]) => w);

export function report(chain, result) {
  const { header, blocks } = chain;
  const lines = [];
  const push = (...xs) => lines.push(...xs);
  const of = (kind) => blocks.filter((b) => b.kind === kind);
  const links = blocks.filter((b) => b.kind !== "cost").sort((a, b) => CHAIN_ORDER.indexOf(a.kind) - CHAIN_ORDER.indexOf(b.kind));
  const gains = blocks.filter((b) => GAIN_KINDS.includes(b.kind));
  const keptShare = of("kept share")[0];
  const effect = of("effect")[0];
  const orgStep = of("people per organization")[0];
  const shown = new Set(result.shownOnly);
  const counted = links.filter((b) => !shown.has(b));
  const unmeasured = counted.filter((b) => !isMeasured(b));
  const window = gains.length ? gains[0].window : null;
  const period = header["counted period"];
  const start = result.tracked ? header.countedStart : START_PEOPLE;

  push(`# Impact chain: ${header.program}`, "");
  if (header.madeUp) {
    push(`> **PLACEHOLDER. This program is made up.** ${sentence(header["replace with"])}`, "");
  }
  push([`Built for ${header["built for"]}`, header.place, header.years].filter(Boolean).join(" · "), "");

  // The measurement plan
  push(`## The measurement plan`, "");
  const byEvidence = (e) => links.filter((b) => b.evidence === e).map((b) => short(b.kind));
  const gainIsTheEffect = gains.some((g) => g.per === "measured group");
  const missing = ["reach", "uptake", "staying", "effect"].filter((k) => of(k).length === 0 && !(k === "effect" && gainIsTheEffect)).map((k) => KIND_NAMES[k].toLowerCase());
  if (gains.length === 0) missing.push("household gain");
  if (byEvidence("counted").length) push(`- **Counted from the program's own records, ${period}.** ${cap(list(byEvidence("counted")))}.`);
  push(`- **Measured today.** ${cap(list(byEvidence("measured")))}.`);
  if (byEvidence("modeled").length) push(`- **Modeled.** ${cap(list(byEvidence("modeled")))}.`);
  push(`- **Assumed.** ${cap(list(byEvidence("assumed")))}.`);
  push(`- **From a benchmark.** ${cap(list(byEvidence("benchmark")))}.`);
  push(`- **Not in the file.** ${cap(list(missing))}.${gainIsTheEffect ? " The effect is inside the gain figure, which was measured in dollars against a comparison group." : ""}`, "");

  const anyCounted = links.some((b) => b.evidence === "counted");
  const anyMeasured = links.some((b) => b.evidence === "measured");
  const hardWords = anyCounted && anyMeasured ? "Counted and measured numbers" : anyCounted ? "Counted numbers" : "Measured numbers";
  const firstSoft = links.find((b) => !isMeasured(b));
  function planBuys() {
    const topSoft = result.ranking.find((r) => !isMeasured(r.block));
    const top = result.ranking[0];
    if (!topSoft || !top) return;
    push("", top.block === topSoft.block
      ? `**What the evaluation budget buys.** The number that moves the answer most is ${name(top.block)}, and nobody has measured it. Measuring that one link does more for this page than measuring any other.`
      : `**What the evaluation budget buys.** The number that moves the answer most, ${name(top.block)}, is already measured. The unmeasured number that moves it most is ${name(topSoft.block)}. That is the one to measure.`);
  }
  if (result.state === "stops-early") {
    push(`**${hardWords} run through ${KIND_NAMES[links[links.length - 1].kind].toLowerCase()} and stop.** Nobody has measured what the program changed against a comparison group. That is the link an evaluation has to buy first, because every figure after it rests on it.`);
  } else if (!firstSoft) {
    push(`**Every link in this file was ${anyCounted && anyMeasured ? "measured or counted" : anyCounted ? "counted" : "measured"}.** An evaluation budget here buys a longer window or a second place, not a missing link.`);
  } else if (!anyMeasured && !anyCounted) {
    push(`**No link in this file has been measured or counted yet.** The chain leans on ${list(softKinds(links))}, and the page marks each number.`);
    planBuys();
  } else {
    const rest = links.slice(links.indexOf(firstSoft)).filter((b) => !isMeasured(b));
    push(`**${hardWords} stop at ${name(firstSoft)}.** From there on the chain leans on ${list(softKinds(rest))}, and the page marks each number.`);
    planBuys();
  }
  push("");

  // The read
  push(`## The read`, "");
  const changedStat = result.stats.changed;
  const startLine = orgStep
    ? `${START_ORGS} organizations the program was built for`
    : result.tracked
      ? `the ${count(start)} people the program counted at the start, ${period}`
      : `${START_PEOPLE.toLocaleString("en-US")} people the program was built for`;
  if (result.state === "stops-early") {
    push(`**No final figure.** The file carries no effect measured against a comparison group, so the chain cannot say what the program changed or what that put in a household's hands. Printing a ratio here would mean inventing the link that matters most.`);
  } else if (result.state === "refused") {
    push(`**No estimate.** In ${pct(result.nothingShare)} of ${result.draws.toLocaleString("en-US")} runs the program changed nothing beyond what happens without it. A figure printed on top of that would be a guess with a dollar sign.`);
  } else if (result.end === "gain") {
    push(`Every dollar spent puts about **${money(result.final.p50)}** in a household's hands${keptShare ? " after taxes and lost benefits" : ""}, ${window}, in the middle run. The middle 80 percent of ${result.draws.toLocaleString("en-US")} runs fall between **${money(result.final.p10)}** and **${money(result.final.p90)}**.`);
    if (keptShare) {
      const earned = result.stats.income;
      const kept = result.stats.incomeKept;
      push("", `**Earned and kept are different numbers.** The households earned ${money(earned.p50)} more in all and kept ${money(kept.p50)} of it, ${share(keptShare.likely)}, once taxes rose and cash benefits fell. The page counts what they kept. ${sentence(cap(keptShare.household))}`);
    }
    if (changedStat) push("", `Of ${startLine}, about **${count(changedStat.p50)}** end up with ${header.outcome ?? "a result"} they would not have had anyway, ${count(changedStat.p10)} to ${count(changedStat.p90)} across the middle runs.`);
  } else {
    const high = result.state === "open-ended" ? `**The high end has no finite answer**, because in ${pct(result.nothingShare)} of runs nothing changed.` : `The middle 80 percent of ${result.draws.toLocaleString("en-US")} runs fall between **${money(result.final.p10)}** and **${money(result.final.p90)}**.`;
    push(`${cap(header.outcome ?? "one counted result")} costs about **${money(result.final.p50)}** in the middle run. ${high} The file measures no dollars for the household, so the chain ends on the counted result and puts no dollar value on it.`);
    if (changedStat) push("", `Of ${startLine}, about **${count(changedStat.p50)}** end up with that result who would not have had it anyway, ${count(changedStat.p10)} to ${count(changedStat.p90)} across the middle runs.`);
  }
  if (result.state !== "stops-early" && result.state !== "refused" && unmeasured.length) {
    const one = unmeasured.length === 1;
    push("", `**This figure rests on ${unmeasured.length} ${one ? "number" : "numbers"} nobody has measured for this program.** ${one ? "It is" : "They are"} ${list(unmeasured.map(name))}.`);
  }
  if (result.state !== "stops-early" && result.nothingShare > 0 && result.state !== "refused" && result.state !== "open-ended") {
    push("", `In ${pct(result.nothingShare)} of runs the program changed nothing. Those runs are counted, not dropped.`);
  }
  push("");

  // The chain
  push(`## The chain`, "");
  if (result.tracked) {
    const allCounted = LINKS.map((k) => of(k)[0]).filter(Boolean).every((b) => b.evidence === "counted");
    push(`**Counted from the program's own records, ${period}.** The chain starts from the ${count(start)} people the program counted at the start, not from a round 1,000. Each counted step shows the number the program recorded and its rate from the step before.${allCounted ? "" : " Steps without a count are drawn from their ranges."}`, "");
  } else if (orgStep) {
    push(`The chain starts from ${START_ORGS} organizations, a round number to count with, not a count of real organizations.`, "");
  } else {
    push(`The chain starts from ${START_PEOPLE.toLocaleString("en-US")} people, a round number to count with, not a count of real people.`, "");
  }
  push(`| Link | What the file counts | Share, likely (low to high) | Left, middle run (middle 80 percent) | Lost at this step, middle run | Evidence |`);
  push(`|---|---|---|---|---|---|`);
  if (orgStep) {
    push(`| Start | Organizations the program was built for | | ${START_ORGS} | | |`);
    for (const kind of ORG_LINKS) {
      const b = of(kind)[0];
      if (b) push(`| ${KIND_NAMES[kind]} | ${b.label} | ${span(share, b.likely, b.low, b.high)} | | | ${b.evidence} |`);
    }
    const act = result.stats.activeOrganizations;
    push(`| Active organizations | | | ${span(count, act.p50, act.p10, act.p90)} | | |`);
    const ev = result.stats.everyone;
    push(`| ${KIND_NAMES["people per organization"]} | ${orgStep.label} | ${span(count, orgStep.likely, orgStep.low, orgStep.high)} | ${span(count, ev.p50, ev.p10, ev.p90)} people | | ${orgStep.evidence} |`);
  } else if (result.tracked) {
    push(`| Start | ${cap(header["built for"])} | | ${count(start)} counted | | counted |`);
  } else {
    push(`| Start | ${cap(header["built for"])} | | ${START_PEOPLE.toLocaleString("en-US")} | | |`);
  }
  for (const row of result.steps.rows) {
    const b = row.block;
    const s = row.left;
    push(`| ${KIND_NAMES[b.kind]} | ${b.label} | ${span(share, b.likely, b.low, b.high)} | ${span(count, s.p50, s.p10, s.p90)}${shown.has(b) ? ", shown, not multiplied in" : ""} | ${count(row.lost.p50)}, ${share(row.lostShare)} | ${b.evidence} |`);
  }
  if (effect) {
    push(`| Effect | ${effect.label}, measured over ${effect.over === "everyone" ? "everyone at the start" : "everyone who " + effect.over} | ${span(share, effect.likely, effect.low, effect.high)} | ${span(count, changedStat.p50, changedStat.p10, changedStat.p90)} changed | | ${effect.evidence} |`);
  }
  for (const b of gains) {
    const s = result.stats[b.kind === "income raised" ? "income" : "costsCut"];
    push(`| ${KIND_NAMES[b.kind]} | ${b.label}, ${b.per === "changed household" ? "per changed household" : "per person, measured over " + (b.over === "everyone" ? "everyone at the start" : "everyone who " + b.over)} | ${span(money, b.likely, b.low, b.high)} | ${span(money, s.p50, s.p10, s.p90)} in all | | ${b.evidence} |`);
  }
  if (keptShare) {
    const s = result.stats.incomeKept;
    push(`| ${KIND_NAMES["kept share"]} | ${keptShare.label} | ${span(share, keptShare.likely, keptShare.low, keptShare.high)} | ${span(money, s.p50, s.p10, s.p90)} kept | | ${keptShare.evidence} |`);
  }
  const costStat = result.stats.cost;
  push(`| Cost | All cost lines | | ${span(money, costStat.p50, costStat.p10, costStat.p90)} in all | | |`);
  push("");

  const most = result.steps.most;
  if (most) {
    const b = most.block;
    const howMany = b.evidence === "counted"
      ? `${count(most.lost.p50)} of the ${count(most.arrived.p50)} counted at the step before go no further, ${share(most.lostShare)}.`
      : `About ${count(most.lost.p50)} of the ${count(most.arrived.p50)} who got that far go no further in the middle run, ${share(most.lostShare)}.`;
    const inside = shown.has(b) ? ` The ${effect ? "effect" : "gain"} was measured over a group that already includes these people, so the loss is inside that figure and is not subtracted again.` : "";
    push(`**Where people leave.** The most people leave at ${name(b)}. ${howMany}${inside}`, "");
  } else {
    push(`**Where people leave.** The file counts no steps before the effect, so the page cannot say where people leave.`, "");
  }

  if (shown.size) {
    const group = effect ? effect.over : gains.find((g) => g.over)?.over;
    push(`**Shown, not multiplied in.** ${cap(list([...shown].map((b) => KIND_NAMES[b.kind].toLowerCase())))}. The ${effect ? "effect" : "gain"} in this file was measured over ${group === "everyone" ? "everyone at the start" : "everyone who " + group}, so it already counts the people who never got that far. Multiplying by ${shown.size === 1 ? "that link" : "those links"} again would subtract them twice.`, "");
  }
  if (header["seats offered"]) {
    push(`**Limited by seats.** ${sentence(header["seats offered"])} When applicants outnumber seats, reach and uptake are not what holds the program back, and the chain starts at the seat.`, "");
  }
  const firstCount = LINKS.map((k) => of(k)[0]).find(Boolean);
  if (firstCount && changedStat) {
    const s = result.stats[COUNT_NAMES[firstCount.kind]];
    push(`**The number a report leads with, beside the number that changed.** ${count(s.p50)} ${COUNT_NAMES[firstCount.kind]}. ${count(changedStat.p50)} changed.`, "");
  }

  // Where the service needs improvement
  push(`## Where the service needs improvement`, "");
  const service = result.service;
  if (service.rows.length === 0) {
    push(`The file counts no steps before the effect, so no step can be held against a benchmark.`, "");
  } else {
    push(`Each step's rate is held against a published benchmark range from \`benchmarks/benefits.json\`. The gap is how far the rate sits under the benchmark's likely value, as a share of that value.`, "");
    push(`| Step | This program | Benchmark, likely (low to high) | Where it sits |`);
    push(`|---|---|---|---|`);
    for (const r of service.rows) {
      const e = r.check.entry;
      const bench = e ? `${share(e.likely)} (${share(e.low)} to ${share(e.high)}), \`${e.id}\`` : "None";
      let sits;
      if (r.check.none) sits = "No benchmark. The file sets none for this step";
      else if (r.check.missing) sits = "No benchmark. This repo has no published benchmark for this step";
      else if (r.check.self) sits = "Its number is this benchmark, so it is not compared";
      else if (r.belowLow) sits = `Under the whole range, ${pct(r.shortfall)} under its likely value`;
      else if (r.shortfall > 0) sits = `Inside the range, ${pct(r.shortfall)} under its likely value`;
      else sits = "At or above its likely value";
      push(`| ${KIND_NAMES[r.block.kind]}, ${r.block.label} | ${share(r.rate)} | ${bench} | ${sits} |`);
    }
    push("");
    const w = service.weakest;
    if (w) {
      const e = w.check.entry;
      const guess = w.block.evidence === "assumed" ? " This rate is a guess, so the gap is a guess too." : "";
      push(`**${cap(name(w.block))} falls furthest below its benchmark.** Its rate of ${share(w.rate)} sits ${pct(w.shortfall)} under the benchmark's likely value of ${share(e.likely)}${w.belowLow ? `, and under the whole published range of ${share(e.low)} to ${share(e.high)}` : ""}. That is the step where the service needs improvement first.${guess} A benchmark is a default, never a fact. Its published points come from other programs and places, listed under Benchmarks this page used.`, "");
    } else if (service.anyCompared) {
      push(`**No step falls below its benchmark's likely value.** The page names no step for improvement.`, "");
    } else {
      push(`**No step is held against a published benchmark.** The page names no step for improvement and does not invent one.`, "");
    }
  }

  // Ranking
  if (result.state !== "stops-early") {
    push(`## What moves the answer most`, "");
    if (result.atLikely.final === Infinity || result.atLikely.nothingChanged) {
      push(`At the likely values nothing changes, so no number can be ranked by how far it moves the answer.`);
    } else {
      push(`Each row holds every other number at its likely value and moves one number from its low to its high.`, "");
      push(`| Rank | Number | At its low | At its high | Evidence |`);
      push(`|---|---|---|---|---|`);
      result.ranking.forEach((r, i) => {
        push(`| ${i + 1} | ${r.block.label} (${value(r.block, r.block.low)} to ${value(r.block, r.block.high)}) | ${money(r.atLow)} | ${money(r.atHigh)} | ${r.block.evidence} |`);
      });
    }
    push("");
  }

  // What the household keeps
  if (keptShare) {
    push(`## What the household keeps`, "");
    push(`${keptShare.note ?? ""}`, "");
    push(`Kept counts cash and near-cash only, federal and state income tax after credits, the employee side of payroll tax, SNAP, TANF, and SSI. Health coverage and its subsidies are shown apart and never added in. The figure comes from an open tax and benefit model applying ${keptShare.source.match(/(\d{4}) rules/)?.[1] ?? "current"} rules to one named household, and the page rebuilds from the number written in the file, not from a live call.`, "");
  }

  // Time window
  if (gains.length) {
    push(`## The time window`, "");
    for (const b of gains) {
      push(`- **${b.label}.** Window: ${trim(b.window)}. Measured at: ${trim(b.measuredAt)}. One-time or recurring: ${trim(b.repeats)}.`);
    }
    push("", `The page counts only the window the file states and stretches nothing past it. Later dollars are not discounted. Income raised and costs cut are kept apart, because wage and benefit records can check the first and the second is mostly self-reported.`, "");
  }

  // Every number
  push(`## Every number, with its source`, "");
  push(`| Link | Number | Low | Likely | High | Evidence | Source | Note |`);
  push(`|---|---|---|---|---|---|---|---|`);
  for (const b of [...links, ...of("cost")]) {
    const kind = KIND_NAMES[b.kind] + (b.kind === "cost" ? `, per ${b.per === "everyone" ? "person at the start" : b.per === "organization" ? "organization" : "person who " + b.per}` : "") + (b.kind === "cost" && !b.countedInBudget ? ", outside the budget" : "");
    const note = [
      b.counted != null ? `Counted: ${b.counted.toLocaleString("en-US")}, ${period}.` : "",
      b.comparedWith ? `Compared with: ${sentence(b.comparedWith)}` : "",
      b.household ? `Household: ${sentence(b.household)}` : "",
      b.range ? `Range: ${b.range}` : "",
      b.kind === "kept share" ? "" : (b.note ?? ""),
    ].filter(Boolean).join(" ");
    push(`| ${kind} | ${b.label} | ${value(b, b.low)} | ${value(b, b.likely)} | ${value(b, b.high)} | ${b.evidence} | ${sourceCell(b)} | ${note} |`);
  }
  push("");

  // Benchmarks
  const uses = new Map();
  const use = (e, role) => {
    if (!uses.has(e)) uses.set(e, []);
    uses.get(e).push(role);
  };
  for (const b of [...links, ...of("cost")]) {
    if (b.benchmarkEntry) use(b.benchmarkEntry, `for "${b.label}"`);
    if (b.check?.entry && !b.check.self) use(b.check.entry, `to check "${b.label}"`);
  }
  if (uses.size) {
    push(`## Benchmarks this page used`, "");
    push(`A benchmark is a default, never a fact. Any of these can be overridden in the chain file.`, "");
    for (const [e, roles] of uses) {
      push(`**${e.label}**, used ${list(roles)}. ${e.how_set}`, "");
      push(`What it does not cover. ${e.does_not_cover}`, "");
      for (const p of e.points) {
        push(`- ${e.unit.startsWith("dollars") ? money(p.value) : share(p.value)}. ${p.what} ${p.place}. ${p.year}. [${p.source}](${p.url})`);
      }
      push("");
    }
  }

  push(`## How the range was made`, "");
  push(`Each number above was drawn ${result.draws.toLocaleString("en-US")} times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. That triangle is drawn between a low, a likely, and a high, and it is not a statistical confidence interval.${result.tracked ? " Counted numbers are not drawn. They stay fixed at what the program recorded." : ""} Each run walks the chain from the start to the end. The middle run is the median and the range is the 10th to the 90th percentile. The seed is ${result.seed}, so the same file gives the same page on any machine.`, "");

  push(`## What this page refuses to do`, "");
  push(`It never prints a final figure without a range. It never counts an effect with no comparison group, or one that does not say who it was measured over. It never puts dollars on a result nobody measured in dollars. It never stretches a gain past the window someone measured. It never names a step for improvement without a published benchmark to hold it against. It never compares this program to another one. It never uses a benchmark without naming it and its source.`, "");

  return lines.join("\n");
}

function trim(s) {
  return s.replace(/[.\s]+$/, "");
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
