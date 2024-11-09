"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { EllipsisVertical, Heart, Bookmark, X, } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { formatNumber, getUploadAge } from '@/lib/helpers';
import { Tweet } from '@/types';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface TweetCardProps {
    tweet: Tweet;
    isPreview?: boolean;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, isPreview = true }) => {
    const { _id, owner, content, images, createdAt, isLikedByUser, isSavedByUser } = tweet
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const [shortContent, setShortContent] = useState('')
    const [showShortContent, setShowShortContent] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [likeStatus, setLikeStatus] = useState(isLikedByUser)
    const [saveStatus, setSaveStatus] = useState(isSavedByUser)
    const [likesCount, setLikesCount] = useState(tweet.likesCount)
    const [menuOpen, setMenuOpen] = useState(false);
    const [showReportMenu, setShowReportMenu] = useState(false)
    const [reportStatus, setReportStatus] = useState('')
    const [showReportStatus, setShowReportStatus] = useState(false)
    const [selectedIssue, setSelectedIssue] = useState('');
    const [ownContent, setOwnContent] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const router = useRouter()

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

    useEffect(() => {
        if (currentUserData) setIsLoggedIn(true);
        if (currentUserData?._id === owner._id) setOwnContent(true);
    }, [currentUserData])

    const toggleContent = () => {
        if (isPreview) {
            router.push(`/tweet/${_id}`)
        } else {
            setShowShortContent(prev => !prev)
        }
    }

    const toggleLike = async () => {
        if (!isLoggedIn) {
            router.push('/user/login')
            return
        };

        if (likeStatus) {
            setLikesCount(prev => prev - 1)
        } else {
            setLikesCount(prev => prev + 1)
        }
        setLikeStatus(prev => !prev)

        try {
            await api.post(`/api/v1/likes/toggle/tweet/${_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        } catch (error: any) {
            setLikeStatus(prev => !prev)
            if (likeStatus) {
                setLikesCount(prev => prev + 1)
            } else {
                setLikesCount(prev => prev - 1)
            }

            console.error(error.response?.data?.message || "Something went wrong while liking or disliking the tweet.")
        }
    }

    const toggleSave = async () => {
        if (!isLoggedIn) {
            router.push('/user/login')
            return
        };

        setSaveStatus(prev => !prev)

        try {
            await api.patch(`/api/v1/savedtweets/toggle/${_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log(1)
        } catch (error: any) {
            setSaveStatus(prev => !prev)
            console.error(error.response?.data?.message || "Something went wrong while saving or unsaving the tweet.")
        }

    }

    const handleReport = () => {
        setMenuOpen(false)
        setShowReportMenu(true)
    }


    const handleCancelReport = () => {
        setShowReportMenu(false);
        setSelectedIssue('');  // Reset selected issue
    };

    const handleSubmitReport = async () => {
        try {
            setShowReportMenu(false);
            const response = await api.post(`/api/v1/reports/${_id}`, { issue: selectedIssue }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setSelectedIssue('');
            setReportStatus(response.data.message)
            setShowReportStatus(true)
        } catch (error: any) {
            setReportStatus(error.response?.data?.message || 'Failed to submit report.')
            setShowReportStatus(true)
        }
    };

    useEffect(() => {
        if (content.length > 200) {
            setShortContent(content.slice(0, 200) + '...')
        } else {
            setShortContent(content)
        }
    }, [content])

    const uploadAge = getUploadAge(createdAt)

    let avatar = owner.avatar

    if (owner.avatar === '' && process.env.NEXT_PUBLIC_DEFAULT_USER_AVATAR) {
        avatar = process.env.NEXT_PUBLIC_DEFAULT_USER_AVATAR
    }

    return (
        <>
            {!isDeleted ? (
                <div key={_id} className="flex flex-col p-2 border-b border-[#a5bdc5] dark:border-[#485f67]">
                    <div className='flex items-center justify-between'>
                        <div
                            className='flex justify-start cursor-default'
                            onClick={() => router.push(`/user/${owner.username}`)}
                        >
                            <Image
                                src={avatar}
                                alt={`${owner.username} avatar`}
                                className="rounded-full w-10 h-10 object-cover mr-4"
                                width={40}
                                height={40}
                            />
                            <div className='flex flex-col'>
                                <div className='flex justify-start gap-2'>
                                    <div>{owner.fullName}</div>
                                    <div className="text-slate-500 dark:text-slate-400">@{owner.username}</div>
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-sm">
                                    • {uploadAge}
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <Button
                                size={'icon'}
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                <EllipsisVertical
                                    className='ml-5'
                                    style={{ height: '24px', width: '24px' }}
                                />
                            </Button>
                            {menuOpen && (
                                <div className="absolute right-0 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10">
                                    {!ownContent && <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={handleReport}
                                    >
                                        Report
                                    </button>}
                                    {ownContent && <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={() => {
                                            router.push(`/tweet/edit/${_id}`)
                                        }}
                                    >
                                        Edit
                                    </button>}
                                    <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={toggleSave}
                                    >
                                        {saveStatus ? "Unsave" : "Save"}
                                    </button>
                                    {ownContent && <button
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        onClick={async () => {
                                            await api.delete(`/api/v1/tweets/${_id}`, {
                                                headers: {
                                                    Authorization: `Bearer ${accessToken}`,
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            });

                                            setIsDeleted(true)
                                            if (!isPreview) router.push(`/user/${currentUserData?.username}`);
                                        }}
                                    >
                                        Delete
                                    </button>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className="ml-1 mt-2 cursor-default"
                        onClick={toggleContent}
                    >
                        {showShortContent ? shortContent : content}
                    </div>

                    {images.length ? (
                        <div
                            onClick={() => {
                                if (isPreview) router.push(`/tweet/${_id}`);
                            }}
                            className="mt-2 max-w-screen-md mx-auto">

                            {images.length > 1 ? (
                                <Carousel className="rounded-lg overflow-hidden">
                                    <CarouselContent>
                                        {images.map((src, index) => (
                                            <CarouselItem key={index}>
                                                <Image
                                                    src={src}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-[98%] mx-auto h-auto aspect-[1/1] object-cover rounded-xl"
                                                    width={300}
                                                    height={300}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="absolute left-3 lg:left-8 top-1/2 transform -translate-y-1/2 bg-opacity-30 bg-slate-800 p-2 rounded-full text-opacity-30 lg:text-opacity-70 text-white hover:text-white transition" />
                                    <CarouselNext className="absolute right-3 lg:right-8  top-1/2 transform -translate-y-1/2 bg-opacity-30 bg-slate-800 p-2 rounded-full text-opacity-30 lg:text-opacity-70 hover:text-white text-white transition" />
                                </Carousel>
                            ) : (
                                // If only one image, display it without the carousel
                                <img
                                    src={images[0]}
                                    alt="Single image"
                                    className="w-[96%] mx-auto h-auto aspect-[1/1] object-cover rounded-xl"
                                    width={300}
                                    height={300}
                                />
                            )}
                        </div>
                    ) : <></>}

                    <div className='flex space-x-4 mt-2 items-center justify-between'>
                        <Button
                            size="icon"
                            onClick={toggleLike}
                            className='flex ml-2 gap-1 items-center justify-start'
                        >
                            {likeStatus ? (
                                <Heart className="text-red-500 fill-red-500" style={{ height: '24px', width: '24px' }} />

                            ) : (
                                <Heart className="text-gray-500 dark:text-gray-300" style={{ height: '24px', width: '24px' }} />
                            )}
                            <div
                                className='text-base text-gray-500 dark:text-gray-300'
                            >
                                {formatNumber(likesCount)}
                            </div>
                        </Button>

                        <Button
                            size="icon"
                            onClick={toggleSave}
                        >
                            {saveStatus ? (
                                <Bookmark
                                    className="text-blue-600 fill-blue-600 dark:text-blue-600 dark:fill-blue-600"
                                    style={{ height: '24px', width: '24px' }} />
                            ) : (
                                <Bookmark
                                    className="text-gray-500 dark:text-gray-300"
                                    style={{ height: '24px', width: '24px' }} />
                            )}

                        </Button>
                    </div>

                    {showReportMenu && (
                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-50 z-50">
                            <div className="bg-white dark:bg-[#103c4b] mx-6 p-4 rounded-xl shadow-lg text-[#0b3644] dark:text-gray-200 w-full max-w-sm">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Report Content</h3>

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


                </div>
            ) : (
                <></>
            )}
        </>


    );
};

export default TweetCard;
