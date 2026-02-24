import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { oauthService } from './oauthService';
import { api, setTokens } from '../lib/api';

// Mock dependencies
vi.mock('../lib/api');

const mockApi = vi.mocked(api);
const mockSetTokens = vi.mocked(setTokens);

// Mock window.location and sessionStorage
const mockLocation = {
  href: '',
  pathname: '/login'
};

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true
});

describe('OAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = '';
    mockLocation.pathname = '/login';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getOAuthUrl', () => {
    it('fetches Google OAuth URL successfully', async () => {
      const mockResponse = { url: 'https://google.com/oauth', state: 'abc123' };
      mockApi.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await oauthService.getOAuthUrl('google');

      expect(mockApi.get).toHaveBeenCalledWith('/auth/oauth/google/url');
      expect(result).toEqual(mockResponse);
    });

    it('fetches Facebook OAuth URL successfully', async () => {
      const mockResponse = { url: 'https://facebook.com/oauth', state: 'def456' };
      mockApi.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await oauthService.getOAuthUrl('facebook');

      expect(mockApi.get).toHaveBeenCalledWith('/auth/oauth/facebook/url');
      expect(result).toEqual(mockResponse);
    });

    it('throws error when API call fails', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(oauthService.getOAuthUrl('google')).rejects.toThrow('Network error');
    });
  });

  describe('exchangeCodeForTokens', () => {
    const mockTokenResponse = {
      token: 'access_token_123',
      refreshToken: 'refresh_token_456',
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        provider: 'google' as const
      }
    };

    it('exchanges Google code for tokens successfully', async () => {
      mockApi.post.mockResolvedValueOnce({ data: mockTokenResponse });

      const result = await oauthService.exchangeCodeForTokens('google', 'code123', 'state456');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/oauth/google/callback', {
        code: 'code123',
        state: 'state456'
      });
      expect(mockSetTokens).toHaveBeenCalledWith('access_token_123', 'refresh_token_456');
      expect(result).toEqual(mockTokenResponse);
    });

    it('exchanges Facebook code for tokens successfully', async () => {
      const facebookResponse = { ...mockTokenResponse, user: { ...mockTokenResponse.user, provider: 'facebook' as const } };
      mockApi.post.mockResolvedValueOnce({ data: facebookResponse });

      const result = await oauthService.exchangeCodeForTokens('facebook', 'code789', 'state012');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/oauth/facebook/callback', {
        code: 'code789',
        state: 'state012'
      });
      expect(result).toEqual(facebookResponse);
    });

    it('throws error when token exchange fails', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Invalid code'));

      await expect(oauthService.exchangeCodeForTokens('google', 'invalid', 'state')).rejects.toThrow('Invalid code');
    });
  });

  describe('initiateGoogleLogin', () => {
    it('redirects to Google OAuth URL', async () => {
      const mockOAuthUrl = 'https://accounts.google.com/oauth/authorize?client_id=123';
      mockApi.get.mockResolvedValueOnce({ 
        data: { url: mockOAuthUrl, state: 'state123' } 
      });

      await oauthService.initiateGoogleLogin();

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('oauth_redirect_url', '/login');
      expect(mockLocation.href).toBe(mockOAuthUrl);
    });

    it('throws user-friendly error when OAuth URL fetch fails', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(oauthService.initiateGoogleLogin()).rejects.toThrow('Failed to start Google login. Please try again.');
    });
  });

  describe('initiateFacebookLogin', () => {
    it('redirects to Facebook OAuth URL', async () => {
      const mockOAuthUrl = 'https://facebook.com/oauth/authorize?client_id=456';
      mockApi.get.mockResolvedValueOnce({ 
        data: { url: mockOAuthUrl, state: 'state456' } 
      });

      await oauthService.initiateFacebookLogin();

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('oauth_redirect_url', '/login');
      expect(mockLocation.href).toBe(mockOAuthUrl);
    });

    it('throws user-friendly error when OAuth URL fetch fails', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(oauthService.initiateFacebookLogin()).rejects.toThrow('Failed to start Facebook login. Please try again.');
    });
  });

  describe('handleCallback', () => {
    it('handles successful Google callback', async () => {
      const mockResponse = {
        token: 'token123',
        refreshToken: 'refresh123',
        user: { id: 'user1', email: 'user@example.com', provider: 'google' as const }
      };
      mockApi.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await oauthService.handleCallback('google', 'code123', 'state123');

      expect(result).toEqual(mockResponse);
    });

    it('throws error when callback fails', async () => {
      const error = new Error('Invalid state parameter');
      mockApi.post.mockRejectedValueOnce(error);

      await expect(oauthService.handleCallback('facebook', 'code', 'invalid_state')).rejects.toThrow('Invalid state parameter');
    });
  });

  describe('getRedirectUrl', () => {
    it('returns stored redirect URL and removes it', () => {
      mockSessionStorage.getItem.mockReturnValueOnce('/app/dashboard');

      const url = oauthService.getRedirectUrl();

      expect(url).toBe('/app/dashboard');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('oauth_redirect_url');
    });

    it('returns default URL when no stored URL', () => {
      mockSessionStorage.getItem.mockReturnValueOnce(null);

      const url = oauthService.getRedirectUrl();

      expect(url).toBe('/app');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('oauth_redirect_url');
    });
  });

  describe('getErrorMessage', () => {
    it('returns cancelled message for 400 error', () => {
      const error = { response: { status: 400 } };
      const message = oauthService.getErrorMessage(error, 'google');
      expect(message).toBe('Google login was cancelled.');
    });

    it('returns failed message for 401 error', () => {
      const error = { response: { status: 401 } };
      const message = oauthService.getErrorMessage(error, 'facebook');
      expect(message).toBe('Facebook login failed. Please try again.');
    });

    it('returns unavailable message for 500+ errors', () => {
      const error = { response: { status: 500 } };
      const message = oauthService.getErrorMessage(error, 'google');
      expect(message).toBe('Social login temporarily unavailable. Please try again later.');
    });

    it('returns custom error message when available', () => {
      const error = { message: 'Custom error message' };
      const message = oauthService.getErrorMessage(error, 'google');
      expect(message).toBe('Custom error message');
    });

    it('returns generic error message for unknown errors', () => {
      const error = {};
      const message = oauthService.getErrorMessage(error, 'facebook');
      expect(message).toBe('Facebook login failed. Please try again.');
    });

    it('capitalizes provider name correctly', () => {
      const error = { response: { status: 401 } };
      
      const googleMessage = oauthService.getErrorMessage(error, 'google');
      expect(googleMessage).toBe('Google login failed. Please try again.');

      const facebookMessage = oauthService.getErrorMessage(error, 'facebook');
      expect(facebookMessage).toBe('Facebook login failed. Please try again.');
    });
  });
});