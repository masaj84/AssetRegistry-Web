import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

const getNavigation = (t: (key: string) => string) => [
  {
    name: t('app.dashboard'),
    href: '/app',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    name: t('app.assets'),
    href: '/app/assets',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    name: t('app.reports'),
    href: '/app/reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = getNavigation(t);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-purple/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-magenta/10 rounded-full blur-[120px]" />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-background/95 dark:bg-background/80 backdrop-blur-md border-r border-border dark:border-border/50 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border dark:border-border/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 border-2 border-orange/60 flex items-center justify-center group-hover:bg-orange/20 transition-colors group-hover:border-orange group-hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]">
              <span className="text-[10px] font-mono font-bold text-orange/90 group-hover:text-orange transition-colors">T_</span>
            </div>
            <span className="text-sm font-mono font-medium tracking-widest">TRVE<span className="text-orange">_</span></span>
          </Link>
          <span className="ml-auto text-[10px] font-mono text-purple-light/70 border border-purple/30 px-2 py-0.5">
            MVP
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/app' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative group',
                  isActive
                    ? 'text-foreground dark:text-orange bg-foreground/5 dark:bg-orange/10'
                    : 'text-muted-foreground hover:text-foreground dark:hover:text-orange/90 hover:bg-foreground/[0.02] dark:hover:bg-orange/5'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-foreground dark:bg-gradient-to-b dark:from-orange dark:to-magenta" />
                )}
                <span className={cn(isActive && 'dark:text-orange')}>{item.icon}</span>
                <span className="font-mono">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick actions */}
        <div className="p-4 border-t border-border dark:border-border/50 space-y-2">
          <Link to="/app/assets/new">
            <button className="w-full flex items-center justify-center gap-2 h-10 border border-dashed border-border dark:border-purple/40 hover:border-foreground dark:hover:border-purple text-muted-foreground hover:text-foreground dark:hover:text-purple-light transition-colors text-sm dark:hover:bg-purple/10 dark:hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-mono">{t('app.newAsset')}</span>
            </button>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/app/admin">
              <button className="w-full flex items-center justify-center gap-2 h-10 border border-foreground dark:border-orange/60 bg-foreground dark:bg-gradient-to-r dark:from-orange/20 dark:to-magenta/20 text-background dark:text-orange hover:bg-foreground/90 dark:hover:from-orange/30 dark:hover:to-magenta/30 transition-colors text-sm font-medium dark:hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-mono">{t('app.adminPanel')}</span>
              </button>
            </Link>
          )}
        </div>

        {/* User */}
        <div className="p-4 border-t border-border dark:border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-border dark:border-magenta/40 flex items-center justify-center bg-foreground/5 dark:bg-magenta/10">
              <span className="text-sm font-medium dark:text-magenta">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium font-mono truncate dark:text-foreground/90">{user?.username || 'User'}</p>
              <p className="text-xs font-mono text-muted-foreground dark:text-purple-light/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground dark:hover:text-magenta hover:bg-foreground/[0.02] dark:hover:bg-magenta/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span className="font-mono">{t('app.signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center gap-4 px-6 border-b border-border dark:border-border/50 bg-background/95 dark:bg-background/80 backdrop-blur-md sticky top-0 z-30">
          {/* Mobile menu button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center border border-border dark:border-purple/30 hover:border-foreground dark:hover:border-purple transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Breadcrumb / Page title */}
          <div className="flex-1">
            <nav className="text-sm text-muted-foreground font-mono">
              <ol className="flex items-center gap-2">
                <li>
                  <Link to="/app" className="hover:text-foreground transition-colors">
                    {t('app.dashboard')}
                  </Link>
                </li>
                {location.pathname !== '/app' && (
                  <>
                    <li>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </li>
                    <li className="text-foreground font-medium">
                      {location.pathname.includes('/assets/new') ? t('app.newAsset') :
                       location.pathname.includes('/assets/') ? t('app.editAsset') :
                       location.pathname.includes('/assets') ? t('app.assets') :
                       location.pathname.includes('/reports') ? t('app.reports') : ''}
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="w-10 h-10 flex items-center justify-center border border-border dark:border-purple/30 hover:border-foreground dark:hover:border-purple text-muted-foreground hover:text-foreground dark:hover:text-purple-light transition-colors relative dark:hover:bg-purple/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-foreground dark:bg-orange rounded-full"></span>
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'pl' : 'en')}
              className="h-10 px-3 flex items-center justify-center border border-border dark:border-purple/30 hover:border-foreground dark:hover:border-purple text-muted-foreground hover:text-foreground dark:hover:text-purple-light transition-colors text-sm font-medium dark:hover:bg-purple/10"
              aria-label="Toggle language"
            >
              {language === 'en' ? 'PL' : 'EN'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center border border-border dark:border-orange/40 hover:border-foreground dark:hover:border-orange text-muted-foreground hover:text-foreground dark:hover:text-orange transition-colors dark:hover:bg-orange/10 dark:hover:shadow-[0_0_15px_rgba(251,146,60,0.2)]"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 dark:text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
