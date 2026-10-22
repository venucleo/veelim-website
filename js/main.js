// Mobile menu
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
}

// Photos and the video can't be saved by right-click or dragged out
const isMedia = (target) => target instanceof Element && target.closest('img, video, .gallery a');
document.addEventListener('contextmenu', (e) => { if (isMedia(e.target)) e.preventDefault(); });
document.addEventListener('dragstart', (e) => { if (isMedia(e.target)) e.preventDefault(); });

// The hero video stands still for people who prefer less motion
const heroVideo = document.querySelector('.hero video');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
} else if (heroVideo) {
  // The clip holds a still frame for its first 4 seconds, which looks like a
  // freeze on every loop, so each run starts where the motion begins
  const motionStart = 4.03;
  heroVideo.loop = false;
  const restart = () => {
    heroVideo.currentTime = motionStart;
    heroVideo.play().catch(() => {});
  };
  heroVideo.addEventListener('ended', restart);
  if (heroVideo.readyState >= 1) heroVideo.currentTime = motionStart;
  else heroVideo.addEventListener('loadedmetadata', () => { heroVideo.currentTime = motionStart; }, { once: true });
}

// Header background and back-to-top button depend on scroll position
const toTop = document.querySelector('.to-top');
const onScroll = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if ('IntersectionObserver' in window) {
  // Fade and splash elements in as they scroll into view
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

  // Highlight the menu entry of the section in view
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => {
    const section = document.querySelector(a.hash);
    if (section) spy.observe(section);
  });
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
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
  const at = (i) => (i + links.length) % links.length;
  const show = (i) => {
    index = at(i);
    img.src = links[index].href;
    img.alt = links[index].querySelector('img').alt;
    count.textContent = `${index + 1} / ${links.length}`;
    // Preload the neighbours so swiping feels instant
    [at(index + 1), at(index - 1)].forEach((n) => { new Image().src = links[n].href; });
  };
  links.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault();
    show(i);
    dialog.showModal();
  }));
  dialog.addEventListener('close', () => links[index].focus());
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
