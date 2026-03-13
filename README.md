# Beyond AI Lab

Beyond AI Lab 是一個 AI 創作與知識整理系統，用來管理 prompts、images、songs、stories 等創作資產，並提供統一搜尋與創作工具。

---

## System Architecture

系統由三層組成，依序為介面層、工作流程與工具層、以及資料層。

| Layer | 說明 | 對應內容 |
|-------|------|----------|
| **Interface Layer** | 使用者介面與入口 | `index.html`, `search.html`, `prompt-library.html`, `image-library.html`, `music-library.html`, `story-library.html` |
| **Workflow / Tool Layer** | 創作與發佈工具 | `add-entry.html`, `prompt-lab.html`, `visual-lab.html`, `music-lab.html`, `story-lab.html` |
| **Data Layer** | 結構化資料來源 | `data/prompts.json`, `data/images.json`, `data/songs.json`, `data/stories.json` |

- **Interface Layer**：首頁、 Library 頁面、統一搜尋，負責瀏覽、篩選、展示。
- **Workflow / Tool Layer**：Add Entry、各 Lab 工具，負責建立與編輯條目。
- **Data Layer**：JSON 資料檔為唯一儲存，無後端，可部署為靜態網站。

---

## Core Page Roles

| 頁面 | 角色 |
|------|------|
| **index.html** | 首頁，彙整 Labs 連結、Latest Additions、Featured Favorites、Archive Stats、Continue Creating、Recent Activity、Quick Add。 |
| **search.html** | 統一搜尋，跨 prompts、images、songs、stories 查詢與篩選。 |
| **add-entry.html** | 建立 JSON 條目，支援 prompt / image / song / story，含 validation、preview、Copy / Download、Publish Checklist。 |
| **prompt-library.html** | Prompt Library 瀏覽、篩選（category、mood、generator、tag）、favorite、modal 詳情。 |
| **image-library.html** | Image Library 瀏覽、篩選、favorite、lightbox、與 prompt 連動。 |
| **music-library.html** | Music Library 瀏覽、篩選、favorite、modal 詳情。 |
| **story-library.html** | Story Library 瀏覽、篩選、favorite、modal 詳情。 |

---

## Content Publishing Flow

完成表單後，依以下步驟將內容發佈至站點：

1. **Add Entry**
2. 選擇 type：`prompt` / `image` / `song` / `story`
3. 填寫必填欄位
4. 使用 Validation 檢查錯誤
5. 使用 **Copy Array Item** 或 **Download JSON**
6. 貼入對應的 target data file
7. 儲存檔案
8. 重新整理網站
9. 在 Library 或首頁或搜尋中確認條目

### Target Files

| Type | Target File |
|------|-------------|
| Prompt | `data/prompts.json` |
| Image | `data/images.json` |
| Song | `data/songs.json` |
| Story | `data/stories.json` |

**建議**：Array Item 適用於附加至既有 JSON 陣列；Standard JSON 適用於備份或手動編輯。

---

## Core Features

- **Prompt Library** — 結構化 prompt 檔案庫
- **Image Library** — 視覺創作檔案庫
- **Music Library** — 歌曲檔案庫
- **Story Library** — 故事檔案庫
- **Unified Search** — 跨四種資料搜尋
- **Add Entry Tool** — 建立 JSON 條目
- **Draft Autosave** — 自動儲存草稿至 localStorage
- **Favorites** — 收藏與篩選
- **Latest Additions** — 最新加入項目
- **Archive Stats** — 檔案統計
- **Continue Creating** — 快速續接創作
- **Recent Activity** — 近期活動

---

## Project Structure

```
index.html          # 首頁
search.html         # 統一搜尋
add-entry.html      # 新增條目

prompt-library.html
image-library.html
music-library.html
story-library.html
```

---

## Data Structure

```
data/
├── prompts.json
├── images.json
├── songs.json
├── stories.json
└── templates/
    ├── prompt-template.json
    ├── image-template.json
    ├── song-template.json
    └── story-template.json
```

---

## Development Notes

- 所有資料為 JSON
- 無後端
- 可部署為靜態網站
- 使用 localStorage 管理 draft

---

## Future Plans

- Design system
- Library / Lab 架構收斂
- Extract shared components
