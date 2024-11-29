import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Tweet } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useLoadTweets = (query: string, limit = 15) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [loadedTweets, setLoadedTweets] = useState<Tweet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchTweets = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await api.get("/api/v1/tweets/search/all", {
                params: { query, page: currentPage, limit },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const { tweets, totalPages }: { tweets: Tweet[], totalPages: number } = response.data.data;
            // console.log(1, loadedTweets);
            // console.log({ tweets, totalPages, currentPage });

            console.log("total: " + response.data.data.totalTweets)
            setLoadedTweets((prevTweets) => {
                const tweetIds = new Set(prevTweets.map((tweet) => tweet._id));
                const newTweets = tweets.filter((tweet) => !tweetIds.has(tweet._id));
                return [...prevTweets, ...newTweets];
            });

            setHasMore(response.data.data.currentPage < totalPages);
            setCurrentPage(response.data.data.currentPage + 1);
        } catch (error: any) {
            console.error(error.response?.data?.message || "Something went wrong while fetching tweets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoadedTweets([]);
        setCurrentPage(1);
        setHasMore(true);
    }, [query]);

    useEffect(() => {
        fetchTweets();
    }, [query, fetchTweets])

    return { loadedTweets, fetchTweets, hasMore, loading };
};

export default useLoadTweets;
