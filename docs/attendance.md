---
sidebar_position: 9
---

# Chấm công

> Nội dung Task 08–09. Căn cứ codebase `tmv-hrm` / `tmv-hrm-be` (phiên bản hiện tại).

#### 8.1 Cơ chế chấm công của hệ thống

##### Phương thức chấm công

| Phương thức | Có trong HRM? | Mô tả |
|-------------|:-------------:|--------|
| **Tự chấm trên web** (Chấm công vào / Chấm công ra + **GPS**) | **Có** | Trang **Chấm công** (`/time/attendance`). Client gửi `location` (lat/lng). |
| **Tự chấm qua app mobile + WiFi** | **API có** / **app tùy tích hợp** | `POST /attendance/check-in|check-out` nhận thêm `wifi: { ssid, bssid }`. Khớp BSSID với mạng đã cấu hình. Flutter chưa gửi `wifi` trong bản hiện tại. |
| **Máy chấm công vật lý** (vân tay, thẻ, ZKTeco, …) | **Không** | Không có API/tích hợp thiết bị phần cứng trong codebase |
| **Cả hai** | — | Web + mobile API; máy vật lý xử lý **ngoài** HRM hoặc qua sửa công / đơn **ATTENDANCE_CORRECTION** |

##### Xác thực khi chấm công (geofence)

| Quy tắc | Chi tiết |
|---------|----------|
| **Điều kiện pass** | GPS trong bán kính **bất kỳ** chi nhánh active có tọa độ **HOẶC** BSSID client khớp **bất kỳ** mạng WiFi active đã cấu hình |
| **Bỏ qua geofence** | Có đơn **REMOTE_WORK** đã **duyệt** trong ngày |
| **Không kiểm tra** | Không có chi nhánh active nào có GPS **và** không có mạng WiFi active nào → vẫn chấm được |
| **Web** | Chỉ gửi GPS; chi nhánh **chỉ WiFi** → nhân viên web không chấm được (cần mobile hoặc bật GPS chi nhánh) |
| **Mobile** | Gửi `wifi.bssid` (bắt buộc để khớp); `ssid` đi kèm request |

##### Đơn vị tính công

| Đơn vị | Dùng ở đâu | Quy tắc |
|--------|------------|---------|
| **Phút** | Lưu DB, tính trạng thái | `checkOutTime − checkInTime` (phút làm việc trong ngày) |
| **Đơn vị công (theo ca)** | Phân loại WORK / LATE_EARLY | Theo **ca làm việc** trong Cài đặt: `expectedMinutes = (end − start) − lunchBreak`; đủ giờ công → **WORK**; muộn/sớm so ca (grace) hoặc thiếu giờ → **LATE_EARLY** |
| **Ngày (giờ công động)** | Tổng hợp nghỉ phép trên dashboard | `expectedWorkingMinutes / 60` giờ/ngày (đọc từ ca làm việc) |
| **Ca làm việc (shift)** | Cài đặt hệ thống | `work_shift_start_time`, `work_shift_end_time`, `grace_minutes`, `work_shift_lunch_break_minutes` — xem màn **Cài đặt → Ca làm việc** |

> **LATE_EARLY:** So **giờ vào/ra ca** (có grace) **hoặc** tổng thời gian làm **dưới đơn vị công** (`workUnitLabel`, mặc định 8h sau khi trừ nghỉ trưa), **không** còn quy tắc cố định 9h/540 phút.

**Ví dụ cụ thể (cùng một ngày):**

| Check-in | Check-out | Tổng phút | Trạng thái DB | Hiển thị lưới (chế độ ngày) |
|----------|-----------|-----------|---------------|------------------------------|
| 08:00 | 17:00 | 540 | **WORK** | `1` (xanh) |
| 08:15 | 17:15 | 540 | **WORK** | `1` |
| 08:00 | 16:30 | 510 | **LATE_EARLY** | `1` (vàng — vẫn có đi làm nhưng thiếu giờ) |
| 09:00 | 17:00 | 480 | **LATE_EARLY** | `1` (vàng) |
| 08:00 | *(chưa check-out)* | — | **FORGOT_CLOCK_IN** hoặc **WORK** (tùy trường hợp) | `F` hoặc chỉ có giờ vào |
| *(không chấm)* | *(không chấm)* | — | Trên lưới team: **ABSENT** (`A`); lịch cá nhân quá khứ: **FORGOT_CLOCK_IN** (`F`) | `A` / `F` |

