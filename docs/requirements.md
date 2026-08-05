---
sidebar_position: 3
---

# Yêu cầu trước khi sử dụng

#### 2.1 Trình duyệt hỗ trợ

Dùng trình duyệt **phiên bản mới** trên máy tính hoặc điện thoại:

| Trình duyệt | Khuyến nghị |
|-------------|-------------|
| Google Chrome | Có |
| Microsoft Edge | Có |
| Mozilla Firefox | Có |
| Safari (macOS / iOS) | Có |

**Chấm công theo vị trí:** Hệ thống xác thực **GPS trong bán kính chi nhánh** hoặc **WiFi văn phòng (khớp BSSID)** — chỉ cần **một** trong hai. Trên **web**, trình duyệt cần cho phép **quyền vị trí (Location)**; trình duyệt **không** đọc được BSSID WiFi nên web chỉ dùng GPS. Trên **app mobile** (khi tích hợp), client gửi `wifi.ssid` + `wifi.bssid` từ thiết bị.

**Kết quả mong đợi:** Trang HRM mở bình thường, form đăng nhập hiển thị đầy đủ.

#### 2.2 Quyền truy cập cần có

| Yêu cầu | Giải thích |
|---------|------------|
| **Tài khoản HRM** | HR hoặc Admin tạo hồ sơ nhân viên — khi đó hệ thống tự tạo tên đăng nhập |
| **Tên đăng nhập & mật khẩu** | Do bộ phận HR/IT cấp lần đầu |
| **Vai trò & phân quyền** | Quyết định menu và thao tác bạn được phép (ví dụ: chỉ xem lương của mình hay quản lý toàn bộ) |
| **Mạng nội bộ / Internet** | Truy cập được máy chủ HRM (URL bên dưới) |

Nhân viên mới **không tự đăng ký** — cần HR tạo hồ sơ trước.

#### 2.3 URL đăng nhập

| Môi trường | URL |
|------------|-----|
| **Hệ thống chính (production)** | [https://hrm.tamada.vn/](https://hrm.tamada.vn/) |
| **Trang đăng nhập** | [https://hrm.tamada.vn/login](https://hrm.tamada.vn/login) |

Sau khi đăng nhập thành công, hệ thống chuyển bạn tới trang **Chấm công** (`/time/attendance`) hoặc trang bạn đang cố mở trước đó (nếu bị chuyển về login giữa chừng).

---
