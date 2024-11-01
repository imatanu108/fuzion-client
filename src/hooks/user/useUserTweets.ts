import api from "@/lib/api";
import { Tweet } from "@/types";
import { useState, useEffect, useMemo } from "react";

const useUserTweets = (username: string) => {
    const [userTweets, setUserTweets] = useState<Tweet[]>([])
    const requestUrl = useMemo(() => `/api/v1/tweets/user/${username}`, [username]);

    useEffect(() => {
       (async () => {
            try {
                const response = await api.get(requestUrl)
                setUserTweets(response.data.data.tweets)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the user data.")
            }
        })()

    }, [username])

    return userTweets
}

export default useUserTweets