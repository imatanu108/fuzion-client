"use client";
import { useParams } from "next/navigation";
import PlayVideoCard from "./PlayVideoCard";
import useVideo from "@/hooks/video/useVideo";
import { useEffect, useState } from "react";
import { RootState } from '@/store/store';
import { useSelector } from "react-redux";

const VideoPage: React.FC = () => {
    const { id } = useParams()
    const video = useVideo(String(id))
    const currentUserData = useSelector((state: RootState) => state.user.currentUserData)
    const [ownContent, setOwnContent] = useState(false)
    const [privateVideo, setPrivateVideo] = useState(false)

    useEffect(() => {
        if (currentUserData?._id === video?.owner._id) {
            setOwnContent(true);
        } else {
            setOwnContent(false);
        }
    }, [currentUserData, video?.owner._id]);

    useEffect(() => {
        if (!video?.isPublished && !ownContent) {
            setPrivateVideo(true);
        } else {
            setPrivateVideo(false);
        }
    }, [video?.isPublished, ownContent]);


    if (!video) {
        return (
            <div className="text-center text-gray-500 p-4">
                Loading...
            </div>
        )
    }

    if (privateVideo) {
        return (
            <div className="text-center text-gray-500 p-4">
                This video is private.
            </div>
        );
    }

    return (
        <div>
            <PlayVideoCard video={video} />
        </div>
    )
}
export default VideoPage;

