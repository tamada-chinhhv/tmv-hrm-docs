---
sidebar_position: 13
---

# システム設定

- **休日・祝日設定:** `HOLIDAY_CONFIG_VIEW` / `HOLIDAY_CONFIG_EDIT` — `/sysConfig/holidays`。
- **勤務地設定:** `LOCATION_VIEW` / `LOCATION_MANAGE` — `/sysConfig/locations`。各 **active** 拠点は **GPS** または **active WiFi が 1 件以上**必須（GPS のみ / WiFi のみ / 両方可）。[セクション 7.5.1](#) 参照。
- **システム外観:** `APPEARANCE_VIEW` / `APPEARANCE_EDIT` — **システム設定 → 設定**（`/sysConfig/settings`、**表示設定** アコーディオン）。個人カスタム未設定のユーザーとログイン画面に適用。
- **勤務シフト（全社）:** `WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT` — 同ページ `/sysConfig/settings`、**勤務シフト** アコーディオン。
- **権限割り当て（割当 + 権限グループ）:** `ROLE_VIEW` / `ROLE_MANAGE` — `/sysConfig/assign`（権限グループは `?tab=roles`；`/sysConfig/roles` は `?tab=roles` へリダイレクト）。

> **個人**外観はここでは設定しません — [セクション 7.0](#) を参照。

### 拠点設定（GPS + WiFi）

**パス:** `/sysConfig/locations` — **勤務地の設定** ダイアログ。

| 項目 | 説明 |
|------|------|
| **有効** | 拠点の有効/無効。active 拠点は GPS または active WiFi ≥1 が必須。 |
| **GPS** | **GPSを有効** → 緯度・経度・半径（m）。GPS を無効にするとサーバー上の座標がクリアされる。 |
| **WiFi** | アクセスポイントごと: **SSID**（表示名）+ **BSSID**（AP の MAC、必須）。同一 SSID を複数 AP で共有可。ネットワークごとの **有効** スイッチ。 |
| **現在のWiFiを使用** | `GET /office-locations/wifi/current`（`LOCATION_MANAGE`）。**backend が動いているマシン**の WiFi を読む（Windows `netsh` / Linux `nmcli`）— オフィス網に接続した PC から管理者が設定する用途。 |

**SSID と BSSID:**

- **SSID** — ネットワーク名（複数 AP で重複しうる）。
- **BSSID** — 各 AP の MAC。**打刻照合は BSSID** を使い、SSID 単独では照合しない。
- 従業員の打刻 UI に BSSID は表示されない。設定は管理者のみ。

**設定 API エラーコード:** `OFFICE_METHOD_REQUIRED`, `GPS_ENABLED_INCOMPLETE`, `WIFI_BSSID_INVALID`, `WIFI_BSSID_ALREADY_EXISTS`（同一拠点内の BSSID 重複）。

---
