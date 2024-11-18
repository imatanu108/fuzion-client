"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import api from "@/lib/api";
import { Playlist } from "@/types";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RootState } from "@/store/store";
import { LockKeyhole } from 'lucide-react';

interface ToggleVideoFromPlaylistProps {
    playlist: Playlist;
    videoId: string;
}

const ToggleVideoFromPlaylist: React.FC<ToggleVideoFromPlaylistProps> = ({ playlist, videoId }) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const { _id, name, videos } = playlist
    const [videoInPlaylist, setVideoInPlaylist] = useState(false)

    useEffect(() => {
        setVideoInPlaylist(videos.some((video) => video._id === videoId));
    }, [videos, videoId]);

    const toggleSelection = async () => {
        try {
            setVideoInPlaylist(!videoInPlaylist);
            if (videoInPlaylist) {
                await api.patch(`/api/v1/playlists/remove/${videoId}/${_id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            } else {
                await api.patch(`/api/v1/playlists/add/${videoId}/${_id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
            }
            // Toggle the state after successful API call

        } catch (error) {
            setVideoInPlaylist(!videoInPlaylist);
            console.error("Failed to toggle video in playlist:", error);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Checkbox
                        className="border-2"
                        style={{ height: '20px', width: '20px' }}
                        id={`playlist-${_id}`}
                        checked={videoInPlaylist}
                        onCheckedChange={toggleSelection}
                    />
                    <Label htmlFor={`playlist-${_id}`}>{name}</Label>
                </div>
                <div>
                    {!playlist.isPublic && (
                        <LockKeyhole
                        className="opacity-70"
                            style={{ height: '20px', width: '20px' }}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default ToggleVideoFromPlaylist;
