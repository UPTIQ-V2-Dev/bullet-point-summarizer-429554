import { Brain } from 'lucide-react';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

export const Header = () => {
    return (
        <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-14 max-w-screen-2xl items-center'>
                <div className='flex items-center gap-2'>
                    <Brain className='h-6 w-6 text-primary' />
                    <div className='flex flex-col'>
                        <h1 className='text-lg font-semibold leading-none'>{APP_NAME}</h1>
                        <p className='text-xs text-muted-foreground leading-none mt-0.5'>{APP_DESCRIPTION}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
