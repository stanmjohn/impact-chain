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
  const unmeasured = counted.filter((b) => b.evidence !== "measured");
  const window = gains.length ? gains[0].window : null;

  push(`# Impact chain: ${header.product}`, "");
  if (header.madeUp) {
    push(`> **This product is made up.** It shows the page an applicant can write before a grant, when most links are still guesses. The benchmarks it leans on are real and sourced below.`, "");
  }
  push([`Built for ${header["built for"]}`, header.place, header.years].filter(Boolean).join(" · "), "");

  // The measurement plan
  push(`## The measurement plan`, "");
  const byEvidence = (e) => links.filter((b) => b.evidence === e).map((b) => short(b.kind));
  const gainIsTheEffect = gains.some((g) => g.per === "measured group");
  const missing = ["reach", "uptake", "staying", "effect"].filter((k) => of(k).length === 0 && !(k === "effect" && gainIsTheEffect)).map((k) => KIND_NAMES[k].toLowerCase());
  if (gains.length === 0) missing.push("household gain");
  push(`- **Measured today.** ${cap(list(byEvidence("measured")))}.`);
  push(`- **Assumed.** ${cap(list(byEvidence("assumed")))}.`);
  push(`- **From a benchmark.** ${cap(list(byEvidence("benchmark")))}.`);
  push(`- **Not in the file.** ${cap(list(missing))}.${gainIsTheEffect ? " The effect is inside the gain figure, which was measured in dollars against a comparison group." : ""}`, "");

  const firstSoft = links.find((b) => b.evidence !== "measured");
  function planBuys() {
    const topSoft = result.ranking.find((r) => r.block.evidence !== "measured");
    const top = result.ranking[0];
    if (!topSoft || !top) return;
    push("", top.block === topSoft.block
      ? `**What the evaluation budget buys.** The number that moves the answer most is ${name(top.block)}, and nobody has measured it. Measuring that one link does more for this page than measuring any other.`
      : `**What the evaluation budget buys.** The number that moves the answer most, ${name(top.block)}, is already measured. The unmeasured number that moves it most is ${name(topSoft.block)}. That is the one to measure.`);
  }
  if (result.state === "stops-early") {
    push(`**Measured numbers run through ${KIND_NAMES[links[links.length - 1].kind].toLowerCase()} and stop.** Nobody has measured what the product changed against a comparison group. That is the link an evaluation has to buy first, because every figure after it rests on it.`);
  } else if (!firstSoft) {
    push(`**Every link in this chain was measured.** An evaluation budget here buys a longer window or a second place, not a missing link.`);
  } else if (!links.some((b) => b.evidence === "measured")) {
    push(`**No link in this file has been measured yet.** Every number is a guess or a benchmark, and the page marks each one.`);
    planBuys();
  } else {
    push(`**Measured numbers stop at ${name(firstSoft)}.** Every link from there on is ${firstSoft.evidence === "benchmark" ? "a benchmark or a guess" : "a guess or a benchmark"}, and the page marks each one.`);
    planBuys();
  }
  push("");

  // The read
  push(`## The read`, "");
  const changedStat = result.stats.changed;
  const startLine = orgStep ? `${START_ORGS} organizations the product was built for` : `${START_PEOPLE.toLocaleString("en-US")} people the product was built for`;
  if (result.state === "stops-early") {
    push(`**No final figure.** The file carries no effect measured against a comparison group, so the chain cannot say what the product changed or what that put in a household's hands. Printing a ratio here would mean inventing the link that matters most.`);
  } else if (result.state === "refused") {
    push(`**No estimate.** In ${pct(result.nothingShare)} of ${result.draws.toLocaleString("en-US")} runs the product changed nothing beyond what happens without it. A figure printed on top of that would be a guess with a dollar sign.`);
  } else if (result.end === "gain") {
    push(`Every dollar spent puts about **${money(result.final.p50)}** in a household's hands${keptShare ? " after taxes and lost benefits" : ""}, ${window}, in the middle run. The middle 80 percent of ${result.draws.toLocaleString("en-US")} runs fall between **${money(result.final.p10)}** and **${money(result.final.p90)}**.`);
    if (keptShare) {
      const earned = result.stats.income;
      const kept = result.stats.incomeKept;
      push("", `**Earned and kept are different numbers.** The households earned ${money(earned.p50)} more in all and kept ${money(kept.p50)} of it, ${share(keptShare.likely)}, once taxes rose and cash benefits fell. The page counts what they kept. ${keptShare.household.charAt(0).toUpperCase() + keptShare.household.slice(1)}.`);
    }
    if (changedStat) push("", `Of ${startLine}, about **${count(changedStat.p50)}** end up with ${header.outcome ?? "a result"} they would not have had anyway, ${count(changedStat.p10)} to ${count(changedStat.p90)} across the middle runs.`);
  } else {
    const high = result.state === "open-ended" ? `**The high end has no finite answer**, because in ${pct(result.nothingShare)} of runs nothing changed.` : `The middle 80 percent of ${result.draws.toLocaleString("en-US")} runs fall between **${money(result.final.p10)}** and **${money(result.final.p90)}**.`;
    push(`${cap(header.outcome ?? "one counted result")} costs about **${money(result.final.p50)}** in the middle run. ${high} The file measures no dollars for the household, so the chain ends on the counted result and puts no dollar value on it.`);
    if (changedStat) push("", `Of ${startLine}, about **${count(changedStat.p50)}** end up with that result who would not have had it anyway, ${count(changedStat.p10)} to ${count(changedStat.p90)} across the middle runs.`);
  }
  if (result.state !== "stops-early" && result.state !== "refused" && unmeasured.length) {
    push("", `**This figure rests on ${unmeasured.length} ${unmeasured.length === 1 ? "number" : "numbers"} nobody has measured for this product:** ${list(unmeasured.map(name))}.`);
  }
  if (result.state !== "stops-early" && result.nothingShare > 0 && result.state !== "refused" && result.state !== "open-ended") {
    push("", `In ${pct(result.nothingShare)} of runs the product changed nothing. Those runs are counted, not dropped.`);
  }
  push("");

  // The chain
  push(`## The chain`, "");
  push(`| Link | What the file counts | Share, likely (low to high) | Left, middle run (middle 80 percent) | Evidence |`);
  push(`|---|---|---|---|---|`);
  if (orgStep) {
    push(`| Start | Organizations the product was built for | | ${START_ORGS} | |`);
    for (const kind of ORG_LINKS) {
      const b = of(kind)[0];
      if (b) push(`| ${KIND_NAMES[kind]} | ${b.label} | ${share(b.likely)} (${share(b.low)} to ${share(b.high)}) | | ${b.evidence} |`);
    }
    const act = result.stats.activeOrganizations;
    push(`| Active organizations | | | ${count(act.p50)} (${count(act.p10)} to ${count(act.p90)}) | |`);
    const ev = result.stats.everyone;
    push(`| ${KIND_NAMES["people per organization"]} | ${orgStep.label} | ${count(orgStep.likely)} (${count(orgStep.low)} to ${count(orgStep.high)}) | ${count(ev.p50)} people (${count(ev.p10)} to ${count(ev.p90)}) | ${orgStep.evidence} |`);
  } else {
    push(`| Start | ${cap(header["built for"])} | | ${START_PEOPLE.toLocaleString("en-US")} | |`);
  }
  for (const kind of LINKS) {
    const b = of(kind)[0];
    if (!b) continue;
    const s = result.stats[COUNT_NAMES[kind]];
    push(`| ${KIND_NAMES[kind]} | ${b.label} | ${share(b.likely)} (${share(b.low)} to ${share(b.high)}) | ${count(s.p50)} (${count(s.p10)} to ${count(s.p90)})${shown.has(b) ? ", shown, not multiplied in" : ""} | ${b.evidence} |`);
  }
  if (effect) {
    push(`| Effect | ${effect.label}, measured over ${effect.over === "everyone" ? "everyone at the start" : "everyone who " + effect.over} | ${share(effect.likely)} (${share(effect.low)} to ${share(effect.high)}) | ${count(changedStat.p50)} changed (${count(changedStat.p10)} to ${count(changedStat.p90)}) | ${effect.evidence} |`);
  }
  for (const b of gains) {
    const s = result.stats[b.kind === "income raised" ? "income" : "costsCut"];
    push(`| ${KIND_NAMES[b.kind]} | ${b.label}, ${b.per === "changed household" ? "per changed household" : "per person, measured over " + (b.over === "everyone" ? "everyone at the start" : "everyone who " + b.over)} | ${money(b.likely)} (${money(b.low)} to ${money(b.high)}) | ${money(s.p50)} in all (${money(s.p10)} to ${money(s.p90)}) | ${b.evidence} |`);
  }
  if (keptShare) {
    const s = result.stats.incomeKept;
    push(`| ${KIND_NAMES["kept share"]} | ${keptShare.label} | ${share(keptShare.likely)} (${share(keptShare.low)} to ${share(keptShare.high)}) | ${money(s.p50)} kept (${money(s.p10)} to ${money(s.p90)}) | ${keptShare.evidence} |`);
  }
  const costStat = result.stats.cost;
  push(`| Cost | All cost lines | | ${money(costStat.p50)} in all (${money(costStat.p10)} to ${money(costStat.p90)}) | |`);
  push("");

  if (shown.size) {
    const group = effect ? effect.over : gains.find((g) => g.over)?.over;
    push(`**Shown, not multiplied in.** ${cap(list([...shown].map((b) => KIND_NAMES[b.kind].toLowerCase())))}. The ${effect ? "effect" : "gain"} in this file was measured over ${group === "everyone" ? "everyone at the start" : "everyone who " + group}, so it already counts the people who never got that far. Multiplying by ${shown.size === 1 ? "that link" : "those links"} again would subtract them twice.`, "");
  }
  if (header["seats offered"]) {
    push(`**Limited by seats.** ${header["seats offered"]} When applicants outnumber seats, reach and uptake are not what holds the product back, and the chain starts at the seat.`, "");
  }
  const firstCount = LINKS.map((k) => of(k)[0]).find(Boolean);
  if (firstCount && changedStat) {
    const s = result.stats[COUNT_NAMES[firstCount.kind]];
    push(`**The number a report leads with, beside the number that changed.** ${count(s.p50)} ${COUNT_NAMES[firstCount.kind]}. ${count(changedStat.p50)} changed.`, "");
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
      b.comparedWith ? `Compared with: ${b.comparedWith}.` : "",
      b.household ? `Household: ${b.household}.` : "",
      b.range ? `Range: ${b.range}` : "",
      b.kind === "kept share" ? "" : (b.note ?? ""),
    ].filter(Boolean).join(" ");
    push(`| ${kind} | ${b.label} | ${value(b, b.low)} | ${value(b, b.likely)} | ${value(b, b.high)} | ${b.evidence} | ${sourceCell(b)} | ${note} |`);
  }
  push("");

  // Benchmarks
  const used = blocks.filter((b) => b.benchmarkEntry);
  if (used.length) {
    push(`## Benchmarks this page used`, "");
    push(`A benchmark is a default, never a fact. Any of these can be overridden in the chain file.`, "");
    for (const b of used) {
      const e = b.benchmarkEntry;
      push(`**${e.label}**, used for "${b.label}". ${e.how_set}`, "");
      push(`What it does not cover. ${e.does_not_cover}`, "");
      for (const p of e.points) {
        push(`- ${e.unit.startsWith("dollars") ? money(p.value) : share(p.value)}. ${p.what} ${p.place}. ${p.year}. [${p.source}](${p.url})`);
      }
      push("");
    }
  }

  push(`## How the range was made`, "");
  push(`Each number above was drawn ${result.draws.toLocaleString("en-US")} times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. Each run walks the chain from the start to the end. The middle run is the median and the range is the 10th to the 90th percentile. The seed is ${result.seed}, so the same file gives the same page on any machine.`, "");

  push(`## What this page refuses to do`, "");
  push(`It never prints a final figure without a range. It never counts an effect with no comparison group, or one that does not say who it was measured over. It never puts dollars on a result nobody measured in dollars. It never stretches a gain past the window someone measured. It never compares this product to another one. It never uses a benchmark without naming it and its source.`, "");

  return lines.join("\n");
}

function trim(s) {
  return s.replace(/[.\s]+$/, "");
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
