---
sidebar_position: 7
---

# Roles & Permissions

#### 6.1 Built-in roles

| Code | Display name | Typical user | Summary |
|------|--------------|--------------|---------|
| `ADMIN` | Administrator | IT / Head of HR | All permissions from seed |
| `HR_MANAGER` | HR Manager | HR staff | Role exists; **Admin must assign permissions** (not pre-assigned in seed) |
| `EMPLOYEE` | Employee | Regular staff | Basic: attendance, leave view, own payslip |

Each employee has **one** `roleId` at a time.

#### 6.2 Permission matrix (reference)

- **Admin** = `ADMIN` role (full seed permissions).
- **HR** = usually `HR_MANAGER` + permissions assigned by Admin.
- **Manager** = has `EMPLOYEE_VIEW` + direct/indirect reports via `managerId`. `EMPLOYEE_VIEW_ALL` → company-wide read scope (like Admin for list/findOne).
- **Employee** = default `EMPLOYEE` role.

| Feature | Admin | HR* | Manager | Employee |
|---------|:-----:|:---:|:-------:|:--------:|
| Create employee | Yes | Yes* | No** | No |
| Update employee | Yes | Yes* | No** | Account → Information (limited) |
| Delete employee | Yes | Yes* | No | No |
| View employees — company-wide | Yes | Yes* | No | No |
| View employees — team | Yes | Yes* | Yes*** | No |
| View employees — self only | Yes | Yes | Yes | Yes |
| Reset others’ passwords | Yes | Yes* | No | No |
| Edit/delete others’ meetings | Yes* | Yes* | No | No |
| Edit/delete own meetings | Yes | Yes | Yes | Yes |
| View others’ calendars | Yes | Yes | Yes | Yes |
| Own attendance | Yes | Yes | Yes | Yes |
| Team attendance tracking | Yes | Yes* | Yes*** | No |
| Approve leave | Yes | Yes* | Yes***** | No |
| View / manage payroll | Yes | Yes* | By permission | Own view |
| Departments / positions config | Yes | Yes* | No | No |
| Holidays / office locations | Yes | Yes* | No | No |
| Roles & permission assignment | Yes | Yes* | No | No |

\* Requires the matching permission code.  
\** Unless Admin grants extra permissions.  
\*** Manager = `EMPLOYEE_VIEW` + report subtree.  
\**** Edit/delete on calendar API: **organizer** or user with **`CALENDAR_EDIT_ANY`**.  
\***** Requires `LEAVE_APPROVE`.

#### 6.3 Scope by level

**Admin (`roleCode = ADMIN`):** Full employee list and management.

**Manager (`EMPLOYEE_VIEW`, not Admin / without `EMPLOYEE_VIEW_ALL`):** Only employees in their **reporting subtree** (direct and indirect reports via `managerId`).

**HR / user with `EMPLOYEE_VIEW_ALL`:** company-wide employee list (no `ADMIN` role required).

**Regular employee (no `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL`):** Employee API returns **only self**. Calendar **directory** (`/employees/directory`) still lists active employees for meeting invites — not full HR records.

#### 6.4 Assigning roles

| Question | Answer |
|----------|--------|
| Who can assign? | Users with `EMPLOYEE_UPDATE` (usually Admin/HR) |
| Where? | **Organization → Employees** → Create/Edit → **Role** field |
| Multiple roles? | **No** — one role per employee |
| Assign **ADMIN** role? | **Only** username `admin` |
| Edit **ADMIN** role permissions? | **Only** username `admin` — system always grants full permissions to ADMIN |
| Assign permissions? | **System configuration → Permission Assignment** (`/sysConfig/assign`) |

**Steps for role permissions:**

1. **System configuration → Roles** — create/view roles (`ROLE_VIEW` / `ROLE_MANAGE`).
2. **System configuration → Permission Assignment** — select role → tick permissions → Save.
3. Assign that **role** to each employee in the employee form.

**Expected outcome:**

