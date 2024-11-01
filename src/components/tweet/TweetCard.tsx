"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { EllipsisVertical, Heart, Bookmark, } from 'lucide-react';
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

const TweetCard: React.FC<Tweet> = (tweet: Tweet) => {
    const { _id, owner, content, images, createdAt, isLikedByUser, isSavedByUser } = tweet
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const [shortContent, setShortContent] = useState('')
    const [showShortContent, setShowShortContent] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [likeStatus, setLikeStatus] = useState(isLikedByUser)
    const [saveStatus, setSaveStatus] = useState(isSavedByUser)
    const [likesCount, setLikesCount] = useState(tweet.likesCount)
    const router = useRouter()

    useEffect(() => {
        if (currentUserData) setIsLoggedIn(true)
    }, [currentUserData])

    const toggleContent = () => {
        setShowShortContent(prev => !prev)
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

    useEffect(() => {
        if (content.length > 30) {
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
        <div key={_id} className="flex flex-col p-4 border-b border-gray-200">
            <div className='flex items-center justify-between'>
                <div className='flex justify-start'>
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
                <div>
                    <Button
                        size={'icon'}
                    >
                        <EllipsisVertical
                            className='ml-5'
                            style={{ height: '24px', width: '24px' }}
                        />
                    </Button>
                </div>
            </div>

            <div
                className="ml-1 mt-2"
                onClick={toggleContent}
            >
                {showShortContent ? shortContent : content}
            </div>

            {images.length ? (
                <div className="mt-2 max-w-screen-md mx-auto">

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

        </div>
    );
};

export default TweetCard;
