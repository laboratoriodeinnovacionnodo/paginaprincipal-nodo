/** @type {import('next').NextConfig} */
const nextConfig = {
  turbo: false, // ⬅️ DESACTIVA TURBOPACK (la causa del error)
  output: "standalone",
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
