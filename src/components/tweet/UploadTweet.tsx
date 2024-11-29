"use client";

import React, { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Camera, XCircle } from "lucide-react"; // Import Lucide icons

const uploadTweetSchema = z.object({
    content: z.string(),
    images: z
        .array(z.instanceof(File))
        .max(10, "You can upload a maximum of 10 images.")
        .refine(
            (files) => files.every((file) => file.size <= 5 * 1024 * 1024), // 5 MB limit per image
            "Each image must be smaller than 5 MB"
        )
        .refine(
            (files) => files.every((file) => ["image/jpeg", "image/png"].includes(file.type)),
            "Images must be in JPEG or PNG format"
        ),
});

type UploadTweetFormData = z.infer<typeof uploadTweetSchema>;

const UploadTweet: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // to store image previews
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const isLoggedIn = useMemo(() => !!currentUserData, [currentUserData]);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const form = useForm<UploadTweetFormData>({
        resolver: zodResolver(uploadTweetSchema),
        defaultValues: {
            content: "",
            images: [],
        },
    });

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300">Please log in to upload a tweet.</p>
                <button
                    onClick={() => router.push("/login")}
                    className="mt-4 px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                >
                    Login
                </button>
            </div>
        );
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Update the preview state by appending new images
            setImagePreviews((prevPreviews) => [
                ...prevPreviews,
                ...newFiles.map((file) => URL.createObjectURL(file)),
            ]);
            // Update the form state by appending new files to existing ones
            form.setValue("images", [...form.getValues("images"), ...newFiles]);
        }
    };
    const handleRemoveImage = (index: number) => {
        const updatedFiles = [...form.getValues("images")];
        updatedFiles.splice(index, 1);
        setImagePreviews(updatedFiles.map((file) => URL.createObjectURL(file))); // update preview
        form.setValue("images", updatedFiles);
    };

    const onSubmit = async (data: UploadTweetFormData) => {
        if (!data.content && data.images.length === 0) {
            return;
        }

        if (isClient) {
            const formData = new FormData();
            if (data.content) formData.append("content", data.content);
            data.images.forEach((file) => formData.append("images", file));

            setIsUploading(true);
            setUploadSuccess(null);

            try {
                await api.post("/api/v1/tweets", formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setIsUploading(false);
                setUploadSuccess(true);
                router.push(`/user/${currentUserData?.username}`);
            } catch (error) {
                setIsUploading(false);
                setUploadSuccess(false);
                console.error("Error uploading tweet:", error);
            }
        }
    };

    return (
        <>
            {isClient && (
                <div className="flex flex-col gap-2 p-4 max-w-3xl mx-auto shadow-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                            {/* Thumbnail Field inside Form */}
                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200">Images</FormLabel>

                                        {/* Add Image Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mb-4 w-full flex items-center gap-2"
                                            onClick={() => document.getElementById("imageUpload")?.click()}
                                        >
                                            <Camera
                                                className="w-5 h-5 text-blue-500"
                                                style={{ height: '24px', width: '24px' }}
                                            />
                                            Add Images
                                        </Button>

                                        {/* Hidden Input */}
                                        <Input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                        <FormMessage className="text-sm text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="flex gap-4 justify-left flex-wrap">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`preview-${index}`}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                            {/* Remove Image Button */}
                                            <Button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-0 right-0 w-8 h-8 text-slate-200 rounded-full flex items-center justify-center"
                                            >
                                                <XCircle style={{ height: '24px', width: '24px' }} />
                                            </Button>

                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Description Field */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200">Description</FormLabel>
                                        <textarea
                                            placeholder="Write your thoughts"
                                            className="input-class p-2 w-full h-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                            {...field}
                                        />
                                        <FormMessage className="text-sm text-red-500" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className={`${isUploading ? "bg-gray-500 cursor-wait" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"} text-white rounded-lg py-3 transition-all`}
                                disabled={isUploading}
                            >
                                {isUploading ? "Uploading..." : "Upload Tweet"}
                            </Button>

                            {/* Upload Status */}
                            {uploadSuccess !== null && (
                                <div className={`mt-2 mb-5 text-center text-base font-semibold ${uploadSuccess ? "text-green-500" : "text-red-500"}`}>
                                    {uploadSuccess ? "Tweet uploaded successfully!" : "Upload failed. Please try again."}
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
            )}
        </>
    );
};

export default UploadTweet;
