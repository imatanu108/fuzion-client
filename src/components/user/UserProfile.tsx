"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import useUserInfo from '@/hooks/user/useUserInfo';
import { LucideEdit, LucideMenu } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';
import { CurrentUserData } from '@/types';
import { RootState } from '@/store/store';

const UserProfile: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const { username } = useParams(); // Extract username from route params
    console.log("username", username)
    const userData = useUserInfo(String(username)); // Fetch user data
    const currentUserData: CurrentUserData | null = useSelector((state: RootState) => state.user.currentUserData); // Fetch current user data

    // Check if the user is the admin (logged-in user matches profile user)
    useEffect(() => {
        if (userData?.username === currentUserData?.username) {
            setIsAdmin(true);
        }
    }, [userData, currentUserData]);

    // Extract user information or set defaults
    const fullName = userData?.fullName || "User";
    const bio = userData?.bio || "Hey there! I'm using Fuzion.";
    const avatar = userData?.avatar || process.env.NEXT_PUBLIC_DEFAULT_USER_AVATAR;
    const coverImage = userData?.coverImage || process.env.NEXT_PUBLIC_DEFAULT_USER_COVER_IMAGE;
    const channelsSubscribedToCount = userData?.channelsSubscribedToCount || 0;
    const isSubscribed = userData?.isSubscribed || false;
    const subscribersCount = userData?.subscribersCount || 0;

    const toggleMenu = () => setShowMenu(!showMenu);

    return (
        <div className="user-profile">
            {/* Cover Image with Edit Icon for admin */}
            <div className="cover-image relative" style={{ aspectRatio: '4/1', backgroundImage: `url(${coverImage})` }}>
                {isAdmin && (
                    <Button size="icon" className="absolute right-4 top-4">
                        <LucideEdit className="w-6 h-6" />
                    </Button>
                )}
            </div>

            {/* Profile Image with Edit Icon for admin */}
            <div className="profile-image relative w-32 h-32 rounded-full mx-auto -mt-16">
                <img src={avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                {isAdmin && (
                    <Button size="icon" className="absolute right-0 bottom-0">
                        <LucideEdit className="w-6 h-6" />
                    </Button>
                )}
            </div>

            {/* User Info */}
            <div className="text-center mt-4">
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <p className="text-sm text-gray-500">@{username}</p>
                <div className="flex justify-center gap-4 mt-2">
                    <span>{subscribersCount} Subscribers</span>
                    <span>{channelsSubscribedToCount} Subscribed</span>
                </div>
                <p className="text-gray-700 mt-2">{bio}</p>

                {/* Follow Button or Edit Profile Button */}
                {isAdmin ? (
                    <Button className="mt-4">Edit Profile</Button>
                ) : (
                    <Button variant="secondary" className="mt-4">
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                )}
            </div>

            {/* Admin Menu Icon */}
            {isAdmin && (
                <div className="menu-container mt-4">
                    <Button size="icon" onClick={toggleMenu}>
                        <LucideMenu className="w-6 h-6" />
                    </Button>
                    {showMenu && (
                        <div className="menu bg-white shadow-md rounded-md mt-2 p-2">
                            <ul className="flex flex-col">
                                <li><Button variant="link">Edit Profile</Button></li>
                                <li><Button variant="link">Update Avatar</Button></li>
                                <li><Button variant="link">Update Cover</Button></li>
                                <li><Button variant="link" onClick={() => setShowDeletePopup(true)}>Delete Account</Button></li>
                                <li><Button variant="link" onClick={() => setShowLogoutPopup(true)}>Logout</Button></li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Pop-up for Logout Confirmation */}
            <Dialog open={showLogoutPopup} onOpenChange={setShowLogoutPopup}>
                <DialogTrigger asChild>
                    <Button className="hidden" />
                </DialogTrigger>
                <DialogContent>
                    <h3>Confirm Logout</h3>
                    <p>Are you sure you want to logout?</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="secondary" onClick={() => setShowLogoutPopup(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => alert('Logged Out')}>Logout</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Pop-up for Delete Account Confirmation */}
            <Dialog open={showDeletePopup} onOpenChange={setShowDeletePopup}>
                <DialogTrigger asChild>
                    <Button className="hidden" />
                </DialogTrigger>
                <DialogContent>
                    <h3>Confirm Account Deletion</h3>
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => alert('Account Deleted')}>Delete Account</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserProfile;
