---
sidebar_position: 11
---

# Attendance & Leave Reports

> Task 12 — intended for HR / Managers.

#### 10.1 Available reports and summaries

| Report | Access | Export |
|--------|--------|--------|
| Personal `/time/attendance` dashboard | `ATTENDANCE_VIEW` | — |
| **Attendance tracking** grid | `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE` + scope | **Excel .xlsx** (`ATTENDANCE_EXPORT` / managed export codes) |
| Dashboard leave/OT widgets | Pending count, approved leave days; **today late** = live evaluation (read-only, includes approved late/early leave); **OT hours** = sum of **approved** `OVERTIME` in month | — |
| Dedicated leave PDF/CSV | **No** | — |

#### 10.2 Viewing the monthly summary

1. **Manager / HR:** Open **Attendance tracking** and choose the **month/year**.
2. Filter by **department** and/or **name**.
3. Read daily grid values and the **total** columns at the end of the table.
4. Switch between Day and Hour units: Day uses `1`, `F`, `A`, etc.; Hour shows a worked day as `8h`, for example.

| Personal Attendance metric | Meaning |
|----------------------------|---------|
| Expected working days | Working days in the month after configured weekend/holiday dates. |
| Worked days | Days with WORK or equivalent attendance. |
| Paid / unpaid leave | Converted from approved request hours (÷ 8). |
| Holidays | From Holiday Configuration. |

:::note
The dashboard `getTodaySummary.late` widget evaluates current data, including approved late/early requests, and does not write a database status when opened. Use `yarn recompute-attendance` after deployment to synchronize stored `attendance.status`.
:::

#### 10.3 Exporting reports

| Format | Available? |
|--------|:----------:|
| **Excel (`.xlsx`)** | Yes |
| PDF | No |
| CSV | No |

1. Open **Attendance tracking**.
2. Choose the month and filter department/name if necessary.
3. Click **Export** / Excel export.
4. Download the `.xlsx` file.

Representative columns include employee code, full name, department, each day’s in/out minutes or code, total minutes, file-legend codes (7 absent, 8 late, 9 early), remaining leave days, and more.

#### 10.4 Month-end reconciliation (HR)

##### Data that is still open vs closed in HRM

| Scope | Still open | Closed in HRM |
|---------|------------|---------------|
| **Attendance & leave** | Each month can still be **edited** with permission: punch, manual-time, create/edit requests, approve requests | **No** attendance month lock in the system (backlog Phase 2b) |
| **Payroll period** | Period **Open** — create/edit/import/copy payslips | Period **Locked** — table `payroll_periods`, **Lock period** / **Unlock** on **Payroll**; API `POST /payroll/periods/:year/:month/lock` and `unlock` (`PAYROLL_MANAGE` or `PAYROLL_PERIOD_LOCK`) |

HR should still **reconcile attendance** using the checklist below before locking the payroll period and running payroll ([Section 11.3](#)).

##### Month-end checklist (HR)

- [ ] Open **Attendance tracking** for the month to close
- [ ] Filter by **department** or export company **Excel**
- [ ] Review **`F`** (forgot punch) → require make-up punch / ATTENDANCE_CORRECTION / manual-time
- [ ] Review **`A`** (absent) → confirm unpaid absence vs missing leave request
- [ ] Review **yellow / LATE_EARLY** → confirm under work-unit threshold or needs action
- [ ] Check **PENDING** on **Leave request approvals** — approve or reject before payroll
- [ ] Align **`remainingLeaveDays`** with approved **`PAID_LEAVE`** in the month
- [ ] Export **Excel** as reconciliation evidence (file timestamp on download)
- [ ] Move to **Payroll** when attendance data is consistent
- [ ] On **Payroll**, pick month/year → **Lock period** after payslips are final (or before release — per company process)
- [ ] (Optional) Internal attendance reconciliation record (email/minutes) — does **not** replace payroll period lock in the system

**Expected outcome:** HR does not miss pending requests, missing attendance, or leave balance errors before payroll.

---
