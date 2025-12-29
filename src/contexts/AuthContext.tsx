import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name?: string;
  role?: string | string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  login: (user: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });
    const [initialized] = useState(true);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Mark context as initialized after mount so consumers don't redirect during startup
  // (localStorage read above is synchronous, but this ensures any async checks
  //  or token refresh logic can set state before ProtectedRoute redirects)

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        initialized,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}
