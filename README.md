# Impact Chain

[![test](https://github.com/stanmjohn/impact-chain/workflows/test/badge.svg)](https://github.com/stanmjohn/impact-chain/blob/main/.github/workflows/test.yml)

Of the people a program was built for, how many does it reach, where do they leave, which step falls short, and what does the program put in a household's hands?

## Who it is for

For funders, program leads, and board members, and for anyone who writes or reads the measurement section of a grant. A plain text file describing the program goes in. A one-page measurement page comes out.

The page follows the program step by step, from community reach to household gain, the household's economic benefit. It shows how many people are left after each step and names the step where the most people leave. It holds each step's rate against published benchmarks and names the step where the service needs improvement. It opens on what is measured and what is still a guess, and it draws the line where measured numbers stop.

A file can work in two ways. In tracking mode it carries the program's own counted numbers from its records. In modeled mode, before anything is counted, it gives a low, a likely, and a high for each step.

## Example

An excerpt of the [Benefit Check Line page](examples/made-up-benefit-check-line.md), a made-up program in tracking mode. PLACEHOLDER. Every program number in it is invented. A real program's mailing list, call logs, and case records would replace them.

<!-- excerpt from examples/made-up-benefit-check-line.md -->
| Link | What the file counts | Share, likely (low to high) | Left, middle run (middle 80 percent) | Lost at this step, middle run | Evidence |
|---|---|---|---|---|---|
| Start | Adults 60 and over in one county who are on Medicaid and not on SNAP | | 8,000 counted | | counted |
| Reach | Called or texted back after the letter | 14% | 1,120 | 6,880, 86% | counted |
| Uptake | Started an application with a helper | 54.5% | 610 | 510, 45.5% | counted |
| Staying | Sent in a finished application | 77% | 470 | 140, 23% | counted |
| Effect | Approved for SNAP who would not have enrolled anyway, among those who sent in an application, measured over everyone who stayed | 45% (30% to 60%) | 211 (173 to 251) changed | | assumed |
| Household gain, income raised | SNAP benefits per newly enrolled household, per changed household | $1,390 ($1,220 to $1,750) | $305,000 ($245,000 to $369,000) in all | | benchmark |
| Cost | All cost lines | | $66,200 ($55,900 to $78,300) in all | | |

**Where people leave.** The most people leave at reach ("Called or texted back after the letter"). 6,880 of the 8,000 counted at the step before go no further, 86%.
<!-- end excerpt -->

Further down, the same page holds each step against its published benchmark.

<!-- excerpt from examples/made-up-benefit-check-line.md -->
| Step | This program | Benchmark, likely (low to high) | Where it sits |
|---|---|---|---|
| Reach, Called or texted back after the letter | 14% | 28.4% (17.6% to 53%), `reach-share-who-respond-to-outreach` | Under the whole range, 51 percent under its likely value |
| Uptake, Started an application with a helper | 54.5% | 31.3% (12.7% to 60.2%), `uptake-share-of-responders-who-start` | At or above its likely value |
| Staying, Sent in a finished application | 77% | 40.7% (33.3% to 87%), `staying-share-of-starters-who-finish` | At or above its likely value |

**Reach ("Called or texted back after the letter") falls furthest below its benchmark.** Its rate of 14% sits 51 percent under the benchmark's likely value of 28.4%, and under the whole published range of 17.6% to 53%. That is the step where the service needs improvement first. A benchmark is a default, never a fact. Its published points come from other programs and places, listed under Benchmarks this page used.
<!-- end excerpt -->

The other three worked examples are made up and marked PLACEHOLDER too.

- [Free Tax Help Days](examples/made-up-free-tax-help.md). Tracking mode. The counts run from a list of households to a filed return, and nobody measured what the help changed. So the page prints no final figure and says which link an evaluation has to buy. Every step sits at or above its benchmark, so the page names no step for improvement.
- [Pantry Text](examples/made-up-grant-applicant.md). Modeled mode, the page an applicant writes before a grant. Every step is a guess. Uptake sits under its benchmark, and the page says that gap is a guess too.
- [Skills to Work](examples/made-up-job-training.md). Modeled mode, a training program with seats given by lottery. Its earnings gain is measured over everyone offered a seat, so the steps before it are shown and not multiplied in. A made-up household, chosen by the file's author, is priced to show what it keeps after taxes and lost benefits. Its steps have no fitting benchmark, and the page says so.

## How it works

The chain has five links.

1. **Reach.** Of the people the program was built for, how many it reaches in the community.
2. **Uptake.** Of those, how many start.
3. **Staying.** Of those, how many are still there when the benefit comes due.
4. **Effect.** Of those, how many got a result they would not have got anyway, against a named comparison group.
5. **Household gain.** What that result is worth to the household, as **income raised** and **costs cut**, always over a stated window. Income raised can be priced as **kept**, what is left after taxes rise and cash benefits fall away.

A program that organizations use, a toolkit for city staff or a dataset for caseworkers, gets a short organization step ahead of the chain. A program with no measured dollars ends on the counted result, a record cleared or a child reading at grade level, and the page puts no dollar value on it.

**Two modes.** In modeled mode the chain starts from 1,000 people, a round number to count with, not a count of real people. Each number is drawn 20,000 times between its low, its likely, and its high. In tracking mode the chain starts from the number the program counted at the start. Each counted step keeps the count the program recorded, and its rate is its count over the count before it.

**Where people leave.** The chain table shows how many people are left after each step and how many are lost at it. One sentence names the step that loses the most people.

**Where the service needs improvement.** Each of reach, uptake, and staying is held against a published benchmark range in `benchmarks/benefits.json`. The gap is how far the step's rate sits under the benchmark's likely value, as a share of that value. The step with the largest gap is named. When no step falls short, or no step has a benchmark, the page says so and names none.

**The rule that keeps the math honest.** Every effect says who it was measured over, everyone at the start, everyone reached, everyone who started, or everyone who stayed. The tool multiplies only the links above that group. A study that measured everyone offered a program already has the dropouts inside its effect. Multiply that effect by a completion rate and the dropouts get subtracted twice. So those links are marked "shown, not multiplied in."

**What moves the answer most.** Each number is swung from its low to its high with the rest held at likely. The number that moves the answer most, the weak link, is the one an evaluation budget buys first.

**Earned and kept.** A raise is not what a household feels, because taxes go up and benefits fall away. One command asks [PolicyEngine](https://policyengine.org/us), an open model of US taxes and benefits, what one named household keeps of a raise. Kept counts cash and near-cash only, federal and state income tax after credits, the employee side of payroll tax, SNAP, TANF, and SSI. Health coverage and its subsidies are shown apart and never added in. The answer is written into the file with the model version and the date, so a committed page still rebuilds with no network.

**What it is not.** This is a funnel with numbers on it. Public health has drawn close cousins of these boxes since 1999 under the name RE-AIM, from [Glasgow, Vogt, and Boles in the American Journal of Public Health](https://pubmed.ncbi.nlm.nih.gov/10474547), and every logic model draws them. What this tool adds is a range or a count on every step, the arithmetic carried through, where people leave, the step that falls short of published programs, and the line where measured numbers stop.

## Data sources

The examples are made up. The benchmarks they are held against are real, published, and linked from [benchmarks/benefits.json](benchmarks/benefits.json), which reads as a page at [benchmarks/benefits.md](benchmarks/benefits.md). Each benchmark carries its source, year, place, how it was measured, and what it does not cover. A benchmark is a default, never a fact.

- [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics, 2019](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf). Call rates, application rates, added enrollment, and SNAP dollars from a lottery study of outreach letters to older adults in Pennsylvania.
- [Giannella, Homonoff, Rino, and Somerville, Administrative Burden and Procedural Denials, working paper, 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf). Call rates and added enrollment from a lottery study of flexible SNAP interviews in Los Angeles County.
- [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969](https://www.irs.gov/pub/irs-pdf/p5969.pdf). The step-by-step funnel of a free federal tax filing tool, from eligible taxpayers to accepted returns.
- [PolicyEngine](https://policyengine.org/us), an open model of US taxes and benefits, called through its public API by the price command. The tool copies nothing from it.

## Limits

**What it refuses to do.** It never prints a final figure without a range. It never counts an effect that does not name its comparison group or the group it was measured over. It never puts dollars on a result nobody measured in dollars. It never stretches a gain past the window someone measured, and it does not discount later dollars. It never names a step for improvement without a published benchmark, and it never makes a benchmark up. It never compares two programs. It never uses a benchmark silently. It never counts health coverage as cash.

**Known limits.**

- Each range is a triangle drawn between a low, a likely, and a high, not a statistical confidence interval.
- A count is taken as the program recorded it. The tool cannot check a program's records.
- The step benchmarks are wide and come from benefits outreach and tax filing. They fit other kinds of programs poorly, so a file can set none for a step.
- The benchmark gap uses each step's likely rate, not its whole range.
- Kept income prices one household chosen by the file's author and says nothing about what that household filed for. A newer model version can price the same household differently, so the block carries its version and date.
- Tracking mode cannot yet be used with the organization step.

Not built yet are a money lane beside the person lane, benchmarks beyond benefits access, and a figure per year where a study prints one.

## Run it yourself

Requires Node 20 or newer. No install, no key, no account.

```
node bin/impact-chain.mjs examples/made-up-benefit-check-line.txt            # writes the page beside the file
node bin/impact-chain.mjs examples/made-up-benefit-check-line.txt --stdout   # prints it instead
node bin/impact-chain.mjs benchmarks                                         # prints the benchmark file as a page
node bin/impact-chain.mjs price examples/made-up-job-training.txt            # prints a [kept share] block
node bin/impact-chain.mjs price examples/made-up-job-training.txt --write    # writes it into the file
```

To write your own, copy an example file and change the lines. In modeled mode a step looks like this.

```
[uptake] Started the screener
low: 15%
likely: 25%
high: 40%
evidence: assumed
source: Our own guess
```

In tracking mode the file adds two header lines, and each counted step carries a count instead of a range.

```
counted start: 8,000
counted period: January to June 2026

[reach] Called or texted back after the letter
counted: 1,120
source: The program's call and text log
```

Every number takes a low, a likely, and a high, or a count, and a source. A number with a range says `measured` or `assumed`. A `[kept share]` block written by the price command says `modeled`. A block can name a benchmark instead of giving values. The blocks are `[reach]`, `[uptake]`, `[staying]`, `[effect]`, `[income raised]`, `[costs cut]`, `[kept share]`, and `[cost]`, plus `[org reach]`, `[org uptake]`, `[org staying]`, and `[people per organization]` for the organization step. An effect needs `measured over:` and `compared with:` lines. A household gain needs `window:`, `measured at:`, and `repeats:` lines, because the same program can lose money for a household in year one and gain it by year three. A step can name the benchmark it is checked against with `check against:`, or say `check against: none`. A made-up file says `made up: yes` and gives a `replace with:` line naming the real data that would replace it. The price command reads four header lines, `household state`, `household ages`, `household income`, and `household gain per year`.

The tool reads one chain file at a time and refuses a second one.

Check it yourself. Clone the repo, run one command on a file in `examples/`, and the page that comes back matches the committed one exactly.

## How this was built

Built with AI coding assistants. Stan John set the design and the rules in AGENTS.md, which any AI coding tool must follow when it changes this repo. A test rebuilds every committed page exactly.

## Related tools

[Funder X-Ray](https://github.com/stanmjohn/funder-xray) turns a foundation's public IRS 990 filings into a one-page giving summary.

[Cost-per-Outcome Workbench](https://github.com/stanmjohn/cost-per-outcome) measures what one program result costs against a comparison group, and ranks the assumptions that drive that cost.

## Tests

```
npm test
```

The arithmetic runs on hand-checkable chains, the double-count case first. The reader tests pin the refusals. The tracking tests check counted rates, where people leave, and the benchmark gap. The price tests check the request and the block with no network. The page tests pin the sentences that must never disappear. One test rebuilds every example page and the benchmark page and compares them to the committed files byte for byte. Another checks that the excerpt above matches its page word for word.

## License

MIT. Built by [Stan John](https://www.linkedin.com/in/stanmjohn).
