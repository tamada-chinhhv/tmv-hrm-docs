---
sidebar_position: 50
---

# Phụ lục kỹ thuật

Phần này dành cho IT / Admin cần tra cứu nhanh. Người dùng thường có thể bỏ qua.

#### 6.1 Địa chỉ hệ thống

| Môi trường | URL |
|------------|-----|
| Production | https://hrm.tamada.vn/ |
| Đăng nhập | https://hrm.tamada.vn/login |

#### 6.2 Một số mã lỗi thường gặp (thông báo hệ thống)

| Hiện tượng / mã | Cách xử lý gợi ý |
|-----------------|------------------|
| Ngoài khu vực văn phòng / `OUTSIDE_OFFICE_AREA` | Vào phạm vi GPS hoặc đúng WiFi chi nhánh |
| Thiếu vị trí / WiFi khi chấm | Bật GPS hoặc gửi thông tin WiFi (mobile) |
| Không đủ quyền xóa đơn đã duyệt | Chỉ admin / người duyệt được phép |
| Kỳ lương đã khóa | Mở khóa kỳ (nếu có quyền) trước khi sửa phiếu |
| Trùng / vượt giờ OT | Điều chỉnh giờ hoặc nhân viên trên đơn tăng ca |

#### 6.4 Máy chấm công (Hikvision) — ghi chú IT

| Biến / cấu hình | Ý nghĩa |
|-----------------|--------|
| `PUBLIC_SITE_ORIGIN` | URL công khai mà máy Push gửi tới (IP LAN + cổng **backend**, ví dụ `http://192.168.x.x:3001`). Sau khi đổi phải **xoay token** trên HRM. |
| `ATTENDANCE_DEVICE_SYNC_ENABLED` | Bật/tắt job đồng bộ tự động (mặc định bật). Chu kỳ chi tiết cấu hình trên FE: **Máy chấm công** → **Lịch đồng bộ**. |
| `ATTENDANCE_DEVICE_SHADOW_MODE` | `true`: chỉ ghi log sự kiện, chưa cập nhật bảng chấm công. |
| `ATTENDANCE_DEVICE_WRITE_TO_ATTENDANCE` | `true` (và shadow tắt): ghi giờ vào/ra thật vào `attendances`. |
| `DEVICE_CREDENTIAL_ENCRYPTION_KEY` | Bắt buộc production để lưu mật khẩu ISAPI mã hóa. |

Hướng dẫn người dùng: [Máy chấm công](../for-hr-admin/attendance-devices.md).

#### 6.5 Ghi chú kiến trúc (cho dev)

- FE: `tmv-hrm` · BE: `tmv-hrm-be`
- Tăng ca theo batch: `/time/overtime-batches` và luồng duyệt TP/GĐ (không dùng menu OT đơn lẻ cũ trên sidebar chính)
- Báo lỗi sản phẩm: [GitHub Issues](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new)
