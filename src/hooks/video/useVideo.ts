import api from "@/lib/api";
import { Video } from "@/types";
import { useState, useEffect, useMemo } from "react";

const useVideo = (videoId: string) => {
    const [video, setVideo] = useState<Video | null>(null)
    const requestUrl = useMemo(() => `/api/v1/videos/${videoId}`, [videoId]);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get(requestUrl)
                setVideo(response.data.data)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the Video.")
            }
        })()

    }, [videoId])

    return video
}

export default useVideo