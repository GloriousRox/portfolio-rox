(() => {
  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const group = gallery.dataset.gallery;
  const images = window.PORTFOLIO_IMAGES[group] || [];
  const fragment = document.createDocumentFragment();
  images.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-item';
    button.dataset.index = index;
    button.setAttribute('aria-label', `Open image ${index + 1} of ${images.length}`);
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = '';
    image.loading = index < (group === 'modeling' ? 10 : 4) ? 'eager' : 'lazy';
    image.decoding = 'async';
    button.append(image);
    fragment.append(button);
  });
  gallery.append(fragment);

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Number(entry.target.dataset.index);
        entry.target.style.transitionDelay = `${Math.min(index % 5, 4) * 45}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '100px 0px', threshold: 0.05 });
    gallery.querySelectorAll('.gallery-item').forEach((card) => observer.observe(card));
  } else {
    gallery.querySelectorAll('.gallery-item').forEach((card) => card.classList.add('visible'));
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const counter = lightbox.querySelector('figcaption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let current = 0;
  let lastFocus = null;

  const show = (index) => {
    current = (index + images.length) % images.length;
    lightboxImage.classList.remove('loaded');
    lightboxImage.src = images[current].src;
    lightboxImage.alt = `${group === 'building' ? 'Building' : 'Modeling'} portfolio image ${current + 1}`;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    if (lightboxImage.complete) requestAnimationFrame(() => lightboxImage.classList.add('loaded'));
  };
  lightboxImage.addEventListener('load', () => lightboxImage.classList.add('loaded'));
  const open = (index, source) => {
    lastFocus = source;
    show(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    lastFocus?.focus();
  };
  gallery.addEventListener('click', (event) => {
    const card = event.target.closest('.gallery-item');
    if (card) open(Number(card.dataset.index), card);
  });
  closeButton.addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
  addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'Tab') {
      const controls = [...lightbox.querySelectorAll('button')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
