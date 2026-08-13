---
sidebar_position: 35
---

# Overtime Management

## When to use

Use this feature to manage and edit overtime records efficiently. The Overtime Batch Editing feature allows authorized HR staff to edit multiple overtime records at once, without needing separate approvals for each change.

## What is Overtime Batch Editing?

Normally, overtime records go through an approval process. Once they're approved by a department head and director, they typically can't be changed. 

Overtime Batch Editing gives certain HR staff special permission to edit these records directly, even after they're approved. This is useful for:

- **Correcting errors** — Fix mistakes in overtime hours, dates, or employee information
- **Making bulk changes** — Update multiple records at once instead of one by one
- **Adjusting approved records** — Change overtime details without re-submitting for approval
- **Administrative updates** — Handle last-minute changes or special situations

## Who can use this?

Only users with the **OT_BATCH_EDIT_ANY** permission can use this feature.

**How to check permissions:**

1. Go to **System Settings** → **Permissions** (Cấu hình hệ thống → Phân quyền)
2. Find your role or user
3. Look for **OT_BATCH_EDIT_ANY** in the permission list

If you don't have this permission, ask your system administrator to grant it.

## How to edit overtime records

**Step 1: Go to overtime management**

1. Menu **Attendance & Time** → **Manage Overtime Batches** (Chấm công & Thời gian → Quản lý tăng ca)
2. You'll see a list of all overtime batches (created by you, your team, or others)

**Step 2: Find and open a batch**

1. Look for the overtime batch you want to edit
2. Click the batch to open it
3. You can search by date, department, or employee name

**Step 3: Edit the batch**

Once you open a batch, you can:

- **Change the work date** — Update the date the overtime was performed
- **Edit hours** — Adjust start time and end time for each employee
- **Change shift type** — Switch between regular day, holiday, or day-off overtime
- **Update notes** — Add or edit work content description
- **Add or remove employees** — Add new employees or remove them from the batch
- **Change work content** — Update the reason or type of work

**Step 4: Save your changes**

1. Review your changes carefully
2. Click **Save** to update the batch
3. The batch is updated immediately — no additional approval needed

## Key differences from regular overtime requests

| Aspect | Regular OT Request | Batch Editing |
|--------|-------------------|---------------|
| **How to start** | Create from scratch | Edit existing record |
| **Approval** | Needs approval from manager & director | No approval needed |
| **Who can do it** | Employees, managers | HR staff with OT_BATCH_EDIT_ANY |
| **When to use** | New overtime to request | Fix errors, make changes |
| **Time** | Takes time for approvals | Instant updates |

## Use cases and examples

### Example 1: Fix a calculation error

An overtime batch was approved with incorrect hours. Instead of canceling and re-creating it, an HR admin with batch editing permission can:

1. Open the approved overtime batch
2. Correct the start time or end time
3. Save — the hours automatically recalculate
4. The change is applied immediately

### Example 2: Update multiple records at once

The company policy for overtime changed mid-month. HR needs to update 10 overtime batches to use the new work content category:

1. Open the first batch
2. Change the work content
3. Save
4. Repeat for other batches
5. All batches are updated in minutes instead of hours

### Example 3: Handle special request from management

A director asks to adjust overtime records for a specific department due to a system downtime. HR staff with the OT_BATCH_EDIT_ANY permission can:

1. Find all batches for that department and date
2. Edit each one to reflect the actual overtime worked
3. Make all changes at once — no back-and-forth approvals needed

## Important notes

- **You are responsible** — When you edit overtime using batch editing, you're making the final decision. Use this power carefully.
- **No approval step** — Changes take effect immediately. Double-check before saving.
- **Audit trail** — All edits are recorded in the system history so you can see who made what changes.
- **Only approved batches** — You can only edit batches that are already in "Approved" status (not drafts or rejected ones).

## Troubleshooting

**Q: I don't see the "Edit" option for an overtime batch.**

A: Check if the batch is in "Approved" status. You can only edit approved batches. If it's a draft or pending approval, the department head or director needs to handle it first.

**Q: I have the OT_BATCH_EDIT_ANY permission but still can't edit.**

A: Try refreshing your browser or logging out and back in. Sometimes the permission takes a moment to apply.

**Q: Can I undo a change I made?**

A: No, there's no undo function for batch edits. The system keeps a history you can review, but you'll need to manually change the record back to the original value.

---
