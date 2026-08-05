---
sidebar_position: 11
---

# Documents (`/org/documents`)

Manage **employee** and **company** documents (PDF): with an expiry date (and automatic reminders) or **no expiry**.

| Permission | Capabilities |
|------------|--------------|
| `DOCUMENT_VIEW` | View and create/edit/delete own employee documents (`/account?tab=documents`); HR can view all |
| `DOCUMENT_MANAGE` | Full org create/edit/delete (any document), upload PDF, configure notification rules |

**Add document (HR):**

1. Menu **Organization** → **Documents** → **Add document**.
2. Choose owner type: **Employee** or **Company** (Company → do not select an employee).
3. Upload PDF — the system tries to read the **expiry date** and (for Employee) match **full name + date of birth** to the profile.
4. With expiry: review/edit the date; choose remind-before **1 / 3 / 7 / 30** days (default 30). **No expiry date:** check the box → no expiry field, no reminders.
5. **Add** to save.

**Employee self-service:** tab **Account → Documents** — create/edit/delete **own** employee documents (not company docs; notification rule uses the default).

**Recipients:** **Settings** → **Document notifications** (`/settings/document-notifications`) — select the applicable departments and notification recipients. The document owner can still receive notifications when the corresponding option is enabled.

**Reminders:** Cron at 07:00 weekdays (VN time) sends reminders on the selected day; expired documents remind daily until updated/deleted. Documents with **no expiry** are skipped by the reminder cron.
