# AGENTS.md

Instructions for an AI coding tool working in this repo. The README is for people and says what the tool is for. This file says how to change it without breaking its promises.

## What this is

A command line tool. A plain text file describing a program goes in, a one-page markdown measurement page comes out. The page follows people down five links, reach, uptake, staying, effect, and household gain. It names the step where the most people leave and the step that falls furthest below its published benchmark. Node 20 or newer, ES modules, no dependencies, no build step. The build never touches the network. The price command is the one network call.

A chain file works in one of two modes. In modeled mode each number has a low, a likely, and a high, and the chain starts from 1,000 people, a round number to count with. In tracking mode the file carries the program's own counts, `counted start:`, `counted period:`, and `counted:` on reach, uptake, and staying, and the chain starts from the counted start.

## Commands

```
npm test                                                                    # all tests
node bin/impact-chain.mjs examples/made-up-benefit-check-line.txt --stdout  # print a page
node bin/impact-chain.mjs examples/made-up-benefit-check-line.txt           # rewrite the .md beside the file
node bin/impact-chain.mjs benchmarks                                        # print the benchmark page
node bin/impact-chain.mjs price examples/made-up-job-training.txt           # ask PolicyEngine what the household keeps
node bin/impact-chain.mjs price examples/made-up-job-training.txt --write   # write that [kept share] block into the file
```

Run the tests before and after any change.

## Layout

- `bin/impact-chain.mjs` reads the arguments and writes the file. No logic lives here. It refuses a second chain file.
- `src/parse.mjs` reads the chain file. Every error names the line it came from. The refusals about what a file may leave out live here, and so do the tracking mode rules. A counted step's rate is its count over the count before it.
- `src/benchmarks.mjs` fills in any block that names a benchmark, marks it so the page can name it, and attaches the benchmark each step is checked against.
- `src/model.mjs` does all the arithmetic of the chain, the people lost at each step, and the benchmark gap.
- `src/simulate.mjs` holds the seeded draws and the summary statistics. It knows nothing about programs.
- `src/price.mjs` builds the request to PolicyEngine's public API and writes the `[kept share]` block. It is only called by the price command.
- `src/report.mjs` formats the page. It computes nothing.
- `benchmarks/benefits.json` is the data. `benchmarks/benefits.md` is the same data as a readable page.
- `examples/` holds each chain file as `.txt` with its committed page as `.md`.
- `test/fixture.mjs` is one well-formed chain file that the tests bend into bad ones.
- `.github/workflows/test.yml` runs `npm test` on Node 20, 22, and 24 on every push and pull request.

Keep that split. Math added to `report.mjs` or formatting added to `model.mjs` is a wrong change.

## Rules that must survive any edit

1. Add no dependencies. The standard library and `node:test` cover everything here.
2. Same file, same page, byte for byte, on any machine. The seed is fixed, the page carries no date, and `.gitattributes` holds line endings to LF. Do not add a timestamp, `Math.random`, or anything that reads the clock or the locale.
3. `test/examples.test.mjs` rebuilds every example and the benchmark page and compares each to the committed file. It also checks that every excerpt in the README matches its page word for word. A change to the math or the wording means rerunning each `examples/*.txt`, sending the `benchmarks` command's output to `benchmarks/benefits.md`, repasting the README excerpts, and committing all of it in the same commit.
4. Every effect names the group it was measured over, and the model multiplies only the links above that group. An effect measured over everyone offered the program already has the dropouts inside it. Those links print as "shown, not multiplied in." `test/model.test.mjs` pins the double-count case.
5. Four gaps are refused, never warned about. An effect with no `measured over:` group. An effect with no `compared with:` group. A household gain with no `window:`, `measured at:`, or `repeats:` line. Any number with no source or no evidence word.
6. The last link is named Household gain, split into income raised and costs cut, always over a stated window. Do not rename it or borrow another organization's label for it. The README may call it the household's economic benefit.
7. The page never prints a final figure without a range, never puts dollars on a result nobody measured in dollars, never stretches a gain past its measured window, never discounts later dollars, never compares two programs, and never uses a benchmark without naming it.
8. Every number keeps its evidence word, `measured`, `assumed`, `benchmark`, `modeled`, or `counted`. `modeled` is allowed only on a `[kept share]` block. `counted` is allowed only on reach, uptake, and staying, and only in a run from the start with no gap. The page opens on the measurement plan and counts the unmeasured numbers under its figure.
9. A step is named for improvement only when a published benchmark says it falls short. The gap is how far its likely rate sits under the benchmark's likely value, as a share of that value. When no step falls short, or no step has a benchmark, the page says so and names none. Never invent a benchmark.
10. `test/report.test.mjs` and `test/tracking.test.mjs` pin the sentences that must never disappear. When one of those tests fails, fix the page, not the test.
11. No real organization is the subject of any example. Every example is a made-up program with invented numbers, says `made up: yes`, and gives a `replace with:` line saying what real data would replace it. Its page opens on the banner "**PLACEHOLDER. This program is made up.**" Published studies may be named only as the sources of benchmark ranges, in `benchmarks/` and in the README's Data sources.
12. Tests never call the network. The price tests check the request and the block from canned answers.

## Adding a benchmark or an example

A benchmark needs a public source a reader can open, plus its year, place, how it was measured, and what it does not cover. Add it to `benefits.json`. A benchmark for a step carries a `step` field naming reach, uptake, or staying, and a unit of `share`. Each step has at most one default. The `benchmarks` command prints the page, so send its output to `benchmarks/benefits.md`.

An example is a made-up program, per rule 11. A priced example names a made-up household chosen by the file's author, and its `[kept share]` block keeps the model version and the date it was priced.

## Style

Comments describe what the code does now, not how it got there. Page wording is plain enough for a grant reviewer outside the field. Say program, not product. Error messages name the line and say what the file needs. No em-dashes and no semicolons in page text or the README.
