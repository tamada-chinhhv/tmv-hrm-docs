---
sidebar_position: 10
---

# Leave requests

#### 9.1 Leave types

| Code | Deducts `remainingLeaveDays`? | Notes |
|------|:-----------------------------:|-------|
| `PAID_LEAVE` | **Yes** (on approve) | Full day per working day in range |
| `UNPAID_LEAVE`, `SICK_LEAVE` | No / not PAID_LEAVE logic | No file attachments |
| `LATE_ARRIVAL`, `EARLY_DEPARTURE` | No | On approve: **recompute status** from actual punch + approved minutes — **does not** overwrite check-in/out |
| `REMOTE_WORK`, `ATTENDANCE_CORRECTION` | No | Attendance effects (geofence skip / punch times per type) |
| `HIEU_HI` | No | Paid flag but no balance UI |
| `OVERTIME` | No | Overtime hours; monthly OT totals use **approved** `OVERTIME` requests only (no attendance-computed OT) |

No per-type annual caps (beyond annual PAID_LEAVE accrual), carryover expiry/cap, or attachments in system.

**Annual-leave balance (automatic accrual):**

- On the **1st of each month** (cron 05:00 `Asia/Ho_Chi_Minh`): add **+1** to both **Total leave days** (`totalLeaveDays`) and **Remaining leave days** (`remainingLeaveDays`).
- On **1 Jan**: keep prior-year remaining (implicit carryover — no reset) + January **+1** + **seniority** `floor(completed anniversary years / 5)` (recurring each year; e.g. ≥5 → +1, ≥10 → +2, ≥15 → +3).
- Mid-month hire: first +1 on the **1st of the following month** (`hireDate` < accrual date). No mid-month pro-rata.
- Go-live: keep HR-entered balances; **no backfill** of past months; cron accrues from the deploy month onward.
- Columns are **Decimal(8,2)** — cron always adds integers; HR may still manually enter fractional values.
- Approving **`PAID_LEAVE`** still deducts whole chargeable days from `remainingLeaveDays` (no half-day 0.5).

#### 9.2 Create request

**Leave requests** (`/time/leave`) → form: type, date range, times (default 09:00–18:00 on form only), reason, **one Approver** (required). Submit → **PENDING**; approver gets in-app notification (no email).

**Over balance:** blocked at **approve** time for `PAID_LEAVE`, not at submit.

**Request form details:**

1. Open **Time & Attendance** → **Leave requests** (`/leave`), or create a quick request from Attendance.
2. Click **Add** / create request.
3. Select a required **Leave type**, date range (`YYYY-MM-DD`), and optional reason.
4. Set start/end time. The form's 09:00–18:00 default is not the work-shift default.
5. For `LATE_ARRIVAL` / `EARLY_DEPARTURE`, enter **minutes**; multiple days can be selected.
6. Select exactly one required **Approver** from suggestions, then submit.

> **Warning — no half-day value of 0.5:** Although the UI accepts time values, approved `PAID_LEAVE` deducts **one day per overlapping working day**, not 0.5 day.

On submit, the request becomes **PENDING** and the selected Approver receives `LEAVE_REQUEST_CREATED` in the app, linking to `/leave-approvals`. No email is sent automatically.

#### 9.3 Leave quota and balance

| Metric | Source | Meaning |
|--------|--------|---------|
| **Total leave days** | Accrual cron (+ optional HR override) | Increased monthly (+ seniority on 1 Jan); not reduced on approve. |
| **Used** | No separate database column | Manually inferred as Total − Remaining. |
| **Remaining** | Accrual cron (+ optional HR override) | Increased with accrual; deducted for approved `PAID_LEAVE`; restored if an authorized user deletes an approved PAID_LEAVE request. |
| **Pending** | Not deducted in advance | Deducted only after **Approve**. |

The balance appears on eligible paid-leave forms and in the employee profile for HR.

#### 9.4 Viewing and managing created requests

```
PENDING → APPROVED or REJECTED
```

**List page:** `/leave`, with month and status filters.

| Status | Code | Meaning |
|--------|------|---------|
| Pending | `PENDING` | Submitted and waiting for an approver. |
| Approved | `APPROVED` | Accepted; may deduct leave or update attendance. |
| Rejected | `REJECTED` | Declined; there is no resubmission flow. |

