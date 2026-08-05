---
sidebar_position: 10
---

# Đơn xin phép

> Task 10–11.

#### 9.1 Các loại phép trong hệ thống

Loại phép nằm trong bảng **leave_types** (mã `code`). Có thể thêm loại mới trong DB; dưới đây là các mã **đang dùng trong code/seed**:

| Mã (`code`) | Tên (VI) | Có lương? | Trừ ngày phép còn lại? | Ghi chú |
|-------------|----------|:---------:|:----------------------:|---------|
| `PAID_LEAVE` | Nghỉ phép có lương | Có | **Có** — chỉ loại này trừ `remainingLeaveDays` | Tính **cả ngày** mỗi ngày làm việc trong khoảng đơn |
| `UNPAID_LEAVE` | Nghỉ phép không lương | Không | Không | |
| `SICK_LEAVE` | Nghỉ ốm | Có (flag) | **Không** trừ số dư (không phải PAID_LEAVE) | **Không** có upload giấy tờ trong hệ thống |
| `LATE_ARRIVAL` | Đến muộn | Không | Không | Đơn **phút**; duyệt xong **tính lại trạng thái** — **không** ghi đè giờ vào; nhân viên vẫn chấm thực tế |
| `EARLY_DEPARTURE` | Về sớm | Không | Không | Tương tự — **không** ghi đè giờ ra |
| `REMOTE_WORK` | Làm remote | Không | Không | Duyệt xong → công 09:00–18:00 các ngày trong khoảng; bỏ geofence |
| `ATTENDANCE_CORRECTION` | Cập nhật công | Không | Không | Duyệt xong → ghi check-in/out theo đơn |
| `HIEU_HI` | Hiếu hỉ | Có (flag) | **Không** trừ số dư | Cưới/tang — không hiện số dư trên form |
| `OVERTIME` | Tăng ca | Không | Không | Tạo/duyệt như đơn phép khác; **tổng giờ OT tháng** chỉ từ đơn `OVERTIME` đã **duyệt** (không tự tính từ chấm công) |

**Chưa có trong hệ thống:**

- Hạn mức **X ngày/năm theo từng loại phép** tự động (ngoài phép năm PAID_LEAVE)
- Hết hạn / cap **carryover** phép năm
- **Đính kèm file** (giấy bác sĩ, …) trên đơn

**Số ngày phép năm (accrual tự động):**

- Ngày **1 mỗi tháng** (cron 05:00 `Asia/Ho_Chi_Minh`): cộng **+1** vào cả **Tổng ngày phép** (`totalLeaveDays`) và **Ngày phép còn lại** (`remainingLeaveDays`).
- Ngày **1/1**: giữ số dư năm trước (carryover **ngầm** — không reset) + **+1** tháng 1 + **thâm niên** `floor(số năm làm việc tròn / 5)` (lặp lại mỗi năm; ví dụ ≥5 → +1, ≥10 → +2, ≥15 → +3).
- NV vào giữa tháng: lần +1 đầu tiên vào **ngày 1 tháng kế tiếp** (`hireDate` < ngày accrual). Không pro-rata giữa tháng.
- Go-live: giữ số dư HR đã nhập; **không backfill** tháng cũ; cron cộng từ tháng deploy trở đi.
- Cột là **Decimal(8,2)** — cron luôn cộng số nguyên; HR vẫn có thể chỉnh tay số lẻ nếu cần.
- **`PAID_LEAVE` khi duyệt** vẫn trừ `remainingLeaveDays` theo ngày nguyên (chưa nửa ngày 0.5).

---

#### 9.2 Tạo đơn xin phép — từng bước (nhân viên)

**Quyền:** `LEAVE_VIEW`.

1. Menu **Chấm công & Thời gian** → **Đơn xin phép** (`/leave`), hoặc từ trang **Chấm công** → tạo đơn nhanh.
2. Bấm nút tạo đơn mới (Add / Tạo đơn).
3. Trong form:
   - **Loại phép** — chọn từ danh sách (bắt buộc).
   - **Khoảng ngày** — ngày bắt đầu / kết thúc (DatePicker, `YYYY-MM-DD`).
   - **Giờ bắt đầu / kết thúc** — với nghỉ nhiều ngày hoặc cùng ngày; mặc định gợi ý **09:00–18:00** (không phải ca làm việc — chỉ mặc định form).
   - **Đến muộn / Về sớm** (`LATE_ARRIVAL`, `EARLY_DEPARTURE`): nhập **số phút**, có thể chọn nhiều ngày.
   - **Lý do** — tùy chọn (text).
   - **Người duyệt** — **bắt buộc**, chọn **một** người từ danh sách gợi ý.
