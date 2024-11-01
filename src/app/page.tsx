'use client'

import TweetCard from "@/components/tweet/TweetCard";

export default function Home() {

  const content = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam explicabo facilis quod veritatis nam cupiditate, illo officia at molestiae error et ab aspernatur natus, asperiores suscipit saepe ipsa quia laborum?"

  const images = [
    'https://images.pexels.com/photos/1480690/pexels-photo-1480690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    "https://cdn.pixabay.com/photo/2023/04/04/00/51/sunset-7898136_1280.jpg",
  ];
  let owner = {
    avatar: "https://cdn.pixabay.com/photo/2023/04/04/00/51/sunset-7898136_1280.jpg",
    username: "username",
    fullName: "User 122",
    _id: "12"
  }

  const tweet = {
    _id: '1223',
    content,
    images,
    owner,
    createdAt: '',
    updatedAt: "",
    __v: 54547,
    likes: [],
    comments: [],
    likesCount: 45355,
    commentsCount: 55,
    isLikedByUser: false,
    isSavedByUser: true,
  }


  return (
    <>
      <TweetCard {...tweet} />
      <TweetCard {...tweet} />
      <TweetCard {...tweet} />
      <TweetCard {...tweet} />
      <TweetCard {...tweet} />
      <TweetCard {...tweet} />
      <TweetCard {...tweet} />
    </>
  );
}
