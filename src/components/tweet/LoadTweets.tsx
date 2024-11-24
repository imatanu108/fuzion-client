"use client";
import React from 'react';
import useLoadTweets from '@/hooks/tweet/useLoadTweets';
import TweetCard from './TweetCard';
import { shuffleElements } from '@/lib/helpers';

interface LoadTweetsProps {
    query?: string
}

const LoadTweets: React.FC<LoadTweetsProps> = ({ query = '' }) => {
    const loadedTweets = useLoadTweets(query)

    if (!loadedTweets || !loadedTweets.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No tweets found.
            </div>
        )
    }

    const shuffledTweets = shuffleElements(loadedTweets)

    return (
        <div>
            {shuffledTweets.map((tweet) => {
                return <TweetCard key={tweet._id} tweet={tweet} />
            })}
        </div>
    )
}
export default LoadTweets
