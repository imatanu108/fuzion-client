import LoadVideos from "@/components/video/LoadVideos";
import VideoPage from "@/components/video/VideoPage";
import VideoComments from "../../../components/comment/VideoComments";
export default function Video() {
  return (
    <>
      <VideoPage />
      <VideoComments />
      <div
        className="text-lg text-center bg-blue-300 dark:bg-blue-700 py-1 font-medium mx-2 mt-2 mb-4 text-gray-800 dark:text-gray-200"
      >
        Explore more videos
      </div>
      <LoadVideos />
    </>
  );
}