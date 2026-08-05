---
sidebar_position: 8
---

# Tài khoản (`/account`)

Mọi người đăng nhập đều truy cập được (sidebar **Tài khoản** hoặc menu user).

| Tab | Nội dung |
|-----|----------|
| **Thông tin** | Hồ sơ của tôi — sửa họ tên, email, điện thoại, … (không đổi username, phòng ban, vai trò) |
| **Cài đặt** | Giao diện: chế độ **Sáng/Tối** (lưu ngay), màu chủ đạo, phông chữ (bấm **Lưu** để đồng bộ server) |
| **Giấy tờ** | Tự quản lý giấy tờ nhân viên của mình (cần `DOCUMENT_VIEW`) — chi tiết [mục 7.2.1](#) |

- URL tab Cài đặt: `/account?tab=settings`
- URL tab Giấy tờ: `/account?tab=documents`
- Nút sáng/tối trên thanh header cũng lưu vào cấu hình cá nhân (đánh dấu đã tùy chỉnh)
- Chưa tự lưu giao diện → app dùng **giao diện hệ thống**; sau khi Lưu hoặc đổi sáng/tối → ưu tiên cài đặt cá nhân
- Người dùng **không** có `EMPLOYEE_VIEW` mở **Nhân viên** sẽ được chuyển sang **Tài khoản** thay vì tab Hồ sơ cũ
