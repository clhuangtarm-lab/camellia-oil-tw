# CLAUDE.md｜好油品味國產油茶資訊網

## 專案目標
這是一個國產油茶知識型網站，用來推廣臺灣國產油茶。網站服務農友與一般消費者，語氣親切、清楚、不說教。

## 技術架構
- 純靜態 HTML + CSS + JS（無框架）
- 本地 Markdown / JSON 管理內容
- Node.js 建置腳本（scripts/build.mjs）
- 不使用外部資料庫

## 專案結構
```
src/
  content/
    articles/   ← 知識文章 Markdown
    activities/ ← 活動與課程 Markdown
    resources/  ← 出版品與數位資源 Markdown
  data/
    awards.json         ← 得獎名單（生成 dist/awards.html）
    purchase-info.json  ← 購買資訊（生成 dist/purchase.html）
  pages/               ← 靜態 HTML 來源頁面
    articles/           ← 個別文章 HTML
    categories/         ← 文章分類頁
    index.html, about.html, ...
public/
  assets/              ← site.css, site.js
  images/
    awards/            ← 品評照片（a1.jpg~a4.jpg）
    illust/            ← 插圖（01.png~16.png）
    plants/            ← 植物照片
    stories/           ← 料理照片
  downloads/           ← PDF 下載
scripts/
  build.mjs            ← 主建置腳本
  check-content.mjs    ← 內容驗證
  new-content.mjs      ← 建立新內容檔
  excel-to-content.mjs ← Excel 匯入
content-admin/         ← 內容管理說明文件與範本
dist/                  ← 建置輸出（部署此目錄）
```

## 資料驅動頁面
這兩個頁面由 JSON 生成，**不要手動編輯 dist/ 下的 HTML**：
- `dist/awards.html` ← 從 `src/data/awards.json` 生成
- `dist/purchase.html` ← 從 `src/data/purchase-info.json` 生成

更新得獎名單：編輯 `src/data/awards.json`，執行 `npm run build`。

## 工作規則
- 不要直接刪除 Markdown 文章
- 不要改動文章正文，除非使用者明確要求
- 修改前先說明將修改哪些檔案
- 新增內容後要執行 `npm run content:check`
- 交付前要執行 `npm run build`
- 若 build 失敗，要修正到成功
- **不要編輯 dist/ 目錄下的檔案**（每次 build 都會重新生成）

## 寫作規則
- 使用繁體中文
- 避免 AI 腔與過度宣傳語
- 不說教
- 文章寫給讀者看，不混入內部說明
- 機能性研究需標示研究層級，不寫成產品療效宣稱

## 視覺規則（設計系統）
設計系統定義於 `public/assets/site.css`：
- 主色：油茶綠（--green: #4F6B3A）、茶油黃（--yolk: #E9B83A）、米白（--rice: #FBF7EA）、茶籽棕（--seed: #7A5638）、嫩葉綠（--leaf: #8FB069）
- 字型：Noto Serif TC（標題）、Noto Sans TC（內文）
- 不使用大面積紅色
- 溫暖自然扁平手繪插畫風

## 常用 npm 指令
```bash
npm run content:check   # 驗證所有內容格式
npm run content:new article slug   # 新增文章
npm run content:import file.xlsx awards  # 從 Excel 匯入
npm run build           # 建置網站到 dist/
```
