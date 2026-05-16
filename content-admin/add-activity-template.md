# 新增活動範本

複製此範本到 `src/content/activities/activity-slug.md`，或執行：
```
npm run content:new activity activity-slug
```

---

## Frontmatter 說明

```markdown
---
title: 活動名稱
date: 2026-06-01
eventType: 田間技術輔導
location: 地點（縣市 + 鄉鎮）
status: 報名中
registrationDeadline: 2026-05-25
contact: 聯絡電話或 Email
description: 活動簡介，一至二句話。
---
```

### eventType 可用值

- 田間技術輔導
- 研討會
- 品評實作
- 農產加工課程
- 其他

### status 可用值

- 即將開始（尚未開放報名）
- 報名中
- 報名截止
- 已截止
- 已完成

---

## 活動正文範例

```markdown
---
title: 115年度檳榔廢園轉作作物田間技術作業輔導
date: 2026-03-01
eventType: 田間技術輔導
location: 依錄取田區安排
status: 已截止
registrationDeadline: 2026-02-20
contact: (02)2507-8006
description: 針對已轉作油茶的檳榔廢園，提供現地田間技術輔導。
---

## 活動說明

本輔導計畫針對已辦理檳榔廢園轉作之農友，依錄取田區安排現地技術輔導，
由農業技術人員到田間實地了解生長狀況，提供栽培建議。

## 參加對象

- 檳榔廢園轉作油茶田區之農友
- 國內油茶作物生產相關單位
- 各級農會、農民

## 輔導方式

依錄取田區安排現地輔導，不另行辦理集中研習。

## 報名資訊

報名截止日：2026 年 2 月 20 日

聯絡電話：(02)2507-8006
```

---

## 注意事項

- 活動報名截止後請將 status 改為「已截止」
- 活動結束後改為「已完成」
- 若活動有 PDF 簡章，放入 `public/downloads/`，在文章中用連結引用
