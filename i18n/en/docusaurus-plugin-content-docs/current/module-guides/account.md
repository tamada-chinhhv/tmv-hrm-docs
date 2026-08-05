---
sidebar_position: 8
---

# Account (`/account`)

Available to every logged-in user (sidebar **Account** or user menu).

| Tab | Content |
|-----|---------|
| **Information** | My profile — edit name, email, phone, … (cannot change username, department, or role) |
| **Settings** | Appearance: **Light/Dark** (saved immediately), primary color, font (click **Save** to sync to server) |
| **Documents** | Self-manage own employee documents (requires `DOCUMENT_VIEW`) — see [Section 7.2.1](/docs/module-guides/documents) |

- Settings tab URL: `/account?tab=settings`
- Documents tab URL: `/account?tab=documents`
- The header light/dark toggle also saves personal preferences (marks appearance as customized)
- Until the user saves, the app uses **system appearance**; after Save or toggling theme, personal settings take priority
- Users **without** `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` who open **Employees** are redirected to **Account** (no legacy My Profile tab)
