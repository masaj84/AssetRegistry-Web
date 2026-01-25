import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

const getNavigation = (t: (key: string) => string) => [
  {
    name: t('admin.dashboard'),
    href: '/app/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    name: t('admin.users'),
    href: '/app/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    name: t('admin.organizations'),
    href: '/app/admin/organizations',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    name: t('admin.assets'),
    href: '/app/admin/assets',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    name: t('admin.newsletter'),
    href: '/app/admin/newsletter',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    name: t('admin.security'),
    href: '/app/admin/security',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

export function AdminLayout() {
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

  const isActive = (href: string) => {
    if (href === '/app/admin') {
      return location.pathname === '/app/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Dark mode ambient background effects */}
      <div className="dark:block hidden fixed inset-0 pointer-events-none overflow-hidden">
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
            <div className="w-9 h-9 border-2 border-foreground dark:border-orange/60 flex items-center justify-center group-hover:bg-foreground dark:group-hover:bg-orange/20 transition-colors dark:group-hover:border-orange dark:group-hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]">
              <span className="text-xs font-bold group-hover:text-background dark:group-hover:text-orange transition-colors">TV</span>
            </div>
            <span className="text-sm font-medium tracking-widest dark:text-orange/90">TRUVALUE</span>
          </Link>
          <span className="ml-auto text-[10px] font-mono text-amber-500 dark:text-orange border border-amber-500 dark:border-orange/60 px-2 py-0.5">
            ADMIN
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative group',
                  active
                    ? 'text-foreground dark:text-orange bg-foreground/5 dark:bg-orange/10'
                    : 'text-muted-foreground hover:text-foreground dark:hover:text-orange/90 hover:bg-foreground/[0.02] dark:hover:bg-orange/5'
                )}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-amber-500 dark:bg-gradient-to-b dark:from-orange dark:to-magenta" />
                )}
                <span className={cn(active && 'dark:text-orange')}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to app */}
        <div className="p-4 border-t border-border dark:border-border/50">
          <Link to="/app">
            <button className="w-full flex items-center justify-center gap-2 h-10 border border-dashed border-border dark:border-purple/40 hover:border-foreground dark:hover:border-purple text-muted-foreground hover:text-foreground dark:hover:text-purple-light transition-colors text-sm dark:hover:bg-purple/10 dark:hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t('admin.backToApp')}
            </button>
          </Link>
        </div>

        {/* User */}
        <div className="p-4 border-t border-border dark:border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-amber-500 dark:border-orange/60 flex items-center justify-center bg-amber-500/10 dark:bg-orange/10">
              <span className="text-sm font-medium text-amber-500 dark:text-orange">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate dark:text-foreground/90">{user?.username || 'Admin'}</p>
              <p className="text-xs text-amber-500 dark:text-orange/70 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground dark:hover:text-magenta hover:bg-foreground/[0.02] dark:hover:bg-magenta/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {t('app.signOut')}
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
            <nav className="text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link to="/app/admin" className="hover:text-foreground dark:hover:text-orange transition-colors">
                    Admin
                  </Link>
                </li>
                {location.pathname !== '/app/admin' && (
                  <>
                    <li>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </li>
                    <li className="text-foreground dark:text-orange font-medium">
                      {location.pathname.includes('/users/') ? 'User Details' :
                       location.pathname.includes('/users') ? 'Users' :
                       location.pathname.includes('/organizations/') ? 'Organization Details' :
                       location.pathname.includes('/organizations') ? 'Organizations' :
                       location.pathname.includes('/assets') ? 'Assets' :
                       location.pathname.includes('/newsletter') ? 'Newsletter' :
                       location.pathname.includes('/security') ? 'Security' : ''}
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>

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

          {/* Admin badge */}
          <div className="flex items-center gap-2 text-xs text-amber-500 dark:text-orange border border-amber-500 dark:border-orange/60 dark:bg-orange/10 px-3 py-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            {t('admin.adminPanel')}
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
