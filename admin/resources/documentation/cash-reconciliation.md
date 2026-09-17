---
title: Cash Reconciliation
path: cash-reconciliation
order: 4
---

# Cash Reconciliation

**Camp → Camp Registrations → Lens dropdown → Cash Reconciliation**

This is the treasurer's report. Cash cannot be checked against a card
processor, so this page is built entirely from **our** payment records — never
from Zeffy's $0 transactions.

## What it shows

Three totals at the top:

| Card | Definition |
| --- | --- |
| **Cash Expected** | Everything in the cash workflow: cash already collected **plus** cash still due. Equivalent to "attendees × price" for cash churches. |
| **Cash Collected** | Sum of **Paid** where Method = Cash. This is the amount that should be in the cash box. |
| **Cash Still Due** | Sum of **Due** for rows in *Cash due* or *Review required*. |

`Cash Expected = Cash Collected + Cash Still Due` (when nothing has been
refunded or canceled).

Below the cards is the list of every registration that is part of the cash
workflow — anyone with Method = Cash, or Payment = Cash due / Review required:

| Column | Notes |
| --- | --- |
| Name, Church, Event | who and where |
| Payment | Cash due / Paid / Review required |
| Method | Cash (or blank for Review required rows) |
| Due / Paid | dollars |
| Check-in | arrived or not |
| Cash By | admin user who collected the cash (detail view) |
| Checked In By | admin user who checked them in (detail view) |

Online payers and waived attendees are **not** in this lens (they have no cash
component). Use the main Camp Registrations list for them.

## Filters

Payment · Method · Check-in · Cash eligible — the same filters as the main
list. The metric cards do **not** react to filters; they always show the
whole cash workflow. Use the list plus **Export as CSV** for filtered totals.

## Typical uses

**Counting the cash box at end of day**
Cash Collected should equal the physical cash. If it does not:
- Sort by **Paid** and look at **Cash By** to see who collected what.
- Check the main list for rows still on *Cash due* whose people are already
  *Checked in* — someone pressed *Check In* instead of *Cash Received & Check
  In*, or collected cash without recording it.

**Per-church settlement**
Filter nothing, export CSV, pivot by Church in a spreadsheet. Or search the
church name in the search box.

**Who still owes**
Filter *Payment = Cash due*. Anyone here with *Check-in = Checked in* is a
problem (admitted without paying) — see Troubleshooting.

**Review required rows**
They count toward Cash Still Due because the price is owed until someone
decides otherwise. Clear them with *Resolve Review* (available from this lens
too).

## Where the numbers come from

Every number is a sum over the `amount_paid_cents` / `amount_due_cents`
columns of `camp_registrations`. The desk actions keep them consistent:
*Cash Received & Check In* moves Due → Paid in one write. If someone edits the
amounts by hand, the report reflects whatever they typed.

For a per-transaction trail (who pressed what, when, with what note) query the
`registration_events` table: events `cash_payment_collected`, `checked_in`,
`review_resolved`, `online_payment`, `cash_due`, `unauthorized_zero_dollar`,
`campaign_mismatch`,
`discount_code_mismatch`, `duplicate_registration_code`, `payment_refunded`.
