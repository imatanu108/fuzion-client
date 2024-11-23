"use client";
import React from 'react';
import useLoadVideos from '@/hooks/video/useLoadVideos';
import VideoPreviewCard from './VideoPreviewCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface LoadVideosProps {
    query?: string
}

const LoadVideos: React.FC<LoadVideosProps> = ({ query = '' }) => {
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const loadedVideos = useLoadVideos(String(query))

    const accessibleVideos  = loadedVideos.filter(
        (video) => video.isPublished || currentUserData?._id === video.owner._id
    );

    if (!accessibleVideos || !accessibleVideos.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No videos found.
            </div>
        )
    }

    return (
        <div>
            {accessibleVideos.map((video) => {
                return <VideoPreviewCard key={video._id} {...video}/>
            })}
        </div>
    )
}
export default LoadVideos
