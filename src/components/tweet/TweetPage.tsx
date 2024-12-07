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
                className="text-lg text-center font-medium mx-2 mt-2 mb-4 py-1 bg-blue-400 text-slate-50 dark:bg-blue-600 dark:text-slate-200"
            >
                You Might Also Like
            </div>
            <LoadTweets />
        </div>
    )
}
export default TweetPage;
