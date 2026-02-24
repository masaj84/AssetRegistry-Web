# Social Login - Component Architecture & Code Examples

## 🏗️ Component Implementation Details

### 1. SocialLoginButton Component

```typescript
// src/components/ui/SocialLoginButton.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'facebook';
  isLoading: boolean;
  loadingText?: string;
}

const providerConfig = {
  google: {
    baseStyle: 'bg-background border-border text-foreground hover:border-foreground',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    text: 'Continue with Google'
  },
  facebook: {
    baseStyle: 'bg-[#1877f2] text-white hover:bg-[#166fe5] border-[#1877f2]',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    text: 'Continue with Facebook'
  }
};

export const SocialLoginButton = forwardRef<HTMLButtonElement, SocialLoginButtonProps>(
  ({ className, provider, isLoading, loadingText, children, ...props }, ref) => {
    const config = providerConfig[provider];
    
    return (
      <button
        ref={ref}
        className={cn(
          'w-full h-12 px-4 border flex items-center justify-center gap-3 font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          config.baseStyle,
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{loadingText || `Signing in with ${provider}...`}</span>
          </>
        ) : (
          <>
            {config.icon}
            <span>{children || config.text}</span>
          </>
        )}
      </button>
    );
  }
);

SocialLoginButton.displayName = 'SocialLoginButton';
```

### 2. SocialLoginSection Component

```typescript
// src/components/auth/SocialLoginSection.tsx
import { SocialLoginButton } from '../ui/SocialLoginButton';
import { useLanguage } from '../../context/LanguageContext';

interface SocialLoginSectionProps {
  isGoogleLoading: boolean;
  isFacebookLoading: boolean;
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
  disabled?: boolean;
}

export function SocialLoginSection({ 
  isGoogleLoading, 
  isFacebookLoading, 
  onGoogleLogin, 
  onFacebookLogin, 
  disabled 
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

  const isAnyLoading = isGoogleLoading || isFacebookLoading;

  return (
    <div className="space-y-3">
      <SocialLoginButton
        provider="google"
        isLoading={isGoogleLoading}
        loadingText={t.signingInWithGoogle}
        onClick={onGoogleLogin}
        disabled={disabled || isAnyLoading}
        aria-label={t.continueWithGoogle}
      >
        {t.continueWithGoogle}
      </SocialLoginButton>
      
      <SocialLoginButton
        provider="facebook"
        isLoading={isFacebookLoading}
        loadingText={t.signingInWithFacebook}
        onClick={onFacebookLogin}
        disabled={disabled || isAnyLoading}
        aria-label={t.continueWithFacebook}
      >
        {t.continueWithFacebook}
      </SocialLoginButton>
    </div>
  );
}
```

### 3. OAuth Service

```typescript
// src/services/oauthService.ts
import { authService } from './authService';

export interface OAuthConfig {
  google: {
    clientId: string;
    redirectUri: string;
    scope: string;
  };
  facebook: {
    clientId: string;
    redirectUri: string;
    scope: string;
  };
}

class OAuthService {
  private config: OAuthConfig;

  constructor() {
    this.config = {
      google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        redirectUri: `${window.location.origin}/auth/callback/google`,
        scope: 'openid email profile'
      },
      facebook: {
        clientId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
        redirectUri: `${window.location.origin}/auth/callback/facebook`,
        scope: 'email'
      }
    };
  }

  generateGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.google.clientId,
      redirect_uri: this.config.google.redirectUri,
      response_type: 'code',
      scope: this.config.google.scope,
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  generateFacebookAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.facebook.clientId,
      redirect_uri: this.config.facebook.redirectUri,
      response_type: 'code',
      scope: this.config.facebook.scope,
      state: this.generateState()
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  initiateGoogleLogin(): void {
    const authUrl = this.generateGoogleAuthUrl();
    window.location.href = authUrl;
  }

  initiateFacebookLogin(): void {
    const authUrl = this.generateFacebookAuthUrl();
    window.location.href = authUrl;
  }

  async handleOAuthCallback(provider: 'google' | 'facebook', code: string): Promise<{
    access_token: string;
    refresh_token: string;
    user: any;
  }> {
    try {
      const response = await authService.exchangeOAuthCode(provider, code);
      return response;
    } catch (error) {
      throw new Error(`OAuth callback failed for ${provider}: ${error}`);
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  parseCallbackUrl(url: string): { code?: string; error?: string; state?: string } {
    const urlParams = new URLSearchParams(new URL(url).search);
    return {
      code: urlParams.get('code') || undefined,
      error: urlParams.get('error') || undefined,
      state: urlParams.get('state') || undefined
    };
  }
}

export const oauthService = new OAuthService();
```

### 4. OAuth Callback Handler

