
import { SocialLoginButton } from '../ui/SocialLoginButton';
import { useLanguage } from '../../context/LanguageContext';

interface SocialLoginSectionProps {
  isLoading: boolean;
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
  disabled?: boolean;
}

export function SocialLoginSection({ 
  isLoading, 
  onGoogleLogin, 
  onFacebookLogin, 
  disabled = false 
}: SocialLoginSectionProps) {
  const { language } = useLanguage();

  const t = {
    en: {
      continueWithGoogle: 'Continue with Google',
      continueWithFacebook: 'Continue with Facebook',
      signingInWithGoogle: 'Signing in with Google...',
      signingInWithFacebook: 'Signing in with Facebook...',
    },
    pl: {
      continueWithGoogle: 'Kontynuuj z Google',
      continueWithFacebook: 'Kontynuuj z Facebook',
      signingInWithGoogle: 'Logowanie przez Google...',
      signingInWithFacebook: 'Logowanie przez Facebook...',
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
      
      <SocialLoginButton
        provider="facebook"
        isLoading={isLoading}
        onClick={onFacebookLogin}
        disabled={disabled}
      >
        {isLoading ? t.signingInWithFacebook : t.continueWithFacebook}
      </SocialLoginButton>
    </div>
  );
}