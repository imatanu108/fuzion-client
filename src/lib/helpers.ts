export const getUploadAge = (createdAt: string): string => {
    const now: Date = new Date();
    const uploadDate: Date = new Date(createdAt);
    const diffInMs: number = now.getTime() - uploadDate.getTime();
    
    const secondsAgo: number = Math.floor(diffInMs / 1000);
    const minutesAgo: number = Math.floor(secondsAgo / 60);
    const hoursAgo: number = Math.floor(minutesAgo / 60);
    const daysAgo: number = Math.floor(hoursAgo / 24);
    const monthsAgo: number = Math.floor(daysAgo / 30);
    const yearsAgo: number = Math.floor(daysAgo / 365); // More accurate year calculation

    if (yearsAgo > 0) return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
    if (monthsAgo > 0) return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
    if (daysAgo > 0) return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
    if (hoursAgo > 0) return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
    if (minutesAgo > 0) return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
    if (secondsAgo > 0) return secondsAgo === 1 ? '1 second ago' : `${secondsAgo} seconds ago`;

    return 'Just now'; // For cases where the time difference is negligible
};

export const formatNumber = (num: number): string => {
    if (num < 1000) return String(num);
    if (num < 1_000_000) return `${Math.floor(num / 1000)}K`;
    if (num < 1_000_000_000) return `${Math.floor(num / 1_000_000)}M`;
    return `${Math.floor(num / 1_000_000_000)}B`;
};

export const formatDuration = (durationInSeconds: number): string => {
    const hours: number = Math.floor(durationInSeconds / 3600);
    const minutes: number = Math.floor((durationInSeconds % 3600) / 60);
    const seconds: number = durationInSeconds % 60;

    // Format the output
    const formattedHours: string = hours > 0 ? `${hours}:` : '';
    const formattedMinutes: string = minutes.toString().padStart(2, '0');
    const formattedSeconds: string = seconds.toString().padStart(2, '0');

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};

