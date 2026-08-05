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

#### 6.3 構成メモ（開発者向け）

- FE: `tmv-hrm` · BE: `tmv-hrm-be`
- 残業バッチ: `/time/overtime-batches` と部長 / 取締役承認（旧個別 OT メニューはメインサイドバーになし）
- 製品の不具合報告: [GitHub Issues](https://github.com/tamada-chinhhv/tmv-hrm-docs/issues/new)
