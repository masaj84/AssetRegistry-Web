import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
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
      title: 'Create account',
      subtitle: 'Try Truvalue for free',
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
      successNoEmail: 'Account created! You can now sign in.',
    },
    pl: {
      title: 'Utwórz konto',
      subtitle: 'Wypróbuj Truvalue za darmo',
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
      successNoEmail: 'Konto utworzone! Możesz się teraz zalogować.',
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-foreground flex items-center justify-center">
              <span className="text-sm font-bold">TV</span>
            </div>
            <span className="text-xl font-medium tracking-wide">TRUVALUE</span>
          </Link>
          <h1 className="text-2xl font-light mb-2">{t.title}</h1>
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

              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 text-green-700 text-sm">
                  {success}
                </div>
              )}

              <Input
                id="userName"
                type="text"
                label={t.userName}
                placeholder={t.userNamePlaceholder}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />

              <Input
                id="email"
                type="email"
                label={t.email}
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <Input
                  id="password"
                  type="password"
                  label={t.password}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground mt-1">{t.passwordHint}</p>
              </div>

              <p className="text-xs text-muted-foreground">
                {t.terms}{' '}
                <a href="#" className="text-foreground hover:underline">{t.termsLink}</a>
                {' '}{t.and}{' '}
                <a href="#" className="text-foreground hover:underline">{t.privacyLink}</a>.
              </p>

              <Button type="submit" className="w-full" disabled={isLoading || !!success}>
                {isLoading ? t.creating : t.createAccount}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t.haveAccount}{' '}
              <Link to="/login" className="text-foreground hover:underline">
                {t.signIn}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
