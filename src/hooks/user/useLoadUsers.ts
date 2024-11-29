import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { FetchedUserData } from "@/types";

const useLoadUsers = (query: string, limit = 30) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [loadedUsers, setLoadedUsers] = useState<FetchedUserData[]>([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await api.get("/api/v1/users/search/all", {
                params: { query, page: currentPage, limit },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const { users, totalPages }: { users: FetchedUserData[], totalPages: number } = response.data.data;
            console.log("total: " + response.data.data.totalUsers);

            setLoadedUsers((prevUsers) => {
                const userIds = new Set(prevUsers.map((user) => user._id));
                const newUsers = users.filter((user) => !userIds.has(user._id));
                return [...prevUsers, ...newUsers];
            });

            setHasMore(response.data.data.currentPage < totalPages);
            setCurrentPage(response.data.data.currentPage + 1);
        } catch (error: any) {
            console.error(error.response?.data?.message || "Something went wrong while fetching users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoadedUsers([]);
        setCurrentPage(1);
        setHasMore(true);
        fetchUsers();
    }, [query, fetchUsers]);

    return { loadedUsers, fetchUsers, hasMore, loading };
};

export default useLoadUsers;
