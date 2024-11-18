"use client";

import React from 'react';
import useUserPlaylists from '@/hooks/playlist/useUserPlaylists';
import PlaylistCard from './PlaylistCard';

interface UserPlaylistsProps {
    userId: string
}

const UserPlaylists: React.FC<UserPlaylistsProps> = ({ userId }) => {
    const userPlaylists = useUserPlaylists(userId)
    if (!userPlaylists.length) {
        return (
            <div className="flex items-center justify-center min-h-[200px] rounded-lg shadow-md p-4 text-center">
                No playlists found.
            </div>
        )
    }

    return (
        <>
            {userPlaylists.map((playlist) => {
                return <PlaylistCard key={playlist._id} playlist={playlist} />
            })}
        </>
    )
}

export default UserPlaylists;
