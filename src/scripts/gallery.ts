// Gallery: thumbnail switcher + mobile counter + desktop zoom lens.
// Pure vanilla JS, no deps.

export function initGallery() {
  const main = document.querySelector<HTMLImageElement>('[data-gallery-main]');
  const thumbs = document.querySelectorAll<HTMLButtonElement>('[data-gallery-thumb]');
  const panel = document.querySelector<HTMLDivElement>('[data-gallery-zoom-panel]');
  const lens = document.querySelector<HTMLDivElement>('[data-gallery-zoom-lens]');
  const wrap = document.querySelector<HTMLDivElement>('[data-gallery-zoom-wrap]');
  const carousel = document.querySelector<HTMLDivElement>('[data-gallery-carousel]');
  const counter = document.querySelector<HTMLSpanElement>('[data-gallery-counter]');

  const setActiveThumb = (active: HTMLButtonElement) => {
    thumbs.forEach((t) => {
      t.classList.remove('border-[--color-accent]');
      t.classList.add('border-transparent');
      t.setAttribute('aria-selected', 'false');
    });
    active.classList.remove('border-transparent');
    active.classList.add('border-[--color-accent]');
    active.setAttribute('aria-selected', 'true');
  };

  if (main) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        if (!src) return;
        main.style.opacity = '0';
        window.setTimeout(() => {
          main.src = src;
          if (panel) panel.style.backgroundImage = `url(${src})`;
          main.style.opacity = '1';
          setActiveThumb(thumb);
        }, 140);
      });
    });
  }

  // Mobile carousel counter
  if (carousel && counter) {
    const total = carousel.children.length;
    counter.textContent = `1 / ${total}`;
    carousel.addEventListener(
      'scroll',
      () => {
        const idx = Math.round(carousel.scrollLeft / carousel.clientWidth) + 1;
        const clamped = Math.max(1, Math.min(total, idx));
        counter.textContent = `${clamped} / ${total}`;
      },
      { passive: true },
    );
  }

  // Desktop zoom lens (skip on touch / coarse pointer devices)
  if (wrap && lens && panel && main && !window.matchMedia('(pointer: coarse)').matches) {
    panel.style.backgroundImage = `url(${main.src})`;

    const show = () => {
      lens.classList.remove('hidden');
      panel.classList.remove('hidden');
    };
    const hide = () => {
      lens.classList.add('hidden');
      panel.classList.add('hidden');
    };

    wrap.addEventListener('mouseenter', show);
    wrap.addEventListener('mouseleave', hide);
    wrap.addEventListener('mousemove', (event) => {
      const rect = wrap.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const lensSize = 150;
      const lx = Math.max(0, Math.min(x - lensSize / 2, rect.width - lensSize));
      const ly = Math.max(0, Math.min(y - lensSize / 2, rect.height - lensSize));
      lens.style.left = `${lx}px`;
      lens.style.top = `${ly}px`;
      panel.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
    });
  }
}
