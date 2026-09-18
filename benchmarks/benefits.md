# Benefits access benchmarks

Built from `benchmarks/benefits.json` by `node bin/impact-chain.mjs benchmarks`. Every number is a default, never a fact. A chain file can override any of them.

## Share of everyone offered help who enrolled and would not have enrolled anyway

Name in a chain file: `added-enrollment-from-application-help`. Unit: share.

Low 0.022, likely 0.047, high 0.118. Low and high are the lowest and highest of the three points below. Likely is the middle one.

**What it does not cover.** Anything but SNAP. Each figure is measured over everyone offered the help, not only the people who used it, so it is never multiplied by reach or uptake. Two very different groups, older adults in Pennsylvania reached by mail and online applicants in Los Angeles reached by text. A product that reaches people who are harder to enroll, or easier, will land outside this range.

| Value | What it is | Year | Place | How it was measured | Source |
|---|---|---|---|---|---|
| 0.118 | A letter plus phone help with the application. 17.6 percent enrolled within nine months against 5.8 percent of the comparison group. | Letters mailed in 2016, followed nine months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | State enrollment records, lottery study, 10,629 offered and 10,630 in the comparison group | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 0.047 | A letter and a reminder postcard with no phone help. 10.5 percent enrolled against 5.8 percent. | Letters mailed in 2016, followed nine months | Pennsylvania, adults 60 and over on Medicaid and not on SNAP | State enrollment records, lottery study, 5,314 offered and 10,630 in the comparison group | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table II](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 0.022 | A text or email telling online applicants they could call for their required interview at a time of their choosing. The gain in ever receiving SNAP, five months out. | Applications from October 2020 to May 2021, followed five months | Los Angeles County, California, applicants through one online application | County records, lottery study, 64,798 applications | [Giannella, Homonoff, Rino, and Somerville, working paper, April 2023](https://harris.uchicago.edu/sites/default/files/homonoff_ppe_seminar_paper_5-3-23.pdf) |

## SNAP dollars a newly enrolled household receives in a year

Name in a chain file: `snap-dollars-per-new-household-per-year`. Unit: dollars per household per year.

Low 1216, likely 1385, high 1751. Each point is a printed average monthly benefit times twelve. Low and high are the lowest and highest of the three. Likely is the middle one.

**What it does not cover.** Households with children, who receive far more. Anyone under 60. Any year but 2016, with no adjustment for inflation or for later changes to benefit levels. People a product newly brings in tend to receive less than people who enroll on their own, which is why the low end sits where it does. Benefits are money moved to a household from the federal government, not new wealth.

| Value | What it is | Year | Place | How it was measured | Source |
|---|---|---|---|---|---|
| 1216 | Enrollees who got a letter plus phone help. Printed as $101.32 a month. | 2016 | Pennsylvania, adults 60 and over | State benefit records, enrollees within nine months | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 1385 | Enrollees who got a letter only. Printed as $115.38 a month. | 2016 | Pennsylvania, adults 60 and over | State benefit records, enrollees within nine months | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |
| 1751 | Enrollees in the comparison group, who enrolled with no outreach. Printed as $145.94 a month. | 2016 | Pennsylvania, adults 60 and over | State benefit records, enrollees within nine months | [Finkelstein and Notowidigdo, Take-Up and Targeting, Quarterly Journal of Economics 2019, Table IV](https://economics.mit.edu/sites/default/files/2022-08/aaFinkelstein_Noto_QJE_August_2019%20%281%29.pdf) |

