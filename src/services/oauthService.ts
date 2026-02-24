import { api, setTokens } from '../lib/api';
import type { 
  OAuthUrlResponse, 
  OAuthCallbackRequest, 
  OAuthCallbackResponse 
} from '../types';

class OAuthService {
  /**
   * Get OAuth authorization URL for the specified provider
   */
  async getOAuthUrl(provider: 'google' | 'facebook'): Promise<OAuthUrlResponse> {
    const response = await api.get<OAuthUrlResponse>(`/auth/oauth/${provider}/url`);
    return response.data;
  }

  /**
   * Exchange OAuth authorization code for JWT tokens
   */
  async exchangeCodeForTokens(
    provider: 'google' | 'facebook',
    code: string,
    state: string
  ): Promise<OAuthCallbackResponse> {
    const response = await api.post<OAuthCallbackResponse>(
      `/auth/oauth/${provider}/callback`,
      { code, state }
    );
    
    const { token, refreshToken } = response.data;
    setTokens(token, refreshToken);
    
    return response.data;
  }

  /**
   * Initiate Google OAuth login
   */
  async initiateGoogleLogin(): Promise<void> {
    try {
      const { url } = await this.getOAuthUrl('google');
      // Store the current URL to return to after OAuth
      sessionStorage.setItem('oauth_redirect_url', window.location.pathname);
      window.location.href = url;
    } catch (error) {
      console.error('Failed to initiate Google OAuth:', error);
      throw new Error('Failed to start Google login. Please try again.');
    }
  }

  /**
   * Initiate Facebook OAuth login
   */
  async initiateFacebookLogin(): Promise<void> {
    try {
      const { url } = await this.getOAuthUrl('facebook');
      // Store the current URL to return to after OAuth
      sessionStorage.setItem('oauth_redirect_url', window.location.pathname);
      window.location.href = url;
    } catch (error) {
      console.error('Failed to initiate Facebook OAuth:', error);
      throw new Error('Failed to start Facebook login. Please try again.');
    }
  }

  /**
   * Handle OAuth callback and complete authentication
   */
  async handleCallback(
    provider: 'google' | 'facebook',
    code: string,
    state: string
  ): Promise<OAuthCallbackResponse> {
    try {
      const result = await this.exchangeCodeForTokens(provider, code, state);
      return result;
    } catch (error) {
      console.error(`OAuth callback failed for ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Get the stored redirect URL or default to /app
   */
  getRedirectUrl(): string {
    const stored = sessionStorage.getItem('oauth_redirect_url');
    sessionStorage.removeItem('oauth_redirect_url');
    return stored || '/app';
  }

  /**
   * Handle OAuth errors and provide user-friendly messages
   */
  getErrorMessage(error: any, provider: 'google' | 'facebook'): string {
    if (error?.response?.status === 400) {
      return `${provider.charAt(0).toUpperCase() + provider.slice(1)} login was cancelled.`;
    }
    
    if (error?.response?.status === 401) {
      return `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again.`;
    }
    
    if (error?.response?.status >= 500) {
      return 'Social login temporarily unavailable. Please try again later.';
    }
    
    return error?.message || `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again.`;
  }
}

export const oauthService = new OAuthService();