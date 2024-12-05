"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import usePlaylist from '@/hooks/playlist/usePlaylist';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from 'next/image';
import { Trash, Edit, LockKeyhole } from 'lucide-react';
import { Button } from '../ui/button';
import api from '@/lib/api';
import PlaylistVideoCard from '../video/PlaylistVideoCard';

const Playlist: React.FC = () => {
    const { id } = useParams()
    const playlist = usePlaylist(String(id))
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [isOwner, setIsOwner] = useState(false)
    const [showRemoveModal, setShowRemoveModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (currentUserData && currentUserData?._id === playlist?.owner._id) setIsOwner(true);
    }, [currentUserData, playlist]);

    if (!playlist) {
        return (
            <div className='text-center text-gray-500 p-4'>
                Loading...
            </div>
        )
    }

    const { name, description, isPublic, owner, videos, _id } = playlist
    const { avatar, fullName, username } = owner

    if (!isPublic && !isOwner) {
        return (
            <div>
                This playlist is private.
            </div>
        )
    }

    const accessibleVideos = videos.filter(
        (video) => video.isPublished || currentUserData?._id === video.owner._id
    );

    const playlistThumbnail = accessibleVideos[0]?.thumbnail || process.env.NEXT_PUBLIC_DEFAULT_PLAYLIST_THUMBNAIL

    const ownerAvatar = avatar || process.env.NEXT_PUBLIC_DEFAULT_USER_AVATAR

    return (
        <>
            <div className='mx-2'>
                <div
                    className="space-y-1 mb-6 relative p-3 rounded-xl overflow-hidden"
                    style={{
                        backgroundImage: `url(${playlistThumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {/* Background Overlay */}
                    <div
                        className="absolute inset-0 rounded-xl bg-slate-900 bg-opacity-40 backdrop-blur-lg"
                    ></div>

                    {/* Content */}
                    <div className="space-y-2 relative z-2 text-white">
                        <div className='flex gap-3 items-center'>
                            <div className="text-2xl font-medium">{name}</div>
                            {!playlist.isPublic && (
                                <LockKeyhole
                                    className="opacity-60"
                                    style={{ height: '20px', width: '20px' }}
                                />
                            )}
                        </div>
                        <div className="text-xs font-light text-slate-200 dark:text-slate-300">
                            {description}
                        </div>
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <Image
                                    src={String(ownerAvatar)}
                                    alt={`${username}'s avatar`}
                                    width={36}
                                    height={36}
                                    className="aspect-[1/1] rounded-full border-2 object-cover shadow-2xl"
                                />
                                <span className="text-sm text-white">
                                    by {fullName}
                                </span>
                            </div>

                            {isOwner && (
                                <div className='flex items-center gap-1'>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Edit Playlist"
                                        onClick={() => {
                                            router.push(`/playlists/update/${_id}`);
                                        }}
                                    >
                                        <Edit
                                            style={{ height: "24px", width: "24px" }}
                                            className="h-5 w-5"
                                        />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Delete playlist"
                                        onClick={() => setShowRemoveModal(true)}
                                    >
                                        <Trash
                                            style={{ height: "24px", width: "24px" }}
                                            className="h-5 w-5"
                                        />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    {accessibleVideos.length > 0
                        ? (
                            <div className="pb-[30%] md:pb-[10%] space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:mx-1">
                                {accessibleVideos.map((video) => {
                                    return <PlaylistVideoCard key={video._id} video={video} isPlaylistOwner={isOwner} />
                                })}
                            </div>
                        )
                        : (
                            <div className='text-center text-gray-500 p-4'>
                                No videos.
                            </div>
                        )}
                </div>
                {showRemoveModal && (
                    <div className="fixed z-10 inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-30">
                        <div className="bg-white flex flex-col justify-center gap-1 m-7 p-5 rounded-xl shadow-md text-[#0b3644]">
                            <div className="font-bold text-xl" >
                                Delete playlist?
                            </div>
                            <div className="text-slate-700 text-sm">
                                Once you delete the playlist, it will no longer be available to you and other users.
                            </div>
                            <div className="flex mt-3 flex-col gap-2 justify-center items-center">
                                <Button
                                    variant="outline"
                                    className="w-52 rounded-full text-base font-semibold border-[#0b3644] text-[#0b3644]"
                                    onClick={() => {
                                        setShowRemoveModal(false)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-52 bg-[#104b5f] text-base text-white hover:text-white hover:bg-[#0b3644]
                rounded-full "
                                    onClick={async () => {
                                        try {
                                            await api.delete(`/api/v1/playlists/${_id}`, {
                                                headers: {
                                                    Authorization: `Bearer ${accessToken}`,
                                                },
                                            });

                                            router.push('/playlists')
                                        } catch (error) {
                                            console.error(error)
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Playlist;