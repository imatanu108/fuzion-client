"use client";

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSelector } from 'react-redux';
import { Eye, EyeClosed } from "lucide-react";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { logout } from "@/features/userSlice";


// Zod schema for email validation
const deleteAccountSchema = z.object({
    password: z.string().min(1, "Password is required.")
});

const DeleteAccount: React.FC = () => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>()

    const form = useForm({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: {
            password: ''
        },
    });

    useEffect(() => {
        if (!currentUserData) {
            router.push("/user/auth/login");
            return
        }
    }, [currentUserData])

    const onSubmit = async (data: { password: string }) => {
        setSuccess('');
        setError('');

        try {
            const response = await api.delete(
                '/api/v1/users/delete-user',
                {
                    data: {
                        password: data.password,
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            dispatch(logout())
            setSuccess(response.data.message);
            form.reset(); // Reset form fields
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to delete user. Please try again.');
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
                    <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Delete your account</h2>
                    <div className="text-center mb-6 text-gray-700">
                        <p className="text-sm">
                            Deleting your account is a permanent action. All your data, including saved tweets, playlists, and uploaded videos, will be permanently removed.
                            This action cannot be undone.
                        </p>
                    </div>

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
                                            placeholder="Enter your password to proceed"
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
                        Delete account
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default DeleteAccount;
