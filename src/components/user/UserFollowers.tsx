"use client";
import React from 'react';
import UserCard from './UserCard';
import useUserFollowers from '@/hooks/user/useUserFollowers';

interface UserConnectionsCardProps {
    channelId: string,
}

const UserFollowers: React.FC<UserConnectionsCardProps> = ({ channelId }) => {

    const fetchedUsers = useUserFollowers(channelId)


    if (!fetchedUsers || !fetchedUsers.length) {
        return (
            <div className='mt-10 text-center text-slate-500 dark:text-slate-400'>
                No followers found for this user.
            </div>
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
export default UserFollowers
