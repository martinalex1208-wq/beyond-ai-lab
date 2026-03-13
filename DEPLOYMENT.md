# GitHub + Vercel 部署指南

## 1. GitHub 設定

### 建立遠端儲存庫

1. 前往 [GitHub](https://github.com/new) 建立新儲存庫
2. 儲存庫名稱建議：`beyond-ai-lab`
3. 選擇 **Public**，**不要**勾選 "Add a README"
4. 建立後複製儲存庫 URL（例如 `https://github.com/你的帳號/beyond-ai-lab.git`）

### 推送到 GitHub

在專案根目錄執行：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的帳號/beyond-ai-lab.git
git push -u origin main
```

若使用 SSH：

```bash
git remote add origin git@github.com:你的帳號/beyond-ai-lab.git
```

---

## 2. Vercel 部署

### 方式 A：透過 Vercel 網站

1. 前往 [vercel.com](https://vercel.com) 並登入（可用 GitHub 帳號）
2. 點擊 **Add New** → **Project**
3. 選擇 **Import Git Repository**，選取 `beyond-ai-lab`
4. Vercel 會自動偵測為靜態網站，無需額外設定
5. 點擊 **Deploy**

### 方式 B：透過 Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

依提示選擇專案設定，完成後會產生線上網址。

---

## 3. 部署後

- 每次推送到 `main` 分支，Vercel 會自動重新部署
- 預覽網址格式：`https://beyond-ai-lab-xxx.vercel.app`
- 可於 Vercel 專案設定中綁定自訂網域
