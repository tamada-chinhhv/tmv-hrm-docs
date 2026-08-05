---
sidebar_position: 12
---

# Lương

- `PAYROLL_VIEW`: xem phiếu lương (cá nhân hoặc rộng hơn tùy cấu hình); xem trạng thái kỳ lương.
- `PAYROLL_MANAGE`: tạo, tính lại, cấu hình thuế, quản lý phiếu lương.
- `PAYROLL_PERIOD_LOCK`: **khóa/mở khóa kỳ lương** (hoặc dùng `PAYROLL_MANAGE` — quyền này bao gồm khóa kỳ).
- **Kỳ lương (`PayrollPeriod`):** mặc định **Đang mở**; HR bấm **Khóa kỳ** trên trang **Lương** (`PayrollPeriodControls`) → trạng thái **Đã khóa**. Khi đã khóa: không tạo/sửa/nhập/sao chép phiếu lương (API `PAYROLL_PERIOD_LOCKED`); vẫn xem và xuất Excel. **Mở khóa** cần `PAYROLL_MANAGE` hoặc `PAYROLL_PERIOD_LOCK` + ghi chú (bắt buộc khi mở khóa). Khóa kỳ **chỉ** chặn thao tác lương — chấm công và đơn phép vẫn sửa được (xem [mục 10.4](#)).