##### Đơn đến muộn / về sớm và đánh giá công

Khi ngày đó có đơn **`LATE_ARRIVAL`** hoặc **`EARLY_DEPARTURE`** đã **duyệt**:

| Quy tắc | Chi tiết |
|---------|----------|
| **Giờ chấm thực tế** | Nhân viên vẫn **Chấm công vào / Chấm công ra bình thường**; hệ thống **không** tự điền giờ vào/ra từ đơn khi duyệt |
| **Ngưỡng muộn** | So với **giờ đến được duyệt** trên đơn (ca bắt đầu + số phút đơn), **không** dùng `startTime + grace` |
| **Ngưỡng về sớm** | So với **giờ về được duyệt** trên đơn (ca kết thúc − số phút đơn), **không** dùng `endTime − grace` |
| **Một chiều duyệt, chiều kia vi phạm** | Duyệt đến muộn nhưng về sớm hơn đơn (hoặc ngược lại) → vẫn **LATE_EARLY** cho vi phạm còn lại |
| **Phút công được ghi nhận** | `phút làm thực tế` (vào–ra, trừ trùng nghỉ trưa) **+** `phút được đơn bù` (khoảng ca → giờ duyệt, trừ trùng nghỉ trưa, không cộng trùng) |
| **WORK** | Không muộn/về sớm theo ngưỡng đã điều chỉnh **và** đủ `expectedWorkingMinutes` |

**Ví dụ (ca 08:00–17:00, nghỉ trưa 60 phút, đơn vị công 8h):**

| Đơn duyệt | Chấm thực tế | Kết quả | Giải thích ngắn |
|-----------|--------------|---------|-----------------|
| Đến muộn đến **09:30** | 09:30–17:00 | **WORK** | 7,5h làm + 1,5h đơn bù (08:00–09:30) = 8h |
| Đến muộn đến **09:30** | **10:00**–17:00 | **LATE_EARLY** | Muộn 30 phút so **đơn** (không so 08:00+grace) |
| Về sớm **16:00** | 08:00–16:00 | **WORK** | Đủ công khi cộng phút đơn bù |
| Đến muộn **09:30** | 09:30–**16:00** | **LATE_EARLY** | Được phép đến muộn nhưng về sớm hơn đơn |

**Chấm lại trong ngày:** Bấm Chấm công vào/ra lần hai khi giờ đã lưu → API trả về bản ghi hiện có (idempotent). Chấm qua **WiFi** không bắt buộc GPS.

**Sau triển khai bản mới:** Chạy `yarn recompute-attendance` trong `tmv-hrm-be` (hoặc `:dry-run` để xem trước) để đồng bộ `attendance.status` trong DB với quy tắc trên.

##### Múi giờ

| Mục | Giá trị |
|-----|---------|
| Múi giờ nghiệp vụ | **`Asia/Ho_Chi_Minh`** (Giờ Việt Nam, UTC+7) |
| “Hôm nay” khi chấm công | Theo ngày VN |
| Hiển thị giờ check-in/out | Giờ VN (lưu theo quy ước UTC slot trong DB) |

**Kết quả mong đợi:** Bạn hiểu chấm công qua **web (GPS)** hoặc **mobile (GPS hoặc WiFi/BSSID)**, và trạng thái “Đi muộn, về sớm” được đánh giá theo **ca làm việc + grace + nghỉ trưa** (ngày công = span ca − nghỉ trưa).

---

#### 8.2 Hướng dẫn nhân viên tự chấm công

**Quyền cần có:** `ATTENDANCE_VIEW` (role `EMPLOYEE` mặc định đã có).

**Truy cập:**

1. Menu **Chấm công & Thời gian** → **Chấm công** (`/time/attendance`), hoặc
2. **Tổng quan** → tab nhân viên → nút Chấm công vào/ra nhanh.

**Chấm công vào (Chấm công vào):**

