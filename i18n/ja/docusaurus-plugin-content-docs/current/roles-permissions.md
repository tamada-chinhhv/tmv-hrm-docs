---
sidebar_position: 7
---

# ロールと権限

#### 6.1 組み込みロール

| コード | 表示名 | 典型ユーザー | 概要 |
|--------|--------|--------------|------|
| `ADMIN` | Administrator | IT / HR 責任者 | seed の全権限 |
| `HR_MANAGER` | HR Manager | HR 担当 | ロールは存在。**管理者が権限を付与**（seed では未割当） |
| `EMPLOYEE` | Employee | 一般社員 | 基本: 打刻、休暇閲覧、自分の給与明細 |

各従業員は同時に **1 つ**の `roleId` のみ。

#### 6.2 権限マトリクス（参考）

- **Admin** = `ADMIN` ロール（seed の全権限）。
- **HR** = 通常 `HR_MANAGER` + 管理者が付与した権限。
- **Manager** = `EMPLOYEE_VIEW` + `managerId` 経由の直属/間接部下。`EMPLOYEE_VIEW_ALL` → 全社の閲覧スコープ（list/findOne は Admin 相当）。
- **Employee** = 既定の `EMPLOYEE` ロール。

| 機能 | Admin | HR* | Manager | Employee |
|------|:-----:|:---:|:-------:|:--------:|
| 従業員作成 | 可 | 可* | 不可** | 不可 |
| 従業員更新 | 可 | 可* | 不可** | アカウント → 情報（限定） |
| 従業員削除 | 可 | 可* | 不可 | 不可 |
| 従業員閲覧 — 全社 | 可 | 可* | 不可 | 不可 |
| 従業員閲覧 — チーム | 可 | 可* | 可*** | 不可 |
| 従業員閲覧 — 自分のみ | 可 | 可 | 可 | 可 |
| 他人のパスワード reset | 可 | 可* | 不可 | 不可 |
| 他人の会議編集/削除 | 可* | 可* | 不可 | 不可 |
| 自分の会議編集/削除 | 可 | 可 | 可 | 可 |
| 他人のカレンダー閲覧 | 可 | 可 | 可 | 可 |
| 自分の勤怠 | 可 | 可 | 可 | 可 |
| チーム勤怠トラッキング | 可 | 可* | 可*** | 不可 |
| 休暇承認 | 可 | 可* | 可***** | 不可 |
| 給与の閲覧/管理 | 可 | 可* | 権限による | 自分の閲覧 |
| 部署/役職設定 | 可 | 可* | 不可 | 不可 |
| 休日 / オフィス拠点 | 可 | 可* | 不可 | 不可 |
| ロールと権限割当 | 可 | 可* | 不可 | 不可 |

\* 対応する permission コードが必要。  
\** 管理者が追加権限を付与した場合を除く。  
\*** Manager = `EMPLOYEE_VIEW` + 報告サブツリー。  
\**** カレンダー API の編集/削除: **主催者** または **`CALENDAR_EDIT_ANY`**。  
\***** `LEAVE_APPROVE` が必要。

#### 6.3 スコープ

**Admin（`roleCode = ADMIN`）:** 全従業員の一覧と管理。

**Manager（`EMPLOYEE_VIEW`、Admin 以外 / `EMPLOYEE_VIEW_ALL` なし）:** **報告サブツリー**内の従業員のみ（`managerId` 経由の直属・間接部下）。

**HR / `EMPLOYEE_VIEW_ALL` 保有者:** 全社の従業員一覧（`ADMIN` ロールは不要）。

**一般従業員（`EMPLOYEE_VIEW` / `EMPLOYEE_VIEW_ALL` なし）:** 従業員 API は **自分のみ** を返す。カレンダー用 **directory**（`/employees/directory`）は会議招待のため有効従業員を一覧 — 完全な人事レコードではない。

#### 6.4 ロール割当

| 質問 | 回答 |
|------|------|
| 誰が割当できる？ | `EMPLOYEE_UPDATE` を持つユーザー（通常 Admin/HR） |
| どこで？ | **組織 → 従業員** → 作成/編集 → **ロール** フィールド |
| 複数ロール？ | **不可** — 従業員あたり 1 ロール |
| **ADMIN** ロールの付与？ | ユーザー名 **`admin` のみ** |
| **ADMIN** ロール権限の編集？ | ユーザー名 **`admin` のみ** — システムは常に ADMIN に全権限を付与 |
| 権限の割当は？ | **システム設定 → 権限割り当て**（`/sysConfig/assign`） |

**ロール権限の手順:**

1. **システム設定 → 権限グループ** — ロールの作成/閲覧（`ROLE_VIEW` / `ROLE_MANAGE`）。
2. **システム設定 → 権限割り当て** — ロールを選択 → 権限にチェック → 保存。
3. 従業員フォームでその **ロール** を各従業員に割当。

**期待される結果:**

