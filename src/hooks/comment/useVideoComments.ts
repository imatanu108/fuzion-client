import api from "@/lib/api";
import { Comment } from "@/types";
import { useState, useEffect, useMemo } from "react";

const useVideoComments = (videoId: string, refreshTrigger: boolean) => {
    const [videoComments, setVideoComments] = useState<Comment[]>([]);
    const requestUrl = useMemo(() => `/api/v1/comments/v/${videoId}`, [videoId])
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(requestUrl);
                setVideoComments(response.data.data.comments);
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching comments.");
            }
        };

        fetchComments();
    }, [videoId, refreshTrigger, requestUrl]);

    return videoComments;
};

export default useVideoComments;
