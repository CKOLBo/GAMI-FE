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
  const { isAuthenticated, user, initialized } = useAuth();
  // while auth state is initializing, don't redirect — avoid false negatives
  if (!initialized) return null;
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole) {
    const userRoles: string[] = Array.isArray(user?.role)
      ? (user?.role as string[])
      : user?.role
      ? [user.role as string]
      : [];

    const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    const normalize = (r: string) => r.replace(/^ROLE_/i, '').toUpperCase();

    const normalizedUserRoles = userRoles.map((r) => normalize(r));
    const normalizedRequired = required.map((r) => normalize(r));

    const hasRole = normalizedRequired.some((req) =>
      normalizedUserRoles.includes(req)
    );

    if (!hasRole) {
      return <NotFound />;
    }
  }

  return <>{children}</>;
}
