"use client";
import React, { useMemo } from 'react';
import { Search, CircleUserRound, SidebarIcon, ListVideo, Bookmark, Settings, UserRoundCog, TvMinimalPlay, LogIn, UserRoundPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SidebarProps {
    hideSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ hideSidebar }) => {
    const router = useRouter()
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const isLoggedIn = useMemo(() => !!currentUserData, [currentUserData]);

    const onProfileClick = () => {
        if (hideSidebar) hideSidebar();
        if (isLoggedIn) {
            router.push(`/user/${currentUserData?.username}`)
        } else {
            router.push('/user/auth/login')
        }
    }

    return (
        <div className='lg:fixed min-h-screen lg:w-[22%] text-slate-900 dark:text-slate-200'>
            <div className='w-full py-1 border-b border-[#46626f7a]'>
                <Button
                    className='flex w-full justify-start hover:bg-slate-300 hover:dark:bg-slate-700 items-center text-lg gap-3 px-3'
                    onClick={() => {
                        if (hideSidebar) hideSidebar();
                    }}
                >
                    <SidebarIcon
                        style={{ height: '24px', width: '24px' }}
                    />
                    <span>
                        Menu
                    </span>
                </Button>
            </div>
            <div className='flex flex-col my-2 gap-2'>
                {!isLoggedIn && (
                    <Button
                        className='flex justify-start items-center text-slate-50 bg-blue-500 hover:bg-blue-700 gap-3 text-lg px-3 lg:mr-[0.6%]'
                        onClick={() => {
                            if (hideSidebar) hideSidebar();
                            router.push('/user/auth/login')
                        }}
                    >
                        <LogIn
                            style={{ height: '24px', width: '24px' }}
                        />
                        <span>
                            Login
                        </span>
                    </Button>
                )}
                {!isLoggedIn && (
                    <Button
                        className='flex justify-start items-center text-slate-50 bg-blue-500 hover:bg-blue-700 gap-3 text-lg px-3 lg:mr-[0.6%]'
                        onClick={() => {
                            if (hideSidebar) hideSidebar();
                            router.push('/user/auth/register-email')
                        }}
                    >
                        <UserRoundPlus
                            style={{ height: '24px', width: '24px' }}
                        />
                        <span>
                            Create account
                        </span>
                    </Button>
                )}

                {isLoggedIn && (
                    <Button
                        className=' flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-lg px-3'
                        onClick={() => onProfileClick()}
                    >
                        <CircleUserRound
                            style={{ height: '24px', width: '24px' }}
                        />
                        <span>
                            Profile
                        </span>
                    </Button>
                )}

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-lg px-3'
                    onClick={() => {
                        if (hideSidebar) hideSidebar();
                        router.push('/search')
                    }}
                >
                    <Search
                       style={{ height: '24px', width: '24px' }}
                    />
                    <span>
                        Explore
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-lg px-3'
                    onClick={() => {
                        if (hideSidebar) hideSidebar();
                        if (isLoggedIn) {
                            router.push('/playlists')
                        } else {
                            router.push('/user/auth/login')
                        }
                    }}
                >
                    <ListVideo
                        style={{ height: '24px', width: '24px' }}
                    />
                    <span>
                        Playlists
                    </span>
                </Button>


                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-lg px-3'
                    onClick={() => {
                        if (hideSidebar) hideSidebar();
                        if (isLoggedIn) {
                            router.push('/saved-tweets')
                        } else {
                            router.push('/user/auth/login')
                        }
                    }}
                >
                    <Bookmark
                        style={{ height: '24px', width: '24px' }}
                    />
                    <span>
                        Saved tweets
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-lg px-3'
                    onClick={() => onProfileClick()}
                >
                    <TvMinimalPlay
                        style={{ height: '24px', width: '24px' }}
                    />
                    <span>
                        Your videos
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-lg px-3'
                    onClick={() => {
                        if (hideSidebar) hideSidebar();
                        if (isLoggedIn) {
                            router.push('/settings')
                        } else {
                            router.push('/user/auth/login')
                        }
                    }}
                >
                    <Settings
                        style={{ height: '24px', width: '24px' }}
                    />
                    <span>
                        Settings
                    </span>
                </Button>

                <Button
                    className='flex justify-start items-center hover:bg-slate-300 hover:dark:bg-slate-700 gap-3 text-lg px-3'
                    onClick={() => {
                        if (hideSidebar) hideSidebar();
                        window.open('https://www.linkedin.com/in/imatanu/', '_blank');
                    }}
                >
                    <UserRoundCog
                        style={{ height: '24px', width: '24px' }}
                    />
                    <span>
                        Contact Developer
                    </span>
                </Button>

            </div>
        </div>
    )
}

export default Sidebar;
