"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronRight, User, LockKeyhole, ShieldAlert, LogOut, MailPlus, Trash, X, LogIn } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { logout } from "@/features/userSlice";

const Settings: React.FC = () => {
    const router = useRouter()
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const dispatch = useDispatch<AppDispatch>()
    const [status, setStatus] = useState('')
    const [showStatus, setShowStatus] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserData)

    const handleLogout = async () => {
        setShowLogoutModal(false)
        try {
            const response = await api.post('/api/v1/users/logout', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            dispatch(logout())
            setIsLoggedIn(false)
            setStatus(response.data.message || 'Logged out successfully.')
            setShowStatus(true)
        } catch (error: any) {
            setStatus(error.response?.data?.message || 'Failed to log out.')
            setShowStatus(true)
        }
    }

    return (
        <>
            {isLoggedIn ? (
                <div >
                    <div className="pl-4 flex items-center justify-between border-b border-[#46626f7a] pb-2 mb-4">
                        <h1 className="text-xl font-semibold">Settings</h1>
                    </div>

                    <Button
                        className="flex w-full p-3 items-center justify-between hover:bg-gray-200 dark:hover:bg-slate-800 my-1"
                        onClick={() => router.push('/user/edit-profile')}
                    >
                        <div className="flex items-center gap-3">
                            <User
                                style={{ height: '24px', width: '24px' }}
                            />
                            <span>
                                Edit profile
                            </span>
                        </div>
                        <ChevronRight
                            style={{ height: '24px', width: '24px' }}
                        />
                    </Button>

                    <Button
                        className="flex w-full p-3 items-center justify-between hover:bg-gray-200 dark:hover:bg-slate-800 my-1"
                        onClick={() => router.push('/settings/change-password')}
                    >
                        <div className="flex items-center gap-3">
                            <LockKeyhole
                                style={{ height: '24px', width: '24px' }}
                            />
                            <span>
                                Change password
                            </span>
                        </div>
                        <ChevronRight
                            style={{ height: '24px', width: '24px' }}
                        />
                    </Button>

                    <Button
                        className="flex w-full p-3 items-center justify-between hover:bg-gray-200 dark:hover:bg-slate-800 my-1"
                        onClick={() => router.push('/settings/forgot-password/send-otp')}
                    >
                        <div className="flex items-center gap-3">
                            <ShieldAlert
                                style={{ height: '24px', width: '24px' }}
                            />
                            <span>
                                Forgot password
                            </span>
                        </div>
                        <ChevronRight
                            style={{ height: '24px', width: '24px' }}
                        />
                    </Button>
                    <Button
                        className="flex w-full p-3 items-center justify-between hover:bg-gray-200 dark:hover:bg-slate-800 my-1"
                        onClick={() => router.push('/settings/update-email')}
                    >
                        <div className="flex items-center gap-3">
                            <MailPlus
                                style={{ height: '24px', width: '24px' }}
                            />
                            <span>
                                Update email
                            </span>
                        </div>
                        <ChevronRight
                            style={{ height: '24px', width: '24px' }}
                        />
                    </Button>

                    <Button
                        className="flex w-full p-3 items-center justify-between hover:bg-gray-200 dark:hover:bg-slate-800 my-1"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut
                                style={{ height: '24px', width: '24px' }}
                            />
                            <span>
                                Log out
                            </span>
                        </div>
                        <ChevronRight
                            style={{ height: '24px', width: '24px' }}
                        />
                    </Button>

                    <Button
                        className="flex w-full p-3 items-center justify-between hover:bg-gray-200 dark:hover:bg-slate-800 my-1"
                        onClick={() => router.push('/settings/delete-account')}
                    >
                        <div className="flex items-center gap-3">
                            <Trash
                                style={{ height: '24px', width: '24px' }}
                            />
                            <span>
                                Delete account
                            </span>
                        </div>
                        <ChevronRight
                            style={{ height: '24px', width: '24px' }}
                        />
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <Button
                        className="flex mx-10 px-6 py-3 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-800 text-slate-200 my-1"
                        onClick={() => router.push('/user/login')}
                    >
                        <LogIn
                            style={{ height: '24px', width: '24px' }}
                        />
                        <span>
                            Login
                        </span>
                    </Button>
                </div>
            )}
            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-30">
                    <div className="bg-white flex flex-col justify-center gap-1 m-7 p-5 rounded-xl shadow-md text-[#0b3644]">
                        <div className="font-bold text-xl" >
                            Log Out of Your Account?
                        </div>
                        <div className="text-slate-700 text-sm">
                            Once you log out, you will need to sign in again to access your account.
                        </div>
                        <div className="flex mt-3 flex-col gap-2 justify-center items-center">
                            <Button
                                variant="outline"
                                className="w-52 rounded-full text-base font-semibold border-[#0b3644] text-[#0b3644]"
                                onClick={() => {
                                    setShowLogoutModal(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="w-52 bg-[#104b5f] text-base text-white hover:text-white hover:bg-[#0b3644]
                rounded-full "
                                onClick={() => {
                                    handleLogout()
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showStatus && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[#0b3644] bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-[#103c4b] mx-6 p-6 rounded-xl shadow-lg text-[#0b3644] dark:text-gray-200 w-full max-w-sm relative">
                        <button
                            onClick={() => setShowStatus(false)}
                            className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none"
                        >
                            <X style={{ height: '24px', width: '24px' }} />
                        </button>

                        <div className="text-center">
                            <p className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                Status
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {status}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Settings;
