# Market Pulse — Deployment Checklist

This guide walks you through deploying the **Market Pulse** static website to GitHub and Vercel.

---

## Prerequisites

- [Git](https://git-scm.com/downloads) installed on your computer
- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free tier works)

---

## Step 1: Initialize Git (if needed)

If your project is not yet a Git repository, open a terminal in the project folder and run:

```bash
git init
```

To check if Git is already initialized, run:

```bash
git status
```

If you see a list of files or "nothing to commit", Git is already set up.

---

## Step 2: Commit the Project

1. **Stage all files:**
   ```bash
   git add .
   ```

2. **Create your first commit:**
   ```bash
   git commit -m "Initial commit: Market Pulse static site"
   ```

---

## Step 3: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** icon in the top-right corner → **New repository**.
3. Fill in the details:
   - **Repository name:** `market-pulse` (or any name you prefer)
   - **Description:** (optional) e.g. "AI Market Decision System"
   - **Visibility:** Public
   - **Do not** check "Add a README file" (you already have files)
4. Click **Create repository**.

---

## Step 4: Push to GitHub

1. **Connect your local project to GitHub** (replace `YOUR_USERNAME` and `YOUR_REPO` with your values):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

2. **Push your code:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

   If prompted, sign in with your GitHub credentials or use a Personal Access Token.

---

## Step 5: Import the Project into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use "Continue with GitHub" for easiest setup).
2. Click **Add New…** → **Project**.
3. Find your **Market Pulse** repository in the list and click **Import**.
4. Vercel will auto-detect the project type. For this static site:
   - **Framework Preset:** Other (or leave as detected)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** Leave empty (no build needed for plain HTML)
   - **Output Directory:** Leave empty or `./`
5. Click **Deploy**.

---

## Step 6: Deploy as a Static Site

Vercel treats this as a static site by default because it only contains HTML, CSS, and JavaScript.

- **No build step required** — the `index.html` file is served directly.
- After deployment, Vercel will give you a URL like: `https://market-pulse-xxx.vercel.app`
- Every push to the `main` branch will trigger a new deployment automatically.

---

## Quick Reference

| Step | Action |
|------|--------|
| 1 | `git init` (if needed) |
| 2 | `git add .` → `git commit -m "Initial commit"` |
| 3 | Create new repo on GitHub |
| 4 | `git remote add origin <url>` → `git push -u origin main` |
| 5 | Import repo in Vercel |
| 6 | Deploy (automatic for static sites) |

---

## Troubleshooting

- **"Repository not found"** — Check that the remote URL is correct and you have push access.
- **Vercel build fails** — Ensure there are no build commands; this project is static and needs none.
- **404 on Vercel** — Make sure `index.html` is in the project root.

---

## Custom Domain (Optional)

In Vercel, go to **Project Settings** → **Domains** to add your own domain.
