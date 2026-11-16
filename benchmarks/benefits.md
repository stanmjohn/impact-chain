# Benefits access benchmarks

Built from `benchmarks/benefits.json` by `node bin/impact-chain.mjs benchmarks`. Every number is a default, never a fact. A chain file can override any of them.

## Share of people sent outreach who respond

Name in a chain file: `reach-share-who-respond-to-outreach`. Unit: share. A page checks the reach step against it, unless the file names another benchmark or none.

Low 0.176, likely 0.284, high 0.53. Low and high are the lowest and highest of the four points below. Likely is the midpoint of the two middle points.

**What it does not cover.** Outreach of any kind other than a letter, a text, an email, or a public launch. The four points reach very different groups. Older adults in Pennsylvania by mail, people in Los Angeles who had already applied for SNAP, and taxpayers in twelve states who could use a new federal filing tool. The Los Angeles group had already applied, so it responds far more often than a cold list. Some people who started the federal filing checker lived outside the pilot states, so that point runs high against its own base.

| Value | What it is | Year | Place | How it was measured | Source |
|---|---|---|---|---|---|
| 0.176 | Started the eligibility checker of a free federal tax filing tool, against the IRS research division's estimate of 19 million eligible taxpayers. More than 3.3 million started it, printed as 3,340,500 in Figure 2. | February to April 2024 | Twelve US states | IRS system counts against an IRS estimate of the eligible population | [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969](https://www.irs.gov/pub/irs-pdf/p5969.pdf) |
| 0.267 | Called the number on an outreach letter about SNAP, letter and reminder postcard only. The raw call rate. | Letters mailed in 2016, calls counted over seven months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | Call logs, lottery study, 5,314 people mailed | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 0.301 | Called the number on an outreach letter about SNAP that offered phone help to apply. | Letters mailed in 2016, calls counted over seven months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | Call logs, lottery study, 10,629 people mailed | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 0.53 | Called a new phone line at least once before the deadline, after a text or email saying they could do their required SNAP interview at a time of their choosing. | Applications from October 2020 to May 2021 | Los Angeles County, California, applicants through one online application | Call records for the treatment group, lottery study, 64,798 applications | [Giannella, Homonoff, Rino, and Somerville, Administrative Burden and Procedural Denials, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf) |

## Share of people who responded who go on to start

Name in a chain file: `uptake-share-of-responders-who-start`. Unit: share. A page checks the uptake step against it, unless the file names another benchmark or none.

Low 0.127, likely 0.313, high 0.602. Low and high are the lowest and highest of the three points below. Likely is the middle one.

**What it does not cover.** Any step but the first real start, an application or a sign-in. The federal filing tool turned many people away at the checker on purpose, because the tool did not fit their taxes, so its point runs low for a reason that is not a failure. Phone help with the application roughly doubles the start rate over a letter alone in the one study that tested both.

| Value | What it is | Year | Place | How it was measured | Source |
|---|---|---|---|---|---|
| 0.127 | Signed in to a free federal tax filing tool, of those who started its eligibility checker. 423,450 signed in, of 3,340,500 who started. | February to April 2024 | Twelve US states | IRS system counts | [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf) |
| 0.313 | Applied for SNAP, of those who called the number on a letter and postcard with no phone help. | Letters mailed in 2016, followed nine months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | State application records and call logs, lottery study | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 0.602 | Applied for SNAP, of those who called the number on a letter that offered phone help to apply. | Letters mailed in 2016, followed nine months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | State application records and call logs, lottery study | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |

## Share of people who started who finish

Name in a chain file: `staying-share-of-starters-who-finish`. Unit: share. A page checks the staying step against it, unless the file names another benchmark or none.

Low 0.333, likely 0.407, high 0.87. Low and high are the lowest and highest of the three points below. Likely is the middle one.

**What it does not cover.** Finishing anything longer than one application, one return, or one interview, such as a training program. Two of the three points come from the same federal filing tool, measured two ways. The Los Angeles point counts callers who stayed on the line at least five minutes, which the authors call a conservative floor for the time an interview takes, not a count of finished interviews.

