// Reads a chain file. Plain text, written by hand, one block per link.
//
//   product: Example Screener        header lines, key then colon then value
//   [reach] Opened the text message  a block opens with its kind and a label
//   low: 20%                         numbers may carry $ , and %
//   likely: 30%
//   high: 40%
//   evidence: assumed                measured, assumed, benchmark, or modeled
//   source: Our own guess
//
// Every error names the line it came from. Three refusals live here because
// they are about what a file is allowed to leave out: an effect with no group
// it was measured over, a household gain with no time window, and any number
// with no source or no word on whether it was measured.

export const LINKS = ["reach", "uptake", "staying"];
export const ORG_LINKS = ["org reach", "org uptake", "org staying"];
export const GAIN_KINDS = ["income raised", "costs cut"];
export const BLOCK_KINDS = [...ORG_LINKS, "people per organization", ...LINKS, "effect", ...GAIN_KINDS, "kept share", "cost"];

// Groups a figure can be measured over or a cost charged to, in chain order.
export const GROUPS = ["everyone", "reached", "started", "stayed"];
const GROUP_NEEDS = { everyone: [], reached: ["reach"], started: ["reach", "uptake"], stayed: ["reach", "uptake", "staying"] };

const HEADER_KEYS = ["product", "built for", "place", "years", "outcome", "dollars", "seats offered", "made up", "household state", "household ages", "household income", "household gain per year", "household rules year"];
const BLOCK_KEYS = [
  "low", "likely", "high", "benchmark", "evidence", "source", "url", "note", "range",
  "measured over", "compared with", "per", "window", "measured at", "repeats", "counted in budget", "household",
];

/** "$4,000" -> 4000, "12%" -> 0.12, "-2.1%" -> -0.021 */
export function number(text, line) {
  const raw = String(text).trim();
  const isPct = raw.endsWith("%");
  const n = Number(raw.replace(/[$,%\s]/g, ""));
  if (raw === "" || Number.isNaN(n)) throw new Error(`Line ${line}: "${raw}" is not a number.`);
  return isPct ? n / 100 : n;
}

export function parseChain(text) {
  const header = {};
  const blocks = [];
  let current = null;

  text.replace(/\r\n/g, "\n").split("\n").forEach((rawLine, idx) => {
    const lineNo = idx + 1;
    const line = rawLine.trim();
    if (line === "" || line.startsWith("#")) return;

    const open = line.match(/^\[([^\]]+)\]\s*(.*)$/);
    if (open) {
      const kind = open[1].trim().toLowerCase();
      if (!BLOCK_KINDS.includes(kind)) {
        throw new Error(`Line ${lineNo}: "[${open[1]}]" is not a block this tool knows. Use one of: ${BLOCK_KINDS.join(", ")}.`);
      }
      if (!open[2]) throw new Error(`Line ${lineNo}: the [${kind}] block needs a label after the bracket.`);
      current = { kind, label: open[2].trim(), line: lineNo, countedInBudget: true };
      blocks.push(current);
      return;
    }

    const colon = line.indexOf(":");
    if (colon === -1) throw new Error(`Line ${lineNo}: expected "key: value", got "${line}".`);
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (!current) {
      if (!HEADER_KEYS.includes(key)) throw new Error(`Line ${lineNo}: "${key}" is not a header this tool knows. Use one of: ${HEADER_KEYS.join(", ")}.`);
      header[key] = value;
      return;
    }
    if (!BLOCK_KEYS.includes(key)) throw new Error(`Line ${lineNo}: "${key}" is not a field this tool knows. Use one of: ${BLOCK_KEYS.join(", ")}.`);
    if (key === "low" || key === "likely" || key === "high") current[key] = number(value, lineNo);
    else if (key === "counted in budget") current.countedInBudget = !/^no$/i.test(value);
    else if (key === "measured over") current.over = group(value, lineNo, "measured over");
    else if (key === "per") current.per = value.toLowerCase();
    else if (key === "evidence") current.evidence = value.toLowerCase();
    else if (key === "compared with") current.comparedWith = value;
    else if (key === "measured at") current.measuredAt = value;
    else current[key] = value;
  });

  validate(header, blocks);
  return { header: { ...header, madeUp: /^yes$/i.test(header["made up"] ?? "") }, blocks };
}

function group(value, line, field) {
  const g = value.toLowerCase();
  if (!GROUPS.includes(g)) throw new Error(`Line ${line}: "${field}" must be one of: ${GROUPS.join(", ")}.`);
  return g;
}

