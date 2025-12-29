import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from '@/pages/404/NotFoundPage';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole) {
    const userRoles: string[] = Array.isArray(user?.role)
      ? (user?.role as string[])
      : user?.role
      ? [user.role as string]
      : [];

    const required = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    const hasRole = required.some((r) => userRoles.includes(r));
    if (!hasRole) {
      return <NotFound />;
    }
  }

  return <>{children}</>;
}
