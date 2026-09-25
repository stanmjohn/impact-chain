# Impact Chain

For the people a product was built for, how many does it reach, how many does it change, what does that put in a household's hands, and which link in that chain is the weak one?

For anyone who has to write, or read, the measurement section of a grant for a tool, a product, or a resource. A plain text file describing the product goes in. A one-page measurement page comes out. It opens on what is measured and what is still a guess, walks 1,000 people down the chain with a range at every link, names the link that moves the answer most, and draws the line where measured numbers stop.

Done looks like this: clone the repo, run one command on a file in `examples/`, and get the committed page back exactly.

## The chain

1. **Reach.** Of the people this was built for, how many know it exists.
2. **Uptake.** Of those, how many start.
3. **Staying.** Of those, how many are still there when the benefit comes due.
4. **Effect.** Of those, how many got a result they would not have got anyway, against a named comparison group.
5. **Household gain.** What that result is worth to the household, as **income raised** and **costs cut**, always over a stated window. Income raised can be priced as **kept**, what is left after taxes rise and cash benefits fall away.

A product that organizations use, a toolkit for city staff or a dataset for caseworkers, gets a short organization step ahead of the chain. A product with no measured dollars ends on the counted result, a record cleared or a child reading at grade level, and the page puts no dollar value on it.

This is a funnel with numbers on it, and it does not pretend to be more. Public health has used the same boxes since 1999 under the name RE-AIM, and every logic model draws them. What this tool adds is a range on every link, the arithmetic carried through, the weak link named, and the evidence line drawn.

## Four worked examples

- [SNAP outreach in Pennsylvania](examples/snap-outreach-pennsylvania.md). A letter plus phone help, tested by lottery on 31,888 older adults. Every link measured. Of 1,000 people mailed, 301 called and 118 enrolled who would not have. Every dollar spent put about $4 of benefits in a household's hands in the first year, once the state's cost to process the applications is counted.
- [Year Up](examples/year-up.md). Limited by seats, not by reach, and its earnings gain was measured over everyone offered a seat. So the page shows completion and does not multiply by it. The households earned about $1.65 per dollar over seven years and kept about $1.22 of it, once taxes rose and SNAP fell away.
- [IRS Direct File, 2024 pilot](examples/irs-direct-file-pilot.md). The cleanest public funnel found anywhere. Of 1,000 eligible taxpayers, 167 started, 21 logged in, 7 filed. Nobody measured what it changed, so the page prints no final figure and says which link an evaluation has to buy.
- [A made-up product before a grant](examples/made-up-grant-applicant.md). Every link a guess, the household gain from a benchmark. The page says so up top, counts the five unmeasured numbers under its figure, and names the one link worth measuring first.

## The rule that keeps the math honest

Every effect says who it was measured over: everyone at the start, everyone reached, everyone who started, or everyone who stayed. The tool multiplies only the links above that group.

The best studies measure everyone who was offered the product, including the people who never showed up. Their effect already has the dropouts inside it. Multiply that effect by a completion rate and the dropouts get subtracted twice. So the page shows those links, marks them "shown, not multiplied in," and says why. A file whose effect does not name its group is refused.

## Earned and kept