4. Nếu là phép có lương (trừ Hiếu hỉ): form hiển thị **Ngày phép còn lại** từ hồ sơ.
5. Bấm **Gửi** / **Lưu** → đơn ở trạng thái **Chờ duyệt** (`PENDING`).

**Sau khi gửi:**

- Đơn lưu trong hệ thống, trạng thái **PENDING**.
- **Người duyệt** đã chọn nhận **thông báo trong app** (chuông) — loại `LEAVE_REQUEST_CREATED`, link `/leave-approvals`.
- **Không gửi email** tự động.

> **Warning — Không có “nửa ngày” 0.5:** UI chọn **giờ** trong ngày, nhưng khi duyệt **PAID_LEAVE**, hệ thống trừ **1 ngày cho mỗi ngày làm việc** có overlap — không trừ 0.5 ngày.

> **Warning — Vượt số dư:** Khi **duyệt** `PAID_LEAVE`, nếu `remainingLeaveDays` < số ngày tính phí → lỗi **Insufficient remaining leave days** (không duyệt được). Vẫn **cho gửi** đơn khi tạo.

**Kết quả mong đợi:** Đơn nằm trong danh sách “Chờ duyệt”; người duyệt nhận thông báo.

---

#### 9.3 Hạn ngạch & số dư ngày phép

| Chỉ số | Nguồn | Ý nghĩa |
|--------|-------|---------|
| **Tổng ngày phép** | Accrual cron (+ HR chỉnh tay) | Cộng hàng tháng (+ thâm niên 1/1); **không** trừ khi duyệt |
| **Đã dùng** | Không có cột riêng “đang chờ” trên DB | Suy ra: Tổng − Còn lại (thủ công) |
| **Còn lại** | Accrual cron (+ HR chỉnh tay) | Cộng khi accrual; trừ khi duyệt **PAID_LEAVE**; cộng lại khi xóa đơn PAID_LEAVE đã duyệt (người có quyền xóa) |
| **Đang chờ duyệt** | **Không** trừ trước | Chỉ trừ sau **Approve** |

**Xem số còn lại:** Khi tạo đơn phép có lương (trừ Hiếu hỉ) — hiện trên form; hoặc xem hồ sơ nhân viên (HR).

---

#### 9.4 Xem & quản lý đơn đã tạo

**Danh sách:** `/leave` — lọc theo tháng, trạng thái.

**Trạng thái:**

| Trạng thái | Mã | Ý nghĩa |
|------------|-----|---------|
| Chờ duyệt | `PENDING` | Vừa gửi, chờ người duyệt |
| Đã duyệt | `APPROVED` | Đã chấp thuận; có thể đã trừ phép / cập nhật công |
| Từ chối | `REJECTED` | Bị từ chối — **không** có luồng gửi lại trong hệ thống |

**Trạng thái KHÔNG có:** `CANCELLED`, `Đã hủy` riêng — nhân viên **xóa** đơn PENDING thay vì hủy.

```
  [Tạo đơn]
      |
      v
  +-----------+
  |  PENDING  |<---- Chỉnh sửa / Xóa (nhân viên)
  +-----------+
     |      |
     |      +------------------+
     v                         v
+-----------+            +-----------+
| APPROVED  |            | REJECTED  |
+-----------+            +-----------+
 (kết thúc)               (kết thúc)
```

**Nhân viên hủy / sửa đơn:**

