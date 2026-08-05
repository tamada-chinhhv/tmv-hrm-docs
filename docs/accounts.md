---
sidebar_position: 4
---

# Tài khoản & Đăng nhập

#### 3.1 Hướng dẫn đăng nhập từng bước

1. Mở trình duyệt (Chrome, Edge, …).
2. Vào địa chỉ: **https://hrm.tamada.vn/login**
3. Trên form đăng nhập, điền:
   - **Tên đăng nhập** (`username`) — không phải email, không phải mã nhân viên.
   - **Mật khẩu** (`password`) — có nút hiện/ẩn mật khẩu (biểu tượng mắt).
4. Bấm nút **Đăng nhập**.
5. Nếu đúng, bạn vào trang chính (thường là Chấm công). Nếu sai, thông báo lỗi hiện trên form.

**Giao diện form đăng nhập gồm:**

| Thành phần | Mô tả |
|------------|--------|
| Logo / tiêu đề HRM | Nhận diện hệ thống |
| Ô **Tên đăng nhập** | Bắt buộc |
| Ô **Mật khẩu** | Bắt buộc, tối thiểu 6 ký tự khi đăng nhập |
| Nút **Đăng nhập** | Gửi thông tin lên server |
| Chuyển ngôn ngữ | Góc trên (Tiếng Việt / English / 日本語) |

**Không có** trên form: ô email, liên kết “Quên mật khẩu”, ghi nhớ đăng nhập.

**Kết quả mong đợi:** Vào được hệ thống, thấy menu bên trái và tên bạn ở thanh trên.

#### 3.2 Quy tắc tạo tên đăng nhập tự động

Khi HR **tạo nhân viên mới**, hệ thống gợi ý tên đăng nhập từ **Họ và tên** — **không** lấy từ email hay mã nhân viên (`EMP001`, …).

**Các bước xử lý tên:**

1. Bỏ khoảng trắng thừa đầu/cuối.
2. Chuyển thành **chữ thường** (không phân biệt hoa/thường khi đăng nhập — tên lưu dạng chữ thường).
3. Bỏ dấu tiếng Việt (ă → a, ê → e, …; **đ** → **d**).
4. Xóa mọi ký tự **không phải** chữ cái `a–z` hoặc số `0–9` (dấu cách, gạch ngang, @, … đều bị xóa).

**Ví dụ:**

| Họ và tên | Tên đăng nhập gợi ý |
|-----------|---------------------|
| Nguyễn Văn An | `nguyenvanan` |
| Trần Thị Lan | `tranthilan` |
| Lê Văn Đức | `levanduc` |
| Nguyễn Văn A | `nguyenvana` |

**Mã nhân viên** (`EMP001`, `EMP002`, …) do hệ thống tự sinh khi lưu — dùng trong hồ sơ, **không** dùng để đăng nhập.

##### Trường hợp tên đăng nhập đã tồn tại

Khi lưu (tạo tay hoặc import Excel), nếu username trùng hệ thống **tự thêm số đuôi**: `nguyenvanan` → `nguyenvanan1` → `nguyenvanan2` → …

- Mật khẩu mặc định (nếu không nhập) = **username đã allocate** (sau khi thêm hậu tố, nếu có).
- Username `admin` vẫn bị giữ riêng — không dùng làm tài khoản thường.

**Ví dụ xử lý trùng:**

| Tình huống | Kết quả |
|------------|---------|
| Đã có `nguyenvanan`, tạo thêm Nguyễn Văn An | Hệ thống lưu `nguyenvanan1` (rồi `nguyenvanan2`, …) |
| Hai người cùng tên chuẩn hóa giống nhau | Mỗi người nhận username khác nhờ hậu tố số |

##### Giới hạn ký tự

| Quy tắc | Chi tiết |
|---------|----------|
| Độ dài | 1–50 ký tự (theo cấu hình hệ thống) |
| Ký tự cho phép | Chỉ `a–z`, `0–9` sau khi chuẩn hóa |
| Phân biệt hoa/thường | **Không** — luôn lưu chữ thường |
| Đổi sau khi tạo | **Không được** — username khóa vĩnh viễn sau khi tạo nhân viên |

#### 3.3 Mật khẩu mặc định

