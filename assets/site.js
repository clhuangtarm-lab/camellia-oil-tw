/* Shared site chrome: header + footer + mobile nav */
(function(){
  // Compute path prefix to the project root by reading this script's own URL.
  // We can't rely on window.location.pathname because the preview is served
  // under a deep path; the script src is always relative to the current page
  // and resolves through the same prefix used for assets.
  function prefix(){
    const me = document.currentScript || Array.from(document.scripts).find(s => /assets\/site\.js(\?|$)/.test(s.src));
    if (me && me.src){
      // strip "assets/site.js" (and any querystring) from the end
      const m = me.src.replace(/\?.*$/, '').match(/^(.*\/)assets\/site\.js$/);
      if (m){
        // m[1] is the absolute URL prefix; convert to a relative path by
        // measuring how many segments deep the current page is.
        const pagePath = window.location.pathname.replace(/[^/]*$/, '');
        const scriptPath = new URL(m[1]).pathname;
        if (pagePath.startsWith(scriptPath)){
          const tail = pagePath.slice(scriptPath.length);
          const depth = tail.split('/').filter(Boolean).length;
          return depth ? '../'.repeat(depth) : './';
        }
        // Fall back: use the absolute URL prefix directly
        return m[1];
      }
    }
    return './';
  }
  const P = prefix();

  const NAV = [
    { href: P + 'index.html',                       label: '首頁',                key: 'home' },
    { href: P + 'articles.html#group-intro',        label: '認識國產油茶',         key: 'intro'  },
    { href: P + 'awards.html',                      label: '茶油品評與得獎',       key: 'awards' },
    { href: P + 'articles.html#group-cultivation',  label: '油茶栽培與轉作',       key: 'cult'   },
    { href: P + 'activities.html',                  label: '活動與課程',           key: 'act'    },
    { href: P + 'resources.html',                   label: '出版品與數位資源',     key: 'res'    },
    { href: P + 'about.html',                       label: '關於本站',             key: 'about'  },
  ];

  const MARK_SVG = `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- camellia oil drop -->
      <path d="M16 4 C20 11, 25 16, 25 21 C25 26, 21 29, 16 29 C11 29, 7 26, 7 21 C7 16, 12 11, 16 4 Z" fill="#4F6B3A"/>
      <path d="M13 19 C13 17, 14.5 15.5, 16 15.5 C17.5 15.5, 19 17, 19 19" stroke="#FBF7EA" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="14.5" cy="22.5" r="1" fill="#FBF7EA"/>
    </svg>`;

  function headerHTML(active){
    const links = NAV.map(n => {
      const cls = n.key === active ? 'active' : '';
      return `<a href="${n.href}" class="${cls}">${n.label}</a>`;
    }).join('');
    return `
      <header class="site-header">
        <div class="container">
          <a href="${P}index.html" class="brand" aria-label="好油品味｜回首頁">
            <span class="brand-mark">${MARK_SVG}</span>
            <span class="brand-text">
              <span class="brand-title">好油品味</span><br/>
              <span class="brand-sub">國產油茶資訊網</span>
            </span>
          </a>
          <button class="nav-toggle" aria-label="開啟選單" aria-expanded="false">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2A2A22" stroke-width="2" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="17" x2="20" y2="17"/>
            </svg>
          </button>
          <nav class="nav" id="primary-nav">${links}</nav>
        </div>
      </header>`;
  }

  function footerHTML(){
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="footer-title">好油品味｜國產油茶資訊網</div>
              <div class="footer-text">
                為臺灣國產油茶產業而生的知識平台，整理栽培管理、品評、得獎產品、活動課程與出版資源，串起農友、職人與餐桌之間的好油故事。
              </div>
              <div class="footer-text" style="margin-top: 14px;">
                維護單位｜<strong style="color:#fff;">台灣農業科技資源運籌管理學會</strong>
              </div>
            </div>
            <div>
              <div class="footer-title">網站導覽</div>
              <ul class="footer-links">
                <li><a href="${P}articles.html#group-intro">認識國產油茶</a></li>
                <li><a href="${P}awards.html">茶油品評與得獎產品</a></li>
                <li><a href="${P}purchase.html">115 年得獎產品購買資訊</a></li>
                <li><a href="${P}articles.html#group-cultivation">油茶栽培與轉作知識</a></li>
                <li><a href="${P}articles.html">文章總覽</a></li>
                <li><a href="${P}activities.html">活動與課程</a></li>
                <li><a href="${P}resources.html">出版品與數位資源</a></li>
              </ul>
            </div>
            <div>
              <div class="footer-title">關於與聲明</div>
              <ul class="footer-links">
                <li><a href="${P}about.html">關於本站</a></li>
                <li><a href="${P}privacy.html">隱私權與資料使用聲明</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-legal">
            <span>© 2026 好油品味｜國產油茶資訊網．All rights reserved.</span>
            <span>本站內容僅供農業學習與消費者參考，不構成醫療建議。</span>
          </div>
        </div>
      </footer>`;
  }

  // Mount
  function mount(){
    const active = document.body.dataset.nav || '';
    const headerSlot = document.getElementById('site-header');
    const footerSlot = document.getElementById('site-footer');
    if (headerSlot) headerSlot.outerHTML = headerHTML(active);
    if (footerSlot) footerSlot.outerHTML = footerHTML();

    // mobile nav toggle
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');
    if (toggle && nav){
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
