/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    // Allow Cloudinary-hosted assets so they can be served through
    // next/image (optimized WebP/AVIF, responsive srcset) where desired.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
