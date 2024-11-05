"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import UserFollowers from './UserFollowers';
import UserFollowings from './UserFollowings';

const UserConnectionsPage: React.FC = () => {
    const { channelId } = useParams()
    const [serachFor, setSerachFor] = useState<"followers" | "followings">("followers")
    
    if (!channelId) {
        console.error('Channel Id is required.')
        return (
            <div>Page not found.</div>
        )
    }

    return (
        <>
            <div className="flex justify-evenly items-center mb-4 mx-10 space-x-4">
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

            {serachFor === "followers" ? <UserFollowers channelId={String(channelId)}/> : <UserFollowings channelId={String(channelId)}/> }
        </>
    )
}

export default UserConnectionsPage
