# Beyond AI Lab Site Audit

本文件為 Beyond AI Lab 網站結構整理與後續收斂的盤點文件，供團隊決策與優先順序參考。

---

## 1. Current Core Pages

目前正式核心頁面（主導航列出的主要功能）：

| 頁面 | 說明 |
|------|------|
| `index.html` | 首頁，dashboard 式彙總 |
| `search.html` | Unified Search，跨 prompts / images / songs / stories 搜尋 |
| `add-entry.html` | Add Entry，建立 JSON 條目（prompt / image / song / story） |
| `prompt-library.html` | Prompt Library，結構化 prompt 檔案庫 |
| `image-library.html` | Image Library，視覺檔案庫 |
| `music-library.html` | Music Library，歌曲檔案庫 |
| `story-library.html` | Story Library，故事檔案庫 |
| `impact-lab.html` | Impact Lab，社會影響實踐 |
| `vibe-coding-lab.html` | Vibe Coding Lab，氛圍式程式實驗 |

---

## 2. Legacy / Secondary Pages

目前仍存在但屬舊版或次要頁面：

| 頁面 | 註記 |
|------|------|
| `prompt-lab.html` | consider merging — 與 Prompt Library 功能重疊，可評估合併或明確分工 |
| `visual-lab.html` | consider merging — 與 Image Library 關係待釐清 |
| `music-lab.html` | keep for now — 首頁 Labs 有連結，保留創作工具定位 |
| `story-lab.html` | keep for now — 首頁 Labs 有連結，保留創作工具定位 |
| `works.html` | keep for now — 作品總覽入口 |
| `visual-works.html` | keep for now — 視覺作品列表 |
| `music-works.html` | keep for now — 音樂作品列表 |
| `story-works.html` | keep for now — 故事作品列表 |
| `steve.html` | keep for now — Creator 頁面 |
| `glimmer100.html` | keep for now — 專案頁面 |
| `series-female-portrait.html` | keep for now — 系列詳情頁 |
| `series-cinematic-mood.html` | keep for now — 系列詳情頁 |
| `series-fantasy-warrior.html` | keep for now — 系列詳情頁 |
| `series-sci-fi-women.html` | keep for now — 系列詳情頁 |
| `when-memory-becomes-story.html` | consider removing from main flow — 單篇故事，可改為 story-library 內連結 |
| `one-hour-road.html` | consider removing from main flow — 單曲頁，可改為 music-library 內連結 |
| `if-that-day-without-you.html` | consider removing from main flow — 單曲頁，可改為 music-library 內連結 |

---

## 3. Data Sources

### 主要 JSON 資料檔

| 路徑 | 用途 |
|------|------|
| `data/prompts.json` | Prompt Library、Latest Additions、Featured Favorites、Recent Activity、Archive Stats |
| `data/images.json` | Image Library、Latest Additions、Featured Favorites、Recent Activity、Archive Stats |
| `data/songs.json` | Music Library、Latest Additions、Featured Favorites、Recent Activity、Archive Stats |
| `data/stories.json` | Story Library、Latest Additions、Featured Favorites、Recent Activity、Archive Stats |

### 模板檔

| 路徑 | 用途 |
|------|------|
| `data/templates/prompt-template.json` | Add Entry 範例載入 |
| `data/templates/image-template.json` | Add Entry 範例載入 |
| `data/templates/song-template.json` | Add Entry 範例載入 |
| `data/templates/story-template.json` | Add Entry 範例載入 |

### 其他

| 路徑 | 用途 |
|------|------|
| `data/female-series.json` | 系列相關展示 |

---

## 4. Current Home Sections

`index.html` 目前主要區塊（由上而下）：

| 區塊 | Class / ID |
|------|------------|
| Hero | `.home-hero`, `.lab-hub-hero` |
| Labs Overview | `.lab-hub-section` |
| Featured Libraries | `.lab-feature-section` |
| Latest Additions | `.latest-additions-section` |
| Archive Stats | `.archive-stats-section` |
| Featured Favorites | `.featured-favorites-section` |
| Continue Creating | `.continue-creating-section` |
| Recent Activity | `.recent-activity-section` |
| Quick Add | `.quick-add-section` |
| Workflow / Philosophy | `.lab-workflow-section` |
| Footer | `.footer--landing` |

---

## 5. Shared Functional Systems

目前已完成的共用能力：

| 系統 | 說明 |
|------|------|
| Unified nav + active state | 主導航、`data-nav-page`、`is-active` 狀態 |
| Unified search | `search.html` 跨四種資料搜尋 |
| Favorites | Library 頁面 favorite 篩選與 localStorage 儲存 |
| Copy actions | 複製 JSON、Lyrics、Style 等 |
| Modal / lightbox | Image、Music、Story 詳情彈窗 |
| Add-entry generator | 表單、Generate ID、templates 載入 |
| Validation | 依類型驗證、error / note 提示 |
| Autosave draft | localStorage `addEntryDraftType`、`addEntryDraftData` |
| Quick add | 首頁與 Library 的 `?type=` 快速入口 |
| Latest / Favorites / Stats / Recent Activity | 首頁動態區塊，fetch 資料即時顯示 |

---

## 6. Cleanup Suggestions

根據目前網站狀態，建議的整理方向：

1. **釐清 Lab 與 Library 定位** — 決定 prompt-lab / visual-lab 與對應 library 的最終角色，避免功能重疊與導航混亂。

2. **統一按鈕與 CTA 樣式** — 整理 `.btn-cta`、`.add-entry-button`、`.library-quick-add-link`、`.continue-creating-link` 等，建立一致的 primary / secondary 層級。

3. **統一 section 間距與結構** — 各區塊的 `padding`、`max-width`、`margin-bottom` 有差異，可建立共用變數或 pattern。

4. **減少重複模式** — Latest Additions、Featured Favorites、Recent Activity 的卡片結構相似，可考慮共用 component 或 utility。

5. **抽離共用 JS helpers** — `escapeHtml`、`truncate`、`sortByCreatedAt`、`getLatestWithDate` 等在多處重複，可集中到 `script.js` 或獨立 `utils.js`。

6. **檢視導航密度** — 主導航目前 9 個項目，手機版需折疊；可評估是否精簡或分組。

7. **統一命名慣例** — 部分使用 kebab-case（`add-entry`）、部分 camelCase（`addEntryType`），可訂定前端命名規範。

8. **單篇內容頁面策略** — `when-memory-becomes-story.html`、`one-hour-road.html` 等，決定是保留獨立 URL 或改為 library 內詳情。

---

## 7. Recommended Next Priorities

接下來最合理的 5 個優先事項（偏向整理與收斂）：

| 優先 | 項目 | 說明 |
|------|------|------|
| 1 | 釐清 Lab vs Library 架構 | 明確各 Lab 與 Library 的職責，更新導航與首頁 Labs 區塊 |
| 2 | 抽離共用 JS 與樣式變數 | 將重複的 helpers 與 CSS 變數集中，減少維護成本 |
| 3 | 統一按鈕與 CTA 設計系統 | 建立 primary / secondary / tertiary 層級，套用到全站 |
| 4 | 單篇內容頁面收斂 | 決定故事、歌曲單篇頁面是否保留，或改為 library 內 modal/detail |
| 5 | 撰寫簡單的 README 或貢獻指南 | 說明專案結構、資料格式、本地開發方式，方便協作 |

---

*文件建立日期：2026-03-12*
