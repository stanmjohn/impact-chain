// Done looks like: a stranger runs one command on a committed example file
// and gets the committed page back exactly. This test is that stranger. It
// also checks the benchmark page, that every example is a made-up program,
// and that the excerpt pasted into the README matches its committed page.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../bin/impact-chain.mjs";
import { loadBenchmarks, benchmarksPage } from "../src/benchmarks.mjs";
import { parseChain } from "../src/parse.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const dir = join(root, "examples");
const files = readdirSync(dir).filter((f) => f.endsWith(".txt"));
const lf = (s) => s.replace(/\r\n/g, "\n");

test("there are worked examples, and at least one uses tracking mode", () => {
  assert.ok(files.length >= 4);
  assert.ok(files.some((f) => parseChain(readFileSync(join(dir, f), "utf8")).header.countedStart != null));
});

for (const f of files) {
  test(`${f} rebuilds its committed page exactly`, () => {
    const text = readFileSync(join(dir, f), "utf8");
    const want = readFileSync(join(dir, f.replace(/\.txt$/, ".md")), "utf8");
    assert.equal(lf(build(text)), lf(want));
  });

  test(`${f} is a made-up program marked PLACEHOLDER`, () => {
    const c = parseChain(readFileSync(join(dir, f), "utf8"));
    assert.ok(c.header.madeUp, `${f} must say "made up: yes"`);
    assert.ok(lf(readFileSync(join(dir, f.replace(/\.txt$/, ".md")), "utf8")).includes("> **PLACEHOLDER. This program is made up.**"));
  });
}

test("the benchmark page rebuilds exactly from the benchmark file", () => {
  const want = lf(readFileSync(join(root, "benchmarks", "benefits.md"), "utf8"));
  assert.equal(benchmarksPage(loadBenchmarks()) + "\n", want);
});

test("every README excerpt matches the committed page it came from", () => {
  const readme = lf(readFileSync(join(root, "README.md"), "utf8"));
  const found = [...readme.matchAll(/<!-- excerpt from (examples\/[^ ]+\.md) -->\n([\s\S]*?)\n<!-- end excerpt -->/g)];
  assert.ok(found.length > 0, "the README needs an excerpt between its markers");
  for (const m of found) {
    const page = lf(readFileSync(join(root, m[1]), "utf8"));
    assert.ok(page.includes(m[2]), `an excerpt from ${m[1]} must be pasted from the page word for word`);
  }
});
