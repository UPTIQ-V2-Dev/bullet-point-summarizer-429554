import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { SummarizerPage } from '@/pages/SummarizerPage';

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
                <AppLayout>
                    <Routes>
                        <Route
                            path='/'
                            element={<SummarizerPage />}
                        />
                        <Route
                            path='/summarizer'
                            element={<SummarizerPage />}
                        />
                    </Routes>
                </AppLayout>
            </Router>
        </QueryClientProvider>
    );
};
