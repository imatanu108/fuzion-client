import api from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { FetchedUserData } from "@/types";

const useUserInfo = (username: string) => {
    const [userInfo, setUserInfo] = useState<FetchedUserData | null>(null)
    const requestUrl = useMemo(() => `/api/v1/users/${username}`, [username]);
    
    useEffect(() => {
       (async () => {
            try {
                const response = await api.get(requestUrl)
                const fetchedUser: FetchedUserData = response.data.data
                setUserInfo(fetchedUser)
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching the user data.")
            }
        })()

    }, [username])

    return userInfo
}

export default useUserInfo