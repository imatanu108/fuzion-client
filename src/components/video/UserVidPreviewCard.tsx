"use client";
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { EllipsisVertical, Lock, X } from 'lucide-react';
import { formatDuration, formatNumber, getUploadAge } from '@/lib/helpers';
import { useRouter } from 'next/navigation';
import { Video } from '@/types';
import api from '@/lib/api';
import ToggleSaveVideo from '../playlist/ToggleSaveVideo';

interface UserVidPreviewCardProps {
    video: Video
}

const UserVidPreviewCard: React.FC<UserVidPreviewCardProps> = ({ video }) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showReportMenu, setShowReportMenu] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState('');
    const [reportStatus, setReportStatus] = useState('');
    const [showReportStatus, setShowReportStatus] = useState(false);
    const [ownContent, setOwnContent] = useState(false)
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const [showRemoveModal, setShowRemoveModal] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const isLoggedIn = useMemo(() => !!currentUserData, [currentUserData]);
    const [privateVideo, setPrivateVideo] = useState(false)
    const duration: string = formatDuration(video.duration);
    const views: string = formatNumber(video.views);
    const videoAge: string = getUploadAge(video.createdAt);
    const { _id, thumbnail, title, owner, isPublished } = video

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

    const handleDeleteVideo = async () => {
        setMenuOpen(false)
        setShowRemoveModal(false)
        await api.delete(`/api/v1/videos/${_id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            },
        });

        setIsDeleted(true)
    }


    return (
        <>
            {(!isDeleted && !privateVideo) ?
                (<div className='md:my-4 mx-2'>
                    <div
                        key={_id}
                        className="grid grid-cols-12 gap-2 cursor-pointer"
                    >
                        {/* Thumbnail Section */}
                        <div
                            className="col-span-5 relative flex justify-center items-center w-40 h-auto"
                            onClick={() => router.push(`/video/${_id}`)}
                        >
                            <Image
                                src={thumbnail}
                                alt={title}
                                width={640}
                                height={360}
                                className="object-cover aspect-[16/9] rounded-xl"
                                priority
                            />

                            {/* Duration Overlay */}
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                                {duration}
                            </div>
                        </div>

                        {/* Video Details */}
                        <div
                            className="col-span-6 flex flex-col px-2 ml-3 md:ml-0"
                            onClick={() => router.push(`/video/${_id}`)}
                        >
                            <div className="text-sm font-semibold line-clamp-2">
                                {video.title}
                            </div>
                            <div className="text-xs text-gray-400">
                                {views} views • {videoAge}
                            </div>
                            {!isPublished && (
                                <div>
                                    <Lock
                                        className='opacity-70 mt-2'
                                        style={{ height: '18px', width: '18px' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Options Button */}
                        <div className="col-span-1 relative">
                            <Button
                                size="icon"
                                className="m-0 p-0"
                                onClick={() => handleMenuToggle()}
                            >
                                <EllipsisVertical className="h-5 w-5 text-gray-400" />
                            </Button>
                            {menuOpen && (
                                <div className="absolute right-0 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 transition-transform transform translate-y-2">
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={() => {
                                            setMenuOpen(false)
                                            router.push(`/video/${_id}`)
                                        }}
                                    >
                                        Play video
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                setShowSaveModal(true)
                                                setMenuOpen(false)
                                            } else {
                                                router.push('/user/auth/login')
                                            }
                                        }}
                                    >
                                        Save video
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
                                            onClick={() => {
                                                setMenuOpen(false)
                                                router.push(`/video/edit/${_id}`)
                                            }}
                                        >
                                            Edit video
                                        </button>
                                    )}

                                    {ownContent && (
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            onClick={() => {
                                                setMenuOpen(false)
                                                setShowRemoveModal(true)
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
                                        onClick={() => handleCancelReport()}
                                        className="bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => handleSubmitReport()}
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

                    {showSaveModal && (
                        <ToggleSaveVideo videoId={_id} onDone={() => setShowSaveModal(false)} />
                    )}

                    {showRemoveModal && (
                        <div className="fixed z-10 inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-30">
                            <div className="bg-white flex flex-col justify-center gap-1 m-7 p-5 rounded-xl shadow-md text-[#0b3644]">
                                <div className="font-bold text-xl" >
                                    Delete video?
                                </div>
                                <div className="text-slate-700 text-sm">
                                    Once you delete this video, it will no longer be available to you and other users.
                                </div>
                                <div className="flex mt-3 flex-col gap-2 justify-center items-center">
                                    <Button
                                        variant="outline"
                                        className="w-52 rounded-full text-base font-semibold border-[#0b3644] text-[#0b3644]"
                                        onClick={() => {
                                            setShowRemoveModal(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="w-52 bg-[#104b5f] text-base text-white hover:text-white hover:bg-[#0b3644]
                rounded-full "
                                        onClick={() => handleDeleteVideo()}
                                    >
                                        Delete
                                    </Button>
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

export default UserVidPreviewCard;
