import api from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { FetchedUserData } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const useUserInfo = (usernameOrId: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [userInfo, setUserInfo] = useState<FetchedUserData | null>(null)
    const requestUrl = useMemo(() => `/api/v1/users/${usernameOrId}`, [usernameOrId]);
    useEffect(() => {
       const fetchUserInfo = async () => {
            try {
                const response = await api.get(requestUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                const fetchedUser: FetchedUserData = response.data.data
                setUserInfo(fetchedUser)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the user data.")
            }
        }

        fetchUserInfo()

    }, [usernameOrId])

    return userInfo
}

export default useUserInfo