- Chỉ được **sửa** và **xóa** đơn của mình khi trạng thái **PENDING** (trang **Leave** — nút **Xóa** cho đơn không phải OT; xác nhận qua `leave.confirmDelete`).
- Đơn **OVERTIME** **PENDING**: nhân viên **Hủy** (`PATCH /leave/:id/cancel`; xác nhận `overtime.confirmCancel`) — không xóa cứng.
- Sau khi duyệt/từ chối → nhân viên **không** xóa / hủy được (trừ hủy OT đang chờ như trên).
- **Xóa đơn APPROVED** trên **Duyệt đơn xin phép**: **admin** (role `ADMIN`), **người duyệt được gán** / **quản lý trong cây cấp dưới** (`LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED`), hoặc HR có `LEAVE_DELETE_APPROVED` (hoàn phép `PAID_LEAVE`, revert công với `LATE_ARRIVAL` / `EARLY_DEPARTURE` / `ATTENDANCE_CORRECTION` khi xóa an toàn). Lỗi quyền: `LEAVE_DELETE_NOT_ALLOWED` (i18n).
- Sau khi xóa (PENDING hoặc APPROVED), backend xóa thông báo in-app liên quan (`leaveRequestId` trong payload) và phát realtime `notifications:removed` + `leave:approvals-changed` (`action: deleted`) tới người thực hiện và người duyệt được gán.

**Đơn bị từ chối:**

- Người xin nhận **thông báo trong app** (`LEAVE_REQUEST_REJECTED`).
- Lý do từ chối: API **không** bắt buộc ghi chú riêng khi reject — chỉ thấy **lý do trong đơn gốc** (nếu người xin đã điền). Người duyệt không có trường “lý do từ chối” bắt buộc trên UI.

**Kết quả mong đợi:** Nhân viên theo dõi được trạng thái; sửa / xóa đơn PENDING (hoặc hủy OT đang chờ); xóa đơn đã duyệt do admin hoặc người duyệt trên Duyệt đơn xin phép; người duyệt thấy danh sách cập nhật sau khi đơn bị xóa.

---

#### 9.5 Quy trình duyệt đơn (Task 11)

##### Chuỗi phê duyệt — thực tế trong HRM

**Một bước, một người duyệt** — **không** có chuỗi Manager → HR tuần tự, **không** duyệt song song nhiều người.

```
Nhân viên tạo đơn + chọn Người duyệt (1 người)
        |
        v
   [ PENDING ]
        |
        v
 Người được chọn duyệt HOẶC từ chối
        |
   +----+----+
   v         v
APPROVED  REJECTED
```

**Ai là người duyệt?**

- Nhân viên **tự chọn** khi tạo đơn từ danh sách `GET /leave/approvers`.
- Hệ thống gợi ý:
  - **Quản lý trực tiếp** (`managerId`) — đưa lên đầu danh sách nếu đang hoạt động.
  - Nhân viên **cùng phòng ban** (gợi ý approver theo cây tổ chức / cùng dept — không còn so sánh `level` chức vụ).
  - Nhân viên thuộc **phòng ban cha** trên cây tổ chức.
- **Không** tự gán “luôn là Manager” — phải chọn đúng người trong list.
- **Không** có ủy quyền duyệt thay khi Manager đi phép.

**WHY thiết kế một người:** Đơn giản hóa MVP — tránh chờ nhiều cấp; trách nhiệm rõ trên một `approverId`.

##### Hướng dẫn Quản lý / HR duyệt từng bước

**Quyền inbox (OR):** `LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED` / `LEAVE_VIEW_MANAGED` — mở **Duyệt đơn xin phép**.

**Quyền quyết định (Approve/Reject):** `LEAVE_APPROVE` khi `approverId` = mình, **hoặc** `LEAVE_APPROVE_MANAGED` khi người xin thuộc **cây quản lý** (trực tiếp + gián tiếp theo `managerId`). Chỉ `LEAVE_VIEW_MANAGED` → **xem** inbox subtree, **không** duyệt/từ chối.

