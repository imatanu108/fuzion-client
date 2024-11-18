import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Bookmark, Heart } from 'lucide-react';
import ReactPlayer from 'react-player';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import { formatNumber, getUploadAge } from '@/lib/helpers';
import api from '@/lib/api';
import { Video } from '@/types';
import useUserInfo from '@/hooks/user/useUserInfo';
import UserCard from '../user/UserCard';
import ToggleSaveVideo from '../playlist/ToggleSaveVideo';

const PlayVideoCard: React.FC<{ video: Video }> = ({ video }) => {
    const { _id, title, description, videoFile, owner, isLikedByUser, views, createdAt, likesCount } = video;
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const videoOwner = useUserInfo(owner.username);
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(true);
    const [likeStatus, setLikeStatus] = useState(isLikedByUser);
    const [likesCountState, setLikesCountState] = useState(Number(likesCount));
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserData);
    const [showSaveModal, setShowSaveModal] = useState(false)

    const uploadAge = getUploadAge(createdAt);

    const togglePlayPause = () => {
        console.log('clicked')
        setIsPlaying((prev) => !prev)
    };

    const toggleLike = async () => {
        if (!isLoggedIn) {
            router.push('/user/login');
            return;
        }

        setLikeStatus(!likeStatus);
        setLikesCountState((prev) => (likeStatus ? prev - 1 : prev + 1));

        try {
            await api.post(`/api/v1/likes/toggle/video/${_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error: any) {
            setLikeStatus(!likeStatus);
            setLikesCountState((prev) => (likeStatus ? prev + 1 : prev - 1));
            console.error(error.response?.data?.message || 'Error toggling like status.');
        }
    };

    return (
        <div className="rounded-lg overflow-hidden shadow-md">
            <div onClick={togglePlayPause} className="relative cursor-pointer">
                <ReactPlayer
                    url={videoFile}
                    playing={isPlaying}
                    controls
                    width="100%"
                    height="100%"
                    className="react-player"
                />
            </div>
            
            <div className="px-2 py-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{formatNumber(views)} views • {uploadAge}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200  mt-2">{description}</p>
            </div>

            <div className="mx-2 flex items-center justify-between">
                <Button size="icon" onClick={toggleLike} className="flex items-center">
                    <Heart
                        className={likeStatus ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        style={{ height: '24px', width: '24px' }}
                    />
                    <span className="ml-1 text-sm">{formatNumber(likesCountState)}</span>
                </Button>

                <Button size="icon"
                onClick={() => setShowSaveModal(true)} 
                className="flex items-center">
                    <Bookmark
                        className='text-slate-800 dark:text-slate-200'
                        style={{ height: '24px', width: '24px' }}
                    />
                </Button>
            </div>

            {videoOwner && (
                <div className="bg-slate-200 dark:bg-slate-800 bg-opacity-75">
                    <UserCard fetchedUser={videoOwner} enableBio={false} />
                </div>
            )}

            {showSaveModal && (
                <ToggleSaveVideo videoId={_id} onDone={() => setShowSaveModal(false)}/>
            )}
        </div>
    );
};

export default PlayVideoCard;