| Câu hỏi | Trả lời |
|---------|---------|
| Mật khẩu mặc định là gì? | **Trùng với tên đăng nhập** (ví dụ: user `nguyenvanan` → mật khẩu `nguyenvanan`) |
| Quy tắc sinh mật khẩu | Cố định theo username khi HR **không** nhập mật khẩu riêng lúc tạo |
| Bắt buộc đổi lần đầu? | **Không** — hệ thống không ép đổi khi đăng nhập lần đầu |
| Tài khoản Admin hệ thống (production) | `admin` / `admin123` lần đầu — backend tự tạo/khôi phục sau mỗi lần deploy (`ensure-system-admin.mjs`); **đổi mật khẩu ngay** sau khi đăng nhập |

**Ví dụ:** Nhân viên **Nguyễn Văn An** → đăng nhập: `nguyenvanan` / `nguyenvanan`.

> **Khuyến nghị bảo mật:** Sau khi cấp tài khoản, nhân viên nên **Đổi mật khẩu** ngay (mục 3.4). HR nên nhắc đổi toàn bộ mật khẩu mặc định sau bàn giao hệ thống.

#### 3.4 Hướng dẫn đổi mật khẩu

**Nhân viên tự đổi (khi đã đăng nhập):**

1. Bấm **tên / avatar** của bạn ở góc trên phải.
2. Chọn **Đổi mật khẩu**.
3. Điền:
   - Mật khẩu hiện tại
   - Mật khẩu mới
   - Xác nhận mật khẩu mới
4. Bấm **Cập nhật mật khẩu**.

**Quy tắc mật khẩu mới:**

| Yêu cầu | Ví dụ hợp lệ |
|---------|----------------|
| Tối thiểu 8 ký tự | `Abcdef1!` |
| Ít nhất 1 chữ thường | `a` |
| Ít nhất 1 chữ hoa | `A` |
| Ít nhất 1 chữ số | `1` |
| Ít nhất 1 ký tự đặc biệt | `!` `@` `#` … |
| Mật khẩu mới = xác nhận | Phải giống nhau |

**Kết quả mong đợi:** Đổi mật khẩu thành công thì **vẫn đăng nhập** trên trình duyệt hiện tại; lần sau dùng mật khẩu mới. Tab hoặc thiết bị khác có thể phải đăng nhập lại.

#### 3.5 Quên mật khẩu & reset bởi Admin

Hệ thống **không có** chức năng “Quên mật khẩu” qua email.

| Ai xử lý | Cách làm |
|----------|----------|
| **HR / Admin** (có quyền `EMPLOYEE_UPDATE`) | Mở hồ sơ nhân viên → **Reset mật khẩu** → mật khẩu trở lại **bằng tên đăng nhập**; nhân viên phải **đăng nhập lại** trên mọi thiết bị |
| **Nhân viên** | Liên hệ HR/IT — không tự khôi phục trên màn hình login |

#### 3.6 Đăng xuất

1. Bấm tên bạn ở góc trên → **Đăng xuất**.
2. Xác nhận nếu hệ thống hỏi.

**Kết quả mong đợi:** Quay về trang đăng nhập, phiên làm việc kết thúc.

#### 3.7 Tài khoản `admin` hệ thống (bất khả xâm phạm)

Khi triển khai production, hệ thống luôn có tài khoản **`admin`** với role **ADMIN** và **toàn bộ quyền**. Script `ensure-system-admin.mjs` chạy tự động sau migration mỗi lần backend khởi động.

| Quy tắc | Chi tiết |
|---------|----------|
| Đăng nhập lần đầu | `admin` / `admin123` (nếu mới tạo) — đổi mật khẩu ngay |
| Xóa tài khoản `admin` | **Không** |
| **Reset mật khẩu** (nút HR trên hồ sơ) | **Không** — không reset `admin` về username |
| **Đổi mật khẩu** (menu user → Change password) | **Có** — `admin` tự đổi được; deploy lại **không** ép về `admin123` |
| Đổi role / vô hiệu hóa `admin` | **Không** — role luôn ADMIN, trạng thái ACTIVE |
| Sửa hồ sơ `admin` bởi user khác | **Không** |
| Gán role **ADMIN** cho người khác | **Chỉ** tài khoản `admin` |
| Sửa quyền role **ADMIN** (Phân quyền) | **Chỉ** tài khoản `admin`; hệ thống luôn gán full quyền cho role ADMIN |
| Username `admin` | **Reserved** — không tạo nhân viên mới với username này |

> **Vận hành:** Dùng `admin` để quản trị phân quyền và gán ADMIN cho người khác nếu cần. Nhân viên thường dùng role `EMPLOYEE` hoặc `HR_MANAGER` + permission tùy chỉnh.

---
