---
sidebar_position: 34
---

# Quản lý tăng ca (sửa hàng loạt)

**Khi nào dùng:** HR cần sửa trực tiếp các đợt tăng ca **đã được duyệt** — sửa lỗi, cập nhật hàng loạt — mà không phải gửi duyệt lại.

## Sửa hàng loạt tăng ca là gì?

Bình thường, đơn tăng ca phải qua trưởng phòng và giám đốc duyệt; sau khi duyệt thì không sửa được nữa. Tính năng sửa hàng loạt cho phép HR được cấp quyền **sửa trực tiếp** các bản ghi đã duyệt. Hữu ích khi:

- **Sửa lỗi** — sai giờ, sai ngày, sai thông tin nhân viên.
- **Cập nhật hàng loạt** — sửa nhiều đợt tăng ca cùng lúc thay vì từng đơn.
- **Điều chỉnh bản ghi đã duyệt** — thay đổi mà không cần gửi duyệt lại.
- **Xử lý tình huống đặc biệt** — thay đổi gấp theo yêu cầu quản lý.

## Ai dùng được?

Chỉ người có quyền **OT_BATCH_EDIT_ANY**.

Kiểm tra quyền: **Cấu hình hệ thống** → **Phân quyền** → tìm vai trò / người dùng của bạn → xem có **OT_BATCH_EDIT_ANY** trong danh sách quyền không. Nếu chưa có, liên hệ quản trị hệ thống. Xem thêm trang [Quyền hạn & phân quyền](./permissions.md).

## Các bước sửa

1. **Chấm công & Thời gian** → **Quản lý tăng ca** — danh sách tất cả các đợt tăng ca hiển thị.
2. Tìm đợt cần sửa (tìm theo ngày, phòng ban hoặc tên nhân viên) → bấm mở.
3. Chỉnh sửa:
   - **Ngày làm** — đổi ngày thực hiện tăng ca.
   - **Giờ** — sửa giờ bắt đầu / kết thúc của từng nhân viên (số giờ tự tính lại).
   - **Loại ca** — ngày thường / ngày lễ / ngày nghỉ.
   - **Nội dung công việc / ghi chú** — cập nhật lý do, loại công việc.
   - **Thêm / bớt nhân viên** trong đợt.
4. Kiểm tra kỹ → bấm **Lưu**. Thay đổi có hiệu lực **ngay lập tức**, không cần duyệt lại.

## Khác gì đơn tăng ca thường?

| | Đơn tăng ca thường | Sửa hàng loạt |
|---|---|---|
| **Cách bắt đầu** | Tạo mới từ đầu | Sửa bản ghi có sẵn |
| **Duyệt** | Trưởng phòng & giám đốc duyệt | Không cần duyệt |
| **Ai thực hiện** | Nhân viên, quản lý | HR có quyền OT_BATCH_EDIT_ANY |
| **Khi nào dùng** | Đăng ký tăng ca mới | Sửa lỗi, điều chỉnh |
| **Thời gian** | Chờ duyệt | Có hiệu lực ngay |

**Kết quả mong đợi:** Bản ghi tăng ca được cập nhật ngay; lịch sử ghi lại ai sửa, sửa gì.

## Lưu ý quan trọng

- **Bạn chịu trách nhiệm** — sửa hàng loạt là quyết định cuối cùng, không qua duyệt; dùng cẩn trọng.
- **Có hiệu lực ngay** — kiểm tra kỹ trước khi lưu.
- **Có lịch sử chỉnh sửa** — mọi thay đổi đều được ghi lại trong hệ thống.
- **Chỉ sửa được đợt "Đã duyệt"** — không sửa bản nháp hoặc đơn bị từ chối.

**Gặp vấn đề?**

- Không thấy nút sửa → kiểm tra đợt đã ở trạng thái **Đã duyệt** chưa; bản nháp / chờ duyệt do trưởng phòng, giám đốc xử lý trước.
- Có quyền OT_BATCH_EDIT_ANY nhưng vẫn không sửa được → tải lại trang hoặc đăng xuất / đăng nhập lại.
- Muốn hoàn tác thay đổi → không có nút hoàn tác; xem lịch sử để biết giá trị cũ rồi sửa lại thủ công.

---
