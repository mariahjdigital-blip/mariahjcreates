/* Mariah J Creates: shared site script.
   All text, links and posts live in /content/*.json, edited through Pages CMS.
   This file only turns that content into pages. */

const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel) => document.querySelector(sel);
const getJSON = (name) => fetch(`/content/${name}.json`, { cache: 'no-cache' }).then(r => r.json());
const isExternal = (url = '') => /^https?:\/\//.test(url);
const linkAttrs = (url) => isExternal(url) ? 'target="_blank" rel="noopener"' : '';
const visible = (list = []) => list.filter(x => x && x.show !== false);
const fmtDate = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

const NAV = [
  ['Portfolio', '/portfolio'],
  ['Freebies', '/freebies'],
  ['Shop', '/shop'],
  ['Blog', '/blog'],
  ['Work With Me', '/work-with-me']
];

function socialIcons(site, size = 'w-10 h-10') {
  const items = [
    ['instagram', 'fa-brands fa-instagram text-lg', 'Instagram'],
    ['tiktok', 'fa-brands fa-tiktok', 'TikTok'],
    ['pinterest', 'fa-brands fa-pinterest-p', 'Pinterest'],
    ['youtube', 'fa-brands fa-youtube', 'YouTube']
  ].filter(([k]) => site[k]);
  const links = items.map(([k, icon, label]) =>
    `<a href="${esc(site[k])}" target="_blank" rel="noopener" aria-label="${label}" class="social ${size} rounded-full bg-espresso-mist text-espresso-dark flex items-center justify-center"><i class="${icon}"></i></a>`);
  if (site.email) links.push(`<a href="mailto:${esc(site.email)}" aria-label="Email" class="social ${size} rounded-full bg-espresso-mist text-espresso-dark flex items-center justify-center"><i class="fa-regular fa-envelope"></i></a>`);
  return links.join('');
}

function renderChrome(site) {
  const header = $('#site-header');
  if (header) {
    const here = location.pathname.replace(/\/$/, '');
    header.innerHTML = `
      <div class="mx-auto max-w-5xl px-5 py-5 flex items-center justify-between gap-4">
        <a href="/" class="flex items-center gap-3 shrink-0">
          <img src="${esc(site.photo)}" alt="" class="w-9 h-9 rounded-full object-cover ring-2 ring-sand">
          <span class="font-serif text-xl font-semibold">${esc(site.brand)}</span>
        </a>
        <button id="menu-btn" class="md:hidden w-10 h-10 rounded-full hover:bg-linen" aria-label="Menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
        <nav id="menu" class="hidden md:flex items-center gap-6 text-sm">
          ${NAV.map(([t, u]) => `<a href="${u}" class="nav-link ${here.startsWith(u) ? 'text-espresso font-medium' : 'text-muted'}">${t}</a>`).join('')}
        </nav>
      </div>
      <nav id="menu-mobile" class="hidden md:hidden px-5 pb-4 flex-col gap-1">
        ${NAV.map(([t, u]) => `<a href="${u}" class="block rounded-xl px-3 py-2 hover:bg-linen">${t}</a>`).join('')}
      </nav>`;
    $('#menu-btn').addEventListener('click', (e) => {
      const m = $('#menu-mobile');
      const open = m.classList.toggle('hidden') === false;
      m.classList.toggle('flex', open);
      e.currentTarget.setAttribute('aria-expanded', open);
    });
  }
  const footer = $('#site-footer');
  if (footer) {
    footer.innerHTML = `
      <div class="mx-auto max-w-5xl px-5 py-12 flex flex-col items-center gap-5 text-center">
        <div class="flex gap-3">${socialIcons(site)}</div>
        <p class="font-serif italic text-lg text-espresso">${esc(site.tagline)}</p>
        <p class="text-xs text-muted">&copy; ${new Date().getFullYear()} ${esc(site.brand)}</p>
      </div>`;
  }
}

/* ---------- Pages ---------- */

