---
title: Email Log
path: email-log
order: 8
---

# Email Log

**Camp → Email Log** records every automated email the public site tries to
send: registration thank-yous, leader approval requests, approval/payment links,
and "we couldn't match your Zeffy payment" notices.

## Columns

| Column | Meaning |
|---|---|
| **Status** badge | **Sent** (green) or **Failed** (red). |
| **To** | Recipient address. |
| **Subject** | Email subject (Russian). |
| **Attempts** | How many times sending has been tried. |
| **Last Error** | Provider error text from the most recent failure. |
| **Created** | When the email was first queued. |

The detail view also shows the full HTML body, so you can see exactly what the
recipient received (including the code and links).

## Automatic retries

The admin server runs `emails:retry` every hour. It re-sends every row still
marked **Failed** and updates **Attempts** / **Last Error**. Most transient
failures (rate limits on the free email tier, brief outages) clear themselves
within an hour with no action needed.

## When to look here

- An attendee says they never got their code → search their email address. If
  the row is **Sent**, ask them to check spam; if **Failed**, read *Last Error*.
- A leader says they never got the approval link → same, searching the leader's
  address. Also confirm the leader's **Email** field on
  [Youth Leaders](/documentation/youth-leaders) is correct.
- A cash-eligible attendee did not see the "$0 / pay cash at the gate" note →
  open their *approved* email row and check whether the yellow box is present.
  If not, the eligibility rule was probably added after approval.

## Common errors

| Last Error contains | Meaning / fix |
|---|---|
| `Invalid to address` / `validation` | Typo in the recipient email. Fix the address on the registration or leader and resend by hand. |
| `rate limit` / `429` | Provider throttled us. Retry will succeed later. |
| `unauthorized` / `API key` | Sending credentials are broken. Escalate to the site maintainer. |

## Resending by hand

There is no "resend" button, and toggling the registration Status in the admin
does **not** trigger an email (emails are sent by the public site, not by this
panel). Instead, open the failed row, copy the code and payment link out of the
HTML body, and send them manually. (Re-opening an already-decided approval link
only shows the outcome; it does not re-send anything.)
