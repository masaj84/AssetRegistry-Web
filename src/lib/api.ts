import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API Error handling helper
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Map common backend error messages to Polish
const errorTranslations: Record<string, string> = {
  'Email is required': 'Email jest wymagany',
  'Email and password are required': 'Email i hasło są wymagane',
  'Invalid email or password': 'Nieprawidłowy email lub hasło',
  'Invalid credentials': 'Nieprawidłowe dane logowania',
  'User not found': 'Użytkownik nie został znaleziony',
  'Email already exists': 'Ten email jest już zarejestrowany',
  'Username is already taken': 'Ta nazwa użytkownika jest już zajęta',
  'Password must be at least 8 characters': 'Hasło musi mieć co najmniej 8 znaków',
  'Please confirm your email before logging in': 'Potwierdź swój email przed zalogowaniem',
  'Account is locked': 'Konto jest zablokowane',
  'Invalid email format': 'Nieprawidłowy format email',
  'Email is already registered': 'Ten email jest już zarejestrowany',
};

function translateError(message: string, lang: string): string {
  if (lang !== 'pl') return message;
  // Direct match
  if (errorTranslations[message]) return errorTranslations[message];
  // Partial match (backend may include dynamic content)
  for (const [en, pl] of Object.entries(errorTranslations)) {
    if (message.toLowerCase().includes(en.toLowerCase())) return pl;
  }
  // Known patterns
  if (message.includes('already taken')) return 'Ta nazwa jest już zajęta';
  if (message.includes('already registered') || message.includes('already exists')) return 'Ten email jest już zarejestrowany';
  if (message.includes('confirm') && message.includes('email')) return 'Potwierdź swój email przed zalogowaniem';
  return message;
}

export const getErrorMessage = (error: unknown, lang?: string): string => {
  const language = lang || localStorage.getItem('language') || 'en';
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.message) return translateError(data.message, language);
    if (data?.errors) {
      return Object.values(data.errors).flat().map(e => translateError(String(e), language)).join(', ');
    }
    if (error.response?.status === 401) return language === 'pl' ? 'Sesja wygasła. Zaloguj się ponownie.' : 'Unauthorized. Please login again.';
    if (error.response?.status === 403) return language === 'pl' ? 'Brak dostępu.' : 'Access denied.';
    if (error.response?.status === 404) return language === 'pl' ? 'Nie znaleziono.' : 'Resource not found.';
    if (error.response?.status === 500) return language === 'pl' ? 'Błąd serwera. Spróbuj ponownie.' : 'Server error. Please try again later.';
  }
  return language === 'pl' ? 'Wystąpił nieoczekiwany błąd.' : 'An unexpected error occurred.';
};
