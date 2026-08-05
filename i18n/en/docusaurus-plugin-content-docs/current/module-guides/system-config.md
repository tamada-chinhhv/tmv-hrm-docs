---
sidebar_position: 13
---

# System configuration

- **Holiday Configuration:** `HOLIDAY_CONFIG_VIEW` / `HOLIDAY_CONFIG_EDIT` — `/sysConfig/holidays`.
- **Office Locations:** `LOCATION_VIEW` / `LOCATION_MANAGE` — `/sysConfig/locations`. Each **active** branch must have **GPS** or **at least one active WiFi network** (GPS only, WiFi only, or both). See [Section 7.5.1](/docs/module-guides/system-config).
- **System appearance:** `APPEARANCE_VIEW` / `APPEARANCE_EDIT` — **System configuration → Settings** (`/sysConfig/settings`, **Appearance** accordion). Applies to users without personal customization and to the login screen.
- **Work shift (system-wide):** `WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT` — same page `/sysConfig/settings`, **Work shift** accordion.
- **Assign permissions (Assign + Role groups):** `ROLE_VIEW` / `ROLE_MANAGE` — `/sysConfig/assign` (tab `roles` for role groups; `/sysConfig/roles` redirects to `?tab=roles`).

> **Personal** appearance is not configured here — see [Section 7.0](/docs/module-guides/account).

### Branch configuration (GPS + WiFi)

**Path:** `/sysConfig/locations` — **Branch configuration** dialog.

| Field | Description |
|-------|-------------|
| **Active** | Branch on/off. An active branch must have GPS or ≥1 active WiFi network. |
| **GPS** | Toggle **Enable GPS** → latitude, longitude, radius (m). Disabling GPS clears coordinates on the server. |
| **WiFi** | Per access point: **SSID** (display name) + **BSSID** (AP MAC, required). Multiple APs may share the same SSID. Per-network **Active** switch. |
| **Detect current WiFi** | Calls `GET /office-locations/wifi/current` (`LOCATION_MANAGE`). Reads WiFi from the **machine running the backend** (Windows `netsh` / Linux `nmcli`) — for admins configuring from a PC on the office network. |

**SSID vs BSSID:**

- **SSID** — network name (may repeat across APs).
- **BSSID** — MAC address of each AP; **attendance matching uses BSSID**, not SSID alone.
- Employees do not see BSSID in the check-in UI; only admins configure it.

**Config API error codes:** `OFFICE_METHOD_REQUIRED`, `GPS_ENABLED_INCOMPLETE`, `WIFI_BSSID_INVALID`, `WIFI_BSSID_ALREADY_EXISTS` (duplicate BSSID within the same branch).

---
