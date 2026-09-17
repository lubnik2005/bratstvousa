---
title: Camp Admin Guide
order: 0
---

# Camp Admin Guide

This documentation explains how to run youth camp registration and payments
from the admin panel. Everything described here lives under the **Camp**
group in the left sidebar.

## Start here

The newest features are the **cash-at-check-in** workflow. If you are
working the registration desk at camp, read these first:

1. [Cash at Check-In (staff guide)](cash-at-check-in.md) — what to do when
   an attendee arrives and owes cash, or when Zeffy shows a $0 ticket.
2. [Cash Eligibility Rules](cash-eligibility-rules.md) — which churches may
   pay cash at the door, at what price, with which Zeffy discount code.
3. [Camp Registrations](camp-registrations.md) — every field, status,
   filter and action on a registration record.
4. [Cash Reconciliation](cash-reconciliation.md) — the report that tells you
   how much cash is expected, collected, and still due.

## Everything else

5. [Registration Flow](registration-flow.md) — how a registrant gets from the
   public form to a Zeffy ticket (form → leader approval → Zeffy → webhook).
6. [Zeffy Payments](zeffy-payments.md) — the raw payment records received
   from Zeffy and how they are matched to registrations.
7. [Youth Leaders](youth-leaders.md) — the people who approve registrations.
8. [Email Log](email-log.md) — every email the system sent, and retries.
9. [Permissions](permissions.md) — which roles can see or change what.
10. [Troubleshooting](troubleshooting.md) — common problems and fixes.

## The one rule to remember

> **Zeffy decides whether a ticket exists. This admin panel decides whether
> the attendee has actually paid.**

A Zeffy QR code that scans as valid is **not** proof of payment. Always look
at the **Payment** badge on the registration in this panel before admitting
someone who is supposed to pay cash.
