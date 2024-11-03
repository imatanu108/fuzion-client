import api from "@/lib/api";
import { Tweet } from "@/types";
import { useState, useEffect, useMemo } from "react";

const useTweet = (tweetId: string) => {
    const [tweet, setTweet] = useState<Tweet | null>(null)
    const requestUrl = useMemo(() => `/api/v1/tweets/${tweetId}`, [tweetId]);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(requestUrl)
                setTweet(response.data.data)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the Tweet.")
            }
        })()

    }, [tweetId])

    return tweet
}

export default useTweet