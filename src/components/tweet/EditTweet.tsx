"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useTweet from "@/hooks/tweet/useTweet";

const EditTweet: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserData);
    const [content, setContent] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const router = useRouter();
    const { id } = useParams();
    const tweet = useTweet(String(id));

    useEffect(() => {
        if (tweet) {
            setContent(tweet.content || '');
            if (currentUserData?.username === tweet.owner?.username) {
                setIsAdmin(true);
            }
        }
    }, [tweet, currentUserData]);

    if (!tweet) {
        return <div>No tweet found.</div>;
    }

    if (!isLoggedIn || !isAdmin) {
        return <div>Unauthorized request.</div>;
    }

    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsUpdating(true);
            await api.patch(`/api/v1/tweets/${id}`, { content }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            setIsUpdating(false);
            setUpdateSuccess(true);
            router.push(`/user/${currentUserData?.username}`);
        } catch (error) {
            setIsUpdating(false);
            setUpdateSuccess(false);
            console.error("Error updating the tweet:", error);
        }
    };

    const onCancel = () => {
        router.push(`/user/${currentUserData?.username}`);
    };

    return (
        <div className="max-w-3xl mx-auto p-4 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 ">Edit Tweet</h2>
            <form onSubmit={onUpdate} className="flex flex-col gap-6">
                {/* Content Input */}
                <div>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Update your tweet"
                        className="input-class p-2 w-full h-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-200 dark:bg-[#1a384b] focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />
                </div>

                {/* Success/Failure Message */}
                {updateSuccess !== null && (
                    <div
                        className={`text-center mt-4 text-lg font-semibold ${updateSuccess ? "text-green-500" : "text-red-500"}`}
                    >
                        {updateSuccess ? "Tweet updated successfully!" : "Failed to update tweet. Please try again."}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4">

                    <Button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        className={`flex-1 text-slate-100 ${isUpdating ? "bg-gray-500 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Updating..." : "Update Tweet"}
                    </Button>

                </div>
            </form>
        </div>
    );
};

export default EditTweet;
