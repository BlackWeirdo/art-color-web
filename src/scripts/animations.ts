// Unified animation entry point using `motion` (vanilla edition of Framer Motion).
// Covers: hero entrance, sticky header, section reveals, stagger children,
// mobile menu drawer, theme icon spin.

import { animate, inView, scroll, stagger } from 'motion';

/** Cubic-bezier easing curve in motion's [x1, y1, x2, y2] tuple form. */
type CubicBezier = [number, number, number, number];

const EASE_OUT_QUART: CubicBezier = [0.22, 1, 0.36, 1];
const EASE_IN_QUART: CubicBezier = [0.5, 0, 0.75, 0];

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function unhideAll() {
  document
    .querySelectorAll<HTMLElement>(
      '[data-reveal], [data-stagger-item], [data-hero-meta], [data-hero-logo], [data-hero-title], [data-hero-tagline], [data-hero-price], [data-feature-image], [data-feature-content]',
    )
    .forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
}

export function initAnimations() {
  if (typeof window === 'undefined') return;

  // Mobile menu + theme icon work even with reduced motion (without animation).
  setupMenuDrawer();
  setupThemeIconAnim();

  // Header `.scrolled` class toggle is not an animation — it MUST run even
  // under prefers-reduced-motion so the transparent-over-hero state still
  // resolves to a solid surface for accessibility users.
  stickyHeaderProgress();

  if (reducedMotion) {
    unhideAll();
    return;
  }

  heroEntrance();
  sectionReveals();
  staggerChildren();
  featureRowReveals();
}

// ---- Hero entrance ---------------------------------------------------------

function heroEntrance() {
  const items: Array<{ sel: string; y: number; delay: number }> = [
    { sel: '[data-hero-logo]', y: -12, delay: 0.05 },
    { sel: '[data-hero-meta]', y: -8, delay: 0.15 },
    { sel: '[data-hero-title]', y: 18, delay: 0.25 },
    { sel: '[data-hero-tagline]', y: 14, delay: 0.35 },
    { sel: '[data-hero-price]', y: 16, delay: 0.45 },
  ];

  items.forEach(({ sel, y, delay }) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return;
    animate(
      el,
      { opacity: [0, 1], y: [y, 0] },
      { duration: 0.75, delay, ease: EASE_OUT_QUART },
    );
  });
}

// ---- Sticky header state ---------------------------------------------------

function stickyHeaderProgress() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  scroll((_progress, info) => {
    header.classList.toggle('scrolled', info.y.current > 24);
  });
}

// ---- Section fade-up reveals ----------------------------------------------

function sectionReveals() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  targets.forEach((el) => {
    inView(
      el,
      () => {
        animate(
          el,
          { opacity: [0, 1], y: [24, 0] },
          { duration: 0.7, ease: EASE_OUT_QUART },
        );
      },
      { amount: 0.15 },
    );
  });
}

// ---- Stagger children (feature cards + spec rows / accordion items) -------

function staggerChildren() {
  const parents = document.querySelectorAll<HTMLElement>('[data-stagger-parent]');
  parents.forEach((parent) => {
    const items = Array.from(
      parent.querySelectorAll<HTMLElement>('[data-stagger-item]'),
    );
    if (!items.length) return;

    inView(
      parent,
      () => {
        animate(
          items,
          { opacity: [0, 1], y: [22, 0] },
          {
            duration: 0.55,
            delay: stagger(0.07, { startDelay: 0.05 }),
            ease: EASE_OUT_QUART,
          },
        );
      },
      { amount: 0.18 },
    );
  });
}

// ---- Feature scroll rows (directional slide-in) ---------------------------

function featureRowReveals() {
  const rows = document.querySelectorAll<HTMLElement>('[data-feature-row]');
  rows.forEach((row, i) => {
    // Index 0,2,4 → image on left → image slides from -X, content from +X
    // Index 1,3   → image on right → image slides from +X, content from -X
    const imageOnRight = i % 2 === 1;
    const image = row.querySelector<HTMLElement>('[data-feature-image]');
    const content = row.querySelector<HTMLElement>('[data-feature-content]');
    if (!image || !content) return;

    const imageFromX = imageOnRight ? 56 : -56;
    const contentFromX = imageOnRight ? -56 : 56;

    image.style.transform = `translateX(${imageFromX}px)`;
    content.style.transform = `translateX(${contentFromX}px)`;

    inView(
      row,
      () => {
        animate(
          image,
          { opacity: [0, 1], x: [imageFromX, 0] },
          { duration: 0.9, ease: EASE_OUT_QUART },
        );
        animate(
          content,
          { opacity: [0, 1], x: [contentFromX, 0] },
          { duration: 0.9, delay: 0.15, ease: EASE_OUT_QUART },
        );
      },
      { amount: 0.25 },
    );
  });
}

// ---- Mobile menu drawer ----------------------------------------------------

function setupMenuDrawer() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return;
  const openIcon = toggle.querySelector<HTMLElement>('.menu-open-icon');
  const closeIcon = toggle.querySelector<HTMLElement>('.menu-close-icon');
  const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>('a'));

  let isOpen = false;
  let busy = false;

  const setIconState = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    openIcon?.classList.toggle('hidden', open);
    closeIcon?.classList.toggle('hidden', !open);
  };

  const open = () => {
    if (isOpen || busy) return;
    isOpen = true;
    setIconState(true);
    menu.classList.remove('hidden');

    if (reducedMotion) {
      menu.style.opacity = '1';
      menu.style.transform = 'none';
      links.forEach((l) => {
        l.style.opacity = '1';
        l.style.transform = 'none';
      });
      return;
    }

    busy = true;
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-8px)';
    links.forEach((l) => {
      l.style.opacity = '0';
      l.style.transform = 'translateX(-14px)';
    });

    animate(
      menu,
      { opacity: [0, 1], y: [-8, 0] },
      { duration: 0.25, ease: EASE_OUT_QUART },
    );
    const linkAnim = animate(
      links,
      { opacity: [0, 1], x: [-14, 0] },
      {
        duration: 0.32,
        delay: stagger(0.04, { startDelay: 0.05 }),
        ease: EASE_OUT_QUART,
      },
    );
    linkAnim.finished.then(() => {
      busy = false;
    });
  };

  const close = async () => {
    if (!isOpen || busy) return;
    isOpen = false;
    setIconState(false);

    if (reducedMotion) {
      menu.classList.add('hidden');
      return;
    }

    busy = true;
    try {
      await animate(
        menu,
        { opacity: [1, 0], y: [0, -8] },
        { duration: 0.2, ease: EASE_IN_QUART },
      ).finished;
    } finally {
      menu.classList.add('hidden');
      menu.style.opacity = '';
      menu.style.transform = '';
      links.forEach((l) => {
        l.style.opacity = '';
        l.style.transform = '';
      });
      busy = false;
    }
  };

  toggle.addEventListener('click', () => {
    isOpen ? close() : open();
  });

  links.forEach((link) =>
    link.addEventListener('click', () => {
      if (isOpen) close();
    }),
  );
}

// ---- Theme toggle button spin ---------------------------------------------

function setupThemeIconAnim() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (reducedMotion) return;
      animate(
        btn,
        { rotate: [0, 360], scale: [1, 0.85, 1] },
        { duration: 0.5, ease: EASE_OUT_QUART },
      );
    });
  });
}

