import api from "@/lib/api";
import { Tweet } from "@/types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useLoadTweets = (query: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [loadedTweets, setLoadedTweets] = useState<Tweet[]>([]);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                const response = await api.get("/api/v1/tweets/search/all", {
                    params: { query },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                },);
                setLoadedTweets(response.data.data.tweets);
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching tweets.");
            }
        };

        fetchTweets();
    }, [query]); // Fetch videos when query changes

    return loadedTweets;
};

export default useLoadTweets;
