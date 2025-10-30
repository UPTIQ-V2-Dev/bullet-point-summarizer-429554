import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { SummarizerPage } from '@/pages/SummarizerPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 2
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route
                        path='/login'
                        element={
                            <ProtectedRoute requireAuth={false}>
                                <LoginPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/register'
                        element={
                            <ProtectedRoute requireAuth={false}>
                                <RegisterPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/'
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <SummarizerPage />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/summarizer'
                        element={
                            <ProtectedRoute>
                                <AppLayout>
                                    <SummarizerPage />
                                </AppLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
};
