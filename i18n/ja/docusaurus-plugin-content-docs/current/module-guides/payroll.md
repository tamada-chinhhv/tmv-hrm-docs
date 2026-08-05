---
sidebar_position: 12
---

# 給与

- `PAYROLL_VIEW`: 給与明細の閲覧（自分または設定に応じた範囲）、給与期間ステータスの参照。
- `PAYROLL_MANAGE`: 作成・再計算・税設定・明細管理。
- `PAYROLL_PERIOD_LOCK`: **給与期間のロック/解除**（`PAYROLL_MANAGE` でも可。期間ロックを含む）。
- **給与期間（`PayrollPeriod`）:** 既定は **未ロック**。HR が **給与** 上で **期間をロック**（`PayrollPeriodControls`）→ ステータス **ロック済み**。ロック中は明細の作成/編集/インポート/コピー不可（API `PAYROLL_PERIOD_LOCKED`）。閲覧と Excel 出力は可能。**ロック解除** には `PAYROLL_MANAGE` または `PAYROLL_PERIOD_LOCK` が必要（解除時に理由必須）。期間ロックは**給与操作のみ**を止めます — 勤怠・休暇は引き続き編集可（[セクション 10.4](#) 参照）。
