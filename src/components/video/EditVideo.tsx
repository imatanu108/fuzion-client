"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useVideo from "@/hooks/video/useVideo";
import { Input } from "@/components/ui/input";
import ImageCropper from "../user/ImageCropper";
import { Camera } from "lucide-react";

const EditVideo: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
    const isLoggedIn = useMemo(() => !!currentUserData, [currentUserData]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [croppedThumbnail, setCroppedThumbnail] = useState<File | null>(null);
    const [isPublished, setIsPublished] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const router = useRouter();
    const { id } = useParams();
    const video = useVideo(String(id));

    const previewThumbnail = croppedThumbnail ? URL.createObjectURL(croppedThumbnail) : video?.thumbnail;

    useEffect(() => {
        if (video) {
            setTitle(video.title);
            setDescription(video.description);
            setIsPublished(video.isPublished);
            if (currentUserData?.username === video.owner.username) {
                setIsAdmin(true);
            }
        }
    }, [video, currentUserData]);

    if (!video) return <div>No video found.</div>;
    if (!isLoggedIn || !isAdmin) return <div>Unauthorized request.</div>;

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (croppedThumbnail) formData.append("thumbnail", croppedThumbnail);

        setIsUpdating(true);
        setUpdateSuccess(null);

        try {
            await api.patch(`/api/v1/videos/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setIsUpdating(false);
            setUpdateSuccess(true);
            router.push(`/user/${currentUserData?.username}`);
        } catch (error) {
            setIsUpdating(false);
            setUpdateSuccess(false);
            console.error("Error uploading video:", error);
        }
    };

    const togglePublishStatus = async () => {
        try {
            await api.patch(`/api/v1/videos/toggle/publish/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsPublished(prev => !prev);
        } catch (error) {
            console.error("Error toggling publish status:", error);
        }
    };

    const onCancel = () => {
        router.push(`/user/${currentUserData?.username}`);
    };

    return (
        <div className="flex flex-col gap-2 p-4 max-w-3xl mx-auto shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Video Title</label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-class p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Toggle Publish Status Button */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {isPublished ? "Published" : "Unpublished"}
                    </span>
                    <Button
                        onClick={togglePublishStatus}
                        className={`px-4 py-2 rounded-lg ${isPublished ? "bg-red-500" : "bg-green-500"} text-white transition-all`}
                    >
                        {isPublished ? "Unpublish" : "Publish"}
                    </Button>
                </div>

                {/* Thumbnail Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Thumbnail</label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mb-4 flex items-center gap-2"
                        onClick={() => document.getElementById("thumbnailUpload")?.click()}
                    >
                        <Camera 
                        className="w-5 h-5 text-blue-500" 
                        style={{ height: '24px', width: '24px' }}
                        />
                        Update Thumbnail
                    </Button>
                    <input
                        type="file"
                        id="thumbnailUpload"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update the thumbnail (recommended 16:9 aspect ratio)</p>
                </div>

                <div>
                    <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Thumbnail Preview</label>
                    <img
                        src={previewThumbnail}
                        alt="Thumbnail Preview"
                        className="w-full bg-slate-200 dark:bg-[#1a384b] h-auto aspect-[16/9] object-cover rounded-lg shadow-lg transition-all"
                    />
                </div>

                {/* Description Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-class p-2 w-full h-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className={`${isUpdating ? "bg-gray-500 cursor-wait" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"} text-white rounded-lg py-3 transition-all`}
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Update Video"}
                </Button>

                {updateSuccess !== null && (
                    <div className={`text-sm mt-2 ${updateSuccess ? "text-green-500" : "text-red-500"}`}>
                        {updateSuccess ? "Video updated successfully!" : "Failed to update video."}
                    </div>
                )}
            </form>

            {/* Thumbnail Cropper Modal */}
            {showCropper && thumbnail && (
                <ImageCropper
                    file={thumbnail}
                    aspectRatio={16 / 9}
                    onSubmit={handleCroppedThumbnail}
                    onClose={() => setShowCropper(false)}
                />
            )}

            {/* Cancel Button */}
            <Button
                onClick={onCancel}
                variant="outline"
                className="mt-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1a384b] rounded-lg transition-all"
            >
                Cancel
            </Button>
        </div>
    );
};

export default EditVideo;
