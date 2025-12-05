/** @type {import('next').NextConfig} */
const nextConfig = {
  turbo: false, // ⬅️ DESACTIVA TURBOPACK (la causa del error)

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbo: {
    enabled: false
  }
};

export default nextConfig;
