"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentUserData } from '@/features/userSlice';
import { CurrentUserData } from '@/types';
import { AppDispatch } from '@/store/store';

const VerifyUpdateEmailOtp: React.FC = () => {
    const [updateEmailOTP, setUpdateEmailOTP] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [resendTimeLeft, setResendTimeLeft] = useState(90);
    const router = useRouter();
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const dispatch = useDispatch<AppDispatch>()

    const form = useForm({
        defaultValues: {
            updateEmailOTP: '',
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (updateEmailOTP === "") {
            setError('OTP is required');
            return;
        }

        try {
            const updateEmailToken = localStorage.getItem('updateEmailToken');
            // console.log("updateEmailToken", updateEmailToken);
            if (!updateEmailToken) {
                console.error('No token found.');
                router.push('/settings/update-email')
            }
            const response = await api.post(
                '/api/v1/users/verify-update-email',
                { updateEmailOTP: Number(updateEmailOTP) },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        updateEmailToken
                    },
                }
            );
            setSuccess(response.data.message);
            // After successful verification, clearing token
            const updatedUserData: CurrentUserData = response.data?.data?.user || null
            localStorage.removeItem('updateEmailToken');
            dispatch(setCurrentUserData(updatedUserData))
            setError('');
            setUpdateEmailOTP('');
            router.push('/settings');
        } catch (err: any) {
            setError(err.response?.data?.message || "OTP verification failed.");
            setSuccess('');
        }
    };

    // Function to handle Resend OTP
    const handleResendOTP = () => {
        router.push('/settings/update-email')
        resetTimers();
    };

    // Function to reset timers
    const resetTimers = () => {
        setResendTimeLeft(90);
        setIsResendDisabled(true);

        const countdown = (time: number) => {
            if (time > 0) {
                setResendTimeLeft(time);
                setTimeout(() => countdown(time - 1), 1000);
            } else {
                setIsResendDisabled(false);
            }
        };

        countdown(90); // Start countdown from 90 seconds
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

                    {/* OTP Input */}
                    <FormField
                        name="updateEmailOTP"
                        render={({ field }) => (
                            <FormItem>
                                {/* <FormLabel>OTP:</FormLabel> */}
                                <FormControl>
                                    <Input
                                        className='placeholder:text-slate-400'
                                        type="number"
                                        {...field}
                                        value={updateEmailOTP}
                                        onChange={(e) => setUpdateEmailOTP(e.target.value)}
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

export default VerifyUpdateEmailOtp;
