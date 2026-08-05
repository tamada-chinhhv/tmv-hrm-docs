---
sidebar_position: 10
---

# 休暇申請

#### 9.1 休暇種別

| コード | `remainingLeaveDays` を減算？ | 備考 |
|--------|:-----------------------------:|------|
| `PAID_LEAVE` | **あり**（承認時） | 範囲内の稼働日ごとに 1 日 |
| `UNPAID_LEAVE`, `SICK_LEAVE` | なし / PAID_LEAVE ロジック外 | 添付ファイルなし |
| `LATE_ARRIVAL`, `EARLY_DEPARTURE` | なし | 承認時: 実打刻＋承認分から **status 再計算** — 出勤/退勤 は**上書きしない** |
| `REMOTE_WORK`, `ATTENDANCE_CORRECTION` | なし | 勤怠効果（ジオフェンス省略 / 種別に応じた打刻時刻） |
| `HIEU_HI` | なし | 有給フラグはあるが残高 UI なし |
| `OVERTIME` | なし | 残業時間。月次 OT 合計は **承認済み** `OVERTIME` のみ（勤怠からの自動 OT 計算なし） |

種別ごとの年次上限（年次有給の自動付与以外）、繰越の期限/上限、添付はシステムにありません。

**年次休暇残高（自動付与）:**

- **毎月1日**（cron 05:00 `Asia/Ho_Chi_Minh`）: **年間休暇日数**（`totalLeaveDays`）と **残休暇日数**（`remainingLeaveDays`）の両方に **+1**。
- **1/1**: 前年残を維持（暗黙の繰越 — リセットなし）+ 1月の **+1** + **勤続** `floor(満了年数 / 5)`（毎年付与; 例: ≥5 → +1、≥10 → +2、≥15 → +3）。
- 月中入社: 初回 +1 は **翌月1日**（`hireDate` < accrual 日）。月中プロラタなし。
- Go-live: HR 入力済み残高を維持; 過去月の **backfill なし**; deploy 月以降から cron 付与。
- カラムは **Decimal(8,2)** — cron は常に整数加算; HR は必要なら小数を手動入力可。
- **`PAID_LEAVE`** 承認時は従来どおり `remainingLeaveDays` から稼働日単位で減算（半日 0.5 なし）。

#### 9.2 申請の作成

**休暇申請**（`/time/leave`）→ フォーム: 種別、日付範囲、時刻（フォーム上の既定のみ 09:00–18:00）、理由、**Approver 1 名**（必須）。送信 → **PENDING**。承認者にアプリ内通知（メールなし）。

**残高超過:** `PAID_LEAVE` は**承認時**にブロック。送信時はブロックしない。

**申請フォーム詳細:**

1. **勤怠・休暇** → **休暇申請**（`/leave`）、または勤怠からクイック作成。
2. **Add** / 申請作成をクリック。
3. 必須の **Leave type**、日付範囲（`YYYY-MM-DD`）、任意の理由を入力。
4. 開始/終了時刻を設定。フォームの 09:00–18:00 既定は勤務シフト既定ではない。
5. `LATE_ARRIVAL` / `EARLY_DEPARTURE` では **分**を入力。複数日を選択可。
6. 候補から必須の **Approver** をちょうど 1 名選び、送信。

> **警告 — 半日 0.5 の減算なし:** UI は時刻を受け付けますが、承認済み `PAID_LEAVE` は重複する稼働日ごとに **1 日**減算し、0.5 日ではありません。

送信後、申請は **PENDING** になり、選択した Approver に `LEAVE_REQUEST_CREATED` がアプリ内で届き、`/leave-approvals` へリンクします。メールは自動送信されません。

#### 9.3 休暇枠と残高

| 指標 | ソース | 意味 |
|------|--------|------|
| **年間休暇日数** | Accrual cron（+ HR 手動上書き可） | 毎月増加（1/1 に勤続加算）。承認では減らない。 |
| **Used** | 別 DB カラムなし | Total − Remaining として手動推定。 |
| **Remaining** | Accrual cron（+ HR 手動上書き可） | 付与で増加。承認済み `PAID_LEAVE` で減算。権限あるユーザーが承認済み PAID_LEAVE を削除すると復元。 |
| **Pending** | 事前減算なし | **Approve** 後にのみ減算。 |

残高は対象の有給フォームと、HR 向け従業員プロフィールに表示されます。

#### 9.4 作成済み申請の閲覧と管理

```
PENDING → APPROVED or REJECTED
```

**一覧ページ:** `/leave`。月とステータスでフィルタ。

| ステータス | コード | 意味 |
|------------|--------|------|
| Pending | `PENDING` | 送信済み、承認待ち。 |
| Approved | `APPROVED` | 受理。休暇減算または勤怠更新の可能性あり。 |
| Rejected | `REJECTED` | 却下。再提出フローなし。 |