1. Chọn **tháng hiện tại** trên bộ chọn tháng (nút chấm công **chỉ hiện khi đang xem tháng hiện tại**).
2. Bấm **Chấm công vào** (Chấm công vào).
3. Xác nhận trong hộp thoại.
4. Trình duyệt hỏi **quyền vị trí** → chọn **Cho phép**.
5. Hệ thống kiểm tra GPS có nằm trong **bán kính chi nhánh** đã cấu hình hay không (xem [8.1](/docs/attendance) — WiFi chỉ trên app mobile khi tích hợp).
6. Thành công → thông báo xanh; ô lịch hôm nay có **giờ vào**.

**Chấm công ra (Chấm công ra):**

1. Sau khi đã có giờ vào trong ngày, nút đổi thành **Chấm công ra**.
2. Lặp lại bước xác nhận + GPS.
3. Sau khi check-out xong, nút chấm công **ẩn** (đã đủ một lượt trong ngày).

**Ngày có đơn đến muộn / về sớm đã duyệt:** Vẫn chấm **giờ thực tế**; đơn **không** thay thế thao tác chấm công và **không** ghi đè giờ vào/ra khi duyệt.

**Ngoại lệ geofence (GPS / WiFi):**

- Có **đơn REMOTE_WORK** đã **duyệt** trong ngày → chấm **không cần** GPS/WiFi hợp lệ.
- **Chưa cấu hình** chi nhánh GPS **và** chưa có WiFi active → geofence bỏ qua, vẫn chấm được.
- Lỗi thường gặp: `GEO_LOCATION_OR_WIFI_REQUIRED` (thiếu cả GPS và WiFi), `OUTSIDE_OFFICE_AREA` (có gửi nhưng không khớp).

##### Quên check-in hoặc check-out

| Tình huống | Hệ thống ghi nhận | Cách xử lý |
|------------|-------------------|------------|
| Chỉ check-in, quên check-out | Trạng thái **FORGOT_CLOCK_IN** (hoặc WORK nếu chỉ thiếu giờ ra) | Check-out bổ sung trong ngày; hoặc đơn **EARLY_DEPARTURE** / **ATTENDANCE_CORRECTION**; hoặc HR sửa thủ công |
| Chỉ check-out, quên check-in | **FORGOT_CLOCK_IN** | Check-in bổ sung; đơn **LATE_ARRIVAL** / **ATTENDANCE_CORRECTION**; sửa thủ công |
| Không chấm cả hai (ngày làm việc đã qua) | Lưới team: **A** (Vắng); lịch cá nhân: **F** (Quên chấm công) | Tạo đơn nghỉ / sửa công / chấm bù theo quy trình công ty |

##### Giới hạn khung giờ check-in

**Không có** trên server (ví dụ: không khóa “chỉ được check-in trong 30 phút đầu ca”).

- UI chỉ cho chấm khi **đang xem tháng hiện tại**.
- API vẫn nhận tham số `date=YYYY-MM-DD` nếu gọi trực tiếp — vận hành nên theo quy trình nội bộ.

**Kết quả mong đợi:** Nhân viên tự chấm đủ vào/ra trong ngày làm việc tại văn phòng (hoặc remote đã duyệt).

---

#### 8.3 Hướng dẫn xem bảng chấm công

##### Nhân viên — xem của bản thân

| Cách | Đường dẫn | Nội dung |
|------|-----------|----------|
| Lịch tháng + tổng hợp | `/time/attendance` | Lịch từng ngày, giờ vào/ra, loại ngày (làm, lễ, nghỉ phép, …), thẻ tổng hợp tháng |
| Chi tiết một ngày | Bấm ô ngày trên lịch | Popup: giờ vào, giờ ra, vị trí chấm (nếu có), gợi ý đơn phép/ngày nghỉ, form sửa giờ (nếu được quyền) |

**Cột / thông tin trên lịch cá nhân:**

| Thông tin | Ý nghĩa |
|-----------|---------|
| **Giờ vào** (`checkInTime`) | Thời điểm chấm công vào (HH:mm, giờ VN) |
| **Giờ ra** (`checkOutTime`) | Thời điểm chấm công ra |
| **Số giờ thực tế** | Suy ra từ vào–ra; so với **đơn vị công** (`workUnitLabel`) và grace ca làm việc |
| **Màu / loại ngày** | WORK, LATE_EARLY, FORGOT_CLOCK_IN, nghỉ phép, lễ, cuối tuần, … |

##### Manager — xem team

