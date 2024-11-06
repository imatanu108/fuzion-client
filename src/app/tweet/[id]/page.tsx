import LoadTweets from "@/components/tweet/LoadTweets";
import TweetPage from "@/components/tweet/TweetPage";
import TweetComments from "../../../components/comment/TweetComments";

export default function Tweet() {
  return (
    <>
      <TweetPage />
      <TweetComments />
      <div
        className="text-lg text-center bg-blue-300 dark:bg-blue-700 py-1 font-medium mx-2 mt-2 mb-4 text-gray-800 dark:text-gray-200"
      >
        Explore more tweets
      </div>
      <LoadTweets />
    </>
  );
}