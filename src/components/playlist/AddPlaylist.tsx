
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface PlaylistFormData {
  name: string;
  description: string;
  isPublic: boolean;
}

const AddPlaylist: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlaylistFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState<boolean | null>(null);
  const isLoggedIn = useMemo(() => !!currentUserData, [currentUserData]);

  const onSubmit = async (data: PlaylistFormData) => {
    setIsSubmitting(true);
    setCreationSuccess(null);

    try {
      await api.post("/api/v1/playlists", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCreationSuccess(true);
      reset();
      router.push("/playlists");
    } catch (error) {
      console.error("Error creating playlist:", error);
      setCreationSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
        <div className="flex flex-col mt-[10%] items-center text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">Please log in to create a playlist.</p>
            <button
                onClick={() => router.push("/user/auth/login")}
                className="mt-4 px-10 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600"
            >
                Login
            </button>
        </div>
    );
}

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Create New Playlist</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <label className="font-semibold text-gray-800 dark:text-gray-200">
          Playlist Name
        </label>
        <Input
          {...register("name", { required: "Name is required" })}
          placeholder="Enter playlist name"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b]"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

        <label className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
          Description
        </label>
        <Textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Enter description"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b]"
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isPublic")} defaultChecked className="h-4 w-4" />
          <label className="text-gray-800 dark:text-gray-200">Make playlist public</label>
        </div>

        <Button
          type="submit"
          className={`${isSubmitting ? "bg-gray-500 cursor-wait" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg py-2`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Playlist"}
        </Button>

        {creationSuccess !== null && (
          <p className={`text-sm ${creationSuccess ? "text-green-500" : "text-red-500"}`}>
            {creationSuccess ? "Playlist created successfully!" : "Failed to create playlist."}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddPlaylist;