There is no separate `CANCELLED` status. Employees may **edit** and **delete** their own **PENDING** requests on **Leave** (non-OT confirmation: `leave.confirmDelete`). **OVERTIME** **PENDING** uses **Cancel** → `PATCH /leave/:id/cancel` (confirmation: `overtime.confirmCancel`). Requests cannot be edited/deleted by their owner after approval or rejection.

After delete (**PENDING** or **APPROVED**), backend deletes linked in-app notifications (`leaveRequestId` in payload) and emits realtime `notifications:removed` plus `leave:approvals-changed` (`action: deleted`) to the actor and assigned approver.

**Delete** on **Leave request approvals** for **APPROVED** rows: **admin** (`ADMIN` role), **assigned approver** / **managed-subtree manager** (`LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED`), or users with `LEAVE_DELETE_APPROVED` (restores `PAID_LEAVE` balance; reverts attendance for `LATE_ARRIVAL` / `EARLY_DEPARTURE` / `ATTENDANCE_CORRECTION` when safe). Permission errors: `LEAVE_DELETE_NOT_ALLOWED` (i18n).

Rejected requests notify the requester through `LEAVE_REQUEST_REJECTED`. The API does **not** require a separate rejection note; only the requester's original reason is visible when one was entered.

#### 9.5 Approval workflow (single step)

- **One approver** per request — not Manager→HR chain, not parallel.
- Requesters select the approver from `GET /leave/approvers`. Suggestions include the active direct manager, employees at a higher position in the department, and employees in parent departments.
- **Inbox (OR):** `LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED` / `LEAVE_VIEW_MANAGED`.
- **Decide (Approve/Reject):** `LEAVE_APPROVE` when `approverId` matches the caller, **or** `LEAVE_APPROVE_MANAGED` when the requester is in the caller’s **managed subtree** (direct + indirect via `managerId`). `LEAVE_VIEW_MANAGED` alone is **read-only** (no decide).
- **No** formal delegation when manager is away (a skip-level manager with `LEAVE_APPROVE_MANAGED` can still decide subtree requests).
- **Approve** blocked with `LEAVE_APPROVE_BLOCKED_BY_OVERLAP` if another **APPROVED** request overlaps the same period.
- **Delete approved** blocked with `LEAVE_DELETE_BLOCKED_BY_OVERLAP` while another **APPROVED** request still overlaps.
- **Replace workflow:** delete old approved request → create new → approve new.

**Approval steps:**

1. Open the `LEAVE_REQUEST_CREATED` notification or **Leave request approvals** (`/leave-approvals`).
2. Select month/status, then open request detail. The approval screen does not separately show leave balance.
3. **Approve:** requester is notified; `PAID_LEAVE` deducts `remainingLeaveDays`, while special types update attendance.
4. **Reject:** requester is notified; a reason is not required.
5. **Bulk approve / reject:** when you can decide, select multiple **PENDING** rows → toolbar → confirm → `POST /leave/approvals/bulk-decide` (per-item best-effort; toast shows success/fail counts).
6. An authorized user may delete an approved request to restore applicable leave/attendance effects.

| Question | Answer |
|----------|--------|
| Can a Manager approve all team requests? | With `LEAVE_APPROVE` only: requests that selected them as **Approver**. With `LEAVE_APPROVE_MANAGED`: any request whose requester is in their managed subtree (even if another person was selected as Approver). With `LEAVE_VIEW_MANAGED` only: can view the subtree inbox but cannot decide. |
| Can HR/Admin approve every request? | Admin role follows admin scope. Others: only if selected on that request, within `LEAVE_APPROVE_MANAGED` scope, or creating on behalf of an employee. |
| Can an absent Manager delegate approval? | No delegation feature. Choose another approver when creating, or rely on a skip-level manager with `LEAVE_APPROVE_MANAGED`. |
| Can an approved request be changed? | No. Delete it if permitted and not blocked by overlap, then create and approve a replacement. |

| Notification event | Recipient | Channel |
|--------------------|-----------|---------|
| Employee submits | Selected approver | App (+ Web Push if enabled) |
| Approve / Reject | Requester | App (+ Push) |
| Edit PENDING / delete | — | No notification |
| Unselected HR/Admin tries to approve | — | Not allowed (403) |

---
