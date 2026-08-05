---
sidebar_position: 50
---

# Technical appendix

For IT / Admin. Most users can skip this.

#### 6.1 URLs

| Environment | URL |
|-------------|-----|
| Production | https://hrm.tamada.vn/ |
| Login | https://hrm.tamada.vn/login |

#### 6.2 Common error codes

| Symptom / code | Suggested action |
|----------------|------------------|
| Outside office / `OUTSIDE_OFFICE_AREA` | Enter GPS radius or matching branch WiFi |
| Missing location / WiFi on punch | Enable GPS or send WiFi info (mobile) |
| Not allowed to delete approved leave | Only admin / authorized approvers |
| Payroll period locked | Unlock (if permitted) before editing payslips |
| OT overlap / over limit | Adjust times or employees on the batch |

#### 6.3 Architecture notes (for developers)

- FE: `tmv-hrm` · BE: `tmv-hrm-be`
- Overtime batches: `/time/overtime-batches` with dept-head / director approval (legacy single OT menu is not on the main sidebar)
- Product issues: [GitHub Issues](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new)
