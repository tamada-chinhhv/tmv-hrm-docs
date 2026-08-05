---
sidebar_position: 13
---

# FAQ

#### 12.1 Accounts

**I forgot my password.**

There is no self-service forgot-password on the login page. Contact **HR or IT** for **Reset password** on your profile. After reset, the password equals your **username** again — then [change it](#).

**My account is locked — who do I contact?**

There is no dedicated “account lock” feature. If login fails: verify **username** (not email/EMP code), ask HR to reset password, then contact IT. Placeholders: HR _[email/phone]_, IT _[email/phone]_.

**Can I change my username?**

**No** — usernames are permanent after employee creation.

#### 12.2 Employees

**No welcome email after creating an employee.**

Correct — the system does **not** send email. HR must share credentials manually.

**Does deleting an employee remove all data?**

**Yes** — hard delete from the database. Prefer **TERMINATED** / **INACTIVE** status.

**Offboarding.**

1. Set employment status to **TERMINATED** or **INACTIVE**.  
2. Revoke sensitive permissions / change role.  
3. Avoid deleting the record unless policy requires it.

#### 12.2b Attendance and leave

**I checked in at 08:15 but am still marked “Late / Early”. Why?**

The system assigns **LATE_EARLY** when attendance is late/early against the **work shift** (including grace) **or** total credited work time is below the work unit (`workUnitLabel`, for example 8 hours after lunch). For an 08:00–17:00 shift with a 60-minute lunch, 08:15–16:45 is 8.5 hours elapsed but still **LATE_EARLY** because the arrival/departure thresholds are violated. See [Section 8.1](/docs/attendance).

**Is there a morning/afternoon shift menu?**

**No.** HRM has only the default system-wide work-shift configuration, not per-employee or rotating shift schedules. See [Section 8.7](#).

**I am a Manager. Why can’t I approve a team member’s request?**

You may approve only if the request selected **you** as its **Approver**. Approval is not automatically granted for every member of your team; see [Section 9.5](#).

#### 12.3 Calendar

**Participants do not see my meeting.**

Check: they are in the participant list; correct **column** and **week/day**; they did not **leave** the meeting. They should also see a **bell** notification when invited.

**Are participants notified when I delete a meeting?**

**Yes** — for single occurrence or full series.

**How do I decline an invitation?**

**Calendar** → open meeting → **Leave meeting** → enter **reason** → confirm.

#### 12.4 Common errors

| Error | Cause | Resolution |
|-------|-------|------------|
| **Username already exists** | No free suffixed username left | Change the base username or contact IT; see [Section 3.2](#). |
| **Insufficient permissions** | Account lacks the required permission | See [Section 6](/docs/roles-permissions) and contact an Admin. |
| **Invalid username or password** | Incorrect credentials | Check Caps Lock and ask HR to reset the password if necessary. |
| **Page will not load** | Network, server, or incorrect URL | Check the network, try `https://hrm.tamada.vn/login`, clear cache, then contact IT. |
| **Only the event organizer can modify** | Attempting to edit another user’s event | Ask the **organizer** to edit it, or **leave** the meeting. |
| **Insufficient remaining leave days** | Approving `PAID_LEAVE` exceeds balance | Reject it, or have HR update **Remaining leave days** on the employee profile. |
| **LEAVE_APPROVE_BLOCKED_BY_OVERLAP** | An **APPROVED** request overlaps the same period | Delete or adjust the older approved request first (`LEAVE_DELETE_APPROVED`), then approve the new one. |
| **LEAVE_DELETE_BLOCKED_BY_OVERLAP** | Another **APPROVED** request still overlaps | Delete the other approved overlapping request first, or adjust the date range. |
| **LEAVE_DELETE_NOT_ALLOWED** | User is not admin, assigned approver, managed-subtree manager, and lacks `LEAVE_DELETE_APPROVED` | Only an authorized user may delete from Leave request approvals. |
| **GEO_LOCATION_OR_WIFI_REQUIRED** | Branch requires verification but the client sent neither GPS nor WiFi | Web: allow Location. Mobile: send `wifi.bssid` or enable GPS. |
| **OUTSIDE_OFFICE_AREA** | GPS is outside the radius or BSSID does not match | Move within branch range, connect to company WiFi, or use approved **REMOTE_WORK**. |

#### 12.5 Support contacts

| Type | Contact (fill in by your company) |
|------|-----------------------------------|
| HR (records, leave) | _[HR email / phone]_ |
| IT (login, system errors) | _[IT email / phone]_ |
| Software issues | [GitHub issue](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new) |

---
