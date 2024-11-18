"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Playlist } from '@/types';
import Image from 'next/image';

interface PlaylistCardProps {
    playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const [isOwner, setIsOwner] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [showPlaylist, setShowPlaylist] = useState(true)
    const { _id, name, description, owner, videos, isPublic } = playlist
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter()
    const [showRemoveModal, setShowRemoveModal] = useState(false)

    useEffect(() => {
        console.log(currentUserData?._id)
        if (currentUserData?._id === owner._id) setIsOwner(true);
    }, [currentUserData]);

    useEffect(() => {
        if (!isPublic) {
            setShowPlaylist(false);
            if (isOwner) setShowPlaylist(true);
        }
    }, [playlist])

    let shortDescription = description
    if (description.length > 65) {
        shortDescription = description.slice(0, 65) + '...'
    }

    const handleMenuToggle = () => {
        setMenuOpen(prev => !prev);
    };

    const handleDelete = async () => {
        await api.delete(`/api/v1/playlists/${_id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        setIsDeleted(true)
    }

    const playlistThumbnail = playlist.videos[0]?.thumbnail || process.env.NEXT_PUBLIC_DEFAULT_PLAYLIST_THUMBNAIL

    console.log(playlistThumbnail)

    return (
        <>
            {!(isDeleted || !showPlaylist) && (
                <div className="my-2 mx-2"
                >
                    <div
                        key={_id}
                        className="flex items-start space-x-3 cursor-pointer"
                    >
                        <div
                            className="relative w-40 h-24 flex-shrink-0 rounded-xl overflow-hidden"
                            onClick={() => router.push(`/playlists/${_id}`)}
                        >
                            <div className="absolute w-[85%] h-full bg-cover rounded-xl bg-center blur-xl scale-110 z-0"
                                style={{
                                    backgroundImage: `url(${playlistThumbnail})`
                                }}
                            />

                            <Image
                                src={String(playlistThumbnail)}
                                alt={name}
                                width={640}
                                height={360}
                                className="relative z-10 aspect-[16/9] object-cover rounded-xl shadow-2xl"
                                unoptimized
                                priority
                            />

                            <div className="absolute bottom-2 right-1 bg-black bg-opacity-75 text-white text-xs font-normal px-2 py-0.5 rounded z-10">
                                {videos.length === 0
                                    ? "0 videos"
                                    : videos.length === 1
                                        ? "1 video"
                                        : `${videos.length} videos`}
                            </div>
                        </div>


                        <div
                            className="flex flex-col flex-grow"
                            onClick={() => router.push(`/playlists/${_id}`)}
                        >
                            <div className="text-sm font-semibold line-clamp-2">{name}</div>
                            <div className="text-xs text-gray-400">{shortDescription}</div>
                            <div className="text-xs text-gray-500 mt-1">@{owner.username}</div>
                        </div>

                        {isOwner && (
                            <div className="relative">
                                <Button
                                    size="icon"
                                    className="self-start"
                                    onClick={() => handleMenuToggle()}
                                >
                                    <EllipsisVertical className="h-5 w-5 text-gray-400" />
                                </Button>
                                {menuOpen && (
                                    <div className="absolute right-0 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-10 transition-transform transform translate-y-2">
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            onClick={() => router.push(`/playlists/update/${_id}`)}
                                        >
                                            Edit Playlist
                                        </button>

                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                            onClick={() => setShowRemoveModal(true)}
                                        >
                                            Delete Playlist
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {showRemoveModal && (
                        <div className="fixed z-20 inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-30">
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
                                        onClick={() => handleDelete()}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            )}
        </>
    )
}

export default PlaylistCard;