1. Menu **Chấm công & Thời gian** → **Theo dõi chấm công** (`/attendance-tracking`).
2. **Quyền (OR):** `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE`.
3. **Phạm vi:** toàn công ty (`EMPLOYEE_VIEW_ALL` / Admin); cây quản lý (`EMPLOYEE_VIEW` hoặc `ATTENDANCE_VIEW_MANAGED_SUBTREE`); chỉ cấp dưới trực tiếp (`ATTENDANCE_VIEW_MANAGED`).
4. Lọc: **tên** (server-side), **tháng**, **phòng ban** (chọn nhiều). Lưới **phân trang** (50 NV/trang; hiện khi tổng sau lọc > page size).
5. Bấm **mắt** / xem chi tiết → `/attendance-tracking/{id}` — lịch tháng của từng người.

##### HR / Admin — xem toàn công ty

- Cùng trang **Theo dõi chấm công**.
- Role **ADMIN** (`roleCode = ADMIN`) hoặc `EMPLOYEE_VIEW_ALL`: thấy **tất cả** nhân viên **cần chấm công** (role ADMIN và nhân viên bật **Không cần chấm công** bị loại khỏi lưới/xuất Excel).

##### Bảng ký hiệu trên lưới (Theo dõi chấm công)

| Ký hiệu | Chế độ ngày | Chế độ giờ | Ý nghĩa | Ví dụ phân loại |
|--------|-------------|------------|---------|-----------------|
| `1` | Có đi làm | `{workUnitLabel}` từ API (VD `8h`) | WORK hoặc LATE_EARLY (đã có chấm công) | Check-in 8:00, check-out 17:00 (ca 8–17, trưa 60p) → WORK |
| *(vàng)* | `1` | `{workUnitLabel}` | **LATE_EARLY** — muộn/sớm/thiếu giờ so ca | Check-in 8:00, check-out 16:00 |
| `W` | Cuối tuần | — | Ngày nghỉ cố định theo cấu hình | Thứ Bảy, CN |
| `H` | Nghỉ lễ | — | Ngày lễ trong Holiday Configuration | 30/4 |
| `PL`, `SL`, `UL`… | Mã loại phép | — | Đơn nghỉ **đã duyệt** (2 chữ đầu mã loại phép) | `PAID_LEAVE` → `PL` |
| `F` | Quên chấm công | — | FORGOT_CLOCK_IN | Chỉ có một đầu vào/ra |
| `A` | Vắng | — | Ngày làm việc đã qua, không có bản ghi chấm công | Không chấm, không đơn |
| `-` | Chưa đến | — | Ngày tương lai | |

**Hệ thống tự phân loại dựa trên:**

1. **Cấu hình ngày nghỉ** (cuối tuần, lễ) → `W`, `H`.
2. **Đơn nghỉ đã duyệt** (trừ REMOTE_WORK, ATTENDANCE_CORRECTION trên lưới) → mã phép.
3. **Bản ghi chấm công** → đánh giá WORK / LATE_EARLY theo ca, grace, **và** đơn `LATE_ARRIVAL` / `EARLY_DEPARTURE` đã duyệt (phút công được ghi nhận — xem [8.1](/docs/attendance)).
4. **Không có bản ghi** + ngày đã qua → ABSENT (team) / FORGOT_CLOCK_IN (một số view cá nhân).

**Dựa trên cài đặt ca làm việc** (`workShiftStartTime`, `workShiftEndTime`, `workShiftLunchBreakMinutes`, `workShiftGraceMinutes`) tại **Cấu hình hệ thống → Ca làm việc** (`/sysConfig/settings`).

**Kết quả mong đợi:** Đúng vai trò, mở đúng trang và đọc được từng ký hiệu ô ngày.

---

#### 8.4 Chỉnh sửa / bổ sung chấm công

##### Ai có quyền sửa?

