"use client";

import UserPlaylists from "@/components/playlist/UserPlaylists";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserPlaylistsPage() {
  const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (currentUserData?._id) setIsLoggedIn(true);
  })

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
    <div className="py-2">
      <UserPlaylists userId={String(currentUserData?._id)} />
    </div>
  );
}