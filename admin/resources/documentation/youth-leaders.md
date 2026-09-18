---
title: Youth Leaders
path: youth-leaders
order: 7
---

# Youth Leaders

**Camp → Youth Leaders** is the list of people who can approve camp
registrations. Every attendee picks one leader on the public sign-up form, and
that leader receives the approval email.

## Fields

| Field | Notes |
|---|---|
| **Name** | Shown in the public dropdown. Required. |
| **City** | Shown next to the name in the dropdown to help attendees pick the right person. |
| **Email** | Where the approval link is sent. **Never shown publicly.** |
| **Phone** | Optional, internal only. |
| **Active** | Only active leaders appear in the public dropdown. Untick instead of deleting when a leader steps down – their past registrations keep the link. |

## Adding a leader

1. **Camp → Youth Leaders → Create**.
2. Fill in Name, City, Email; tick **Active**.
3. Save. The public form picks the change up immediately (no deploy needed).

## What a leader sees

The approval email contains the attendee's full details and a one-click link to
`/camp-approval?token=…`. The page shows **Approve** and **Reject** buttons and
does not require a login. Once decided, the link only shows the outcome and cannot
be changed from that page; use **Camp Registrations → Edit** to override.

## Cash-eligible churches and leaders

Leaders are not tied to cash eligibility. Eligibility is decided by the church
picked on the form via [Cash Eligibility Rules](/documentation/cash-eligibility-rules). You
should still tell each leader of an eligible church the discount code so they
can pass it to their group.

## Related lists

- **Camp Registrations** → each row shows its **Youth Leader**; filter by leader
  by opening the leader's detail page and scrolling to *Camp Registrations*.
- **Churches** (main menu) → the master church list used by the picker and by
  eligibility rules.
