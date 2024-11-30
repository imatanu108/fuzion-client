"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeClosed } from 'lucide-react';

// Zod schema for email validation
const newPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Password must include uppercase, lowercase, number, and special character."),
});

const SetNewPassword: React.FC = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [showNewPassword, setShowNewPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            newPassword: '',
        },
    });

    const onSubmit = async (data: { newPassword: string }) => {
        setSuccess('');
        setError('');

        try {
            const token = localStorage.getItem('verifiedEmailToken');
            const response = await api.post(
                '/api/v1/users/forgot-password',
                { newPassword: data.newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                }
            );
            setSuccess(response.data.message);
            localStorage.removeItem('verifiedEmailToken');
            form.reset();
            router.push('/user/auth/login');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to register email. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 rounded shadow-md w-80"
                >
                    <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Reset your password</h2>

                    {/* Email Field */}
                    <FormField
                        name="newPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Set new password:</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter your new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute inset-y-0 right-2"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeClosed className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </Button>
                                </div>
                                <FormMessage className="text-red-700 dark:text-red-300" />
                            </FormItem>
                        )}
                    />

                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    {success && <p className="text-green-500 mb-2">{success}</p>}

                    <Button type="submit" className="w-full my-4 text-slate-100 bg-blue-500 hover:bg-blue-600">
                        {form.formState.isSubmitting ? "Setting Password..." : "Set Password"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default SetNewPassword;
