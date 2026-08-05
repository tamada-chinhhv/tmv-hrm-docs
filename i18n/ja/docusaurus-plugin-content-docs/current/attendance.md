---
sidebar_position: 9
---

# 勤怠

#### 8.1 仕組み

| 項目 | 内容 |
|------|------|
| 方式 | **Web** — 出勤/退勤 + **GPS**。**モバイル API** — GPS および/または **WiFi**（`wifi.bssid`）。ハードウェア打刻機は**なし**。 |
| ジオフェンス | いずれかの active 拠点半径内の GPS **または** いずれかの **active** 設定 WiFi の BSSID 一致で合格 |
| ジオフェンス省略 | 当日の承認済み **REMOTE_WORK**、または active 拠点に GPS も active WiFi も未設定 |
| Web の制限 | Web は GPS のみ送信。**WiFi のみ**の拠点では、モバイルが `wifi` を送るか GPS を有効にするまで Web 打刻不可 |
| 時間単位 | 分で保存（`checkOut − checkIn`）。**WORK** / **LATE_EARLY** は **勤務シフト**（grace、昼休み、`expectedWorkingMinutes` / `workUnitLabel`）から判定 — 固定 9 時間ルールではない |
| 遅刻・早退 | 承認済み **`LATE_ARRIVAL`** / **`EARLY_DEPARTURE`** が評価閾値と **付与分**（実打刻＋申請カバー分、昼休み重複なし）を調整。承認は打刻時刻を**上書きしない** — 従業員は通常どおり打刻する |
| 再打刻 | 既に時刻がある場合の 2 回目 出勤/退勤 は既存レコードを返す（冪等）。WiFi 打刻に GPS は不要 |
| デプロイ後 | `tmv-hrm-be` で `yarn recompute-attendance` を実行し、保存済み `attendance.status` を新ルールに合わせる（`:dry-run` でプレビュー） |
| タイムゾーン | **`Asia/Ho_Chi_Minh`** |
| 勤怠一覧 の対象 | 勤怠必須の従業員 — ロール `ADMIN` と **勤怠管理の対象外** の従業員は除外 |
| 勤務シフト | **全社既定** を `/sysConfig/settings` で設定 — 従業員別ロスターなし。[8.7](#) 参照 |

:::info
**LATE_EARLY** は設定された **勤務シフト**（開始/終了、grace、昼休み）と **期待労働分**（`workUnitLabel`）で評価され、固定 9h/540 分ルールではありません。承認済み **遅刻/早退申請**がある場合、閾値は **承認された** 到着/退勤時刻を使い、**付与分** = 実労働＋申請カバー分（昼休みの二重計上なし）。例: シフト 08:00–17:00、昼休み 60 分、09:30 までの遅刻承認、打刻 09:30–17:00 → **WORK**（7.5h + 1.5h credit）。打刻 10:00–17:00 → **LATE_EARLY**（承認に対し 30 分遅刻。シフト+grace との比較ではない）。
:::

##### 打刻方式とジオフェンス規則

| 方式 | HRM で利用可？ | 詳細 |
|------|:--------------:|------|
| **Web 自己打刻** | **あり** | `/time/attendance` で 出勤 / 退勤。クライアントは GPS `location`（緯度/経度）を送信。 |
| **モバイル打刻 + WiFi** | **API あり** / アプリ連携は実装次第 | `POST /attendance/check-in|check-out` は `wifi: { ssid, bssid }` を受け付け、照合は BSSID。現行 Flutter アプリは `wifi` を送信しない。 |
| **物理打刻機** | **なし** | 指紋・カード・ZKTeco 等のハードウェア連携はコードベースに存在しない。 |

| ジオフェンス規則 | 詳細 |
|------------------|------|
| 合格 | GPS がいずれかの active 拠点半径内 **または** クライアント BSSID がいずれかの active 設定 WiFi と一致。 |
| スキップ | 当日に承認済み **`REMOTE_WORK`** がある。 |
| 検証なし | active 拠点に GPS も active WiFi も未設定 — 打刻は許可される。 |
| Web 制限 | Web は GPS のみ。**WiFi のみ**拠点ではモバイルが `wifi` を送るか GPS を有効にするまで Web 打刻不可。 |
| モバイル | 照合用に `wifi.bssid`（必須）と `ssid` を送信。 |

##### 労働単位と例

| 単位 | 用途 | 規則 |
|------|------|------|
| **分** | DB 保存とステータス計算 | `checkOutTime − checkInTime`。 |
| **シフト由来の労働単位** | WORK / LATE_EARLY 分類 | `expectedMinutes = (end − start) − lunchBreak`。十分な分かつ遅刻/早退違反なしで **WORK**。 |
| **日** | ダッシュボードの休暇集計 | 1 日あたり `expectedWorkingMinutes / 60` 時間。 |
| **シフト設定** | システム設定 | `work_shift_start_time`, `work_shift_end_time`, `grace_minutes`, `work_shift_lunch_break_minutes`。 |

| 出勤 | 退勤 | 合計分 | ステータス | Day モードグリッド |
|----------|-----------|--------|------------|-------------------|
| 08:00 | 17:00 | 540 | **WORK** | `1`（緑） |
| 08:15 | 17:15 | 540 | **WORK** | `1` |
| 08:00 | 16:30 | 510 | **LATE_EARLY** | `1`（黄） |
| 09:00 | 17:00 | 480 | **LATE_EARLY** | `1`（黄） |
| 08:00 | *(未 退勤)* | — | **FORGOT_CLOCK_IN** または **WORK**（ケースによる） | `F` または 出勤 のみ |
| *(打刻なし)* | *(打刻なし)* | — | チームグリッド: **ABSENT**（`A`）；過去の個人カレンダー: **FORGOT_CLOCK_IN**（`F`） | `A` / `F` |

##### 承認済み遅刻・早退申請

| 規則 | 詳細 |
|------|------|
| 実打刻 | 従業員は通常どおり 出勤/退勤。承認は打刻時刻を埋めたり上書きしたりしない。 |
| 遅刻閾値 | `startTime + grace` ではなく、承認された到着時刻と比較。 |
| 早退閾値 | `endTime − grace` ではなく、承認された退勤時刻と比較。 |
| Credit 分 | 実労働分＋申請カバー分。昼休み重複と二重計上を除く。 |
| WORK | 調整後閾値に違反がなく、付与分が `expectedWorkingMinutes` を満たす。 |

シフト 08:00–17:00、昼休み 60 分、労働単位 8 時間の場合: **09:30** までの遅刻承認＋打刻 09:30–17:00 は **WORK**（実働 7.5h + credit 1.5h）。打刻 10:00–17:00 は承認より 30 分遅いため **LATE_EARLY** のまま。遅刻承認は別の早退を免責しない。

**再打刻:** 時刻保存後の 2 回目 出勤/退勤 は既存レコードを返す（冪等）。WiFi 打刻に GPS は不要。

**デプロイ後:** `tmv-hrm-be` で `yarn recompute-attendance`（または `:dry-run`）を実行し、保存済み `attendance.status` を同期。

| 時間トピック | 値 |
|--------------|-----|
| 業務タイムゾーン | **`Asia/Ho_Chi_Minh`**（UTC+7） |
| 勤怠の「今日」 | ベトナム日付 |
| 表示する 出勤/退勤 | ベトナム時間（UTC スロット規約で保存） |

#### 8.2 自己打刻

1. **勤怠**（`/time/attendance`）— **当月**のみ 出勤/退勤 ボタンが表示される。
2. 確認 → **位置情報** を許可 → GPS が設定拠点半径内であること（当日の承認済み **REMOTE_WORK** を除く）。WiFi 打刻は `wifi.bssid` を送るモバイルクライアント向け。
3. 出勤 後に 退勤。完了するとボタンは非表示。

**遅刻/早退申請が承認された日:** それでも **実際の** 時刻で打刻する。承認は **status の再計算のみ** — 出勤/退勤 を事前設定しない。

**打刻忘れ:** ステータス **FORGOT_CLOCK_IN** / グリッド **F** または **A**。2 回目の打刻、休暇種別（**LATE_ARRIVAL**, **EARLY_DEPARTURE**, **ATTENDANCE_CORRECTION**）、または **手動時刻**（`ATTENDANCE_MANUAL_UPDATE`）で修正。

サーバー側の打刻時間窓（例: シフト開始後 30 分）は**ありません**。

**詳細手順:**

1. **勤怠・休暇** → **勤怠**（`/time/attendance`）、または **概要** のクイック操作。
2. **当月**を選択。他月では打刻ボタンは非表示。
3. **出勤** → 確認 → ブラウザの **位置情報** を許可。
4. 成功すると緑のメッセージと、当日セルに 出勤 時刻が表示される。
5. 出勤 後に **退勤** → 同様に確認/位置検証。完了後ボタンは消える。

**ジオフェンス例外:** 承認済み **`REMOTE_WORK`** は GPS/WiFi をバイパス。拠点 GPS も active WiFi も未設定ならジオフェンスはスキップ。よくあるエラー: `GEO_LOCATION_OR_WIFI_REQUIRED`（GPS も WiFi もなし）、`OUTSIDE_OFFICE_AREA`（GPS/BSSID 不一致）。

| 打刻忘れの状況 | システム記録 | 対処 |
|----------------|--------------|------|
| 出勤 のみ | **FORGOT_CLOCK_IN**、または 退勤 のみ欠けるケースでは WORK | 当日中に 退勤。**EARLY_DEPARTURE** / **ATTENDANCE_CORRECTION**。または HR に手動時刻を依頼。 |
| 退勤 のみ | **FORGOT_CLOCK_IN** | 出勤 を追加。**LATE_ARRIVAL** / **ATTENDANCE_CORRECTION**。または手動時刻。 |
| 過去の稼働日に打刻なし | チームグリッド `A`；個人カレンダー `F` | 休暇申請、訂正申請、または社内の補打刻手順に従う。 |

#### 8.3 データの閲覧

| ロール | 場所 | 範囲 |
|--------|------|------|
| 従業員 | `/time/attendance` | 自分の月次カレンダー |
| マネージャー | `/time/attendance-tracking` | 報告ツリー（`EMPLOYEE_VIEW` / `ATTENDANCE_VIEW_MANAGED_SUBTREE`）または直属のみ（`ATTENDANCE_VIEW_MANAGED`） |
| Admin | 同上 | 勤怠必須の**全**従業員（ロール `ADMIN` と **勤怠管理の対象外** は除外） |

グリッド記号: `1`/`8h` 出勤、`W` 週末、`H` 祝日、休暇コード、`F` 打刻忘れ、`A` 欠勤（チーム表示）、`-` 未来。

**従業員詳細:** `/time/attendance` で日付をクリックすると、出勤/退勤、位置（あれば）、休暇/祝日の提案、権限があれば時刻編集フォームが開く。

**マネージャー手順:** **勤怠一覧**（`/attendance-tracking`）を開く — `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE` が必要。範囲: 全社（`EMPLOYEE_VIEW_ALL`/admin）、管理 subtree（`EMPLOYEE_VIEW` または `ATTENDANCE_VIEW_MANAGED_SUBTREE`）、直属のみ（`ATTENDANCE_VIEW_MANAGED`）。氏名（server-side）、月・1 つ以上の部署で絞り込み、`/attendance-tracking/{id}` で個人詳細を開く。グリッドは **ページネーション**（50 人/ページ; フィルタ後件数超過時に表示）。

| 記号 | Day モード | Hour モード | 意味 |
|------|------------|-------------|------|
| `1` | 出勤 | `{workUnitLabel}`（例: `8h`） | 勤怠ありの WORK または LATE_EARLY |
| *(黄)* | `1` | `{workUnitLabel}` | **LATE_EARLY**: 遅刻・早退・不足 |
| `W` / `H` | 週末 / 祝日 | — | 固定休 / 設定祝日 |
| `PL`, `SL`, `UL`, … | 休暇コード | — | 承認済み休暇種別（コード先頭 2 文字） |
| `F` / `A` / `-` | 忘れ / 欠勤 / 未来 | — | 打刻欠落 / 過去の欠勤 / 未来日 |

分類は 休日・祝日設定 → 承認済み休暇（グリッド上の REMOTE_WORK と ATTENDANCE_CORRECTION を除く）→ シフト/grace と承認済み遅刻/早退に対する勤怠評価の順。過去日に記録がなければ、チーム表示では ABSENT、一部の個人表示では FORGOT_CLOCK_IN。

#### 8.4 編集とエクスポート

- **手動時刻:** `ATTENDANCE_MANUAL_UPDATE` — 本人、Admin、またはマネージャーのサブツリー。**承認フローも監査ログもなし**。その日に休暇申請があっても**ブロックしない**。Admin UI: **今日以前**の任意日。座標は任意。有給/遅刻早退日のヒントあり。**日削除:** 日詳細ダイアログから `(employeeId, date)` の打刻をハード削除（確認必須）。
- **一括手動時刻（勤怠一覧）:** **適用する従業員**（`employeeIds` — inclusion リスト）; 既定は全選択; 選択した従業員のみに適用; ドロップダウン先頭で全選択; チップ折りたたみ（`limitTags`）; 不明 ID は無視。
- **休暇承認:** `LATE_ARRIVAL` / `EARLY_DEPARTURE` → **status のみ**再計算（打刻時刻は不変）。`ATTENDANCE_CORRECTION` / `REMOTE_WORK` → 種別に応じた勤怠効果。
- **エクスポート:** 勤怠一覧 からの Excel `.xlsx` のみ — CSV/PDF なし。

**手動時刻 API:** `PATCH /attendance/manual-time`（`ATTENDANCE_MANUAL_UPDATE` 必須）。従業員詳細（`/attendance-tracking/{id}`）または個人カレンダーで **今日以前**の日付をクリックし、**出勤 / 退勤**（座標は任意）を入力して保存。管理者は有給や遅刻/早退申請がある日でも実打刻を編集可。

| 方法 | 承認？ | 効果 |
|------|:------:|------|
| **手動時刻** | システム承認フロー**なし** | 直接書き込み。編集者/理由の監査履歴なし。休暇申請日でもブロックなし。 |
| **`LATE_ARRIVAL` / `EARLY_DEPARTURE`** | **あり**（承認者 1 名） | status のみ再計算。打刻時刻は不変。 |
| **`ATTENDANCE_CORRECTION` / `REMOTE_WORK`** | **あり** | 種別に応じて勤怠時刻更新またはジオフェンス省略。 |
| 通常の休暇 | 休暇承認 | 打刻時刻を自動編集しない。 |

:::warning
勤怠の監査履歴テーブルはありません。新しい手動値は既存値を上書きします。重要な変更の証跡は HRM 外で保管してください。
:::

#### 8.5 フィルタとデータ出力

| 機能 | 利用可？ | 詳細 |
|------|:--------:|------|
| **月**でフィルタ | あり | 勤怠 / 勤怠一覧 の 月選択。 |
| 従業員**名**でフィルタ | あり | 勤怠一覧 — server-side 検索（ページネーション付き）。 |
| **部署**でフィルタ | あり | 複数部署を選択可。 |
| **ページネーション** | あり | 勤怠一覧: フィルタ後件数が page size 超のとき 50 人/ページ。 |
| 週次フィルタ単体 | なし | 勤怠は月単位のみ。 |
| **Excel**（`.xlsx`）出力 | あり | 勤怠一覧: `GET /attendance/export-workingtime-detail`。`ATTENDANCE_EXPORT` **または** `ATTENDANCE_EXPORT_MANAGED` **または** `ATTENDANCE_EXPORT_MANAGED_SUBTREE`（範囲は権限に一致）。 |
| **CSV / PDF** 出力 | **なし** | — |

Excel には従業員コード、氏名、各日の労働分、欠勤/遅刻/早退コード、残休暇日数などが含まれます。出力範囲はグリッドと同じ: Admin / `ATTENDANCE_EXPORT` は全社; `ATTENDANCE_EXPORT_MANAGED_SUBTREE` は管理 subtree; `ATTENDANCE_EXPORT_MANAGED` は直属のみ。

#### 8.6 権限マトリクス

| 操作 | 従業員 | マネージャー | HR/管理者 |
|------|:------:|:------------:|:--------:|
| 出勤/退勤 | あり* | あり* | あり* |
| 自分のカレンダー | あり* | あり* | あり* |
| Tracking グリッド | なし | あり** | あり |
| チーム内の従業員詳細 | なし | あり** | あり |
| Excel 出力 | なし | あり** | あり |
| 手動時刻 | なし*** | あり**** | あり***** |
| オフィス拠点設定 | なし | なし | あり（`LOCATION_VIEW`） |
| 休日設定 | なし | なし | あり（`HOLIDAY_CONFIG_*`） |
| 勤務シフト設定 | なし | なし | あり（`WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT`） |

\* `ATTENDANCE_VIEW` — \** `EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` / `ATTENDANCE_VIEW_MANAGED` / `ATTENDANCE_VIEW_MANAGED_SUBTREE` + 対応する `ATTENDANCE_EXPORT*` — \*** 付与されない限り — \**** チーム + 権限 — \***** 付与されていれば。

#### 8.7 勤務シフトと勤務スケジュール（Task 09）

> システムには **全社デフォルト勤務シフト** があり、従業員別ロスターはありません。**システム設定 → 勤務シフト**（`/sysConfig/settings`）で設定します。

| 機能 | 状態 |
|------|------|
| 既定の開始/終了 | **あり**: `workShiftStartTime`, `workShiftEndTime` |
| 昼休み | **あり**: `workShiftLunchBreakMinutes`（既定 60） |
| 遅刻/早退 grace | **あり**: `workShiftGraceMinutes`（既定 15） |
| 労働単位プレビュー | **あり**: 設定 上で `(end − start − lunch)` |
| 従業員別/週次ロスター | **なし** |
| 承認付き 1 日シフト変更 | **なし** |

```text
shiftSpanMinutes       = endTime − startTime
expectedWorkingMinutes = shiftSpanMinutes − lunchBreakMinutes
workUnitLabel          = expectedWorkingMinutes / 60（例: "8h", "8.25h"）
```

08:00–17:00、昼休み 60 分のシフトは **8 時間労働単位**になります。遅刻は `startTime + grace`（または承認済み `LATE_ARRIVAL` 時刻）より後。早退は `endTime − grace`（または承認済み `EARLY_DEPARTURE` 時刻）より前。固定休日は **休日・祝日設定** から。

---
