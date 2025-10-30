import { Brain, LogOut } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { authService } from '@/services/auth';
import { getStoredUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Header = () => {
    const navigate = useNavigate();
    const user = getStoredUser();

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            navigate('/login');
        },
        onError: () => {
            // Even if logout fails, clear local data and redirect
            navigate('/login');
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const getUserInitials = (name: string = '') => {
        return (
            name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'U'
        );
    };

    return (
        <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-14 max-w-screen-2xl items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Brain className='h-6 w-6 text-primary' />
                    <div className='flex flex-col'>
                        <h1 className='text-lg font-semibold leading-none'>{APP_NAME}</h1>
                        <p className='text-xs text-muted-foreground leading-none mt-0.5'>{APP_DESCRIPTION}</p>
                    </div>
                </div>

                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                className='relative h-8 w-8 rounded-full'
                            >
                                <Avatar className='h-8 w-8'>
                                    <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-56'
                            align='end'
                            forceMount
                        >
                            <div className='flex items-center justify-start gap-2 p-2'>
                                <div className='flex flex-col space-y-1 leading-none'>
                                    {user.name && <p className='font-medium'>{user.name}</p>}
                                    <p className='w-48 truncate text-sm text-muted-foreground'>{user.email}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut className='mr-2 h-4 w-4' />
                                {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
};
