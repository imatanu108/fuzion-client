import api from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FetchedUserData } from "@/types";

const useUserFollowers = (channelId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [followers, setFollowers] = useState<FetchedUserData[]>([]);
    const requestUrl = useMemo(() => `/api/v1/users/followers/${channelId}`, [channelId]);

    useEffect(() => {
        const fetchUserFollowers = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                setFollowers(response.data.data.followers);
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching followers.");
            }
        };

        fetchUserFollowers();
    }, [channelId, requestUrl, accessToken]);

    return followers;
};

export default useUserFollowers;
