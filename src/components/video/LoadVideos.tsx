"use client";
import React from 'react';
import useLoadVideos from '@/hooks/video/useLoadVideos';
import VideoPreviewCard from './VideoPreviewCard';

interface LoadVideosProps {
    query?: string
}

const LoadVideos: React.FC<LoadVideosProps> = ({ query = '' }) => {
    const loadedVideos = useLoadVideos(String(query))

    if (!loadedVideos || !loadedVideos.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No videos found.
            </div>
        )
    }

    return (
        <div>
            {loadedVideos.map((video) => {
                return <VideoPreviewCard key={video._id} {...video}/>
            })}
        </div>
    )
}
export default LoadVideos
