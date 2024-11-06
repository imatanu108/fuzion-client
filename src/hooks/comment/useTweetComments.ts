import api from "@/lib/api";
import { Comment } from "@/types";
import { useState, useEffect, useMemo } from "react";

const usetweetComments = (tweetId: string, refreshTrigger: boolean) => {
    const [tweetComments, setTweetComments] = useState<Comment[]>([]);
    const requestUrl = useMemo(() => `/api/v1/comments/t/${tweetId}`, [tweetId])
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(requestUrl);
                setTweetComments(response.data.data.comments);
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching comments.");
            }
        };

        fetchComments();
    }, [tweetId, refreshTrigger]);

    return tweetComments;
};

export default usetweetComments;