別ステータス `CANCELLED` はありません。従業員は **Leave** 上で自分の **PENDING** 申請を **編集**・**削除**可（OT 以外の確認: `leave.confirmDelete`）。**OVERTIME** の **PENDING** は **Cancel** → `PATCH /leave/:id/cancel`（確認: `overtime.confirmCancel`）。承認/却下後は本人による編集/削除不可。

削除後（**PENDING** または **APPROVED**）: backend は関連アプリ内通知（payload の `leaveRequestId`）を削除し、realtime `notifications:removed` と `leave:approvals-changed`（`action: deleted`）を申請者と指定承認者へ送信。

**休暇申請の承認** での **APPROVED** 行の **削除**: **admin**（`ADMIN` ロール）、**指定承認者** / **管理 subtree の上司**（`LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED`）、または `LEAVE_DELETE_APPROVED` を持つユーザー（`PAID_LEAVE` 残高を復元。安全な場合は `LATE_ARRIVAL` / `EARLY_DEPARTURE` / `ATTENDANCE_CORRECTION` の勤怠効果を戻す）。権限エラー: `LEAVE_DELETE_NOT_ALLOWED`（i18n）。

却下時は申請者に `LEAVE_REQUEST_REJECTED` で通知。API は別途の却下理由を**必須としない**。申請時に理由があればそれのみ表示。

#### 9.5 承認ワークフロー（単一ステップ）

- 申請あたり **承認者 1 名** — Manager→HR 連鎖や並列承認ではない。
- 申請者は `GET /leave/approvers` から承認者を選ぶ。候補: 有効な直属上司、部署内の上位役職、親部署の従業員。
- **Inbox（OR）:** `LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED` / `LEAVE_VIEW_MANAGED`。
- **決定（Approve/Reject）:** `LEAVE_APPROVE`（`approverId` 一致）**または** `LEAVE_APPROVE_MANAGED`（申請者が管理 subtree 内）。`LEAVE_VIEW_MANAGED` のみでは決定不可。
- マネージャー不在時の**代理承認なし**（上位が `LEAVE_APPROVE_MANAGED` を持てば subtree 内を決定可）。
- 同一期間に別の **APPROVED** 申請が重複すると **Approve** は `LEAVE_APPROVE_BLOCKED_BY_OVERLAP` でブロック。
- 別の **APPROVED** が重複している間、**承認済み削除**は `LEAVE_DELETE_BLOCKED_BY_OVERLAP` でブロック。
- **差し替え手順:** 旧承認済みを削除 → 新規作成 → 新規を承認。

**承認手順:**

1. `LEAVE_REQUEST_CREATED` 通知、または **休暇申請の承認**（`/leave-approvals`）を開く。
2. 月/ステータスを選び、申請詳細を開く。承認画面は休暇残高を別表示しない。
3. **Approve:** 申請者に通知。`PAID_LEAVE` は `remainingLeaveDays` を減算。特殊種別は勤怠を更新。
4. **Reject:** 申請者に通知。理由は必須ではない。
5. **一括 Approve / Reject:** 決定権限があるとき **PENDING** を複数選択 → ツールバー → 確認 → `POST /leave/approvals/bulk-decide`（item ごと best-effort; toast で成功/失敗数）。
6. 権限あるユーザーは承認済み申請を削除し、該当する休暇/勤怠効果を戻せる。

| 質問 | 回答 |
|------|------|
| マネージャーはチーム全員の申請を承認できる？ | `LEAVE_APPROVE` のみ: **Approver** に選ばれた申請のみ。`LEAVE_APPROVE_MANAGED`: 申請者が管理 subtree 内なら、別人が Approver でも決定可。`LEAVE_VIEW_MANAGED` のみ: subtree を閲覧のみ、決定不可。 |
| HR/管理者はすべての申請を承認できる？ | Admin ロールは権限に従う。一般ユーザーは申請で選ばれているか、`LEAVE_APPROVE_MANAGED` の範囲内、または代理作成でない限り不可。 |
| 不在マネージャーは承認を委任できる？ | 委任機能なし。作成時に別の承認者を選ぶか、上位の `LEAVE_APPROVE_MANAGED` で対応。 |
| 承認済み申請を変更できる？ | いいえ。権限があり重複ブロックでなければ削除し、作り直して承認。 |

| 通知イベント | 受信者 | チャネル |
|--------------|--------|----------|
| 従業員が送信 | 選択した承認者 | アプリ（+ 有効なら Web Push） |
| Approve / Reject | 申請者 | アプリ（+ Push） |
| PENDING 編集 / 削除 | — | 通知なし |
| 未選択の HR/管理者が承認しようとする | — | 不可（403） |

---
