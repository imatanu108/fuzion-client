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
            <div className='pb-[30%] md:pb-[10%] space-y-5'>
                {userPlaylists.map((playlist) => {
                    return <PlaylistCard key={playlist._id} playlist={playlist} />
                })}
            </div>
        </>
    )
}

export default UserPlaylists;
