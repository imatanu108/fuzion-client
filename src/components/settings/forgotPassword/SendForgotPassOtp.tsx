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

// Zod schema for email validation
const forgotPasswordSchema = z.object({
    usernameOrEmail: z.string().min(1, "Email or username is required"),
});

const SendForgotPassOtp: React.FC = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)

    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            usernameOrEmail: '',
        },
    });

    const onSubmit = async (data: { usernameOrEmail: string }) => {
        setSuccess('');
        setError('');

        try {
            if (currentUserData) {
                if (data.usernameOrEmail !== currentUserData.email && data.usernameOrEmail !== currentUserData.username) {
                    setError("Your username or email doesn't match.")
                    return
                }
            }
            const response = await api.post(
                '/api/v1/users/send-forgot-password-otp',
                { usernameOrEmail: data.usernameOrEmail }
            );
            setSuccess(response.data.message);
            const token = response.data.data.token;
            const forgotPassEmail = response.data.data.email
            localStorage.setItem('forgotPassEmailToken', token);
            localStorage.setItem('forgotPassEmail', forgotPassEmail);
            localStorage.setItem('usernameOrEmail', data.usernameOrEmail);
            form.reset(); // Reset form fields
            router.push('/settings/forgot-password/verify-otp'); // Redirect to verification page
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
                    <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Forgot Password</h2>

                    {/* Email Field */}
                    <FormField
                        name="usernameOrEmail"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or Username:</FormLabel>
                                <FormControl>
                                    <Input
                                        className='placeholder:text-slate-400'
                                        type="text"
                                        placeholder="Enter your email or username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
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

export default SendForgotPassOtp;
