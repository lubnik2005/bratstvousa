---
title: Cash at Check-In (staff guide)
path: cash-at-check-in
order: 1
---

# Cash at Check-In (staff guide)

This page is for the people working the check-in desk at camp.

## Why this exists

Some churches are allowed to pay for their youth **in cash when they arrive**
instead of paying online. Zeffy (our ticketing system) cannot do this on its
own, so we work around it:

1. The registrant fills out our registration form.
2. Their youth leader approves them by email.
3. They get a Zeffy link. If their church is cash-eligible, the email tells
   them to use the church's **100% discount code** so the Zeffy total is **$0**.
4. Zeffy still issues them a real e-ticket with a QR code.
5. Zeffy tells our system about the $0 checkout. Our system looks up the
   registration and marks it **Cash due** for the real camp price.
6. At camp, staff scan the QR with the **Zeffy app** (that proves the ticket
   exists), then look the person up **here** to see if cash is owed.
7. Staff collect the cash and press **Cash Received & Check In**.

> The Zeffy QR code only proves a ticket exists. **This panel** is the source
> of truth for whether the person has paid.

## What you need

- Login to the admin panel with a role that can **edit camp registrations**.
- The Zeffy app (or Zeffy check-in page) open for scanning.
- A phone or laptop with **Camp → Camp Registrations** open.

## At the desk: step by step

### 1. Scan the QR in the Zeffy app

This confirms the ticket is genuine. It does **not** mean they have paid.

### 2. Find the person in Camp Registrations

Use the search box at the top of **Camp → Camp Registrations**. You can search by:

- **Registration code** (`CAMP-XXXXX`) — the fastest and most reliable. It is
  printed in their confirmation email and typed into their Zeffy ticket.
- Last name, first name, email, phone, or church name.

Tip: Filter **Payment = Cash due** and **Check-in = Not checked in** to see the
list of people you are still waiting on.

### 3. Read the badges

Each registration row shows four badges:

| Badge | Meaning |
| --- | --- |
| **Status** | Approval state: Awaiting approval → Approved / Rejected. Only approved people should be at camp. |
| **Payment** | Money state — see the table below. |
| **Method** | How they paid or will pay: Online, Cash, Waived, Other. |
| **Check-in** | Not checked in / Checked in. |

The **Payment** badge decides what you do:

| Payment badge | Color | What it means | What you do |
| --- | --- | --- | --- |
| **Paid** | green | Paid in full (online, cash already collected, or fee waived) | Press **Check In** |
| **Cash due** | yellow | Church is cash-eligible; they used the $0 code; they owe the **Due** amount | Collect cash, then press **Cash Received & Check In** |
| **Review required** | red | Someone used a $0 discount code but their church is **not** cash-eligible | Do **not** admit yet. Collect payment or get a decision — see below |
| **Pending** | gray | Approved but has not completed Zeffy yet (no ticket) | They should finish Zeffy on their phone, or pay cash and use Cash Received & Check In |
| **Refunded** / **Canceled** | blue | Payment was refunded or registration canceled | Do not admit without a leader's decision |

The **Due** column shows exactly how much cash to collect.

### 4. Run the right action

Actions are run from the **⋮ / Actions** menu on a row (or select the checkbox
and use the Actions dropdown at the top of the list). Each action asks you to
confirm.

#### Cash Received & Check In

Use this **only after the cash is in your hand.**

In one step it:

- sets **Method = Cash**, **Payment = Paid**
- moves the **Due** amount into **Paid** (Due becomes $0)
- records **Paid At** and **Paid By** (your name)
- sets **Check-in = Checked in**, with **Checked In At / By**
- writes an audit record `cash_payment_collected`

It only works on rows whose Payment is **Cash due**, **Review required**, or
**Pending**. Rows that are already Paid are skipped (nothing changes), so it is
safe to re-run by mistake.

> Never press this before receiving money. Scanning the QR does **not** mark
> anyone paid — that is deliberate, so a distracted moment at the desk cannot
> turn into a missing $350.

#### Check In

Use this for people who are already **Paid** (online, cash collected earlier,
or fee waived). It only changes **Check-in** — it never touches payment.

- If the person is not **Paid**, the action refuses and tells you to use
  *Cash Received & Check In* instead.
- If the person is already checked in, the action skips them and tells you so
  (this is the "already checked in" warning — somebody else may have used
  their ticket, or they walked out and back in).

#### Resolve Review

Use this for rows with **Payment = Review required**. It asks you to choose:

| Resolution | Result |
| --- | --- |
| **Authorize cash (CASH / DUE)** | Their church *should* have been cash-eligible. Marks them Cash due so you can collect and use Cash Received & Check In. Also flips **Cash Eligible** on for this registration. |
| **Waive fee (WAIVED / PAID)** | They legitimately do not pay (staff, pastor, scholarship). Marks Paid with Method = Waived, Due = $0, and sets **Fee Waived**. |
| **Cancel registration (CANCELED)** | They should not attend. |

You can add a **Note** which is stored in the audit trail. Only people with
edit rights should run this — it is an authorization decision, not a desk
task.

## Common situations

**"Zeffy says $0 but this person's church doesn't pay cash."**
Payment badge is **Review required**. Somebody shared a discount code they
should not have. Do not admit on the QR alone. Either collect the full amount
(Cash Received & Check In works on Review required rows) or get a leader to
run Resolve Review.

**"The scan is fine but I can't find them here."**
Search by the `CAMP-` code from their ticket first, then by last name. If they
truly are not in Camp Registrations, they never completed our form — do not
create a registration at the desk. Send them to a leader.

**"They paid cash to someone else earlier."**
The row should already show **Paid / Cash** with a **Paid By** name. Just press
**Check In**. If it still says Cash due, the other person did not record it —
find out before collecting again.

**"They are Pending — no Zeffy ticket at all."**
They were approved but never finished Zeffy. They can either finish it on their
phone now (with the church discount code if cash-eligible), or you can collect
cash and use **Cash Received & Check In** directly. Pending rows are allowed.

**"I pressed Cash Received by accident."**
Open the registration, click **Edit**, set Payment back to *Cash due*, Method
blank, Check-in to *Not checked in*, and fix the Due/Paid amounts. The audit
record of the original press stays in the database; leave a note for the
treasurer.

## End of day

Open **Camp → Camp Registrations → Lens: Cash Reconciliation** to see totals
for Cash Expected, Cash Collected and Cash Still Due, and who collected what.
See [Cash Reconciliation](cash-reconciliation.md).
