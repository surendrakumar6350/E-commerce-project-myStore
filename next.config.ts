/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Fast builds
  swcMinify: true,

  // ✅ Enable compression
  compress: true,

  // ✅ Image Optimization (MOST IMPORTANT)
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 64, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Disable optimization to allow external image hosts (avoids host validation)
    unoptimized: true,
  },

  // ⚠️ Typescript (keep as is for now)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
