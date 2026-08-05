---
sidebar_position: 5
---

# Employee Management

> For HR/Admin with `EMPLOYEE_CREATE`, `EMPLOYEE_UPDATE`, `EMPLOYEE_DELETE`.

#### 4.1 Create a new employee — step by step

1. Log in with an account that can create employees.
2. **Organization** → **Employees** (`/org/employees`) — requires `EMPLOYEE_VIEW`.
3. Click **Add employee**.
4. Fill the form (table below).
5. Review **Username** (auto-filled from full name — editable before save).
6. Select **Role** if needed (empty = no role assigned).
7. Click **Save** / **Create**.
8. You return to the employee list; employee code (`EMP…`) is created automatically when not provided.

#### 4.1.1 Excel import (Code upsert)

With `EMPLOYEE_CREATE`:

1. **Organization** → **Employees** → **Download Excel template** (`GET /employees/import-template`) — columns: **Code**, Full name, Hire date, Department, Position.
2. Fill rows and **Import Excel** (`POST /employees/import`; max 5 MB / 1000 rows).
3. **Code** (`employeeCode`) is the identity key (case-insensitive):
   - Matching existing code → **update** that employee (never by full name).
   - New / unknown code → **create** with that code.
   - Empty Code cell → **create** with auto-allocated code.
4. Partial success: some rows can succeed while others return per-row errors (`processed` = created + updated).

**Expected outcome:** New and updated employees appear in the list; username/password rules match create (empty username → from full name; empty password → username).

##### Form fields

| Field | Required | Format / notes |
|-------|:--------:|----------------|
| **Full name** | Yes (*) | Max 100 chars; changing name re-suggests username while creating |
| **Email** | No | Valid email; must be unique if provided |
| **Phone** | No | |
| **Citizen ID** | No | |
| **Department** | Yes (*) | Required (except system account `admin`) |
| **Position** | Yes (*) | **Company-wide** catalog (not per department); employee role comes from position |
| **Date of birth** | No | DatePicker — stored as **YYYY-MM-DD** (e.g. 1990-05-15) |
| **Gender** | No | Male / Female / Other |
| **Address** | No | |
| **Dependent count** | No | Integer 0–99 |
| **Total leave days** | No | Number ≥ 0 (up to 2 decimal places) |
| **Remaining leave days** | No | Number ≥ 0 (up to 2 decimal places) |
| **Hire date** | Yes (*) | Default today; **YYYY-MM-DD** |
| **Contract type** | No | Full-time, Probation, etc. |
| **Employment status** | No | Default **ACTIVE**; also **INACTIVE** / **TERMINATED** |
| **Username** | Yes (*) | Auto from full name; editable **before** save |
| **Role** | No* | Derived from selected position when `positionId` is set — **only `admin` may assign `ADMIN`** |
| **Exempt from attendance tracking** | No | Admin only — excludes employee from Attendance tracking grid and Excel export |
| **Direct manager** | No | Active employees only |
| **Avatar** | No | Upload image |

> **Warning — Dates:** The UI uses a calendar picker; the system stores **YYYY-MM-DD**, not DD/MM/YYYY in the database.

> **Warning — Username:** Cannot be changed after create. Verify before saving.

#### 4.2 Automation on create

| Item | System behavior |
|------|-----------------|
| **Employee code** | Auto: `EMP001`, `EMP002`, … — or set via Excel **Code** on import |
| **Username** | Suggested from full name — see [Section 3.2](#) |
| **Password** | Same as username (hashed in DB) |
| **Welcome email** | **Not sent** — HR must share credentials internally |
| **Default role** | **Not assigned** unless HR selects one — assign `EMPLOYEE` for regular staff |
| **Status** | Default **ACTIVE** |

#### 4.3 Common errors when creating

| Error | Cause | Fix |
|-------|-------|-----|
| **Username already exists** / allocation failed | Rare — no free suffixed candidate left | Try another username or contact IT; see [Section 3.2](#) |
| **Missing required fields** | Full name, hire date, username, department, or position empty | Fill all (*) fields |
| **Email already exists** | Duplicate email | Use another email or leave blank |
| **EMPLOYEE_DEPARTMENT_REQUIRED / EMPLOYEE_POSITION_REQUIRED** | Missing department or position | Select both department and position |
| **Insufficient permissions** | Missing `EMPLOYEE_CREATE` | Ask Admin to assign permissions |

#### 4.4 Edit after create

1. **Organization** → **Employees** → open the employee.
2. Click **Edit** (`/org/employees/{id}/edit`).
3. Update fields (**Username** is locked).
4. Click **Save**.

**Self-service profile:** **Account** (`/account`) → tab **Information** (or user menu → **Account**) — limited personal fields only (no department, role, or username). Tab **Settings**: theme color, font, light/dark mode — saved per user and synced on login on other devices.

**Admin reset password:** Employee detail → **Reset password** → confirm → password = username. **Does not apply** to `admin`.

**Exempt from attendance tracking:** Admin enables the checkbox on the employee form — that employee is excluded from **Attendance tracking** and attendance Excel export. Role `ADMIN` is always excluded from attendance tracking.

#### 4.5 Offboarding

Prefer changing status over deleting:

1. Edit the employee.
2. Set **Employment status** to **TERMINATED** or **INACTIVE**.
3. Save.

**Delete** (`EMPLOYEE_DELETE`): Permanent removal — may affect related attendance, payroll, and calendar data. Use status change instead when possible. **Cannot delete** the `admin` account.

---
