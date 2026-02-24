/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authService, getErrorMessage } from '../services/authService';
import { getAccessToken, clearTokens } from '../lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ requiresEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAIL = 'demo@trve.io';
const DEMO_PASSWORD = 'Demo123!';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const isAuthenticated = !!user;

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch {
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    // Fetch full user profile after login
    const userData = await authService.getProfile();
    setUser(userData);
    setIsDemo(email === 'demo@trve.io'); // Updated demo email
  };

  const loginAsDemo = async () => {
    await login(DEMO_EMAIL, DEMO_PASSWORD);
  };

  const register = async (email: string, password: string) => {
    const response = await authService.register({ email, password });
    return { requiresEmailConfirmation: response.requiresEmailConfirmation };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsDemo(false);
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', getErrorMessage(error));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      isDemo,
      login,
      loginAsDemo,
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
