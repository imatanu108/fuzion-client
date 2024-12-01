"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import useUserTweets from '@/hooks/user/useUserTweets';
import TweetCard from '../tweet/TweetCard';

const UserTweets: React.FC = () => {
    const { usernameOrId } = useParams();
    const userTweets = useUserTweets(String(usernameOrId));

    if (!userTweets || !userTweets.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No tweets found.
            </div>
        );
    }

    return (
        <div className="pb-[30%] md:pb-[10%] space-y-1">
            {userTweets.map((tweet) => {
                return <TweetCard key={tweet._id} tweet={tweet} />
            })}
        </div>
    );
};

export default UserTweets;
