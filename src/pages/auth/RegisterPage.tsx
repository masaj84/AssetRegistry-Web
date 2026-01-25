import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { language } = useLanguage();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    en: {
      title: 'Create your account',
      subtitle: 'Start building your product registry',
      userName: 'Username',
      userNamePlaceholder: 'johndoe',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      passwordHint: 'Min. 8 characters, 1 uppercase, 1 lowercase, 1 digit',
      terms: 'By registering you accept the',
      termsLink: 'terms of service',
      and: 'and',
      privacyLink: 'privacy policy',
      createAccount: 'Create account',
      creating: 'Creating account...',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in',
      successMessage: 'Account created! Please check your email to confirm.',
      successNoEmail: 'Account created! Redirecting to login...',
      tagline: 'Join the future of product identity',
      benefit1: 'Free forever for first 1000 items',
      benefit2: 'No blockchain knowledge required',
      benefit3: 'Immutable & verifiable records',
    },
    pl: {
      title: 'Utwórz konto',
      subtitle: 'Zacznij budować swój rejestr produktów',
      userName: 'Nazwa użytkownika',
      userNamePlaceholder: 'jankowalski',
      email: 'Email',
      emailPlaceholder: 'twoj@email.com',
      password: 'Hasło',
      passwordPlaceholder: '••••••••',
      passwordHint: 'Min. 8 znaków, 1 wielka litera, 1 mała litera, 1 cyfra',
      terms: 'Rejestrując się akceptujesz',
      termsLink: 'regulamin',
      and: 'i',
      privacyLink: 'politykę prywatności',
      createAccount: 'Utwórz konto',
      creating: 'Tworzenie konta...',
      haveAccount: 'Masz już konto?',
      signIn: 'Zaloguj się',
      successMessage: 'Konto utworzone! Sprawdź email, aby potwierdzić.',
      successNoEmail: 'Konto utworzone! Przekierowuję do logowania...',
      tagline: 'Dołącz do przyszłości tożsamości produktów',
      benefit1: 'Darmowe na zawsze dla pierwszych 1000 produktów',
      benefit2: 'Nie wymaga znajomości blockchain',
      benefit3: 'Niezmienna i weryfikowalna historia',
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await register(email, password, userName);
      if (result.requiresEmailConfirmation) {
        setSuccess(t.successMessage);
      } else {
        setSuccess(t.successNoEmail);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
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
              <span className="text-sm font-bold group-hover:text-foreground transition-colors">TV</span>
            </div>
            <span className="text-sm font-medium tracking-widest">TRUVALUE</span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="space-y-8">
              <h2 className="text-4xl font-light leading-tight">
                {t.tagline}
              </h2>

              {/* Benefits */}
              <div className="space-y-4">
                {[t.benefit1, t.benefit2, t.benefit3].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-background/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-background/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-background/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between text-sm text-background/40">
            <span>© 2025 Truvalue.co</span>
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
                <span className="text-sm font-bold">TV</span>
              </div>
              <span className="text-sm font-medium tracking-widest">TRUVALUE</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-light mb-2">{t.title}</h1>
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

          {/* Success */}
          {success && (
            <div className="mb-6 p-4 border border-green-500/30 bg-green-500/5 text-green-600 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.userName}</label>
                <input
                  type="text"
                  placeholder={t.userNamePlaceholder}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.email}</label>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  minLength={8}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-2">{t.passwordHint}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {t.terms}{' '}
              <a href="#" className="text-foreground hover:underline">{t.termsLink}</a>
              {' '}{t.and}{' '}
              <a href="#" className="text-foreground hover:underline">{t.privacyLink}</a>.
            </p>

            <Button type="submit" className="w-full h-12" disabled={isLoading || !!success}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.creating}
                </span>
              ) : t.createAccount}
            </Button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {t.haveAccount}{' '}
            <Link to="/login" className="text-foreground hover:underline font-medium">
              {t.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
