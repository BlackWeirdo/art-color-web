// Sticky mobile CTA: spring-driven slide-up when hero scrolls out of view.

import { animate } from 'motion';

export function initStickyCta() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const bar = document.querySelector<HTMLElement>('[data-sticky-cta]');
  if (!hero || !bar) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false;
  let pending: Promise<unknown> | null = null;

  const show = async () => {
    if (visible) return;
    visible = true;
    bar.setAttribute('aria-hidden', 'false');

    if (reduced) {
      bar.style.transform = 'translateY(0)';
      return;
    }

    pending = animate(
      bar,
      { y: ['100%', '0%'] },
      { type: 'spring', stiffness: 240, damping: 22, mass: 0.9 },
    ).finished;
    await pending;
  };

  const hide = async () => {
    if (!visible) return;
    visible = false;
    bar.setAttribute('aria-hidden', 'true');

    if (reduced) {
      bar.style.transform = 'translateY(100%)';
      return;
    }

    pending = animate(
      bar,
      { y: ['0%', '100%'] },
      { duration: 0.22, ease: [0.5, 0, 0.75, 0] },
    ).finished;
    await pending;
  };

  // Start out hidden (overrides the Tailwind class once JS is alive).
  bar.style.transform = 'translateY(100%)';

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) void hide();
      else void show();
    },
    { rootMargin: '0px', threshold: 0 },
  );

  io.observe(hero);
}
