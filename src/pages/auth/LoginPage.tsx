import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();
  const { language } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const t = {
    en: {
      welcome: 'Welcome back',
      subtitle: 'Sign in to continue to your registry',
      username: 'Username',
      usernamePlaceholder: 'johndoe',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign in',
      signingIn: 'Signing in...',
      or: 'or continue with',
      noAccount: "Don't have an account?",
      register: 'Create one',
      loginError: 'Invalid username or password',
      tryDemo: 'Try Demo Account',
      loadingDemo: 'Loading...',
      tagline: 'Immutable product history',
    },
    pl: {
      welcome: 'Witaj ponownie',
      subtitle: 'Zaloguj się, aby kontynuować',
      username: 'Nazwa użytkownika',
      usernamePlaceholder: 'jankowalski',
      password: 'Hasło',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Zapamiętaj mnie',
      forgotPassword: 'Zapomniałeś hasła?',
      signIn: 'Zaloguj się',
      signingIn: 'Logowanie...',
      or: 'lub kontynuuj z',
      noAccount: 'Nie masz konta?',
      register: 'Utwórz je',
      loginError: 'Nieprawidłowa nazwa użytkownika lub hasło',
      tryDemo: 'Konto Demo',
      loadingDemo: 'Ładowanie...',
      tagline: 'Niezmienna historia produktów',
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/app');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setIsDemoLoading(true);

    try {
      await loginAsDemo();
      navigate('/app');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background relative overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border-2 border-background flex items-center justify-center group-hover:bg-background transition-colors">
              <span className="text-xs font-mono font-bold group-hover:text-foreground transition-colors">T_</span>
            </div>
            <span className="text-sm font-mono font-medium tracking-widest">TRVE<span className="opacity-70">_</span></span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="space-y-6">
              {/* Blockchain visual */}
              <div className="flex items-center gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-background/30 flex items-center justify-center">
                      <span className="text-xs font-mono text-background/50">#{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    {i < 3 && <div className="w-6 h-px bg-background/30" />}
                  </div>
                ))}
              </div>

              <h2 className="text-4xl font-light leading-tight">
                {t.tagline}
              </h2>
              <p className="text-background/60">
                Every product has a story. We make sure it's never lost.
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between text-sm text-background/40">
            <span>© 2025 TRVE.io</span>
            <span className="font-mono">v0.1 Early Access</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-foreground flex items-center justify-center">
                <span className="text-xs font-mono font-bold">T_</span>
              </div>
              <span className="text-sm font-mono font-medium tracking-widest">TRVE<span className="opacity-70">_</span></span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-light mb-2">{t.welcome}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 border border-red-500/30 bg-red-500/5 text-red-600 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.username}</label>
                <input
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.password}</label>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-5 h-5 border border-border group-hover:border-foreground flex items-center justify-center transition-colors">
                  <input type="checkbox" className="sr-only peer" />
                  <svg className="w-3 h-3 hidden peer-checked:block" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted-foreground">{t.rememberMe}</span>
              </label>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.forgotPassword}
              </a>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading || isDemoLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.signingIn}
                </span>
              ) : t.signIn}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">{t.or}</span>
            </div>
          </div>

          {/* Demo button */}
          <button
            type="button"
            onClick={handleDemo}
            disabled={isLoading || isDemoLoading}
            className="w-full h-12 border border-border hover:border-foreground text-foreground flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
          >
            {isDemoLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.loadingDemo}
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {t.tryDemo}
              </>
            )}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {t.noAccount}{' '}
            <Link to="/register" className="text-foreground hover:underline font-medium">
              {t.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
