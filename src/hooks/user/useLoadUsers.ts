import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FetchedUserData } from "@/types";

const useLoadUsers = (query: string) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const [users, setUsers] = useState<FetchedUserData[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/api/v1/users/search/all", {
                    params: { query },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                setUsers(response.data.data.users);
            } catch (error: any) {
                console.error(error.response?.data?.message || "Something went wrong while fetching users.");
            }
        };

        fetchUsers();
    }, [query]);

    return users;
};

export default useLoadUsers;
