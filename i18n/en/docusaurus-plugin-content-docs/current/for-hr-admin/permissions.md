---
sidebar_position: 40
---

# Permissions and Access Control

## What are permissions?

Permissions control **what each person can do** in the HR system. They're like keys to different rooms:

- **Leave permission** — Can this person see, create, or approve leave requests?
- **Overtime permission** — Can this person create or edit overtime batches?
- **Attendance permission** — Can this person view or adjust attendance records?
- **System settings permission** — Can this person configure company settings?

Permissions are grouped into **roles**, and you assign roles to employees.

## How permissions work

**Step 1: Create or use a role**

A **role** is a collection of permissions. Common roles:

- **HR Admin** — Full access to all HR functions
- **Manager** — Can approve overtime and leave for their team
- **HR Staff** — Can view reports but can't change settings
- **Employee** — Can only see their own data

**Step 2: Assign role to a user**

Each employee gets one or more roles. The system gives them all permissions in those roles.

**Step 3: Check permissions when doing something**

When a user tries to do something (create leave, edit overtime), the system checks their permissions. If they have the right permission, they can do it. If not, the system shows an error.

## Key permissions you need to know

### Overtime permissions

| Permission | What it allows | When to use |
|-----------|-----------------|-----------|
| **OT_CREATE** | Create new overtime batches | Managers, Team leads |
| **OT_BATCH_EDIT_ANY** | Edit any approved overtime batch without re-approval | HR staff who need to fix or update OT records |
| **OT_APPROVE_DEPT_HEAD** | Approve overtime as department head | Department heads |
| **OT_APPROVE_DIRECTOR** | Approve overtime as director | Directors |
| **OT_DELETE_APPROVED** | Delete approved overtime records | HR admin only |

### Leave permissions

| Permission | What it allows | When to use |
|-----------|-----------------|-----------|
| **LEAVE_VIEW** | See leave requests and history | Almost all staff |
| **LEAVE_CREATE** | Create leave requests | All employees |
| **LEAVE_DECIDE** | Approve/reject leave requests | Managers, Directors |
| **LEAVE_MANAGE_EMPLOYEE_BALANCE** | Manually adjust employee leave balance | HR admin |

### Attendance permissions

| Permission | What it allows | When to use |
|-----------|-----------------|-----------|
| **ATTENDANCE_VIEW** | View attendance records | Managers, HR staff |
| **ATTENDANCE_MANAGE** | Adjust attendance records | HR admin |
| **ATTENDANCE_MARK** | Manually check in/out employees | Admin (for system errors) |

### Attendance devices

| Permission | What it allows | When to use |
|-----------|----------------|-------------|
| **ATTENDANCE_DEVICE_VIEW** | View terminals, events, sync schedule | HR, IT |
| **ATTENDANCE_DEVICE_MANAGE** | Add/configure devices, mappings, Push check | HR admin, IT |

See [Attendance terminals](./attendance-devices.md) for Direct vs Push setup.

### Settings permissions

| Permission | What it allows | When to use |
|-----------|-----------------|-----------|
| **SETTINGS_CONFIGURE** | Change system settings | HR admin, System admin |
| **PERMISSION_MANAGE** | Assign permissions to roles and users | System admin only |
| **DEPARTMENT_MANAGE** | Create/edit departments | HR admin |
| **EMPLOYEE_MANAGE** | Create/edit employee profiles | HR admin |

## The OT_BATCH_EDIT_ANY permission explained

This is a special permission that deserves detailed explanation.

### What does OT_BATCH_EDIT_ANY do?

**OT_BATCH_EDIT_ANY** lets a user **edit any overtime batch**, even after it's been approved. Normally:

- Only the creator can edit a draft overtime batch
- Once approved, no one can edit it
- You have to cancel and create a new one to make changes

With **OT_BATCH_EDIT_ANY**, HR can:

- Edit approved batches directly
- Make corrections without going through approval again
- Update multiple batches quickly
- Handle special requests from management

### Who should have it?

Give **OT_BATCH_EDIT_ANY** to:

- **HR Overtime Specialist** — Person who manages overtime records
- **HR Manager** — Oversees overtime processes
- **Finance/Payroll Staff** — May need to adjust OT before payroll processing
- **System Administrator** — For system maintenance and fixes

**Do NOT give to:**

- Regular employees
- Department heads or managers (they already have OT_APPROVE_DEPT_HEAD)
- Directors (they have OT_APPROVE_DIRECTOR)

### What can users with OT_BATCH_EDIT_ANY do?

They can:

1. **Edit overtime hours** — Change start time, end time, or total hours
2. **Change the work date** — Move OT to a different date
3. **Update shift type** — Change from regular day OT to holiday OT
4. **Add/remove employees** — Include or exclude people from a batch
5. **Change work content** — Update the reason or type of work
6. **Save immediately** — No approval process needed

They **cannot:**