const pages = {
  async home(site) {
    const { buttons } = await getJSON('links');
    $('#profile-photo').src = site.photo;
    $('#name').textContent = site.name;
    $('#handle').textContent = site.handle;
    $('#bio').textContent = site.bio;
    $('#socials').innerHTML = socialIcons(site);
    $('#tagline').textContent = site.tagline;
    $('#links').innerHTML = visible(buttons).map(b => `
      <a href="${esc(b.url || '#')}" ${linkAttrs(b.url)} class="link-btn w-full flex items-center gap-4 rounded-2xl border border-sand bg-white/70 px-4 py-4 text-left">
        <span class="icon-wrap shrink-0 w-11 h-11 rounded-xl bg-espresso-mist text-espresso-dark flex items-center justify-center"><i class="fa-solid fa-${esc(b.icon || 'link')}"></i></span>
        <span class="flex-1 min-w-0">
          <span class="flex flex-wrap items-center gap-2"><span class="font-medium">${esc(b.title)}</span>
          ${b.badge ? `<span class="badge text-[10px] uppercase tracking-widest font-medium rounded-full bg-espresso text-cream px-2 py-0.5">${esc(b.badge)}</span>` : ''}</span>
          ${b.subtitle ? `<span class="sub block text-xs text-muted mt-0.5">${esc(b.subtitle)}</span>` : ''}
        </span>
        <i class="arrow fa-solid fa-arrow-right text-sm opacity-70"></i>
      </a>`).join('');
  },

  async portfolio(site) {
    const p = await getJSON('portfolio');
    $('#headline').textContent = p.headline;
    $('#intro').innerHTML = String(p.intro || '').split(/\n\s*\n/).filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('');
    const focus = (p.focus || []).filter(Boolean);
    $('#focus').innerHTML = focus.map(f => `<span class="rounded-full bg-espresso-mist text-espresso-dark px-3 py-1 text-xs font-medium">${esc(f)}</span>`).join('');
    const brands = (p.brands || []).filter(Boolean);
    if (brands.length) {
      $('#brands-wrap').hidden = false;
      $('#brands').innerHTML = brands.map(b => `<span class="font-serif text-xl md:text-2xl text-espresso">${esc(b)}</span>`).join('<span class="text-espresso-soft" aria-hidden="true">&middot;</span>');
    }
    $('#services').innerHTML = (p.services || []).map(s => `
      <div class="rounded-2xl border border-sand bg-white/70 p-6">
        <h3 class="font-serif text-2xl font-semibold">${esc(s.title)}</h3>
        <p class="mt-2 text-sm text-muted leading-relaxed">${esc(s.description)}</p>
      </div>`).join('');
    const h = p.highlight || {};
    if (h.show !== false && (h.video || h.image)) {
      $('#highlight-wrap').hidden = false;
      $('#highlight').innerHTML = `
        <div class="w-full max-w-[300px] mx-auto md:mx-0 shrink-0 aspect-[9/16] rounded-2xl overflow-hidden bg-linen">${media(h)}</div>
        <div class="flex-1">
          <p class="text-xs uppercase tracking-[0.2em] text-espresso font-medium">${esc(h.label || 'Organic results')}</p>
          <h3 class="mt-2 font-serif text-3xl md:text-4xl font-semibold leading-tight">${esc(h.title)}</h3>
          <p class="mt-3 text-muted leading-relaxed">${esc(h.description)}</p>
          <div class="mt-6 grid grid-cols-2 gap-3">${(h.stats || []).filter(st => st && st.value).map(st => `
            <div class="rounded-2xl bg-espresso-mist px-4 py-4">
              <p class="font-serif text-3xl font-semibold text-espresso-dark">${esc(st.value)}</p>
              <p class="text-xs uppercase tracking-widest text-muted mt-1">${esc(st.label)}</p>
            </div>`).join('')}
          </div>
        </div>`;
    }
    // Only show brand work that has a video or photo, so placeholders stay hidden
    const projects = (p.projects || []).filter(pr => pr && pr.show !== false && (pr.video || pr.image));
    $('#projects').innerHTML = projects.map(pr => `
      <article class="rounded-2xl border border-sand bg-white/70 overflow-hidden flex flex-col">
        <div class="aspect-[9/16] bg-linen flex items-center justify-center overflow-hidden">${media(pr)}</div>
        <div class="p-5">
          <p class="text-[11px] uppercase tracking-widest text-espresso font-medium">${esc(pr.type)}</p>
          <h3 class="mt-1 font-serif text-2xl font-semibold">${esc(pr.brand)}</h3>
          <p class="mt-2 text-sm text-muted leading-relaxed">${esc(pr.description)}</p>
          ${pr.link ? `<a href="${esc(pr.link)}" target="_blank" rel="noopener" class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-espresso hover:underline">View post <i class="fa-solid fa-arrow-right text-xs"></i></a>` : ''}
        </div>
      </article>`).join('');
  },

  async freebies() {
    const { freebies } = await getJSON('freebies');
    $('#freebie-list').innerHTML = visible(freebies).map(f => `
      <a href="/freebies/${esc(f.id)}" class="card-link rounded-2xl border border-sand bg-white/70 overflow-hidden flex flex-col">
        ${f.image ? `<img src="${esc(f.image)}" alt="" class="aspect-[4/3] w-full object-cover">` : `<div class="aspect-[4/3] bg-espresso-mist flex items-center justify-center text-espresso text-4xl"><i class="fa-solid fa-gift"></i></div>`}
        <div class="p-6">
          <span class="text-[10px] uppercase tracking-widest font-medium rounded-full bg-espresso text-cream px-2 py-0.5">Free</span>
          <h2 class="mt-3 font-serif text-2xl font-semibold">${esc(f.title)}</h2>
          <p class="mt-1 text-sm text-muted">${esc(f.subtitle)}</p>
        </div>
      </a>`).join('');
  },

  async freebie() {
    const id = location.pathname.split('/').filter(Boolean).pop();
    const { freebies } = await getJSON('freebies');
    const f = freebies.find(x => x.id === id);
    if (!f) { $('#freebie').innerHTML = notFound('freebie', '/freebies'); return; }
    document.title = `${f.title} | Free`;
    $('#f-title').textContent = f.title;
    $('#f-subtitle').textContent = f.subtitle;
    $('#f-description').textContent = f.description;
    $('#f-bullets').innerHTML = (f.bullets || []).map(b => `<li class="flex gap-3"><i class="fa-solid fa-check text-espresso mt-1"></i><span>${esc(b)}</span></li>`).join('');
    if (f.image) $('#f-image').innerHTML = `<img src="${esc(f.image)}" alt="" class="w-full h-full object-cover">`;
    const form = $('#signup');
    form.elements.freebie.value = f.title;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Sending...';
      try {
        await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      } catch (_) { /* still show the download */ }
      form.classList.add('hidden');
      $('#thanks').classList.remove('hidden');
      if (f.download_url) {
        $('#download').href = f.download_url;
        $('#download').hidden = false;
      }
    });
  },

  async shop(site) {
    const s = await getJSON('shop');
    $('#shop-intro').textContent = s.intro;
    if (s.shopmy_url) { $('#shopmy').href = s.shopmy_url; $('#shopmy').hidden = false; }
    const items = (s.items || []).filter(i => i.name);
    const cats = [...new Set(items.map(i => i.category).filter(Boolean))];
    const draw = (cat) => {
      $('#shop-items').innerHTML = items.filter(i => !cat || i.category === cat).map(i => `
        <a href="${esc(i.url || '#')}" ${linkAttrs(i.url)} class="card-link rounded-2xl border border-sand bg-white/70 overflow-hidden flex flex-col">
          ${i.image ? `<img src="${esc(i.image)}" alt="" class="aspect-square w-full object-cover">` : `<div class="aspect-square bg-linen flex items-center justify-center text-espresso-soft text-3xl"><i class="fa-solid fa-bag-shopping"></i></div>`}
          <div class="p-4">
            <p class="text-[10px] uppercase tracking-widest text-espresso font-medium">${esc(i.category)}</p>
            <h3 class="mt-1 font-medium">${esc(i.name)}</h3>
            <p class="mt-1 text-xs text-muted leading-relaxed">${esc(i.note)}</p>
          </div>
        </a>`).join('');
    };
    if (cats.length > 1) {
      $('#shop-filters').innerHTML = ['All', ...cats].map((c, n) => `<button data-cat="${n ? esc(c) : ''}" class="chip ${n ? '' : 'active'} rounded-full border border-sand px-4 py-1.5 text-sm">${esc(c)}</button>`).join('');
      $('#shop-filters').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        document.querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === b));
        draw(b.dataset.cat);
      });
    }
    draw('');
  },

  async blog() {
    const posts = visible((await getJSON('blog')).posts).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    $('#posts').innerHTML = posts.length ? posts.map(p => `
      <a href="/blog/${esc(p.slug)}" class="card-link rounded-2xl border border-sand bg-white/70 overflow-hidden flex flex-col">
        ${p.image ? `<img src="${esc(p.image)}" alt="" class="aspect-[16/10] w-full object-cover">` : ''}
        <div class="p-6">
          <p class="text-xs text-muted">${fmtDate(p.date)}</p>
          <h2 class="mt-1 font-serif text-2xl font-semibold leading-snug">${esc(p.title)}</h2>
          <p class="mt-2 text-sm text-muted leading-relaxed">${esc(p.excerpt)}</p>
          <span class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-espresso">Read more <i class="fa-solid fa-arrow-right text-xs"></i></span>
        </div>
      </a>`).join('') : '<p class="text-muted">New posts coming soon.</p>';
  },

  async post() {
    const slug = location.pathname.split('/').filter(Boolean).pop();
    const p = visible((await getJSON('blog')).posts).find(x => x.slug === slug);
    if (!p) { $('#post').innerHTML = notFound('post', '/blog'); return; }
    document.title = `${p.title} | Mariah J Creates`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && p.excerpt) meta.content = p.excerpt;
    $('#post').innerHTML = `
      <p class="text-sm text-muted">${fmtDate(p.date)}</p>
      <h1 class="mt-2 font-serif text-4xl md:text-5xl font-semibold leading-tight">${esc(p.title)}</h1>
      ${p.image ? `<img src="${esc(p.image)}" alt="" class="mt-8 w-full rounded-2xl object-cover">` : ''}
      <div class="prose mt-8">${window.marked ? marked.parse(p.body || '') : esc(p.body)}</div>
      <a href="/blog" class="mt-12 inline-flex items-center gap-2 text-sm font-medium text-espresso"><i class="fa-solid fa-arrow-left text-xs"></i> All posts</a>`;
  },

  async work(site) {
    $('#work-email').href = `mailto:${site.email}?subject=UGC%20Collaboration`;
    $('#work-email').textContent = site.email;
    const form = $('#inquiry');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Sending...';
      try {
        await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
        form.classList.add('hidden'); $('#inquiry-thanks').classList.remove('hidden');
      } catch (_) {
        btn.disabled = false; btn.textContent = 'Try again';
      }
    });
  }
};

function media(pr) {
  const v = pr.video || '';
  const ig = v.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels)\/([\w-]+)/);
  if (ig) return `<iframe src="https://www.instagram.com/${ig[1] === 'p' ? 'p' : 'reel'}/${ig[2]}/embed" title="${esc(pr.brand)}" class="w-full h-full bg-white" scrolling="no" allowtransparency="true" loading="lazy"></iframe>`;
  const gd = v.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/);
  if (gd) return `<iframe src="https://drive.google.com/file/d/${gd[1]}/preview" title="${esc(pr.brand)}" class="w-full h-full" allow="autoplay" allowfullscreen loading="lazy"></iframe>`;
  const yt = v.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  if (yt) return `<iframe src="https://www.youtube.com/embed/${yt[1]}" title="${esc(pr.brand)}" class="w-full h-full" allowfullscreen loading="lazy"></iframe>`;
  if (/\.(mp4|mov|webm)(\?|$)/i.test(v)) return `<video src="${esc(v)}" ${pr.image ? `poster="${esc(pr.image)}" preload="none"` : 'preload="metadata"'} controls playsinline class="w-full h-full object-cover bg-black"></video>`;
  if (pr.image) return `<img src="${esc(pr.image)}" alt="${esc(pr.brand)}" class="w-full h-full object-cover" loading="lazy">`;
  return `<div class="text-center text-espresso-soft"><i class="fa-solid fa-clapperboard text-4xl"></i><p class="mt-3 text-xs uppercase tracking-widest">Video coming soon</p></div>`;
}

function notFound(what, back) {
  return `<p class="text-muted">Sorry, that ${what} isn't here.</p><a href="${back}" class="mt-4 inline-block text-espresso font-medium">Go back</a>`;
}

(async () => {
  const site = await getJSON('site');
  renderChrome(site);
  const page = document.body.dataset.page;
  if (pages[page]) await pages[page](site);
  document.body.classList.add('ready');
})();
