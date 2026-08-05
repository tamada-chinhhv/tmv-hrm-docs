---
sidebar_position: 13
---

# Câu hỏi thường gặp (FAQ)

#### 12.1 Về tài khoản

**Tôi quên mật khẩu, phải làm gì?**

Hệ thống không có “Quên mật khẩu” trên màn hình đăng nhập. Bạn liên hệ **HR hoặc IT** — họ mở hồ sơ của bạn và bấm **Reset mật khẩu**. Sau reset, mật khẩu lại **bằng tên đăng nhập** — hãy đổi mật khẩu mới ngay sau khi đăng nhập ([mục 3.4](#)).

---

**Tài khoản bị khóa, liên hệ ai?**

Phiên bản hiện tại **không có** chức năng “khóa tài khoản” riêng. Nếu không đăng nhập được:

1. Kiểm tra đúng **tên đăng nhập** (không phải email/mã EMP).
2. Thử reset mật khẩu qua HR.
3. Liên hệ IT nếu vẫn lỗi — có thể nhầm URL hoặc tài khoản chưa được tạo.

| Kênh | Thông tin (placeholder) |
|------|-------------------------|
| HR nội bộ | _[điền email/số điện thoại phòng Nhân sự]_ |
| IT hỗ trợ | _[điền email/số hotline IT]_ |

---

**Tôi muốn đổi tên đăng nhập có được không?**

**Không.** Sau khi tạo nhân viên, tên đăng nhập **không đổi được**. Nếu bắt buộc phải đổi, cần quy trình nội bộ với IT (có thể tạo hồ sơ mới — tùy chính sách công ty).

---

#### 12.2 Về nhân viên

**Tạo nhân viên xong nhưng họ không nhận được email?**

Đúng với hệ thống hiện tại — **không gửi email** tự động. HR cần gửi username/mật khẩu qua chat nội bộ, giấy bàn giao hoặc email **ngoài** HRM.

---

**Xóa nhân viên có mất dữ liệu không?**

**Có** — thao tác xóa xóa bản ghi nhân viên khỏi database. Chấm công, lương, lịch liên quan có thể bị ảnh hưởng. Nên dùng trạng thái **Nghỉ việc** thay vì xóa.

---

**Nhân viên nghỉ việc thì xử lý tài khoản thế nào?**

1. Đổi **Trạng thái làm việc** → `TERMINATED` hoặc `INACTIVE`.
2. Thu hồi quyền nhạy cảm (đổi vai trò hoặc bỏ permission qua Admin).
3. Không cần xóa username — nhân viên có thể không đăng nhập nữa; nếu vẫn đăng nhập được, nhờ IT kiểm tra thêm chính sách nghiệp vụ.

---

#### 12.3 Về lịch

**Tôi tạo lịch nhưng người tham gia không thấy?**

Kiểm tra:

1. Bạn đã **thêm họ** vào danh sách tham gia chưa?
2. Họ có chọn **đúng cột tên** trên lịch không?
3. Họ có đang xem **đúng tuần/ngày** không?
4. Họ đã **rút lui** khỏi cuộc họp trước đó chưa?

Họ vẫn nhận **thông báo trong app** khi được mời — nhắc kiểm tra biểu tượng chuông.

---

**Xóa lịch thì người tham gia có nhận thông báo không?**

**Có** — khi organizer xóa một buổi hoặc cả chuỗi, hệ thống gửi thông báo hủy cho người tham gia còn lại.

---

**Tôi bị mời vào lịch nhưng muốn từ chối, làm thế nào?**

1. Mở **Lịch** → bấm vào cuộc họp.
2. Bấm **Rút lui**.
3. Nhập **lý do** (bắt buộc) → xác nhận.

Organizer nhận thông báo bạn đã rút lui. Bạn **không** cần (và không thể) xóa cả sự kiện.

---

#### 12.4 Lỗi phổ biến và cách khắc phục

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|------------|
| **Tên đăng nhập đã tồn tại** | Hết candidate username có hậu tố | Đổi username gốc hoặc liên hệ IT — xem [3.2](#) |
| **Không có quyền thực hiện** / **Insufficient permissions** | Tài khoản thiếu permission | Xem [mục 6](/docs/roles-permissions); liên hệ Admin gán quyền |
| **Invalid username or password** | Sai user/pass | Kiểm tra Caps Lock; nhờ HR reset |
| **Trang không tải được** | Mạng, server, URL sai | Kiểm tra internet; thử `https://hrm.tamada.vn/login`; xóa cache; liên hệ IT |
| **Only the event organizer can modify** | Sửa lịch của người khác | Nhờ **người tạo** cuộc họp sửa, hoặc bạn **rút lui** nếu không tham gia |
| **Insufficient remaining leave days** | Duyệt PAID_LEAVE vượt số dư | Từ chối hoặc HR cập nhật **Ngày phép còn lại** trên hồ sơ |
| **LEAVE_APPROVE_BLOCKED_BY_OVERLAP** | Duyệt đơn trùng thời gian với đơn APPROVED khác | Xóa/điều chỉnh đơn APPROVED cũ trước (`LEAVE_DELETE_APPROVED`), rồi duyệt đơn mới |
| **LEAVE_DELETE_BLOCKED_BY_OVERLAP** | Xóa đơn APPROVED còn đơn APPROVED khác trùng thời gian | Xóa đơn APPROVED còn lại trước, hoặc điều chỉnh khoảng thời gian |
| **LEAVE_DELETE_NOT_ALLOWED** | Người dùng không phải admin / người duyệt / `LEAVE_DELETE_APPROVED` | Chỉ admin hoặc người duyệt xóa trên Duyệt đơn xin phép |
| **GEO_LOCATION_OR_WIFI_REQUIRED** khi chấm công | Chi nhánh yêu cầu xác thực nhưng client không gửi GPS/WiFi | Web: bật quyền vị trí; mobile: gửi `wifi.bssid` hoặc bật GPS |
| **OUTSIDE_OFFICE_AREA** khi chấm công | GPS ngoài bán kính / BSSID không khớp | Vào phạm vi chi nhánh hoặc nối đúng WiFi công ty; hoặc đơn **REMOTE_WORK** đã duyệt |

#### 12.2b Về chấm công & phép (bổ sung)

**Tôi check-in lúc 8:15 mà vẫn bị “Đi muộn, về sớm”?**

Hệ thống đánh **LATE_EARLY** khi muộn/sớm so **ca làm việc** (có grace) **hoặc** tổng giờ làm **dưới đơn vị công** (`workUnitLabel`, VD 8h sau trừ nghỉ trưa) — xem [mục 8.1](/docs/attendance). Ví dụ ca 8:00–17:00, trưa 60p: 8:15–16:45 = 8h30 → LATE_EARLY.

**Có ca làm việc (ca sáng/chiều) trong menu không?**

**Không** — xem [mục 8.7](#).

**Tôi là Manager, sao không duyệt được đơn của nhân viên team?**

Chỉ duyệt được nếu đơn **chọn bạn làm Người duyệt**. Không tự động theo team — xem [mục 9.5](#).

---

#### 12.5 Liên hệ hỗ trợ

| Loại hỗ trợ | Liên hệ (cập nhật bởi công ty) |
|-------------|--------------------------------|
| Nghiệp vụ HR (nhân sự, phép, hồ sơ) | _[Email / SĐT phòng HR]_ |
| Kỹ thuật (đăng nhập, lỗi hệ thống) | _[Email / SĐT IT]_ |
| Báo lỗi phần mềm | [Tạo issue GitHub](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new) |

---
