"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { Camera, Video } from "lucide-react";

const uploadVideoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    videoFile: z
        .instanceof(File) // Updated to File, not FileList
        .refine(file => file !== null, "Video file is required")
        .refine(
            file => file && file.size <= 200 * 1024 * 1024, // 200 MB limit
            "Video must be smaller than 200 MB"
        )
        .nullable(),
    thumbnail: z
        .instanceof(File)
        .refine(
            file => file === null || file.size <= 5 * 1024 * 1024, // 5 MB limit
            "Thumbnail must be smaller than 5 MB"
        )
        .refine(
            file => file === null || ["image/jpeg", "image/png"].includes(file.type),
            "Thumbnail must be a JPEG or PNG image"
        )
        .nullable()
        ,
});

type UploadVideoFormData = z.infer<typeof uploadVideoSchema>;

const UploadVideo: React.FC = () => {
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null); // Now using File instead of FileList
    const [showCropper, setShowCropper] = useState(false);
    const [croppedThumbnail, setCroppedThumbnail] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const isLoggedIn = useMemo(() => !!currentUserData, [currentUserData]);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Set the flag to true once the component has mounted (client-side rendering)
        setIsClient(true);
    }, []);

    const form = useForm<UploadVideoFormData>({
        resolver: zodResolver(uploadVideoSchema),
        defaultValues: {
            title: "",
            description: "",
            videoFile: null,
            thumbnail: null
        },
    });

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-center">
                <p className="text-lg text-gray-700 dark:text-gray-300">Please log in to upload a video.</p>
                <button
                    onClick={() => router.push("/user/auth/login")}
                    className="mt-4 px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                >
                    Login
                </button>
            </div>
        );
    }

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

        if (isClient) {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("videoFile", data.videoFile); // Changed to use videoFile directly (File)
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
        }
    };

    return (
        <>
            {isClient && (
                <div className="flex flex-col gap-2 p-4 max-w-3xl mx-auto shadow-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">

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

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mb-4 w-full flex items-center justify-center gap-2"
                                            onClick={() => document.getElementById("videoUpload")?.click()}
                                        >
                                            <Video
                                                className="w-5 h-5 text-blue-500"
                                                style={{ height: '24px', width: '24px' }}
                                            />
                                            Upload Video
                                        </Button>

                                        <Input
                                            type="file"
                                            accept="video/*"
                                            id="videoUpload"
                                            className="hidden"
                                            onChange={(e) => {
                                                field.onChange(e.target.files?.[0]); // Use the first file only
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

                            {/* Thumbnail Field */}
                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-gray-800 dark:text-gray-200">Thumbnail</FormLabel>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mb-4 w-full flex items-center gap-2"
                                            onClick={() => document.getElementById("thumbnailUpload")?.click()}
                                        >
                                            <Camera
                                                style={{ height: '24px', width: '24px' }}
                                                className="w-5 h-5 text-blue-500"
                                            />
                                            Upload Thumbnail
                                        </Button>

                                        <Input
                                            type="file"
                                            id="thumbnailUpload"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Upload a thumbnail (recommended 16:9 aspect ratio)</p>

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
            )}
        </>
    );
};

export default UploadVideo;
