/* DOOV Design System — 공통 레이아웃
   - 메뉴 구조는 NAV 한 곳에서 관리해요. 페이지를 추가하면 여기에 등록하세요.
   - 각 페이지는 <main class="doc"> 안의 본문만 작성하면 돼요. */

const ROOT = new URL('../../', document.currentScript.src).href;

// ── 테마: 페인트 전에 적용 ──
(function () {
  let saved = null;
  try { saved = localStorage.getItem('doov-theme'); } catch (e) {}
  if (saved === 'dark') document.documentElement.dataset.theme = 'dark';
})();

const VERSION = 'v0.1.0';

const NAV = [
  { text: 'Overview', link: 'index.html' },
  { text: 'Getting Started', link: 'start/index.html' },
  {
    text: 'Foundations',
    items: [
      { text: 'Logo', link: 'foundation/logo.html' },
      { text: 'Colors', link: 'foundation/colors.html' },
      { text: 'Typography', link: 'foundation/typography.html' },
      { text: 'Spacing & Layout', link: 'foundation/spacing.html' },
      { text: 'Radius & Elevation', link: 'foundation/elevation.html' },
      { text: 'Iconography', link: 'foundation/iconography.html' },
      { text: 'Motion', link: 'foundation/motion.html' },
      { text: 'Voice & Tone', link: 'foundation/voice-and-tone.html' },
    ],
  },
  {
    text: 'Components',
    items: [
      { text: 'Badge', link: 'components/badge.html' },
      { text: 'Button', link: 'components/button.html' },
      { text: 'Checkbox', link: 'components/checkbox.html' },
      { text: 'Dropdown', link: 'components/dropdown.html' },
      { text: 'Icon Button', link: 'components/icon-button.html' },
      { text: 'Loader', link: 'components/loader.html' },
      { text: 'Modal', link: 'components/modal.html' },
      { text: 'Progress Bar', link: 'components/progress-bar.html' },
      { text: 'Radio', link: 'components/radio.html' },
      { text: 'Search Field', link: 'components/search-field.html' },
      { text: 'Segmented Control', link: 'components/segmented-control.html' },
      { text: 'Skeleton', link: 'components/skeleton.html' },
      { text: 'Slider', link: 'components/slider.html' },
      { text: 'Switch', link: 'components/switch.html' },
      { text: 'Tab', link: 'components/tab.html' },
      { text: 'Table', link: 'components/table.html' },
      { text: 'Text Button', link: 'components/text-button.html' },
      { text: 'Text Field', link: 'components/text-field.html' },
      { text: 'Toast', link: 'components/toast.html' },
      { text: 'Tooltip', link: 'components/tooltip.html' },
      {
        text: 'Vision',
        items: [
          { text: 'Video Tile', link: 'components/vision/video-tile.html' },
          { text: 'Bounding Box', link: 'components/vision/bounding-box.html' },
          { text: 'Detection Label', link: 'components/vision/detection-label.html' },
          { text: 'Heatmap Overlay', link: 'components/vision/heatmap-overlay.html' },
          { text: 'Status Badge', link: 'components/vision/status-badge.html' },
          { text: 'Verdict Button', link: 'components/vision/verdict-button.html' },
          { text: 'Event Card', link: 'components/vision/event-card.html' },
          { text: 'Thumbnail Strip', link: 'components/vision/thumbnail-strip.html' },
        ],
      },
    ],
  },
];

