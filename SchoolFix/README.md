# 🏫 國姓國小報修系統

基於 Google Apps Script 的校園報修管理系統，提供報修申請、工單管理、報表統計等功能。

## 📋 功能特點

- **公開報修** - 教職員工可上傳照片提交報修單
- **管理後台** - 查看、篩選、處理報修單
- **報表統計** - 日報表、週報表及趨勢分析
- **類別管理** - 自訂修繕分類、細項、地點、單位

## 🚀 部署方式

本專案使用 **GitHub Actions** 自動部署到 Google Apps Script。

### 工作流程

```
本機修改 → git push → GitHub Actions 自動執行 clasp push → GAS 程式碼更新
```

### 首次設定

1. **設定 GitHub Secret**
   - 到 repo 的 Settings → Secrets → Actions
   - 新增 `CLASPRC_JSON`（內容為 `~/.clasprc.json`）

2. **確認 .clasp.json**
   - 確保 `scriptId` 指向正確的 GAS 專案

詳細設定請參考 [GITHUB_ACTIONS_GUIDE.md](GITHUB_ACTIONS_GUIDE.md)

### 更新部署版本

GitHub Actions 只會更新程式碼，**網頁應用程式需手動更新版本**：

1. 打開 GAS 編輯器
2. **部署** → **管理部署作業** → **編輯** → **新版本** → **部署**

## 📂 專案結構

```
SchoolFix/
├── Code.gs              # 主程式入口
├── Database.gs          # 資料庫操作
├── Report.gs            # 報表功能
├── Email.gs             # 郵件通知
├── Index.html           # 首頁
├── RepairForm.html      # 內部報修表單
├── PublicRepairForm.html # 公開報修表單
├── AdminDashboard.html  # 管理後台
├── CategoryManagement.html # 類別管理
├── Reports.html         # 報表統計
├── ReportScripts.html   # 報表 JS
├── Scripts.html         # 共用 JS
└── Styles.html          # 共用 CSS
```

## 🔗 頁面網址

| 頁面 | 參數 |
|-----|------|
| 首頁 | `?page=index` |
| 內部報修 | `?page=form` |
| 公開報修 | `?page=public` |
| 管理後台 | `?page=admin` |
| 報表統計 | `?page=reports` |
| 類別管理 | `?page=category` |

## ⚠️ 首次使用

部署後請在 GAS 編輯器執行 `initializeSheets` 函式，這會：
- 建立「校園修繕系統資料庫」試算表
- 初始化所有工作表及預設資料

## 📄 授權

MIT License
