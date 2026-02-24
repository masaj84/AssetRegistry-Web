import { api, setTokens } from '../lib/api';
import type { 
  OAuthUrlResponse, 
  OAuthCallbackResponse 
} from '../types';

class OAuthService {
  /**
   * Get OAuth authorization URL for Google
   */
  async getOAuthUrl(provider: 'google'): Promise<OAuthUrlResponse> {
    if (provider !== 'google') {
      throw new Error('Only Google OAuth is supported');
    }
    const response = await api.get<OAuthUrlResponse>(`/auth/oauth/${provider}/url`);
    return response.data;
  }

  /**
   * Exchange OAuth authorization code for JWT tokens (Google only)
   */
  async exchangeCodeForTokens(
    provider: 'google',
    code: string,
    state: string
  ): Promise<OAuthCallbackResponse> {
    if (provider !== 'google') {
      throw new Error('Only Google OAuth is supported');
    }
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
   * Facebook OAuth temporarily disabled
   * This method is kept as a placeholder for future implementation
   */
  async initiateFacebookLogin(): Promise<void> {
    throw new Error('Facebook login is temporarily unavailable. Please use Google login.');
  }

  /**
   * Handle OAuth callback and complete authentication (Google only)
   */
  async handleCallback(
    provider: 'google',
    code: string,
    state: string
  ): Promise<OAuthCallbackResponse> {
    if (provider !== 'google') {
      throw new Error('Only Google OAuth is supported');
    }
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
   * Handle OAuth errors and provide user-friendly messages (Google only)
   */
  getErrorMessage(error: any, provider: 'google'): string {
    if (provider !== 'google') {
      return 'Only Google login is supported.';
    }
    
    if (error?.response?.status === 400) {
      return 'Google login was cancelled.';
    }
    
    if (error?.response?.status === 401) {
      return 'Google login failed. Please try again.';
    }
    
    if (error?.response?.status >= 500) {
      return 'Google login temporarily unavailable. Please try again later.';
    }
    
    return error?.message || 'Google login failed. Please try again.';
  }
}

export const oauthService = new OAuthService();