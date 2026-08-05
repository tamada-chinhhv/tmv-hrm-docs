---
sidebar_position: 5
---

# Quản lý nhân viên

> Dành cho HR/Admin có quyền `EMPLOYEE_CREATE`, `EMPLOYEE_UPDATE`, `EMPLOYEE_DELETE`.

#### 4.1 Tạo nhân viên mới — từng bước

1. Đăng nhập bằng tài khoản có quyền tạo nhân viên.
2. Menu **Tổ chức** → **Nhân viên** (`/org/employees`) — chỉ khi có quyền `EMPLOYEE_VIEW`.
3. Bấm **Thêm nhân viên** (hoặc tương đương trên danh sách).
4. Điền form (bảng bên dưới).
5. Kiểm tra **Tên đăng nhập** (tự điền từ họ tên — có thể sửa trước khi lưu).
6. Chọn **Vai trò (role)** nếu cần (không chọn = chưa gán vai trò).
7. Bấm **Lưu** / **Tạo**.
8. Hệ thống quay về danh sách nhân viên; mã nhân viên (`EMP…`) được tạo tự động nếu không nhập sẵn.

#### 4.1.1 Import Excel (upsert theo Mã NV)

Với quyền `EMPLOYEE_CREATE`:

1. **Tổ chức** → **Nhân viên** → **Tải mẫu Excel** (`GET /employees/import-template`) — cột: **Mã NV**, Họ tên, Ngày vào làm, Phòng ban, Vị trí.
2. Điền dòng rồi **Import Excel** (`POST /employees/import`; tối đa 5 MB / 1000 dòng).
3. **Mã NV** (`employeeCode`) là khóa nhận diện (không phân biệt hoa thường):
   - Trùng mã đã có → **cập nhật** nhân viên đó (không theo họ tên).
   - Mã mới → **tạo** với mã đó.
   - Ô Mã trống → **tạo** và hệ thống cấp mã tự động.
4. Thành công một phần: một số dòng OK, dòng lỗi trả về từng dòng (`processed` = created + updated).

**Kết quả mong đợi:** Nhân viên mới/cập nhật hiện trên danh sách; quy tắc username/mật khẩu giống tạo tay (username trống → từ họ tên; mật khẩu trống → username).

##### Bảng trường thông tin

| Trường | Bắt buộc | Định dạng / Ghi chú |
|--------|:--------:|---------------------|
| **Họ và tên** | Có (*) | Tối đa 100 ký tự; đổi họ tên sẽ gợi ý lại username khi đang tạo mới |
| **Email** | Không | Đúng định dạng email; không trùng email đã có |
| **Số điện thoại** | Không | |
| **CCCD / CMND** | Không | |
| **Phòng ban** | Có (*) | Bắt buộc (trừ tài khoản hệ thống `admin`) |
| **Chức vụ** | Có (*) | Danh mục **toàn công ty** (không theo phòng); gán `roleId` từ chức vụ |
| **Ngày sinh** | Không | Chọn trên lịch — lưu dạng **YYYY-MM-DD** (ví dụ: 1990-05-15) |
| **Giới tính** | Không | Nam / Nữ / Khác |
| **Địa chỉ** | Không | |
| **Số người phụ thuộc** | Không | Số nguyên 0–99 |
| **Tổng ngày phép** | Không | Số ≥ 0 (thập phân tối đa 2 chữ số) |
| **Ngày phép còn lại** | Không | Số ≥ 0 (thập phân tối đa 2 chữ số) |
| **Ngày vào làm** | Có (*) | Mặc định = hôm nay; định dạng **YYYY-MM-DD** |
| **Loại hợp đồng** | Không | Toàn thời gian, Thử việc, … |
| **Trạng thái làm việc** | Không | Mặc định **Đang làm** (`ACTIVE`); có **Ngừng** / **Nghỉ việc** |
| **Tên đăng nhập** | Có (*) | Tự sinh từ họ tên; có thể sửa **trước** khi lưu |
| **Vai trò** | Không* | Theo chức vụ đã chọn (không chọn riêng khi đã có `positionId`); **chỉ `admin` mới gán được `ADMIN`** |
| **Không cần chấm công** | Không | Chỉ Admin chỉnh sửa — loại nhân viên khỏi báo cáo chấm công / theo dõi công |
| **Quản lý trực tiếp** | Không | Chọn nhân viên đang hoạt động |
| **Ảnh đại diện** | Không | Tải file ảnh |

