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
import UserPlaylists from '../playlist/UserPlaylists';

const UserProfile: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [followers, setFollowers] = useState(0)
    const router = useRouter();
    const { usernameOrId } = useParams();
    const userData: FetchedUserData | null = useUserInfo(String(usernameOrId));
    const currentUserData: CurrentUserData | null = useSelector((state: RootState) => state.user.currentUserData);
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [selected, setSelected] = useState<'videos' | 'tweets' | 'playlists'>('videos');

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
        return (
            <div className="text-center text-gray-500 p-4">
                No user found!
            </div>
        )
    }

const username = userData.username
const userId = userData._id
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
            <div
                className='flex flex-row gap-4 cursor-pointer'
                onClick={() => router.push(`/user/connections/${userId}`)}
            >
                <div>{followers}<span className='text-slate-500 dark:text-slate-400'>
                    {followers === 1 ? " Follower" : " Followers"}
                </span></div>
                <div>{channelsSubscribedToCount}<span className='text-slate-500 dark:text-slate-400'> Following</span></div>
            </div>
        </div>

        <div className="max-w-4xl mx-auto p-1 border-b border-[#a5bdc5] dark:border-[#485f67]">
            <div className="flex justify-evenly items-center mx-auto gap-4 mb-2">
                <button
                    className={`py-1 px-6 rounded-full transition-colors duration-200 ${selected === 'videos' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setSelected('videos')}
                >
                    Videos
                </button>
                <button
                    className={`py-1 px-6 rounded-full transition-colors duration-200 ${selected === 'tweets' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setSelected('tweets')}
                >
                    Tweets
                </button>
                <button
                    className={`py-1 px-6 rounded-full transition-colors duration-200 ${selected === 'playlists' ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setSelected('playlists')}
                >
                    Playlists
                </button>
            </div>
        </div>
        <div className="mt-3">
            {selected === 'videos' && <UserVideos />}
            {selected === 'tweets' && <UserTweets />}
            {selected === 'playlists' && <UserPlaylists userId={userId} />}
        </div>
    </>
);
};

export default UserProfile;
