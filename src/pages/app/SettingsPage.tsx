import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-light mb-1">{t('settings.title')}</h1>
      </div>

      {/* Appearance */}
      <div className="border border-border dark:border-border/50 card-hover-glow">
        <div className="px-6 py-4 border-b border-border dark:border-border/50">
          <h2 className="font-medium">{t('settings.appearance')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('settings.theme')}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-6 border-2 transition-all text-left ${
                theme === 'light'
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <div className="w-full h-20 mb-4 border border-border bg-white rounded overflow-hidden">
                <div className="h-3 bg-gray-100 border-b border-gray-200" />
                <div className="p-2 space-y-1">
                  <div className="h-1.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-1.5 bg-gray-200 rounded w-1/2" />
                  <div className="h-1.5 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">{t('settings.themeLight')}</span>
              </div>
              {theme === 'light' && (
                <div className="mt-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-6 border-2 transition-all text-left ${
                theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <div className="w-full h-20 mb-4 border border-border bg-gray-900 rounded overflow-hidden">
                <div className="h-3 bg-gray-800 border-b border-gray-700" />
                <div className="p-2 space-y-1">
                  <div className="h-1.5 bg-gray-700 rounded w-3/4" />
                  <div className="h-1.5 bg-gray-700 rounded w-1/2" />
                  <div className="h-1.5 bg-gray-700 rounded w-2/3" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="font-medium">{t('settings.themeDark')}</span>
              </div>
              {theme === 'dark' && (
                <div className="mt-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="border border-border dark:border-border/50 card-hover-glow">
        <div className="px-6 py-4 border-b border-border dark:border-border/50">
          <h2 className="font-medium">{t('settings.language')}</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`p-6 border-2 transition-all text-left ${
                language === 'en'
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <span className="text-2xl mb-3 block">EN</span>
              <span className="font-medium">{t('settings.languageEn')}</span>
              {language === 'en' && (
                <div className="mt-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => setLanguage('pl')}
              className={`p-6 border-2 transition-all text-left ${
                language === 'pl'
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <span className="text-2xl mb-3 block">PL</span>
              <span className="font-medium">{t('settings.languagePl')}</span>
              {language === 'pl' && (
                <div className="mt-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