- **Changing permissions on a role** (steps 1–2): users are **not** logged out; menus and actions update on the next API call (reload or tab switch also works).
- **Changing an employee's assigned role** (step 3): that employee must **log in again** on all devices/tabs.
- **Saving an employee profile without changing role:** does not affect that employee's session.

#### 6.5 Permission codes

| Code | Meaning |
|------|---------|
| `EMPLOYEE_VIEW` | View employees (managed subtree) |
| `EMPLOYEE_VIEW_ALL` | View all employees (company-wide list / detail / tracking) |
| `EMPLOYEE_CREATE` | Create employee |
| `EMPLOYEE_UPDATE` | Update employee, reset password |
| `EMPLOYEE_DELETE` | Delete employee |
| `ATTENDANCE_VIEW` | View / check-in attendance |
| `ATTENDANCE_VIEW_MANAGED` | View attendance tracking for **direct** reports only |
| `ATTENDANCE_VIEW_MANAGED_SUBTREE` | View attendance tracking for full managed subtree |
| `ATTENDANCE_EXPORT` | Export working-time detail Excel (Attendance tracking) — company-wide / with `EMPLOYEE_VIEW_ALL` |
| `ATTENDANCE_EXPORT_MANAGED` | Export Excel for **direct** reports only |
| `ATTENDANCE_EXPORT_MANAGED_SUBTREE` | Export Excel for full managed subtree |
| `ATTENDANCE_MANUAL_UPDATE` | Manual time correction; delete attendance day; bulk day adjust |
| `LOCATION_VIEW` / `LOCATION_MANAGE` | View / manage office locations |
| `LEAVE_VIEW` | View / create leave requests (including OT type) |
| `LEAVE_VIEW_MANAGED` | View managed-subtree leave in **Leave request approvals** (read-only; child of `LEAVE_VIEW` in assign UI) |
| `LEAVE_APPROVE` | Approve leave (when selected as Approver on the request) |
| `LEAVE_APPROVE_MANAGED` | Approve leave for employees in managed subtree (direct + indirect reports; child of `LEAVE_APPROVE` in assign UI) |
| `LEAVE_DELETE_APPROVED` | Delete **approved** requests on **Leave request approvals** (default: ADMIN role); approvers with `LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED` may also delete **APPROVED** rows they can decide on |
| `CALENDAR_VIEW` | View calendar, create/edit own events |
| `CALENDAR_MANAGE` | Company-wide calendar admin switch |
| `CALENDAR_EDIT_ANY` | Edit/delete calendar events owned by other employees (default: ADMIN role) |
| `DOCUMENT_VIEW` | View and create/edit/delete own employee documents; HR can view all |
| `DOCUMENT_MANAGE` | Full org document create/edit/delete + configure expiry notification rules |
| `PAYROLL_VIEW` | View payslips |
| `PAYROLL_MANAGE` | Manage / calculate payroll, tax settings |
| `PAYROLL_PERIOD_LOCK` | Lock / unlock payroll periods |
| `DEPARTMENT_VIEW` / `DEPARTMENT_MANAGE` | Departments |
| `POSITION_VIEW` / `POSITION_MANAGE` | Positions |
| `ROLE_VIEW` / `ROLE_MANAGE` | Roles & permissions |
| `HOLIDAY_CONFIG_VIEW` / `HOLIDAY_CONFIG_EDIT` | Holiday configuration |
| `APPEARANCE_VIEW` / `APPEARANCE_EDIT` | View / edit **system appearance** (`/sysConfig/settings`) |
| `WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT` | View / edit default work shift (`/sysConfig/settings`) |

> **System appearance** (company default): stored in `app_settings` — Admin configures at **System configuration → Settings**; API `GET/PATCH /settings/appearance` (`APPEARANCE_*`). **Login** and after **logout** always use system appearance (`GET /settings/public/appearance`).  
> **Personal appearance:** any logged-in user — **Account** → tab **Settings**; `GET/PATCH /auth/me/appearance`. Overrides system only when the user has saved (`appearance_customized = true`).  
> `OVERTIME_*` and `ATTENDANCE_MANAGE` are **removed** — do not re-assign.

---
