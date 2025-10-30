import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { LoginRequest } from '@/types/user';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: () => {
            navigate(redirectTo);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };

    const handleChange = (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-center'>Sign in to your account</CardTitle>
                    <CardDescription className='text-center'>
                        Enter your email and password to access AI Slack Summarizer
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className='space-y-4'>
                        {loginMutation.error && (
                            <Alert variant='destructive'>
                                <AlertDescription>
                                    {loginMutation.error instanceof Error
                                        ? loginMutation.error.message
                                        : 'Login failed. Please check your credentials and try again.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className='space-y-2'>
                            <Label htmlFor='email'>Email address</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                value={formData.email}
                                onChange={handleChange('email')}
                                required
                                disabled={loginMutation.isPending}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter your password'
                                value={formData.password}
                                onChange={handleChange('password')}
                                required
                                disabled={loginMutation.isPending}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className='flex flex-col space-y-4'>
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>

                        <div className='text-center text-sm text-gray-600'>
                            Don't have an account?{' '}
                            <Link
                                to='/register'
                                className='font-medium text-primary hover:underline'
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
