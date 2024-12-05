"use client";
import { useParams } from "next/navigation";
import TweetCard from "./TweetCard";
import useTweet from "@/hooks/tweet/useTweet";
import LoadTweets from "@/components/tweet/LoadTweets";
import TweetComments from "../comment/TweetComments";

const TweetPage: React.FC = () => {
    const { id } = useParams()
    const tweet = useTweet(String(id))

    if (!tweet) {
        return (
            <div className="text-center text-gray-500 p-4">
                Loading...
            </div>
        )
    }

    return (
        <div>
            <TweetCard tweet={tweet} isPreview={false} />
            <TweetComments />
            <div
                className="text-lg text-center bg-blue-300 dark:bg-blue-700 py-1 font-medium mx-2 mt-2 mb-4 text-gray-800 dark:text-gray-200"
            >
                Explore more tweets
            </div>
            <LoadTweets />
        </div>
    )
}
export default TweetPage;
