/**
 * 好油品味｜靜態網站建置腳本
 * 執行：node scripts/build.mjs
 *
 * 工作流程：
 * 1. 清空 dist/
 * 2. 複製 public/（CSS、JS、圖片）
 * 3. 從 src/data/awards.json 生成 dist/awards.html
 * 4. 從 src/data/purchase-info.json 生成 dist/purchase.html
 * 5. 複製 src/pages/ 的靜態 HTML 至 dist/
 * 6. 從 src/content/ 的 Markdown 編譯文章至 dist/articles/（若有 marked 套件）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ── HTML 共用 head（匯入字型、CSS、favicon）──────────────────────────────────
const PAGE_HEAD = (title, description) => `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(description)}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./assets/site.css" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 4 C20 11, 25 16, 25 21 C25 26, 21 29, 16 29 C11 29, 7 26, 7 21 C7 16, 12 11, 16 4 Z' fill='%234F6B3A'/%3E%3C/svg%3E" />
</head>`;

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 工具：遞迴複製目錄 ────────────────────────────────────────────────────────
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// ── 生成 awards.html ──────────────────────────────────────────────────────────
function buildAwards() {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/awards.json'), 'utf8'));

  function awardCard(award, year) {
    const isTop = award.rankClass === 'top';
    return `  <div class="award-card${isTop ? ' award-card--top' : ''}">
    <span class="ribbon ribbon--${award.rankClass}">${escHtml(award.rank)}</span>
    <div style="margin-top: 12px;" class="award-year">${year} 年</div>
    <div class="award-name">${escHtml(award.productName)}</div>
    ${award.producer ? `<div class="award-meta">${escHtml(award.producer)}</div>` : ''}
  </div>`;
  }

  function yearBlock(yearData) {
    const cards = yearData.awards.map(a => awardCard(a, yearData.year)).join('\n');
    const purchaseCta = yearData.hasPurchaseInfo ? `
  <div class="purchase-cta">
    <div class="purchase-cta-text">
      <div class="card-eyebrow" style="margin-bottom: 8px;">${yearData.year} 年得獎產品</div>
      <h3 style="font-family: var(--serif); margin: 0 0 10px;">想知道得獎產品哪裡買？</h3>
      <p class="muted" style="margin: 0 0 16px; font-size: 15px; line-height: 1.8;">
        我們另外整理了 ${yearData.year} 年度得獎業者的官網、電商與聯絡方式，
        方便你直接找到適合自己的好油。購買前建議先洽業者確認庫存狀態。
      </p>
      <a class="btn btn--primary" href="./purchase.html">查看 ${yearData.year} 年得獎產品購買資訊 →</a>
    </div>
    <div class="purchase-cta-art">
      <img src="./images/awards/a3.jpg" alt="" />
    </div>
  </div>` : '';

    return `
    <div class="award-year-block" style="margin-bottom: 56px;">
      <div class="sec-head" style="margin-bottom: 22px;">
        <div>
          <div class="card-eyebrow">${escHtml(yearData.yearLabel)}</div>
          <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-top: 4px;">${escHtml(yearData.competitionType)}</h3>
        </div>
      </div>
      <div class="grid grid--3">
${cards}
</div>
      ${purchaseCta}
    </div>`;
  }

  // Group year blocks into sections (first year = tight+first, subsequent = tight)
  const yearBlocks = data.years.map(y => yearBlock(y)).join('');

  const html = `${PAGE_HEAD(
    '茶油品評與得獎產品｜好油品味｜國產油茶資訊網',
    '台灣國產油茶與茶油評鑑歷年得獎名單整理。'
  )}
<body data-nav="awards">
<div id="site-header"></div>

<section class="article-hero">
  <div class="hero-bg"></div>
  <div class="container" style="position: relative; z-index: 1;">
    <div class="article-meta">
      <span class="tag tag--yolk">茶油品評與得獎產品</span>
    </div>
    <h1 class="article-title">看見來自不同產區的<span class="scribble-underline">好油</span></h1>
    <p class="article-lead">
      國產油茶與茶油品評由農友、職人與評審共同參與，從茶籽田間管理到榨油成品逐項把關。
      這裡整理近年得獎名單，以及品評現場的紀錄。
    </p>
  </div>
</section>

<section class="section section--tight section--first">
  <div class="container">
    <div class="grid grid--4">
      <img src="./images/awards/a1.jpg" alt="2026 茶油品評現場" style="border-radius: 18px; aspect-ratio: 4/3; object-fit: cover; object-position: center 65%;" />
      <img src="./images/awards/a4.jpg" alt="評審聞香品評" style="border-radius: 18px; aspect-ratio: 4/3; object-fit: cover;" />
      <img src="./images/awards/a2.jpg" alt="茶油樣本品評" style="border-radius: 18px; aspect-ratio: 4/3; object-fit: cover;" />
      <img src="./images/awards/a3.jpg" alt="評審與業者交流" style="border-radius: 18px; aspect-ratio: 4/3; object-fit: cover;" />
    </div>
  </div>
</section>

  <section class="section section--tight">
    <div class="container">
      ${data.years.slice(0, 2).map(y => yearBlock(y)).join('\n    ')}
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      ${data.years.slice(2).map(y => yearBlock(y)).join('\n    ')}
    </div>
  </section>

<section class="section section--tight">
  <div class="container container--narrow">
    <div class="callout">
      <div class="callout-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
      </div>
      <div>
        <strong style="display:block; margin-bottom: 4px; color: var(--seed);">關於得獎名單</strong>
        本頁整理自國產油茶相關評鑑公開資訊，年度與獎項以官方公告為準；產品銷售與庫存狀態請以業者最新公告為準，本站不代為訂購。
      </div>
    </div>
  </div>
</section>

<div id="site-footer"></div>
<script src="./assets/site.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST, 'awards.html'), html, 'utf8');
  console.log('  ✓ dist/awards.html');
}

// ── 生成 purchase.html ────────────────────────────────────────────────────────
function buildPurchase() {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/purchase-info.json'), 'utf8'));

  const rankTagClass = { '特優': 'tag--yolk', '優等': 'tag--leaf', '優選': 'tag--leaf' };

  function productCard(p) {
    const rows = [];
    if (p.spec)    rows.push(`<div class="muted small">規格</div><div>${escHtml(p.spec)}</div>`);
    if (p.price)   rows.push(`<div class="muted small">售價</div><div>${escHtml(p.price)}</div>`);
    if (p.phone)   rows.push(`<div class="muted small">電話</div><div>${escHtml(p.phone)}</div>`);
    if (p.contact) rows.push(`<div class="muted small">聯絡人</div><div>${escHtml(p.contact)}</div>`);

    const linksHtml = p.links.length
      ? `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px;">${
          p.links.map(l => `<a href="${escHtml(l.url)}" target="_blank" rel="noopener" class="btn btn--ghost" style="padding: 8px 16px; font-size:14px;">${escHtml(l.label)}</a>`).join('')
        }</div>`
      : `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px;"></div>`;

    const tagClass = rankTagClass[p.rank] || 'tag--soft';

    return `  <article class="card" style="border-radius: 20px;">
    <div style="padding: 24px 26px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap: 12px; margin-bottom: 14px;">
        <span class="tag ${tagClass}">${escHtml(p.rank)}</span>
        <span class="muted small">${data.year} 年</span>
      </div>
      <h3 style="font-family: var(--serif); font-size: 1.15rem; line-height: 1.4; margin: 0 0 4px;">${escHtml(p.productName)}</h3>
      <div class="muted" style="font-size: 14px; margin-bottom: 14px;">${escHtml(p.producer)}</div>
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; font-size: 14px; color: var(--ink-soft); padding: 14px 0; border-top: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft);">
        ${rows.join('\n        ')}
      </div>
      ${p.channels ? `<p class="muted small" style="margin: 12px 0 0;">${escHtml(p.channels)}</p>` : ''}
      ${p.note    ? `<p class="muted small" style="margin: 12px 0 0;">${escHtml(p.note)}</p>` : ''}
      ${linksHtml}
    </div>
  </article>`;
  }

  const cards = data.products.map(p => productCard(p)).join('\n');

  const html = `${PAGE_HEAD(
    `${data.year} 年得獎產品購買資訊｜好油品味｜國產油茶資訊網`,
    `${data.year} 年度茶油評鑑得獎業者的官網、電商與聯絡方式。`
  )}
<body data-nav="awards">
<div id="site-header"></div>

<section class="article-hero">
  <div class="hero-bg"></div>
  <div class="container" style="position: relative; z-index: 1;">
    <div class="article-meta">
      <a href="./awards.html" class="tag tag--soft">← 茶油品評與得獎</a>
      <span class="tag tag--yolk">${data.year} 年得獎產品購買資訊</span>
    </div>
    <h1 class="article-title">把得獎好油，<br/>帶回自己的廚房</h1>
    <p class="article-lead">
      整理 ${data.year} 年度茶油評鑑得獎業者的官網、電商、社群與聯絡方式。
      購買前建議先與業者確認規格、運送方式與是否需預購。
    </p>
  </div>
</section>

<section class="section section--first">
  <div class="container">
    <div class="grid grid--3">
${cards}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="container container--narrow">
    <div class="callout">
      <div class="callout-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
      </div>
      <div>
        <strong style="display:block; margin-bottom: 4px; color: var(--seed);">關於購買資訊</strong>
        ${escHtml(data.note)}
      </div>
    </div>
    <div style="margin-top: 28px; text-align: center;">
      <a href="./awards.html" class="article-next-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        回到品評與得獎產品
      </a>
    </div>
  </div>
</section>

<div id="site-footer"></div>
<script src="./assets/site.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(DIST, 'purchase.html'), html, 'utf8');
  console.log('  ✓ dist/purchase.html');
}

// ── 複製靜態 HTML 頁面 ────────────────────────────────────────────────────────
function copyStaticPages() {
  const pagesDir = path.join(ROOT, 'src/pages');
  if (!fs.existsSync(pagesDir)) return;

  function copyPages(src, dst) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, entry.name);
      const d = path.join(dst, entry.name);
      if (entry.isDirectory()) {
        copyPages(s, d);
      } else if (entry.name.endsWith('.html')) {
        // Rewrite asset paths: ./assets/ → ./assets/ is already correct for root-level pages.
        // For pages in subdirs (articles/), paths need ../ prefix.
        const depth = dst === DIST ? 0 : 1;
        let content = fs.readFileSync(s, 'utf8');
        if (depth > 0) {
          content = content
            .replace(/href="\.\/assets\//g, 'href="../assets/')
            .replace(/src="\.\/assets\//g, 'src="../assets/')
            .replace(/src="\.\/images\//g, 'src="../images/')
            .replace(/href="\.\/images\//g, 'href="../images/')
            .replace(/(href|src)="\.\/(index|about|awards|purchase|articles|activities|resources|privacy)\.html/g,
              (_, attr, page) => `${attr}="../${page}.html`);
        }
        fs.writeFileSync(d, content, 'utf8');
      }
    }
  }

  copyPages(pagesDir, DIST);
  console.log('  ✓ Static pages copied from src/pages/');
}

// ── 複製 public/ 靜態資源 ────────────────────────────────────────────────────
function copyPublic() {
  const publicDir = path.join(ROOT, 'public');
  if (fs.existsSync(publicDir)) {
    copyDir(publicDir, DIST);
    console.log('  ✓ public/ assets copied');
  }
}

// ── 從 Markdown 編譯文章（依賴 marked）──────────────────────────────────────
async function buildMarkdownArticles() {
  const contentDir = path.join(ROOT, 'src/content');
  if (!fs.existsSync(contentDir)) return;

  let marked;
  try {
    ({ marked } = await import('marked'));
  } catch {
    // marked not installed; skip Markdown compilation
    return;
  }

  const sections = [
    { dir: 'articles',   outDir: 'articles',   nav: 'articles' },
    { dir: 'activities', outDir: 'activities',  nav: 'act' },
    { dir: 'resources',  outDir: 'resources',   nav: 'res' },
  ];

  for (const { dir, outDir, nav } of sections) {
    const srcDir = path.join(contentDir, dir);
    if (!fs.existsSync(srcDir)) continue;
    const dstDir = path.join(DIST, outDir);
    fs.mkdirSync(dstDir, { recursive: true });

    for (const file of fs.readdirSync(srcDir)) {
      if (!file.endsWith('.md')) continue;
      const raw = fs.readFileSync(path.join(srcDir, file), 'utf8');

      // Parse simple frontmatter (--- key: value ---)
      let meta = {};
      let body = raw;
      const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (fmMatch) {
        fmMatch[1].split('\n').forEach(line => {
          const [k, ...v] = line.split(':');
          if (k) meta[k.trim()] = v.join(':').trim();
        });
        body = fmMatch[2];
      }

      const title = meta.title || file.replace('.md', '');
      const htmlBody = marked.parse(body);
      const slug = file.replace('.md', '');

      const html = `${PAGE_HEAD(
        `${title}｜好油品味｜國產油茶資訊網`,
        meta.description || ''
      )}
<body data-nav="${nav}">
<div id="site-header"></div>

<section class="article-hero">
  <div class="hero-bg"></div>
  <div class="container" style="position: relative; z-index: 1;">
    <div class="article-meta">
      ${meta.category ? `<span class="tag tag--green">${escHtml(meta.category)}</span>` : ''}
    </div>
    <h1 class="article-title">${escHtml(title)}</h1>
    ${meta.lead ? `<p class="article-lead">${escHtml(meta.lead)}</p>` : ''}
  </div>
</section>

<section class="section section--tight section--first">
  <div class="container container--reading">
    <div class="prose">
      ${htmlBody}
    </div>
  </div>
</section>

<div id="site-footer"></div>
<script src="../assets/site.js"></script>
</body>
</html>`;

      fs.writeFileSync(path.join(dstDir, `${slug}.html`), html, 'utf8');
    }
  }
  console.log('  ✓ Markdown articles compiled');
}

// ── 主流程 ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('好油品味｜開始建置...');

  // Clean dist
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  copyPublic();
  copyStaticPages();
  buildAwards();
  buildPurchase();
  await buildMarkdownArticles();

  console.log('\n✓ 建置完成 → dist/');
}

main().catch(err => { console.error(err); process.exit(1); });
