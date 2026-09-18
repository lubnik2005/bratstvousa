---
title: Zeffy Payments
path: zeffy-payments
order: 6
---

# Zeffy Payments

**Camp → Zeffy Payments** is a read-only ledger of every Zeffy checkout our
systems have seen. Rows are created automatically by the webhook or by the hourly
`zeffy:sync` job; you cannot create them by hand.

Use this resource when a registration's payment badge looks wrong and you want
to see what Zeffy actually sent.

## Columns

| Column | Meaning |
|---|---|
| **Match** badge | How the payment was linked to a registration (see below). |
| **Code** | The `CAMP-XXXXX` code found in the Zeffy answers, if any. |
| **Buyer / Buyer Email** | Name and email the buyer typed into Zeffy. |
| **Amount** | Amount Zeffy charged, **in cents** (35000 = $350.00). $0 for cash-code checkouts. |
| **Currency / Status** | As reported by Zeffy (`usd`, `succeeded`, …). |
| **Registration** | Link to the matched Camp Registration, if any. |
| **Zeffy Payment Id** | Zeffy's own identifier (detail view). |
| **Raw** | Full JSON payload as received (detail view). Useful for support tickets. |
| **Received** | When we first recorded the payment. |

## Match statuses

| Badge | Meaning | What to do |
|---|---|---|
| **Matched** (green) | Linked to a registration; that registration's payment fields were updated. | Nothing. |
| **Unmatched** (yellow) | No registration had this code or buyer email. The buyer was emailed once asking for their code. | Find the registration by name, then edit it: set **Zeffy Payment** to this payment's ID and fix Payment/Method/Due/Paid by hand. Or ask the buyer to register first. |
| **Refunded** (blue) | Zeffy reported a refund, dispute, or deletion. The registration was moved to **Refunded**, Paid = $0. | Decide whether the attendee still comes; edit the registration if so. |
| **Duplicate** (red) | This payment claimed a code that is already linked to a *different* Zeffy payment. The registration was **not** changed. | Someone reused a registration code. Look up the buyer and create/link a separate registration if they are a real attendee. |

## Why is the amount $0?

A $0 payment is normal for cash-eligible attendees: they applied the church's
100% discount code so Zeffy would issue a ticket without charging a card. The
real balance is on the **Camp Registration** (Due column), not here.

A $0 payment linked to a registration that shows **Review required** means the
attendee used a discount code without being cash-eligible. Handle it via the
**Resolve Review** action on the registration.

## Filters and export

- Filter by **Match** status.
- Search by code, buyer name, or email.
- **Export as CSV** for a full dump.

## Related

- [Camp Registrations](/documentation/camp-registrations) – the record that actually tracks what is owed.
- [Cash at Check-In](/documentation/cash-at-check-in) – how $0 payments become cash collected.
