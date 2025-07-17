# ShiftApp - Phase 3 UI実装版

本プロジェクトは、シフト提出・管理アプリ「ShiftApp」のフロントエンド（Phase 3）実装をまとめたものです。  
HTML/CSS/JavaScriptで構成され、今後 Google Apps Script（GAS）およびバックエンドAPIとの連携が予定されています。

---

## フェーズごとの成果物

### ✅ 第一フェーズ：要件・基本設計
- 要件定義書：`docs/ShiftApp_Requirement_v1.1.md`
- 基本設計書：`docs/ShiftApp_Basic_Design_v1.2.md`

### ✅ 第二フェーズ：詳細設計
- 詳細設計書：`docs/ShiftApp_Detail_Design_FINAL_v1.1.md`

### ✅ 第三フェーズ：UI・フロント設計
- ガントチャート仕様：`docs/shift_gantt_spec_v2.1.md`

### ✅ GASスクリプト
- `scripts/shift_api_final_bundle.gs` … Web API本体
- `scripts/create_master_sheet_with_notes.gs` … マスタ作成ツール
```


## 📁 ディレクトリ構成（全画面）

```
shiftapp_ui_all/
├── unsubmitted_list/          # 提出不足一覧（Slack通知・CSV出力）
├── shift_table/               # 表形式シフト（CSV出力）
├── shift_pdf_preview/         # PDF出力プレビュー（A4横想定）
├── setting_import_export/     # JSON設定インポート・エクスポート
├── license_manage/            # ライセンス管理（再発行・無効化）
├── slack_notify_setting/      # Slack通知設定（テンプレ編集付き）
```

---

## 🌐 GitHub Pages 公開手順

1. GitHubにて `Settings > Pages` を開く
2. Source を `main` ブランチの `/（root）` に設定
3. 数秒後に公開URLが発行されます：

```
https://[ユーザー名].github.io/shiftapp-ui/
```

---

## 🔗 各画面URL例（直接アクセス）

| 機能名 | URL |
|--------|-----|
| 提出不足一覧 | `/unsubmitted_list/unsubmitted_list.html` |
| 表形式シフト | `/shift_table/shift_table.html` |
| PDFプレビュー | `/shift_pdf_preview/shift_pdf_preview.html` |
| 設定インポート | `/setting_import_export/setting_import_export.html` |
| ライセンス管理 | `/license_manage/license_manage.html` |
| Slack通知設定 | `/slack_notify_setting/slack_notify_setting.html` |

---

## 🔌 今後のGAS/API連携予定

| 画面 | API名（想定） | 説明 |
|------|----------------|------|
| shift_table | `submitShift()` | フロントから提出を送信 |
| unsubmitted_list | `getUnsubmittedList()` | 管理者が未提出者一覧を取得 |
| setting_import_export | `exportSettings() / importSettings()` | JSON設定の保存と復元 |
| license_manage | `issueLicense() / disableLicense()` | ライセンスキー操作 |
| slack_notify_setting | `saveNotifySettings()` | 通知テンプレート保存 |
| shift_pdf_preview | `generatePDF()` | PDF帳票のGAS生成（予定） |

---

## 🧩 拡張予定（Phase 4 以降）

- Slack Webhook連携、カレンダー連携
- ライセンスキーによるアクセス認証
- ログイン＋ロール別UI切替（従業員／管理者）
- スプレッドシート連携による実データ保存

---

## 📄 ライセンス

© 2025 ShiftApp Project Team  
This project is intended for internal and client-specific deployment only.
