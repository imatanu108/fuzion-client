import api from "@/lib/api";
import { Tweet } from "@/types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useSavedTweets = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [savedTweets, setSavedTweets] = useState<Tweet[]>([])

    useEffect(() => {
        const fetchSavedTweets = async () => {
            try {
                const response = await api.get("/api/v1/savedtweets", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })

                setSavedTweets(response.data.data.tweets)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the saved tweets.")
            }
        }

        fetchSavedTweets()

    }, [accessToken])

    return savedTweets
}

export default useSavedTweets