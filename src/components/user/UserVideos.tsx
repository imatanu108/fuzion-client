"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import useUserVideos from '@/hooks/user/useUserVideos';
import UserVidPreviewCard from '../video/UserVidPreviewCard';

const UserVideos: React.FC = () => {
    const { usernameOrId } = useParams();
    const userVideos = useUserVideos(String(usernameOrId));

    if (!userVideos || !userVideos.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No videos found.
            </div>
        );
    }

    return (
        <div className="pb-[30%] md:pb-[10%] space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:mx-1">
            {userVideos.map((video) => {
                return <UserVidPreviewCard key={video._id} video={video}/>
            })}
        </div>
    );
};

export default UserVideos;
