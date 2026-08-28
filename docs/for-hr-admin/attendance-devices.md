---
sidebar_position: 34
---

# Máy chấm công (Hikvision)

**Khi nào dùng:** Kết nối máy chấm công tại văn phòng để giờ vào / ra tự động vào bảng chấm công HRM, bên cạnh chấm trên app.

**Menu:** **Cấu hình hệ thống** → **Máy chấm công**

**Quyền:** cần quyền xem hoặc quản lý máy chấm công (xem [Quyền hạn & phân quyền](./permissions.md)).

---

## Hai cách kết nối

| Phương thức trên màn hình | Cách hoạt động | Khi nào chọn |
|---------------------------|----------------|--------------|
| **Kết nối trực tiếp** | Hệ thống **chủ động lấy** dữ liệu từ máy qua mạng nội bộ | Máy và server cùng LAN; IT mở được kết nối tới máy |
| **Máy tự gửi dữ liệu** | Máy **tự gửi** về hệ thống mỗi khi có người chấm | Máy không cho hệ thống kết nối vào, hoặc server ở mạng khác |

**Lưu ý với máy tự gửi dữ liệu:** sau khi thêm máy, copy bảng **Cấu hình nhận dữ liệu từ máy** (tên máy chủ, URL, cổng, giao thức) và dán vào mục **HTTP Listening** trên máy Hikvision. **Lưu mã URL ngay** — mã chỉ hiện một lần khi tạo hoặc **Tạo mã mới**.

Máy tự gửi dữ liệu **không bắt buộc** nhập thông tin đăng nhập ISAPI vẫn nhận chấm công qua HTTP Listening. Nếu **có thêm** thông tin đăng nhập, hệ thống có thể lấy dữ liệu bổ sung theo lịch (giống kết nối trực tiếp).

---

## Khi máy chấm công nằm trong mạng nội bộ

Máy chấm công có thể có IP nội bộ (ví dụ `192.168.110.117`). Đây chỉ là địa chỉ **trong văn phòng**, không phải địa chỉ HRM nhận dữ liệu.

Nếu máy chủ HRM chạy **ngoài** mạng văn phòng (cloud/VPS), máy chủ **không thể** tự kết nối ISAPI tới IP LAN đó. Trong trường hợp này, chọn **Máy tự gửi dữ liệu**:

```text
Máy chấm công (LAN)
       │ HTTPS outbound
       ▼
https://hrm.tamada.vn/api/d/e/<token>
       ▼
HRM nhận sự kiện chấm công
```

- **Không cần** mở cổng từ Internet vào máy chấm công.
- **Không cần** cho máy chủ HRM truy cập trực tiếp IP LAN của máy.
- **Cần** mạng văn phòng cho phép máy ra HTTPS tới domain công khai của HRM.

Sau khi tạo máy, copy **Cấu hình nhận dữ liệu** (hostname `hrm.tamada.vn`, URL `/api/d/e/<token>`, cổng `443`, HTTPS) vào mục **HTTP Listening** trên máy Hikvision. **Lưu token ngay** — chỉ hiện một lần.

**Kết nối trực tiếp** chỉ dùng khi máy chủ HRM **truy cập được** IP máy (cùng LAN, VPN site-to-site, hoặc NAT có kiểm soát).

---

## Lịch đồng bộ tự động

Ở đầu trang **Máy chấm công** → **Lịch đồng bộ tự động**:

| Cấu hình | Mặc định | Ý nghĩa |
|----------|----------|---------|
| **Chu kỳ đồng bộ thông thường** | 5 phút | Tần suất lấy dữ liệu **ngoài** khung giờ ca |
| **Chu kỳ đồng bộ gần giờ vào/ra ca** | 1 phút | Tần suất **trước và sau** giờ vào / ra ca |
| **Khoảng thời gian đồng bộ nhanh** | ±30 phút | Biên áp dụng chu kỳ nhanh |

Giờ ca lấy từ **Ca làm việc** (link trong panel).

---

## Thêm máy mới

1. **Máy chấm công** → **Thêm máy chấm công**.
2. Chọn phương thức kết nối, nhập tên, IP, chi nhánh.
3. **Kết nối trực tiếp:** nhập tên đăng nhập / mật khẩu trên máy.
4. **Máy tự gửi dữ liệu:** sau khi tạo, cấu hình HTTP Listening trên máy; lưu mã URL.

**Kết quả mong đợi:** Máy xuất hiện trong danh sách; trạng thái **Đang hoạt động** khi đã nhận sự kiện hoặc đồng bộ thành công.

---

## Chi tiết máy

Bấm **Xem chi tiết** trên từng dòng:

