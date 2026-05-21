/**
 * Toast notification system.
 *
 * Anywhere in your code:
 *   import { showToast } from '../scripts/toast.ts';
 *   showToast({ variant: 'success', message: 'Đã sao chép email' });
 *
 * Variants: 'success' | 'warning' | 'danger' | 'info'.
 * Auto-dismisses after `duration` (default 3500ms) or on click.
 * Stack up to MAX_VISIBLE; older ones get dismissed.
 */

import Icon from '../components/ui/Icon.astro'; // type-only for IconName

type IconName = Parameters<typeof Icon>[0]['name'];

export type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms. Pass 0 to require manual dismiss. */
  duration?: number;
}

const MAX_VISIBLE = 4;
const DEFAULT_DURATION = 3500;

const VARIANT_ICONS: Record<ToastVariant, string> = {
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  danger:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  info:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toast-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

const CLOSE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

function getOrCreateContainer(): HTMLElement {
  let container = document.querySelector<HTMLElement>('[data-toast-container]');
  if (container) return container;
  container = document.createElement('div');
  container.setAttribute('data-toast-container', '');
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Thông báo');
  document.body.appendChild(container);
  return container;
}

function dismissToast(toast: HTMLElement) {
  if (toast.classList.contains('is-dismissing')) return;
  toast.classList.add('is-dismissing');
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

export function showToast({ message, variant = 'info', duration = DEFAULT_DURATION }: ToastOptions) {
  if (typeof document === 'undefined') return;

  const container = getOrCreateContainer();

  // Drop oldest toast(s) if exceeding cap
  while (container.children.length >= MAX_VISIBLE) {
    const oldest = container.firstElementChild as HTMLElement | null;
    if (oldest) dismissToast(oldest);
    else break;
  }

  const toast = document.createElement('div');
  toast.setAttribute('data-toast', '');
  toast.setAttribute('data-variant', variant);
  toast.setAttribute('role', variant === 'danger' ? 'alert' : 'status');
  toast.setAttribute('aria-live', variant === 'danger' ? 'assertive' : 'polite');

  toast.innerHTML = `
    ${VARIANT_ICONS[variant]}
    <span class="toast-message"></span>
    <button class="toast-close" type="button" aria-label="Đóng thông báo">${CLOSE_ICON}</button>
  `;
  (toast.querySelector('.toast-message') as HTMLElement).textContent = message;

  const closeBtn = toast.querySelector<HTMLButtonElement>('.toast-close');
  closeBtn?.addEventListener('click', () => dismissToast(toast));

  container.appendChild(toast);

  if (duration > 0) {
    window.setTimeout(() => dismissToast(toast), duration);
  }
}

/** Helper: copy text to clipboard + show success toast. */
export async function copyToClipboard(text: string, successMessage = 'Đã sao chép') {
  try {
    await navigator.clipboard.writeText(text);
    showToast({ variant: 'success', message: successMessage });
  } catch {
    showToast({ variant: 'danger', message: 'Không thể sao chép — thử lại sau' });
  }
}
