import { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { oauthService } from '../../services/oauthService';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { provider } = useParams<{ provider: 'google' | 'facebook' }>();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { language } = useLanguage();
  const [error, setError] = useState<string>('');
  const [, setIsProcessing] = useState(true);

  const t = {
    en: {
      processing: 'Completing sign in...',
      processingGoogle: 'Completing Google sign in...',
      processingFacebook: 'Completing Facebook sign in...',
      error: 'Sign in failed',
      redirecting: 'Redirecting...',
    },
    pl: {
      processing: 'Kończenie logowania...',
      processingGoogle: 'Kończenie logowania przez Google...',
      processingFacebook: 'Kończenie logowania przez Facebook...',
      error: 'Logowanie nie powiodło się',
      redirecting: 'Przekierowywanie...',
    },
  }[language];

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Validate provider
        if (!provider || !['google', 'facebook'].includes(provider)) {
          throw new Error('Invalid OAuth provider');
        }

        // Get callback parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Handle OAuth errors (user cancelled, etc.)
        if (error) {
          if (error === 'access_denied') {
            // User cancelled - redirect to login without error
            navigate('/login');
            return;
          }
          throw new Error(`OAuth error: ${error}`);
        }

        // Validate required parameters
        if (!code || !state) {
          throw new Error('Missing OAuth callback parameters');
        }

        // Exchange code for tokens
        await oauthService.handleCallback(provider, code, state);

        // Refresh user profile
        await refreshUser();

        // Redirect to intended destination
        const redirectUrl = oauthService.getRedirectUrl();
        navigate(redirectUrl);

      } catch (err) {
        console.error('OAuth callback error:', err);
        const errorMessage = oauthService.getErrorMessage(err, provider!);
        setError(errorMessage);
        setIsProcessing(false);

        // Redirect to login after a brief delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [provider, searchParams, navigate, refreshUser]);

  const getProcessingMessage = () => {
    if (provider === 'google') return t.processingGoogle;
    if (provider === 'facebook') return t.processingFacebook;
    return t.processing;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 text-red-500 flex items-center justify-center">
            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          {/* Error Message */}
          <div>
            <h1 className="text-2xl font-light mb-2 text-foreground">{t.error}</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm text-muted-foreground">
              {language === 'pl' 
                ? 'Przekierowywanie do strony logowania...' 
                : 'Redirecting to login page...'}
            </p>
          </div>

          {/* Loading indicator */}
          <div className="flex justify-center">
            <svg className="w-6 h-6 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Provider Icon */}
        <div className="mx-auto w-16 h-16 text-foreground flex items-center justify-center">
          {provider === 'google' ? (
            <svg className="w-12 h-12" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          ) : (
            <svg className="w-12 h-12 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          )}
        </div>

        {/* Loading Message */}
        <div>
          <h1 className="text-2xl font-light mb-2 text-foreground">
            {getProcessingMessage()}
          </h1>
          <p className="text-muted-foreground">
            {language === 'pl' 
              ? 'Proszę czekać...' 
              : 'Please wait...'}
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <svg className="w-8 h-8 animate-spin text-foreground" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    </div>
  );
}