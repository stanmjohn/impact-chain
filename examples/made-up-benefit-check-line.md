# Impact chain: Benefit Check Line, a phone and text line that helps older adults apply for SNAP (made up)

> **PLACEHOLDER. This program is made up.** A real file would use the program's own mailing list, call and text logs, and case records for the counted steps, and a group mailed six months later for the effect.

Built for adults 60 and over in one county who are on Medicaid and not on SNAP · One US county · The first six months of the program

## The measurement plan

- **Counted from the program's own records, January to June 2026.** Reach, uptake and staying.
- **Measured today.** None.
- **Assumed.** Effect.
- **From a benchmark.** Income raised.
- **Not in the file.** None.

**Counted numbers stop at effect ("Approved for SNAP who would not have enrolled anyway, among those who sent in an application").** From there on the chain leans on guesses and benchmarks, and the page marks each number.

**What the evaluation budget buys.** The number that moves the answer most is effect ("Approved for SNAP who would not have enrolled anyway, among those who sent in an application"), and nobody has measured it. Measuring that one link does more for this page than measuring any other.

## The read

Every dollar spent puts about **$4.58** in a household's hands, over the first twelve months on SNAP, in the middle run. The middle 80 percent of 20,000 runs fall between **$3.52** and **$5.91**.

Of the 8,000 people the program counted at the start, January to June 2026, about **211** end up with SNAP benefits they would not have had anyway, 173 to 251 across the middle runs.

**This figure rests on 2 numbers nobody has measured for this program.** They are effect ("Approved for SNAP who would not have enrolled anyway, among those who sent in an application") and income raised ("SNAP benefits per newly enrolled household").

## The chain

**Counted from the program's own records, January to June 2026.** The chain starts from the 8,000 people the program counted at the start, not from a round 1,000. Each counted step shows the number the program recorded and its rate from the step before.

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

**The number a report leads with, beside the number that changed.** 1,120 reached. 211 changed.

## Where the service needs improvement

Each step's rate is held against a published benchmark range from `benchmarks/benefits.json`. The gap is how far the rate sits under the benchmark's likely value, as a share of that value.

| Step | This program | Benchmark, likely (low to high) | Where it sits |
|---|---|---|---|
| Reach, Called or texted back after the letter | 14% | 28.4% (17.6% to 53%), `reach-share-who-respond-to-outreach` | Under the whole range, 51 percent under its likely value |
| Uptake, Started an application with a helper | 54.5% | 31.3% (12.7% to 60.2%), `uptake-share-of-responders-who-start` | At or above its likely value |
| Staying, Sent in a finished application | 77% | 40.7% (33.3% to 87%), `staying-share-of-starters-who-finish` | At or above its likely value |

**Reach ("Called or texted back after the letter") falls furthest below its benchmark.** Its rate of 14% sits 51 percent under the benchmark's likely value of 28.4%, and under the whole published range of 17.6% to 53%. That is the step where the service needs improvement first. A benchmark is a default, never a fact. Its published points come from other programs and places, listed under Benchmarks this page used.

## What moves the answer most

Each row holds every other number at its likely value and moves one number from its low to its high.

| Rank | Number | At its low | At its high | Evidence |
|---|---|---|---|---|
| 1 | Approved for SNAP who would not have enrolled anyway, among those who sent in an application (30% to 60%) | $3.05 | $6.10 | assumed |
| 2 | Letters, phone helpers, and texts, per person on the list ($6.00 to $11.00) | $6.10 | $3.33 | assumed |
| 3 | SNAP benefits per newly enrolled household ($1,220 to $1,750) | $4.02 | $5.79 | benchmark |

## The time window

- **SNAP benefits per newly enrolled household.** Window: over the first twelve months on SNAP. Measured at: benefit amounts in the benchmark study, state records. One-time or recurring: recurring monthly, until the household has to recertify.

The page counts only the window the file states and stretches nothing past it. Later dollars are not discounted. Income raised and costs cut are kept apart, because wage and benefit records can check the first and the second is mostly self-reported.

## Every number, with its source

| Link | Number | Low | Likely | High | Evidence | Source | Note |
|---|---|---|---|---|---|---|---|
| Reach | Called or texted back after the letter | 14% | 14% | 14% | counted | The program's call and text log (made up) | Counted: 1,120, January to June 2026. |
| Uptake | Started an application with a helper | 54.5% | 54.5% | 54.5% | counted | The program's case records (made up) | Counted: 610, January to June 2026. |
| Staying | Sent in a finished application | 77% | 77% | 77% | counted | The program's case records (made up) | Counted: 470, January to June 2026. |
| Effect | Approved for SNAP who would not have enrolled anyway, among those who sent in an application | 30% | 45% | 60% | assumed | The program's guess (made up) | Compared with: nothing yet. The program would mail a second group six months later and compare enrollment across the two. |
| Household gain, income raised | SNAP benefits per newly enrolled household | $1,220 | $1,390 | $1,750 | benchmark | Benchmark `snap-dollars-per-new-household-per-year` from `benchmarks/benefits.json`. |  |
| Cost, per person at the start | Letters, phone helpers, and texts, per person on the list | $6.00 | $8.00 | $11.00 | assumed | The program's draft budget (made up) |  |

