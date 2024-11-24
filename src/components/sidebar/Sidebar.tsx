"use client";
import React, { useState } from 'react';
import { Search, CircleUserRound, SidebarIcon, ListVideo, Bookmark, Youtube, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SidebarProps {
    hideSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({hideSidebar}) => {
    const router = useRouter()
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserData)

    const onProfileClick = () => {
        if(hideSidebar) hideSidebar();
        if (isLoggedIn) {
            router.push(`/user/${currentUserData?.username}`)
        } else {
            router.push('/user/login')
        }
    }

    return (
        <div className='lg:fixed min-h-screen lg:w-[22%] text-slate-700 dark:text-slate-200'>
            <div className='w-full border-b border-[#46626f7a]'>
                <Button
                    className='flex w-full justify-start hover:bg-slate-300 hover:dark:bg-slate-700 items-center gap-3 text-base px-3'
                    onClick={() => {
                        if(hideSidebar) hideSidebar();
                    }}
                >
                    <SidebarIcon
                        style={{ height: '20px', width: '20px' }}
                    />
                    <span>
                        Menu
                    </span>
                </Button>
            </div>
            <div className='flex flex-col my-1'>
                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-base px-3'
                    onClick={() => onProfileClick()}
                >
                    <CircleUserRound
                        style={{ height: '20px', width: '20px' }}
                    />
                    <span>
                        Profile
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-base px-3'
                    onClick={() => {
                        if(hideSidebar) hideSidebar();
                        router.push('/search')
                    }}
                >
                    <Search
                        style={{ height: '20px', width: '20px' }}
                    />
                    <span>
                        Explore
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-base px-3'
                    onClick={() => {
                        if(hideSidebar) hideSidebar();
                        if (isLoggedIn) {
                            router.push('/playlists')
                        } else {
                            router.push('/user/login')
                        }
                    }}
                >
                    <ListVideo
                        style={{ height: '20px', width: '20px' }}
                    />
                    <span>
                        Playlists
                    </span>
                </Button>


                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-base px-3'
                    onClick={() => {
                        if(hideSidebar) hideSidebar();
                        if (isLoggedIn) {
                            router.push('/saved-tweets')
                        } else {
                            router.push('/user/login')
                        }
                    }}
                >
                    <Bookmark
                        style={{ height: '20px', width: '20px' }}
                    />
                    <span>
                        Saved tweets
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-base px-3'
                    onClick={() => onProfileClick()}
                >
                    <Youtube
                        style={{ height: '20px', width: '20px' }}
                    />
                    <span>
                        Your videos
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-base px-3'
                    onClick={() => {
                        if(hideSidebar) hideSidebar();
                        if (isLoggedIn) {
                            router.push('/settings')
                        } else {
                            router.push('/user/login')
                        }
                    }}
                >
                    <Settings
                        style={{ height: '20px', width: '20px' }}
                    />
                    <span>
                        Settings
                    </span>
                </Button>

            </div>
        </div>
    )
}

export default Sidebar;
