import api from "@/lib/api";
import { Tweet } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useUserTweets = (usernameOrId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [userTweets, setUserTweets] = useState<Tweet[]>([])
    const requestUrl = useMemo(() => `/api/v1/tweets/user/${usernameOrId}`, [usernameOrId]);

    useEffect(() => {
        const fetchUserTweets = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                setUserTweets(response.data.data.tweets)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the user data.")
            }
        }

        fetchUserTweets()

    }, [usernameOrId])

    return userTweets
}

export default useUserTweets