// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
}

// Back-to-top button
const toTop = document.querySelector('.to-top');
if (toTop) {
  const update = () => toTop.classList.toggle('is-visible', window.scrollY > 600);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// Spotify player loads only after a click (no data goes to Spotify before that)
const spotify = document.querySelector('.spotify[data-src]');
if (spotify) {
  spotify.querySelector('button').addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = spotify.dataset.src;
    iframe.title = 'Veelim & The Big Vibe auf Spotify';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.loading = 'lazy';
    spotify.replaceChildren(iframe);
    spotify.classList.add('is-loaded');
  });
}

// Gallery lightbox
const dialog = document.querySelector('.lightbox');
const links = [...document.querySelectorAll('.gallery a')];
if (dialog && links.length) {
  const img = dialog.querySelector('img');
  const count = dialog.querySelector('.lb-count');
  let index = 0;
  const show = (i) => {
    index = (i + links.length) % links.length;
    img.src = links[index].href;
    img.alt = links[index].querySelector('img').alt;
    count.textContent = `${index + 1} / ${links.length}`;
  };
  links.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault();
    show(i);
    dialog.showModal();
  }));
  dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  let startX = null;
  dialog.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
}
