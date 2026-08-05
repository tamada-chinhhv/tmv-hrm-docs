---
sidebar_position: 6
---

# Lịch & Lịch trình

#### 5.1 Giới thiệu tính năng Lịch

**Lịch** trong HRM dùng để **lên lịch cuộc họp / sự kiện** giữa các nhân viên: xem khung giờ bận, tạo cuộc họp, mời người tham gia, nhận thông báo khi có thay đổi.

**Không nhầm với:**

- Lịch chấm công theo tháng (trong **Theo dõi chấm công**).
- Cấu hình ngày nghỉ lễ (trong **Cấu hình ngày nghỉ**).

**Loại sự kiện trên lịch lịch trình:**

| Loại | Mô tả |
|------|--------|
| **Cuộc họp / sự kiện** | Bản ghi chính trên lịch — có tiêu đề, giờ, địa điểm, người tổ chức, người tham gia |
| **Lặp lại** | Chuỗi cuộc họp theo ngày làm việc, theo thứ trong tuần, hoặc danh sách ngày chọn |

> Chú thích màu trên trang Lịch (Họp / Nghỉ phép / Ngày lễ) là **chú thích minh họa** — trên lưới giờ hiện chỉ hiển thị **cuộc họp**; nghỉ phép và ngày lễ xem ở module Chấm công / Cấu hình ngày nghỉ.

#### 5.2 Hướng dẫn xem lịch

1. Menu **Lịch** → `/calendar`.
2. **Chọn nhân viên** cần xem (mặc định là bạn; có thể chọn nhiều người, chọn theo phòng ban).
3. Mỗi nhân viên một **cột** — sự kiện hiện trên cột người **tổ chức** hoặc cột người **tham gia**.

**Chế độ xem:**

| Chế độ | Mô tả |
|--------|--------|
| **Tuần** | Mặc định — lưới theo tuần |
| **Ngày** | Một ngày chi tiết theo giờ |
| **Tháng** | **Chưa có** trên phiên bản hiện tại |

**Điều hướng:**

| Nút / Thao tác | Tác dụng |
|----------------|----------|
| **Trước / Sau** | Tuần hoặc ngày trước/sau |
| **Hôm nay** | Về ngày hiện tại |
| **DatePicker** | Nhảy tới ngày bất kỳ |

**Màu sắc:**

- Mỗi **nhân viên (cột)** có màu riêng (tự động theo danh sách).
- **Viền thẻ sự kiện** dùng màu của **người tổ chức** cuộc họp.

**Kết quả mong đợi:** Bạn thấy khung giờ và các cuộc họp của người đã chọn trong khoảng thời gian đang xem.

#### 5.3 Tạo cuộc họp mới

**Cách 1 — Bấm khung giờ trống**

1. Chỉ bấm được trên **cột của chính bạn** (không tạo họp trên cột người khác).
2. Chọn khung giờ → form tạo sự kiện mở sẵn ngày/giờ.

**Cách 2 — Nút thêm (nếu có trên giao diện)**

Mở form và điền thủ công.

**Các bước trong form:**

1. **Tiêu đề** — bắt buộc.
2. **Người tham gia** — bắt buộc có **bạn** trong danh sách; thêm đồng nghiệp bằng tìm theo tên (danh sách toàn công ty đang hoạt động).
3. **Ngày**, **Giờ bắt đầu**, **Giờ kết thúc** — kết thúc phải sau bắt đầu.
4. **Địa điểm** — tùy chọn.
5. **Lặp lại** (tùy chọn) — xem mục 5.4.
6. Bấm **Lưu**.

**Người tổ chức (organizer):** Luôn là **bạn** — không chọn người khác làm chủ cuộc họp trên form.

**Kết quả mong đợi:** Cuộc họp xuất hiện trên lịch; người được mời nhận **thông báo trong hệ thống** (chuông thông báo).

#### 5.4 Sự kiện lặp lại

Bật **Lặp lại** khi tạo mới (không chỉnh sửa chuỗi lặp trên form — sửa/xóa từng buổi hoặc cả chuỗi sau khi tạo).

| Kiểu lặp | Ý nghĩa |
|----------|---------|
| **Ngày làm việc** | Lặp các ngày đi làm, **trừ** ngày nghỉ theo cấu hình ngày nghỉ công ty |
| **Theo thứ trong tuần** | Chọn thứ (T2–CN) lặp hàng tuần |
| **Ngày đã chọn** | Chọn từng ngày cụ thể trên lịch |

Hệ thống sinh các buổi trong tầm **12 tuần** tính từ tuần đang xem (có thể mở rộng thêm phía sau nếu chuỗi chưa có ngày kết thúc).

**Kết quả mong đợi:** Nhiều ô sự kiện cùng tiêu đề trên các ngày theo quy tắc lặp.

#### 5.5 Quyền hạn trên lịch

Thiết kế theo nguyên tắc: **ai tạo thì người đó quản lý**; **người được mời chỉ phản hồi bằng cách tham gia hoặc rút lui**; user có **`CALENDAR_VIEW`** (mặc định vai trò `EMPLOYEE` sau seed/migrate) được **xem** lịch người khác để sắp lịch họp. Menu **Calendar** (`/calendar`) yêu cầu `CALENDAR_VIEW`.