- Delete overtime batches (need OT_DELETE_APPROVED for that)
- Undo changes (need to manually edit back)
- Create new batches from scratch (need OT_CREATE for that)

## How to assign permissions

### Step 1: Go to permissions management

1. Menu **System Settings** → **Permissions** (Cấu hình hệ thống → Phân quyền)
2. You'll see a list of roles and users

### Step 2: Choose where to assign

You can assign to:
- **Roles** — A group of permissions that apply to all users with that role
- **Users** — Individual users (overrides their role permissions)

### Step 3: Add the permission

**If assigning to a role:**

1. Click the role name
2. Click **Add Permission** or similar
3. Search for the permission (e.g., "OT_BATCH_EDIT_ANY")
4. Select it
5. Save

**If assigning to a user:**

1. Click the user name
2. Click **Permissions** tab
3. Click **Add Permission**
4. Search for the permission
5. Select it
6. Save

### Step 4: Verify

The user should see the feature/option within seconds. If not:
- Ask them to refresh their browser
- Ask them to log out and log back in
- Check that the permission is definitely assigned

## Permission levels (hierarchy)

Some permissions are **hierarchical**, meaning higher-level permissions include lower ones:

### Overtime example

```
System Admin
    ↓
OT_DELETE_APPROVED (most powerful)
    ↓
OT_BATCH_EDIT_ANY (edit approved)
    ↓
OT_APPROVE_DIRECTOR (approve OT)
    ↓
OT_APPROVE_DEPT_HEAD (approve OT)
    ↓
OT_CREATE (create OT)
    ↓
LEAVE_VIEW (see OT records)
```

Meaning:
- A System Admin has all OT permissions
- Someone with OT_DELETE_APPROVED can also do everything below it
- An employee can only create and view OT

## Common scenarios

### Scenario 1: New HR staff joins

**Goal:** Let new HR staff manage overtime but not change settings.

**Permissions to assign:**
- OT_BATCH_EDIT_ANY ✓ (edit overtime)
- OT_APPROVE_DIRECTOR ✓ (approve if needed)
- ATTENDANCE_MANAGE ✓ (adjust attendance)
- LEAVE_MANAGE_EMPLOYEE_BALANCE ✓ (adjust leave balance)
- SETTINGS_CONFIGURE ✗ (no — too powerful)
- PERMISSION_MANAGE ✗ (no — only admins)

### Scenario 2: Department head needs more control

**Goal:** Let department head see all OT and leave for their team.

**Permissions:**
- OT_APPROVE_DEPT_HEAD ✓ (approve OT)
- LEAVE_DECIDE ✓ (approve leave)
- ATTENDANCE_VIEW ✓ (see attendance)
- OT_BATCH_EDIT_ANY ✗ (no — only HR needs this)

### Scenario 3: Finance needs to prep payroll

**Goal:** Let payroll staff see all records and make adjustments before payroll run.

**Permissions:**
- ATTENDANCE_MANAGE ✓ (adjust if needed)
- LEAVE_MANAGE_EMPLOYEE_BALANCE ✓ (adjust balances)
- OT_BATCH_EDIT_ANY ✓ (fix OT hours)
- SETTINGS_CONFIGURE ✗ (no)
- PERMISSION_MANAGE ✗ (no)

## Troubleshooting permissions

**Q: A user says they can't do something they should be able to do.**

A: 
1. Go to **System Settings** → **Permissions**
2. Find the user
3. Check their assigned role and permissions
4. Verify the permission they need is listed
5. If missing, add it
6. Ask them to refresh or log out/in

**Q: I assigned a permission but the user still can't access the feature.**

A: Check:
1. Is the permission correctly assigned? (Check twice)
2. Is the user's role conflicting? (Some roles may override)
3. Does the user need to refresh/log out?
4. Are there other prerequisites? (e.g., OT_BATCH_EDIT_ANY requires they have OT_CREATE first)

**Q: What's the difference between assigning to a role vs. a user?**

A:
- **Role** — Affects all users with that role. Good for standard job positions.
- **User** — Only affects that specific person. Good for exceptions or temporary access.

**Q: Can a user have multiple roles?**

A: Yes, and they get all permissions from all their roles combined.

**Q: What happens if I remove a permission?**

A: The user can no longer do that action. If they're currently logged in, changes apply after they refresh or log back in.

## Best practices

1. **Use roles, not individual permissions** — Easier to manage when you assign permissions to a role, then assign roles to users.

2. **Follow the principle of least privilege** — Give people only the permissions they need for their job.

3. **Review permissions quarterly** — When staff change roles or leave, update their permissions.

4. **Document who has what** — Keep a note of who has OT_BATCH_EDIT_ANY and why.

5. **Use OT_BATCH_EDIT_ANY carefully** — It's powerful. Only give to trusted, trained HR staff.

6. **Audit changes** — The system logs who edited what. Check the audit log regularly.

7. **Don't assign PERMISSION_MANAGE lightly** — This lets someone give permissions to others. Restrict to your system admin.

---
