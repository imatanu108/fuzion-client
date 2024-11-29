"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserFollowers from './UserFollowers';
import UserFollowings from './UserFollowings';
import useUserInfo from '@/hooks/user/useUserInfo';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

const UserConnectionsPage: React.FC = () => {
    const { channelId } = useParams()
    const [serachFor, setSerachFor] = useState<"followers" | "followings">("followers")
    const router = useRouter()
    
    const channel = useUserInfo(String(channelId))

    if (!channelId) {
        console.error('Channel Id is required.')
        return (
            <div>Page not found.</div>
        )
    }

    if (!channel) {
        return (
            <div>Page not found.</div>
        )
    }
    const { fullName, username } = channel

    return (
        <>
            <div 
            className='flex items-center mb-3 ml-2'
            onClick={() => router.push(`/user/${username}`) }
            >
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label='Back to user profile'
                >
                    <ArrowLeft
                        style={{ height: '24px', width: '24px' }}
                        className='h-5 w-5 mr-2'
                    />
                </Button>
                <div>
                    <div className="font-semibold text-gray-700 dark:text-gray-300">
                        {fullName}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm">
                        @{username}
                    </div>
                </div>
            </div>
            <div className="flex justify-evenly items-center my-2 mx-10 space-x-4">
                <button
                    className={`py-1 px-6 rounded-full transition-colors duration-200 ${serachFor === 'followers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setSerachFor('followers')}
                >
                    followers
                </button>
                <button
                    className={`py-1 px-6 rounded-full transition-colors duration-200 ${serachFor === 'followings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setSerachFor('followings')}
                >
                    followings
                </button>
            </div>

            {serachFor === "followers" ? <UserFollowers channelId={String(channelId)} /> : <UserFollowings channelId={String(channelId)} />}
        </>
    )
}

export default UserConnectionsPage
