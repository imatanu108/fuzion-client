import api from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FetchedUserData } from "@/types";

const useUserFollowings = (channelId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [followings, setFollowings] = useState<FetchedUserData[]>([]);
    const requestUrl = useMemo(() => `/api/v1/users/followings/${channelId}`, [channelId]);

    useEffect(() => {
        const fetchUserFollowings = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                setFollowings(response.data.data.followings);
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching followers.");
            }
        };

        fetchUserFollowings();
    }, [channelId, requestUrl, accessToken]);

    return followings;
};

export default useUserFollowings;
