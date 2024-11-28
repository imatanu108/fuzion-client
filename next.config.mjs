/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