| Value | What it is | Year | Place | How it was measured | Source |
|---|---|---|---|---|---|
| 0.333 | Had a return accepted, of those who signed in to a free federal tax filing tool. 140,803 accepted returns, of 423,450 who signed in. | February to April 2024 | Twelve US states | IRS system counts | [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf) |
| 0.407 | Submitted a return, of those who started one in a free federal tax filing tool. 161,042 submitted, of 395,483 who started a return. | February to April 2024 | Twelve US states | IRS system counts | [Internal Revenue Service, IRS Direct File Pilot Program, Filing Season 2024 After Action Report, Publication 5969, Figure 2](https://www.irs.gov/pub/irs-pdf/p5969.pdf) |
| 0.87 | Stayed on the line at least five minutes, of SNAP applicants who called a new phone line to do their required interview. | Applications from October 2020 to May 2021 | Los Angeles County, California, applicants through one online application | Call records for the treatment group, lottery study, 64,798 applications | [Giannella, Homonoff, Rino, and Somerville, Administrative Burden and Procedural Denials, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf) |

## Share of everyone offered help who enrolled and would not have enrolled anyway

Name in a chain file: `added-enrollment-from-application-help`. Unit: share.

Low 0.022, likely 0.047, high 0.118. Low and high are the lowest and highest of the three points below. Likely is the middle one.

**What it does not cover.** Anything but SNAP. Each figure is measured over everyone offered the help, not only the people who used it, so it is never multiplied by reach or uptake. Two very different groups, older adults in Pennsylvania reached by mail and online applicants in Los Angeles reached by text. The Los Angeles group had already applied before it was offered help, so in a chain its point belongs to the people who started, not to everyone at the start. A program that reaches people who are harder to enroll, or easier, will land outside this range.

| Value | What it is | Year | Place | How it was measured | Source |
|---|---|---|---|---|---|
| 0.118 | A letter plus phone help with the application. 17.6 percent enrolled within nine months against 5.8 percent of the comparison group. | Letters mailed in 2016, followed nine months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | State enrollment records, lottery study, 10,629 offered and 10,630 in the comparison group | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 0.047 | A letter and a reminder postcard with no phone help. 10.5 percent enrolled against 5.8 percent. | Letters mailed in 2016, followed nine months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | State enrollment records, lottery study, 5,314 offered and 10,630 in the comparison group | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 0.022 | A text or email telling online applicants they could call for their required interview at a time of their choosing. The gain in ever receiving SNAP, five months out. | Applications from October 2020 to May 2021, followed five months | Los Angeles County, California, applicants through one online application | County records, lottery study, 64,798 applications | [Giannella, Homonoff, Rino, and Somerville, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf) |

## SNAP dollars a newly enrolled household receives in a year

Name in a chain file: `snap-dollars-per-new-household-per-year`. Unit: dollars per household per year.

Low 1216, likely 1385, high 1751. Each point is a printed average monthly benefit times twelve. Low and high are the lowest and highest of the three. Likely is the middle one.

**What it does not cover.** Households with children, who receive far more. Anyone under 60. Any year but 2016, with no adjustment for inflation or for later changes to benefit levels. People a program newly brings in tend to receive less than people who enroll on their own, which is why the low end sits where it does. Benefits are money moved to a household from the federal government, not new wealth.

| Value | What it is | Year | Place | How it was measured | Source |
|---|---|---|---|---|---|
| 1216 | Enrollees who got a letter plus phone help. Printed as $101.32 a month. | 2016 | Pennsylvania, adults 60 and over | State benefit records, enrollees within nine months | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 1385 | Enrollees who got a letter only. Printed as $115.38 a month. | 2016 | Pennsylvania, adults 60 and over | State benefit records, enrollees within nine months | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 1751 | Enrollees in the comparison group, who enrolled with no outreach. Printed as $145.94 a month. | 2016 | Pennsylvania, adults 60 and over | State benefit records, enrollees within nine months | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |

