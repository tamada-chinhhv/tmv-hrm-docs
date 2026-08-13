---
sidebar_position: 39
---

# Leave Configuration and Management

## When to use

Use this section to understand and configure how the leave system works in your company. Set up leave balances, unpaid leave rules, and leave type filters to match your HR policies.

## Understanding leave balance

### What is leave balance?

Leave balance is the amount of leave time each employee has available. It's like a bank account for time off:

- **Deposit** — Company gives employees leave days each year (vacation, sick leave, etc.)
- **Withdraw** — Employees use leave when they take time off
- **Balance** — How much leave is left to use

### Measuring leave: Days vs. Minutes

The system tracks leave balance in **working minutes** for accuracy. This means:

- 1 standard workday = 480 minutes (8 hours × 60)
- 1 hour = 60 minutes
- The system shows leave in either **days** or **minutes** depending on your company's preference

**Example:**
- Employee has 10 days of vacation = 4,800 minutes (10 × 480)
- Takes 1 day off = 480 minutes deducted
- Takes 2 hours off = 120 minutes deducted
- Remaining = 4,200 minutes = 8.75 days

### Different work units

Some companies use different work day lengths:

- **Standard** — 8 hours per day (480 minutes)
- **Short shift** — 6 hours per day (360 minutes)
- **Extended** — 10 hours per day (600 minutes)

The system automatically converts all leave to minutes based on your configured work unit. Make sure your **work unit hours** is set correctly in **System Settings** → **Work Shifts**.

## Leave balance override

### What is leave balance override?

Normally, employees can't take more leave than they have available. Balance override allows HR to **manually adjust an employee's leave balance** to cover special situations.

**When to use:**
- Employee was hired mid-month and needs immediate sick leave
- Company policy allows "advance" or "negative" leave balance
- Correction needed due to a system error or leave calculation issue
- Special circumstances (compassionate leave, executive decision, etc.)

### How to override a leave balance

**Menu path:**

1. Go to **HR Management** → **Employees** (Quản lý nhân sự → Nhân viên)
2. Select the employee
3. Go to **Leave Balance** tab
4. Click **Adjust Balance** (or similar button)

**Steps:**

1. Select the leave type (Vacation, Sick Leave, etc.)
2. Enter the **adjustment amount** (positive to add, negative to subtract)
3. Add a **reason** for the adjustment (for audit trail)
4. Click **Apply** or **Save**

**Result:**

The employee's balance is immediately updated. The adjustment is recorded in the system history.

### Important notes on balance override

- **Use carefully** — This is a manual override, so be precise
- **Document reasons** — Always record why you made the adjustment
- **Affects future calculations** — The new balance is used for all future leave requests
- **Can be reversed** — You can make another adjustment to correct mistakes

## Unpaid leave (Late/Early arrivals)

### What is unpaid leave?

Unpaid leave means an employee takes time off **without using their leave balance**. It's recorded as leave but doesn't deduct from available days.

**Common situations:**
- **Late arrivals** — Employee arrives 30 minutes late; can mark as unpaid leave instead of deducting from vacation days
- **Early departures** — Employee leaves 1 hour early; can be unpaid instead of vacation days
- **Special flexibility** — Company allows certain time off without deducting benefits

### How unpaid leave works

When an employee requests leave (especially late arrival or early departure):

1. **Option 1** — Deduct from leave balance (normal)
2. **Option 2** — Mark as unpaid (keep their balance unchanged)

**Example:**

Employee A is 1 hour late to work:

- **With leave balance** — Deduct 60 minutes from vacation days
- **As unpaid leave** — Record the 1 hour as unpaid; balance stays the same

This is useful for flexible work policies or when an employee has no leave balance remaining.

### Enabling unpaid leave for late/early arrivals

1. Go to **System Settings** → **Leave Configuration**
2. Look for **Allow Unpaid Leave for Late/Early Arrivals**
3. Toggle **ON** to allow employees to mark as unpaid
4. Employees see this option when requesting leave for late or early departure

### Notes on unpaid leave

- **Recorded but not deducted** — It shows in records for accountability but doesn't reduce leave balance
- **Still needs approval** — Manager still approves/rejects unpaid leave requests
- **Check your policy** — Make sure your company policy allows this; some companies don't permit unpaid leave

