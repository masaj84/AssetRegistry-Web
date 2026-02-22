import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { hasConsent, setConsent } from './cookieUtils';

export function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      setVisible(!hasConsent());
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const acceptAll = () => {
    setConsent('all');
    setVisible(false);
  };

  const acceptEssential = () => {
    setConsent('essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner fixed bottom-0 left-0 right-0 z-[9999] bg-[#1a1a2e] border-t border-[#00d4aa] px-4 py-4 sm:px-6 sm:py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left flex-1">
          {t('cookies.message')}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={acceptEssential}
            className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-500 text-gray-300 hover:border-gray-300 hover:text-white transition-colors"
          >
            {t('cookies.essential')}
          </button>
          <button
            onClick={acceptAll}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-[#00d4aa] text-[#1a1a2e] font-medium hover:bg-[#00e4ba] transition-colors"
          >
            {t('cookies.acceptAll')}
          </button>
          <Link
            to="/privacy"
            className="text-sm text-[#00d4aa] hover:text-[#00e4ba] transition-colors whitespace-nowrap"
          >
            {t('cookies.learnMore')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
