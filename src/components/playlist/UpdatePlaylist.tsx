"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import usePlaylist from "@/hooks/playlist/usePlaylist";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface UpdatePlaylistFormData {
    name: string;
    description: string;
    isPublic: boolean;
}

const UpdatePlaylist: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const { playlistId } = useParams();
    const playlist = usePlaylist(String(playlistId));
    const router = useRouter();

    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<UpdatePlaylistFormData>({
        defaultValues: {
            name: playlist?.name || "",
            description: playlist?.description || "",
            isPublic: playlist?.isPublic || false,
        },
    });

    // Update default values when the playlist is fetched
    React.useEffect(() => {
        if (playlist) {
            reset({
                name: playlist.name,
                description: playlist.description,
                isPublic: playlist.isPublic,
            });
        }
    }, [playlist, reset]);

    const onSubmit = async (data: UpdatePlaylistFormData) => {
        setIsUpdating(true);
        setUpdateSuccess(null);

        try {
            await api.patch(`/api/v1/playlists/${playlistId}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setIsUpdating(false);
            setUpdateSuccess(true);
            router.push(`/playlists/${playlistId}`);
        } catch (error: any) {
            console.error(error.response?.data?.message || "Failed to update playlist.");
            setIsUpdating(false);
            setUpdateSuccess(false);
        }
    };

    if (!playlist) return <div>Loading playlist...</div>;

    return (
        <div className="max-w-3xl mx-auto p-4 shadow-md bg-white dark:bg-gray-800 rounded-lg">
            <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Update Playlist</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Playlist Name
                    </label>
                    <Input
                        id="name"
                        placeholder="Enter playlist name"
                        {...register("name", { required: "Playlist name is required" })}
                        className="mt-1"
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Description
                    </label>
                    <textarea
                        id="description"
                        placeholder="Enter description (optional)"
                        {...register("description")}
                        className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 focus:outline-none"
                    />
                </div>

                {/* Public Switch */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Make Public</span>
                    <button
                        type="button"
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${watch("isPublic") ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        onClick={() => setValue("isPublic", !watch("isPublic"))} // Toggle the value
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${watch("isPublic") ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isUpdating}
                    className={`mt-4 ${isUpdating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                >
                    {isUpdating ? "Updating..." : "Update Playlist"}
                </Button>

                {updateSuccess !== null && (
                    <p className={`mt-2 text-sm ${updateSuccess ? "text-green-600" : "text-red-600"}`}>
                        {updateSuccess
                            ? "Playlist updated successfully!"
                            : "Failed to update playlist. Please try again."}
                    </p>
                )}
            </form>
        </div>
    );
};

export default UpdatePlaylist;
