# 上傳前檢查清單

每次更新內容後，依序完成以下步驟再上傳。

---

## 1. 內容準備

- [ ] 文章 / 活動 / 資源的 Markdown frontmatter 填寫完整（title、date、category 等必要欄位）
- [ ] 得獎名單 JSON 已更新（新年度放在 `years` 陣列最前方）
- [ ] 購買資訊 JSON 已更新（`year` 欄位與名單年度一致）
- [ ] 所有引用的圖片已放入 `public/images/` 對應子目錄
- [ ] 所有引用的 PDF 已放入 `public/downloads/`

---

## 2. 驗證格式

```bash
npm run content:check
```

- [ ] 執行結果無 `✗` 錯誤（警告可接受，但要說明原因）

---

## 3. 建置網站

```bash
npm run build
```

- [ ] 建置成功（無錯誤訊息）
- [ ] `dist/awards.html` 已生成
- [ ] `dist/purchase.html` 已生成
- [ ] `dist/assets/site.css` 和 `dist/assets/site.js` 存在

---

## 4. 本地瀏覽確認

在 `dist/` 目錄啟動本地伺服器（例如用 Live Server 或 `npx serve dist`）：

- [ ] 首頁正常顯示
- [ ] 得獎名單頁（awards.html）年度資料正確
- [ ] 購買資訊頁（purchase.html）業者資料正確
- [ ] 手機版（320px 寬）排版無破版

---

## 5. 上傳

- [ ] 上傳 `dist/` 目錄內容至網站伺服器（或 GitHub Pages / Netlify）
- [ ] 確認正式網址可開啟

---

## 常見錯誤處理

| 錯誤訊息 | 解法 |
|---------|------|
| `awards.json JSON 解析失敗` | 檢查 JSON 格式，多餘的逗號或缺少引號 |
| `缺少 rankClass` | awards.json 中每筆得獎記錄需加 `"rankClass": "top"` 或 `"good"` |
| `Markdown 缺少 frontmatter` | 確認 .md 檔案最頂端有 `---` 開頭的 frontmatter 區塊 |
| `圖片目錄不存在` | 執行 `mkdir -p public/images/awards` 建立目錄 |
