import api from "@/lib/api";
import { Tweet } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useTweet = (tweetId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [tweet, setTweet] = useState<Tweet | null>(null)
    const requestUrl = useMemo(() => `/api/v1/tweets/${tweetId}`, [tweetId]);
    
    useEffect(() => {
        const fetchTweet = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })

                setTweet(response.data.data)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the Tweet.")
            }
        }

        fetchTweet()

    }, [tweetId, accessToken, requestUrl])

    return tweet
}

export default useTweet