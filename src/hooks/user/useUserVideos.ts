import api from "@/lib/api";
import { Video } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useUserVideos = (usernameOrId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [videos, setVideos] = useState<Video[]>([])
    const requestUrl = useMemo(() => `/api/v1/videos/user/${usernameOrId}`, [usernameOrId]);

    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                setVideos(response.data.data.videos)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the user data.")
            }
        }

        fetchUserVideos()
    }, [usernameOrId])

    return videos
}

export default useUserVideos