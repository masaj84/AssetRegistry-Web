import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    const id = hash.replace('#', '');
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
      if (attempt < 30) {
        setTimeout(() => tryScroll(attempt + 1), 50);
      }
    };
    tryScroll();
  }, [pathname, hash, key]);

  return null;
}
