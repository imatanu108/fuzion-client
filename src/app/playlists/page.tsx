"use client";

import UserPlaylists from "@/components/playlist/UserPlaylists";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserPlaylistsPage() {
  const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (currentUserData?._id) setIsLoggedIn(true);
  }, [currentUserData?._id])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="text-lg font-semibold mb-4">Please login to view your playlists.</p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="pl-4 flex items-center justify-between border-b border-[#46626f7a] pb-2 mb-4">
        <h1 className="text-xl font-semibold">Playlists</h1>
        <Button
          onClick={() => router.push("/playlists/new")}
          className="flex justify-center items-center text-base rounded-full hover:bg-slate-300 hover:dark:bg-slate-700 mr-2"
        >
          <CirclePlus
            style={{ height: '24px', width: '24px' }}
          />
          <span>
            New Playlist
          </span>
        </Button>
      </div>
      <UserPlaylists userId={String(currentUserData?._id)} />
    </>
  );
}