| Vai trò | Sửa giờ chấm công thủ công | Duyệt đơn ảnh hưởng công | Ghi chú |
|---------|---------------------------|-------------------------|---------|
| **Employee** | Chỉ **hồ sơ của mình** nếu được cấp `ATTENDANCE_MANUAL_UPDATE` (mặc định **không**) | Không duyệt | Thường tạo **đơn** thay vì sửa trực tiếp |
| **Manager** | Nhân viên trong **cây cấp dưới** nếu có `ATTENDANCE_MANUAL_UPDATE` | `LEAVE_APPROVE` (được chọn làm Người duyệt) hoặc `LEAVE_APPROVE_MANAGED` (requester trong cây) | Chỉ `LEAVE_VIEW_MANAGED` → xem inbox, không duyệt |
| **HR / Admin** | Toàn bộ (Admin) hoặc theo quyền gán | Có nếu có `LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED` | Admin thường đủ quyền seed |

**API sửa thủ công:** `PATCH /attendance/manual-time` — permission **`ATTENDANCE_MANUAL_UPDATE`**.

**UI:** Trang chi tiết nhân viên (`/attendance-tracking/{id}`) hoặc lịch cá nhân → bấm ngày **≤ hôm nay** → nhập **Giờ vào / Giờ ra** (tọa độ tùy chọn) → Lưu. Admin thấy gợi ý khi ngày có **nghỉ phép** hoặc đơn **đến muộn / về sớm** — vẫn được sửa để chỉnh **giờ chấm thực tế**.

- **Xóa ngày chấm công:** từ dialog chi tiết ngày — xóa cứng bản ghi chấm `(employeeId, date)` (cần xác nhận).
- **Sửa giờ hàng loạt (Theo dõi chấm công):** trường **Nhân viên áp dụng** (`employeeIds` — danh sách inclusion); mặc định chọn tất cả; chỉ ghi giờ cho NV đã chọn; checkbox chọn tất cả trong dropdown; chip thu gọn (`limitTags`); ID không hợp lệ bị bỏ qua.

##### Quy trình sửa — có phê duyệt không?

| Cách | Phê duyệt? | Mô tả |
|------|:----------:|--------|
| **Sửa thủ công** (manual-time) | **Không** quy trình duyệt trong hệ thống | Người có quyền sửa trực tiếp; **không** lưu người sửa / lý do trong DB. **Không** chặn ngày có đơn nghỉ (`LEAVE_REQUEST_EXISTS` đã bỏ) |
| **Đơn LATE_ARRIVAL / EARLY_DEPARTURE** | **Có** — một người duyệt | Sau **Approve** → **chỉ tính lại trạng thái** theo giờ chấm + phút đơn; **không** ghi đè giờ vào/ra |
| **Đơn ATTENDANCE_CORRECTION / REMOTE_WORK** | **Có** | Sau **Approve** → cập nhật giờ chấm / bỏ geofence theo loại đơn |
| **Đơn nghỉ phép thông thường** | Duyệt đơn nghỉ | Không tự sửa giờ vào/ra |

##### Lịch sử thay đổi

**Không có** bảng lịch sử (audit log) cho chấm công. Giá trị mới **ghi đè** bản ghi cũ.

:::warning
Mọi thay đổi nhạy cảm nên có quy trình ngoài hệ thống (email, biên bản) vì phần mềm không lưu vết.
:::

**Kết quả mong đợi:** HR/Manager biết dùng đơn hoặc sửa tay đúng quyền; nhân viên biết gửi đơn khi quên chấm.

---

#### 8.5 Lọc & xuất dữ liệu

| Tính năng | Có? | Chi tiết |
|-----------|:---:|----------|
| Lọc theo **tháng** | Có | bộ chọn tháng trên Chấm công và Theo dõi chấm công |
| Lọc theo **tên** nhân viên | Có | Theo dõi chấm công — tìm server-side (danh sách phân trang) |
| Lọc theo **phòng ban** | Có | Chọn nhiều phòng ban |
| **Phân trang** | Có | Lưới Theo dõi chấm công: 50 NV/trang khi tổng sau lọc vượt page size |
| Lọc theo **tuần** riêng | Không | Chỉ theo tháng |
| Xuất **Excel** (.xlsx) | Có | Nút xuất trên Theo dõi chấm công — `GET /attendance/export-workingtime-detail` — cần `ATTENDANCE_EXPORT` **hoặc** `ATTENDANCE_EXPORT_MANAGED` **hoặc** `ATTENDANCE_EXPORT_MANAGED_SUBTREE` (phạm vi theo quyền) |
| Xuất **CSV / PDF** | **Không** | — |

