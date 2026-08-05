---
sidebar_position: 7
---

# Phân quyền & Vai trò

#### 6.1 Các vai trò (roles) trong hệ thống

| Mã vai trò | Tên hiển thị | Ai nên dùng | Mô tả ngắn |
|------------|--------------|-------------|------------|
| `ADMIN` | Administrator | IT / HR trưởng | Toàn quyền — gán tất cả permission có trong hệ thống |
| `HR_MANAGER` | HR Manager | Quản lý nhân sự | Vai trò có sẵn; **cần Admin gán permission** qua Phân quyền (mặc định seed không gán sẵn) |
| `EMPLOYEE` | Employee | Nhân viên thường | Quyền cơ bản: xem chấm công, đơn nghỉ, phiếu lương của mình |

Mỗi nhân viên chỉ gắn **một** `roleId` tại một thời điểm.

#### 6.2 Bảng quyền theo module (tham khảo)

Chú thích cột:

- **Admin** = vai trò `ADMIN` (đủ quyền seed).
- **HR** = tài khoản được gán tương đương HR (thường custom từ `HR_MANAGER` + permission đầy đủ — do Admin cấu hình).
- **Manager** = có `EMPLOYEE_VIEW` + có nhân viên cấp dưới (`managerId`). Có `EMPLOYEE_VIEW_ALL` → xem **toàn công ty** (tương tự Admin về phạm vi đọc danh sách).
- **Employee** = vai trò `EMPLOYEE` mặc định.

| Tính năng | Admin | HR (đủ quyền) | Manager | Employee |
|-----------|:-----:|:--------------:|:-------:|:--------:|
| Tạo nhân viên | Có | Có* | Không** | Không |
| Sửa nhân viên | Có | Có* | Không** | Tài khoản → Thông tin (giới hạn) |
| Xóa nhân viên | Có | Có* | Không | Không |
| Xem nhân viên — toàn công ty | Có | Có* | Không | Không |
| Xem nhân viên — team | Có | Có* | Có*** | Không |
| Xem nhân viên — chỉ mình | Có | Có | Có | Có |
| Reset mật khẩu người khác | Có | Có* | Không | Không |
| Tạo/sửa/xóa lịch họp của người khác | Có* | Có* | Không | Không |
| Tạo/sửa/xóa lịch họp của mình | Có | Có | Có | Có |
| Xem lịch người khác | Có | Có | Có | Có |
| Chấm công (bản thân) | Có | Có | Có | Có |
| Theo dõi chấm công team | Có | Có* | Có*** | Không |
| Duyệt đơn nghỉ | Có | Có* | Có***** | Không |
| Xem / quản lý lương | Có | Có* | Theo quyền | Xem của mình |
| Cấu hình phòng ban, chức vụ | Có | Có* | Không | Không |
| Cấu hình ngày nghỉ, vị trí chấm công | Có | Có* | Không | Không |
| Nhóm quyền & Phân quyền | Có | Có* | Không | Không |

\* Cần permission tương ứng (`EMPLOYEE_CREATE`, …) — HR thường được Admin gán.  
\** Trừ khi Admin gán thêm permission cho cá nhân đó.  
\*** Manager = nhân viên có quyền `EMPLOYEE_VIEW` và có cấp dưới trong cây `managerId`.  
\**** Sửa/xóa sự kiện trên API lịch: chỉ **organizer** hoặc user có **`CALENDAR_EDIT_ANY`**.  
\***** Cần `LEAVE_APPROVE`.

#### 6.3 Phạm vi (scope) theo cấp bậc

**Admin (`roleCode = ADMIN`):**

- Xem và quản lý **toàn bộ** nhân viên.
- Không bị giới hạn theo phòng ban trên API danh sách nhân viên.

**Manager (có `EMPLOYEE_VIEW`, không phải Admin / không có `EMPLOYEE_VIEW_ALL`):**

