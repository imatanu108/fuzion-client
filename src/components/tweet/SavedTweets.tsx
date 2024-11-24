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
            <div className="pl-4 flex items-center justify-between border-b border-[#46626f7a] pb-2 mb-4">
                <h1 className="text-xl font-semibold">Saved tweets</h1>
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
