# Beyond AI Lab 資料格式指南

本文件說明 Beyond AI Lab 四種資料的格式、欄位與新增流程，方便持續維護與擴充資料。

---

## 一、資料檔案位置

| 類型 | 檔案路徑 |
|------|----------|
| Prompts | `data/prompts.json` |
| Images | `data/images.json` |
| Songs | `data/songs.json` |
| Stories | `data/stories.json` |

---

## 二、資料模板

模板檔案位於 `data/templates/`：

- `prompt-template.json`
- `image-template.json`
- `song-template.json`
- `story-template.json`

---

## 三、欄位說明

### 3.1 Prompts（prompts.json）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | string | 唯一識別碼，建議必填 |
| title | string | 標題，建議必填 |
| series | string | 所屬系列 |
| tags | array | 標籤陣列 |
| prompt | string | 攝影提示詞內容，建議必填 |
| camera | string | 鏡頭設定（如 85mm f/1.8） |
| mood | string | 氛圍描述 |
| generator | string | 生成工具（如 Midjourney v6） |
| createdAt | string | 建立日期 |
| favorite | boolean | 是否為收藏 |

### 3.2 Images（images.json）

| 欄位 | 類型 | 說明 |
|------|------|------|
| title | string | 標題，建議必填 |
| series | string | 所屬系列 |
| tags | array | 標籤陣列 |
| folder | string | 圖片檔案所在資料夾路徑 |
| file | string | 檔案名稱 |
| prompt | string | 使用的提示詞內容 |
| promptId | string | 對應 prompts.json 的 id，建立連結 |
| camera | string | 鏡頭設定 |
| mood | string | 氛圍描述 |
| generator | string | 生成工具 |
| createdAt | string | 建立日期 |
| favorite | boolean | 是否為收藏 |

### 3.3 Songs（songs.json）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | string | 唯一識別碼，建議必填 |
| title | string | 標題，建議必填 |
| subtitle | string | 副標題 |
| series | string | 所屬系列 |
| tags | array | 標籤陣列 |
| lyrics | string | 歌詞內容 |
| style | string | 風格描述 |
| mood | string | 氛圍描述 |
| generator | string | 生成工具（如 Suno） |
| createdAt | string | 建立日期 |
| favorite | boolean | 是否為收藏 |

### 3.4 Stories（stories.json）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | string | 唯一識別碼，建議必填 |
| title | string | 標題，建議必填 |
| subtitle | string | 副標題 |
| series | string | 所屬系列 |
| tags | array | 標籤陣列 |
| content | string | 完整內容 |
| summary | string | 摘要 |
| mood | string | 氛圍描述 |
| generator | string | 生成工具（如 Human） |
| createdAt | string | 建立日期 |
| favorite | boolean | 是否為收藏 |

---

## 四、建議必填欄位

| 類型 | 建議必填 |
|------|----------|
| Prompts | id, title, prompt |
| Images | title, file, folder |
| Songs | id, title |
| Stories | id, title |

---

## 五、格式與命名規則

### 5.1 id 命名規則

- 使用小寫英文
- 使用連字號（-）
- 建議加上類型前綴：`prompt-`、`song-`、`story-`

範例：

- `prompt-freckled-girl-morning`
- `song-resulting-blooms`
- `story-glimmer100-start`

### 5.2 createdAt 格式

統一使用：**YYYY-MM-DD**

範例：`2026-03-10`

### 5.3 tags 寫法

- 小寫英文
- 陣列格式

範例：

```json
["portrait", "golden-hour", "soft-light"]
```

### 5.4 mood 寫法

- 逗號分隔字串
- 或使用 ` · ` 分隔（如 Warm · Gentle）

範例：

- `"warm, poetic, intimate"`
- `"Gentle, Hopeful"`

### 5.5 series 命名

- 小寫英文
- 使用連字號

範例：

- `female-portrait`
- `impact-texts`
- `original-songs`
- `glimmer-100`

### 5.6 Image 的 promptId 對應

`promptId` 必須對應 `data/prompts.json` 中某筆資料的 `id`。

例如：

- prompts.json 中有一筆 `"id": "prompt-golden-hour-portrait"`
- images.json 中該圖對應的 prompt 可設為 `"promptId": "prompt-golden-hour-portrait"`

這樣在 Image Library 與 Prompt Library 之間會建立連結，可互相導向。

若沒有對應的 prompt，可省略 `promptId` 欄位。

### 5.7 favorite 預設

建議預設為 `false`，除非該筆資料特別標記為收藏。

---

## 六、新增資料流程建議

1. **複製模板**：從 `data/templates/` 複製對應的 template 檔案。
2. **填寫欄位**：依照實際內容填入各欄位。
3. **檢查**：
   - id 是否唯一、符合命名規則
   - promptId（若有）是否對應 prompts.json 中存在的 id
   - createdAt 是否為 YYYY-MM-DD
   - JSON 格式是否正確（逗號、括號、引號）
4. **貼入正式檔案**：將新筆資料貼入對應的 `data/*.json` 陣列中。
5. **儲存**：儲存後重新整理頁面即可看到新資料。

---

## 七、快速參考

| 項目 | 建議格式 |
|------|----------|
| id | 小寫英文 + 連字號，如 `prompt-freckled-girl-morning` |
| createdAt | YYYY-MM-DD |
| tags | `["tag1", "tag2"]` |
| mood | `"warm, poetic, intimate"` |
| series | `female-portrait` |
