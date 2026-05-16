/**
 * 好油品味｜內容檢查腳本
 * 執行：node scripts/check-content.mjs
 *
 * 檢查項目：
 * - src/data/awards.json 格式正確
 * - src/data/purchase-info.json 格式正確
 * - src/content/**\/*.md frontmatter 欄位完整
 * - public/images 圖片存在
 * - 找出缺 slug、缺 title、缺 category 的 Markdown 檔案
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let errors = 0;
let warnings = 0;

function ok(msg)   { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.warn(`  ⚠ ${msg}`); warnings++; }
function fail(msg) { console.error(`  ✗ ${msg}`); errors++; }

// ── 檢查 JSON 資料檔 ──────────────────────────────────────────────────────────
function checkAwards() {
  const file = path.join(ROOT, 'src/data/awards.json');
  if (!fs.existsSync(file)) { fail('src/data/awards.json 不存在'); return; }

  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { fail(`src/data/awards.json JSON 解析失敗：${e.message}`); return; }

  if (!Array.isArray(data.years)) { fail('awards.json 缺少 years 陣列'); return; }

  let totalAwards = 0;
  for (const y of data.years) {
    if (!y.year)              fail(`awards.json：年度 "${y.yearLabel}" 缺少 year 欄位`);
    if (!y.yearLabel)         fail(`awards.json：year ${y.year} 缺少 yearLabel`);
    if (!y.competitionType)   fail(`awards.json：year ${y.year} 缺少 competitionType`);
    if (!Array.isArray(y.awards)) { fail(`awards.json：year ${y.year} 缺少 awards 陣列`); continue; }

    for (const a of y.awards) {
      if (!a.rank)        fail(`awards.json year ${y.year}：得獎項目缺少 rank`);
      if (!a.rankClass)   fail(`awards.json year ${y.year}："${a.productName}" 缺少 rankClass`);
      if (!a.productName) fail(`awards.json year ${y.year}：得獎項目缺少 productName`);
      totalAwards++;
    }
  }
  ok(`awards.json：${data.years.length} 年度，共 ${totalAwards} 筆得獎紀錄`);
}

function checkPurchaseInfo() {
  const file = path.join(ROOT, 'src/data/purchase-info.json');
  if (!fs.existsSync(file)) { fail('src/data/purchase-info.json 不存在'); return; }

  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { fail(`purchase-info.json JSON 解析失敗：${e.message}`); return; }

  if (!data.year)    fail('purchase-info.json 缺少 year 欄位');
  if (!Array.isArray(data.products)) { fail('purchase-info.json 缺少 products 陣列'); return; }

  let missingLinks = 0;
  for (const p of data.products) {
    if (!p.productName) fail(`purchase-info.json：得獎項目缺少 productName`);
    if (!p.producer)    warn(`purchase-info.json："${p.productName}" 缺少 producer`);
    if (!p.rank)        fail(`purchase-info.json："${p.productName}" 缺少 rank`);
    if (!p.price)       warn(`purchase-info.json："${p.productName}" 缺少 price`);
    if (!p.links || p.links.length === 0) missingLinks++;
  }
  if (missingLinks > 0) warn(`purchase-info.json：${missingLinks} 筆產品尚無購買連結`);
  ok(`purchase-info.json：${data.products.length} 筆得獎業者聯絡資料`);
}

// ── 檢查 Markdown 內容 ────────────────────────────────────────────────────────
const REQUIRED_FRONTMATTER = {
  articles:   ['title', 'date', 'category'],
  activities: ['title', 'date', 'eventType'],
  resources:  ['title', 'type'],
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const meta = {};
  match[1].split('\n').forEach(line => {
    const [k, ...v] = line.split(':');
    if (k) meta[k.trim()] = v.join(':').trim().replace(/^["']|["']$/g, '');
  });
  return meta;
}

function checkMarkdownSection(section) {
  const dir = path.join(ROOT, 'src/content', section);
  if (!fs.existsSync(dir)) {
    warn(`src/content/${section}/ 目錄不存在（尚未建立任何內容）`);
    return;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    warn(`src/content/${section}/ 尚無 Markdown 檔案`);
    return;
  }

  const required = REQUIRED_FRONTMATTER[section] || ['title'];
  let issues = 0;
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const meta = parseFrontmatter(raw);
    if (!meta) {
      fail(`src/content/${section}/${file}：缺少 frontmatter（---...---）`);
      issues++;
      continue;
    }
    for (const field of required) {
      if (!meta[field]) {
        warn(`src/content/${section}/${file}：frontmatter 缺少 "${field}" 欄位`);
        issues++;
      }
    }
  }

  if (issues === 0) ok(`src/content/${section}/：${files.length} 個檔案，格式正確`);
}

// ── 檢查 public/images ────────────────────────────────────────────────────────
function checkImages() {
  const dirs = ['public/images/awards', 'public/images/illust'];
  for (const d of dirs) {
    const full = path.join(ROOT, d);
    if (!fs.existsSync(full)) {
      fail(`${d}/ 目錄不存在`);
    } else {
      const files = fs.readdirSync(full).filter(f => /\.(jpg|png|webp|svg)$/i.test(f));
      if (files.length === 0) warn(`${d}/ 沒有圖片`);
      else ok(`${d}/：${files.length} 張圖片`);
    }
  }
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
console.log('好油品味｜內容檢查中...\n');

console.log('【資料檔】');
checkAwards();
checkPurchaseInfo();

console.log('\n【Markdown 內容】');
checkMarkdownSection('articles');
checkMarkdownSection('activities');
checkMarkdownSection('resources');

console.log('\n【圖片資源】');
checkImages();

console.log(`\n${'─'.repeat(50)}`);
if (errors === 0 && warnings === 0) {
  console.log('✓ 全部通過，無問題。');
} else {
  if (errors > 0)   console.error(`✗ ${errors} 個錯誤需修正後才能建置`);
  if (warnings > 0) console.warn(`⚠ ${warnings} 個警告（不影響建置）`);
}

if (errors > 0) process.exit(1);
