import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { authService, getErrorMessage } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

type Mode = 'confirm' | 'forgot' | 'reset';

export function AuthActionPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();

  const mode: Mode = location.pathname.includes('confirm-email')
    ? 'confirm'
    : location.pathname.includes('forgot-password')
      ? 'forgot'
      : 'reset';

  const t = {
    en: {
      // Confirm email
      confirmTitle: 'Email Confirmation',
      confirmLoading: 'Confirming your email...',
      confirmSuccess: 'Your email has been confirmed. You can now log in.',
      confirmError: 'Failed to confirm email. The link may be invalid or expired.',
      // Forgot password
      forgotTitle: 'Forgot Password',
      forgotSubtitle: 'Enter your email and we\'ll send you a reset link.',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      sendLink: 'Send reset link',
      sending: 'Sending...',
      forgotSuccess: 'If an account with this email exists, a password reset link has been sent.',
      // Reset password
      resetTitle: 'Reset Password',
      resetSubtitle: 'Enter your new password.',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      passwordPlaceholder: '••••••••',
      passwordHint: 'Min. 8 characters, 1 uppercase, 1 lowercase, 1 digit',
      resetButton: 'Reset password',
      resetting: 'Resetting...',
      resetSuccess: 'Your password has been reset. You can now log in.',
      passwordMismatch: 'Passwords do not match.',
      // Common
      backToLogin: 'Back to login',
      tryAgain: 'Try again',
      tagline: 'Immutable product history',
    },
    pl: {
      // Confirm email
      confirmTitle: 'Potwierdzenie email',
      confirmLoading: 'Potwierdzamy Twój email...',
      confirmSuccess: 'Email został potwierdzony. Możesz się teraz zalogować.',
      confirmError: 'Nie udało się potwierdzić emaila. Link może być nieprawidłowy lub wygasły.',
      // Forgot password
      forgotTitle: 'Zapomniałeś hasła?',
      forgotSubtitle: 'Podaj swój email, a wyślemy Ci link do resetowania.',
      email: 'Email',
      emailPlaceholder: 'twoj@email.com',
      sendLink: 'Wyślij link',
      sending: 'Wysyłanie...',
      forgotSuccess: 'Jeśli konto z tym adresem istnieje, link do resetowania hasła został wysłany.',
      // Reset password
      resetTitle: 'Resetowanie hasła',
      resetSubtitle: 'Podaj nowe hasło.',
      newPassword: 'Nowe hasło',
      confirmPassword: 'Potwierdź hasło',
      passwordPlaceholder: '••••••••',
      passwordHint: 'Min. 8 znaków, 1 wielka litera, 1 mała litera, 1 cyfra',
      resetButton: 'Zresetuj hasło',
      resetting: 'Resetowanie...',
      resetSuccess: 'Hasło zostało zresetowane. Możesz się teraz zalogować.',
      passwordMismatch: 'Hasła nie są takie same.',
      // Common
      backToLogin: 'Powrót do logowania',
      tryAgain: 'Spróbuj ponownie',
      tagline: 'Niezmienna historia produktów',
    },
  }[language];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border-2 border-background flex items-center justify-center group-hover:bg-background transition-colors">
              <span className="text-xs font-mono font-bold group-hover:text-foreground transition-colors">T_</span>
            </div>
            <span className="text-sm font-mono font-medium tracking-widest">TRVE<span className="opacity-70">_</span></span>
          </Link>
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="space-y-6">
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
              <h2 className="text-4xl font-light leading-tight">{t.tagline}</h2>
              <p className="text-background/60">
                Every product has a story. We make sure it's never lost.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-background/40">
            <span>&copy; 2025 TRVE.io</span>
            <span className="font-mono">v0.1 Early Access</span>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
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

          {mode === 'confirm' && (
            <ConfirmEmailContent t={t} searchParams={searchParams} />
          )}
          {mode === 'forgot' && (
            <ForgotPasswordContent t={t} />
          )}
          {mode === 'reset' && (
            <ResetPasswordContent t={t} searchParams={searchParams} />
          )}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-6 h-6 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function StatusMessage({ type, message }: { type: 'success' | 'error'; message: string }) {
  const isSuccess = type === 'success';
  return (
    <div className={`p-4 border ${isSuccess ? 'border-green-500/30 bg-green-500/5 text-green-600' : 'border-red-500/30 bg-red-500/5 text-red-600'} text-sm flex items-center gap-3`}>
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        {isSuccess ? (
          <path d="M5 13l4 4L19 7" />
        ) : (
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        )}
      </svg>
      {message}
    </div>
  );
}

// --- Confirm Email ---

function ConfirmEmailContent({ t, searchParams }: { t: Record<string, string>; searchParams: URLSearchParams }) {
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const hasParams = Boolean(userId && token);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(hasParams ? 'loading' : 'error');
  const [error, setError] = useState(hasParams ? '' : t.confirmError);

  useEffect(() => {
    if (!userId || !token) return;

    authService.confirmEmail(userId, token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setError(getErrorMessage(err) || t.confirmError);
      });
  }, [userId, token, t.confirmError]);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-2">{t.confirmTitle}</h1>
      </div>

      {status === 'loading' && (
        <div className="space-y-4 text-center">
          <Spinner />
          <p className="text-muted-foreground">{t.confirmLoading}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <StatusMessage type="success" message={t.confirmSuccess} />
          <Link to="/login">
            <Button className="w-full h-12">{t.backToLogin}</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6">
          <StatusMessage type="error" message={error} />
          <Link to="/login">
            <Button className="w-full h-12">{t.backToLogin}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// --- Forgot Password ---

function ForgotPasswordContent({ t }: { t: Record<string, string> }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-2">{t.forgotTitle}</h1>
        <p className="text-muted-foreground">{t.forgotSubtitle}</p>
      </div>

      {success ? (
        <div className="space-y-6">
          <StatusMessage type="success" message={t.forgotSuccess} />
          <Link to="/login">
            <Button className="w-full h-12">{t.backToLogin}</Button>
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6">
              <StatusMessage type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.sending}
                </span>
              ) : t.sendLink}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            <Link to="/login" className="text-foreground hover:underline font-medium">
              {t.backToLogin}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

// --- Reset Password ---

function ResetPasswordContent({ t, searchParams }: { t: Record<string, string>; searchParams: URLSearchParams }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (!userId || !token) {
      setError(t.confirmError);
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(userId, token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-light mb-2">{t.resetTitle}</h1>
        <p className="text-muted-foreground">{t.resetSubtitle}</p>
      </div>

      {success ? (
        <div className="space-y-6">
          <StatusMessage type="success" message={t.resetSuccess} />
          <Link to="/login">
            <Button className="w-full h-12">{t.backToLogin}</Button>
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6">
              <StatusMessage type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.newPassword}</label>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-1">{t.passwordHint}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t.confirmPassword}</label>
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full h-12 px-4 border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.resetting}
                </span>
              ) : t.resetButton}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            <Link to="/login" className="text-foreground hover:underline font-medium">
              {t.backToLogin}
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
export default AuthActionPage;
