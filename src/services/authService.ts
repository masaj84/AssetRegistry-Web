import { api, setTokens, clearTokens, getErrorMessage } from '../lib/api';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse
} from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data);
    const { token, refreshToken } = response.data;
    setTokens(token, refreshToken);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      clearTokens();
    }
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/profile');
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    setTokens(accessToken, newRefreshToken);
    return response.data;
  },

  async confirmEmail(userId: string, token: string): Promise<void> {
    await api.get('/auth/confirm-email', { params: { userId, token } });
  },

  async resendConfirmation(email: string): Promise<void> {
    await api.post('/auth/resend-confirmation', { email });
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(userId: string, token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { userId, token, newPassword });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/profile/change-password', { currentPassword, newPassword });
  },
};

export { getErrorMessage };
