"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { EllipsisVertical, X } from 'lucide-react';
import { formatDuration, formatNumber, getUploadAge } from '@/lib/helpers';
import { useParams, useRouter } from 'next/navigation';
import { Video } from '@/types';
import api from '@/lib/api';

interface PlaylistVideoCardProps {
    video: Video
    isPlaylistOwner: boolean
}

const PlaylistVideoCard: React.FC<PlaylistVideoCardProps> = ({ video, isPlaylistOwner }) => {
    console.log({isPlaylistOwner})
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const router = useRouter();
    const { id: playlistId } = useParams()
    const [menuOpen, setMenuOpen] = useState(false);
    const [showReportMenu, setShowReportMenu] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState('');
    const [reportStatus, setReportStatus] = useState('');
    const [showReportStatus, setShowReportStatus] = useState(false);
    const [ownContent, setOwnContent] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const duration: string = formatDuration(video.duration);
    const views: string = formatNumber(video.views);
    const videoAge: string = getUploadAge(video.createdAt);
    const { _id, thumbnail, title, owner, isPublished } = video
    const [privateVideo, setPrivateVideo] = useState(false)

    useEffect(() => {
        if (currentUserData?._id === owner._id) {
            setOwnContent(true);
        } else {
            setOwnContent(false);
        }
    }, [currentUserData, owner._id]);
    
    useEffect(() => {
        if (!isPublished && !ownContent) {
            setPrivateVideo(true);
        } else {
            setPrivateVideo(false);
        }
    }, [isPublished, ownContent]);


    const issueOptions = [
        "Sexual content",
        "Spam or misleading",
        "Hateful or abusive content",
        "Violent content",
        "Copyright violation",
        "Privacy violation",
        "Harmful or dangerous acts",
        "Scams/fraud",
        "Others"
    ];

    const handleMenuToggle = () => {
        setMenuOpen(prev => !prev);
    };

    const handleReport = () => {
        setMenuOpen(false)
        setShowReportMenu(true);
    };

    const handleCancelReport = () => {
        setShowReportMenu(false);
        setSelectedIssue(''); // Reset selected issue
    };

    const handleSubmitReport = async () => {
        try {
            setShowReportMenu(false);
            const response = await api.post(`/api/v1/reports/${_id}`, { issue: selectedIssue }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setSelectedIssue('');
            setReportStatus(response.data.message);
            setShowReportStatus(true);
        } catch (error: any) {
            setReportStatus(error.response?.data?.message || 'Failed to submit report.');
            setShowReportStatus(true);
        }
    };

    const removeVidFromPlaylist = async () => {
        setIsDeleted(true)
        await api.patch(`/api/v1/playlists/remove/${_id}/${playlistId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }


    return (
        <>
            {(!isDeleted && !privateVideo) ?
                (<div className='my-5'>
                    <div
                        key={_id}
                        className="flex items-start space-x-4 cursor-pointer"
                    >
                        {/* Thumbnail Section */}
                        <div
                            className="relative w-40 h-auto"
                            onClick={() => router.push(`/video/${_id}`)}
                        >
                            <Image
                                src={thumbnail}
                                alt={title}
                                width={640}
                                height={360}
                                className="aspect-[16/9] object-cover rounded-xl"
                                unoptimized
                                priority
                            />
                            {/* Duration Overlay */}
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                                {duration}
                            </div>
                        </div>

                        {/* Video Details */}
                        <div
                            className="flex flex-col flex-grow"
                            onClick={() => router.push(`/video/${_id}`)}
                        >
                            <div className="text-sm font-semibold line-clamp-2">
                                {video.title}
                            </div>
                            <div className="text-xs text-gray-400">
                                {views} views • {videoAge}
                            </div>
                        </div>

                        {/* Options Button */}
                        <div className="relative">
                            <Button
                                size="icon"
                                className="self-start"
                                onClick={() => handleMenuToggle()}
                            >
                                <EllipsisVertical className="h-5 w-5 text-gray-400" />
                            </Button>
                            {menuOpen && (
                                <div className="absolute right-0 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 transition-transform transform translate-y-2">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={() => router.push(`/video/${_id}`)}
                                    >
                                        Play video
                                    </button>
                                    {!ownContent && (
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            onClick={() => handleReport()}
                                        >
                                            Report video
                                        </button>
                                    )}

                                    {ownContent && (
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            onClick={() => router.push(`/video/edit/${_id}`)}
                                        >
                                            Edit video
                                        </button>
                                    )}
                                    {isPlaylistOwner && (
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            onClick={() => removeVidFromPlaylist()}
                                        >
                                            Remove from playlist
                                        </button>
                                    )}

                                    {ownContent && (
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            onClick={async () => {
                                                await api.delete(`/api/v1/videos/${_id}`, {
                                                    headers: {
                                                        Authorization: `Bearer ${accessToken}`,
                                                        "Content-Type": "multipart/form-data",
                                                    },
                                                });

                                                setIsDeleted(true)
                                            }}
                                        >
                                            Delete video
                                        </button>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>

                    {showReportMenu && (
                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-50 z-50">
                            <div className="bg-white dark:bg-[#103c4b] mx-6 p-4 rounded-xl shadow-lg text-[#0b3644] dark:text-gray-200 w-full max-w-sm">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Report Video</h3>

                                <label htmlFor="issue" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select an issue:
                                </label>
                                <select
                                    id="issue"
                                    value={selectedIssue}
                                    onChange={(e) => setSelectedIssue(e.target.value)}
                                    className="block w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0c2e39] text-gray-900 dark:text-gray-200 rounded-2xl focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" disabled>Select an issue</option>
                                    {issueOptions.map((issue) => (
                                        <option key={issue} value={issue}>{issue}</option>
                                    ))}
                                </select>

                                <div className="flex justify-end gap-3 mt-4">
                                    <Button
                                        onClick={handleCancelReport}
                                        className="bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmitReport}
                                        disabled={!selectedIssue}
                                        className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-full"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showReportStatus && (
                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-50 z-50">
                            <div className="bg-white dark:bg-[#103c4b] mx-6 p-6 rounded-xl shadow-lg text-[#0b3644] dark:text-gray-200 w-full max-w-sm relative">
                                <button
                                    onClick={() => setShowReportStatus(false)}
                                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none"
                                >
                                    <X style={{ height: '24px', width: '24px' }} />
                                </button>

                                <div className="text-center">
                                    <p className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                        Report Status
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {reportStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>) :
                (
                    <></>
                )}
        </>

    )
}

export default PlaylistVideoCard;