> **Warning — Ngày sinh / ngày vào làm:** Trên màn hình bạn chọn ngày bằng lịch (DatePicker); hệ thống lưu **năm-tháng-ngày** (YYYY-MM-DD), không phải DD/MM/YYYY trong cơ sở dữ liệu.

> **Warning — Username:** Sau khi tạo xong, **không đổi được** tên đăng nhập. Kiểm tra kỹ trước khi bấm Lưu.

#### 4.2 Tự động hóa khi tạo nhân viên

| Hạng mục | Hành vi hệ thống |
|----------|------------------|
| **Mã nhân viên** | Tự tăng: `EMP001`, `EMP002`, … — hoặc đặt qua cột **Mã NV** khi import Excel |
| **Tên đăng nhập** | Gợi ý từ họ tên — xem [mục 3.2](#) |
| **Mật khẩu** | = tên đăng nhập (mã hóa lưu trong DB) |
| **Email thông báo** | **Không gửi** — HR cần thông báo username/password cho nhân viên bằng kênh nội bộ |
| **Vai trò mặc định** | **Không gán** nếu HR không chọn — nên chọn `EMPLOYEE` cho nhân viên thường |
| **Trạng thái** | Mặc định **ACTIVE** (đang làm việc) |

**Kết quả mong đợi:** Nhân viên có tài khoản đăng nhập; HR chuyển thông tin đăng nhập cho người đó.

#### 4.3 Lỗi thường gặp khi tạo nhân viên

| Lỗi / Triệu chứng | Nguyên nhân | Cách xử lý |
|-------------------|-------------|------------|
| **Tên đăng nhập đã tồn tại** | Hiếm — chỉ khi hệ thống hết candidate hậu tố | Thử username khác hoặc liên hệ IT; xem [mục 3.2](#) |
| **Thiếu thông tin bắt buộc** | Chưa điền họ tên, ngày vào làm, username, phòng ban, chức vụ | Điền đủ các trường có dấu (*) |
| **Email đã tồn tại** | Email trùng hồ sơ cũ | Dùng email khác hoặc để trống nếu không bắt buộc |
| **EMPLOYEE_DEPARTMENT_REQUIRED / EMPLOYEE_POSITION_REQUIRED** | Thiếu phòng ban hoặc chức vụ | Chọn đủ phòng ban và chức vụ |
| **Không có quyền** | Tài khoản thiếu `EMPLOYEE_CREATE` | Nhờ Admin gán quyền qua **Phân quyền** |

#### 4.4 Chỉnh sửa thông tin sau khi tạo

1. **Tổ chức** → **Nhân viên** → bấm vào tên nhân viên.
2. Bấm **Chỉnh sửa** (hoặc vào `/org/employees/{id}/edit`).
3. Cập nhật các trường (trừ **Tên đăng nhập** — ô bị khóa).
4. Bấm **Lưu**.

**Nhân viên tự sửa hồ sơ cá nhân:** **Tài khoản** (`/account`) → tab **Thông tin** (hoặc menu user → **Tài khoản**) — chỉ sửa một phần thông tin cá nhân (không đổi phòng ban, vai trò, username). Tab **Cài đặt**: màu chủ đạo, phông chữ, chế độ sáng/tối — lưu trên tài khoản, đồng bộ khi đăng nhập trên thiết bị khác.

**Reset mật khẩu (Admin):** Trên trang xem chi tiết nhân viên → **Reset mật khẩu** → xác nhận → mật khẩu = username. **Không áp dụng** cho tài khoản `admin`.

**Không cần chấm công:** Admin bật checkbox trên form nhân viên — nhân viên đó không xuất hiện trong **Theo dõi chấm công** và xuất Excel chấm công. Role `ADMIN` tự động được loại khỏi chấm công.

**Kết quả mong đợi:** Thông tin mới hiển thị trên danh sách và hồ sơ.

#### 4.5 Nhân viên nghỉ việc

Không cần xóa hồ sơ ngay:

1. Mở chỉnh sửa nhân viên.
2. Đổi **Trạng thái làm việc** → **Nghỉ việc** (`TERMINATED`) hoặc **Ngừng** (`INACTIVE`).
3. Lưu.

**Xóa nhân viên** (`EMPLOYEE_DELETE`): Xóa **vĩnh viễn** bản ghi — chỉ dùng khi chắc chắn; có thể ảnh hưởng dữ liệu liên quan. Ưu tiên đổi trạng thái thay vì xóa. **Không thể xóa** tài khoản `admin`.

---
