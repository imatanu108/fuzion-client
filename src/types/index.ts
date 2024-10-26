export interface ApiResponse {
    status: number;
    message: string;
    data?: any;
}

export interface CurrentUserData {
    _id: string;
    username: string;
    email: string;
    bio: string;
    fullName: string;
    avatar?: string;
    coverImage?: string;
    watchHistory: Array<string>;
    createdAt: string;
    updatedAt: string;
    forgotPasswordOTP?: number | null;
    forgotPasswordOtpExpiry?: Date | null;
    __v?: number;
}

export interface FetchedUserData {
    _id: string;
    username: string;
    fullName: string;
    bio: string;
    avatar: string;
    coverImage?: string;
    subscribersCount: number;
    channelsSubscribedToCount: number;
    isSubscribed: boolean;
}

export interface Owner {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
}

export interface Likes {
    id: string,
    likedBy: Owner
}

export interface Comments {
    id: string
    content: string
    video?: string
    tweet?: string
    owner: Owner
    createdAt: string
    updatedAt: string
    __v: number
}

export interface Video {
    _id: string
    videoFile: string
    thumbnail: string
    title: string
    description: string
    duration: number
    views: number
    isPublished: boolean
    owner: string
    createdAt: string
    updatedAt: string
    __v: number
    likes: Array<Likes>
    comments: Array<Comments>
    likesCount: number
    commentsCount: number
    isLikedbyUser: boolean
}

export interface Tweet {
    _id: string;
    content: string;
    images: Array<string>;
    owner: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    likes: Array<Likes>;
    comments: Array<Comments>;
    likesCount: number;
    commentsCount: number;
    isLikedbyUser: boolean;
}
