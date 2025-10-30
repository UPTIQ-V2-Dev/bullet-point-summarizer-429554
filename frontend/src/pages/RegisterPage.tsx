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
import type { SignupRequest } from '@/types/user';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/';

    const [formData, setFormData] = useState<SignupRequest>({
        name: '',
        email: '',
        password: ''
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            navigate(redirectTo);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate(formData);
    };

    const handleChange = (field: keyof SignupRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-center'>Create your account</CardTitle>
                    <CardDescription className='text-center'>
                        Sign up to start using AI Slack Summarizer
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className='space-y-4'>
                        {registerMutation.error && (
                            <Alert variant='destructive'>
                                <AlertDescription>
                                    {registerMutation.error instanceof Error
                                        ? registerMutation.error.message
                                        : 'Registration failed. Please try again.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className='space-y-2'>
                            <Label htmlFor='name'>Full Name</Label>
                            <Input
                                id='name'
                                type='text'
                                placeholder='Enter your full name'
                                value={formData.name}
                                onChange={handleChange('name')}
                                required
                                disabled={registerMutation.isPending}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='email'>Email address</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                value={formData.email}
                                onChange={handleChange('email')}
                                required
                                disabled={registerMutation.isPending}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Create a password'
                                value={formData.password}
                                onChange={handleChange('password')}
                                required
                                disabled={registerMutation.isPending}
                                minLength={6}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className='flex flex-col space-y-4'>
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </Button>

                        <div className='text-center text-sm text-gray-600'>
                            Already have an account?{' '}
                            <Link
                                to='/login'
                                className='font-medium text-primary hover:underline'
                            >
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
