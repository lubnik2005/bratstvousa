---
title: Troubleshooting
path: troubleshooting
order: 10
---

# Troubleshooting

Quick answers for the questions that come up at the desk and the day after.

## At the check-in desk

**The Zeffy app scanned fine but I can't find the person here.**
Search **Camp Registrations** by last name or email, not just the code. If they
truly are not there, they paid on Zeffy without registering on our site first.
Look them up in **Zeffy Payments** (it will be *Unmatched*). Create a registration
for them by hand, link it by pasting the Zeffy Payment Id, set Payment to *Paid*
if the amount was > $0, and check them in.

**Payment badge says "Review required".**
Usually they used a 100% discount code but their church is not cash-eligible. Do not
admit for free. Either collect cash and run **Cash Received & Check In**, or run
**Resolve Review** and pick *Waive* if an organiser confirms they should be free.
See [Cash at Check-In](/documentation/cash-at-check-in).

It can also mean the payment came from the **wrong Zeffy form** (a different
campaign than the one on the event's [eligibility rules](/documentation/cash-eligibility-rules)).
Open the linked **Zeffy Payment** and check its Amount: if they really paid the
full price on the other form, Edit the registration to Method = Online, Payment =
Paid, Paid = amount, Due = 0, then **Check In**. If it was $0, treat it as a
leaked code.

**Payment badge says "Pending".**
The attendee never completed Zeffy checkout (no ticket exists). If they are
cash-eligible and standing in front of you with cash, **Cash Received & Check In**
still works on *Pending* rows. If they should have paid online, send them to the
Zeffy link on their phone or collect cash and record it the same way.

**"Check In" refuses to run.**
It only works when Payment is *Paid*. Use **Cash Received & Check In** for
*Cash due* / *Review required* / *Pending* rows.

**I pressed "Cash Received & Check In" by mistake.**
There is no undo button. Open **Edit** on the registration and set Payment back
to *Cash due*, Method *Cash*, Due = Event Price, Paid = $0, Check-in *Not checked
in*, and clear Paid At / Paid By / Checked In At / Checked In By. The mistaken
action still shows in the audit trail, which is intended.

**Person is already checked in.**
The action skips them and tells you so. Look at **Checked In At / By** on the
detail page to see who let them in. Duplicate ticket use should be escalated.

## Before the event

**A church should be cash-eligible but registrants show "Cash Eligible: No".**
The [Cash Eligibility Rule](/documentation/cash-eligibility-rules) was missing, inactive,
had the wrong **Event Slug**, or pointed at a different church record than the one
attendees picked. Fix the rule for future sign-ups, then for existing rows either
tick **Cash Eligible** on Edit (before they hit Zeffy) or use **Resolve Review →
Authorize cash** (after a $0 checkout).

**Registrant says the Zeffy link asks for a code they don't have.**
The code is on their thank-you and approval emails and on the registration's
**Code** field. Read it to them; it is not secret.

**Leader never got the approval email.**
Check [Email Log](/documentation/email-log) for the leader's address, and confirm the
**Email** on [Youth Leaders](/documentation/youth-leaders) is correct.

**Two registrations for the same person.**
The form blocks duplicate email per event unless the first was *Rejected*, so
this usually means different emails. Delete the extra one **before** any Zeffy
payment links to it; if both are linked, keep the one with the payment.

## Money doesn't add up

**Cash Collected is lower than the cash in the box.**
Someone collected cash without running the action (or edited Payment to *Paid*
by hand without setting Method to *Cash*). Filter Camp Registrations by
Payment = *Paid*, Method = *(empty)* or *Other*, and fix Method.

**Cash Still Due is not zero after the event.**
Those people either didn't show up or were let in without paying. Filter the
[Cash Reconciliation](/documentation/cash-reconciliation) lens by Check-in = *Checked in* to
find the second group.

**A Zeffy payment shows "Duplicate".**
The same `CAMP-` code was used for a second Zeffy checkout. The first payment
won and the registration is untouched; the second one is only recorded as
*Duplicate*. Two common causes:

- **The same person paid twice / got two tickets.** Both the buyer and
  `youth@bratstvousa.com` are emailed automatically. Open the registration
  (Camp Registrations → the person → *Zeffy Payments* at the bottom, or filter
  the list by *Duplicate payment = Has duplicate*) to see both payments. Refund
  the **duplicate** in Zeffy — that is safe: the registration stays *Paid*.
  Only refunding the **original** payment (the one shown in *Zeffy Payment* on
  the registration) flips the registration to *Refunded*. If the duplicate was a
  $0 cash-code ticket there is nothing to refund; just ignore the extra ticket.
  At the gate both QR codes resolve to the same registration, so the second
  scan simply shows *already checked in*.
- **Two different people used one code.** The second attendee needs their own
  registration. Find them by buyer name in Zeffy Payments (filter *Duplicate*).

## Technical

**"Server error" on any Camp page.**
Report it to the site maintainer with the page URL and time. Server logs are on
the admin host (`docker compose -f docker-compose.prod.yml logs app`).

**A registration changed on the public site but not here (or vice versa).**
Both read the same database; refresh the page. If it persists, the hourly
`zeffy:sync` job will reconcile payments within the hour.

**The Zeffy webhook seems dead (payments not updating).**
Payments still land within an hour via `zeffy:sync`. Check the **Received** time
on the newest Zeffy Payment row; if it is well over an hour old while people are
paying, escalate.
