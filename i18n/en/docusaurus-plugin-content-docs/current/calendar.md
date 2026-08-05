---
sidebar_position: 6
---

# Calendar & Scheduling

#### 5.1 What the Calendar is for

**Calendar** schedules **meetings / events** between employees: view busy times, create meetings, invite participants, and receive in-app notifications when something changes.

**Not the same as:**

- Monthly attendance grid (**Attendance tracking**).
- Company holiday setup (**Holiday Configuration**).

**Event types on the schedule calendar:**

| Type | Description |
|------|-------------|
| **Meeting / event** | Title, time, location, organizer, participants |
| **Recurring series** | Working days, weekly weekdays, or selected dates |

> Legend chips (Meeting / Leave / Holiday) on the Calendar page are illustrative — the time grid shows **meetings** only; leave and holidays are in other modules.

#### 5.2 Viewing the calendar

1. **Calendar** menu → `/calendar`.
2. **Select employees** to display (default: you; multi-select and by department supported).
3. One **column per employee** — events appear on the organizer’s or participant’s column.

**Views:**

| View | Description |
|------|-------------|
| **Week** | Default — weekly grid |
| **Day** | Single day by hour |
| **Month** | **Not available** in the current version |

**Navigation:**

| Control | Action |
|---------|--------|
| **Previous / Next** | Previous or next week/day |
| **Today** | Jump to today |
| **DatePicker** | Jump to any date |

**Colors:**

- Each **employee column** has its own color.
- **Event border** uses the **organizer’s** color.

#### 5.3 Create a meeting

**Method 1 — Click an empty slot**

1. Only on **your own column** (cannot create on someone else’s column).
2. Click a time range → the form opens with date/time prefilled.

**Form steps:**

1. **Title** — required.
2. **Participants** — you must be included; add colleagues by name (all active employees).
3. **Date**, **Start time**, **End time** — end must be after start.
4. **Location** — optional.
5. **Recurrence** — optional ([Section 5.4](#)).
6. Click **Save**.

**Organizer:** Always **you** — you cannot assign another organizer on the form.

**Expected outcome:** The meeting appears on the calendar; invitees get an **in-app notification** (bell icon).

#### 5.4 Recurring events

Enable **Recurrence** when creating (editing recurrence rules on the form is not supported — edit or delete occurrences afterward).

| Mode | Meaning |
|------|---------|
| **Working days** | Repeat on working days, excluding company holidays from holiday config |
| **Weekly weekdays** | Selected weekdays (Mon–Sun) each week |
| **Selected dates** | Pick specific dates |

The system generates occurrences for about **12 weeks** from the viewed week (may extend if the series has no end date).

#### 5.5 Calendar permissions

Principle: **creator manages**; **invitees can leave**; users with **`CALENDAR_VIEW`** (default for `EMPLOYEE` after seed/migrate) may **view** others’ calendars to plan meetings. The **Calendar** menu (`/calendar`) requires `CALENDAR_VIEW`.

##### Organizer

| Action | Allowed? | Why |
|--------|:--------:|-----|
| View own events | Yes | Owner needs full details |
| Edit title, time, location, participants | Yes | Only the owner should change the meeting |
| Drag-resize on grid | Yes (own column) | Quick adjustments |
| Delete one occurrence or whole series | Yes | Cancel meetings you own |
| **Leave meeting** | **No** | Cancel by **deleting** the event instead |

##### Participant

| Action | Allowed? | Why |
|--------|:--------:|-----|
| View details | Yes | Need time and location |
| Edit / delete event | **No** | Protects others’ schedules |
| **Leave meeting** | Yes | Decline without deleting the event — **reason required** (sent to organizer) |
| Add more invitees | **No** | Organizer manages the list |
| Outlook-style Accept/Decline | **No** | Use **Leave meeting** + notifications |

##### Admin / HR

| Action | Allowed? | Notes |
|--------|:--------:|-------|
| View anyone’s calendar | Yes | Same as any authenticated user |
| Edit/delete others’ meetings | **Yes** (needs `CALENDAR_EDIT_ANY`) | Granted to `ADMIN` by default; assign via **Roles & permissions** for other roles |
| “View all employees” on calendar | Yes (optional) | Requires `CALENDAR_MANAGE` — switch on **Calendar** page |

> **Summary:** Users with `CALENDAR_EDIT_ANY` (typically Admin) can edit/delete others’ meetings for operational support. Regular users may only modify events they organize.

#### 5.6 Notifications and reminders

| Trigger | Who is notified |
|---------|-----------------|
| Invited to a new meeting | Participants (not organizer) |
| Removed from participants | Removed person |
| Participant **leaves** | Organizer |
| Organizer **deletes** one occurrence | Remaining participants |
| Organizer **deletes** entire series | Remaining participants |

**Delivery:** **Bell** icon on the top bar; **Web Push** if IT configured VAPID on the server.

**Reminders before meeting time:** **Yes** — scheduler sends a notification **~15 minutes** before start (cron every 5 minutes, timezone `Asia/Ho_Chi_Minh`). Recipients: organizer and participants. Displayed time matches the calendar grid (see §5.8).

#### 5.7 Quick actions

| Action | How |
|--------|-----|
| View details | Click an event on the grid |
| Edit | Details → **Edit** (organizer, or user with `CALENDAR_EDIT_ANY`) |
| Delete | Details → **Delete** → **single** or **entire series** |
| Leave | Details → **Leave meeting** → enter reason → confirm |

#### 5.8 Calendar timezone and displayed time

| Topic | Convention |
|-------|--------------|
| Business timezone | **`Asia/Ho_Chi_Minh`** (UTC+7) |
| API/DB storage | **Vietnam wall-clock in UTC slot** — e.g. 09:00 VN meeting → `startAt`: `…T09:00:00.000Z` |
| Grid & dialog (web) | Read **UTC components** of `startAt`/`endAt` as display time |
| Notifications / reminders (BE) | Same contract — `formatVietnamStorageDateTime` (`src/shared/vietnam-storage.util.ts`) |
| Reminder fire time | Convert to real VN instant (`vietnamStorageDateToInstant`) then compare to 15-minute window |

**Expected result:** Grid, detail dialog, and reminder notification times **match**; no extra +7h offset when displaying.

---
