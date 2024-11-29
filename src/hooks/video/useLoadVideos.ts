import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Video } from "@/types";

const useLoadVideos = (query: string, limit = 5) => {
    const [loadedVideos, setLoadedVideos] = useState<Video[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [hasMore, setHasMore] = useState(true); // Track if more videos are available
    const [loading, setLoading] = useState(false); // Track loading state

    const fetchVideos = async () => {
        if (loading || !hasMore) return; // Prevent duplicate requests or fetching when no more videos are available

        setLoading(true);
        try {
            const response = await api.get("/api/v1/videos/search/all", {
                params: { query, page: currentPage, limit }
            });

            const { videos, totalPages }: { videos: Video[], totalPages: number } = response.data.data;
            // console.log(1, loadedVideos);
            // console.log({ videos, totalPages, currentPage });
            
            setLoadedVideos((prevVideos) => {
                const videoIds = new Set(prevVideos.map((video) => video._id));
                const newVideos = videos.filter((video) => !videoIds.has(video._id));
                return [...prevVideos, ...newVideos];
            });

            setHasMore(response.data.data.currentPage < totalPages);
            setCurrentPage(response.data.data.currentPage + 1);
        } catch (error: any) {
            console.error(error.response?.data?.message || "Something went wrong while fetching videos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoadedVideos([]); // Reset the videos when query changes
        setCurrentPage(1); // Reset pagination
        setHasMore(true); // Ensure there are more videos to fetch
    }, [query]);
    
    useEffect(() => {
        fetchVideos();
    }, [query, fetchVideos])

    return { loadedVideos, fetchVideos, hasMore, loading };
};

export default useLoadVideos;
