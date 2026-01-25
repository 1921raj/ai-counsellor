'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { authAPI } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authAPI.login(formData);
            const { access_token, user } = response.data;

            // Store token
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Welcome back!');

            // Redirect based on onboarding status
            if (user.onboarding_completed) {
                router.push('/dashboard');
            } else {
                router.push('/onboarding');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <Toaster position="top-right" />

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse" />
                <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                        <GraduationCap className="w-10 h-10 text-indigo-500" />
                        <span className="text-3xl font-bold gradient-text">AI Counsellor</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue your journey</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
