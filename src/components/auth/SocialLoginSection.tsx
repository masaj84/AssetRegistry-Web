
import { SocialLoginButton } from '../ui/SocialLoginButton';
import { useLanguage } from '../../context/LanguageContext';

interface SocialLoginSectionProps {
  isLoading: boolean;
  onGoogleLogin: () => Promise<void>;
  disabled?: boolean;
}

export function SocialLoginSection({ 
  isLoading, 
  onGoogleLogin, 
  disabled = false 
}: SocialLoginSectionProps) {
  const { language } = useLanguage();

  const t = {
    en: {
      continueWithGoogle: 'Continue with Google',
      signingInWithGoogle: 'Signing in with Google...',
    },
    pl: {
      continueWithGoogle: 'Kontynuuj z Google',
      signingInWithGoogle: 'Logowanie przez Google...',
    },
  }[language];

  return (
    <div className="space-y-3">
      <SocialLoginButton
        provider="google"
        isLoading={isLoading}
        onClick={onGoogleLogin}
        disabled={disabled}
      >
        {isLoading ? t.signingInWithGoogle : t.continueWithGoogle}
      </SocialLoginButton>
      
      {/* Facebook OAuth temporarily disabled - space reserved for future */}
      {/* 
      <SocialLoginButton
        provider="facebook"
        isLoading={isLoading}
        onClick={onFacebookLogin}
        disabled={disabled}
      >
        {isLoading ? t.signingInWithFacebook : t.continueWithFacebook}
      </SocialLoginButton>
      */}
    </div>
  );
}