"use client";
import { useParams } from "next/navigation";
import TweetCard from "./TweetCard";
import useTweet from "@/hooks/tweet/useTweet";

const TweetPage: React.FC = () => {
    const { id } = useParams()
    const tweet = useTweet(String(id))

    if (!tweet) {
        return (
            <div className="text-center text-gray-500 p-4">
                No tweet found!
            </div>
        )
    }

    return (
        <div>
            <TweetCard tweet={tweet} isPreview={false} />
        </div>
    )
}
export default TweetPage;
