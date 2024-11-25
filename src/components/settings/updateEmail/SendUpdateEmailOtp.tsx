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
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Eye, EyeClosed } from "lucide-react";

// Zod schema for email validation
const updateEmailSchema = z.object({
    newEmail: z.string().min(1, "Email or username is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required.")
});

const SendUpdateEmailOtp: React.FC = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(updateEmailSchema),
        defaultValues: {
            newEmail: '',
            password: ''
        },
    });

    if (!currentUserData) {
        router.push("/user/auth/login");
        return null;
    }

    const onSubmit = async (data: { newEmail: string, password: string }) => {
        setSuccess('');
        setError('');

        try {
            const response = await api.post(
                '/api/v1/users/update-email',
                {
                    newEmail: data.newEmail,
                    password: data.password
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setSuccess(response.data.message);
            const updateEmailToken = response.data.data.updateEmailToken;
            localStorage.setItem('updateEmailToken', updateEmailToken);
            localStorage.setItem('newEmail', data.newEmail);
            form.reset(); // Reset form fields
            router.push('/settings/update-email/verify-otp');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update email. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 rounded shadow-md w-80 space-y-3"
                >
                    <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Update Email</h2>

                    {/* Email Field */}
                    <FormField
                        name="newEmail"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New email</FormLabel>
                                <FormControl>
                                    <Input
                                        className='placeholder:text-slate-400'
                                        type="text"
                                        placeholder="Enter your new email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password:</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            className='placeholder:text-slate-400'
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your old password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute inset-y-0 right-2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
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

                    {/* Success and Error Messages */}
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    {success && <p className="text-green-500 mb-2">{success}</p>}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="bg-blue-500 text-white rounded my-5 p-2 w-full hover:bg-blue-600"
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default SendUpdateEmailOtp;
