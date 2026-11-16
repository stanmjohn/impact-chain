# Impact chain: Free Tax Help Days, volunteer tax filing at public libraries (made up)

> **PLACEHOLDER. This program is made up.** A real file would use the program's own invitation list, sign-in sheets, and filing records, and a comparison group to measure what the help changed.

Built for households in one city on a list of likely eligible filers who paid for tax preparation the year before · One US city · One filing season

## The measurement plan

- **Counted from the program's own records, February to April 2026.** Reach, uptake and staying.
- **Measured today.** None.
- **Assumed.** None.
- **From a benchmark.** None.
- **Not in the file.** Effect and household gain.

**Counted numbers run through staying and stop.** Nobody has measured what the program changed against a comparison group. That is the link an evaluation has to buy first, because every figure after it rests on it.

## The read

**No final figure.** The file carries no effect measured against a comparison group, so the chain cannot say what the program changed or what that put in a household's hands. Printing a ratio here would mean inventing the link that matters most.

## The chain

**Counted from the program's own records, February to April 2026.** The chain starts from the 5,000 people the program counted at the start, not from a round 1,000. Each counted step shows the number the program recorded and its rate from the step before.

| Link | What the file counts | Share, likely (low to high) | Left, middle run (middle 80 percent) | Lost at this step, middle run | Evidence |
|---|---|---|---|---|---|
| Start | Households in one city on a list of likely eligible filers who paid for tax preparation the year before | | 5,000 counted | | counted |
| Reach | Booked a time or walked in | 29% | 1,450 | 3,550, 71% | counted |
| Uptake | Started a return with a volunteer | 69.7% | 1,010 | 440, 30.3% | counted |
| Staying | Filed a return that was accepted | 53.5% | 540 | 470, 46.5% | counted |
| Cost | All cost lines | | $16,400 ($12,700 to $21,100) in all | | |

**Where people leave.** The most people leave at reach ("Booked a time or walked in"). 3,550 of the 5,000 counted at the step before go no further, 71%.

## Where the service needs improvement

Each step's rate is held against a published benchmark range from `benchmarks/benefits.json`. The gap is how far the rate sits under the benchmark's likely value, as a share of that value.

| Step | This program | Benchmark, likely (low to high) | Where it sits |
|---|---|---|---|
| Reach, Booked a time or walked in | 29% | 28.4% (17.6% to 53%), `reach-share-who-respond-to-outreach` | At or above its likely value |
| Uptake, Started a return with a volunteer | 69.7% | 31.3% (12.7% to 60.2%), `uptake-share-of-responders-who-start` | At or above its likely value |
| Staying, Filed a return that was accepted | 53.5% | 40.7% (33.3% to 87%), `staying-share-of-starters-who-finish` | At or above its likely value |

**No step falls below its benchmark's likely value.** The page names no step for improvement.

## Every number, with its source

| Link | Number | Low | Likely | High | Evidence | Source | Note |
|---|---|---|---|---|---|---|---|
| Reach | Booked a time or walked in | 29% | 29% | 29% | counted | The program's booking system and sign-in sheets (made up) | Counted: 1,450, February to April 2026. |
| Uptake | Started a return with a volunteer | 69.7% | 69.7% | 69.7% | counted | The program's filing records (made up) | Counted: 1,010, February to April 2026. |
| Staying | Filed a return that was accepted | 53.5% | 53.5% | 53.5% | counted | The program's filing records (made up) | Counted: 540, February to April 2026. Nobody has measured how many of these households would have filed for free some other way, so the file leaves the effect and the household gain out. |
| Cost, per person at the start | Volunteer training, space, and outreach, per household on the list | $2.00 | $3.00 | $5.00 | assumed | The program's draft budget (made up) |  |

## Benchmarks this page used

A benchmark is a default, never a fact. Any of these can be overridden in the chain file.

**Share of people sent outreach who respond**, used to check "Booked a time or walked in". Low and high are the lowest and highest of the four points below. Likely is the midpoint of the two middle points.

