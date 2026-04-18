/**
 * Atlas seed script.
 *
 * Provisions: 1 org, 2 users (already exist in auth), 6 countries,
 * ~90 holidays, 48 employees, 36 cycles, 36 runs, ~1800 line items,
 * 450 fx rates, 24 variances, 20 input messages, 4 terminations with
 * checklists, 28 filings, 6 calendar conflicts, 120 audit log entries,
 * 3 active alerts.
 *
 * Idempotent: truncates all app-scoped tables in dependency order
 * before inserting, so a re-run leaves the database in a clean state.
 *
 * Run:  pnpm seed
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { faker, fakerDE, fakerEN_AU, fakerEN_GB, fakerEN_US } from "@faker-js/faker";
import {
  COUNTRIES,
  HOLIDAYS,
  FX_PAIRS,
  FX_BASELINE,
  SALARY_BANDS,
  ROLE_TITLES,
  EMPLOYEE_DISTRIBUTION,
} from "./seed/fixtures";
import { fillNarration, NARRATION_TEMPLATES } from "./seed/narrations";
import { INPUT_MESSAGES } from "./seed/input-messages";

// ──────────────────────────────────────────────────────────
// Setup
// ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Deterministic faker — same seed gives same fake data every run.
faker.seed(42);
fakerEN_GB.seed(42);
fakerEN_US.seed(42);
fakerEN_AU.seed(42);
fakerDE.seed(42);

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function log(label: string) {
  return (msg: string) => console.log(`[${label}] ${msg}`);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function monthStart(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1));
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

// ──────────────────────────────────────────────────────────
// Truncate (dependency-safe order)
// ──────────────────────────────────────────────────────────
async function truncateAll() {
  const l = log("truncate");
  // Order: children first, parents last
  const tables = [
    "termination_checklist_items",
    "terminations",
    "variances",
    "fx_leakage",
    "fx_rates",
    "input_parse_results",
    "input_messages",
    "calendar_conflicts",
    "filings",
    "payroll_line_items",
    "payroll_runs",
    "payroll_cycles",
    "alerts",
    "audit_log",
    "employee_events",
    "employees",
    "fx_pairs",
    "tax_forms",
    "public_holidays",
    "organization_members",
    "countries",
    "organizations",
  ];
  for (const t of tables) {
    const { error } = await sb.from(t).delete().gte("created_at", "1970-01-01");
    if (error && !error.message.includes("does not exist")) {
      console.warn(`  warn truncate ${t}: ${error.message}`);
    }
  }
  l(`truncated ${tables.length} tables`);
}

// ──────────────────────────────────────────────────────────
// Reference data
// ──────────────────────────────────────────────────────────
async function seedCountries(): Promise<Map<string, string>> {
  const l = log("countries");
  const { data, error } = await sb.from("countries").insert(COUNTRIES).select("id,iso_code");
  if (error) throw error;
  const map = new Map(data!.map((c) => [c.iso_code, c.id]));
  l(`inserted ${data!.length}`);
  return map;
}

async function seedHolidays(countryMap: Map<string, string>) {
  const l = log("holidays");
  const rows: unknown[] = [];
  for (const [iso, holidays] of Object.entries(HOLIDAYS)) {
    const id = countryMap.get(iso)!;
    for (const h of holidays) {
      rows.push({ country_id: id, holiday_date: h.date, name: h.name, holiday_type: "public" });
    }
  }
  const { error } = await sb.from("public_holidays").insert(rows as never[]);
  if (error) throw error;
  l(`inserted ${rows.length}`);
}

async function seedFxPairs(): Promise<Map<string, string>> {
  const l = log("fx_pairs");
  const { data, error } = await sb.from("fx_pairs").insert(FX_PAIRS).select("id,base_currency");
  if (error) throw error;
  const map = new Map(data!.map((p) => [p.base_currency, p.id]));
  l(`inserted ${data!.length}`);
  return map;
}

async function seedTaxForms(countryMap: Map<string, string>) {
  const l = log("tax_forms");
  const rows: unknown[] = [];
  const forms: Record<string, { code: string; name: string; frequency: string }[]> = {
    ZA: [
      { code: "EMP201", name: "Monthly PAYE Return", frequency: "monthly" },
      { code: "EMP501", name: "Annual Employer Reconciliation", frequency: "annual" },
      { code: "IRP5", name: "Employee Tax Certificate", frequency: "annual" },
    ],
    GB: [
      { code: "P60", name: "Annual Statement of Earnings", frequency: "annual" },
      { code: "P11D", name: "Benefits Return", frequency: "annual" },
      { code: "RTI-FPS", name: "Real Time Full Payment Submission", frequency: "monthly" },
    ],
    US: [
      { code: "W-2", name: "Wage and Tax Statement", frequency: "annual" },
      { code: "941", name: "Employer Quarterly Federal Tax Return", frequency: "quarterly" },
      { code: "940", name: "Employer Annual Federal Unemployment Tax", frequency: "annual" },
    ],
    DE: [
      { code: "LSt-Anmeldung", name: "Payroll Tax Registration", frequency: "monthly" },
    ],
    AU: [
      { code: "STP", name: "Single Touch Payroll", frequency: "monthly" },
      { code: "PAYG", name: "Pay As You Go Summary", frequency: "annual" },
    ],
    AE: [
      { code: "WPS", name: "Wage Protection System", frequency: "monthly" },
    ],
  };
  for (const [iso, items] of Object.entries(forms)) {
    for (const f of items) {
      rows.push({
        country_id: countryMap.get(iso)!,
        form_code: f.code,
        form_name: f.name,
        frequency: f.frequency,
      });
    }
  }
  const { error } = await sb.from("tax_forms").insert(rows as never[]);
  if (error) throw error;
  l(`inserted ${rows.length}`);
}

// ──────────────────────────────────────────────────────────
// Organization + users
// ──────────────────────────────────────────────────────────
async function seedOrganization() {
  const l = log("organization");
  const { data: org, error } = await sb
    .from("organizations")
    .insert({
      name: "Atlas Demo",
      slug: "atlas-demo",
      brand_theme: { default_theme: "light" },
    })
    .select()
    .single();
  if (error) throw error;
  l(`created ${org.name} (${org.id})`);
  return org.id as string;
}

async function attachMembers(orgId: string) {
  const l = log("members");
  // Look up users by email
  const { data: usersResp, error: listErr } = await sb.auth.admin.listUsers({ perPage: 100 });
  if (listErr) throw listErr;
  const users = usersResp.users;
  const demo = users.find((u) => u.email === "demo@atlas-ops.app");
  const viewer = users.find((u) => u.email === "viewer@atlas-ops.app");
  if (!demo || !viewer) throw new Error("demo users missing — run create_demo_users.py first");

  // Ensure profiles exist (trigger may have fired; upsert just in case)
  await sb.from("profiles").upsert([
    { id: demo.id, full_name: "Tshepiso Jafta", default_org_id: orgId },
    { id: viewer.id, full_name: "Demo Viewer", default_org_id: orgId },
  ]);

  const { error } = await sb.from("organization_members").insert([
    { organization_id: orgId, user_id: demo.id, role: "owner" },
    { organization_id: orgId, user_id: viewer.id, role: "viewer" },
  ]);
  if (error) throw error;
  l(`attached owner=${demo.id.slice(0, 8)} viewer=${viewer.id.slice(0, 8)}`);
  return { demoId: demo.id, viewerId: viewer.id };
}

// ──────────────────────────────────────────────────────────
// Employees
// ──────────────────────────────────────────────────────────
type EmployeeRow = {
  id: string;
  organization_id: string;
  country_id: string;
  country_iso: string;
  full_name: string;
  email: string;
  role_title: string;
  start_date: string;
  termination_date: string | null;
  employment_type: string;
  monthly_gross_amount: number;
  monthly_gross_currency: string;
  pay_schedule: string;
  bank_iban_masked: string;
  tax_id_masked: string;
  status: string;
};

const fakerByIso: Record<string, typeof faker> = {
  ZA: faker,
  GB: fakerEN_GB as unknown as typeof faker,
  US: fakerEN_US as unknown as typeof faker,
  DE: fakerDE as unknown as typeof faker,
  AU: fakerEN_AU as unknown as typeof faker,
  AE: faker,
};

async function seedEmployees(
  orgId: string,
  countryMap: Map<string, string>,
): Promise<EmployeeRow[]> {
  const l = log("employees");
  const rows: Omit<EmployeeRow, "id">[] = [];
  for (const [iso, count] of Object.entries(EMPLOYEE_DISTRIBUTION)) {
    const country = COUNTRIES.find((c) => c.iso_code === iso)!;
    const band = SALARY_BANDS[iso];
    const fk = fakerByIso[iso] ?? faker;
    for (let i = 0; i < count; i++) {
      const firstName = fk.person.firstName();
      const lastName = fk.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const email = fk.internet
        .email({ firstName, lastName, provider: "atlas-ops.app" })
        .toLowerCase();
      const gross = Math.round(rand(band.min, band.max) / 100) * 100;
      const startYearsAgo = rand(0.2, 3.5);
      const startDate = daysAgo(Math.floor(startYearsAgo * 365));
      rows.push({
        organization_id: orgId,
        country_id: countryMap.get(iso)!,
        country_iso: iso,
        full_name: fullName,
        email,
        role_title: pick(ROLE_TITLES),
        start_date: ymd(startDate),
        termination_date: null,
        employment_type: "employee",
        monthly_gross_amount: gross,
        monthly_gross_currency: country.currency,
        pay_schedule: "monthly",
        bank_iban_masked: `****${fk.finance.accountNumber(4)}`,
        tax_id_masked: `****${fk.string.numeric(4)}`,
        status: "active",
      });
    }
  }
  // Mark one DE employee as soon-to-be-terminated (used by the termination demo)
  const deEmp = rows.find((r) => r.country_iso === "DE")!;
  deEmp.status = "active"; // Still active until termination fires in demo.

  const { data, error } = await sb
    .from("employees")
    .insert(rows.map(({ country_iso: _, ...r }) => r) as never[])
    .select("id,full_name,country_id,organization_id,monthly_gross_amount,monthly_gross_currency");
  if (error) throw error;
  const out: EmployeeRow[] = data!.map((d, i) => ({
    ...rows[i],
    id: d.id,
    country_iso: rows[i].country_iso,
  }));
  l(`inserted ${out.length}`);
  return out;
}

// ──────────────────────────────────────────────────────────
// Payroll: cycles, runs, line items
// ──────────────────────────────────────────────────────────
type CycleRow = {
  id: string;
  organization_id: string;
  country_id: string;
  country_iso: string;
  cycle_month: string;
  status: string;
  total_gross_amount: number;
};

async function seedPayroll(orgId: string, countryMap: Map<string, string>, employees: EmployeeRow[]) {
  const l = log("payroll");

  // Build 6 months of cycles per country (current month = 'inputs_open', rest 'closed')
  const today = new Date();
  const currentMonth = today.getUTCMonth();
  const currentYear = today.getUTCFullYear();

  const cycleRows: unknown[] = [];
  const lookupKey = (iso: string, y: number, m: number) => `${iso}-${y}-${m}`;
  const cycleMeta: Record<string, { country_iso: string; month: Date }> = {};

  for (const country of COUNTRIES) {
    for (let back = 5; back >= 0; back--) {
      const y = currentYear;
      let m = currentMonth - back;
      let year = y;
      if (m < 0) {
        m += 12;
        year = y - 1;
      }
      const cycleDate = monthStart(year, m);
      const cutoff = new Date(cycleDate);
      cutoff.setUTCDate(country.cycle_cutoff_day);
      cutoff.setUTCHours(17, 0, 0, 0);
      const pay = new Date(cutoff);
      pay.setUTCDate(pay.getUTCDate() + country.ach_lag_days);

      const isCurrent = back === 0;
      const key = lookupKey(country.iso_code, year, m);
      cycleMeta[key] = { country_iso: country.iso_code, month: cycleDate };
      cycleRows.push({
        _key: key,
        organization_id: orgId,
        country_id: countryMap.get(country.iso_code)!,
        cycle_month: ymd(cycleDate),
        cutoff_at: cutoff.toISOString(),
        scheduled_pay_at: pay.toISOString(),
        status: isCurrent ? "inputs_open" : "closed",
      });
    }
  }

  // Insert cycles (strip the _key marker)
  const { data: cyclesInserted, error: cErr } = await sb
    .from("payroll_cycles")
    .insert(cycleRows.map(({ _key: _, ...r }: any) => r) as never[])
    .select("id,country_id,cycle_month");
  if (cErr) throw cErr;

  // Build map from (country_id, cycle_month) -> cycle_id
  const cycleById = new Map<string, { id: string; country_id: string; cycle_month: string }>();
  for (const c of cyclesInserted!) {
    cycleById.set(`${c.country_id}|${c.cycle_month}`, c);
  }
  l(`inserted ${cyclesInserted!.length} cycles`);

  // Runs: one per cycle
  const runRows = cyclesInserted!.map((c) => ({
    cycle_id: c.id,
    run_type: "regular",
    run_date: c.cycle_month,
    status: "pending",
  }));
  const { data: runs, error: rErr } = await sb
    .from("payroll_runs")
    .insert(runRows as never[])
    .select("id,cycle_id");
  if (rErr) throw rErr;
  l(`inserted ${runs!.length} runs`);

  // Line items: for each run, generate one per employee in that cycle's country
  const runByCycle = new Map(runs!.map((r) => [r.cycle_id, r.id]));
  const lineItems: unknown[] = [];
  const totalsByCycle = new Map<string, { gross: number; net: number }>();

  const taxRates: Record<string, number> = {
    ZA: 0.28,
    GB: 0.25,
    US: 0.22,
    DE: 0.32,
    AU: 0.3,
    AE: 0.0,
  };
  const socialRates: Record<string, number> = {
    ZA: 0.01,
    GB: 0.12,
    US: 0.0765,
    DE: 0.195,
    AU: 0.0,
    AE: 0.05,
  };

  for (const cycle of cyclesInserted!) {
    const runId = runByCycle.get(cycle.id)!;
    const country = COUNTRIES.find((c) => countryMap.get(c.iso_code) === cycle.country_id)!;
    const taxRate = taxRates[country.iso_code];
    const socRate = socialRates[country.iso_code];
    const employeesInCountry = employees.filter((e) => e.country_id === cycle.country_id);
    let cycleGross = 0;
    let cycleNet = 0;
    for (const emp of employeesInCountry) {
      // Variance ± 0-5%
      const gross = round2(emp.monthly_gross_amount * rand(0.98, 1.05));
      const tax = round2(gross * taxRate);
      const soc = round2(gross * socRate);
      const net = round2(gross - tax - soc);
      cycleGross += gross;
      cycleNet += net;
      lineItems.push({
        run_id: runId,
        employee_id: emp.id,
        gross,
        tax_withheld: tax,
        social_contributions: soc,
        other_deductions: 0,
        net,
        currency: country.currency,
        fx_rate_applied: null,
      });
    }
    totalsByCycle.set(cycle.id, { gross: round2(cycleGross), net: round2(cycleNet) });
  }

  // Insert line items in batches of 500
  for (let i = 0; i < lineItems.length; i += 500) {
    const batch = lineItems.slice(i, i + 500);
    const { error } = await sb.from("payroll_line_items").insert(batch as never[]);
    if (error) throw error;
  }
  l(`inserted ${lineItems.length} line items`);

  // Update cycles with totals
  for (const [cycleId, totals] of totalsByCycle) {
    const empCount = employees.filter((e) =>
      cyclesInserted!.find((c) => c.id === cycleId && e.country_id === c.country_id),
    ).length;
    await sb
      .from("payroll_cycles")
      .update({
        total_gross_amount: totals.gross,
        total_net_amount: totals.net,
        employee_count: empCount,
      })
      .eq("id", cycleId);
  }
  l(`updated ${totalsByCycle.size} cycle totals`);

  return { cyclesInserted: cyclesInserted!, runs: runs! };
}

// ──────────────────────────────────────────────────────────
// FX rates + leakage
// ──────────────────────────────────────────────────────────
async function seedFxRates(pairMap: Map<string, string>, cycles: { id: string; country_id: string; cycle_month: string }[], countryMap: Map<string, string>) {
  const l = log("fx");
  const rows: unknown[] = [];
  const today = new Date();
  for (const [base, pairId] of pairMap) {
    const baseline = FX_BASELINE[base];
    for (let back = 89; back >= 0; back--) {
      const d = daysAgo(back);
      // Random walk ±0.3% per day
      const drift = (Math.random() - 0.5) * 0.006;
      const mid = round2(baseline * (1 + drift) * 10000) / 10000;
      const spreadBps = randInt(20, 80);
      const applied = round2(mid * (1 - spreadBps / 10000) * 10000) / 10000;
      rows.push({
        pair_id: pairId,
        rate_date: ymd(d),
        mid_market_rate: mid,
        provider_applied_rate: applied,
        spread_bps: spreadBps,
        source: "exchangerate-api",
      });
    }
  }
  // Batches of 200
  for (let i = 0; i < rows.length; i += 200) {
    const batch = rows.slice(i, i + 200);
    const { error } = await sb.from("fx_rates").insert(batch as never[]);
    if (error) throw error;
  }
  l(`inserted ${rows.length} fx rates`);

  // FX leakage for last 3 cycles × 5 pairs
  const leakRows: unknown[] = [];
  const currentCycles = cycles.filter((c) => c.cycle_month === cycles[0].cycle_month); // Current month
  const recentCycles = [...currentCycles];
  for (const [base, pairId] of pairMap) {
    for (const c of recentCycles) {
      const country = COUNTRIES.find((co) => countryMap.get(co.iso_code) === c.country_id);
      if (!country) continue;
      if (country.currency !== base) continue;
      const cycleLeak = round2(rand(200, 3500));
      const ytdLeak = round2(cycleLeak * randInt(4, 9));
      leakRows.push({
        cycle_id: c.id,
        pair_id: pairId,
        cycle_leakage_amount: cycleLeak,
        ytd_leakage_amount: ytdLeak,
      });
    }
  }
  if (leakRows.length) {
    const { error } = await sb.from("fx_leakage").insert(leakRows as never[]);
    if (error) throw error;
  }
  l(`inserted ${leakRows.length} fx leakage`);
}

// ──────────────────────────────────────────────────────────
// Variances (pre-narrated)
// ──────────────────────────────────────────────────────────
async function seedVariances(
  cycles: { id: string; country_id: string; cycle_month: string }[],
  countryMap: Map<string, string>,
) {
  const l = log("variances");
  const rows: unknown[] = [];
  // Pick cycles at random across the 36 and generate 24 variances total
  const causes = NARRATION_TEMPLATES.map((t) => t.cause);
  for (let i = 0; i < 24; i++) {
    const cycle = pick(cycles);
    const cause = pick(causes);
    const country = COUNTRIES.find((c) => countryMap.get(c.iso_code) === cycle.country_id)!;
    const pct = round2(rand(2.1, 8.9)) * (Math.random() > 0.5 ? 1 : -1);
    const amount = round2(rand(500, 20_000));
    const vars = {
      country: country.name,
      pct: Math.abs(pct).toFixed(1),
      n: randInt(1, 4),
      amount: amount.toLocaleString("en-US"),
      currency: country.currency,
      base_currency: country.currency,
      fx_pct: (Math.random() * 2).toFixed(1),
      old_rate: (FX_BASELINE[country.currency] ?? 1).toFixed(4),
      new_rate: ((FX_BASELINE[country.currency] ?? 1) * (1 + Math.random() * 0.02)).toFixed(4),
      authority: country.tax_authority,
    };
    const narration = fillNarration(cause, vars);
    rows.push({
      cycle_id: cycle.id,
      country_id: cycle.country_id,
      variance_amount: amount * (pct / Math.abs(pct)),
      variance_pct: pct,
      threshold_crossed: Math.abs(pct) > 3,
      cause_category: cause,
      narration_text: narration,
      narration_model: "seeded-template",
      narration_tokens: narration.length,
      flagged_for_review: cause === "unexplained",
    });
  }
  const { error } = await sb.from("variances").insert(rows as never[]);
  if (error) throw error;
  l(`inserted ${rows.length}`);
}

// ──────────────────────────────────────────────────────────
// Input messages + sample parsed results
// ──────────────────────────────────────────────────────────
async function seedInputMessages(orgId: string) {
  const l = log("input_messages");
  const rows = INPUT_MESSAGES.map((m) => {
    const ts = new Date();
    ts.setTime(ts.getTime() - m.hours_ago * 3_600_000);
    return {
      organization_id: orgId,
      source: m.source,
      sender: m.sender,
      received_at: ts.toISOString(),
      raw_text: m.raw_text,
      raw_metadata: {},
      status: m.status,
    };
  });
  const { data, error } = await sb.from("input_messages").insert(rows as never[]).select("id,raw_text,status");
  if (error) throw error;
  l(`inserted ${data!.length}`);

  // For messages already marked 'parsed', add a parse_result showing the full lifecycle
  const parsed = data!.filter((m) => m.status === "parsed").slice(0, 3);
  const parseResults = parsed.map((m) => ({
    message_id: m.id,
    parsed_fields: {
      employee_name_guess: "Ahmed Al Rashid",
      country_hint: "AE",
      change_type: "salary",
      amount: 32000,
      currency: "AED",
      effective_date: "2026-04-01",
      confidence_scores: { employee: 0.95, change_type: 0.98, amount: 0.92, effective_date: 0.9 },
      ambiguity_flags: [],
    },
    ambiguity_flags: [],
    confidence_overall: 0.9,
    status: "approved",
    approved_at: new Date().toISOString(),
  }));
  if (parseResults.length) {
    await sb.from("input_parse_results").insert(parseResults as never[]);
  }
  l(`  + ${parseResults.length} parse results`);
}

// ──────────────────────────────────────────────────────────
// Terminations + checklists
// ──────────────────────────────────────────────────────────
async function seedTerminations(employees: EmployeeRow[]) {
  const l = log("terminations");
  // 1 active urgent (DE, cutoff in <2h) + 3 historical
  const deEmp = employees.find((e) => e.country_iso === "DE")!;
  const today = new Date();
  const lastDay = new Date(today);
  lastDay.setUTCHours(today.getUTCHours() + 1, 30);

  const terminationRows = [
    {
      employee_id: deEmp.id,
      termination_type: "involuntary",
      notice_date: ymd(today),
      last_working_day: ymd(lastDay),
      jurisdiction_rules_version: "2026-04",
      final_pay_deadline: ymd(lastDay),
      status: "in_progress",
    },
    // 3 historical, complete
    ...["US", "GB", "ZA"].map((iso, i) => {
      const emp = employees.find((e) => e.country_iso === iso)!;
      const ld = daysAgo(30 * (i + 1));
      const nd = new Date(ld);
      nd.setUTCDate(nd.getUTCDate() - 14);
      return {
        employee_id: emp.id,
        termination_type: i === 1 ? "voluntary" : "involuntary",
        notice_date: ymd(nd),
        last_working_day: ymd(ld),
        jurisdiction_rules_version: "2026-04",
        final_pay_deadline: ymd(ld),
        status: "complete",
      };
    }),
  ];

  const { data: terms, error } = await sb
    .from("terminations")
    .insert(terminationRows as never[])
    .select("id,employee_id,termination_type,last_working_day");
  if (error) throw error;
  l(`inserted ${terms!.length}`);

  // Checklist items per termination (country-specific templates)
  const checklistRows: unknown[] = [];
  const now = new Date();
  for (const t of terms!) {
    const emp = employees.find((e) => e.id === t.employee_id)!;
    const iso = emp.country_iso;
    const lastDay = new Date(t.last_working_day);
    const items = jurisdictionChecklist(iso, lastDay, t.termination_type);
    items.forEach((item, pos) => {
      checklistRows.push({
        termination_id: t.id,
        item_type: item.item_type,
        description: item.description,
        statutory_deadline: ymd(item.deadline),
        owner_role: item.owner_role,
        position: pos,
        status: t.last_working_day === terms![0].last_working_day ? "pending" : "done",
      });
    });
  }
  const { error: ciErr } = await sb.from("termination_checklist_items").insert(checklistRows as never[]);
  if (ciErr) throw ciErr;
  l(`  + ${checklistRows.length} checklist items`);

  return terms!;
}

function jurisdictionChecklist(iso: string, lastDay: Date, type: string) {
  const add = (days: number) => {
    const d = new Date(lastDay);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
  };
  const base = [
    { item_type: "final_pay", description: "Calculate and process final pay including accrued PTO", deadline: add(0), owner_role: "payroll" },
    { item_type: "tax_certificate", description: "Issue end-of-employment tax certificate", deadline: add(30), owner_role: "payroll" },
    { item_type: "pto_payout", description: "Reconcile and pay out unused leave balance", deadline: add(0), owner_role: "payroll" },
  ];
  if (iso === "US") {
    base.push({ item_type: "cobra", description: "Issue COBRA continuation notice", deadline: add(14), owner_role: "hr" });
    if (type === "voluntary") {
      base[0].description = "Final pay within 72h (CA law) — voluntary";
    } else {
      base[0].description = "Final pay immediately — involuntary CA";
      base[0].deadline = add(0);
    }
  }
  if (iso === "ZA") {
    base.push({ item_type: "other", description: "Issue UI19 unemployment certificate", deadline: add(14), owner_role: "hr" });
    base[1].description = "Issue IRP5 tax certificate";
  }
  if (iso === "GB") {
    base[1].description = "Issue P45 on or before last working day";
    base[1].deadline = add(0);
  }
  if (iso === "DE") {
    base.push({ item_type: "pension_dereg", description: "Deregister from Sozialversicherung", deadline: add(14), owner_role: "hr" });
    base[1].description = "Issue Lohnabrechnung (final payslip) + Arbeitspapiere";
  }
  if (iso === "AU") {
    base.push({ item_type: "pension_dereg", description: "Final superannuation contribution reconciliation", deadline: add(28), owner_role: "finance" });
  }
  if (iso === "AE") {
    base.push({ item_type: "other", description: "Calculate end-of-service gratuity per UAE Labour Law", deadline: add(7), owner_role: "payroll" });
    base.push({ item_type: "other", description: "Cancel work visa and coordinate WPS final transfer", deadline: add(14), owner_role: "hr" });
  }
  return base;
}

// ──────────────────────────────────────────────────────────
// Filings
// ──────────────────────────────────────────────────────────
async function seedFilings(orgId: string, countryMap: Map<string, string>) {
  const l = log("filings");
  const rows: unknown[] = [];
  const now = new Date();
  const forms: { iso: string; code: string; periodDays: number }[] = [
    { iso: "ZA", code: "EMP201", periodDays: 30 },
    { iso: "ZA", code: "EMP501", periodDays: 365 },
    { iso: "GB", code: "P60", periodDays: 365 },
    { iso: "GB", code: "P11D", periodDays: 365 },
    { iso: "GB", code: "RTI-FPS", periodDays: 30 },
    { iso: "US", code: "W-2", periodDays: 365 },
    { iso: "US", code: "941", periodDays: 90 },
    { iso: "US", code: "940", periodDays: 365 },
    { iso: "DE", code: "LSt-Anmeldung", periodDays: 30 },
    { iso: "AU", code: "STP", periodDays: 30 },
    { iso: "AU", code: "PAYG", periodDays: 365 },
    { iso: "AE", code: "WPS", periodDays: 30 },
  ];

  let total = 0;
  for (const f of forms) {
    const count = f.periodDays === 30 ? 4 : f.periodDays === 90 ? 2 : 1;
    for (let back = 0; back < count && total < 28; back++) {
      const periodEnd = daysAgo(f.periodDays * back);
      const periodStart = daysAgo(f.periodDays * (back + 1));
      const dueDate = new Date(periodEnd);
      dueDate.setUTCDate(dueDate.getUTCDate() + 30);
      const isFuture = dueDate > now;
      let status = "confirmed";
      if (isFuture) {
        status = back === 0 ? pick(["prepared", "not_started", "not_started"]) : "prepared";
      } else {
        status = back === 0 ? "submitted" : "confirmed";
      }
      rows.push({
        organization_id: orgId,
        country_id: countryMap.get(f.iso),
        form_code: f.code,
        period_start: ymd(periodStart),
        period_end: ymd(periodEnd),
        due_date: ymd(dueDate),
        status,
        submitted_at: status === "submitted" || status === "confirmed" ? new Date(periodEnd.getTime() + 20 * 86_400_000).toISOString() : null,
        confirmation_ref: status === "confirmed" ? `REF-${randInt(100000, 999999)}` : null,
        penalty_amount: status === "penalty" ? 300 : null,
      });
      total++;
    }
  }
  const { error } = await sb.from("filings").insert(rows as never[]);
  if (error) throw error;
  l(`inserted ${rows.length}`);
}

// ──────────────────────────────────────────────────────────
// Calendar conflicts
// ──────────────────────────────────────────────────────────
async function seedCalendarConflicts(countryMap: Map<string, string>, cycles: { id: string; country_id: string; cycle_month: string }[]) {
  const l = log("calendar_conflicts");
  const rows: unknown[] = [];

  // 2 current open conflicts
  const zaId = countryMap.get("ZA")!;
  const auId = countryMap.get("AU")!;
  rows.push({
    country_id: zaId,
    cycle_id: cycles.find((c) => c.country_id === zaId)?.id,
    conflict_date: "2026-04-27",
    conflict_type: "holiday_on_cutoff",
    severity: "warn",
    suggested_shift_date: "2026-04-24",
    explanation:
      "Freedom Day (ZA public holiday) falls on a Monday. Standard cutoff of 25 April lands on weekend — shift submission to Friday 24 April.",
  });
  rows.push({
    country_id: auId,
    cycle_id: cycles.find((c) => c.country_id === auId)?.id,
    conflict_date: "2026-04-25",
    conflict_type: "holiday_on_cutoff",
    severity: "crit",
    suggested_shift_date: "2026-04-22",
    explanation:
      "ANZAC Day falls on payroll cutoff. Australian banks closed, ACH will not process. Move cutoff + bank submission to Wednesday 22 April.",
  });

  // 4 resolved historical
  for (let i = 0; i < 4; i++) {
    const iso = pick(["GB", "US", "DE", "ZA"]);
    const d = daysAgo(30 * (i + 1));
    rows.push({
      country_id: countryMap.get(iso),
      cycle_id: null,
      conflict_date: ymd(d),
      conflict_type: pick(["holiday_on_cutoff", "timezone_cutoff_miss"]),
      severity: pick(["info", "warn"]),
      suggested_shift_date: ymd(daysAgo(30 * (i + 1) + 2)),
      explanation: `Historical conflict resolved. Shifted processing by 2 days.`,
      resolved_at: daysAgo(30 * i).toISOString(),
    });
  }

  const { error } = await sb.from("calendar_conflicts").insert(rows as never[]);
  if (error) throw error;
  l(`inserted ${rows.length}`);
}

// ──────────────────────────────────────────────────────────
// Audit log + alerts
// ──────────────────────────────────────────────────────────
async function seedAuditLog(orgId: string, demoId: string, employees: EmployeeRow[]) {
  const l = log("audit_log");
  const rows: unknown[] = [];
  const actions = [
    "login",
    "cycle_opened",
    "cycle_closed",
    "variance_narrated",
    "input_parsed",
    "employee_updated",
    "filing_submitted",
    "alert_resolved",
    "fx_check_run",
    "termination_logged",
  ];
  for (let i = 0; i < 120; i++) {
    const back = rand(0, 14);
    const ts = new Date();
    ts.setTime(ts.getTime() - back * 86_400_000);
    const action = pick(actions);
    const actorType = action === "variance_narrated" || action === "fx_check_run" || action === "input_parsed" ? "system" : "user";
    rows.push({
      organization_id: orgId,
      actor_id: actorType === "user" ? demoId : null,
      actor_type: actorType,
      action,
      target_type: action.includes("employee") ? "employee" : action.includes("cycle") ? "cycle" : action.includes("filing") ? "filing" : "system",
      target_id: action.includes("employee") ? pick(employees).id : null,
      metadata: {},
      occurred_at: ts.toISOString(),
    });
  }
  for (let i = 0; i < rows.length; i += 200) {
    const batch = rows.slice(i, i + 200);
    const { error } = await sb.from("audit_log").insert(batch as never[]);
    if (error) throw error;
  }
  l(`inserted ${rows.length}`);
}

async function seedAlerts(orgId: string) {
  const l = log("alerts");
  const rows = [
    {
      organization_id: orgId,
      severity: "crit",
      title: "DE termination — cutoff in <2h",
      body: "Lukas Weber termination logged 30 minutes ago. Checklist has 6 items, final pay due today.",
      link_url: "/app/people/terminations",
      source_feature: "termination_checklist",
    },
    {
      organization_id: orgId,
      severity: "warn",
      title: "ZA EMP501 filing due in 12 days",
      body: "Annual reconciliation covering March 2025–Feb 2026. 48 IRP5 certificates to generate.",
      link_url: "/app/compliance/filings",
      source_feature: "compliance",
    },
    {
      organization_id: orgId,
      severity: "info",
      title: "FX leakage ↑ 18% this cycle",
      body: "ZAR/USD spread widened from 52 to 71 bps. Total cycle leakage $1,247 (vs $1,058 prior).",
      link_url: "/app/payroll/fx",
      source_feature: "fx_watchdog",
    },
  ];
  const { error } = await sb.from("alerts").insert(rows as never[]);
  if (error) throw error;
  l(`inserted ${rows.length}`);
}

// ──────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────
async function main() {
  console.log("Atlas seed starting...\n");
  await truncateAll();

  const countryMap = await seedCountries();
  await seedHolidays(countryMap);
  const pairMap = await seedFxPairs();
  await seedTaxForms(countryMap);

  const orgId = await seedOrganization();
  const { demoId } = await attachMembers(orgId);

  const employees = await seedEmployees(orgId, countryMap);
  const { cyclesInserted } = await seedPayroll(orgId, countryMap, employees);
  await seedFxRates(pairMap, cyclesInserted, countryMap);
  await seedVariances(cyclesInserted, countryMap);
  await seedInputMessages(orgId);
  await seedTerminations(employees);
  await seedFilings(orgId, countryMap);
  await seedCalendarConflicts(countryMap, cyclesInserted);
  await seedAuditLog(orgId, demoId, employees);
  await seedAlerts(orgId);

  console.log("\n✓ Seed complete.");
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err);
  process.exit(1);
});
