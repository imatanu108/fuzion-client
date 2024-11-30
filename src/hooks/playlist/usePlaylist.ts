import api from "@/lib/api";
import { Playlist } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const usePlaylist = (playlistId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [playlist, setPlaylist] = useState<Playlist | null>(null)
    const requestUrl = useMemo(() => `/api/v1/playlists/${playlistId}`, [playlistId]);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                
                setPlaylist(response.data.data)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the playlist.")
            }
        }

        fetchPlaylist()

    }, [playlistId, accessToken, requestUrl])

    return playlist
}

export default usePlaylist