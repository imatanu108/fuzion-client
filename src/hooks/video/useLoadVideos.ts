import api from "@/lib/api";
import { Video } from "@/types";
import { useState, useEffect } from "react";

const useLoadVideo = (query: string) => {
    const [loadedVideos, setLoadedVideos] = useState<Video[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get("/api/v1/videos/search", {
                    params: { query }
                });
                setLoadedVideos(response.data.data.videos);
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the video.");
            }
        };

        fetchVideos();
    }, [query]); // Fetch videos when query changes

    return loadedVideos;
};

export default useLoadVideo;
