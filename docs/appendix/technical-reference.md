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
| `CORS_ORIGIN` | Domain công khai FE (production: `https://hrm.tamada.vn`). |
| `PUBLIC_SITE_ORIGIN` | **Bắt buộc production:** origin HTTPS công khai để sinh URL HTTP Listening (ví dụ `https://hrm.tamada.vn`). **Dev/LAN:** có thể override (ví dụ `http://192.168.x.x:3001`); nếu không set, BE suy ra từ `CORS_ORIGIN` hoặc `http://localhost:<PORT>`. |
| `ATTENDANCE_DEVICE_SYNC_ENABLED` | Bật/tắt job đồng bộ tự động (mặc định bật). Chu kỳ chi tiết cấu hình trên FE: **Máy chấm công** → **Lịch đồng bộ**. |
| `ATTENDANCE_DEVICE_SHADOW_MODE` | `true`: xử lý sự kiện ở trạng thái SHADOW, **chưa** ghi `attendances`. |
| `ATTENDANCE_DEVICE_WRITE_TO_ATTENDANCE` | `true` (và shadow tắt): ghi giờ vào/ra thật vào `attendances`. |
| `DEVICE_CREDENTIAL_ENCRYPTION_KEY` | Bắt buộc production để lưu mật khẩu ISAPI mã hóa. |

**Ingest endpoint (Push):** `POST /api/d/e/:token` — máy Hikvision gửi payload sự kiện; token hash lưu DB, plaintext chỉ trả khi create/rotate. Không ghi plaintext token vào access log (nginx redact `/api/d/e/<redacted>`) hay application log; so sánh hash dùng timing-safe.

**Reverse proxy (production):** route `POST /api/d/e/*` tới BE (Nest `DeviceIngestController`), không qua FE auth. Nginx mẫu: `location /api/ { proxy_pass http://tmv-hrm-be:3001/api/; }`. Giữ body POST, HTTPS, timeout ≥ 30s.

**Topology LAN → production:**

```text
Device (192.168.x.x) --HTTPS outbound--> hrm.tamada.vn --proxy--> BE /api/d/e/:token
```

ISAPI pull (server → device) cần VPN/NAT; PUSH không cần kết nối ngược.

**Sự kiện attendance-eligible (Hikvision ACS major 5):**

| minor | Loại |
|-------|------|
| 38 | Card auth success |
| 75 | Face auth success |
| 113 | Fingerprint auth success |

ISAPI pull query `major=5` (không filter minor server-side); lọc 38/75/113 client-side khi parse.

**Trạng thái `attendance_device_events.processing_status`:**

| Status | Ý nghĩa |
|--------|---------|
| PENDING | Chờ xử lý / retry |
| SHADOW | Logic chạy, chưa ghi attendance |
| PROCESSED | Đã ghi attendance |
| FAILED | Lỗi xử lý |
| IGNORED | Không phải sự kiện chấm công |

**Dedup (hai lớp, tách biệt):**

| Lớp | Identity | Mục đích |
|-----|----------|----------|
| Idempotency kỹ thuật | `(device_id, source_event_id)` | Retry/provider gửi lại cùng sự kiện |
| Gom nghiệp vụ | `(device_id, device_user_id, phút lịch VN)` | UI/attendance: một user + một device + một phút → một event giữ lại |

Representative trong cùng phút: `earliest occurredAt` (tie: `id` thấp nhất). DB enforce bằng partial unique index `attendance_device_events_device_user_vn_minute_key`.

**Ghi vào `attendances` (khi `ATTENDANCE_DEVICE_WRITE_TO_ATTENDANCE=true` và shadow tắt):**

1. Lấy toàn bộ event eligible trong **ngày lịch Việt Nam** (`Asia/Ho_Chi_Minh`) của punch.
2. **Giờ vào** = punch **đầu tiên** (theo `occurred_at`); **giờ ra** = punch **cuối** (chỉ khi có ≥ 2 event trong ngày).
3. Một punch duy nhất → `checkIn` được set, `checkOut = null`.
4. **Gộp với app:** `checkIn = min(app, device)`, `checkOut = max(app, device)` — không gọi geofence GPS/WiFi.
5. Chi nhánh gắn máy (`officeLocationId`) được ghi vào `checkInOfficeLocationId` (và tọa độ chi nhánh nếu có).
6. Mỗi event pending được xử lý bằng cách **recompute cả ngày** từ DB (deterministic dù event đến out-of-order).

**API diagnostic vs mutation:**

| Endpoint | Read-only? |
|----------|------------|
| `POST .../push-check` | Có — không import/reprocess |
| `POST .../sync-events` | Không — pull + import + process |
| `POST .../health-check` (Direct) | Có — chỉ cập nhật status kết nối |

**Device delete:** API `DELETE .../attendance-devices/:id` soft-delete (`isActive=false`), vô hiệu token; **không** xóa `attendance_device_events`.

Hướng dẫn người dùng: [Máy chấm công](../for-hr-admin/attendance-devices.md).

#### 6.5 Ghi chú kiến trúc (cho dev)

- FE: `tmv-hrm` · BE: `tmv-hrm-be`
- Tăng ca theo batch: `/time/overtime-batches` và luồng duyệt TP/GĐ (không dùng menu OT đơn lẻ cũ trên sidebar chính)
- Báo lỗi sản phẩm: [GitHub Issues](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new)
