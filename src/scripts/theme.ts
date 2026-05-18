// Theme toggle (dark default + light optional, persisted in localStorage)

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

function applyTheme(theme: Theme) {
  if (theme === 'light') document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
}

function currentTheme(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

export function initThemeToggle() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  if (!buttons.length) return;

  const sync = () => {
    const t = currentTheme();
    buttons.forEach((b) => {
      b.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
      b.setAttribute('aria-label', t === 'light' ? 'Chuyển sang nền tối' : 'Chuyển sang nền sáng');
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next: Theme = currentTheme() === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* localStorage blocked */
      }
      sync();
    });
  });

  sync();
}
