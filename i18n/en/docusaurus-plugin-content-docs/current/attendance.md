---
sidebar_position: 9
---

# Attendance

#### 8.1 How it works

| Topic | Answer |
|-------|--------|
| Methods | **Web** — Check in/out + **GPS**. **Mobile API** — GPS and/or **WiFi** (`wifi.bssid`). **No** hardware time clocks. |
| Geofence | Pass if GPS inside any active branch radius **OR** client BSSID matches any **active** configured WiFi network |
| Geofence skipped | Approved **REMOTE_WORK** that day; or no active branch has GPS **and** no active WiFi networks configured |
| Web limitation | Web sends GPS only; **WiFi-only** branches block web check-in until mobile sends `wifi` or GPS is enabled |
| Time unit | Minutes stored (`checkOut − checkIn`); **WORK** / **LATE_EARLY** from **work shift** (grace, lunch break, `expectedWorkingMinutes` / `workUnitLabel`) — not a fixed 9h rule |
| Late / early leave | Approved **`LATE_ARRIVAL`** / **`EARLY_DEPARTURE`** adjust evaluation thresholds and **credited minutes** (actual punch + leave-covered minutes, minus lunch overlap). Approve **does not** overwrite punch times — employees still check in/out normally |
| Re-punch | Second check-in/out when time already stored returns existing record (idempotent). WiFi punch does not require GPS |
| Post-deploy | Run `yarn recompute-attendance` in `tmv-hrm-be` to align stored `attendance.status` with new rules (`:dry-run` to preview) |
| Timezone | **`Asia/Ho_Chi_Minh`** |
| Who appears in Attendance tracking? | Employees who require attendance — role `ADMIN` and employees with **Exempt from attendance tracking** are excluded |
| Work shifts | **System default** at `/sysConfig/settings` — no per-employee roster; see [8.7](#) |

:::info
**LATE_EARLY** is evaluated from the configured **work shift** (start/end, grace minutes, lunch break) and **expected working minutes** (`workUnitLabel`), not a fixed 9h/540-minute rule. With approved **late/early leave**, thresholds use the **approved** arrival/departure time; **credited minutes** = actual work + leave-covered minutes (no double-count at lunch). Example: shift 08:00–17:00, 60m lunch, approved late until 09:30, punch 09:30–17:00 → **WORK** (7.5h + 1.5h credited). Punch 10:00–17:00 → **LATE_EARLY** (30m late vs approval, not vs shift+grace).
:::

##### Attendance methods and geofence rules

| Method | Available in HRM? | Details |
|--------|:-----------------:|---------|
| **Web self-attendance** | **Yes** | Check in / Check out on `/time/attendance`; client sends GPS `location` (latitude/longitude). |
| **Mobile attendance + WiFi** | **API available** / app integration dependent | `POST /attendance/check-in|check-out` accepts `wifi: { ssid, bssid }`; matching uses BSSID. The current Flutter app does not send `wifi`. |
| **Physical clock device** | **No** | No fingerprint, card, ZKTeco, or other hardware integration exists in the codebase. |

| Geofence rule | Details |
|---------------|---------|
| Pass | GPS is inside **any** active branch radius **OR** the client BSSID matches **any** active configured WiFi network. |
| Skip | An approved **`REMOTE_WORK`** request exists for that date. |
| No verification | No active branch has GPS and no active WiFi is configured; attendance is still allowed. |
| Web limitation | Web sends GPS only; a **WiFi-only** branch blocks web attendance until mobile sends `wifi` or GPS is enabled. |
| Mobile | Sends `wifi.bssid` (required for matching) together with `ssid`. |

##### Work units and examples

| Unit | Used for | Rule |
|------|----------|------|
| **Minutes** | Database storage and status calculation | `checkOutTime − checkInTime`. |
| **Work unit from shift** | WORK / LATE_EARLY classification | `expectedMinutes = (end − start) − lunchBreak`; enough minutes and no late/early violation gives **WORK**. |
| **Days** | Dashboard leave aggregation | `expectedWorkingMinutes / 60` hours per day. |
| **Shift settings** | System configuration | `work_shift_start_time`, `work_shift_end_time`, `grace_minutes`, `work_shift_lunch_break_minutes`. |

| Check-in | Check-out | Total minutes | Status | Day-mode grid |
|----------|-----------|---------------|--------|---------------|
| 08:00 | 17:00 | 540 | **WORK** | `1` (green) |
| 08:15 | 17:15 | 540 | **WORK** | `1` |
| 08:00 | 16:30 | 510 | **LATE_EARLY** | `1` (yellow) |
| 09:00 | 17:00 | 480 | **LATE_EARLY** | `1` (yellow) |
| 08:00 | *(no check-out)* | — | **FORGOT_CLOCK_IN** or **WORK**, depending on the case | `F` or check-in only |
| *(no punch)* | *(no punch)* | — | Team grid: **ABSENT** (`A`); past personal calendar: **FORGOT_CLOCK_IN** (`F`) | `A` / `F` |

##### Approved late-arrival and early-departure requests

| Rule | Details |
|------|---------|
| Actual punches | Employees still check in/out normally. Approval never fills or overwrites punch times. |
| Late threshold | Compared with the approved arrival time, not `startTime + grace`. |
| Early threshold | Compared with the approved departure time, not `endTime − grace`. |
| Credited minutes | Actual worked minutes plus leave-covered minutes, excluding lunch overlap and double counting. |
| WORK | No violation against adjusted thresholds and credited minutes meet `expectedWorkingMinutes`. |

For a shift of 08:00–17:00 with 60-minute lunch and an 8-hour work unit: approved late arrival until **09:30** plus attendance 09:30–17:00 is **WORK** (7.5 worked + 1.5 credited hours). Attendance 10:00–17:00 remains **LATE_EARLY** because it is 30 minutes later than approved. An approved late arrival does not excuse a separate early departure.

**Re-punch:** A second Check in/out after the time is stored returns the existing record (idempotent). WiFi attendance does not require GPS.

**Post-deployment:** Run `yarn recompute-attendance` in `tmv-hrm-be` (or `:dry-run` to preview) to synchronize stored `attendance.status` values.

| Time topic | Value |
|------------|-------|
| Business timezone | **`Asia/Ho_Chi_Minh`** (UTC+7) |
| Attendance “today” | Vietnam date |
| Displayed check-in/out | Vietnam time, stored with the UTC-slot convention |

#### 8.2 Self check-in

1. **Attendance** (`/time/attendance`) — current month only shows Check in/out buttons.
2. Confirm → allow **Location** → GPS must be inside a configured branch radius (unless approved **REMOTE_WORK** that day). WiFi check-in is for mobile clients sending `wifi.bssid`.
3. Check out after check-in; buttons hide when done.

**Days with approved late/early leave:** Still punch **actual** times; approval **recomputes status only** — it does **not** preset check-in/out.

**Forgot punch:** status **FORGOT_CLOCK_IN** / grid **F** or **A**; fix via second punch, leave types (**LATE_ARRIVAL**, **EARLY_DEPARTURE**, **ATTENDANCE_CORRECTION**), or **manual time** (`ATTENDANCE_MANUAL_UPDATE`).

**No** server-side check-in time window (e.g. 30 minutes after shift start).

**Detailed steps:**

1. Open **Time & Attendance** → **Attendance** (`/time/attendance`), or use the quick action in **Overview**.
2. Select the **current month**; attendance buttons are hidden for other months.
3. Click **Check in**, confirm, and allow browser **Location**.
4. On success, a green message appears and today’s cell shows the check-in time.
5. After Check in, click **Check out** and repeat confirmation/location verification. The button disappears after completion.

**Geofence exceptions:** approved **`REMOTE_WORK`** bypasses GPS/WiFi; if no branch GPS or active WiFi has been configured, geofence is skipped. Common errors are `GEO_LOCATION_OR_WIFI_REQUIRED` (neither GPS nor WiFi) and `OUTSIDE_OFFICE_AREA` (GPS/BSSID does not match).

| Forgotten-punch situation | System record | Resolution |
|---------------------------|---------------|------------|
| Check-in only | **FORGOT_CLOCK_IN**, or WORK if only check-out is missing depending on the case | Complete check-out that day; use **EARLY_DEPARTURE** / **ATTENDANCE_CORRECTION**; or ask HR for manual time. |
| Check-out only | **FORGOT_CLOCK_IN** | Add check-in; use **LATE_ARRIVAL** / **ATTENDANCE_CORRECTION**; or use manual time. |
| No punches on a past working day | Team grid `A`; personal calendar `F` | Submit leave, request correction, or follow the company make-up-punch procedure. |

#### 8.3 Viewing data

| Role | Where | Scope |
|------|-------|-------|
| Employee | `/time/attendance` | Own month calendar |
| Manager | `/time/attendance-tracking` | Report subtree (`EMPLOYEE_VIEW` / `ATTENDANCE_VIEW_MANAGED_SUBTREE`) or direct reports (`ATTENDANCE_VIEW_MANAGED`) |
| Admin | Same | All employees **who require attendance** (role `ADMIN` and **Exempt from attendance tracking** excluded) |

Grid symbols: `1`/`8h` worked, `W` weekend, `H` holiday, leave codes, `F` forgot punch, `A` absent (team view), `-` future.

**Employee detail:** On `/time/attendance`, clicking a date opens check-in/out, location if present, leave/holiday suggestions, and a time-edit form if permitted.

**Manager flow:** Open **Attendance tracking** (`/attendance-tracking`), requiring `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE`. Scope: full company (`EMPLOYEE_VIEW_ALL`/admin), managed subtree (`EMPLOYEE_VIEW` or `ATTENDANCE_VIEW_MANAGED_SUBTREE`), or direct reports only (`ATTENDANCE_VIEW_MANAGED`). Filter by name (server-side), month, and one or more departments, then open `/attendance-tracking/{id}` for individual detail. The grid is **paginated** (50 employees per page); pagination appears when the filtered total exceeds the page size.

| Symbol | Day mode | Hour mode | Meaning |
|--------|----------|-----------|---------|
| `1` | Worked | `{workUnitLabel}`, for example `8h` | WORK or LATE_EARLY with attendance |
| *(yellow)* | `1` | `{workUnitLabel}` | **LATE_EARLY**: late, early, or short |
| `W` / `H` | Weekend / holiday | — | Fixed off day / configured holiday |
| `PL`, `SL`, `UL`, … | Leave code | — | Approved leave type (first two code letters) |
| `F` / `A` / `-` | Forgot / absent / future | — | Missing punch / past absence / future date |

Classification uses Holiday Configuration first, then approved leave (except REMOTE_WORK and ATTENDANCE_CORRECTION on the grid), then attendance evaluated against shift/grace and approved late/early requests. With no record on a past date, it is ABSENT in team views or FORGOT_CLOCK_IN in some personal views.

#### 8.4 Edits & export

- **Manual time:** `ATTENDANCE_MANUAL_UPDATE` — self, Admin, or manager subtree. **No** approval workflow or audit log. **No** block when a leave request exists on that day. Admin UI: any day **≤ today**; optional coordinates; hints on paid-leave / late-early days. **Delete day:** hard-delete punch for `(employeeId, date)` from the day detail dialog (confirm required).
- **Bulk manual time (Attendance tracking):** **Employees to apply** (`employeeIds` — inclusion list); default all selected; applies only to selected employees; select-all in the dropdown; chip collapse (`limitTags`); unknown IDs ignored.
- **Leave approval:** `LATE_ARRIVAL` / `EARLY_DEPARTURE` → recompute **status** only (punch times unchanged). `ATTENDANCE_CORRECTION` / `REMOTE_WORK` → attendance effects per type.
- **Export:** Excel `.xlsx` only from Attendance tracking — no CSV/PDF.

**Manual-time API:** `PATCH /attendance/manual-time`; it requires `ATTENDANCE_MANUAL_UPDATE`. On employee detail (`/attendance-tracking/{id}`) or the personal calendar, click a date **on or before today**, enter **Check-in / Check-out** (coordinates optional), and save. Admins may edit actual punches even when paid leave or late/early requests exist.

| Method | Approval? | Effect |
|--------|:---------:|--------|
| **Manual time** | **No** system approval flow | Writes directly; no editor/reason audit history and no block when a leave request exists. |
| **`LATE_ARRIVAL` / `EARLY_DEPARTURE`** | **Yes**, one approver | Recalculates status only; punch times remain unchanged. |
| **`ATTENDANCE_CORRECTION` / `REMOTE_WORK`** | **Yes** | Updates attendance times or skips geofence according to type. |
| Standard leave | Leave approval | Does not automatically edit punch times. |

:::warning
There is no attendance audit-history table. New manual values overwrite existing values; retain sensitive-change evidence outside HRM.
:::

#### 8.5 Filtering and exporting data

| Feature | Available? | Details |
|---------|:----------:|---------|
| Filter by **month** | Yes | Month selector on Attendance and Attendance tracking. |
| Filter by employee **name** | Yes | Attendance tracking — server-side search (paginated list). |
| Filter by **department** | Yes | Multiple departments can be selected. |
| **Pagination** | Yes | Attendance tracking grid: 50 employees per page when filtered total exceeds page size. |
| Separate weekly filter | No | Attendance is filtered by month only. |
| Export **Excel** (`.xlsx`) | Yes | Attendance tracking: `GET /attendance/export-workingtime-detail`; requires `ATTENDANCE_EXPORT` **or** `ATTENDANCE_EXPORT_MANAGED` **or** `ATTENDANCE_EXPORT_MANAGED_SUBTREE` (scope matches permission). |
| Export **CSV / PDF** | **No** | — |

The Excel file includes employee code, name, each day’s working minutes, absence/late/early codes, remaining leave days, and other attendance data. Export scope matches the grid: Admin can export the company; Managers can export their reporting subtree.

#### 8.6 Permission matrix

| Action | Employee | Manager | HR/Admin |
|--------|:--------:|:-------:|:--------:|
| Check in/out | Yes* | Yes* | Yes* |
| Own calendar | Yes* | Yes* | Yes* |
| Tracking grid | No | Yes** | Yes |
| Employee detail in team | No | Yes** | Yes |
| Excel export | No | Yes** | Yes |
| Manual time | No*** | Yes**** | Yes***** |
| Configure office location | No | No | Yes (`LOCATION_VIEW`) |
| Configure holidays | No | No | Yes (`HOLIDAY_CONFIG_*`) |
| Configure work shift | No | No | Yes (`WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT`) |

\* `ATTENDANCE_VIEW` — \** `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE` + matching `ATTENDANCE_EXPORT*` — \*** unless granted — \**** team + permission — \***** if granted.

#### 8.7 Work shifts and work schedules (Task 09)

> The system has a **default system-wide work shift**, not an employee-specific roster. Configure it under **System configuration → Work shift** (`/sysConfig/settings`).

| Feature | Status |
|---------|--------|
| Default start/end | **Available**: `workShiftStartTime`, `workShiftEndTime` |
| Lunch break | **Available**: `workShiftLunchBreakMinutes` (default 60) |
| Late/early grace | **Available**: `workShiftGraceMinutes` (default 15) |
| Work-unit preview | **Available**: `(end − start − lunch)` in Settings |
| Employee-specific/weekly roster | **Not available** |
| One-day shift change with approval | **Not available** |

```text
shiftSpanMinutes       = endTime − startTime
expectedWorkingMinutes = shiftSpanMinutes − lunchBreakMinutes
workUnitLabel          = expectedWorkingMinutes / 60 (for example, "8h", "8.25h")
```

An 08:00–17:00 shift with 60-minute lunch produces an **8-hour work unit**. Late arrival is after `startTime + grace` (or approved `LATE_ARRIVAL` time); early departure is before `endTime − grace` (or approved `EARLY_DEPARTURE` time). Fixed off days come from **Holiday Configuration**.

---
