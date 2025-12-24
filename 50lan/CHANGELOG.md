# 開發日誌 - 50嵐飲料訂購系統 🧋

## 版本紀錄

---

### v1.2.0 - 2024-12-23
**功能新增：使用者 Email 記錄**

#### ✨ 新功能
- 新增訂單自動記錄使用者 Gmail 帳號功能
- Google Sheets 新增「Email」欄位（位於「訂購時間」和「姓名」之間）
- 使用 `Session.getActiveUser().getEmail()` 取得登入者資訊

#### 📊 試算表欄位結構更新
```
訂單編號 | 訂購時間 | Email | 姓名 | 部門 | 飲料名稱 | 甜度 | 冰塊 | 容量 | 數量 | 單價 | 小計 | 備註
```

#### ⚠️ 注意事項
- 同一 Google Workspace 網域使用者可正常取得 Email
- 外部 Gmail 使用者可能顯示「未提供」（取決於部署設定）

---

### v1.1.0 - 2024-12-23
**架構轉換：純 GAS 版本**

#### 🔄 重大變更
- 將專案轉換為純 Google Apps Script 專案
- 前端 HTML 嵌入 GAS，透過 `HtmlService` 提供網頁
- 前後端通訊改用 `google.script.run` API

#### 📁 新增檔案
- `gas_version/Code.gs` - GAS 後端程式碼
- `gas_version/Index.html` - 嵌入式前端頁面

#### 🚀 部署方式
- 部署為 GAS 網頁應用程式
- URL 格式：`https://script.google.com/macros/s/.../exec`

---

### v1.0.0 - 2024-12-13
**初始版本發布**

#### ✨ 核心功能
- 精美的 50嵐品牌配色 UI（黃藍配色）
- 響應式設計，支援手機/平板/電腦
- 完整購物車功能
- 客製化選項：甜度、冰塊、容量、數量
- 訂單自動儲存至 Google Sheets
- 即時顯示訂單編號

#### 🍵 菜單內容
| 分類 | 品項數 |
|------|--------|
| 🍵 找好茶 | 14 款 |
| 🧋 找奶茶 | 8 款 |
| 🍋 找新鮮 | 8 款 |
| 🥛 找拿鐵 | 5 款 |
| 🍦 找冰淇淋 | 5 款 |

#### 🛠️ 技術架構
- 前端：HTML5 + CSS3 + Vanilla JavaScript
- 後端：Google Apps Script
- 資料庫：Google Sheets

---

## 待開發功能 (Roadmap)

- [ ] 訂單統計儀表板
- [ ] 每日自動 Email 報表
- [ ] Google Sheets 統計工作表
- [ ] 管理員後台頁面
- [ ] 訂單截止時間設定
- [ ] Line 通知整合

---

## 貢獻者

- 專案維護：cyclonetw

---

*最後更新：2024-12-23*
