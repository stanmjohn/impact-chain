// Asks PolicyEngine's open tax and benefit model what one household keeps of
// a raise. It runs as its own command, never at build time, so a committed
// page still rebuilds byte for byte with no network. The answer is written
// into the chain file as a [kept share] block with the date and the model
// version, and the build reads that block like any other number.
//
// Kept counts cash and near-cash only: federal and state income tax after
// credits, the employee side of payroll tax, SNAP, TANF, and SSI. Health
// coverage and its subsidies are reported apart and never added in.

const API = "https://api.policyengine.org/us";

export const CASH_LINES = [
  { key: "income_tax", entity: "tax_units", sign: -1, label: "federal income tax after credits" },
  { key: "state_income_tax", entity: "tax_units", sign: -1, label: "state income tax" },
  { key: "employee_payroll_tax", entity: "tax_units", sign: -1, label: "payroll tax, employee side" },
  { key: "snap", entity: "spm_units", sign: 1, label: "SNAP" },
  { key: "tanf", entity: "spm_units", sign: 1, label: "TANF" },
  { key: "ssi", entity: "people", sign: 1, label: "SSI", perPerson: true },
];

export const HEALTH_LINES = [
  { key: "medicaid", entity: "people", label: "Medicaid, valued by the model", perPerson: true },
  { key: "aca_ptc", entity: "tax_units", label: "ACA premium subsidy" },
];

/** Build the request body for one household at one earned income. */
export function household({ state, ages, income, year }) {
  const people = {};
  const adults = [];
  const kids = [];
  ages.forEach((age, i) => {
    const id = `p${i + 1}`;
    people[id] = { age: { [year]: age }, employment_income: { [year]: i === 0 ? income : 0 } };
    (age >= 18 ? adults : kids).push(id);
    for (const line of [...CASH_LINES, ...HEALTH_LINES]) if (line.perPerson) people[id][line.key] = { [year]: null };
  });
  const all = Object.keys(people);
  const ask = (entity) => Object.fromEntries([...CASH_LINES, ...HEALTH_LINES].filter((l) => l.entity === entity && !l.perPerson).map((l) => [l.key, { [year]: null }]));
  return {
    household: {
      people,
      tax_units: { tu: { members: all, ...ask("tax_units") } },
      spm_units: { spm: { members: all, ...ask("spm_units") } },
      households: { hh: { members: all, state_name: { [year]: state } } },
      families: { f: { members: all } },
      marital_units: adults.length === 2
        ? { mu: { members: adults }, ...Object.fromEntries(kids.map((k) => [`mu_${k}`, { members: [k] }])) }
        : Object.fromEntries(all.map((id) => [`mu_${id}`, { members: [id] }])),
    },
  };
}

async function post(path, body) {
  const res = await fetch(`${API}${path}`, { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "impact-chain/0.2 (open source)" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok || data.status !== "ok") throw new Error(`PolicyEngine: ${data.message ?? res.status}`);
  return data.result;
}

async function version() {
  const res = await fetch(`${API}/metadata`, { headers: { "User-Agent": "impact-chain/0.2 (open source)" } });
  return (await res.json()).result?.version ?? "unknown";
}

function read(result, line, year) {
  const group = result[line.entity];
  let sum = 0;
  for (const unit of Object.values(group)) sum += Number(unit[line.key]?.[year] ?? 0);
  return sum;
}

/** Price one household at its starting income and after the raise. */
export async function price({ state, ages, income, gain, year }) {
  const [before, after, modelVersion] = await Promise.all([
    post("/calculate", household({ state, ages, income, year })),
    post("/calculate", household({ state, ages, income: income + gain, year })),
    version(),
  ]);
  const lines = CASH_LINES.map((l) => ({ ...l, before: read(before, l, year), after: read(after, l, year) }));
  const health = HEALTH_LINES.map((l) => ({ ...l, before: read(before, l, year), after: read(after, l, year) }));
  const cashBefore = income + lines.reduce((s, l) => s + l.sign * l.before, 0);
  const cashAfter = income + gain + lines.reduce((s, l) => s + l.sign * l.after, 0);
  const kept = cashAfter - cashBefore;
  return { state, ages, income, gain, year, modelVersion, lines, health, cashBefore, cashAfter, kept, share: kept / gain };
}

const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");

/** The [kept share] block, as text to drop into the chain file. */
export function block(p, pricedOn) {
  const moved = p.lines.filter((l) => Math.round(l.after - l.before) !== 0).map((l) => `${l.label} ${usd(l.before)} to ${usd(l.after)}`);
  const healthMoved = p.health.filter((l) => Math.round(l.after - l.before) !== 0).map((l) => `${l.label} ${usd(l.before)} to ${usd(l.after)}`);
  const share = Math.round(p.share * 1000) / 10;
  return [
    `[kept share] Share of the raise the household keeps after taxes and lost cash benefits`,
    `low: ${share}%`,
    `likely: ${share}%`,
    `high: ${share}%`,
    `evidence: modeled`,
    `source: PolicyEngine US model, version ${p.modelVersion}, ${p.year} rules, priced on ${pricedOn}`,
    `url: https://policyengine.org/us`,
    `household: ${p.ages.length === 1 ? "one adult" : p.ages.length + " people"}, ${p.ages.length === 1 ? "age" : "ages"} ${p.ages.join(" and ")}, in ${p.state}, earning ${usd(p.income)} before the raise`,
    `note: A raise of ${usd(p.gain)} a year leaves ${usd(p.kept)} in cash after ${moved.length ? moved.join(", ") : "no line moved"}. Cash kept goes from ${usd(p.cashBefore)} to ${usd(p.cashAfter)}. Shown apart and not counted, ${healthMoved.length ? healthMoved.join(", ") : "no health line moved"}. The model applies the rules to this one household and says nothing about what it filed for.`,
  ].join("\n");
}
