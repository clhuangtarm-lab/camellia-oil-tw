# 好油品味｜內容管理說明

這份文件說明如何新增、修改與上傳網站內容，不需要使用 Notion、CMS 或外部工具。

---

## 資料夾結構

```
src/
  content/
    articles/       ← 知識文章（Markdown）
    activities/     ← 活動與課程（Markdown）
    resources/      ← 出版品與數位資源（Markdown）
  data/
    awards.json         ← 得獎名單
    purchase-info.json  ← 得獎業者購買資訊
public/
  images/
    awards/    ← 品評現場照片
    illust/    ← 插圖
    plants/    ← 植物照片
    stories/   ← 料理照片
  downloads/   ← PDF 下載檔
```

---

## 常用指令

```bash
# 驗證內容格式
npm run content:check

# 新增文章
npm run content:new article my-article-slug

# 新增活動
npm run content:new activity 2026-field-workshop

# 新增出版品
npm run content:new resource camellia-handbook-2025

# 從 Excel 匯入
npm run content:import uploads/awards_115.xlsx awards

# 建置網站（輸出到 dist/）
npm run build
```

---

## 新增文章流程

1. 執行 `npm run content:new article my-slug`，在 `src/content/articles/` 建立 Markdown 檔
2. 開啟檔案，填寫 frontmatter（標題、日期、分類、摘要）
3. 在 `---` 下方撰寫正文（Markdown 格式）
4. 圖片放入 `public/images/illust/`，在文章中以 `![說明](../images/illust/檔名.jpg)` 引用
5. 執行 `npm run content:check` 確認格式正確
6. 執行 `npm run build` 生成網頁

---

## 更新得獎名單

**方法一：直接編輯 JSON**

開啟 `src/data/awards.json`，在 `years` 陣列最前方新增年度區塊：

```json
{
  "year": 116,
  "yearLabel": "116 年度",
  "competitionType": "茶油評鑑",
  "hasPurchaseInfo": true,
  "awards": [
    { "rank": "特優", "rankClass": "top",  "productName": "...", "producer": "..." },
    { "rank": "優等", "rankClass": "good", "productName": "...", "producer": "..." }
  ]
}
```

`rankClass` 值：`top`（特優）、`good`（優等/優選）、`silver`（佳作）

**方法二：從 Excel 匯入**

```bash
npm run content:import uploads/awards_116.xlsx awards
```

Excel 欄位對應：`獎項`、`產品名稱`、`業者`、`評鑑類別`

---

## 更新購買資訊

開啟 `src/data/purchase-info.json`，在 `products` 陣列修改或新增：

```json
{
  "productName": "產品名稱",
  "producer": "業者全名",
  "rank": "特優",
  "rankClass": "top",
  "spec": "250ml",
  "price": "NT$1,200",
  "phone": "0900-000000",
  "contact": "聯絡人姓名",
  "channels": "販售通路說明",
  "note": "備註（如：預購中）",
  "links": [
    { "label": "官網／購買", "url": "https://..." },
    { "label": "Facebook", "url": "https://..." }
  ]
}
```

---

## 版本控管

- 不要覆蓋已確認的 JSON，使用版本號（例如 `awards_v2.json`）存放草稿
- 確認無誤後再將資料複製到 `awards.json`
- 圖片上傳後不要刪除原檔

---

## 常見問題

**Q：圖片要多大？**
A：建議 1200×900 px 以內，JPG 格式，檔案不超過 500KB。

**Q：Markdown 語法怎麼用？**
A：見 `add-article-template.md`，裡面有完整範例。

**Q：build 失敗怎麼辦？**
A：先執行 `npm run content:check`，根據錯誤訊息修正 JSON 或 Markdown 格式。
