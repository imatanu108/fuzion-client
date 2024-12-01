"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { CurrentUserData } from "@/types";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "@/features/userSlice";
import { AppDispatch, RootState } from "@/store/store";


// Zod schema for validation
const registrationSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .regex(/^[a-zA-Z0-9-_]+$/, "Invalid username: only letters, numbers, hyphens, and underscores are allowed."),
    bio: z
        .string()
        .max(100, "Bio must not exceed 100 characters"),
});

const UpdateDetailsForm: React.FC = () => {
    const currentUserData: CurrentUserData | null = useSelector((state: RootState) => state.user.currentUserData)
    const accessToken: string | null = useSelector((state: RootState) => state.user.accessToken)
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            fullName: currentUserData?.fullName,
            bio: currentUserData?.bio,
            username: currentUserData?.username,
        },
    });

    const onSubmit = async (data: any) => {
        // console.log("form data", data)
        setSuccessMessage("");
        setErrorMessage("");
    
        if (!accessToken) {
          console.error("Unauthorize request.")
          return
        }

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("bio", data.bio);
        formData.append("username", data.username);

        try {
            const response = await api.patch("/api/v1/users/update-profile", formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            const updatedUserData: CurrentUserData = response.data?.data
            dispatch(setCurrentUserData(updatedUserData))
            setSuccessMessage(response.data.message || "Registration successful!");
            router.push(`/user/${updatedUserData?.username}`);
            form.reset();
            
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || err.message || "Something went wrong.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 py-4 px-6 rounded-2xl md:shadow-md w-[100%] md:w-[50%] lg:w-[45%]">

                    {/* Full Name */}
                    <FormField
                        name="fullName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name:</FormLabel>
                                <FormControl>
                                    <Input
                                        className='placeholder:text-slate-400 rounded-full'
                                        placeholder="Enter your full name..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                            </FormItem>
                        )}
                    />

                    {/* Username */}
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username:</FormLabel>
                                <FormControl>
                                    <Input
                                        className='placeholder:text-slate-400 rounded-full'
                                        placeholder="Choose a username..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="bio"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio:</FormLabel>
                                <FormControl>
                                    <Input
                                        maxLength={100}
                                        className='placeholder:text-slate-400 rounded-full'
                                        placeholder="Tell us a little about yourself..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                            </FormItem>
                        )}
                    />


                    {/* Success and Error Messages */}
                    {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                    {/* Submit Button */}
                    <div className="flex justify-center items-center gap-4">
                        <Button 
                        type="button"
                        onClick={() => router.push(`/user/${currentUserData?.username}`)}
                        variant={"outline"} 
                        className="mt-4 font-base text-[#194d66] border-[#194d66] w-2/5 shadow-lg hover:bg-[#13445b18] rounded-full dark:text-slate-50 dark:border-slate-50">
                            Exit
                        </Button>
                        <Button type="submit" className="mt-4 w-2/5 font-base bg-blue-600 text-white shadow-lg hover:bg-blue-800 rounded-full">
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UpdateDetailsForm;
