---
sidebar_position: 13
---

# Cấu hình hệ thống

- **Ngày nghỉ:** `HOLIDAY_CONFIG_VIEW` / `HOLIDAY_CONFIG_EDIT` — `/sysConfig/holidays`.
- **Vị trí chi nhánh:** `LOCATION_VIEW` / `LOCATION_MANAGE` — `/sysConfig/locations`. Mỗi chi nhánh **active** phải có **GPS** hoặc **ít nhất một mạng WiFi active** (có thể chỉ GPS, chỉ WiFi, hoặc cả hai). Chi tiết cấu hình: [mục 7.5.1](#).
- **Giao diện hệ thống:** `APPEARANCE_VIEW` / `APPEARANCE_EDIT` — **Cấu hình hệ thống → Cài đặt** (`/sysConfig/settings`, accordion **Giao diện**). Áp dụng cho user chưa tùy chỉnh cá nhân và cho màn login.
- **Ca làm việc (toàn hệ thống):** `WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT` — cùng trang `/sysConfig/settings`, accordion **Ca làm việc**.
- **Phân quyền (Gán quyền + Nhóm quyền):** `ROLE_VIEW` / `ROLE_MANAGE` — `/sysConfig/assign` (tab `roles` cho nhóm quyền; `/sysConfig/roles` redirect → `?tab=roles`).

> Giao diện **cá nhân** không cấu hình tại đây — xem [mục 7.0](#).

### Cấu hình chi nhánh (GPS + WiFi)

**Đường dẫn:** `/sysConfig/locations` — dialog **Cấu hình chi nhánh** (`BranchConfigDialog`).

| Thành phần | Mô tả |
|------------|--------|
| **Đang hoạt động** | Switch bật/tắt chi nhánh. Chi nhánh active bắt buộc có GPS hoặc ≥1 WiFi active. |
| **GPS** | Switch **Bật GPS** → nhập vĩ độ, kinh độ, bán kính (m). Tắt GPS → xóa tọa độ trên server. |
| **WiFi** | Mỗi access point (AP): **SSID** (tên mạng hiển thị) + **BSSID** (MAC của AP, bắt buộc). Có thể thêm nhiều AP cùng SSID (văn phòng nhiều tầng). Switch **Đang hoạt động** trên từng mạng WiFi. |
| **Lấy WiFi hiện tại** | Nút detect — gọi `GET /office-locations/wifi/current` (chỉ `LOCATION_MANAGE`). Đọc WiFi từ **máy chạy backend** (Windows `netsh` / Linux `nmcli`), dùng khi admin cấu hình trên PC nối mạng công ty. |

**SSID vs BSSID (tóm tắt):**

- **SSID** — tên mạng (có thể trùng giữa nhiều AP).
- **BSSID** — địa chỉ MAC của từng AP; **server khớp chấm công theo BSSID**, không chỉ SSID.
- Nhân viên khi chấm công **không** thấy BSSID trên UI; chỉ admin cấu hình BSSID.

**Mã lỗi cấu hình (API):** `OFFICE_METHOD_REQUIRED`, `GPS_ENABLED_INCOMPLETE`, `WIFI_BSSID_INVALID`, `WIFI_BSSID_ALREADY_EXISTS` (trùng BSSID trong cùng chi nhánh).

---
