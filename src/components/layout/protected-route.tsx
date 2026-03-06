import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { PageLoader } from '@/components/ui/spinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) return <PageLoader />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && !hasRole(allowedRoles)) return <Navigate to="/" replace />;

    return <>{children}</>;
}
