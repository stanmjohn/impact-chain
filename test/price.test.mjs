// The price step, without the network. The request body has the shape the
// model expects, the arithmetic over a canned answer is right, and the block
// it writes carries the household, the model version, and the date.

import { test } from "node:test";
import assert from "node:assert/strict";
import { household, block, CASH_LINES } from "../src/price.mjs";
import { parseChain } from "../src/parse.mjs";

test("one adult becomes one person, one tax unit, and one marital unit", () => {
  const body = household({ state: "PA", ages: [24], income: 27338, year: 2025 }).household;
  assert.deepEqual(Object.keys(body.people), ["p1"]);
  assert.equal(body.people.p1.employment_income[2025], 27338);
  assert.equal(body.households.hh.state_name[2025], "PA");
  assert.equal(body.tax_units.tu.income_tax[2025], null);
  assert.equal(body.spm_units.spm.snap[2025], null);
  assert.deepEqual(Object.keys(body.marital_units), ["mu_p1"]);
});

test("two adults share a marital unit and a child gets its own", () => {
  const body = household({ state: "PA", ages: [30, 31, 5], income: 40000, year: 2025 }).household;
  assert.deepEqual(body.marital_units.mu.members, ["p1", "p2"]);
  assert.deepEqual(body.marital_units.mu_p3.members, ["p3"]);
  assert.equal(body.people.p2.employment_income[2025], 0);
});

test("kept counts taxes as minus and cash benefits as plus, and health not at all", () => {
  const signs = Object.fromEntries(CASH_LINES.map((l) => [l.key, l.sign]));
  assert.equal(signs.income_tax, -1);
  assert.equal(signs.employee_payroll_tax, -1);
  assert.equal(signs.snap, 1);
  assert.ok(!("medicaid" in signs));
  assert.ok(!("aca_ptc" in signs));
});

const priced = {
  state: "PA", ages: [24], income: 27338, gain: 8251, year: 2025, modelVersion: "1.0.0",
  lines: [
    { label: "federal income tax after credits", before: 1000, after: 2000 },
    { label: "SNAP", before: 300, after: 0 },
    { label: "TANF", before: 0, after: 0 },
  ],
  health: [{ label: "ACA premium subsidy", before: 4000, after: 3000 }],
  cashBefore: 26638, cashAfter: 33589, kept: 6951, share: 6951 / 8251,
};

test("the block names the household, the model version, the date, and what moved", () => {
  const text = block(priced, "2026-09-25");
  assert.ok(text.startsWith("[kept share] "));
  assert.ok(text.includes("likely: 84.2%"));
  assert.ok(text.includes("evidence: modeled"));
  assert.ok(text.includes("version 1.0.0, 2025 rules, priced on 2026-09-25"));
  assert.ok(text.includes("household: one adult, age 24, in PA, earning $27,338 before the raise"));
  assert.ok(text.includes("SNAP $300 to $0"));
  assert.ok(!text.includes("TANF"));
  assert.ok(text.includes("Shown apart and not counted, ACA premium subsidy $4,000 to $3,000"));
});

test("the block the price step writes is a block the reader accepts", () => {
  const file = `
product: Example
built for: people
[income raised] Earnings added
per: measured group
measured over: everyone
compared with: a lottery group
window: one year
measured at: month twelve
repeats: recurring
low: 8,000
likely: 8,251
high: 8,500
evidence: measured
source: test
[cost] Cost
low: 5,000
likely: 5,000
high: 5,000
evidence: measured
source: test

${block(priced, "2026-09-25")}
`;
  const c = parseChain(file);
  const kept = c.blocks.find((b) => b.kind === "kept share");
  assert.equal(kept.evidence, "modeled");
  assert.equal(Math.round(kept.likely * 1000), 842);
  assert.ok(kept.household.startsWith("one adult"));
});
