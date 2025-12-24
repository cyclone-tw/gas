# 🏫 SchoolFix - 校園修繕系統

基於 Google Apps Script 的校園報修管理系統，提供報修申請、工單管理、報表統計等功能。

## 📋 功能特點

- **公開報修** - 教職員工可上傳照片提交報修單
- **管理後台** - 查看、篩選、處理報修單
- **報表統計** - 日報表、週報表及趨勢分析
- **類別管理** - 自訂修繕分類、細項、地點、單位

## 🚀 快速部署

### 方法一：Cloud Shell 部署（推薦）

```bash
# 1. 安裝 clasp
npm install -g @google/clasp

# 2. 登入 Google 帳號
clasp login --no-localhost

# 3. 克隆專案
git clone https://github.com/cyclone-tw/gas.git
cd gas/SchoolFix

# 4. 建立 GAS 專案
rm -f .clasp.json appsscript.json
clasp create --title "SchoolFix" --type standalone

# 5. 推送程式碼
clasp push
```

### 方法二：手動複製

1. 打開 [script.google.com](https://script.google.com)
2. 新建專案
3. 複製所有 `.gs` 和 `.html` 檔案

### 部署為網頁應用程式

1. 點擊 **部署** → **新增部署作業**
2. 類型選 **網頁應用程式**
3. 執行身分：**我**
4. 有權存取者：**所有已登入 Google 帳戶的使用者**
5. 點擊 **部署**

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
