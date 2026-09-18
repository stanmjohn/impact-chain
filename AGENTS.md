# AGENTS.md

Instructions for an AI coding tool working in this repo. The README is for people and says what the tool is for. This file says how to change it without breaking its promises.

## What this is

A command line tool. A plain text file describing a product goes in, a one-page markdown measurement page comes out. The page walks 1,000 people down five links: reach, uptake, staying, effect, and household gain. Node 20 or newer, ES modules, no dependencies, no build step, no network.

## Commands

```
npm test                                                                    # all tests
node bin/impact-chain.mjs examples/snap-outreach-pennsylvania.txt --stdout  # print a page
node bin/impact-chain.mjs examples/snap-outreach-pennsylvania.txt           # rewrite the .md beside the file
node bin/impact-chain.mjs benchmarks                                        # print the benchmark page
```

Run the tests before and after any change.

## Layout

- `bin/impact-chain.mjs` reads the arguments and writes the file. No logic lives here.
- `src/parse.mjs` reads the chain file. Every error names the line it came from. The refusals about what a file may leave out live here.
- `src/benchmarks.mjs` fills in any block that names a benchmark and marks it so the page can name it.
- `src/model.mjs` does all the arithmetic of the chain.
- `src/simulate.mjs` holds the seeded draws and the summary statistics. It knows nothing about products.
- `src/report.mjs` formats the page. It computes nothing.
- `benchmarks/benefits.json` is the data. `benchmarks/benefits.md` is the same data as a readable page.
- `examples/` holds each chain file as `.txt` with its committed page as `.md`.
- `test/fixture.mjs` is one well-formed chain file that the tests bend into bad ones.

Keep that split. Math added to `report.mjs` or formatting added to `model.mjs` is a wrong change.

## Rules that must survive any edit

1. Add no dependencies. The standard library and `node:test` cover everything here.
2. Same file, same page, byte for byte, on any machine. The seed is fixed, the page carries no date, and `.gitattributes` holds line endings to LF. Do not add a timestamp, `Math.random`, or anything that reads the clock or the locale.
3. `test/examples.test.mjs` rebuilds every example and compares it to the committed file. A change to the math or the wording means rerunning each `examples/*.txt` and committing the new `.md` files in the same commit.
4. Every effect names the group it was measured over, and the model multiplies only the links above that group. An effect measured over everyone offered the product already has the dropouts inside it. Those links print as "shown, not multiplied in." `test/model.test.mjs` pins the double-count case.
5. Four gaps are refused, never warned about. An effect with no `measured over:` group. An effect with no `compared with:` group. A household gain with no `window:`, `measured at:`, or `repeats:` line. Any number with no source or no evidence word.
6. The last link is named Household gain, split into income raised and costs cut, always over a stated window. Do not rename it or borrow another organization's label for it.
7. The page never prints a final figure without a range, never puts dollars on a result nobody measured in dollars, never stretches a gain past its measured window, never discounts later dollars, never compares two products, and never uses a benchmark without naming it.
8. Every number keeps its evidence word, `measured`, `assumed`, or `benchmark`. The page opens on the measurement plan and counts the unmeasured numbers under its figure.
9. `test/report.test.mjs` pins the sentences that must never disappear. When one of those tests fails, fix the page, not the test.

## Adding a benchmark or an example

A benchmark needs a public source a reader can open, plus its year, place, how it was measured, and what it does not cover. Add it to `benefits.json`. The `benchmarks` command prints the page, so send its output to `benchmarks/benefits.md`. An example needs a public source behind every number marked `measured`.

## Style

Comments describe what the code does now, not how it got there. Page wording is plain enough for a grant reviewer outside the field. Error messages name the line and say what the file needs.