**File Excel gồm:** mã NV, tên, từng ngày trong tháng (phút làm việc), mã chú thích (vắng, muộn, sớm), cột ngày phép còn lại, v.v.

**Phạm vi export:** Giống lưới — Admin / `ATTENDANCE_EXPORT`: cả công ty; `ATTENDANCE_EXPORT_MANAGED_SUBTREE` / kèm scope subtree: cây quản lý; `ATTENDANCE_EXPORT_MANAGED`: chỉ cấp dưới trực tiếp.

---

#### 8.6 Bảng so sánh quyền chấm công

| Tính năng | Employee | Manager | HR / Admin |
|-----------|:--------:|:-------:|:----------:|
| Tự Chấm công vào/ra (GPS) | Có* | Có* | Có* |
| Xem lịch chấm công **của mình** | Có* | Có* | Có* |
| Xem lưới **Theo dõi chấm công** | Không | Có** | Có |
| Xem chi tiết từng NV trong team | Không | Có** | Có |
| Xuất Excel tháng | Không | Có** | Có |
| Sửa giờ manual-time | Không*** | Có**** | Có***** |
| Cấu hình vị trí văn phòng | Không | Không | Có (`LOCATION_VIEW`) |
| Cấu hình ngày nghỉ | Không | Không | Có (`HOLIDAY_CONFIG_*`) |
| Cấu hình ca làm việc (giờ ca, nghỉ trưa, grace) | Không | Không | Có (`WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT` — Settings) |

\* Cần `ATTENDANCE_VIEW`.  
\** Cần `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE` (scope tương ứng); xuất Excel cần mã `ATTENDANCE_EXPORT*`.  
\*** Trừ khi Admin gán thêm `ATTENDANCE_MANUAL_UPDATE`.  
\**** Trong phạm vi team + có quyền.  
\***** Admin / HR được gán quyền.

---

#### 8.7 Ca làm việc & Lịch làm việc (Task 09)

> **Cập nhật:** HRM có **cài đặt ca làm việc mặc định** (không phải lịch ca theo nhân viên). HR cấu hình tại **Cấu hình hệ thống → Ca làm việc** (`/sysConfig/settings`).

| Tính năng | Trạng thái trong HRM |
|-----------|----------------------|
| Giờ bắt đầu / kết thúc ca mặc định | **Có** — `workShiftStartTime`, `workShiftEndTime` |
| Nghỉ trưa (phút) | **Có** — `workShiftLunchBreakMinutes` (mặc định 60) |
| Ân hạn muộn/sớm (phút) | **Có** — `workShiftGraceMinutes` (mặc định 15) |
| Preview ngày công | **Có** — `(end − start − lunch)` trên form settings |
| Gán ca khác nhau cho từng NV / lịch ca tuần | **Chưa có** |
| Đổi ca một ngày + phê duyệt | **Chưa có** |

##### Công thức thống nhất

```text
shiftSpanMinutes       = endTime − startTime
expectedWorkingMinutes = shiftSpanMinutes − lunchBreakMinutes
workUnitLabel          = expectedWorkingMinutes / 60 (VD "8h", "8.25h")
```

**Ví dụ:** Ca 08:00–17:00, nghỉ trưa 60 phút → **1 ngày công = 8 giờ**; tracking hour mode hiển thị `8h` từ API.

| Khái niệm | Thực tế trong hệ thống |
|-----------|------------------------|
| Muộn vào | Check-in > `startTime + grace` — **hoặc** > giờ duyệt trên đơn `LATE_ARRIVAL` (nếu có) |
| Về sớm | Check-out < `endTime − grace` — **hoặc** < giờ duyệt trên đơn `EARLY_DEPARTURE` (nếu có) |
| Thiếu giờ | Phút công được ghi nhận (làm thực + phút đơn bù, trừ trùng nghỉ trưa) < `expectedWorkingMinutes` |
| **WORK** | Không muộn/về sớm theo ngưỡng đã điều chỉnh và đủ giờ công |
| Khung giờ đơn REMOTE_WORK / LATE_ARRIVAL | Mặc định form lấy từ ca làm việc |
| Ngày nghỉ cố định | **Holiday Configuration** |

**Kết quả mong đợi:** Cấu hình ca tại Settings; chấm công và tracking dùng **một nguồn** `expectedWorkingMinutes` / `workUnitLabel`.

---
