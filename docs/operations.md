---
sidebar_position: 12
---

# Quy trình vận hành đề xuất

#### 11.1 Khởi tạo (lần đầu triển khai)

1. Cấu hình phòng ban, chức vụ, vị trí chấm công, ngày nghỉ.
2. Tạo nhóm quyền, gán phân quyền (`ADMIN`, `EMPLOYEE`, …).
3. Tạo nhân viên, gán phòng ban, quản lý trực tiếp, **vai trò**.
4. Gửi username / mật khẩu mặc định cho từng người; nhắc **đổi mật khẩu**.

**Kết quả mong đợi:** Công ty vận hành được chu trình chấm công — nghỉ phép — lương.

#### 11.2 Hằng ngày

1. Chấm công.
2. Tạo / duyệt đơn nghỉ.
3. Sắp lịch họp trên **Lịch** (nếu cần).
4. Xử lý bất thường (quên chấm công, v.v.).

#### 11.3 Hằng tháng

1. Rà soát dữ liệu công — [checklist mục 10.4](#).
2. Cập nhật thông số lương, thuế (nếu có).
3. Chạy bảng lương trên **Payroll**; khi xong, **Khóa kỳ** tháng tương ứng (cần `PAYROLL_MANAGE` hoặc `PAYROLL_PERIOD_LOCK`).

---
