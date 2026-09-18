---
title: Registration Flow (End to End)
path: registration-flow
order: 5
---

# Registration Flow (End to End)

This page follows one attendee from the public sign-up form to the camp gate, and
shows what changes in the admin panel at each step.

## 1. Attendee fills the public form

URL pattern: `https://www.bratstvousa.com/youth-ministry/<event-slug>/registration`

The form collects: first name, last name, email, phone, church (searchable picker
or free text), youth leader, and two mandatory acknowledgements (external consent
form + camp rules). It is protected by Cloudflare Turnstile and a hidden honeypot.

What the server does on submit:

1. Rejects duplicate sign-ups for the same event + email unless the earlier one
   was **Rejected**.
2. Looks up an active **Cash Eligibility Rule** for the picked church + event.
   If found: `Cash Eligible = Yes` and the rule's amount becomes the **Event Price**.
   Otherwise: `Cash Eligible = No` and the default camp price is used.
3. Generates the confirmation **Code** (`CAMP-XXXXX`) and a private approval token.
4. Creates the **Camp Registration** with:
   - Status `Awaiting approval`
   - Payment `Pending`, Method empty
   - Event Price / Due = price, Paid = $0
   - Check-in `Not checked in`
5. Emails the attendee a thank-you with their code, and emails the chosen
   **Youth Leader** an approval link.

Admin view at this point: row appears in **Camp Registrations** with a gray
*Awaiting approval* badge and a gray *Pending* payment badge.

## 2. Youth leader approves

The leader opens the emailed link (`/camp-approval?token=...`) and clicks
**Approve** or **Reject**. No login is needed; the token is the credential.

- **Approve** sets Status `Approved`, fills **Approved By / Approved At**, and
  emails the attendee the Zeffy payment link with their code pre-filled.
  If the attendee is cash-eligible, the email includes a yellow note explaining
  that the Zeffy total will be $0 and payment is due in cash at the gate.
- **Reject** sets Status `Rejected`. No email is sent. The attendee may register
  again.

Admins can also change Status by hand on the registration's **Edit** form.

## 3. Attendee completes Zeffy checkout

The attendee opens Zeffy, picks a ticket, and enters their `CAMP-XXXXX` code in
the required *Registration Code* question (it is pre-filled from the link when
Zeffy allows it). Cash-eligible attendees also enter their church's discount
code so the total becomes $0.

Zeffy issues the e-ticket / QR code and fires a webhook to our site.

## 4. Webhook updates the registration

The site verifies the webhook signature, records it once (duplicates are
ignored), finds the registration by code (falling back to buyer email), and
applies the decision table:

| Zeffy amount | Cash Eligible | Result |
|---|---|---|
| > $0 | any | Method **Online**, Payment **Paid**, Paid = amount, Due = $0 |
| $0 | Yes | Method **Cash**, Payment **Cash due**, Due = Event Price |
| $0 | No | Method empty, Payment **Review required**, Due = Event Price |
| refunded / disputed / deleted | any | Payment **Refunded**, Paid = $0 |

It also stores the Zeffy payment, ticket, contact and campaign IDs and the
discount code on the registration, and creates a matching **Zeffy Payment**
row. If the code is already linked to a different Zeffy payment, the new one is
recorded as **Duplicate** and the registration is left untouched.

Safety net: the admin server runs `zeffy:sync` every hour and applies the same
rules to any payment the webhook missed.

## 5. At the gate

Staff scan the QR code in the Zeffy app (that confirms the ticket is real), then
look the attendee up here by code or name and act on the **Payment** badge.
See [Cash at Check-In](/documentation/cash-at-check-in) for the desk procedure.

## 6. After the event

Use the [Cash Reconciliation](/documentation/cash-reconciliation) lens to compare cash
expected vs collected, and **Export as CSV** on Camp Registrations for the full
attendee list.

## Where each piece of data lives

| Data | Where |
|---|---|
| Registrations, payments, leaders, rules, email log | Shared Cloudflare D1 database (also used by the public site) |
| Admin users, roles, permissions, audit history | Local admin database |
| Tickets, QR codes, card payments | Zeffy |

The public site and this panel read and write the same registration rows, so
changes made here are visible to the webhook and hourly sync immediately.
