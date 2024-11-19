"use client";
import useSavedTweets from "@/hooks/tweet/useSavedTweets";
import TweetCard from "./TweetCard";

const SavedTweets: React.FC = () => {
    const savedTweets = useSavedTweets()

    if (!savedTweets.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No saved tweets found!
            </div>
        )
    }

    return (
        <>
        <div className="p-2 my-2 text-lg text-center bg-blue-300 dark:bg-blue-700 shadow-md">
            Saved tweets
        </div>
            <div>
                {savedTweets.map((tweet) => {
                    return <TweetCard key={tweet._id} tweet={tweet} />
                })}
            </div>
        </>
    )
}
export default SavedTweets
