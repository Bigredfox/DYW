import { useEffect, useState } from 'react';

const key = 'daily-work-log:theme';

export default function ThemeControl() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return ['light', 'dark'].includes(saved) ? saved : 'system';
    } catch { return 'system'; }
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function apply() {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      document.documentElement.dataset.theme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#101e27' : '#EFF7FB');
    }
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  function change(event) {
    const value = event.target.value;
    setTheme(value);
    try { window.localStorage.setItem(key, value); setError(''); }
    catch { setError('Appearance changed for this visit, but could not be remembered.'); }
  }

  return <div className="theme-control"><label htmlFor="theme-choice">Appearance</label><select id="theme-choice" value={theme} onChange={change}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select>{error && <span className="theme-error" role="status">{error}</span>}</div>;
}