- **ロールの permission 変更**（手順 1–2）: ユーザーは**ログアウトされない**。次の API 呼び出しでメニュー・操作が更新（リロードやタブ切替でも可）。
- **従業員に割り当てるロール変更**（手順 3）: その従業員は全デバイス/タブで**再ログイン**が必要。
- **ロールを変えずに従業員プロフィールを保存:** その従業員のセッションには影響しない。

#### 6.5 権限コード一覧

| コード | 意味 |
|--------|------|
| `EMPLOYEE_VIEW` | 従業員閲覧（管理 subtree） |
| `EMPLOYEE_VIEW_ALL` | 全社の従業員閲覧（一覧 / 詳細 / 勤怠一覧） |
| `EMPLOYEE_CREATE` | 従業員作成 |
| `EMPLOYEE_UPDATE` | 従業員更新、パスワード reset |
| `EMPLOYEE_DELETE` | 従業員削除 |
| `ATTENDANCE_VIEW` | 勤怠閲覧 / 打刻 |
| `ATTENDANCE_VIEW_MANAGED` | **勤怠一覧** を直属部下のみ閲覧 |
| `ATTENDANCE_VIEW_MANAGED_SUBTREE` | **勤怠一覧** を管理 subtree 全体（直属・間接）で閲覧 |
| `ATTENDANCE_EXPORT` | 労働時間詳細 Excel 出力（勤怠一覧）— 全社 / `EMPLOYEE_VIEW_ALL` 併用 |
| `ATTENDANCE_EXPORT_MANAGED` | 直属部下のみ Excel 出力 |
| `ATTENDANCE_EXPORT_MANAGED_SUBTREE` | 管理 subtree 全体の Excel 出力 |
| `ATTENDANCE_MANUAL_UPDATE` | 手動時刻修正; 勤怠日の削除; 一括日調整 |
| `LOCATION_VIEW` / `LOCATION_MANAGE` | オフィス拠点の閲覧 / 管理 |
| `LEAVE_VIEW` | 休暇申請の閲覧/作成（OT 種別含む） |
| `LEAVE_VIEW_MANAGED` | 管理 subtree の休暇申請を **休暇申請の承認** で閲覧（閲覧のみ；割当 UI では `LEAVE_VIEW` の子） |
| `LEAVE_APPROVE` | 休暇承認（申請で Approver に選ばれた場合） |
| `LEAVE_APPROVE_MANAGED` | 管理 subtree（直属・間接部下）の休暇承認（割当 UI では `LEAVE_APPROVE` の子） |
| `LEAVE_DELETE_APPROVED` | **休暇申請の承認** 上の **承認済み**申請削除（既定: ADMIN）。`LEAVE_APPROVE` / `LEAVE_APPROVE_MANAGED` の承認者も、決定可能な **APPROVED** 行を削除可 |
| `CALENDAR_VIEW` | カレンダー閲覧、自分のイベント作成/編集 |
| `CALENDAR_MANAGE` | 全社カレンダー管理スイッチ |
| `CALENDAR_EDIT_ANY` | 他従業員が所有するカレンダーイベントの編集/削除（既定: ADMIN） |
| `DOCUMENT_VIEW` | 閲覧 + 自分の従業員書類の作成・編集・削除；HR はすべて閲覧可 |
| `DOCUMENT_MANAGE` | 組織全体の書類の作成・編集・削除 + 期限切れ通知ルールの設定 |
| `PAYROLL_VIEW` | 給与明細閲覧 |
| `PAYROLL_MANAGE` | 給与管理/計算、税設定 |
| `PAYROLL_PERIOD_LOCK` | 給与期間のロック/解除 |
| `DEPARTMENT_VIEW` / `DEPARTMENT_MANAGE` | 部署 |
| `POSITION_VIEW` / `POSITION_MANAGE` | 役職 |
| `ROLE_VIEW` / `ROLE_MANAGE` | ロールと権限 |
| `HOLIDAY_CONFIG_VIEW` / `HOLIDAY_CONFIG_EDIT` | 休日設定 |
| `APPEARANCE_VIEW` / `APPEARANCE_EDIT` | **システム外観**の閲覧/編集（`/sysConfig/settings`） |
| `WORK_SHIFT_VIEW` / `WORK_SHIFT_EDIT` | デフォルト勤務シフトの閲覧/編集（`/sysConfig/settings`） |

> **システム外観**（全社既定）: `app_settings` に保存 — 管理者が **システム設定 → 設定** で設定。API `GET/PATCH /settings/appearance`（`APPEARANCE_*`）。**ログイン**と**ログアウト後**は常にシステム外観（`GET /settings/public/appearance`）。  
> **個人外観:** ログイン済みユーザー — **アカウント** → タブ **設定**。`GET/PATCH /auth/me/appearance`。ユーザーが保存した場合のみ上書き（`appearance_customized = true`）。  
> `OVERTIME_*` と `ATTENDANCE_MANAGE` は **削除済み** — 再割当しない。

---