- Chỉ xem nhân viên thuộc **cây cấp dưới** của mình: nhân viên có `Quản lý trực tiếp` = bạn, và các cấp dưới của họ (đệ quy theo `managerId`).
- **Ví dụ:** Bạn là trưởng phòng A → xem được A1, A2 và nhân viên do A1 quản lý; **không** xem được phòng B.

**HR / user có `EMPLOYEE_VIEW_ALL`:** xem danh sách nhân viên **toàn công ty** (không cần role `ADMIN`).

**Nhân viên thường (không có `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL`):**

- API danh sách nhân viên chỉ trả về **chính bạn**.
- Vẫn có thể **tìm tên** đồng nghiệp trong **danh bạ lịch** (`/employees/directory`) để mời họp — đây là danh sách riêng cho lịch, không đồng nghĩa xem full hồ sơ nhân sự.

**Kết quả mong đợi:** Mỗi vai trò chỉ thấy dữ liệu nhân sự đúng phạm vi; tránh lộ lương/thông tin nhạy cảm ngoài team.

#### 6.4 Cách gán vai trò cho nhân viên

| Câu hỏi | Trả lời |
|---------|---------|
| Ai gán được? | Nhân viên có `EMPLOYEE_UPDATE` (thường Admin/HR) |
| Gán ở đâu? | **Tổ chức → Nhân viên** → Tạo mới hoặc **Chỉnh sửa** → trường **Vai trò** |
| Nhiều vai trò cùng lúc? | **Không** — chỉ một vai trò / một nhân viên |
| Gán permission chi tiết? | **Cấu hình hệ thống → Phân quyền** (`/roles/assign`) — cần `ROLE_MANAGE` hoặc `ROLE_VIEW` tùy thao tác |
| Gán role **ADMIN**? | **Chỉ** tài khoản `admin` |
| Sửa quyền role **ADMIN**? | **Chỉ** tài khoản `admin` — hệ thống luôn gán full quyền cho role ADMIN |

**Các bước gán permission cho nhóm quyền:**

1. **Cấu hình hệ thống → Nhóm quyền** — xem/ tạo vai trò (`ROLE_VIEW` / `ROLE_MANAGE`).
2. **Cấu hình hệ thống → Phân quyền** — chọn vai trò → tick các quyền → Lưu.
3. Gán **vai trò** đó cho từng nhân viên trong form nhân viên.

**Kết quả mong đợi:**

- **Đổi permission của một nhóm quyền** (bước 1–2): nhân viên **không** bị đăng xuất; menu và thao tác cập nhật theo quyền mới ở lần gọi API tiếp theo (refresh trang hoặc chuyển tab cũng được).
- **Đổi vai trò (role) gắn với nhân viên** (bước 3): nhân viên đó phải **đăng nhập lại** trên mọi thiết bị/tab.
- **Lưu hồ sơ nhân viên mà không đổi vai trò:** không ảnh hưởng phiên đăng nhập của nhân viên đó.

#### 6.5 Danh sách permission (mã quyền)

