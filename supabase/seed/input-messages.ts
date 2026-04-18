/**
 * 20 realistic input messages for the Input Parser demo.
 * Mix of channels (email/slack/whatsapp), countries, and ambiguity.
 * A few are pre-parsed to show the full lifecycle on load.
 */
export const INPUT_MESSAGES = [
  // Pending — clear
  {
    source: "slack",
    sender: "sarah.mokoena@atlas-ops.app",
    raw_text:
      "Quick one — Thabo Nkosi's getting a R 8,500 performance bonus this cycle, pls add.",
    status: "pending",
    hours_ago: 0.5,
  },
  {
    source: "email",
    sender: "hr@atlas-ops.app",
    raw_text:
      "Please process a salary increase for James Wilson (UK) from £5,200 to £5,600/month effective 1 April.",
    status: "pending",
    hours_ago: 1.2,
  },
  {
    source: "slack",
    sender: "ops@atlas-ops.app",
    raw_text:
      "Linda Schmidt in DE — new bank details. IBAN ends 4521. Effective next payroll.",
    status: "pending",
    hours_ago: 2.1,
  },
  // Pending — ambiguous
  {
    source: "whatsapp",
    sender: "+27 82 555 0101",
    raw_text:
      "hey can u add 1500 bonus for nomsa? shes the one in JHB, i think payroll has her",
    status: "pending",
    hours_ago: 3.0,
  },
  {
    source: "email",
    sender: "manager@atlas-ops.app",
    raw_text:
      "Salary correction for our US sales team member — name starts with K. The amount should be around 15k USD monthly going forward. Not sure of effective date, ASAP ideally.",
    status: "pending",
    hours_ago: 4.5,
  },
  {
    source: "slack",
    sender: "finance@atlas-ops.app",
    raw_text:
      "FYI commission for Q1 ready. 12 employees. Amounts in spreadsheet. Will send via email.",
    status: "pending",
    hours_ago: 5.2,
  },
  {
    source: "slack",
    sender: "alex.pienaar@atlas-ops.app",
    raw_text:
      "going on parental leave from 5 May, back 5 November. confirmed with manager and HR already.",
    status: "pending",
    hours_ago: 6.1,
  },
  {
    source: "email",
    sender: "hr@atlas-ops.app",
    raw_text:
      "Priya Sharma — change tax code from 1257L to BR on next payroll run. Second employment notification received.",
    status: "pending",
    hours_ago: 7.3,
  },
  {
    source: "whatsapp",
    sender: "+44 7700 900456",
    raw_text:
      "sorry to bug, my address changed. moved to Flat 12, 45 Long Street, Cape Town 8001. same bank though",
    status: "pending",
    hours_ago: 8.0,
  },
  {
    source: "email",
    sender: "legal@atlas-ops.app",
    raw_text:
      "Court order received for wage garnishment on employee ID EMP-0234. Amount $450/month, effective immediately, maximum 24 months. Full documentation attached.",
    status: "pending",
    hours_ago: 9.5,
  },
  {
    source: "slack",
    sender: "engineering-manager@atlas-ops.app",
    raw_text:
      "Can we do a retention bonus for 3 of my senior engineers? $5k each, one-time, paid in this cycle. Need by Friday.",
    status: "pending",
    hours_ago: 10.4,
  },
  {
    source: "slack",
    sender: "ops@atlas-ops.app",
    raw_text:
      "AU superannuation rate going up to 12.75% from July 1 — please confirm payroll system picks this up automatically.",
    status: "pending",
    hours_ago: 11.2,
  },
  // Historical — already parsed and approved
  {
    source: "email",
    sender: "hr@atlas-ops.app",
    raw_text:
      "Ahmed Al Rashid in UAE — promoted to Senior Account Executive. New salary AED 32,000/month effective 1 April 2026.",
    status: "parsed",
    hours_ago: 24,
  },
  {
    source: "slack",
    sender: "manager@atlas-ops.app",
    raw_text:
      "Emma Dubois bonus this cycle — €3,200. Approved by me and budget confirmed.",
    status: "parsed",
    hours_ago: 36,
  },
  {
    source: "whatsapp",
    sender: "+971 50 123 4567",
    raw_text:
      "I'm taking 2 weeks annual leave from 15 April. Manager approved. Atlas ID 0189.",
    status: "parsed",
    hours_ago: 48,
  },
  // More pending — payroll-ops-common friction
  {
    source: "email",
    sender: "benefits@atlas-ops.app",
    raw_text:
      "New joiner in Germany — Lukas Weber, starting 22 April. Salary €6,800/month. Full-time. Pension scheme default.",
    status: "pending",
    hours_ago: 12.1,
  },
  {
    source: "slack",
    sender: "cfo@atlas-ops.app",
    raw_text:
      "Q2 performance bonuses — see attached spreadsheet. 8 employees across ZA/US/UK. Total pool $24,500. Process this cycle if possible.",
    status: "pending",
    hours_ago: 14.0,
  },
  {
    source: "email",
    sender: "hr@atlas-ops.app",
    raw_text:
      "Termination notice — Mark Johnson (US), last working day Friday (2 days). Voluntary resignation. Please initiate final pay workflow.",
    status: "pending",
    hours_ago: 15.2,
  },
  {
    source: "whatsapp",
    sender: "+27 83 444 5566",
    raw_text:
      "hi payroll, you know the thing we discussed last week about the housing allowance? can we actually go with option 2 not option 1. thanks!",
    status: "pending",
    hours_ago: 16.5,
  },
  {
    source: "slack",
    sender: "ops@atlas-ops.app",
    raw_text:
      "Monthly SDL/UIF check — all SA employees reconciled, no variances. Closing books.",
    status: "pending",
    hours_ago: 18.0,
  },
];
