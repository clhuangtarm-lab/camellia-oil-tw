# 新增出版品與數位資源範本

複製此範本到 `src/content/resources/resource-slug.md`，或執行：
```
npm run content:new resource resource-slug
```

---

## Frontmatter 說明

```markdown
---
title: 出版品或課程名稱
type: 手冊
publisher: 台灣農業科技資源運籌管理學會
year: 2026
description: 簡介一至二句話。
downloadUrl: /downloads/filename.pdf
externalUrl: https://...
---
```

### type 可用值

- 手冊
- 教材
- 數位課程
- 影片
- 報告

---

## 資源正文範例

```markdown
---
title: 油茶栽培管理技術手冊（2025 年版）
type: 手冊
publisher: 台灣農業科技資源運籌管理學會
year: 2025
description: 涵蓋選地、種苗、栽培、肥培、修剪與採後處理的完整田間指引。
downloadUrl: /downloads/oiltea-handbook-2025.pdf
---

## 內容說明

本手冊整合臺灣油茶栽培研究與田間實作經驗，適合：

- 準備種植油茶的新農
- 已種植油茶但需要系統化管理知識的農友
- 推廣人員與農業技術人員

共 120 頁，含彩色圖解。

## 章節目錄

1. 油茶的品種與選苗
2. 選地與種植規劃
3. 栽培前期管理
4. 肥培管理
5. 修剪操作
6. 病蟲害防治
7. 採後處理與初步加工

## 取得方式

[下載 PDF](/downloads/oiltea-handbook-2025.pdf)

如需紙本，請聯絡：(02)2507-8006
```

---

## 注意事項

- PDF 放入 `public/downloads/`，`downloadUrl` 填入相對路徑（`/downloads/檔名.pdf`）
- 數位課程若在外部平台（如 YouTube），填 `externalUrl`，不需填 `downloadUrl`
- `description` 不超過 60 字
