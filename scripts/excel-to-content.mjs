/**
 * 好油品味｜Excel 匯入腳本
 * 執行：node scripts/excel-to-content.mjs <excel檔案路徑> <type>
 *
 * type：awards | purchase | articles | activities | resources
 *
 * 依賴：xlsx 套件（npm install xlsx）
 *
 * 範例：
 *   node scripts/excel-to-content.mjs uploads/awards_2026.xlsx awards
 *   node scripts/excel-to-content.mjs uploads/articles.xlsx articles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Excel 讀取（依賴 xlsx）────────────────────────────────────────────────────
async function loadXlsx() {
  try {
    const mod = await import('xlsx');
    return mod.default || mod;
  } catch {
    console.error('✗ 請先安裝 xlsx 套件：npm install xlsx');
    process.exit(1);
  }
}

// ── 匯入得獎名單 ──────────────────────────────────────────────────────────────
function importAwards(rows, year) {
  const file = path.join(ROOT, 'src/data/awards.json');
  let data = { years: [] };
  if (fs.existsSync(file)) {
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  }

  const rankMap = { '特優': 'top', '優等': 'good', '優選': 'good', '佳作': 'silver' };

  const awards = rows
    .filter(r => r['獎項'] || r['rank'] || r['Rank'])
    .map(r => ({
      rank:        r['獎項'] || r['rank'] || '',
      rankClass:   rankMap[r['獎項'] || r['rank'] || ''] || 'good',
      productName: r['產品名稱'] || r['productName'] || r['名稱'] || '',
      producer:    r['業者'] || r['producer'] || r['廠商'] || '',
    }));

  // Update or insert year block
  const idx = data.years.findIndex(y => y.year === year);
  const block = {
    year,
    yearLabel: `${year} 年度`,
    competitionType: rows[0]?.['評鑑類別'] || '茶油評鑑',
    hasPurchaseInfo: false,
    awards,
  };
  if (idx >= 0) {
    data.years[idx] = block;
    console.log(`  ✓ 更新 ${year} 年度得獎名單（${awards.length} 筆）`);
  } else {
    data.years.unshift(block);
    data.years.sort((a, b) => b.year - a.year);
    console.log(`  ✓ 新增 ${year} 年度得獎名單（${awards.length} 筆）`);
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log('  ✓ 已寫入 src/data/awards.json');
}

// ── 匯入購買資訊 ──────────────────────────────────────────────────────────────
function importPurchase(rows, year) {
  const file = path.join(ROOT, 'src/data/purchase-info.json');
  const rankMap = { '特優': 'top', '優等': 'good', '優選': 'good' };

  const products = rows
    .filter(r => r['產品名稱'] || r['productName'])
    .map(r => ({
      productName: r['產品名稱'] || r['productName'] || '',
      producer:    r['業者']     || r['producer'] || '',
      rank:        r['獎項']     || r['rank'] || '優選',
      rankClass:   rankMap[r['獎項'] || r['rank'] || ''] || 'good',
      spec:        r['規格']     || r['spec'] || '',
      price:       r['售價']     || r['price'] || '',
      phone:       r['電話']     || r['phone'] || '',
      contact:     r['聯絡人']   || r['contact'] || '',
      channels:    r['通路']     || r['channels'] || '',
      note:        r['備註']     || r['note'] || '',
      links: parseLinks(r['連結'] || r['links'] || ''),
    }));

  const data = {
    year,
    note: '本頁資料整理自業者公開資訊與授權，售價、規格、是否預購以業者最新公告為準；本站不代為訂購、亦不會收取相關費用或抽成。若資訊有誤，歡迎來信告知。',
    products,
  };

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  ✓ 已寫入 src/data/purchase-info.json（${products.length} 筆）`);
}

function parseLinks(raw) {
  if (!raw) return [];
  return String(raw).split(/[;；\n]/).map(s => s.trim()).filter(Boolean).map(s => {
    const [label, url] = s.split(/\s*[:：]\s*/);
    return { label: label || '購買連結', url: url || s };
  });
}

// ── 匯入文章 ──────────────────────────────────────────────────────────────────
function importArticles(rows) {
  const dir = path.join(ROOT, 'src/content/articles');
  fs.mkdirSync(dir, { recursive: true });

  let created = 0;
  for (const r of rows) {
    const title = r['標題'] || r['title'] || r['Title'] || '';
    if (!title) continue;

    const slug = (r['slug'] || r['Slug'] || title)
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]/g, '')
      .slice(0, 80);

    const file = path.join(dir, `${slug}.md`);
    if (fs.existsSync(file)) {
      console.warn(`  ⚠ 跳過（已存在）：${slug}.md`);
      continue;
    }

    const today = new Date().toISOString().slice(0, 10);
    const frontmatter = [
      '---',
      `title: "${title.replace(/"/g, '\\"')}"`,
      `date: ${r['日期'] || r['date'] || today}`,
      `category: ${r['分類'] || r['category'] || ''}`,
      `description: "${(r['摘要'] || r['description'] || '').replace(/"/g, '\\"')}"`,
      `lead: "${(r['導言'] || r['lead'] || '').replace(/"/g, '\\"')}"`,
      '---',
    ].join('\n');

    const body = r['內文'] || r['content'] || r['正文'] || '';
    fs.writeFileSync(file, `${frontmatter}\n\n${body}\n`, 'utf8');
    created++;
  }
  console.log(`  ✓ 已建立 ${created} 篇文章到 src/content/articles/`);
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
async function main() {
  const [,, excelPath, typeArg] = process.argv;

  if (!excelPath || !typeArg) {
    console.error('用法：node scripts/excel-to-content.mjs <excel路徑> <awards|purchase|articles|activities|resources>');
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), excelPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`✗ 找不到檔案：${fullPath}`);
    process.exit(1);
  }

  const XLSX = await loadXlsx();
  const wb = XLSX.readFile(fullPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    console.error('✗ Excel 檔案沒有資料列');
    process.exit(1);
  }

  console.log(`好油品味｜匯入 ${typeArg}（${rows.length} 列）...\n`);

  const yearFromFile = parseInt(path.basename(excelPath).match(/\d{3}/)?.[0] || new Date().getFullYear() - 1911);

  switch (typeArg) {
    case 'awards':
      importAwards(rows, yearFromFile);
      break;
    case 'purchase':
      importPurchase(rows, yearFromFile);
      break;
    case 'articles':
    case 'activities':
    case 'resources':
      importArticles(rows);
      break;
    default:
      console.error(`✗ 不支援的類型：${typeArg}`);
      process.exit(1);
  }

  console.log('\n✓ 匯入完成，請執行 npm run content:check 驗證');
}

main().catch(err => { console.error(err); process.exit(1); });
