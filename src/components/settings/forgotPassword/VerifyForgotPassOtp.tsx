"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { maskEmail } from '@/lib/helpers';

const VerifyForgotPassOtp: React.FC = () => {
    const [forgotPasswordOTP, setForgotPasswordOTP] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [resendTimeLeft, setResendTimeLeft] = useState(60);
    const [isVerifying, setIsVerifying] = useState(false)
    const router = useRouter();
    const forgotPassEmail = localStorage.getItem('forgotPassEmail'); // use it to show where the otp has been sent
    const maskedEmail = maskEmail(String(forgotPassEmail))

    const form = useForm({
        defaultValues: {
            forgotPasswordOTP: '',
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (forgotPasswordOTP === "") {
            setError('OTP is required');
            return;
        }

        setIsVerifying(true)
        try {
            const token = localStorage.getItem('forgotPassEmailToken');
            // console.log("forgotPassEmailToken", token);
            if (!token) {
                console.error('No token found.');
                router.push('/settings/forgot-password/send-otp')
            }
            const response = await api.post(
                '/api/v1/users/verify-forgot-password-otp',
                { forgotPasswordOTP: Number(forgotPasswordOTP) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                    withCredentials: true,
                }
            );
            setSuccess(response.data.message);
            // After successful verification, clearing token
            localStorage.removeItem('forgotPassEmailToken');
            const verifiedEmailToken = response.data.data.token;
            localStorage.setItem("verifiedEmailToken", verifiedEmailToken);
            localStorage.removeItem("usernameOrEmail");
            setError('');
            setForgotPasswordOTP('');
            router.push('/settings/forgot-password/set-new-password');
        } catch (err: any) {
            setError(err.response?.data?.message || "OTP verification failed.");
            setSuccess('');
        }
    };

    // Function to handle Resend OTP
    const handleResendOTP = async () => {
        const usernameOrEmail = localStorage.getItem('usernameOrEmail');
        if (!usernameOrEmail) {
            setError('Unauthorized request 2!');
            return;
        }

        try {
            const response = await api.post(
                '/api/v1/users/send-forgot-password-otp',
                { usernameOrEmail }
            );
            setSuccess(response.data.message);
            const token = response.data.data.token;
            const forgotPassEmail = response.data.data.email
            localStorage.setItem('forgotPassEmailToken', token);
            localStorage.setItem('forgotPassEmail', forgotPassEmail);
            setError('');
            resetTimers();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to register email. Please try again.');
            setSuccess('');;
            resetTimers();
        } finally {
            setIsVerifying(false)
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
        <div className="flex flex-col items-center min-h-screen">
            <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-lg shadow-lg w-80">
                    <h2 className="text-2xl font-semibold text-blue-500 text-center mb-6">
                        Verify Your Email
                    </h2>

                    <div className='text-base text-slate-700 dark:text-slate-300'>
                        OTP is sent to {maskedEmail}
                    </div>

                    {/* OTP Input */}
                    <FormField
                        name="forgotPasswordOTP"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>OTP:</FormLabel> */}
                                <FormControl>
                                    <Input
                                        className='placeholder:text-slate-400'
                                        type="number"
                                        {...field}
                                        value={forgotPasswordOTP}
                                        onChange={(e) => setForgotPasswordOTP(e.target.value)}
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
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                    </Button>
                </form>
            </Form>

            <button
                type='button'
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

export default VerifyForgotPassOtp;
