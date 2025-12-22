import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { instance } from '@/assets/shared/lib/axios';
import { setCookie } from '@/assets/shared/lib/cookie';
import { AxiosError } from 'axios';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
}

export function useLogin(): UseLoginReturn {
  const { login: setAuthUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await instance.post<LoginResponse>(
        '/api/auth/signin',
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          validateStatus: (status) => status === 200 || status === 401,
        }
      );

      if (response.status === 401) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }

      const { accessToken, refreshToken } = response.data;

      setCookie('accessToken', accessToken);
      setCookie('refreshToken', refreshToken);

      setAuthUser(
        {
          id: 0,
          email: credentials.email,
        },
        accessToken
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
}
