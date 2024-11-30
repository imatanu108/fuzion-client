"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeClosed } from "lucide-react";
import api from "@/lib/api";
import { useDispatch } from "react-redux";
import { setCurrentUserData, setAccessToken, setRefreshToken } from "@/features/userSlice";
import { CurrentUserData } from "@/types";
import { AppDispatch } from "@/store/store";

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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Password must include uppercase, lowercase, number, and special character."),
});

const RegistrationForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("bio", data.bio);
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      const verifiedEmailToken = localStorage.getItem("verifiedEmailToken");
      if (!verifiedEmailToken) {
        throw new Error("No token found. Please register your email again.");
      }
      const response = await api.post("/api/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${verifiedEmailToken}`,
        },
      });
      const createdUserData: CurrentUserData = response.data?.data
      setSuccessMessage(response.data.message || "Registration successful!");
      // auto-login the user
      try {
        const response = await api.post('/api/v1/users/login', { usernameOrEmail: createdUserData.username, password: data.password });
        form.reset(); // Reset form fields
        const userData: CurrentUserData = response.data?.data.user || null
        dispatch(setCurrentUserData(userData))
        const accessToken: string = response.data?.data.accessToken
        const refreshToken: string = response.data?.data.refreshToken
        dispatch(setCurrentUserData(userData))
        dispatch(setAccessToken(accessToken))
        dispatch(setRefreshToken(refreshToken))
        router.push('/')
      } catch (err: any) {
        console.error(err.response?.data?.message || err.message || 'Something went wrong while auto logging in the user.');
      }
      form.reset()
      setTimeout(() => router.push("/user/settings/update-avatar-cover"), 500) // delay redirection
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 rounded-lg md:shadow-md w-[100%] md:w-[50%] lg:w-[45%]">
          <h2 className="text-2xl font-semibold text-blue-500 text-center mb-6">Create Account</h2>

          {/* Full Name */}
          <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name:</FormLabel>
                <FormControl>
                  <Input
                    className='placeholder:text-slate-400'
                    placeholder="Enter your full name..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700 dark:text-red-300" />
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
                    className='placeholder:text-slate-400'
                    placeholder="Choose a username..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700 dark:text-red-300" />
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
                    className='placeholder:text-slate-400'
                    placeholder="Tell us a little about yourself..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700 dark:text-red-300" />
              </FormItem>
            )}
          />

          {/* Password */}
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
                      placeholder="Enter your password"
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
                    {showPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
                <FormMessage className="text-red-700 dark:text-red-300" />
              </FormItem>
            )}
          />

          {/* Success and Error Messages */}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
