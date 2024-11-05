"use client";
import React from 'react';
import UserCard from './UserCard';
import useLoadUsers from '@/hooks/user/useLoadUsers';

interface LoadUsersProps {
    query?: string
}

const LoadUsers: React.FC<LoadUsersProps> = ({ query = '' }) => {
    const fetchedUsers = useLoadUsers(query)

    if (!fetchedUsers || !fetchedUsers.length) {
        return (
            <div>No users found.</div>
        )
    }

    return (
        <div>
            {fetchedUsers.map((fetchedUser) => {
                return <UserCard key={fetchedUser._id} fetchedUser={fetchedUser} />
            })}
        </div>
    )
}
export default LoadUsers
