---
title: Cash Eligibility Rules
path: cash-eligibility-rules
order: 2
---

# Cash Eligibility Rules

**Camp → Cash Eligibility Rules**

A rule says: *"Youth from **this church**, registering for **this event**, pay
**this amount** on Zeffy."* There are two kinds of rule, decided by the Amount:

- **Amount = $0 — cash at the door.** The registrant uses the church's Zeffy
  100% discount code, gets a $0 ticket with a QR code, and pays the **full camp
  price** in cash at check-in. This is the only kind of rule that makes a
  registration **cash-eligible**.
- **Amount > $0 — partial online payment** (e.g. `175.00`). The registrant pays
  that amount online on Zeffy like everyone else; the church settles the rest
  with the organisers directly. These registrations are **not** cash-eligible
  and nothing is collected at the door.

Rules are the **only** thing that makes a registration cash-eligible. Nothing
else does — not the discount code, not a $0 Zeffy total, not the church name
the registrant typed.

## Set-up before registration opens

Do this **before** people from a cash church start registering. The check
happens at the moment the form is submitted; rules added later do not
retro-actively change existing registrations (see "Adding a rule late" below).

1. In Zeffy, create a **100% discount code** on the event's ticketing form
   (one code per church is recommended, e.g. `SPOKANE-CASH-2026`).
2. In this panel, open **Camp → Cash Eligibility Rules → Create**.
3. Fill in:

| Field | What to enter |
| --- | --- |
| **Scope** | `Church` (the only option today). |
| **Church** | Pick the church from the searchable list. This must be the same church record registrants pick on the public form — the form only matches by church ID, never by typed name. |
| **Event Slug** | The event's URL slug, e.g. `osennii-molodeznyi-lager-szr-2026` (the part of the registration URL after `/youth-ministry/`). |
| **Amount** | What the registrant pays **on Zeffy**, in dollars. `0.00` = cash at the door (the registration is cash-eligible and owes the full camp price at check-in). Any other value, e.g. `175.00` = the registrant pays that online and is not cash-eligible. The resulting price is copied onto each registration at sign-up time, so changing the rule later does not change people who already registered. |
| **Discount Code** | The Zeffy code, exactly as created in Zeffy (only needed for $0 rules). Used for reference and for a soft cross-check on the webhook. |
| **Zeffy Campaign Id** | Optional but recommended. The UUID of the Zeffy ticketing form for this event. Find it in any **Zeffy Payment** → Raw JSON → `campaign_id`. Once set on any active rule for the event, payments that arrive from a *different* Zeffy form (e.g. someone typed their CAMP- code into last year's form) are flagged **Review required** instead of being accepted. |
| **Active** | On. Turn off to stop new cash registrations from this church without deleting history. |

4. Save. Repeat for each cash church.

One rule per **church + event**. If several churches share one Zeffy code,
create one rule per church and enter the same code on each.

## What the rule does

**At registration time** — when someone picks that church on the public form
for that event and an active rule exists:

- $0 rule → **Cash Eligible = Yes**, **Event Price / Due** = the full camp price.
- $X rule → **Cash Eligible = No**, **Event Price / Due** = $X.

**In the approval email** — cash-eligible registrants get a yellow note that
their total on Zeffy will be $0 and they will pay the camp price in cash at the
door. Everyone else sees a plain "К оплате: $X" line with their price.

**When Zeffy sends the $0 checkout** — the system checks the registration's
Cash Eligible flag (not the code):

| Registration | Zeffy total | Result |
| --- | --- | --- |
| any | any, but from a Zeffy campaign that is **not** listed on an active rule for the event | **Review required** — audit event `campaign_mismatch` (payment is not counted as paid even if money was taken) |
| Cash Eligible = Yes | $0 | **Cash due**, Method = Cash, Due = Event Price |
| Cash Eligible = No | $0 | **Review required** — code was leaked or misused |
| anything | > $0 | **Paid**, Method = Online |

The campaign check only applies when at least one active rule for the event
has a **Zeffy Campaign Id**. If none do, payments from any Zeffy form are
accepted (the old behaviour).

If a cash-eligible person used the wrong code (or none — e.g. Zeffy had a free
ticket type), they are still marked Cash due, and an audit event
`discount_code_mismatch` is recorded so you can investigate.

If a non-eligible person used a code that belongs to a church rule, the audit
event records which rule/church the code leaked from.

## Adding a rule late

If a church is added after some of its youth already registered, those earlier
registrations are **not** cash-eligible. Options:

- Open each registration → **Edit** → tick **Cash Eligible**, save. When their
  $0 Zeffy checkout arrives it will then become Cash due.
- Or wait for the $0 checkout to land as **Review required** and use the
  **Resolve Review → Authorize cash** action.

## Sharing the code with the church

Give the discount code to the **youth leader** of that church, not to
registrants directly. The leader can pass it on after approving each person.
The code is not a secret that protects money — a leaked code only produces a
red *Review required* row, never a free admission — but keeping it with the
leader avoids confusion at the desk.

## Permissions

Viewing and editing rules requires the `cash_eligibility_rules` permissions
(view / create / edit / delete). See [Permissions](/documentation/permissions). Normally
only the camp treasurer or organizer should have create/edit.
