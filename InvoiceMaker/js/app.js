const LS = {
  shop: 'im_shop',
  items: 'im_items',
  emailjs: 'im_emailjs',
  mapping: 'im_mapping',
  orders: 'im_orders',
  seq: 'im_invoice_seq',
  sentlog: 'im_sentlog',
  sheetCache: 'im_sheet_cache'
};

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch(e) { return fallback; }
}

function saveJSON(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

const CURRENCY_LOCALE = {
  IDR: { locale: 'id-ID', frac: 0 },
  USD: { locale: 'en-US', frac: 2 },
  SGD: { locale: 'en-SG', frac: 2 },
  MYR: { locale: 'ms-MY', frac: 2 },
  JPY: { locale: 'ja-JP', frac: 0 },
  PHP: { locale: 'en-PH', frac: 2 }
};

function getCurrency() {
  const s = loadJSON(LS.shop, {});
  return s.currency || 'IDR';
}

function formatMoney(n) {
  const cur = getCurrency();
  const conf = CURRENCY_LOCALE[cur] || CURRENCY_LOCALE.IDR;
  return new Intl.NumberFormat(conf.locale, {
    style: 'currency',
    currency: cur,
    minimumFractionDigits: conf.frac
  }).format(Math.round(n || 0));
}

function toast(msg) {
  let t = document.getElementById('toast');
  if(!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3000);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function updateClock() {
  const clockEl = document.getElementById('liveClock');
  if(!clockEl) return;
  const now = new Date();
  clockEl.textContent =
    now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + 
    '  ' + now.toLocaleTimeString('id-ID');
}

setInterval(updateClock, 1000);

/* ============================================================
   SHARED NAVIGATION — rendered dynamically with step indicators
   ============================================================ */

function getNavStepStates() {
  const shop = loadJSON(LS.shop, {});
  const items = loadJSON(LS.items, []);
  const emailjs = loadJSON(LS.emailjs, {});
  return {
    dashboard: !!(shop.shopName),
    items: items.length > 0,
    sheet: !!(loadJSON(LS.sheetCache, null)),
    emailjs: !!(emailjs.serviceId && emailjs.templateIdInvoice && emailjs.publicKey)
  };
}

function renderNav() {
  const navEl = document.getElementById('mainNav');
  if (!navEl) return;

  const currentPage = navEl.getAttribute('data-page') || 'dashboard';
  const states = getNavStepStates();

  const pages = [
    { key: 'dashboard', href: 'index.html', step: 1, labelKey: 'nav_dashboard', done: states.dashboard },
    { key: 'items',     href: 'items.html',  step: 2, labelKey: 'nav_items',      done: states.items },
    { key: 'sheet',     href: 'sheet-config.html', step: 3, labelKey: 'nav_sheet',  done: states.sheet },
    { key: 'emailjs',   href: 'guided-config.html', step: 4, labelKey: 'nav_emailjs', done: states.emailjs },
  ];

  let html = '';
  pages.forEach(p => {
    const active = p.key === currentPage ? ' active' : '';
    const stepClass = p.done ? ' done' : '';
    const stepContent = p.done ? '' : p.step;
    html += `<a href="${p.href}" class="nav-link${active}">
      <span class="nav-step${stepClass}">${stepContent}</span>
      ${t(p.labelKey)}
    </a>`;
  });

  // Right side controls: currency + language
  html += `<div class="nav-right">
    <div class="nav-control">
      <span data-i18n="currency">${t('currency')}</span>
      <select id="currencySelect" onchange="changeCurrency(this.value)">
        <option value="IDR">IDR</option>
        <option value="USD">USD</option>
        <option value="SGD">SGD</option>
        <option value="MYR">MYR</option>
        <option value="JPY">JPY</option>
        <option value="PHP">PHP</option>
      </select>
    </div>
    <div class="nav-control">
      <span data-i18n="language">${t('language')}</span>
      <select id="langSelect" onchange="switchLang(this.value)">
        <option value="en">EN</option>
        <option value="id">ID</option>
      </select>
    </div>
  </div>`;

  navEl.innerHTML = html;

  // Restore currency selection
  const currSel = document.getElementById('currencySelect');
  if (currSel) currSel.value = getCurrency();

  // Restore language selection
  const langSel = document.getElementById('langSelect');
  if (langSel) langSel.value = _currentLang;
}

function changeCurrency(val) {
  const s = loadJSON(LS.shop, {});
  s.currency = val;
  saveJSON(LS.shop, s);
  if (typeof renderOrders === 'function') renderOrders();
  toast('Currency → ' + val);
}

/* ============================================================
   STATUS BAR — shows setup health at a glance
   ============================================================ */

function renderStatusBar() {
  const el = document.getElementById('statusBar');
  if (!el) return;

  const states = getNavStepStates();

  function dot(ok) { return `<span class="status-dot ${ok ? 'green' : 'red'}"></span>`; }
  function val(ok) { return `<span class="status-value ${ok ? '' : 'not-set'}">${ok ? t('status_ready') : t('status_not_set')}</span>`; }

  el.innerHTML = `
    <a href="index.html" class="status-indicator">${dot(states.dashboard)}<span class="status-label">${t('status_shop')}</span>${val(states.dashboard)}</a>
    <a href="items.html" class="status-indicator">${dot(states.items)}<span class="status-label">${t('status_items')}</span>${val(states.items)}</a>
    <a href="guided-config.html" class="status-indicator">${dot(states.emailjs)}<span class="status-label">${t('status_emailjs')}</span>${val(states.emailjs)}</a>
  `;
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  renderNav();
  renderStatusBar();
  applyI18n();
});
