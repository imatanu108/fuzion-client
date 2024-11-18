import api from "@/lib/api";
import { Playlist } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useUserPlaylists = (userId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([])
    const requestUrl = useMemo(() => `/api/v1/playlists/user/${userId}`, [userId]);

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                
                setUserPlaylists(response.data.data)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching user playlists.")
            }
        }

        fetchUserPlaylists()

    }, [userId])

    return userPlaylists
}

export default useUserPlaylists