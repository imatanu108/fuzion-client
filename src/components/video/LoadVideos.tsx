"use client";
import React from 'react';
import useLoadVideos from '@/hooks/video/useLoadVideos';
import VideoPreviewCard from './VideoPreviewCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { shuffleElements } from '@/lib/helpers';

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

    const shuffledVideos = shuffleElements(accessibleVideos)

    return (
        <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:mx-2">
            {shuffledVideos.map((video) => {
                return <VideoPreviewCard key={video._id} {...video}/>
            })}
        </div>
    )
}
export default LoadVideos
