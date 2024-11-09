"use client";

import React, { useState } from "react";
import ImageCropper from "../user/ImageCropper";
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

const uploadVideoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    videoFile: z
        .instanceof(FileList)
        .nullable()
        .refine(files => Number(files?.length) > 0, "Video file is required")
        .refine(
            files => files && files[0]?.size <= 200 * 1024 * 1024,
            "Video must be smaller than 200 MB"
        ),
    thumbnail: z
        .instanceof(File)
        .nullable()
        .refine(
            file => file === null || file.size <= 5 * 1024 * 1024, // 5 MB limit
            "Thumbnail must be smaller than 5 MB"
        )
        .refine(
            file => file === null || ["image/jpeg", "image/png"].includes(file.type),
            "Thumbnail must be a JPEG or PNG image"
        ),
});

type UploadVideoFormData = z.infer<typeof uploadVideoSchema>;

const UploadVideo: React.FC = () => {
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [croppedThumbnail, setCroppedThumbnail] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserData);
    const router = useRouter();

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300">Please log in to upload a video.</p>
                <button
                    onClick={() => router.push("/login")}
                    className="mt-4 px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                >
                    Login
                </button>
            </div>
        );
    }

    const form = useForm<UploadVideoFormData>({
        resolver: zodResolver(uploadVideoSchema),
        defaultValues: {
            title: "",
            description: "",
            videoFile: null,
        },
    });

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setShowCropper(true);
        }
    };

    const handleCroppedThumbnail = (croppedImage: File) => {
        setCroppedThumbnail(croppedImage);
        setShowCropper(false);
    };

    const onSubmit = async (data: UploadVideoFormData) => {
        if (!croppedThumbnail) {
            alert("Please crop and save the thumbnail.");
            return;
        }

        if (!data.videoFile) {
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("videoFile", data.videoFile[0]);
        formData.append("thumbnail", croppedThumbnail);

        setIsUploading(true);
        setUploadSuccess(null);

        try {
            await api.post("/api/v1/videos", formData, {
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
            console.error("Error uploading video:", error);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 max-w-3xl mx-auto shadow-lg">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">

                    {/* Title Field */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200">Video Title</FormLabel>
                                <Input
                                    placeholder="Enter video title"
                                    className="input-class p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all"
                                    {...field}
                                />
                                <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Video File Field */}
                    <FormField
                        control={form.control}
                        name="videoFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200">Video File</FormLabel>
                                <Input
                                    type="file"
                                    accept="video/*"
                                    className="input-class rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all"
                                    onChange={(e) => {
                                        field.onChange(e.target.files);
                                        setVideoFile(e.target.files?.[0] || null);
                                    }}
                                />
                                <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Video Preview */}
                    {videoFile && (
                        <div className="mt-1">
                            <video controls width="100%" className="rounded-lg shadow-lg">
                                <source src={URL.createObjectURL(videoFile)} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {/* Thumbnail Field inside Form */}
                    <FormField
                        control={form.control}
                        name="thumbnail"
                        render={() => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200">Thumbnail</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    className="input-class rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Upload a thumbnail (recommended 16:9 aspect ratio)</p>

                                {/* Thumbnail Preview */}

                                <FormMessage className="text-sm text-red-500" />
                            </FormItem>
                        )}
                    />
                    
                    {croppedThumbnail && (
                        <div >
                            <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Thumbnail Preview</label>
                            <img
                                src={URL.createObjectURL(croppedThumbnail)}
                                alt="Thumbnail Preview"
                                className="w-full bg-slate-200 dark:bg-[#1a384b] h-auto aspect-[16/9] object-cover rounded-lg shadow-lg transition-all"
                            />
                        </div>
                    )}
                    {/* Description Field */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200">Description</FormLabel>
                                <textarea
                                    placeholder="Enter video description"
                                    className="input-class p-4 w-full h-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all resize-none"
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
                        {isUploading ? "Uploading..." : "Upload Video"}
                    </Button>

                    {/* Upload Status */}
                    {uploadSuccess !== null && (
                        <div className={`mt-2 mb-5 text-center text-lg font-semibold ${uploadSuccess ? "text-green-500" : "text-red-500"}`}>
                            {uploadSuccess ? "Video uploaded successfully!" : "Upload failed. Please try again."}
                        </div>
                    )}
                </form>
            </Form>

            {showCropper && thumbnail && (
                <ImageCropper
                    file={thumbnail}
                    aspectRatio={16 / 9}
                    onClose={() => setShowCropper(false)}
                    onSubmit={handleCroppedThumbnail}
                />
            )}
        </div>
    );
};

export default UploadVideo;
