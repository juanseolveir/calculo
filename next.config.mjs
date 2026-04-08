/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native module — must stay server-side only (Next.js 14 syntax)
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
