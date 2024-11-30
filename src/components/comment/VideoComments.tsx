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
    const [showAllComments, setShowAllCommnets] = useState(false)
    const [commentsCount, setCommentsCount] = useState(0)
    // The useVideoComments hook can listen to a "refreshTrigger" prop to refetch the data when needed
    const videoComments = useVideoComments(String(id), refreshTrigger);

    useEffect(() => {
        setCommentsCount(videoComments.length)
    }, [videoComments, refreshTrigger, id])

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
            await api.post(
                `/api/v1/comments/v/${id}`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            setRefreshTrigger((prev) => !prev);
            setNewComment('');
            setIsFocused(false);
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
    const reduceCommentCount = () => {
        setCommentsCount(prev => prev - 1)
    }
    return (
        <>
            <div>
                <div
                    className="text-base font-base px-3 py-2 mt-3 text-gray-800 dark:text-gray-200 sticky top-[6%] bg-slate-200 dark:bg-slate-800 bg-opacity-40 dark:bg-opacity-30 backdrop-blur-2xl z-10 flex justify-between items-center shadow-md"
                    onClick={() => setShowAllCommnets(prev => !prev)}
                >
                    <div>
                        Comments
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{commentsCount}</span>
                    </div>
                    <div className='text-gray-600 text-sm dark:text-gray-400 border border-gray-600 dark:border-gray-400  px-2 rounded-full'>
                        {showAllComments ? "Show less" : "Show all comments"}
                    </div>

                </div>


                {/* Comment input section */}
                <div className="my-4 px-1 flex gap-3 items-start">
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
                        videoComments.length > 1
                            ? showAllComments
                                ? (videoComments.map((comment) => (
                                    <CommentCard
                                        key={comment._id}
                                        comment={comment}
                                        reduceCommentCount={reduceCommentCount}
                                    />
                                )))
                                : (
                                <CommentCard
                                    key={videoComments[0]._id}
                                    comment={videoComments[0]}
                                    reduceCommentCount={reduceCommentCount}
                                />
                            )
                            : (
                            <CommentCard
                                key={videoComments[0]._id}
                                comment={videoComments[0]}
                                reduceCommentCount={reduceCommentCount}
                            />
                        )
                    ) : (
                        <p className="text-gray-500 text-sm ml-2">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default VideoComments;