What it does not cover. Outreach of any kind other than a letter, a text, an email, or a public launch. The four points reach very different groups. Older adults in Pennsylvania by mail, people in Los Angeles who had already applied for SNAP, and taxpayers in twelve states who could use a new federal filing tool. The Los Angeles group had already applied, so it responds far more often than a cold list. Some people who started the federal filing checker lived outside the pilot states, so that point runs high against its own base.

- 17.6%. Started the eligibility checker of a free federal tax filing tool, against the IRS research division's estimate of 19 million eligible taxpayers. More than 3.3 million started it, printed as 3,340,500 in Figure 2. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 26.7%. Called the number on an outreach letter about SNAP, letter and reminder postcard only. The raw call rate. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, calls counted over seven months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- 30.1%. Called the number on an outreach letter about SNAP that offered phone help to apply. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, calls counted over seven months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- 53%. Called a new phone line at least once before the deadline, after a text or email saying they could do their required SNAP interview at a time of their choosing. Los Angeles County, California, applicants through one online application. Applications from October 2020 to May 2021. [Giannella, Homonoff, Rino, and Somerville, Administrative Burden and Procedural Denials, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf)

**Share of people who responded who go on to start**, used to check "Started a return with a volunteer". Low and high are the lowest and highest of the three points below. Likely is the middle one.

What it does not cover. Any step but the first real start, an application or a sign-in. The federal filing tool turned many people away at the checker on purpose, because the tool did not fit their taxes, so its point runs low for a reason that is not a failure. Phone help with the application roughly doubles the start rate over a letter alone in the one study that tested both.

- 12.7%. Signed in to a free federal tax filing tool, of those who started its eligibility checker. 423,450 signed in, of 3,340,500 who started. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 31.3%. Applied for SNAP, of those who called the number on a letter and postcard with no phone help. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, followed nine months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)
- 60.2%. Applied for SNAP, of those who called the number on a letter that offered phone help to apply. Pennsylvania, adults 60 and over on Medicaid and not on SNAP. Letters mailed in 2016, followed nine months. [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf)

**Share of people who started who finish**, used to check "Filed a return that was accepted". Low and high are the lowest and highest of the three points below. Likely is the middle one.

What it does not cover. Finishing anything longer than one application, one return, or one interview, such as a training program. Two of the three points come from the same federal filing tool, measured two ways. The Los Angeles point counts callers who stayed on the line at least five minutes, which the authors call a conservative floor for the time an interview takes, not a count of finished interviews.

- 33.3%. Had a return accepted, of those who signed in to a free federal tax filing tool. 140,803 accepted returns, of 423,450 who signed in. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 40.7%. Submitted a return, of those who started one in a free federal tax filing tool. 161,042 submitted, of 395,483 who started a return. Twelve US states. February to April 2024. [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf)
- 87%. Stayed on the line at least five minutes, of SNAP applicants who called a new phone line to do their required interview. Los Angeles County, California, applicants through one online application. Applications from October 2020 to May 2021. [Giannella, Homonoff, Rino, and Somerville, Administrative Burden and Procedural Denials, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf)

## How the range was made

Each number above was drawn 20,000 times from a triangle-shaped spread that never goes below its low or above its high and lands most often near its likely value. That triangle is drawn between a low, a likely, and a high, and it is not a statistical confidence interval. Counted numbers are not drawn. They stay fixed at what the program recorded. Each run walks the chain from the start to the end. The middle run is the median and the range is the 10th to the 90th percentile. The seed is 20260918, so the same file gives the same page on any machine.

## What this page refuses to do

It never prints a final figure without a range. It never counts an effect with no comparison group, or one that does not say who it was measured over. It never puts dollars on a result nobody measured in dollars. It never stretches a gain past the window someone measured. It never names a step for improvement without a published benchmark to hold it against. It never compares this program to another one. It never uses a benchmark without naming it and its source.
