export interface ApiResponse {
    status: number;
    message: string;
    data?: any;
}

export interface ApiError {
    statusCode: number;      
    message: string;
    data: any | null;
    error: any[];
}

export interface CurrentUserData {
    _id: string;
    username: string;
    email: string;
    bio: string;
    fullName: string;
    avatar: string;
    coverImage: string;
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
    subscribersCount?: number;
    channelsSubscribedToCount?: number;
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

export interface Comment {
    _id: string
    content: string
    video?: string
    tweet?: string
    owner: Owner
    createdAt: string
    updatedAt: string
    __v: number
    likesCount?: number
    isLikedByUser?: boolean
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
    owner: Owner
    createdAt: string
    updatedAt: string
    __v: number
    likes?: Array<Likes>
    comments?: Array<Comment>
    likesCount?: number
    commentsCount?: number
    isLikedByUser?: boolean
}

export interface Tweet {
    _id: string;
    content: string;
    images: Array<string>;
    owner: Owner;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    likes: Array<Likes>;
    comments: Array<Comment>;
    likesCount: number;
    commentsCount: number;
    isLikedByUser: boolean;
    isSavedByUser: boolean;
}

export interface Playlist {
    _id: string
    name: string
    description: string
    videos: Array<Video>
    owner: Owner
    isPublic: boolean
    createdAt: string;
    updatedAt: string;
    __v?: number;
}
