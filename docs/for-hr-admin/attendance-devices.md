---
sidebar_position: 34
---

# Máy chấm công (Hikvision)

**Khi nào dùng:** Kết nối máy chấm công vật lý (ví dụ Hikvision DS-K1T342/343) để tự động đưa giờ vào / ra vào bảng chấm công HRM, thay vì chỉ chấm trên app.

**Menu:** **Cấu hình hệ thống** → **Máy chấm công**

**Quyền:**

| Quyền | Cho phép |
|-------|----------|
| **ATTENDANCE_DEVICE_VIEW** | Xem danh sách máy, chi tiết, sự kiện, lịch đồng bộ |
| **ATTENDANCE_DEVICE_MANAGE** | Thêm / sửa / xóa máy, mapping, kiểm tra kết nối, lưu lịch đồng bộ |

---

## Hai chế độ kết nối

| Chế độ | Cách hoạt động | Khi nào chọn |
|--------|----------------|--------------|
| **Direct** | Server HRM **chủ động** kết nối tới IP máy trên LAN (ISAPI) để kéo sự kiện | Máy và server cùng mạng nội bộ; IT mở được port tới máy |
| **Push** | Máy **tự gửi** sự kiện về server khi có người chấm (HTTP Listening trên máy) | Máy không cho server poll, hoặc server ở IP khác nhưng máy gửi được HTTP tới server |

**Lưu ý Push:** sau khi tạo máy, hệ thống hiện bảng **Host / URL / Port / Protocol** — copy và dán **đúng** vào mục **Nghe HTTP** (HTTP Listening) trên máy Hikvision. URL phải trỏ tới **cổng backend** (thường `:3001`), không phải cổng website `:3000`.

---

## Lịch đồng bộ tự động

Ở đầu trang **Máy chấm công** có panel **Lịch đồng bộ tự động**:

| Cấu hình | Mặc định | Ý nghĩa |
|----------|----------|---------|
| **Chu kỳ thường** | 5 phút | Tần suất kéo sự kiện **ngoài** khung giờ ca |
| **Chu kỳ quanh giờ ca** | 1 phút | Tần suất **trước và sau** giờ vào ca / ra ca |
| **Khung quanh giờ ca** | ±30 phút | Biên thời gian áp dụng chu kỳ nhanh |

Giờ vào / ra ca lấy từ **Cấu hình hệ thống** → **Ca làm việc** (link có trong panel).

Hệ thống tự đồng bộ:

- Máy **Direct** (luôn kéo qua ISAPI).
- Máy **Push** **có lưu** tài khoản ISAPI trên HRM (kéo bổ sung ngoài luồng Push).

Máy Push **chỉ** nhận sự kiện qua HTTP Listening (không cần ISAPI) vẫn ghi nhận khi nhân viên chấm — đồng bộ chủ động chỉ thêm khi có tài khoản ISAPI.

---

## Thêm máy mới

1. **Cấu hình hệ thống** → **Máy chấm công** → **Thêm máy**.
2. Chọn **Direct** hoặc **Push**, nhập tên, IP, chi nhánh (văn phòng).
3. **Direct:** nhập username / password ISAPI trên máy (nếu có).
4. **Push:** sau khi tạo, copy cấu hình **Nghe HTTP** lên máy; **lưu token ngay** — token chỉ hiện một lần khi tạo / xoay mã.

**Kết quả mong đợi:** Máy xuất hiện trong danh sách; trạng thái chuyển **Online** khi nhận sự kiện hoặc đồng bộ thành công.

---

## Chi tiết máy (hộp thoại)

Bấm biểu tượng **Xem** trên từng dòng:

| Tab | Nội dung |
|-----|----------|
| **Tổng quan** | Trạng thái, đồng bộ, **Kiểm tra Push** (máy Push), kết quả kiểm tra |
| **Cấu hình** | Sửa tên, vị trí, chi nhánh; cập nhật ISAPI; xoay token ingest (Push) |
| **Mapping** | Gán mã người dùng trên máy → nhân viên HRM |
| **Sự kiện** | Nhật ký chấm (có phân trang) |
| **Đối soát** | Chỉ máy Direct — so sánh user trên máy với mapping |

### Kiểm tra Push / sức khỏe

- **Push:** nút **Kiểm tra Push** — kiểm tra URL ingest, sự kiện đã nhận, kéo ISAPI (nếu có tài khoản).
- **Direct:** nút **sức khỏe** trên danh sách — thử kết nối ISAPI.

Kết quả hiển thị từng dòng (xanh / vàng / đỏ), kèm URL copy được khi cần cấu hình máy.

---

## Mapping nhân viên

Mỗi lần chấm, máy gửi **mã người dùng** (ví dụ `251`). HRM cần biết mã đó là ai:

1. **Tự động:** nếu mã trùng **Mã nhân viên** (`employeeCode`) hoặc ID HRM, hệ thống tạo mapping khi có sự kiện mới.
2. **Thủ công:** tab **Mapping** → thêm khi mã trên máy khác mã HRM.

Chưa mapping → sự kiện vẫn lưu nhưng **chưa ghi** vào bảng chấm công cho đến khi mapping xong (có thể xử lý lại sự kiện chờ).

---

## Ghi vào bảng chấm công

Khi cấu hình server cho phép ghi thật (`SHADOW_MODE=false`, bật ghi chấm công):

- Lần chấm **đầu** trong ngày → **giờ vào**.
- Lần chấm **cuối** → **giờ ra**.
- Gộp với chấm app: lấy **sớm nhất** làm vào, **muộn nhất** làm ra.

Chi nhánh trên máy được dùng làm văn phòng chấm công (bỏ qua geofence app cho luồng máy).

---

## Xử lý sự cố thường gặp

| Hiện tượng | Gợi ý |
|------------|-------|
| Push: chưa nhận sự kiện | Kiểm tra **Nghe HTTP** trên máy; URL đúng IP server + cổng backend; chấm thử trên máy |
| Host hiện `localhost` | IT đặt `PUBLIC_SITE_ORIGIN` trên server (IP LAN + cổng backend), **tạo lại / xoay token** |
| ISAPI 401 khi kéo sự kiện | Sửa username / password trên tab **Cấu hình** |
| Sự kiện có nhưng không vào bảng chấm công | Kiểm tra **Mapping**; hỏi IT về chế độ shadow / ghi thật |
| Muốn đồng bộ nhanh hơn giờ cao điểm | Chỉnh **Lịch đồng bộ tự động** và **Ca làm việc** |

Chi tiết kỹ thuật server (biến môi trường, ingest): xem [Phụ lục kỹ thuật](../appendix/technical-reference.md).

---

## Liên quan

- [Cấu hình hệ thống](./system-settings.md) — ca làm việc, chi nhánh
- [Quyền hạn & phân quyền](./permissions.md) — `ATTENDANCE_DEVICE_*`
- [Báo cáo chấm công](./attendance-reports.md) — theo dõi sau khi máy ghi dữ liệu

---
