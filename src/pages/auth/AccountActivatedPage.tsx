import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export function AccountActivatedPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      title: 'Account Activated!',
      subtitle: 'Your account has been successfully activated.',
      description: 'You can now sign in and start using the registry.',
      signIn: 'Sign in to your account',
      backToHome: 'Back to home',
    },
    pl: {
      title: 'Konto aktywowane!',
      subtitle: 'Twoje konto zostało pomyślnie aktywowane.',
      description: 'Możesz teraz się zalogować i zacząć korzystać z rejestru.',
      signIn: 'Zaloguj się',
      backToHome: 'Wróć na stronę główną',
    },
  };

  const text = t[language as keyof typeof t] || t.en;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Success message */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-10 h-10 border-2 border-foreground/60 flex items-center justify-center group-hover:border-foreground transition-colors">
              <span className="text-xs font-mono font-bold">T_</span>
            </div>
            <span className="text-base font-mono font-medium tracking-widest">TRVE<span className="text-orange">_</span></span>
          </Link>

          {/* Success Icon */}
          <div className="mb-8 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-emerald-500" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2} 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4.5 12.75l6 6 9-13.5" 
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-light mb-2">{text.title}</h1>
          <p className="text-muted-foreground mb-2">{text.subtitle}</p>
          <p className="text-muted-foreground text-sm mb-8">{text.description}</p>

          {/* Actions */}
          <div className="space-y-4">
            <Link to="/login" className="block">
              <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white">
                {text.signIn}
              </Button>
            </Link>
            
            <Link 
              to="/" 
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {text.backToHome}
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-foreground/[0.02] dark:bg-muted/20 items-center justify-center p-8 border-l border-border dark:border-border/50">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 border-2 border-emerald-500/40 dark:border-emerald-500/60 mx-auto mb-8 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-emerald-500/60 dark:text-emerald-500" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={1.5} 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-light mb-4 dark:text-foreground/90">
            Ready to secure your assets
          </h2>
          <p className="text-muted-foreground">
            Your account is now verified and ready. Start building immutable history for your valuable products.
          </p>
        </div>
      </div>
    </div>
  );
}
