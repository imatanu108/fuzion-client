"use client";

import React, { useState } from "react";
import ImageCropper from "./ImageCropper";
import { Trash, Camera } from "lucide-react"; // Added Trash icon from lucide-react
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { CurrentUserData } from "@/types";
import { useDispatch } from "react-redux";
import { setCurrentUserData } from "@/features/userSlice";
import { Button } from "../ui/button";
import { AppDispatch, RootState } from "@/store/store";

const ImageUpload: React.FC = () => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showCoverCropper, setShowCoverCropper] = useState(false);
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [userCoverImage, setUserCoverImage] = useState<string | undefined>(undefined);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [showRemoveModal, setShowRemoveModal] = useState<"avatar" | "cover" | null>(null); // Modal state
  const dispatch = useDispatch<AppDispatch>()
  const currentUserData: CurrentUserData | null = useSelector((state: RootState) => state.user.currentUserData);
  const defaultUserAvatar = process.env.NEXT_PUBLIC_DEFAULT_USER_AVATAR;
  const defaultUserCoverImage = process.env.NEXT_PUBLIC_DEFAULT_USER_COVER_IMAGE;
  const accessToken = useSelector((state: RootState) => state.user.accessToken)

  // Initialize user images from currentUserData
  React.useEffect(() => {
    setUserAvatar(currentUserData?.avatar || defaultUserAvatar);
    setUserCoverImage(currentUserData?.coverImage || defaultUserCoverImage);
  }, [currentUserData, defaultUserAvatar, defaultUserCoverImage]);

  // Handlers for image uploads
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setShowCoverCropper(true); // Open the cropper
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setShowAvatarCropper(true); // Open the cropper
    }
  };

  const handleCroppedImage = async (croppedImage: File, type: "cover" | "avatar") => {

    if (!accessToken) {
      console.error("Unauthorize request.")
      return
    }

    if (type === "cover") {
      setCoverImage(croppedImage);
      setShowCoverCropper(false); // Close the cropper

      try {
        const formData = new FormData();
        formData.append("coverImage", croppedImage); // Append the cropped image to FormData

        const response = await api.patch("/api/v1/users/update-cover", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the appropriate header for FormData
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const updatedUserData: CurrentUserData = response.data.data
        dispatch(setCurrentUserData(updatedUserData))
        const updatedCoverImage = response.data.data.coverImage;
        setUserCoverImage(updatedCoverImage);

      } catch (error) {
        console.error("Error updating cover image:", error);
      }

    } else {
      setAvatar(croppedImage);
      setShowAvatarCropper(false); // Close the cropper

      try {
        const formData = new FormData();
        formData.append("avatar", croppedImage); // Append the cropped image to FormData

        const response = await api.patch("/api/v1/users/update-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the appropriate header for FormData
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const updatedUserData: CurrentUserData = response.data.data
        dispatch(setCurrentUserData(updatedUserData))
        const updatedAvatar = response.data.data.avatar;
        setUserAvatar(updatedAvatar);

      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    }
  };

  const handleRemoveImage = async (item: "cover" | "avatar") => {
    if (!accessToken) {
      console.error("Unauthorize request.")
      return
    }

    if (item === "cover") {
      try {
        const response = await api.delete("/api/v1/users/remove-cover", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const updatedUserData: CurrentUserData = response.data.data
        dispatch(setCurrentUserData(updatedUserData))
        setUserCoverImage(defaultUserCoverImage)
      } catch (error) {
        console.error("Error removing cover image:", error);
      }
    } else {
      try {
        const response = await api.delete("/api/v1/users/remove-avatar", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const updatedUserData: CurrentUserData = response.data.data
        dispatch(setCurrentUserData(updatedUserData))
        setUserAvatar(defaultUserAvatar)
      } catch (error) {
        console.error("Error removing avatar:", error);
      }
    }
  }

  return (
    <div className='flex flex-col gap-2'>

      {/* Cover Image Upload */}
      <div className="relative">
        <img
          src={userCoverImage}
          alt="Cover Image"
          className="aspect-[4/1] w-full object-cover"
        />
        <button
          className="absolute inset-0 flex items-center justify-center bg-[#0c2d3e] bg-opacity-30"
          onClick={() => document.getElementById("coverUpload")?.click()}
        >
          <Camera className="w-6 h-6 text-slate-300" />
        </button>
        <button
          className="absolute top-2 right-2 p-2 bg-slate-50 rounded-full"
          onClick={() => setShowRemoveModal("cover")} // Trigger remove modal
        >
          <Trash className="w-5 h-5 text-[#0c2d3e]" />
        </button>
        <input
          type="file"
          id="coverUpload"
          accept="image/*"
          className="hidden"
          onChange={handleCoverImageUpload}
        />
      </div>

      {/* Avatar Image Upload */}
      <div className="relative flex items-center justify-center">
        <img
          src={userAvatar}
          alt="Avatar"
          className="h-24 w-24 rounded-full object-cover"
        />
        <button
          className="absolute left-0 right-0 mx-auto inset-0 flex items-center justify-center bg-[#0c2d3e] bg-opacity-30"
          onClick={() => document.getElementById("avatarUpload")?.click()}
        >
          <Camera className="w-6 h-6 text-slate-300" />
        </button>
        <button
          className="absolute top-2 right-2 p-2 bg-slate-50 rounded-full"
          onClick={() => setShowRemoveModal("avatar")} // Trigger remove modal
        >
          <Trash className="w-5 h-5 text-[#0c2d3e]" />
        </button>
        <input
          type="file"
          id="avatarUpload"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
      </div>

      {/* Conditionally render Image Cropper for Cover Image */}
      {showCoverCropper && coverImage && (
        <ImageCropper
          file={coverImage}
          aspectRatio={4 / 1}
          onClose={() => {
            setShowCoverCropper(false);
            setCoverImage(null);
          }}
          onSubmit={(croppedImage) => handleCroppedImage(croppedImage, "cover")}
        />
      )}

      {/* Conditionally render Image Cropper for Avatar Image */}
      {showAvatarCropper && avatar && (
        <ImageCropper
          file={avatar}
          aspectRatio={1 / 1}
          onClose={() => {
            setShowAvatarCropper(false);
            setAvatar(null);
          }}
          onSubmit={(croppedImage) => handleCroppedImage(croppedImage, "avatar")}
        />
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-30 z-50">
          <div className="bg-white flex flex-col justify-center gap-1 m-7 p-5 rounded-xl shadow-md text-[#0b3644]">
            <div className="font-bold text-xl" >
              Remove {showRemoveModal === "cover" ? "cover image" : "avatar"}?
            </div>
            <div className="text-slate-700 text-sm">
              Once you remove your {showRemoveModal === "cover" ? "cover image" : "avatar"}, it will no longer be visible to other users.
            </div>
            <div className="flex mt-3 flex-col gap-2 justify-center items-center">
              <Button
                variant="outline"
                className="w-52 rounded-full text-base font-semibold border-[#0b3644] text-[#0b3644]"
                onClick={() => {
                  setShowRemoveModal(null)
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-52 bg-[#104b5f] text-base text-white hover:text-white hover:bg-[#0b3644]
                rounded-full "
                onClick={() => {
                  if (showRemoveModal === "cover") handleRemoveImage("cover");
                  if (showRemoveModal === "avatar") handleRemoveImage("avatar");
                  setShowRemoveModal(null);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )
      }
    </div>
  );
};

export default ImageUpload;

