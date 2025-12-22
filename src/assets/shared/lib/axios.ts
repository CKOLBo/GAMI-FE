import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { deleteCookie, getCookie, setCookie } from '@/assets/shared/lib/cookie';

export class TokenRefreshError extends Error {
  constructor(message = 'Token refresh failed') {
    super(message);
    this.name = 'TokenRefreshError';
  }
}

export const baseURL = import.meta.env.DEV
  ? ''
  : 'https://port-0-gami-server-mj0rdvda8d11523e.sel3.cloudtype.app';

export const instance = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

instance.interceptors.request.use((config) => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

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
        originalRequest.url?.includes('/auth/signup');

      if (isAuthEndpoint) {
        return Promise.resolve({
          ...error.response,
          status: 401,
          statusText: error.response.statusText,
          headers: error.response.headers,
          config: error.config,
          data: error.response.data,
        } as AxiosResponse);
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
        throw new TokenRefreshError(
          'Token refresh failed. Please login again.'
        );
      }
    }

    return Promise.reject(error);
  }
);
