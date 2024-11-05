"use client";
import React from 'react';
import UserCard from './UserCard';
import useUserFollowings from '@/hooks/user/useUserFollowings';

interface UserConnectionsCardProps {
    channelId: string,
}

const UserFollowings: React.FC<UserConnectionsCardProps> = ({ channelId }) => {

    const fetchedUsers = useUserFollowings(channelId)


    if (!fetchedUsers || !fetchedUsers.length) {
        return (
            <div className='mt-10 text-center text-slate-500 dark:text-slate-400'>
                No followings found for this user.
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
export default UserFollowings
