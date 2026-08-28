---
sidebar_position: 50
---

# 技術付録

IT / 管理者向け。一般利用者は読み飛ばして構いません。

#### 6.1 URL

| 環境 | URL |
|------|-----|
| 本番 | https://hrm.tamada.vn/ |
| ログイン | https://hrm.tamada.vn/login |

#### 6.2 よくあるエラーコード

| 症状 / コード | 対処の目安 |
|---------------|------------|
| オフィス外 / `OUTSIDE_OFFICE_AREA` | GPS 範囲内、または拠点 WiFi に一致 |
| 打刻時に位置 / WiFi なし | GPS 許可、またはモバイルで WiFi 情報送信 |
| 承認済み休暇を削除できない | 管理者 / 権限ある承認者のみ |
| 給与期間ロック済み | 権限があれば解除してから明細編集 |
| OT 重複 / 上限超過 | バッチの時刻や従業員を調整 |

#### 6.4 勤怠端末（Hikvision）— IT メモ

| 設定 | 意味 |
|------|------|
| `CORS_ORIGIN` | 公開 FE ドメイン（本番: `https://hrm.tamada.vn`）。 |
| `PUBLIC_SITE_ORIGIN` | **本番必須:** HTTP Listening URL 生成用の公開 HTTPS origin（例: `https://hrm.tamada.vn`）。**開発/LAN:** 上書き可（例: `http://192.168.x.x:3001`）。未設定時は `CORS_ORIGIN` または `http://localhost:<PORT>` から導出。 |
| `ATTENDANCE_DEVICE_SYNC_ENABLED` | 自動同期ジョブの ON/OFF（既定 ON）。間隔は FE **勤怠端末** → 同期スケジュールで設定。 |
| `ATTENDANCE_DEVICE_SHADOW_MODE` | `true`: SHADOW で処理、**`attendances` には未書き込み**。 |
| `ATTENDANCE_DEVICE_WRITE_TO_ATTENDANCE` | `true`（shadow オフ）: 勤怠表へ本番の出退勤を書き込み。 |
| `DEVICE_CREDENTIAL_ENCRYPTION_KEY` | 本番で ISAPI パスワード暗号化に必須。 |

**Ingest エンドポイント（Push）:** `POST /api/d/e/:token` — Hikvision 端末がイベント payload を POST。トークン hash は DB 保存、平文は作成/再生成時のみ返却。access log（nginx は `/api/d/e/<redacted>`）およびアプリログに平文トークンを出さない。hash 比較は timing-safe。

**リバースプロキシ（本番）:** `POST /api/d/e/*` を BE（Nest `DeviceIngestController`）へ。FE 認証は通さない。Nginx 例: `location /api/ { proxy_pass http://tmv-hrm-be:3001/api/; }`。POST body 保持、HTTPS、timeout ≥ 30s。

**LAN → 本番トポロジ:**

```text
Device (192.168.x.x) --HTTPS outbound--> hrm.tamada.vn --proxy--> BE /api/d/e/:token
```

ISAPI pull（server → device）は VPN/NAT が必要。PUSH は端末へのインバウンド不要。

**勤怠対象イベント（Hikvision ACS major 5）:**

| minor | 種別 |
|-------|------|
| 38 | カード認証成功 |
| 75 | 顔認証成功 |
| 113 | 指紋認証成功 |

ISAPI pull は `major=5` でクエリ（minor はサーバー側未フィルタ）。parse 時に 38/75/113 をクライアント側でフィルタ。

**`attendance_device_events.processing_status`:**

| Status | 意味 |
|--------|------|
| PENDING | 処理待ち / リトライ可 |
| SHADOW | ロジック実行済み、勤怠未書き込み |
| PROCESSED | 勤怠表へ書き込み済み |
| FAILED | 処理エラー |
| IGNORED | 有効な打刻イベントではない |

**重複排除（2 層、独立）:**

| 層 | Identity | 目的 |
|----|----------|------|
| 技術的冪等性 | `(device_id, source_event_id)` | プロバイダ再送 / 同一 delivery |
| 業務集約 | `(device_id, device_user_id, ベトナム暦の分)` | UI/勤怠: 同一 user + device + 分 → 1 件保持 |

同一分内の代表: `earliest occurredAt`（同値時: 最小 `id`）。partial unique index `attendance_device_events_device_user_vn_minute_key` で DB 強制。

**`attendances` への書き込み（`ATTENDANCE_DEVICE_WRITE_TO_ATTENDANCE=true` かつ shadow オフ）:**

1. 打刻の **ベトナム暦日**（`Asia/Ho_Chi_Minh`）の eligible イベントをすべて取得。
2. **出勤** = **最初** の打刻（`occurred_at` 順）。**退勤** = **最後** の打刻（その日 ≥ 2 件のときのみ）。
3. 打刻 1 件のみ → `checkIn` 設定、`checkOut = null`。
4. **アプリとの統合:** `checkIn = min(app, device)`, `checkOut = max(app, device)` — GPS/WiFi geofence なし。
5. 端末の支店（`officeLocationId`）を `checkInOfficeLocationId` に保存（座標があれば同時に保存）。
6. 各 pending イベントは DB から **日次全体を再計算**（到着順不同でも deterministic）。

**API 診断 vs 更新:**

| エンドポイント | Read-only? |
|----------------|------------|
| `POST .../push-check` | はい — import/reprocess なし |
| `POST .../sync-events` | いいえ — pull + import + process |
| `POST .../health-check`（直接接続） | はい — 接続状態のみ |

**端末削除:** API `DELETE .../attendance-devices/:id` は soft-delete（`isActive=false`）、トークン無効化。**`attendance_device_events` は削除しない**。

利用者向け: [勤怠端末](../for-hr-admin/attendance-devices.md).

#### 6.5 構成メモ（開発者向け）

- FE: `tmv-hrm` · BE: `tmv-hrm-be`
- 残業バッチ: `/time/overtime-batches` と部長 / 取締役承認（旧個別 OT メニューはメインサイドバーになし）
- 製品の不具合報告: [GitHub Issues](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new)