##### Người tạo / tổ chức (Organizer)

| Quyền | Được? | Vì sao thiết kế vậy? |
|-------|:-----:|----------------------|
| Xem chi tiết sự kiện mình tạo | Có | Chủ cuộc họp cần nắm thông tin |
| Sửa tiêu đề, giờ, địa điểm, người tham gia | Có | Chỉ chủ cuộc họp mới nên thay đổi nội dung — tránh người khác sửa nhầm lịch của bạn |
| Kéo thả đổi giờ trên lưới | Có (cột của mình) | Tiện điều chỉnh nhanh |
| Xóa một buổi hoặc cả chuỗi lặp | Có | Hủy cuộc họp do mình chủ trì |
| **Rút lui** khỏi cuộc họp | **Không** | Người tổ chức không “rút lui” — muốn hủy thì **xóa** sự kiện |

##### Người được mời (Participant)

| Quyền | Được? | Vì sao? |
|-------|:-----:|---------|
| Xem chi tiết cuộc họp | Có | Cần biết giờ, địa điểm, chủ trì |
| Sửa / xóa sự kiện | **Không** | Tránh thay đổi lịch của người khác |
| **Rút lui** (Leave meeting) | Có | Bạn từ chối tham gia nhưng không xóa cuộc họp của người khác — cần nhập **lý do** (gửi cho organizer) |
| Mời thêm người | **Không** | Chỉ organizer thêm/bớt danh sách |
| Chấp nhận/Từ chối nút RSVP kiểu Outlook | **Không** (phiên bản hiện tại) | Thay bằng thao tác **Rút lui** + thông báo |

##### Admin / HR

| Quyền | Được? | Ghi chú |
|-------|:-----:|---------|
| Xem lịch mọi nhân viên | Có | Giống mọi user đã đăng nhập |
| Sửa/xóa lịch của người khác | **Có** (cần `CALENDAR_EDIT_ANY`) | Role `ADMIN` có sẵn sau migrate; role khác cần Admin gán qua **Phân quyền** |
| Bật “xem tất cả nhân viên” trên lịch | Có (tùy chọn) | Cần `CALENDAR_MANAGE` — switch trên trang **Calendar** |

> **Tóm lại:** Admin/HR có `CALENDAR_EDIT_ANY` có thể sửa/xóa cuộc họp của nhân viên khác (hỗ trợ vận hành). Người dùng thường chỉ sửa sự kiện mình tạo (organizer).

#### 5.6 Thông báo và nhắc nhở

| Sự kiện | Ai nhận thông báo |
|---------|-------------------|
| Được mời tham gia cuộc họp mới | Người tham gia (trừ organizer) |
| Bị gỡ khỏi danh sách tham gia | Người bị gỡ |
| Người tham gia **rút lui** | Organizer |
| Organizer **xóa** một buổi | Người tham gia còn lại |
| Organizer **xóa cả chuỗi** lặp | Người tham gia còn lại |

**Cách nhận:** Biểu tượng **chuông** trên thanh trên → danh sách thông báo; có thể hỗ trợ **Web Push** nếu IT bật cấu hình máy chủ.

**Nhắc nhở trước giờ họp (reminder):** Có — scheduler gửi thông báo **~15 phút** trước giờ bắt đầu (cron mỗi 5 phút, múi giờ `Asia/Ho_Chi_Minh`). Người nhận: organizer và người tham gia. Giờ trong thông báo khớp lưới lịch (xem §5.8).

**Kết quả mong đợi:** Khi có thay đổi liên quan đến bạn, thông báo xuất hiện trong HRM (và có thể push trình duyệt).

#### 5.7 Xem, sửa, xóa, rút lui — tóm tắt thao tác

| Thao tác | Cách làm |
|----------|----------|
| Xem chi tiết | Bấm vào ô sự kiện trên lịch |
| Sửa | Chi tiết → **Chỉnh sửa** (organizer, hoặc user có `CALENDAR_EDIT_ANY`) |
| Xóa | Chi tiết → **Xóa** → chọn **một buổi** hoặc **cả chuỗi** |
| Rút lui | Chi tiết → **Rút lui** → nhập lý do → xác nhận |

#### 5.8 Múi giờ và hiển thị giờ trên lịch

| Mục | Quy ước |
|-----|---------|
| Múi giờ nghiệp vụ | **`Asia/Ho_Chi_Minh`** (UTC+7) |
| Lưu API/DB | **Giờ VN trong UTC slot** — ví dụ họp 09:00 VN → `startAt`: `…T09:00:00.000Z` |
| Lưới lịch & dialog (web) | Đọc **thành phần UTC** của `startAt`/`endAt` là giờ hiển thị (09:00 trên lưới = `T09:00:00.000Z`) |
| Thông báo / reminder (BE) | Cùng quy ước — `formatVietnamStorageDateTime` (`src/shared/vietnam-storage.util.ts`) |
| Thời điểm gửi reminder | Quy đổi sang instant VN thật (`vietnamStorageDateToInstant`) rồi so với cửa sổ 15 phút |

**Kết quả mong đợi:** Giờ trên lưới, dialog chi tiết và thông báo nhắc họp **khớp nhau**; không cộng/trừ thêm +7h khi hiển thị.

---
