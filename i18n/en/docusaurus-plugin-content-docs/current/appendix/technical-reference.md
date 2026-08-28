---
sidebar_position: 50
---

# Technical appendix

For IT / Admin. Most users can skip this.

#### 6.1 URLs

| Environment | URL |
|-------------|-----|
| Production | https://hrm.tamada.vn/ |
| Login | https://hrm.tamada.vn/login |

#### 6.2 Common error codes

| Symptom / code | Suggested action |
|----------------|------------------|
| Outside office / `OUTSIDE_OFFICE_AREA` | Enter GPS radius or matching branch WiFi |
| Missing location / WiFi on punch | Enable GPS or send WiFi info (mobile) |
| Not allowed to delete approved leave | Only admin / authorized approvers |
| Payroll period locked | Unlock (if permitted) before editing payslips |
| OT overlap / over limit | Adjust times or employees on the batch |

#### 6.4 Attendance terminals (Hikvision) — IT notes

| Setting | Meaning |
|---------|---------|
| `CORS_ORIGIN` | Public FE domain (production: `https://hrm.tamada.vn`). |
| `PUBLIC_SITE_ORIGIN` | **Required in production:** public HTTPS origin for HTTP Listening URL generation (e.g. `https://hrm.tamada.vn`). **Dev/LAN:** optional override (e.g. `http://192.168.x.x:3001`); when unset, BE derives from `CORS_ORIGIN` or `http://localhost:<PORT>`. |
| `ATTENDANCE_DEVICE_SYNC_ENABLED` | Enable/disable automatic sync job (default on). Intervals configured in FE: **Attendance devices** → sync schedule panel. |
| `ATTENDANCE_DEVICE_SHADOW_MODE` | `true`: process events as SHADOW, **do not** write `attendances`. |
| `ATTENDANCE_DEVICE_WRITE_TO_ATTENDANCE` | `true` (with shadow off): write real check-in/out to `attendances`. |
| `DEVICE_CREDENTIAL_ENCRYPTION_KEY` | Required in production to encrypt stored ISAPI passwords. |

**Ingest endpoint (Push):** `POST /api/d/e/:token` — Hikvision device posts event payload; token hash stored in DB, plaintext returned only on create/rotate.

**Reverse proxy (production):** route `POST /api/d/e/*` to BE (Nest `DeviceIngestController`), not FE auth. Example Nginx: `location /api/ { proxy_pass http://tmv-hrm-be:3001/api/; }`. Preserve POST body, HTTPS, timeout ≥ 30s.

**LAN → production topology:**

```text
Device (192.168.x.x) --HTTPS outbound--> hrm.tamada.vn --proxy--> BE /api/d/e/:token
```

ISAPI pull (server → device) needs VPN/NAT; PUSH does not need inbound access to the device.

**Attendance-eligible events (Hikvision ACS major 5):**

| minor | Type |
|-------|------|
| 38 | Card auth success |
| 75 | Face auth success |
| 113 | Fingerprint auth success |

ISAPI pull queries `major=5` (no server-side minor filter); client filters 38/75/113 when parsing.

**`attendance_device_events.processing_status`:**

| Status | Meaning |
|--------|---------|
| PENDING | Awaiting processing / retry |
| SHADOW | Logic ran, attendance not written |
| PROCESSED | Written to attendance |
| FAILED | Processing error |
| IGNORED | Not a valid punch event |

**Dedup (two separate layers):**

| Layer | Identity | Purpose |
|-------|----------|---------|
| Technical idempotency | `(device_id, source_event_id)` | Provider retry / same delivery |
| Business aggregation | `(device_id, device_user_id, Vietnam calendar minute)` | UI/attendance: one user + one device + one minute → one retained event |

Representative within the same minute: `earliest occurredAt` (tie: lowest `id`). Enforced by partial unique index `attendance_device_events_device_user_vn_minute_key`.

**Writing to `attendances` (when `ATTENDANCE_DEVICE_WRITE_TO_ATTENDANCE=true` and shadow is off):**

1. Load all eligible events for the **Vietnam calendar day** (`Asia/Ho_Chi_Minh`) of the punch.
2. **Check-in** = **first** punch (by `occurred_at`); **check-out** = **last** punch (only when ≥ 2 events that day).
3. Single punch only → `checkIn` set, `checkOut = null`.
4. **Merge with app:** `checkIn = min(app, device)`, `checkOut = max(app, device)` — no GPS/WiFi geofence.
5. Device branch (`officeLocationId`) stored in `checkInOfficeLocationId` (and office coordinates when available).
6. Each pending event triggers a **full-day recompute** from DB (deterministic even when events arrive out of order).

**API diagnostic vs mutation:**

| Endpoint | Read-only? |
|----------|------------|
| `POST .../push-check` | Yes — no import/reprocess |
| `POST .../sync-events` | No — pull + import + process |
| `POST .../health-check` (Direct) | Yes — connection status only |

**Device delete:** API `DELETE .../attendance-devices/:id` soft-deletes (`isActive=false`), revokes token; **does not** delete `attendance_device_events`.

User guide: [Attendance terminals](../for-hr-admin/attendance-devices.md).

#### 6.5 Architecture notes (for developers)

- FE: `tmv-hrm` · BE: `tmv-hrm-be`
- Overtime batches: `/time/overtime-batches` with dept-head / director approval (legacy single OT menu is not on the main sidebar)
- Product issues: [GitHub Issues](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new)
