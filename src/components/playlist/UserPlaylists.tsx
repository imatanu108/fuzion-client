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
            <div className="text-center text-gray-500 p-4">
                No playlists found.
            </div>
        )
    }

    return (
        <>
            <div className="pl-4 flex items-center justify-between border-b border-[#46626f7a] pb-2 mb-4">
                <h1 className="text-xl font-semibold">Playlists</h1>
            </div>
            <div className='space-y-5'>
                {userPlaylists.map((playlist) => {
                    return <PlaylistCard key={playlist._id} playlist={playlist} />
                })}
            </div>
        </>
    )
}

export default UserPlaylists;