const TOP_NAV = [
  { text: 'Overview', link: 'index.html', match: /^index\.html$/ },
  { text: 'Getting Started', link: 'start/index.html', match: /^start\// },
  { text: 'Foundations', link: 'foundation/logo.html', match: /^foundation\// },
  { text: 'Components', link: 'components/badge.html', match: /^components\// },
];

function currentPath() {
  let p = decodeURI(location.href.split('#')[0].split('?')[0]);
  p = p.startsWith(ROOT) ? p.slice(ROOT.length) : p;
  if (p === '' || p.endsWith('/')) p += 'index.html';
  return p;
}

function flatten(items, out = []) {
  for (const it of items) {
    if (it.link) out.push(it);
    if (it.items) flatten(it.items, out);
  }
  return out;
}

function renderGroup(items, cur, depth) {
  return items
    .map((it) => {
      if (it.items) {
        const cls = depth === 0 ? 'nav-section' : 'nav-sub';
        return `<div class="${cls}"><p class="nav-title">${it.text}</p>${renderGroup(it.items, cur, depth + 1)}</div>`;
      }
      const active = it.link === cur ? ' active' : '';
      const top = depth === 0 ? ' nav-top' : '';
      return `<a class="nav-link${top}${active}" href="${ROOT}${it.link}">${it.text}</a>`;
    })
    .join('');
}

function findTrail(items, cur, path = []) {
  for (const it of items) {
    if (it.link === cur) return path;
    if (it.items) {
      const r = findTrail(it.items, cur, [...path, it.text]);
      if (r) return r;
    }
  }
  return path.length ? null : [];
}

function slugify(t) {
  return t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w가-힣-]/g, '');
}

function build() {
  const cur = currentPath();
  const main = document.querySelector('main.doc');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <button class="menu-btn" aria-label="Open menu">
      <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
    <a class="brand" href="${ROOT}index.html">
      <img class="brand-logo on-light" src="${ROOT}assets/brand/doov_logo_black.png" alt="DOOV">
      <img class="brand-logo on-dark" src="${ROOT}assets/brand/doov_logo_white.png" alt="DOOV">
      <span class="brand-sub">Design System</span>
      <span class="brand-tag">Internal</span>
    </a>
    <nav class="top-nav">
      ${TOP_NAV.map((n) => `<a href="${ROOT}${n.link}" class="${n.match.test(cur) ? 'active' : ''}">${n.text}</a>`).join('')}
    </nav>
    <span class="version">${VERSION}</span>
    <button class="theme-btn" aria-label="Toggle theme">
      <svg class="i-sun" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <svg class="i-moon" viewBox="0 0 24 24" width="18" height="18"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
    </button>`;

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `<nav>${renderGroup(NAV, cur, 0)}</nav>`;

  // 분류 표시 (예: FOUNDATIONS, COMPONENTS / VISION)
  const trail = findTrail(NAV, cur);
  const h1 = main.querySelector('h1');
  if (h1 && trail.length && !main.querySelector('.eyebrow')) {
    const eb = document.createElement('p');
    eb.className = 'eyebrow';
    eb.textContent = trail.join(' / ');
    h1.before(eb);
  }

  // 목차 (h2, h3)
  const heads = [...main.querySelectorAll('h2, h3')];
  heads.forEach((h) => { if (!h.id) h.id = slugify(h.textContent); });
  const toc = document.createElement('aside');
  toc.className = 'toc';
  if (heads.length) {
    toc.innerHTML = `<p class="toc-title">On this page</p>` +
      heads.map((h) => `<a href="#${h.id}" class="toc-${h.tagName.toLowerCase()}">${h.textContent}</a>`).join('');
  }

  // 이전 / 다음
  const flat = flatten(NAV);
  const idx = flat.findIndex((it) => it.link === cur);
  if (idx !== -1) {
    const prev = flat[idx - 1], next = flat[idx + 1];
    const pager = document.createElement('nav');
    pager.className = 'pager';
    pager.innerHTML =
      (prev ? `<a class="prev" href="${ROOT}${prev.link}"><span>Previous</span>${prev.text}</a>` : '<span></span>') +
      (next ? `<a class="next" href="${ROOT}${next.link}"><span>Next</span>${next.text}</a>` : '');
    main.appendChild(pager);
  }

  const layout = document.createElement('div');
  layout.className = 'layout';
  const content = document.createElement('div');
  content.className = 'content';
  main.replaceWith(layout);
  content.appendChild(main);
  layout.append(sidebar, content, toc);
  document.body.prepend(header);

  const backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  document.body.appendChild(backdrop);

  // 이벤트
  const toggleMenu = (open) => document.body.classList.toggle('menu-open', open);
  header.querySelector('.menu-btn').onclick = () => toggleMenu(!document.body.classList.contains('menu-open'));
  backdrop.onclick = () => toggleMenu(false);

  header.querySelector('.theme-btn').onclick = () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    if (dark) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('doov-theme', dark ? 'dark' : 'light'); } catch (e) {}
  };

  // 목차 활성 표시
  if (heads.length) {
    const links = [...toc.querySelectorAll('a')];
    const onScroll = () => {
      let i = 0;
      heads.forEach((h, n) => { if (h.getBoundingClientRect().top < 120) i = n; });
      links.forEach((a, n) => a.classList.toggle('active', n === i));
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 사이드바 안에서만 활성 메뉴가 보이도록 스크롤 (페이지는 움직이지 않음)
  const activeLink = sidebar.querySelector('.active');
  if (activeLink) sidebar.scrollTop = activeLink.offsetTop - sidebar.clientHeight / 2;
}

document.addEventListener('DOMContentLoaded', build);

// ── 복사 버튼: <button class="copy-btn" data-copy="#대상ID"> ──
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  e.preventDefault(); // <summary> 안에서 눌러도 접기/펼치기가 동작하지 않게
  e.stopPropagation();
  const target = document.querySelector(btn.dataset.copy);
  if (!target) return;
  const text = target.textContent; // 접힌 상태에서도 줄바꿈 그대로 복사
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const label = btn.textContent;
  btn.textContent = '복사됨';
  btn.classList.add('done');
  setTimeout(() => { btn.textContent = label; btn.classList.remove('done'); }, 1600);
});
