---
sidebar_position: 11
---

# Giấy tờ (`/org/documents`)

Quản lý giấy tờ **nhân viên** và **công ty** (PDF): có ngày hết hạn (kèm nhắc tự động) hoặc **vô thời hạn**.

| Quyền | Việc làm được |
|-------|----------------|
| `DOCUMENT_VIEW` | Xem + tự thêm/sửa/xóa giấy tờ nhân viên của mình (`/account?tab=documents`); HR xem tất cả |
| `DOCUMENT_MANAGE` | Thêm/sửa/xóa toàn tổ chức (mọi giấy tờ), tải lên PDF, cấu hình rule thông báo |

**Thêm giấy tờ (HR):**

1. Menu **Tổ chức** → **Giấy tờ** → **Thêm giấy tờ**.
2. Chọn loại chủ sở hữu: **Nhân viên** hoặc **Công ty** (Công ty → không chọn nhân viên).
3. Tải lên PDF — hệ thống cố gắng đọc **ngày hết hạn** và (nếu Nhân viên) khớp **họ tên + ngày sinh** với hồ sơ.
4. Có ngày hết hạn: kiểm tra/sửa ngày; chọn nhắc trước **1 / 3 / 7 / 30** ngày (mặc định 30). **Vô thời hạn (không hết hạn):** bật checkbox → không nhập ngày hết hạn, không gửi nhắc.
5. Bấm **Thêm** để lưu.

**Nhân viên tự quản lý:** tab **Tài khoản → Giấy tờ** — thêm/sửa/xóa giấy tờ **của mình** (không tạo giấy tờ công ty; rule thông báo dùng mặc định).

**Cấu hình người nhận:** **Cài đặt** → **Thông báo giấy tờ** (`/settings/document-notifications`) — chọn phòng ban áp dụng và danh sách người nhận. Nhân viên sở hữu vẫn nhận nếu bật tùy chọn tương ứng.

**Nhắc nhở:** cron 7:00 (T2–T6, giờ VN) gửi thông báo đúng mốc đã chọn; nếu đã hết hạn thì nhắc hàng ngày cho đến khi cập nhật/xóa giấy tờ. Giấy tờ **vô thời hạn** không vào cron nhắc.
