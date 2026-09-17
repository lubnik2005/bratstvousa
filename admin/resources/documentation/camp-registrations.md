---
title: Camp Registrations
path: camp-registrations
order: 3
---

# Camp Registrations

**Camp → Camp Registrations**

One row per person who submitted the public camp registration form. This is
the central record: approval, payment, and check-in all live here.

Rows are sorted newest first. Search works on code, first/last name, email,
phone and church.

## The four badges

| Badge | Values | Who changes it |
| --- | --- | --- |
| **Status** | Awaiting approval, Approved, Rejected (legacy: Pending payment) | The youth leader via the approval email link; admins can edit. |
| **Payment** | Pending, Cash due, Paid, Review required, Refunded, Canceled | Zeffy webhook / hourly sync; desk actions; admins can edit. |
| **Method** | Online, Cash, Waived, Other, or blank | Same as Payment. Blank until a payment event happens. |
| **Check-in** | Not checked in, Checked in | Desk actions; admins can edit. |

Payment **status** and payment **method** are deliberately separate. "Cash"
is a method, not a status: a cash attendee goes *Pending → Cash due → Paid*,
with Method = Cash from the Cash due step onward.

### Payment status meanings

| Value | Meaning |
| --- | --- |
| **Pending** | Created by the form. No Zeffy checkout seen yet. |
| **Cash due** | $0 Zeffy checkout from a cash-eligible registration. Owes **Due**. |
| **Paid** | Paid online, cash collected, or fee waived. Due = $0. |
| **Review required** | $0 Zeffy checkout but **not** cash-eligible. Needs a human decision. |
| **Refunded** | Zeffy reported a refund/dispute/deleted payment. Paid reset to $0. |
| **Canceled** | Set by *Resolve Review → Cancel* or manually. |
| Unpaid (legacy) / Paid (legacy) | Old values from before the cash workflow; treated like Pending / Paid. |

## Fields

### Identity
- **Code** — `CAMP-XXXXX`. Generated at sign-up, emailed to the registrant, and
  entered by them into Zeffy. This is how Zeffy payments are matched back.
- **First / Last Name**, **Email**, **Phone**.
- **Church (linked)** — the church record picked from the dropdown. Used for
  cash-eligibility. Blank if they typed a church that was not in the list.
- **Church** — the free-text name as typed/picked. Always present.
- **Youth Leader** — who approves them.
- **Event** — event slug, e.g. `osennii-molodeznyi-lager-szr-2026`.
- **Registered** — when the form was submitted.

### Approval
- **Approved By / Approved At** — filled when the leader clicks Approve.

### Money (all in dollars, stored as cents)
- **Event Price** — the price locked in at sign-up (from the church's cash rule
  if one existed, otherwise the event default). Changing rules later does not
  change this.
- **Due** — what is still owed. Shown on the index so desk staff see it.
- **Paid** — what has been received.
- **Amount** (detail only) — legacy whole-dollar price; kept for old rows.
- **Cash Eligible** — set at sign-up from Cash Eligibility Rules, or flipped by
  *Resolve Review → Authorize cash*, or edited manually.
- **Fee Waived** — set by *Resolve Review → Waive fee* or manually.
- **Paid At / Paid By** — Paid By is the admin user who pressed *Cash Received
  & Check In*; blank for online payments.

### Zeffy (detail only)
- **Zeffy Payment**, **Zeffy Ticket**, **Zeffy Contact**, **Zeffy Campaign**,
  **Zeffy Discount Code** — identifiers copied from the webhook so a row can be
  cross-referenced with the Zeffy dashboard or the Zeffy app.

### Check-in
- **Checked In At / Checked In By** — set by *Check In* or *Cash Received &
  Check In*.

## Filters

Status · Payment · Method · Check-in · Cash eligible. Combine them, e.g.
*Payment = Cash due* + *Check-in = Not checked in* for "still owe us cash and
haven't arrived".

## Actions

Full desk instructions are in [Cash at Check-In](cash-at-check-in.md). Summary:

| Action | Allowed on | Effect |
| --- | --- | --- |
| **Cash Received & Check In** | Payment = Cash due, Review required, Pending | Method Cash, Payment Paid, Paid = Due, Due = 0, Paid At/By, Checked in + At/By. Others skipped. |
| **Check In** | Payment = Paid and not yet checked in | Check-in only. Refuses if not Paid; skips if already in. |
| **Resolve Review** | Payment = Review required | Authorize cash / Waive fee / Cancel, with optional note. |
| **Export as CSV** | any | Download the filtered list. |

All three custom actions write a row to the `registration_events` audit table
(event name, amount, staff user, extra details). Nova's own audit log also
records the field changes.

## Lens: Cash Reconciliation

The **Lens** dropdown on the index opens the cash report. See
[Cash Reconciliation](cash-reconciliation.md).

## Editing by hand

Admins with edit rights can change any badge or amount from **Edit**. Use this
to fix mistakes (e.g. undo an accidental check-in). Prefer the actions for
normal work so the audit trail stays complete.

## Deleting

Deleting a registration does not delete its Zeffy payment record (see
[Zeffy Payments](zeffy-payments.md)) or its audit events. Delete test rows
freely; delete real rows only if the person truly should not exist in the
system (rejected people can simply stay as Rejected).
