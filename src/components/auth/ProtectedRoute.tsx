import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectTo?: string;
  // If true, will use company-specific login page
  useCompanyRedirect?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  redirectTo = '/login',
  useCompanyRedirect = true
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { companySlug } = useParams<{ companySlug?: string }>();

  // Determine the redirect path based on company context
  const getRedirectPath = () => {
    if (useCompanyRedirect && companySlug) {
      return `/${companySlug}/login`;
    }
    return redirectTo;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const withAuth = (Component: React.ComponentType, allowedRoles: string[] = []) => {
  return function WithAuth(props: any) {
    const { user, isAuthenticated, loading } = useAuth();
    const { companySlug } = useParams<{ companySlug?: string }>();

    // Determine the redirect path based on company context
    const getRedirectPath = () => {
      if (companySlug) {
        return `/${companySlug}/login`;
      }
      return '/select-company';
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return <Navigate to={getRedirectPath()} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component {...props} />;
  };
};