1. **Thông báo:** Chuông app — `LEAVE_REQUEST_CREATED` (không email) tới Người duyệt đã chọn; quản lý trong chuỗi có thể thấy đơn qua quyền managed.
2. Vào **Chấm công & Thời gian** → **Duyệt đơn xin phép** (`/leave-approvals`).
3. Chọn **tháng**, lọc trạng thái (**PENDING** / All / …).
4. Bảng danh sách: người xin, loại phép, thời gian, **lý do**, trạng thái.
5. Bấm xem chi tiết → thấy đủ thông tin đơn (số dư phép **không** hiện riêng trên màn duyệt — HR xem hồ sơ NV nếu cần).
6. **Approve:** xác nhận → trạng thái APPROVED; người xin nhận thông báo; nếu PAID_LEAVE → trừ `remainingLeaveDays`; nếu loại đặc biệt → cập nhật chấm công. Nếu còn đơn **APPROVED** trùng thời gian → lỗi `LEAVE_APPROVE_BLOCKED_BY_OVERLAP`.
7. **Reject:** xác nhận → REJECTED; người xin nhận thông báo. **Không bắt buộc** nhập lý do từ chối.
8. **Duyệt / Từ chối hàng loạt:** khi có quyền quyết định, chọn nhiều dòng **PENDING** → toolbar → xác nhận → `POST /leave/approvals/bulk-decide` (best-effort từng đơn; toast báo số thành công/thất bại).
9. **Xóa đơn APPROVED** (admin / người duyệt được gán / quản lý có `LEAVE_APPROVE_MANAGED` trong phạm vi / `LEAVE_DELETE_APPROVED`): xác nhận → xóa đơn; hoàn phép / revert công nếu áp dụng. Không đủ quyền → `LEAVE_DELETE_NOT_ALLOWED`. Nếu còn đơn **APPROVED** khác trùng thời gian → `LEAVE_DELETE_BLOCKED_BY_OVERLAP`.

##### Quyền theo role

| Câu hỏi | Trả lời |
|---------|---------|
| Manager duyệt đơn của ai? | `LEAVE_APPROVE`: chỉ đơn **mình được chọn** làm Người duyệt. `LEAVE_APPROVE_MANAGED`: mọi đơn mà người xin nằm trong **cây quản lý** (kể cả khi Người duyệt là người khác). Chỉ `LEAVE_VIEW_MANAGED`: xem subtree, không duyệt |
| HR Admin duyệt tất cả? | Admin (role) thấy/duyệt theo quyền admin; user thường chỉ nếu được **chọn** trên đơn, có `LEAVE_APPROVE_MANAGED` trong phạm vi, hoặc tạo đơn hộ |
| Manager vắng, ai duyệt thay? | **Không có** ủy quyền — chọn người duyệt khác lúc tạo đơn, hoặc cấp trên có `LEAVE_APPROVE_MANAGED` duyệt theo cây |
| HR xóa đơn đã duyệt? | **Duyệt đơn xin phép** → Xóa khi là admin, người duyệt được gán, quản lý có `LEAVE_APPROVE_MANAGED` trong phạm vi, hoặc có `LEAVE_DELETE_APPROVED`; có thể **hoàn lại** ngày phép PAID_LEAVE |
| Đổi đơn đã duyệt (sửa thời gian)? | **Không** sửa trực tiếp — xóa đơn APPROVED cũ (nếu không bị chặn overlap) → tạo đơn mới → duyệt |

##### Tình huống đặc biệt

| Tình huống | Hệ thống xử lý |
|------------|----------------|
| Nhiều người cùng team xin phép một ngày | **Không** cảnh báo trùng / thiếu nhân sự |
| Xin phép ngày lễ / cuối tuần | Vẫn tạo được; ngày **không tính** trừ phép nếu nằm trong **off dates** (holiday config) |
| Đơn đã duyệt cần hủy / đổi | **Không** nút Hủy — admin/người duyệt xóa đơn APPROVED trên Duyệt đơn xin phép rồi tạo lại; bị chặn nếu overlap với đơn APPROVED khác |
| Nhắc duyệt khi PENDING quá lâu | **Không** có deadline / reminder tự động |

##### Bảng thông báo

| Sự kiện | Ai nhận | Kênh | Nội dung (tóm tắt) |
|---------|---------|------|---------------------|
| Nhân viên gửi đơn | **Người duyệt** đã chọn | App (+ Web Push nếu bật) | Có đơn mới — mở Duyệt đơn xin phép |
| Duyệt đơn | **Người xin** | App (+ Push) | Đơn đã được duyệt |
| Từ chối đơn | **Người xin** | App (+ Push) | Đơn bị từ chối |
| Sửa đơn PENDING | — | **Không** gửi thông báo | — |
| Xóa đơn | — | **Không** gửi thông báo | — |
| HR Admin “duyệt thay” không được chọn | — | Không duyệt được (403) | — |

**Kết quả mong đợi:** Người duyệt biết phạm vi theo `LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED` / `LEAVE_VIEW_MANAGED`; nhân viên biết luồng một bước và nhận thông báo kết quả.

---
