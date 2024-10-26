import api from "@/lib/api";
import { useState, useEffect } from "react";

const useWatchHistory = () => {
    const [watchHistory, setWatchHistory] = useState(null)
    const requestUrl = '/api/v1/users/v/watch-history'

    useEffect(() => {
       (async () => {
            try {
                const response = await api.get(requestUrl)
                setWatchHistory(response.data.data)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the user data.")
            }
        })()

    }, [])

    return watchHistory
}

export default useWatchHistory