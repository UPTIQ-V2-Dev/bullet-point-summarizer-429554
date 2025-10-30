import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/lib/api';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const location = useLocation();
    const userIsAuthenticated = isAuthenticated();

    // If route requires auth and user is not authenticated, redirect to login
    if (requireAuth && !userIsAuthenticated) {
        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                replace
            />
        );
    }

    // If route doesn't require auth (like login page) and user is authenticated, redirect to home
    if (!requireAuth && userIsAuthenticated) {
        const searchParams = new URLSearchParams(location.search);
        const redirectTo = searchParams.get('redirect') || '/';
        return (
            <Navigate
                to={redirectTo}
                replace
            />
        );
    }

    return <>{children}</>;
};
