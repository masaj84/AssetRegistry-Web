import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
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
      subtitle: 'Sign in to your account',
      username: 'Username',
      usernamePlaceholder: 'johndoe',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign in',
      signingIn: 'Signing in...',
      or: 'or',
      noAccount: "Don't have an account?",
      register: 'Register',
      loginError: 'Invalid username or password',
      tryDemo: 'Try Demo',
      loadingDemo: 'Loading...',
    },
    pl: {
      welcome: 'Witaj ponownie',
      subtitle: 'Zaloguj się do swojego konta',
      username: 'Nazwa użytkownika',
      usernamePlaceholder: 'jankowalski',
      password: 'Hasło',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Zapamiętaj mnie',
      forgotPassword: 'Zapomniałeś hasła?',
      signIn: 'Zaloguj się',
      signingIn: 'Logowanie...',
      or: 'lub',
      noAccount: 'Nie masz konta?',
      register: 'Zarejestruj się',
      loginError: 'Nieprawidłowa nazwa użytkownika lub hasło',
      tryDemo: 'Wypróbuj Demo',
      loadingDemo: 'Ładowanie...',
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-foreground flex items-center justify-center">
              <span className="text-sm font-bold">TV</span>
            </div>
            <span className="text-xl font-medium tracking-wide">TRUVALUE</span>
          </Link>
          <h1 className="text-2xl font-light mb-2">{t.welcome}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Input
                id="username"
                type="text"
                label={t.username}
                placeholder={t.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                id="password"
                type="password"
                label={t.password}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border bg-secondary" />
                  <span className="text-muted-foreground">{t.rememberMe}</span>
                </label>
                <a href="#" className="text-foreground hover:underline">
                  {t.forgotPassword}
                </a>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || isDemoLoading}>
                {isLoading ? t.signingIn : t.signIn}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">{t.or}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleDemo}
                disabled={isLoading || isDemoLoading}
              >
                {isDemoLoading ? t.loadingDemo : t.tryDemo}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t.noAccount}{' '}
              <Link to="/register" className="text-foreground hover:underline">
                {t.register}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
