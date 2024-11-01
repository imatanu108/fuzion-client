"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import useUserInfo from '@/hooks/user/useUserInfo';
import { Button } from '../ui/button';
import { CurrentUserData, FetchedUserData } from '@/types';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import UserVideos from './UserVideos';
import UserTweets from './UserTweets';

const UserProfile: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [followers, setFollowers] = useState(0)
    const router = useRouter();
    const { username } = useParams();
    const userData: FetchedUserData | null = useUserInfo(String(username));
    const currentUserData: CurrentUserData | null = useSelector((state: RootState) => state.user.currentUserData);
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [selected, setSelected] = useState<'videos' | 'tweets'>('videos');


    if (!currentUserData) {
        return (
            <div className="flex items-center justify-center">
                <div className="flex flex-col justify-center gap-1 p-8 rounded-xl shadow-md text-[#0b3644] dark:text-slate-200 ">
                    <div className="font-bold text-xl" >
                        Please login or signup.
                    </div>
                    <div className="flex mt-3 flex-col gap-3 justify-center items-center">
                        <Button
                            variant="outline"
                            className="w-52 rounded-full text-base border-[#0b3644] dark:border-slate-200 text-[#0b3644] dark:text-slate-200"
                            onClick={() => {
                                router.push('/user/login')
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            className="w-52 bg-[#104b5f] dark:bg-[#4cc5ed] text-base text-white dark:text-[#0b3644] hover:text-white hover:bg-[#0b3644]
                  rounded-full "
                            onClick={() => {
                                router.push('/user/register-email')
                            }}
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Effect for determining logged-in status and admin status
    useEffect(() => {
        if (currentUserData?.username) {
            setIsLoggedIn(true);
            setIsAdmin(userData?.username === currentUserData.username);
        }
    }, [userData, currentUserData]);

    useEffect(() => {
        if (userData) {
            setIsSubscribed(userData.isSubscribed || false);
            setFollowers(userData.subscribersCount || 0)
        }
    }, [userData]);

    if (!userData) {
        return <div>No user found!</div>;
    }

    const fullName = userData.fullName || "User";
    const bio = userData.bio || "Hey there! I'm using Fuzion.";
    const avatar = userData.avatar || process.env.NEXT_PUBLIC_DEFAULT_USER_AVATAR;
    const coverImage = userData.coverImage || process.env.NEXT_PUBLIC_DEFAULT_USER_COVER_IMAGE;
    const channelsSubscribedToCount = userData.channelsSubscribedToCount || 0;

    const toggleSubscription = async () => {
        console.log("clicked");

        const newIsSubscribed = !isSubscribed;
        setIsSubscribed(newIsSubscribed);

        setFollowers(prevFollowers => newIsSubscribed ? prevFollowers + 1 : prevFollowers - 1);

        try {
            await api.post(`/api/v1/subscriptions/c/${username}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error: any) {
            console.error("Failed to update subscription:", error.response?.data?.message || error.message);

            // If the API call failed, revert to the previous state
            setIsSubscribed(prev => !prev);
            setFollowers(prevFollowers => newIsSubscribed ? prevFollowers - 1 : prevFollowers + 1);
        }
    };

    return (
        <>
            <div className="relative">
                <img
                    src={coverImage}
                    alt="Cover Image"
                    className="aspect-[3/1] lg:aspect-[4/1] w-full object-cover"
                />

                <div className="absolute inset-x-0 -bottom-12 flex items-center justify-between px-6">
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="h-24 w-24 rounded-full object-cover border-2 shadow-md border-[#e0e0e0] dark:border-[#1c3648]"
                    />
                    {isLoggedIn && (
                        <Button
                            variant={'outline'}
                            className="h-8 rounded-full shadow-md mt-12"
                            onClick={isAdmin ? () => router.push('/user/edit-profile') : toggleSubscription}
                        >
                            {isAdmin ? "Edit Profile" : isSubscribed ? "Following" : "Follow"}
                        </Button>
                    )}
                    {!isLoggedIn && !isAdmin && (
                        <Button
                            variant={'outline'}
                            className="h-8 rounded-full shadow-md mt-12"
                            onClick={() => router.push('/user/login')}
                        >
                            Follow
                        </Button>
                    )}
                </div>
            </div>

            <div className='mt-12 p-3'>
                <h2 className='text-xl'>{fullName}</h2>
                <h3 className='text-slate-500 dark:text-slate-400'>@{username}</h3>
                <div>{bio}</div>
                <div className='flex flex-row gap-4'>
                    <div>{followers}<span className='text-slate-500 dark:text-slate-400'> Followers</span></div>
                    <div>{channelsSubscribedToCount}<span className='text-slate-500 dark:text-slate-400'> Following</span></div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-1">
                <div className="flex space-x-4">
                    <button
                        className={`flex-1 p-2 rounded-md transition-colors duration-200 ${selected === 'videos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setSelected('videos')}
                    >
                        Videos
                    </button>
                    <button
                        className={`flex-1 p-2 rounded-md transition-colors duration-200 ${selected === 'tweets' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setSelected('tweets')}
                    >
                        Tweets
                    </button>
                </div>
                <div className="mt-4">
                    {selected === 'videos' ? <UserVideos /> : <UserTweets />}
                </div>
            </div>
        </>
    );
};

export default UserProfile;
