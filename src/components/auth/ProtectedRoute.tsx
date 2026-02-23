"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/models';
import { Spinner } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Wraps authenticated routes to enforce authentication and role-based access
 *
 * Usage:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 *
 * With role restrictions:
 * <ProtectedRoute allowedRoles={[UserRole.FAMILY_USER]}>
 *   <FamilyDashboard />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, userRole } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Give Zustand persist time to hydrate (100ms should be enough)
    const timer = setTimeout(() => {
      setHasCheckedAuth(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Don't check auth until hydration delay is complete
    if (!hasCheckedAuth) return;

    // Wait for auth check to complete
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      // Store the attempted URL to redirect back after login
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?returnUrl=${returnUrl}`);
      return;
    }

    // Check role-based access if roles are specified
    if (allowedRoles && allowedRoles.length > 0 && userRole) {
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        const roleDashboards: Record<UserRole, string> = {
          [UserRole.FAMILY_USER]: '/dashboard/family',
          [UserRole.CAREGIVER]: '/dashboard/caregiver',
          [UserRole.ADMIN]: '/dashboard/admin',
        };

        const dashboardUrl = roleDashboards[userRole] || '/dashboard';
        router.push(dashboardUrl);
      }
    }
  }, [isAuthenticated, isLoading, userRole, allowedRoles, router, pathname, redirectTo, hasCheckedAuth]);

  // Show loading state while checking authentication or waiting for hydration
  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-dark-600 dark:text-dark-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render children until auth is verified
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if user doesn't have required role
  if (allowedRoles && allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
