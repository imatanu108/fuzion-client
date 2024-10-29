import api from "@/lib/api";
import { Video } from "@/types";
import { useState, useEffect, useMemo } from "react";

const useUserVideos = (username: string) => {
    const [videos, setVideos] = useState<Video[]>([])
    const requestUrl = useMemo(() => `/api/v1/videos/user/${username}`, [username]);
    
    useEffect(() => {
       (async () => {
            try {
                const response = await api.get(requestUrl)
                setVideos(response.data.data.videos)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the user data.")
            }
        })()

    }, [username])

    return videos
}

export default useUserVideos