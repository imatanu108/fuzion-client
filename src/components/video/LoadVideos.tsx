"use client";
import React from 'react';
import useLoadVideo from '@/hooks/video/useLoadVideos';
import VideoPreviewCard from './VideoPreviewCard';

interface LoadVideosProps {
    query?: string
}

const LoadVideos: React.FC<LoadVideosProps> = ({ query = '' }) => {
    const loadedVideos = useLoadVideo(String(query))

    if (!loadedVideos || !loadedVideos.length) {
        return (
            <div>No videos found.</div>
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