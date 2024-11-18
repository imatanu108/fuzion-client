"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import api from "@/lib/api";
import { RootState } from "@/store/store";
import useUserPlaylists from "@/hooks/playlist/useUserPlaylists";
import { Plus } from 'lucide-react';
import { useRouter } from "next/navigation";
import ToggleVideoFromPlaylist from "./ToggleVideoFromPlaylist";
import { Button } from "../ui/button";

interface ToggleSaveVideoProps {
    videoId: string;
    onDone: () => void;
}

const ToggleSaveVideo: React.FC<ToggleSaveVideoProps> = ({ videoId, onDone }) => {
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const userPlaylists = useUserPlaylists(String(currentUserData?._id))
    const router = useRouter()

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-50 z-50">
                <div className="bg-white dark:bg-[#103c4b] mx-6 p-4 rounded-xl shadow-lg text-[#0b3644] dark:text-gray-200 w-full max-w-sm space-y-3">
                    <div
                        className="flex gap-4 items-center cursor-pointer "
                        onClick={() => router.push('/playlists/new')}
                    >
                        <Plus 
                        className="border-2 border-slate-800 dark:border-slate-200" 
                        style={{ height: '20px', width: '20px' }}
                        />
                        <span className="text-sm">New playlist</span>
                    </div>

                    {userPlaylists.map((playlist) => {
                        return <ToggleVideoFromPlaylist key={playlist._id} playlist={playlist} videoId={videoId} />
                    })}

                    <div>
                        <Button
                            className="rounded-full w-full text-base bg-blue-500 text-slate-100"
                            onClick={() => onDone()}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ToggleSaveVideo;
