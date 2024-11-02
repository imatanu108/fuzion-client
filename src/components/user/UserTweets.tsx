"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import useUserTweets from '@/hooks/user/useUserTweets';
import TweetCard from '../tweet/TweetCard';

const UserTweets: React.FC = () => {
    const { username } = useParams();
    const userTweets = useUserTweets(String(username));

    if (!userTweets || !userTweets.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No Tweets found.
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {userTweets.map((tweet) => {
                return <TweetCard key={tweet._id} {...tweet} />
            })}
        </div>
    );
};

export default UserTweets;