| Tab | Dùng để |
|-----|---------|
| **Tổng quan** | Trạng thái, kiểm tra kết nối, **Đồng bộ ngay** |
| **Cấu hình** | Sửa tên, chi nhánh; thông tin đăng nhập; tạo mã URL mới |
| **Liên kết nhân viên** | Gán mã trên máy → nhân viên HRM |
| **Sự kiện chấm công** | Xem nhật ký chấm và trạng thái xử lý |
| **Đối soát** | Chỉ máy kết nối trực tiếp — so người dùng trên máy với liên kết |

### Kiểm tra kết nối và đồng bộ

| Nút | Làm gì | Có ghi vào bảng chấm công? |
|-----|--------|----------------------------|
| **Kiểm tra kết nối gửi dữ liệu** (máy tự gửi) | Xem cấu hình URL, sự kiện đã nhận, cảnh báo | **Không** |
| **Kiểm tra kết nối** (danh sách máy, kết nối trực tiếp) | Thử kết nối tới máy | **Không** |
| **Đồng bộ ngay** | Lấy và xử lý sự kiện (kể cả đang chờ) | **Có** (khi hệ thống đã bật ghi chấm công) |

Nếu kiểm tra báo còn sự kiện **Chờ xử lý** — bình thường; bấm **Đồng bộ ngay** để xử lý.

---

## Liên kết nhân viên

Mỗi lần chấm, máy gửi **mã người dùng trên máy** (ví dụ `251`):

1. **Tự động:** mã trùng **mã nhân viên** hoặc **ID nhân viên** trong HRM → hệ thống tạo liên kết khi có sự kiện mới.
2. **Thủ công:** tab **Liên kết nhân viên** → **Thêm liên kết** khi mã trên máy khác mã HRM.

Chưa liên kết → sự kiện vẫn lưu ở tab **Sự kiện chấm công** nhưng **chưa vào bảng chấm công**. Sau khi liên kết xong, bấm **Đồng bộ ngay**.

---

## Cách ghi giờ vào bảng chấm công

- Lần chấm **đầu** trong ngày → **giờ vào**; lần **cuối** → **giờ ra**.
- **Gộp với chấm app:** sớm nhất = vào, muộn nhất = ra.
- Hỗ trợ chấm **khuôn mặt, thẻ, vân tay** (tùy cấu hình máy).
- Chi nhánh gắn với máy được dùng làm văn phòng chấm công — **không cần** GPS / WiFi như app.
- Nhiều lần chấm trong **cùng một phút lịch Việt Nam** (cùng user, cùng máy) được gom thành **một** sự kiện hiển thị/xử lý. Chi tiết: [Phụ lục kỹ thuật](../appendix/technical-reference.md).

### Trạng thái trên tab Sự kiện chấm công

| Trạng thái | Ý nghĩa ngắn |
|------------|--------------|
| **Chờ xử lý** | Đã nhận, chưa xử lý xong |
| **Chế độ kiểm thử** | Đã thử xử lý nhưng **chưa ghi** bảng chấm công |
| **Đã xử lý** | Đã ghi bảng chấm công |
| **Xử lý thất bại** | Có lỗi — thử **Đồng bộ ngay** hoặc liên hệ IT |
| **Đã bỏ qua** | Không phải lần chấm công hợp lệ |

Nếu tab **Sự kiện chấm công** có dữ liệu nhưng bảng chấm công trống, thường do **chế độ kiểm thử** (IT chưa bật ghi thật) hoặc **chưa liên kết nhân viên**. Chi tiết kỹ thuật: [Phụ lục kỹ thuật](../appendix/technical-reference.md).

---

## Xóa máy

Xóa máy trên màn hình sẽ **ngừng hoạt động** máy đó (ẩn khỏi danh sách, mã URL hết hiệu lực). **Lịch sử sự kiện và chấm công đã ghi được giữ** để tra cứu.

---

## Xử lý sự cố thường gặp

| Hiện tượng | Gợi ý |
|------------|-------|
| Máy tự gửi: chưa nhận sự kiện | Kiểm tra HTTP Listening trên máy; URL đúng IP server; chấm thử trên máy |
| Tên máy chủ hiện `localhost` | Nhờ IT cấu hình lại, sau đó **Tạo mã mới** |
| Không kết nối được máy | Kiểm tra tên đăng nhập / mật khẩu tab **Cấu hình** |
| Có sự kiện, chưa vào bảng chấm công | **Liên kết nhân viên**; **Đồng bộ ngay**; hỏi IT về chế độ kiểm thử |
| Chấm khuôn mặt được, thẻ/vân tay không | Kiểm tra tab **Sự kiện chấm công**; cấu hình máy; **Đồng bộ ngay** |
| Báo cáo chậm cập nhật (kết nối trực tiếp) | Chờ 1–5 phút theo lịch đồng bộ, hoặc **Đồng bộ ngay** |

---

## Liên quan

- [Cấu hình hệ thống](./system-settings.md) — ca làm việc, chi nhánh
- [Báo cáo chấm công](./attendance-reports.md)
- [Chấm công vào / ra](../for-employees/check-in-out.md) — hướng dẫn cho nhân viên

---