## Benchmarks this page used

A benchmark is a default, never a fact. Any of these can be overridden in the chain file.

**Share of people sent outreach who respond**, used to check "Called or texted back after the letter". Low and high are the lowest and highest of the four points below. Likely is the midpoint of the two middle points.

What it does not cover. Outreach of any kind other than a letter, a text, an email, or a public launch. The four points reach very different groups. Older adults in Pennsylvania by mail, people in Los Angeles who had already applied for SNAP, and taxpayers in twelve states who could use a new federal filing tool. The Los Angeles group had already applied, so it responds far more often than a cold list. Some people who started the federal filing checker lived outside the pilot states, so that point runs high against its own base.

- 17.6%. Started the eligibility checker of a free federal tax filing tool, against the IRS research division's estimate of 19 million eligible taxpayers. More than 3.3 million started it, printed as 3,340,500 in Figure 2. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 26.7%. Called the number on an outreach letter about SNAP, letter and reminder postcard only. The raw call rate. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, calls counted over seven months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- 30.1%. Called the number on an outreach letter about SNAP that offered phone help to apply. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, calls counted over seven months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- 53%. Called a new phone line at least once before the deadline, after a text or email saying they could do their required SNAP interview at a time of their choosing. Los Angeles County, California, applicants through one online application. Applications from October 2020 to May 2021. [Giannella, Homonoff, Rino, and Somerville, Administrative Burden and Procedural Denials, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf)

**Share of people who responded who go on to start**, used to check "Started an application with a helper". Low and high are the lowest and highest of the three points below. Likely is the middle one.

What it does not cover. Any step but the first real start, an application or a sign-in. The federal filing tool turned many people away at the checker on purpose, because the tool did not fit their taxes, so its point runs low for a reason that is not a failure. Phone help with the application roughly doubles the start rate over a letter alone in the one study that tested both.

- 12.7%. Signed in to a free federal tax filing tool, of those who started its eligibility checker. 423,450 signed in, of 3,340,500 who started. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 31.3%. Applied for SNAP, of those who called the number on a letter and postcard with no phone help. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, followed nine months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- 60.2%. Applied for SNAP, of those who called the number on a letter that offered phone help to apply. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, followed nine months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)

**Share of people who started who finish**, used to check "Sent in a finished application". Low and high are the lowest and highest of the three points below. Likely is the middle one.

What it does not cover. Finishing anything longer than one application, one return, or one interview, such as a training program. Two of the three points come from the same federal filing tool, measured two ways. The Los Angeles point counts callers who stayed on the line at least five minutes, which the authors call a conservative floor for the time an interview takes, not a count of finished interviews.

- 33.3%. Had a return accepted, of those who signed in to a free federal tax filing tool. 140,803 accepted returns, of 423,450 who signed in. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 40.7%. Submitted a return, of those who started one in a free federal tax filing tool. 161,042 submitted, of 395,483 who started a return. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 87%. Stayed on the line at least five minutes, of SNAP applicants who called a new phone line to do their required interview. Los Angeles County, California, applicants through one online application. Applications from October 2020 to May 2021. [Giannella, Homonoff, Rino, and Somerville, Administrative Burden and Procedural Denials, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf)

**SNAP dollars a newly enrolled household receives in a year**, used for "SNAP benefits per newly enrolled household". Each point is a printed average monthly benefit times twelve. Low and high are the lowest and highest of the three. Likely is the middle one.

What it does not cover. Households with children, who receive far more. Anyone under 60. Any year but 2016, with no adjustment for inflation or for later changes to benefit levels. People a program newly brings in tend to receive less than people who enroll on their own, which is why the low end sits where it does. Benefits are money moved to a household from the federal government, not new wealth.

- $1,220. Enrollees who got a letter plus phone help. Printed as $101.32 a month. Pennsylvania, adults 60 and over. 2016. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- $1,390. Enrollees who got a letter only. Printed as $115.38 a month. Pennsylvania, adults 60 and over. 2016. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- $1,750. Enrollees in the comparison group, who enrolled with no outreach. Printed as $145.94 a month. Pennsylvania, adults 60 and over. 2016. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)

## How the range was made

Each number above was drawn 20,000 times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. That triangle is drawn between a low, a likely, and a high, and it is not a statistical confidence interval. Counted numbers are not drawn. They stay fixed at what the program recorded. Each run walks the chain from the start to the end. The middle run is the median and the range is the 10th to the 90th percentile. The seed is 20260918, so the same file gives the same page on any machine.

## What this page refuses to do

It never prints a final figure without a range. It never counts an effect with no comparison group, or one that does not say who it was measured over. It never puts dollars on a result nobody measured in dollars. It never stretches a gain past the window someone measured. It never names a step for improvement without a published benchmark to hold it against. It never compares this program to another one. It never uses a benchmark without naming it and its source.
