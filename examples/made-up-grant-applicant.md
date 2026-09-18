# Impact chain: Pantry Text, a text-message SNAP screener (made up)

> **This product is made up.** It shows the page an applicant can write before a grant, when most links are still guesses. The benchmarks it leans on are real and sourced below.

Built for households who use food pantries in one county, look eligible for SNAP, and are not enrolled · One US county · The first grant year

## The measurement plan

- **Measured today.** None.
- **Assumed.** Reach, uptake, staying and effect.
- **From a benchmark.** Income raised.
- **Not in the file.** None.

**No link in this file has been measured yet.** Every number is a guess or a benchmark, and the page marks each one.

**What the evaluation budget buys.** The number that moves the answer most is uptake ("Started the screener"), and nobody has measured it. Measuring that one link does more for this page than measuring any other.

## The read

Every dollar spent puts about **$6.99** in a household's hands, over the first twelve months on SNAP, in the middle run. The middle 80 percent of 20,000 runs fall between **$4.41** and **$10.99**.

Of 1,000 people the product was built for, about **32** end up with SNAP benefits they would not have had anyway, 22 to 46 across the middle runs.

**This figure rests on 5 numbers nobody has measured for this product:** reach ("Opened the text message"), uptake ("Started the screener"), staying ("Finished the screener and sent in an application"), effect ("Approved for SNAP who would not have enrolled anyway, among those who sent in an application") and income raised ("SNAP benefits per newly enrolled household").

## The chain

| Link | What the file counts | Share, likely (low to high) | Left, middle run (middle 80 percent) | Evidence |
|---|---|---|---|---|
| Start | Households who use food pantries in one county, look eligible for SNAP, and are not enrolled | | 1,000 | |
| Reach | Opened the text message | 50% (35% to 65%) | 499 (417 to 583) | assumed |
| Uptake | Started the screener | 25% (15% to 40%) | 130 (95 to 175) | assumed |
| Staying | Finished the screener and sent in an application | 55% (40% to 70%) | 71 (50 to 99) | assumed |
| Effect | Approved for SNAP who would not have enrolled anyway, among those who sent in an application, measured over everyone who stayed | 45% (30% to 60%) | 32 changed (22 to 46) | assumed |
| Household gain, income raised | SNAP benefits per newly enrolled household, per changed household | $1,390 ($1,220 to $1,750) | $45,900 in all ($30,800 to $67,000) | benchmark |
| Cost | All cost lines | | $6,530 in all ($5,090 to $8,430) | |

**The number a report leads with, beside the number that changed.** 499 reached. 32 changed.

## What moves the answer most

Each row holds every other number at its likely value and moves one number from its low to its high.

| Rank | Number | At its low | At its high | Evidence |
|---|---|---|---|---|
| 1 | Started the screener (15% to 40%) | $4.28 | $11.43 | assumed |
| 2 | Building and running the product, per household texted ($4.00 to $10.00) | $10.71 | $4.28 | assumed |
| 3 | Approved for SNAP who would not have enrolled anyway, among those who sent in an application (30% to 60%) | $4.76 | $9.52 | assumed |
| 4 | Opened the text message (35% to 65%) | $5.00 | $9.28 | assumed |
| 5 | Finished the screener and sent in an application (40% to 70%) | $5.19 | $9.09 | assumed |
| 6 | SNAP benefits per newly enrolled household ($1,220 to $1,750) | $6.27 | $9.03 | benchmark |

## The time window

- **SNAP benefits per newly enrolled household.** Window: over the first twelve months on SNAP. Measured at: benefit amounts in the benchmark study, state records. One-time or recurring: recurring monthly, until the household has to recertify.

The page counts only the window the file states and stretches nothing past it. Later dollars are not discounted. Income raised and costs cut are kept apart, because wage and benefit records can check the first and the second is mostly self-reported.

## Every number, with its source

| Link | Number | Low | Likely | High | Evidence | Source | Note |
|---|---|---|---|---|---|---|---|
| Reach | Opened the text message | 35% | 50% | 65% | assumed | The applicant's guess from the pantry network's past text campaigns (made up) |  |
| Uptake | Started the screener | 15% | 25% | 40% | assumed | The applicant's guess (made up) |  |
| Staying | Finished the screener and sent in an application | 40% | 55% | 70% | assumed | The applicant's guess (made up) |  |
| Effect | Approved for SNAP who would not have enrolled anyway, among those who sent in an application | 30% | 45% | 60% | assumed | The applicant's guess (made up) | Compared with: nothing yet. The grant would text a second group of households three months later and compare enrollment across the two.. Multiplied through, this chain changes about 3 percent of everyone texted. Published lottery studies of application help put that figure between 2.2 and 11.8 percent of everyone offered, so the guess sits at the cautious end. |
| Household gain, income raised | SNAP benefits per newly enrolled household | $1,220 | $1,390 | $1,750 | benchmark | Benchmark `snap-dollars-per-new-household-per-year` from `benchmarks/benefits.json`. |  |
| Cost, per person at the start | Building and running the product, per household texted | $4.00 | $6.00 | $10.00 | assumed | The applicant's draft budget (made up) |  |

## Benchmarks this page used

A benchmark is a default, never a fact. Any of these can be overridden in the chain file.

**SNAP dollars a newly enrolled household receives in a year**, used for "SNAP benefits per newly enrolled household". Each point is a printed average monthly benefit times twelve. Low and high are the lowest and highest of the three. Likely is the middle one.

What it does not cover. Households with children, who receive far more. Anyone under 60. Any year but 2016, with no adjustment for inflation or for later changes to benefit levels. People a product newly brings in tend to receive less than people who enroll on their own, which is why the low end sits where it does. Benefits are money moved to a household from the federal government, not new wealth.

- $1,220. Enrollees who got a letter plus phone help. Printed as $101.32 a month. Pennsylvania, adults 60 and over. 2016. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- $1,390. Enrollees who got a letter only. Printed as $115.38 a month. Pennsylvania, adults 60 and over. 2016. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- $1,750. Enrollees in the comparison group, who enrolled with no outreach. Printed as $145.94 a month. Pennsylvania, adults 60 and over. 2016. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)

## How the range was made

Each number above was drawn 20,000 times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. Each run walks the chain from the start to the end. The middle run is the median and the range is the 10th to the 90th percentile. The seed is 20260918, so the same file gives the same page on any machine.

## What this page refuses to do

It never prints a final figure without a range. It never counts an effect with no comparison group, or one that does not say who it was measured over. It never puts dollars on a result nobody measured in dollars. It never stretches a gain past the window someone measured. It never compares this product to another one. It never uses a benchmark without naming it and its source.
