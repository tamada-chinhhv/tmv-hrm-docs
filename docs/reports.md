---
sidebar_position: 11
---

# Báo cáo chấm công & nghỉ phép

> Task 12 — dành HR / Manager.

#### 10.1 Các loại báo cáo / tổng hợp hiện có

| Báo cáo / màn hình | Mô tả | Ai xem được | Lọc |
|--------------------|--------|-------------|-----|
| **Chấm công** (dashboard cá nhân) | Lịch tháng, tổng ngày làm, phép có/không lương, lễ | Nhân viên (`ATTENDANCE_VIEW`) | Tháng |
| **Theo dõi chấm công** | Lưới cả tháng theo nhân viên | `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE` + scope | Tháng, tên, phòng ban |
| **Chi tiết 1 nhân viên** | `/attendance-tracking/{id}` | Self / team / Admin | Tháng |
| **Tổng quan — biểu đồ nghỉ phép/OT** | Số đơn chờ, ngày phép đã duyệt; **giờ OT** = tổng đơn `OVERTIME` **APPROVED** trong tháng (không tự tính từ chấm công) | `LEAVE_VIEW` + dashboard | — |
| **Today summary** | Tổng hợp chấm công hôm nay (muộn/vắng, …) | Nội bộ API | — |
| **Export Working time detail** | File Excel chi tiết công tháng | `ATTENDANCE_EXPORT` / `ATTENDANCE_EXPORT_MANAGED` / `ATTENDANCE_EXPORT_MANAGED_SUBTREE` (scope theo quyền) | Tháng (query) |
| **Báo cáo nghỉ phép riêng PDF/CSV** | **Không có** | — | — |

---

#### 10.2 Xem báo cáo tổng hợp tháng

1. **Quản lý / HR:** **Theo dõi chấm công** → chọn **tháng/năm**.
2. Lọc **phòng ban** và/hoặc **tên**.
3. Đọc lưới từng ngày + cột **tổng** cuối bảng.
4. Chuyển **Đơn vị** Day/Hour (ngày: `1`, `F`, `A`…; giờ: `8h` cho ngày làm).

**Chỉ số trên dashboard cá nhân** (`/time/attendance`):

| Chỉ số | Ý nghĩa |
|--------|---------|
| Ngày làm việc kỳ vọng | Ngày làm trong tháng (trừ lễ/cuối tuần theo config) |
| Ngày đã làm / worked | Ngày có công WORK / tương đương |
| Nghỉ có lương / không lương | Quy đổi từ giờ đơn đã duyệt (÷ 8) |
| Ngày lễ | Từ holiday config |

**Lưu ý:** Widget **đi muộn hôm nay** trên dashboard (`getTodaySummary.late`) = đếm theo **đánh giá trực tiếp** (có tính đơn đến muộn/về sớm đã duyệt), **không** ghi DB khi mở dashboard. Cột `status` trong DB nên đồng bộ bằng `yarn recompute-attendance` sau triển khai.

---

#### 10.3 Xuất báo cáo

| Định dạng | Có? |
|-----------|:---:|
| **Excel (.xlsx)** | Có |
| PDF | Không |
| CSV | Không |

**Các bước xuất:**

1. Vào **Theo dõi chấm công**.
2. Chọn **tháng**, lọc phòng ban/tên (nếu cần).
3. Bấm nút **Export** / xuất Excel.
4. Tải file `.xlsx`.

**Cột tiêu biểu trong file:** mã NV, họ tên, phòng ban, từng ngày (phút vào/ra hoặc mã), tổng phút, mã chú thích (7=vắng, 8=muộn, 9=sớm theo legend file), ngày phép còn lại, v.v.

---

#### 10.4 Đối soát cuối tháng (HR)

##### Dữ liệu “chưa chốt” vs “đã chốt”

| Phạm vi | Chưa chốt | Đã chốt trong HRM |
|---------|-----------|-------------------|
| **Chấm công & đơn phép** | Mọi tháng vẫn **sửa được** nếu có quyền: chấm công, manual-time, tạo/sửa đơn, duyệt đơn | **Không** có khóa tháng chấm công trong hệ thống (backlog Phase 2b) |
| **Kỳ lương (Payroll)** | Kỳ **Đang mở** — tạo/sửa/nhập/sao chép phiếu lương | Kỳ **Đã khóa** — bảng `payroll_periods`, nút **Khóa kỳ** / **Mở khóa** trên **Payroll**; API `POST /payroll/periods/:year/:month/lock` và `unlock` (`PAYROLL_MANAGE` hoặc `PAYROLL_PERIOD_LOCK`) |

HR vẫn nên **đối soát chấm công** theo checklist bên dưới trước khi khóa kỳ lương và chạy bảng lương ([mục 11.3](#)).

##### Checklist đối soát cuối tháng (HR)

- [ ] Mở **Theo dõi chấm công** đúng **tháng** cần chốt
- [ ] Lọc từng **phòng ban** hoặc xuất **Excel** toàn công ty
- [ ] Rà **ô `F`** (quên chấm) → yêu cầu bổ sung chấm / đơn ATTENDANCE_CORRECTION / manual-time
- [ ] Rà **ô `A`** (vắng) → xác nhận nghỉ không phép hay thiếu đơn
- [ ] Rà **ô vàng / LATE_EARLY** → xác nhận đủ **đơn vị công** (`workUnitLabel`) hay cần xử lý
- [ ] Kiểm tra đơn **PENDING** trên **Duyệt đơn xin phép** — duyệt hoặc từ chối trước khi tính lương
- [ ] Đối chiếu **remainingLeaveDays** với đơn **PAID_LEAVE** đã duyệt trong tháng
- [ ] Xuất **Excel** lưu làm bằng chứng đối soát (file có timestamp tải về)
- [ ] Chuyển sang module **Payroll** khi dữ liệu công đã nhất quán
- [ ] Trên **Payroll**, chọn đúng tháng/năm → **Khóa kỳ** sau khi hoàn tất phiếu lương (hoặc trước khi phát hành — theo quy trình công ty)
- [ ] (Tùy chọn) Ghi nhận nội bộ đối soát chấm công (email/biên bản) — **không** thay thế khóa kỳ lương trên hệ thống

**Kết quả mong đợi:** HR không bỏ sót đơn chờ, thiếu công, hoặc sai phép trước khi tính lương.

---
