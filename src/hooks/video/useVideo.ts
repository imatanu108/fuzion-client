import api from "@/lib/api";
import { Video } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useVideo = (videoId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [video, setVideo] = useState<Video | null>(null)
    const requestUrl = useMemo(() => `/api/v1/videos/${videoId}`, [videoId]);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                
                setVideo(response.data.data)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the Video.")
            }
        }

        fetchVideo()

    }, [videoId, accessToken, requestUrl])

    return video
}

export default useVideo