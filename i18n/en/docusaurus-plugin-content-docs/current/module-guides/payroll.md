---
sidebar_position: 12
---

# Payroll

- `PAYROLL_VIEW`: view payslips (own or broader per configuration); read payroll period status.
- `PAYROLL_MANAGE`: create, recalculate, tax settings, manage payslips.
- `PAYROLL_PERIOD_LOCK`: **lock/unlock payroll period** (or use `PAYROLL_MANAGE`, which includes period lock).
- **Payroll period (`PayrollPeriod`):** default **Open**; HR clicks **Lock period** on **Payroll** (`PayrollPeriodControls`) → status **Locked**. When locked: cannot create/edit/import/copy payslips (API `PAYROLL_PERIOD_LOCKED`); view and Excel export still work. **Unlock** requires `PAYROLL_MANAGE` or `PAYROLL_PERIOD_LOCK` (note required on unlock). Period lock **only** blocks payroll actions—attendance and leave can still be edited (see [Section 10.4](/docs/reports)).