## Leave type filtering

### What is leave type filtering?

When employees request leave, they choose a **leave type** (Vacation, Sick Leave, Compassionate Leave, etc.). Leave type filtering lets HR see leave requests filtered by type.

**Why it's useful:**
- See all vacation requests in a date range
- Track sick leave patterns
- Monitor special leave types separately
- Analyze leave usage by type

### How to use leave type filtering

**When viewing leave requests:**

1. Go to **Leave Approval** or **Leave Requests** (if you have access)
2. Look for the **Leave Type Filter**
3. Select one or more leave types from the dropdown
4. Results automatically filter to show only that type

**Example filters:**

- Show only "Vacation" — Plan summer coverage
- Show only "Sick Leave" — Monitor health patterns
- Show only "Compassionate Leave" — See all special circumstances
- Show "Late Arrival" and "Early Departure" — Focus on schedule flexibility

### Setting up leave types

1. Go to **System Settings** → **Leave Types** (Cấu hình hệ thống → Loại nghỉ)
2. You'll see a list of available leave types
3. Each type has:
   - **Name** — Display name (e.g., "Vacation", "Sick Leave")
   - **Code** — System identifier (e.g., "VACATION", "SICK")
   - **Is Paid** — Whether it deducts from balance or is unpaid
   - **Requires Balance** — Whether balance must be available

4. To add a new type, click **Add Leave Type** and fill in details
5. Save

### Filtering across different views

You can filter leave types in several places:

| Location | Purpose |
|----------|---------|
| **My Leave Requests** | See your own requests by type |
| **Leave Approval** | Manager/HR reviews requests by type |
| **Leave Reports** | Analyze leave usage by type |
| **Employee Leave History** | See one employee's leave by type |

## Practical examples

### Example 1: Setting up leave for a new employee

A new employee joins in the middle of the year:

1. They need 5 days of vacation balance (prorated)
2. Go to **Employees** → Select employee → **Leave Balance**
3. Click **Adjust Balance** for Vacation leave
4. Add 5 days (or 2,400 minutes)
5. Reason: "Prorated balance for mid-year hire"
6. Save — they can now request leave

### Example 2: Tracking sick leave patterns

HR wants to monitor sick leave to identify health issues or attendance problems:

1. Go to **Leave Requests**
2. Apply **Leave Type Filter** = "Sick Leave"
3. Set date range to "Last 3 months"
4. Sort by employee
5. See which employees are taking frequent sick leave

### Example 3: Handling emergency unpaid leave

An employee has no vacation days left but needs 3 hours off for a doctor's appointment:

1. Employee submits leave request
2. HR sees the balance is zero
3. HR approves it as **unpaid leave**
4. The 3 hours are recorded (for audit) but don't deduct from vacation balance
5. Employee's balance stays at zero; they can still request more unpaid leave

### Example 4: Converting work units

Your company changes from 8-hour workday to 9-hour workday. This affects leave calculations:

1. Go to **System Settings** → **Work Shifts**
2. Update **Work Unit Hours** to 9
3. System automatically recalculates:
   - 10 days = 5,400 minutes (10 × 540) instead of 4,800
   - All future leave calculations use the new rate
4. Existing leave balances are kept as-is (the new work unit only affects future conversions)

## Troubleshooting

**Q: Why can't an employee request leave if they have no balance?**

A: The leave type might require an available balance. Check the leave type settings — toggle **Requires Balance** OFF if your company allows negative balance.

**Q: The leave balance shows in minutes but I want to show days.**

A: This depends on your company settings. Contact your system administrator to check the **Leave Display Unit** in **System Settings**.

**Q: An employee took unpaid leave but it's still showing as deducted.**

A: Check if the leave type is configured correctly. Make sure "Unpaid Leave" option was selected when the request was approved. If not, you may need to manually adjust the balance.

**Q: How do I see all employees' leave balances?**

A: Go to **HR Management** → **Leave Balance Report** (if available). This shows all employees and their remaining leave for each type.

**Q: Can I set a minimum balance so employees can't go negative?**

A: This is usually configured in **System Settings** → **Leave Policy**. Check if there's a "Minimum Balance" setting or contact your administrator.

---
