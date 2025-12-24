# 🚀 GitHub Actions 自動部署指南

> 讓你每次 push 到 GitHub 時，自動執行 `clasp push` 更新 GAS 程式碼。

---

## 📋 什麼時候適合用 GitHub Actions？

| 情況 | 適合使用 | 原因 |
|------|---------|------|
| 團隊協作開發 GAS | ✅ | 確保每個人的 push 都會更新 GAS |
| 個人專案且頻繁更新 | ✅ | 省去手動 `clasp push` 的步驟 |
| 初次開發/測試階段 | ❌ | 手動推送更靈活，便於除錯 |
| 不常更新的專案 | ❌ | 設定成本不划算 |

---

## 🛠️ 設定步驟

### Step 1: 取得 clasp 認證

在本機終端機執行：
```bash
cat ~/.clasprc.json
```

複製輸出的 JSON 內容。

### Step 2: 設定 GitHub Secret

1. 打開 GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. 點擊 **New repository secret**
3. Name: `CLASPRC_JSON`
4. Value: 貼上 `.clasprc.json` 的內容
5. 點擊 **Add secret**

### Step 3: 建立 workflow 檔案

在 repo 根目錄建立 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Google Apps Script

on:
  push:
    branches: [main]
    paths:
      - 'SchoolFix/**'  # 只有這個資料夾變動才觸發

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install clasp
        run: npm install -g @google/clasp
      
      - name: Create clasp credentials
        run: echo '${{ secrets.CLASPRC_JSON }}' > ~/.clasprc.json
      
      - name: Push to GAS
        working-directory: ./SchoolFix
        run: clasp push --force
```

### Step 4: 確認 `.clasp.json` 存在

確保你的專案資料夾（如 `SchoolFix/`）有 `.clasp.json` 檔案：

```json
{
  "scriptId": "你的-GAS-專案-ID",
  "rootDir": ""
}
```

---

## ⚠️ 注意事項

### 1. clasp push ≠ 更新部署

`clasp push` 只更新 GAS 專案的**原始碼**，不會更新已發布的網頁應用程式。

**如果要讓使用者看到更新，仍需手動：**
- GAS 編輯器 → 部署 → 管理部署作業 → 編輯 → 新版本 → 部署

### 2. Token 過期

clasp 的 access_token 會過期，但 refresh_token 會自動更新。如果 Actions 失敗並顯示認證錯誤：
1. 在本機重新執行 `clasp login`
2. 更新 GitHub Secret 的 `CLASPRC_JSON`

### 3. 安全性

- **不要把 `.clasprc.json` 放進 repo！**（已在 `.gitignore` 排除）
- GitHub Secrets 是加密儲存的，安全無虞

---

## 🔍 除錯

### 查看執行狀態

GitHub repo → **Actions** → 點擊 workflow run → 查看日誌

### 常見錯誤

| 錯誤 | 原因 | 解決方案 |
|-----|------|---------|
| `Could not read API credentials` | CLASPRC_JSON 格式錯誤 | 重新複製 `.clasprc.json` 內容 |
| `Script API is not enabled` | GAS API 未啟用 | 在 GCP 啟用 Apps Script API |
| `No .clasp.json found` | 專案路徑錯誤 | 確認 `working-directory` 設定正確 |

---

## 📝 完整流程

1. **本機開發** → 編輯程式碼
2. **Git 操作** → `git add`, `git commit`, `git push`
3. **GitHub Actions** → 自動執行 `clasp push`
4. **GAS 更新** → 程式碼已更新
5. **手動部署**（如需更新網頁應用）→ GAS 編輯器更新部署版本

---

## 🔗 相關資源

- [clasp 官方文件](https://github.com/google/clasp)
- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [Apps Script API](https://developers.google.com/apps-script/api)
