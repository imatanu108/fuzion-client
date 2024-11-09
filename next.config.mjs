/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com', 'cdn.pixabay.com', "images.pexels.com"],
      minimumCacheTTL: 60,
    },
  };
  
  export default nextConfig;
  