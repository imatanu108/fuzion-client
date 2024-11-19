"use client";
import { useParams } from "next/navigation";
import PlayVideoCard from "./PlayVideoCard";
import useVideo from "@/hooks/video/useVideo";

const VideoPage: React.FC = () => {
    const { id } = useParams()
    const video = useVideo(String(id))

    if (!video) {
        return (
            <div className="text-center text-gray-500 p-4">
                No video found!
            </div>
        )
    }

    return (
        <div>
            <PlayVideoCard video={video} />
        </div>
    )
}
export default VideoPage;
