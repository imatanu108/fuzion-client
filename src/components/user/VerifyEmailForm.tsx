"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiResponse } from '@/types';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VerifyEmailForm: React.FC = () => {
    const [verificationOTP, setVerificationOTP] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [resendTimeLeft, setResendTimeLeft] = useState(60);
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            verificationOTP: '',
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (verificationOTP === "") {
            setError('OTP is required');
            return;
        }

        try {
            const token = localStorage.getItem('emailToken');
            console.log("token", token);
            if (!token) {
                throw new Error('No token found. Please register your email again.');
            }
            const response = await api.post<ApiResponse>(
                '/api/v1/users/verify-email',
                { verificationOTP: Number(verificationOTP) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                    withCredentials: true,
                }
            );
            setSuccess(response.data.message);
            // After successful verification, clearing token
            localStorage.removeItem('emailToken');
            const verifiedEmailToken = response.data.data.token;
            localStorage.setItem("verifiedEmailToken", verifiedEmailToken);
            localStorage.removeItem("email");
            setError('');
            setVerificationOTP('');
            router.push('/user/registration');
        } catch (err: any) {
            setError(err.response?.data?.message || "OTP verification failed.");
            setSuccess('');
        }
    };

    // Function to handle Resend OTP
    const handleResendOTP = async () => {
        const email = localStorage.getItem('email');

        if (!email) {
            setError('Unauthorized request!');
            return;
        }

        try {
            const response = await api.post('/api/v1/users/register-email', { email });
            setSuccess(response.data.message);
            const token = response.data.data.token;
            localStorage.setItem('emailToken', token);
            setError('');
            resetTimers();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to register email. Please try again.');
            setSuccess('');;
            resetTimers();
        }
    };

    // Function to reset timers
    const resetTimers = () => {
        setResendTimeLeft(60);
        setIsResendDisabled(true);

        const countdown = (time: number) => {
            if (time > 0) {
                setResendTimeLeft(time);
                setTimeout(() => countdown(time - 1), 1000);
            } else {
                setIsResendDisabled(false);
            }
        };

        countdown(60); // Start countdown from 60 seconds
    };

    useEffect(() => {
        resetTimers();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-6 bg-[#20313e] p-8 rounded-lg shadow-lg w-80">
                    <h2 className="text-2xl font-semibold text-blue-500 text-center mb-6">Verify Your Email</h2>

                    {/* OTP Input */}
                    <FormField
                        name="verificationOTP"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>OTP:</FormLabel> */}
                                <FormControl>
                                    <Input
                                        className='placeholder:text-slate-400'
                                        type="number"
                                        {...field}
                                        value={verificationOTP}
                                        onChange={(e) => setVerificationOTP(e.target.value)}
                                        placeholder="Enter the OTP"
                                        required
                                    />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                            </FormItem>
                        )}
                    />

                    {/* Success and Error Messages */}
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    {success && <p className="text-green-500 mb-2">{success}</p>}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                        Submit
                    </Button>
                </form>
            </Form>

            <button
                onClick={handleResendOTP}
                className="mt-4 text-sm text-blue-500 underline hover:text-blue-600"
                disabled={isResendDisabled}
            >
                {!isResendDisabled
                    ? "Didn't get code? Resend OTP!"
                    : `Didn't get OTP? Resend in ${resendTimeLeft} seconds.`}
            </button>
        </div>
    );
};

export default VerifyEmailForm;
