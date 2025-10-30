import { Header } from './Header';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className='min-h-screen bg-background flex flex-col'>
            <Header />
            <main className='flex-1 container max-w-screen-xl mx-auto px-4 py-6'>{children}</main>
        </div>
    );
};