A raise is not what a household feels. Taxes go up and benefits fall away. One command asks [PolicyEngine](https://policyengine.org/us), an open model of US taxes and benefits, what one named household keeps of the raise.

```
node bin/impact-chain.mjs price examples/year-up.txt            # prints the [kept share] block
node bin/impact-chain.mjs price examples/year-up.txt --write    # writes it into the file
```

The file names the household in four header lines, `household state`, `household ages`, `household income`, and `household gain per year`. The block that comes back carries the share kept, the model version, the date, and every line that moved. The build then reads that block like any other number, so a committed page still rebuilds byte for byte with no network.

Kept counts cash and near-cash only, federal and state income tax after credits, the employee side of payroll tax, SNAP, TANF, and SSI. Health coverage and its subsidies are shown apart and never added in. The model applies the rules to one household and says nothing about what that household filed for. For Year Up, a single adult in Pennsylvania going from $27,338 to $35,589 keeps about 74 percent of the raise.

## Use

Requires Node 20 or newer. No install, no key, no account.

```
node bin/impact-chain.mjs examples/snap-outreach-pennsylvania.txt            # writes the page beside the file
node bin/impact-chain.mjs examples/snap-outreach-pennsylvania.txt --stdout   # prints it instead
node bin/impact-chain.mjs benchmarks                                         # prints the benchmark file as a page
```

To write your own, copy `examples/made-up-grant-applicant.txt` and change the lines. A block looks like this:

```
[effect] Approved for SNAP who would not have enrolled anyway
measured over: stayed
compared with: a second group of households texted three months later
low: 30%
likely: 45%
high: 60%
evidence: assumed
source: Our own guess
```

Every number takes a low, a likely, and a high, a source, and one word on its evidence, `measured` or `assumed`. A `[kept share]` block written by the price command says `modeled`. A block can name a benchmark instead. The blocks are `[reach]`, `[uptake]`, `[staying]`, `[effect]`, `[income raised]`, `[costs cut]`, `[kept share]`, and `[cost]`, plus `[org reach]`, `[org uptake]`, `[org staying]`, and `[people per organization]` for the organization step. A cost says who it is charged to with `per:`. A household gain block must state its `window:`, when it was `measured at:`, and whether it `repeats:`. The same program can lose money for a household in year one and gain it by year seven, so a gain with no window is refused.

## What a page carries

**The measurement plan.** What is measured, what is assumed, what came from a benchmark, what is missing, and which unmeasured number moves the answer most. Before a grant, most links are guesses. The honest use of the chain in an application is to show that plainly and say what the evaluation budget will buy.

**The read.** Household gain per dollar, or cost per counted result, in the middle run and across the middle 80 percent of runs. Under it, a count of the numbers nobody has measured. No figure at all when nobody measured an effect, or when most runs show nothing changed.

**The chain.** 1,000 people walked down every link, with a range.

**What moves the answer most.** Each number swung from its low to its high with the rest held at likely.

**What the household keeps**, when the file has been priced, with every tax and benefit line that moved.

**The time window, every number with its source, and the benchmarks used.**

## Benchmarks

Two ship in version one, in [benchmarks/benefits.json](benchmarks/benefits.json) and as a readable page at [benchmarks/benefits.md](benchmarks/benefits.md). The share of everyone offered application help who enrolled and would not have otherwise, from two lottery studies. And the SNAP dollars a newly enrolled household receives in a year. Each carries its source, year, place, how it was measured, and what it does not cover. The page names every benchmark it used. Any chain file can override any of them. A benchmark is a default, never a fact.

## What it refuses to do

It never prints a final figure without a range. It never counts an effect that does not name its comparison group or the group it was measured over. It never puts dollars on a result nobody measured in dollars. It never stretches a gain past the window someone measured, and it does not discount later dollars. It never compares two products. It never uses a benchmark silently. It never counts health coverage as cash.

## Sources behind the examples and benchmarks

All public, all linked from the files that use them.

- Finkelstein and Notowidigdo, Take-Up and Targeting: Experimental Evidence from SNAP, Quarterly Journal of Economics, 2019.
- Fein and Dastrup, Benefits that Last, OPRE Report 2022-77, Abt Associates for the US Department of Health and Human Services. Public domain.
- Internal Revenue Service, release IR-2024-122 and Publication 5969, and Government Accountability Office report GAO-25-106933.
- Giannella, Homonoff, Rino, and Somerville, working paper on flexible SNAP interviews in Los Angeles County, 2023.
- PolicyEngine, an open model of US taxes and benefits, called through its public API. The tool calls it and copies nothing from it.

## Roadmap

A money lane beside the person lane: dollars in, dollars that followed them into a place, tested against similar places, with every pulled dollar added to the cost side. Benchmarks beyond benefits access. A figure per year where a study prints one, so the page can draw the curve.

## Sister tools

[Cost-per-Outcome Workbench](https://github.com/stanmjohn/cost-per-outcome) covers the last two links in more depth. [Funder X-Ray](https://github.com/stanmjohn/funder-xray) reads a funder or a partner from its public filings.

## Tests

```
npm test
```

Fifty-one tests. The arithmetic runs on hand-checkable chains, the double-count case first. The reader tests pin the refusals. The price tests check the request shape and the block text with no network. The page tests pin the sentences that must never disappear. One test rebuilds every example page and compares it to the committed file byte for byte.

## License

MIT. Built by [Stan John](https://www.linkedin.com/in/stanmjohn).
