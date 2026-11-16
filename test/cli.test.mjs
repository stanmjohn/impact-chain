// The command reads one chain file at a time and refuses a second one,
// because the tool never compares two programs. No network.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { files, ONE_FILE } from "../bin/impact-chain.mjs";

const bin = fileURLToPath(new URL("../bin/impact-chain.mjs", import.meta.url));

test("flags and their values are not read as file names", () => {
  assert.deepEqual(files(["a.txt", "--out", "b.md", "--draws", "500", "--stdout"]), ["a.txt"]);
  assert.deepEqual(files(["a.txt", "b.txt"]), ["a.txt", "b.txt"]);
});

test("a second chain file is refused, not dropped", () => {
  const r = spawnSync(process.execPath, [bin, "examples/made-up-grant-applicant.txt", "examples/made-up-free-tax-help.txt", "--stdout"], { encoding: "utf8", cwd: fileURLToPath(new URL("..", import.meta.url)) });
  assert.equal(r.status, 1);
  assert.ok(r.stderr.includes(ONE_FILE));
  assert.equal(r.stdout, "");
});
