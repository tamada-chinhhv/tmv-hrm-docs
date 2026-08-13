---
sidebar_position: 37
---

# Quyền hạn & phân quyền

**Khi nào dùng:** Kiểm soát ai được làm gì trong hệ thống: xem / tạo / duyệt đơn, sửa tăng ca, điều chỉnh chấm công, thay đổi cấu hình.

## Quyền và vai trò hoạt động thế nào?

Quyền giống như chìa khóa của từng "cánh cửa" chức năng. Các quyền được gom thành **vai trò**, và vai trò được gán cho nhân viên:

1. **Tạo / dùng vai trò** — ví dụ: HR Admin (toàn quyền HR), Quản lý (duyệt đơn của đội), Nhân viên HR (xem báo cáo), Nhân viên (chỉ dữ liệu của mình).
2. **Gán vai trò cho người dùng** — mỗi người có thể có nhiều vai trò; họ nhận tất cả quyền của các vai trò đó.
3. **Hệ thống kiểm tra khi thao tác** — thiếu quyền thì hệ thống báo lỗi / ẩn chức năng.

## Các quyền quan trọng

### Tăng ca

| Quyền | Cho phép | Thường gán cho |
|---|---|---|
| **OT_CREATE** | Tạo đợt tăng ca mới | Quản lý, trưởng nhóm |
| **OT_BATCH_EDIT_ANY** | Sửa mọi đợt tăng ca đã duyệt, không cần duyệt lại | HR phụ trách tăng ca |
| **OT_APPROVE_DEPT_HEAD** | Duyệt tăng ca cấp trưởng phòng | Trưởng phòng |
| **OT_APPROVE_DIRECTOR** | Duyệt tăng ca cấp giám đốc | Giám đốc |
| **OT_DELETE_APPROVED** | Xóa đợt tăng ca đã duyệt | Chỉ HR admin |

### Nghỉ phép

| Quyền | Cho phép | Thường gán cho |
|---|---|---|
| **LEAVE_VIEW** | Xem đơn và lịch sử nghỉ | Hầu hết nhân viên |
| **LEAVE_CREATE** | Tạo đơn xin phép | Tất cả nhân viên |
| **LEAVE_DECIDE** | Duyệt / từ chối đơn | Quản lý, giám đốc |
| **LEAVE_MANAGE_EMPLOYEE_BALANCE** | Điều chỉnh số phép của nhân viên | HR admin |

### Chấm công

| Quyền | Cho phép | Thường gán cho |
|---|---|---|
| **ATTENDANCE_VIEW** | Xem dữ liệu chấm công | Quản lý, HR |
| **ATTENDANCE_MANAGE** | Điều chỉnh bản ghi chấm công | HR admin |
| **ATTENDANCE_MARK** | Chấm công hộ nhân viên (khi hệ thống lỗi) | Admin |

### Cấu hình

| Quyền | Cho phép | Thường gán cho |
|---|---|---|
| **SETTINGS_CONFIGURE** | Thay đổi cấu hình hệ thống | HR admin, quản trị hệ thống |
| **PERMISSION_MANAGE** | Gán quyền cho vai trò / người dùng | Chỉ quản trị hệ thống |
| **DEPARTMENT_MANAGE** | Tạo / sửa phòng ban | HR admin |
| **EMPLOYEE_MANAGE** | Tạo / sửa hồ sơ nhân viên | HR admin |

## Quyền OT_BATCH_EDIT_ANY

Đây là quyền đặc biệt cần hiểu rõ. Bình thường: chỉ người tạo sửa được bản nháp tăng ca; sau khi duyệt thì **không ai sửa được** — muốn thay đổi phải hủy và tạo lại. Người có **OT_BATCH_EDIT_ANY** thì:

- **Được:** sửa giờ, đổi ngày làm, đổi loại ca, thêm / bớt nhân viên, đổi nội dung công việc của đợt **đã duyệt** — lưu có hiệu lực ngay, không cần duyệt lại. Xem chi tiết tại [Quản lý tăng ca](./overtime-management.md).
- **Không được:** xóa đợt tăng ca (cần OT_DELETE_APPROVED), hoàn tác thay đổi, tạo đợt mới (cần OT_CREATE).

**Nên gán cho:** HR phụ trách tăng ca, quản lý HR, nhân viên lương / tài chính (chỉnh trước kỳ lương), quản trị hệ thống.

**Không nên gán cho:** nhân viên thường; trưởng phòng / giám đốc (họ đã có quyền duyệt riêng).

## Các bước gán quyền

1. **Cấu hình hệ thống** → **Phân quyền**.
2. Chọn nơi gán:
   - **Vai trò** — áp dụng cho mọi người dùng có vai trò đó (khuyên dùng cho vị trí công việc chuẩn).
   - **Người dùng** — chỉ áp dụng cho cá nhân đó (dùng cho ngoại lệ / quyền tạm thời).
3. Bấm **Thêm quyền** → tìm mã quyền (ví dụ "OT_BATCH_EDIT_ANY") → chọn → **Lưu**.
4. Kiểm tra: người dùng thấy chức năng sau vài giây; nếu chưa, nhờ họ tải lại trang hoặc đăng xuất / đăng nhập lại.

**Kết quả mong đợi:** Mỗi người chỉ thấy và thao tác được đúng chức năng theo vai trò của mình.

## Ví dụ phân quyền

- **Nhân viên HR mới (quản lý tăng ca, không đụng cấu hình):** OT_BATCH_EDIT_ANY, ATTENDANCE_MANAGE, LEAVE_MANAGE_EMPLOYEE_BALANCE — không gán SETTINGS_CONFIGURE, PERMISSION_MANAGE.
- **Trưởng phòng:** OT_APPROVE_DEPT_HEAD, LEAVE_DECIDE, ATTENDANCE_VIEW — không cần OT_BATCH_EDIT_ANY (chỉ HR cần).
- **Nhân viên lương / tài chính (chuẩn bị kỳ lương):** ATTENDANCE_MANAGE, LEAVE_MANAGE_EMPLOYEE_BALANCE, OT_BATCH_EDIT_ANY — không gán quyền cấu hình.

**Gặp vấn đề?**

- Người dùng không làm được việc lẽ ra được phép → vào **Phân quyền**, kiểm tra vai trò và danh sách quyền của họ; thiếu thì thêm, rồi nhờ họ tải lại trang / đăng nhập lại.
- Đã gán quyền nhưng vẫn không thấy chức năng → kiểm tra lại đã gán đúng chưa; người dùng đã đăng xuất / đăng nhập lại chưa; có quyền tiên quyết nào không.
- Gán cho vai trò hay cá nhân? → **Vai trò** khi là vị trí công việc chuẩn; **cá nhân** khi là ngoại lệ hoặc tạm thời.
- Gỡ quyền thì sao? → người dùng mất chức năng đó sau khi tải lại trang / đăng nhập lại.

**Nguyên tắc:** Gán quyền qua vai trò thay vì từng cá nhân; chỉ cấp quyền tối thiểu cần cho công việc; rà soát định kỳ khi nhân sự thay đổi; ghi chú ai đang giữ OT_BATCH_EDIT_ANY và lý do; hạn chế tối đa PERMISSION_MANAGE.

---