| Mã | Ý nghĩa ngắn |
|----|----------------|
| `EMPLOYEE_VIEW` | Xem nhân viên theo scope (cây cấp dưới / managed) |
| `EMPLOYEE_VIEW_ALL` | Xem nhân viên toàn công ty (danh sách / chi tiết / tracking) |
| `EMPLOYEE_CREATE` | Tạo nhân viên |
| `EMPLOYEE_UPDATE` | Sửa nhân viên, reset mật khẩu |
| `EMPLOYEE_DELETE` | Xóa nhân viên |
| `ATTENDANCE_VIEW` | Xem/chấm công |
| `ATTENDANCE_VIEW_MANAGED` | Xem **Theo dõi chấm công** chỉ cấp dưới **trực tiếp** |
| `ATTENDANCE_VIEW_MANAGED_SUBTREE` | Xem **Theo dõi chấm công** cả cây quản lý (trực tiếp + gián tiếp) |
| `ATTENDANCE_EXPORT` | Xuất Excel chi tiết công (Theo dõi chấm công) — toàn công ty / kèm `EMPLOYEE_VIEW_ALL` |
| `ATTENDANCE_EXPORT_MANAGED` | Xuất Excel chỉ cấp dưới **trực tiếp** |
| `ATTENDANCE_EXPORT_MANAGED_SUBTREE` | Xuất Excel cả cây quản lý |
| `ATTENDANCE_MANUAL_UPDATE` | Sửa giờ thủ công; xóa ngày chấm công; chỉnh giờ hàng loạt |
| `LOCATION_VIEW` / `LOCATION_MANAGE` | Xem / quản lý vị trí chi nhánh |
| `LEAVE_VIEW` | Xem/tạo đơn nghỉ (gồm loại OT) |
| `LEAVE_VIEW_MANAGED` | Xem đơn nhân viên trong cây quản lý trên **Duyệt đơn xin phép** (chỉ xem; phụ thuộc `LEAVE_VIEW` trên UI phân quyền) |
| `LEAVE_APPROVE` | Duyệt đơn nghỉ (khi được chọn làm Người duyệt trên đơn) |
| `LEAVE_APPROVE_MANAGED` | Duyệt đơn nhân viên trong cây quản lý (cấp dưới trực tiếp + gián tiếp; phụ thuộc `LEAVE_APPROVE` trên UI phân quyền) |
| `LEAVE_DELETE_APPROVED` | Xóa đơn đã **duyệt** trên **Duyệt đơn xin phép** (mặc định ADMIN); người duyệt (`LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED`) cũng xóa được đơn APPROVED trong phạm vi duyệt |
| `CALENDAR_VIEW` | Xem lịch, tạo/sửa sự kiện (organizer trong service) |
| `CALENDAR_MANAGE` | Bật chế độ xem lịch toàn công ty trên Calendar |
| `CALENDAR_EDIT_ANY` | Sửa/xóa sự kiện lịch của nhân viên khác (mặc định role ADMIN) |
| `DOCUMENT_VIEW` | Xem + tự thêm/sửa/xóa giấy tờ nhân viên của mình; HR xem tất cả |
| `DOCUMENT_MANAGE` | Thêm/sửa/xóa giấy tờ toàn tổ chức + cấu hình rule thông báo hết hạn |
| `PAYROLL_VIEW` | Xem phiếu lương |
| `PAYROLL_MANAGE` | Quản lý/tính lương, cấu hình thuế |
| `PAYROLL_PERIOD_LOCK` | Khóa/mở khóa kỳ lương |
| `DEPARTMENT_VIEW` / `DEPARTMENT_MANAGE` | Xem / quản lý phòng ban |
| `POSITION_VIEW` / `POSITION_MANAGE` | Xem / quản lý chức vụ |
| `ROLE_VIEW` / `ROLE_MANAGE` | Xem / quản lý vai trò & phân quyền |
| `HOLIDAY_CONFIG_VIEW` / `HOLIDAY_CONFIG_EDIT` | Xem / sửa cấu hình ngày nghỉ |
| `APPEARANCE_VIEW` / `APPEARANCE_EDIT` | Xem / sửa **giao diện hệ thống** (`/sysConfig/settings`) |
| `WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT` | Xem / sửa ca làm việc mặc định (`/sysConfig/settings`) |

> **Giao diện hệ thống** (mặc định toàn công ty): lưu trong `app_settings` — Admin cấu hình tại **Cấu hình hệ thống → Cài đặt**; API `GET/PATCH /settings/appearance` (`APPEARANCE_*`). Màn **login** và sau **đăng xuất** luôn dùng giao diện hệ thống (`GET /settings/public/appearance`).  
> **Giao diện cá nhân:** mọi user đăng nhập — **Tài khoản** → tab **Cài đặt**; `GET/PATCH /auth/me/appearance`. Chỉ **ghi đè** hệ thống khi user đã lưu (cột `appearance_customized = true`).  
> Mã `OVERTIME_*`, `ATTENDANCE_MANAGE` đã **gỡ** — không gán lại.

---
