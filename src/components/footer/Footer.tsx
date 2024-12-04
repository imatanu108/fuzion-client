"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Home,
  CirclePlus,
  CircleUserRound,
  Search,
  Video,
  X,
  ListVideo,
  Feather,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isActive = (path: string) => pathname === path;

  const getUserProfile = () => {
    if (!currentUserData) {
      router.push("/user/auth/login");
    } else {
      router.push(`/user/${currentUserData.username}`);
    }
  };

  const getButtonClasses = (path: string) =>
    isActive(path)
      ? "text-blue-600 dark:text-blue-400"
      : "text-slate-700 dark:text-slate-200";

  return (
    <>
      <footer className="fixed bottom-0 w-full py-1 px-2 lg:hidden lg:w-[65.9%] lg:px-4 z-40 flex justify-between items-center bg-gray-100 dark:bg-[#0e1f2a] bg-opacity-40 dark:bg-opacity-60 backdrop-blur-lg dark:backdrop-blur-lg rounded-md shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.01),0_-2px_4px_-1px_rgba(0,0,0,0.06)]">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Home"
          onClick={() => router.push("/")}
          className={getButtonClasses("/")}
        >
          <Home style={{ height: "24px", width: "24px" }} />
          <span className="sr-only">Home</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Tweets"
          onClick={() => router.push("/tweet")}
          className={getButtonClasses("/tweet")}
        >
          <Feather style={{ height: "24px", width: "24px" }} />
          <span className="sr-only">Tweets</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Upload"
          onClick={() => setShowUploadModal(true)}
          className="text-slate-700 dark:text-slate-200"
        >
          <CirclePlus style={{ height: "24px", width: "24px" }} />
          <span className="sr-only">Upload</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          onClick={() => router.push("/search")}
          className={getButtonClasses("/search")}
        >
          <Search style={{ height: "24px", width: "24px" }} />
          <span className="sr-only">Search</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Profile"
          onClick={() => getUserProfile()}
          className={getButtonClasses(`/user/${currentUserData?.username}`)}
        >
          <CircleUserRound style={{ height: "24px", width: "24px" }} />
          <span className="sr-only">Profile</span>
        </Button>
      </footer>
      {showUploadModal && (
        <div
          className="fixed z-50 inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-30"
          onClick={() => setShowUploadModal(false)}
        >
          <div className="bg-slate-50 dark:bg-[#225a6d] flex flex-col justify-center m-4 w-[80%] md:w-[50%] lg:w-[30%] p-6 rounded-xl shadow-md text-[#0b3644] dark:text-slate-100">
            <div className="flex flex-col gap-4 justify-center items-center">
              <Button
                variant="outline"
                className="w-full rounded-full text-base dark:bg-[#134454] border-blue-600 dark:border-blue-400"
                onClick={() => {
                  setShowUploadModal(false);
                  router.push("/video/upload/new");
                }}
              >
                <Video
                  className="text-blue-600 dark:text-blue-400"
                  style={{ height: "24px", width: "24px" }}
                />
                <span>Upload a video</span>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full text-base dark:bg-[#134454] border-blue-600 dark:border-blue-400"
                onClick={() => {
                  setShowUploadModal(false);
                  router.push("/tweet/upload/new");
                }}
              >
                <Feather
                  className="text-blue-600 dark:text-blue-400"
                  style={{ height: "24px", width: "24px" }}
                />
                <span>Upload a tweet</span>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full text-base dark:bg-[#134454] border-blue-600 dark:border-blue-400"
                onClick={() => {
                  setShowUploadModal(false);
                  router.push("/playlists/new");
                }}
              >
                <ListVideo
                  className="text-blue-600 dark:text-blue-400"
                  style={{ height: "24px", width: "24px" }}
                />
                <span>Create a playlist</span>
              </Button>
              <Button
                variant="default"
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-base border-blue-600 dark:border-blue-400 text-slate-100"
                onClick={() => setShowUploadModal(false)}
              >
                <X style={{ height: "24px", width: "24px" }} />
                <span>Cancel upload</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
