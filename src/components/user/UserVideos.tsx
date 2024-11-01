"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import useUserVideos from '@/hooks/user/useUserVideos';
import Image from 'next/image';
import { formatDuration, formatNumber, getUploadAge } from '@/lib/helpers';
import { EllipsisVertical } from 'lucide-react';

const UserVideos: React.FC = () => {
    const { username } = useParams();
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const router = useRouter();
    const userVideos = useUserVideos(String(username))

    if (!userVideos || !userVideos.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No videos found.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {userVideos.map((video) => {
                const duration: string = formatDuration(video.duration)
                const views: string = formatNumber(video.views)
                const videoAge: string = getUploadAge(video.createdAt)

                return (
                    <div
                        key={video._id}
                        className="flex items-start space-x-4 cursor-pointer"

                    >
                        {/* Thumbnail Section */}
                        <div
                            className="relative w-40 h-auto"
                            onClick={() => router.push(`/video/${video._id}`)}
                        >
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                width={200}
                                height={200}
                                className=" aspect-[16/9] object-cover rounded-md"
                            />
                            {/* Duration Overlay */}
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                                {duration}
                            </div>
                        </div>

                        {/* Video Details */}
                        <div
                            className="flex flex-col flex-grow"
                            onClick={() => router.push(`/video/${video._id}`)}
                        >
                            <div className="text-sm font-semibold text-white line-clamp-2">
                                {video.title}
                            </div>
                            <div className="text-xs text-gray-400">
                                {views} views • {videoAge}
                            </div>
                        </div>

                        {/* Options Button */}
                        <Button size="icon" className="self-start">
                            <EllipsisVertical className="h-5 w-5 text-gray-400" />
                        </Button>
                    </div>
                )
            })}
        </div>
    )
};

export default UserVideos;
