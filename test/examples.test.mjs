// Done looks like: a stranger runs one command on a committed example file
// and gets the committed page back exactly. This test is that stranger.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../bin/impact-chain.mjs";

const dir = fileURLToPath(new URL("../examples/", import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith(".txt"));

test("there are worked examples", () => {
  assert.ok(files.length >= 4);
});

for (const f of files) {
  test(`${f} rebuilds its committed page exactly`, () => {
    const text = readFileSync(join(dir, f), "utf8");
    const want = readFileSync(join(dir, f.replace(/\.txt$/, ".md")), "utf8");
    const got = build(text);
    assert.equal(got.replace(/\r\n/g, "\n"), want.replace(/\r\n/g, "\n"));
  });
}
