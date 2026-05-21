/**
 * Top page-loading progress bar.
 *
 * Hooks into Astro View Transitions lifecycle:
 *   - 'astro:before-preparation' → start (width 0 → 90%)
 *   - 'astro:after-swap'        → finish (width 90 → 100%, fade out)
 *
 * Falls back to no-op on browsers without View Transitions API.
 */

const BAR_SELECTOR = '[data-route-progress]';

function getOrCreateBar(): HTMLElement {
  let bar = document.querySelector<HTMLElement>(BAR_SELECTOR);
  if (bar) return bar;
  bar = document.createElement('div');
  bar.setAttribute('data-route-progress', '');
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  return bar;
}

export function initRouteProgress() {
  if (typeof document === 'undefined') return;

  const bar = getOrCreateBar();
  let resetTimer: number | undefined;

  document.addEventListener('astro:before-preparation', () => {
    window.clearTimeout(resetTimer);
    bar.setAttribute('data-active', 'true');
  });

  document.addEventListener('astro:after-swap', () => {
    bar.setAttribute('data-active', 'done');
    resetTimer = window.setTimeout(() => {
      bar.removeAttribute('data-active');
      bar.style.width = '';
    }, 300);
  });
}
