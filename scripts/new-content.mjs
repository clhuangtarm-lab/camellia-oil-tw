/**
 * 好油品味｜新增內容腳本
 * 執行：node scripts/new-content.mjs [type] [slug]
 *
 * type：article | activity | resource
 * slug：英文 slug，例如 camellia-oil-basics
 *
 * 範例：
 *   node scripts/new-content.mjs article camellia-oil-basics
 *   node scripts/new-content.mjs activity 2026-field-workshop
 *   node scripts/new-content.mjs resource camellia-handbook-2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const today = new Date().toISOString().slice(0, 10);

const TEMPLATES = {
  article: (slug) => `---
title: 文章標題（請修改）
date: ${today}
category: 認識油茶
description: 文章摘要，一至二句話。
lead: 文章導言，顯示在標題下方。
tags: []
---

## 第一段標題

內文從這裡開始。

## 第二段標題

繼續寫...
`,

  activity: (slug) => `---
title: 活動名稱（請修改）
date: ${today}
eventType: 田間技術輔導
location: 地點
status: 即將開始
registrationDeadline: ${today}
description: 活動簡介。
---

## 活動說明

活動內容說明...

## 報名資格

報名條件...

## 聯絡方式

聯絡人：
電話：
Email：
`,

  resource: (slug) => `---
title: 出版品或課程名稱（請修改）
type: 手冊
publisher: 台灣農業科技資源運籌管理學會
year: ${new Date().getFullYear()}
description: 簡介一至二句話。
downloadUrl: /downloads/
---

## 內容說明

這份資源的說明...
`,
};

const TYPE_DIR = {
  article:  'articles',
  activity: 'activities',
  resource: 'resources',
};

function main() {
  const [,, typeArg, slugArg] = process.argv;

  if (!typeArg || !TYPE_DIR[typeArg]) {
    console.error('用法：node scripts/new-content.mjs <article|activity|resource> <slug>');
    console.error('範例：node scripts/new-content.mjs article camellia-oil-basics');
    process.exit(1);
  }

  if (!slugArg) {
    console.error('請提供 slug，例如：camellia-oil-basics');
    process.exit(1);
  }

  const slug = slugArg.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const dir  = path.join(ROOT, 'src/content', TYPE_DIR[typeArg]);
  const file = path.join(dir, `${slug}.md`);

  if (fs.existsSync(file)) {
    console.error(`檔案已存在：src/content/${TYPE_DIR[typeArg]}/${slug}.md`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, TEMPLATES[typeArg](slug), 'utf8');

  console.log(`✓ 建立：src/content/${TYPE_DIR[typeArg]}/${slug}.md`);
  console.log(`  請開啟檔案修改 frontmatter 與內文，完成後執行 npm run content:check`);
}

main();
