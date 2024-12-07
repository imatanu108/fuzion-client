"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Eye, EyeClosed } from "lucide-react";
import api from "@/lib/api";
import { RootState } from "@/store/store";

const passwordSchema = z
    .object({
        oldPassword: z.string().min(1, "Current password is required."),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
        confirmNewPassword: z
            .string()
            .min(6, "Confirmation password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        path: ["confirmNewPassword"],
        message: "Passwords must match",
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePassword: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const router = useRouter();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isChanging, setIsChanging] = useState(false)

    const form = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    if (!currentUserData) {
        router.push("/user/auth/login");
        return null;
    }

    const onSubmit = async (data: PasswordFormData) => {
        setSuccessMessage("");
        setErrorMessage("");

        setIsChanging(true)
        try {
            const response = await api.post(
                "/api/v1/users/change-password",
                {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                    confirmNewPassword: data.confirmNewPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setSuccessMessage(response.data.message || "Password changed successfully!");
            form.reset();
            router.push('/settings')
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setIsChanging(false)
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen my-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 p-8 rounded-lg shadow-lg w-96"
                >
                    <h2 className="text-2xl font-semibold text-blue-500 text-center mb-6">
                        Change Password
                    </h2>

                    {/* Old Password */}
                    <FormField
                        name="oldPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Old Password:</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            className='placeholder:text-slate-400'
                                            type={showOldPassword ? "text" : "password"}
                                            placeholder="Enter your old password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute inset-y-0 right-2"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        {showOldPassword ? (
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

                    {/* New Password */}
                    <FormField
                        name="newPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password:</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            className='placeholder:text-slate-400'
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

                    {/* Confirm New Password */}
                    <FormField
                        name="confirmNewPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password:</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            className='placeholder:text-slate-400'
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute inset-y-0 right-2"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                    >
                                        {showConfirmPassword ? (
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

                    {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
                    {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full text-slate-100 bg-blue-500 hover:bg-blue-600">
                        {isChanging ? "Changing..." : "Change Password"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};


export default ChangePassword;
