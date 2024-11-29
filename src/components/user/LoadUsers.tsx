"use client";
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useLoadUsers from '@/hooks/user/useLoadUsers';
import UserCard from './UserCard';
import { shuffleElements } from '@/lib/helpers';

interface LoadUsersProps {
    query?: string;
}

const LoadUsers: React.FC<LoadUsersProps> = ({ query = '' }) => {
    const { loadedUsers, fetchUsers, hasMore, loading } = useLoadUsers(query);

    if (!loadedUsers.length && !loading) {
        return (
            <div className="text-center text-gray-500 p-4">
                No users found.
            </div>
        );
    }

    const shuffledUsers = shuffleElements(loadedUsers)

    return (
        <InfiniteScroll
            dataLength={shuffledUsers.length}
            next={fetchUsers}
            hasMore={hasMore}
            loader={<p className="text-center text-gray-500 p-4">Loading...</p>}
            endMessage={<p className="text-center text-gray-500 p-4">No more users to show</p>}
        >
            <div>
                {shuffledUsers.map((user) => (
                    <UserCard key={user._id} fetchedUser={user} />
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default LoadUsers;
