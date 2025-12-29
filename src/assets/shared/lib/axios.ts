import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { deleteCookie, getCookie, setCookie } from '@/assets/shared/lib/cookie';

export class TokenRefreshError extends Error {
  constructor(message = 'Token refresh failed') {
    super(message);
    this.name = 'TokenRefreshError';
  }
}

const DEFAULT_BACKEND =
  'https://port-0-gami-server-mj0rdvda8d11523e.sel3.cloudtype.app';

// Allow override via Vite env var VITE_API_BASE for local testing.
// Fallback to DEFAULT_BACKEND to avoid dev-time proxying to vite origin.
export const baseURL: string = (import.meta.env.VITE_API_BASE as string) ||
  DEFAULT_BACKEND;

export const instance = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const isAuthEndpoint =
      config.url?.includes('/auth/signin') ||
      config.url?.includes('/auth/signup');

    if (!isAuthEndpoint) {
      const token = getCookie('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _skipErrorHandler?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/signin') ||
        originalRequest.url?.includes('/auth/signup') ||
        originalRequest.url?.includes('/auth/reissue');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const refreshURL = import.meta.env.DEV
          ? '/api/auth/reissue'
          : 'https://port-0-gami-server-mj0rdvda8d11523e.sel3.cloudtype.app/api/auth/reissue';

        const response = await axios.patch<{
          accessToken: string;
          refreshToken: string;
        }>(refreshURL, null, {
          headers: {
            RefreshToken: refreshToken,
          },
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        setCookie('accessToken', accessToken);
        setCookie('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        throw new TokenRefreshError(
          'Token refresh failed. Please login again.'
        );
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('인증 오류:', error.response?.status);
    }

    return Promise.reject(error);
  }
);
