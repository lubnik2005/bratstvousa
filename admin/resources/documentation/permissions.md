---
title: Permissions & Roles
path: permissions
order: 9
---

# Permissions & Roles

Access to this panel is controlled by **roles**. A user can log in only if they
have at least one role; what they can see and do inside is decided by the
permissions attached to that role.

Manage both under **Other → Roles** and **Other → Users** in the sidebar.

## How permissions are named

Every resource has four permissions, named `<action> <table>`:

| Action | Allows |
|---|---|
| `view` | See the resource in the sidebar, open the index and detail pages, run read-only lenses, export CSV. |
| `create` | Use the **Create** button. |
| `edit` | Use **Edit** and run **actions** (Cash Received & Check In, Check In, Resolve Review). |
| `delete` | Delete rows. |

The camp-related permission groups are:

| Group | Table | Notes |
|---|---|---|
| Camp Registrations | `camp_registrations` | Needed by anyone working the check-in desk (view + edit). |
| Cash Eligibility Rules | `cash_eligibility_rules` | Who may decide which churches pay cash. Keep this to organisers. |
| Zeffy Payments | `zeffy_payments` | Read-only ledger; `create` is never used. |
| Youth Leaders | `youth_leaders` | Add / deactivate approvers. |
| Email Log | `email_log` | Read-only in practice. |
| Churches | `churches` | Master list used by the church picker and eligibility rules. |
| Form Submissions | `form_submissions` | Older event forms (pre-2026). |

## Suggested roles

| Role | Permissions |
|---|---|
| **Check-in staff** | `view camp_registrations`, `edit camp_registrations` |
| **Camp organiser** | All four on `camp_registrations`, `cash_eligibility_rules`, `youth_leaders`; `view zeffy_payments`, `view email_log`, `view churches` |
| **Treasurer** | `view camp_registrations`, `view zeffy_payments` (reconciliation lens + CSV) |
| **Super admin** | Everything |

Check-in staff need **edit** because the Nova actions are gated by the resource's
update permission. They do not need `delete`.

## Adding a new admin user

1. **Other → Users → Create**: name, email, temporary password.
2. **Other → Roles**: open the role, tick the user under *Users* (or open the
   user and attach the role).
3. Ask them to log in and change their password via **Forgot password** on the
   login page if you prefer not to share one.

## After a deploy that adds new permissions

New permissions (for example `cash_eligibility_rules`, added with the cash
workflow) are **not** granted to existing roles automatically. Open each role
under **Other → Roles → Edit** and tick the new boxes, otherwise the resource
stays hidden for that role.

## Audit trail

- Every save made through the panel is recorded by the auditing package and is
  visible under **Audit Log** (who, when, old → new values).
- Cash and check-in actions additionally write to the `registration_events`
  table with the acting user's name and ID (`paid_by`, `checked_in_by` on the
  registration, plus an event row). See [Cash Reconciliation](cash-reconciliation.md).