function validate(header, blocks) {
  for (const key of ["product", "built for"]) {
    if (!header[key]) throw new Error(`The file needs a "${key}:" line at the top.`);
  }
  const of = (kind) => blocks.filter((b) => b.kind === kind);
  const has = (kind) => of(kind).length > 0;
  for (const kind of [...ORG_LINKS, "people per organization", ...LINKS, "effect", "kept share"]) {
    if (of(kind).length > 1) throw new Error(`Only one [${kind}] block is allowed.`);
  }
  if (!has("cost")) throw new Error(`The file needs at least one [cost] block.`);

  const orgBlocks = [...ORG_LINKS, "people per organization"].filter(has);
  if (orgBlocks.length > 0 && !has("people per organization")) {
    throw new Error(`The file has organization links and no [people per organization] block, so the chain cannot get from organizations to people.`);
  }

  const needs = (b, g, what) => {
    for (const link of GROUP_NEEDS[g]) {
      if (!has(link)) throw new Error(`Line ${b.line}: "${b.label}" is ${what} "${g}", and the file has no [${link}] block to say how many that is.`);
    }
  };

  for (const b of blocks) {
    if (!b.benchmark) {
      for (const f of ["low", "likely", "high"]) {
        if (b[f] == null) throw new Error(`Line ${b.line}: the [${b.kind}] block "${b.label}" needs low, likely, and high, or a benchmark. One value alone is a point estimate with no range.`);
      }
      if (!(b.low <= b.likely && b.likely <= b.high)) throw new Error(`Line ${b.line}: in "${b.label}", low, likely, and high must run in that order.`);
      if (!b.source) throw new Error(`Line ${b.line}: "${b.label}" has no source. Every number carries one, even if the source is "our own guess".`);
      const allowed = b.kind === "kept share" ? ["measured", "assumed", "modeled"] : ["measured", "assumed"];
      if (!allowed.includes(b.evidence)) {
        throw new Error(`Line ${b.line}: "${b.label}" needs "evidence: measured" or "evidence: assumed". The page draws a line where measured numbers stop, so every number has to say which side it is on.`);
      }
    } else {
      b.evidence = "benchmark";
    }

    if (b.kind === "effect") {
      if (!b.over) throw new Error(`Line ${b.line}: the [effect] block needs a "measured over:" line, one of ${GROUPS.join(", ")}. A study that measured everyone offered already counts the people who dropped out, and multiplying by staying again subtracts them twice.`);
      if (!b.comparedWith) throw new Error(`Line ${b.line}: the [effect] block needs a "compared with:" line naming the comparison. An effect with no comparison is a count of what happened, not of what the product changed.`);
      needs(b, b.over, "measured over");
    }

    if (GAIN_KINDS.includes(b.kind)) {
      for (const [field, key] of [["window", "window"], ["measured at", "measuredAt"], ["repeats", "repeats"]]) {
        if (!b[key]) throw new Error(`Line ${b.line}: "${b.label}" needs a "${field}:" line. The same product gives opposite answers in different windows, so a household gain with no window is refused.`);
      }
      b.per = b.per ?? "changed household";
      if (b.per === "changed household") {
        if (!has("effect")) throw new Error(`Line ${b.line}: "${b.label}" is per changed household, and the file has no [effect] block to say how many households changed.`);
      } else if (b.per === "measured group") {
        if (!b.over) throw new Error(`Line ${b.line}: "${b.label}" is per measured group and needs a "measured over:" line.`);
        if (!b.comparedWith) throw new Error(`Line ${b.line}: "${b.label}" is per measured group and needs a "compared with:" line naming the comparison.`);
        needs(b, b.over, "measured over");
      } else {
        throw new Error(`Line ${b.line}: "per:" on a gain block must be "changed household" or "measured group".`);
      }
    }

    if (b.kind === "kept share") {
      if (!has("income raised")) throw new Error(`Line ${b.line}: "${b.label}" is a kept share, and the file has no [income raised] block for it to apply to.`);
      if (!b.household) throw new Error(`Line ${b.line}: "${b.label}" needs a "household:" line naming who was priced. A kept share with no household is a number with no one behind it.`);
    }

    if (b.kind === "cost") {
      b.per = b.per ?? "everyone";
      if (b.per === "organization") {
        if (!has("people per organization")) throw new Error(`Line ${b.line}: "${b.label}" is charged per organization, and the file has no organization step.`);
      } else {
        group(b.per, b.line, "per");
        needs(b, b.per, "charged per person in");
      }
    }
  }
}