```typescript
// src/components/auth/OAuthCallback.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { oauthService } from '../../services/oauthService';
import { useLanguage } from '../../context/LanguageContext';

export function OAuthCallback() {
  const { provider } = useParams<{ provider: 'google' | 'facebook' }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserFromOAuth } = useAuth();
  const { language } = useLanguage();
  const [error, setError] = useState<string>('');

  const t = {
    en: {
      processing: 'Processing login...',
      error: 'Login failed. Redirecting...',
      success: 'Login successful. Redirecting...'
    },
    pl: {
      processing: 'Przetwarzanie logowania...',
      error: 'Logowanie nie powiodło się. Przekierowanie...',
      success: 'Logowanie zakończone pomyślnie. Przekierowanie...'
    }
  }[language];

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!provider) {
        navigate('/login?error=invalid_provider');
        return;
      }

      try {
        const { code, error: oauthError } = oauthService.parseCallbackUrl(location.search);

        if (oauthError) {
          console.error('OAuth error:', oauthError);
          navigate('/login?error=oauth_cancelled');
          return;
        }

        if (!code) {
          navigate('/login?error=no_code');
          return;
        }

        const { access_token, refresh_token, user } = await oauthService.handleOAuthCallback(provider, code);
        
        // Update auth context with OAuth user data
        await updateUserFromOAuth({
          access_token,
          refresh_token,
          user,
          provider
        });

        // Redirect to app
        navigate('/app');

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        setTimeout(() => {
          navigate('/login?error=oauth_failed');
        }, 2000);
      }
    };

    handleOAuthCallback();
  }, [provider, location.search, navigate, updateUserFromOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-muted-foreground">{t.error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <svg className="w-12 h-12 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-muted-foreground">{t.processing}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 5. Updated AuthContext

```typescript
// src/context/AuthContext.tsx - Additional methods to add

interface AuthContextType {
  // ... existing properties
  isOAuthLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  updateUserFromOAuth: (oauthData: OAuthData) => Promise<void>;
}

interface OAuthData {
  access_token: string;
  refresh_token: string;
  user: any;
  provider: 'google' | 'facebook';
}

// Add to AuthProvider component:

const [isOAuthLoading, setIsOAuthLoading] = useState(false);

const loginWithGoogle = async () => {
  setIsOAuthLoading(true);
  try {
    oauthService.initiateGoogleLogin();
  } catch (error) {
    setIsOAuthLoading(false);
    throw error;
  }
};

const loginWithFacebook = async () => {
  setIsOAuthLoading(true);
  try {
    oauthService.initiateFacebookLogin();
  } catch (error) {
    setIsOAuthLoading(false);
    throw error;
  }
};

const updateUserFromOAuth = async (oauthData: OAuthData) => {
  try {
    // Store tokens using existing token management
    localStorage.setItem('access_token', oauthData.access_token);
    localStorage.setItem('refresh_token', oauthData.refresh_token);
    
    // Update user state
    setUser(oauthData.user);
    setIsOAuthLoading(false);
  } catch (error) {
    setIsOAuthLoading(false);
    throw error;
  }
};
```

### 6. Updated LoginPage Integration

```typescript
// src/pages/auth/LoginPage.tsx - Key changes

import { SocialLoginSection } from '../../components/auth/SocialLoginSection';

// Add to component:
const { loginWithGoogle, loginWithFacebook, isOAuthLoading } = useAuth();

const handleGoogleLogin = async () => {
  setError('');
  try {
    await loginWithGoogle();
  } catch (err) {
    setError(getErrorMessage(err));
  }
};

const handleFacebookLogin = async () => {
  setError('');
  try {
    await loginWithFacebook();
  } catch (err) {
    setError(getErrorMessage(err));
  }
};

// Replace the existing demo button section with:

{/* Divider */}
<div className="relative my-8">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-border"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-4 bg-background text-muted-foreground">{t.or}</span>
  </div>
</div>

{/* Social Login Section */}
<SocialLoginSection
  isGoogleLoading={isOAuthLoading}
  isFacebookLoading={isOAuthLoading}
  onGoogleLogin={handleGoogleLogin}
  onFacebookLogin={handleFacebookLogin}
  disabled={isLoading || isDemoLoading}
/>

{/* Divider */}
<div className="relative my-8">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-border"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-4 bg-background text-muted-foreground">{t.or}</span>
  </div>
</div>

{/* Demo button - keep existing implementation */}
```

## 🛣️ Routing Configuration

```typescript
// src/App.tsx or router configuration
import { OAuthCallback } from './components/auth/OAuthCallback';

// Add route:
{
  path: "/auth/callback/:provider",
  element: <OAuthCallback />
}
```

This component architecture provides a clean, maintainable, and extensible implementation that follows the existing codebase patterns while adding robust social login functionality.