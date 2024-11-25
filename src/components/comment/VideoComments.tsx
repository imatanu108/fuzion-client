"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { RootState } from '@/store/store';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import useVideoComments from '@/hooks/comment/useVideoComments';
import CommentCard from './CommentCard';

const VideoComments: React.FC = () => {
    const { id } = useParams();
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData);
    const router = useRouter();

    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserData);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // The useVideoComments hook can listen to a "refreshTrigger" prop to refetch the data when needed
    const videoComments = useVideoComments(String(id), refreshTrigger);

    useEffect(() => {
        setIsLoggedIn(!!currentUserData);
    }, [currentUserData]);

    const handleAddComment = async () => {
        if (!isLoggedIn) {
            router.push("/user/auth/login");
            return;
        }

        if (!newComment.trim()) {
            alert("Comment content cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(
                `/api/v1/comments/v/${id}`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            setRefreshTrigger((prev) => !prev); // Toggle refresh to refetch data
            setNewComment(''); // Clear the input after successful comment
            setIsFocused(false); // Close the expanded view after posting
            console.log(response.data.message);
        } catch (error: any) {
            console.error("Error adding comment:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelComment = () => {
        setNewComment('');
        setIsFocused(false); // Collapse the comment box on cancel
    };

    return (
        <>
            <h3 className="text-base font-medium ml-2 mt-4 text-gray-800 dark:text-gray-200">Comments</h3>

            {/* Comment input section */}
            <div className="my-4 flex gap-3 items-start">
                <div className="flex-grow mx-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        rows={isFocused ? 3 : 1}
                        className={`w-full border text-base font-normal border-gray-300 dark:border-gray-700 p-2 rounded-xl resize-none placeholder-gray-500
                            ${isFocused ? "focus:outline-none focus:ring-1 bg-slate-200 dark:bg-slate-800 focus:ring-blue-500" : "bg-transparent"}`}
                        placeholder="Add a public comment..."
                    />
                    {isFocused && (
                        <div className="mt-2 flex justify-end gap-2">
                            <Button
                                onClick={handleCancelComment}
                                disabled={loading}
                                className="px-4 py-2 w-20 rounded-full text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddComment}
                                disabled={loading || !newComment.trim()}
                                className={`px-4 py-2 w-20 rounded-full text-white font-semibold transition-all duration-200
                                    ${loading || !newComment.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                            >
                                {loading ? "Adding..." : "Post"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Display comments */}
            <div>
                {videoComments && videoComments.length ? (
                    videoComments.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm ml-2">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </>
    );
};

export default VideoComments;
