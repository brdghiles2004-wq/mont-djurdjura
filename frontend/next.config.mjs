
const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mont-djurdjura-api.onrender.com/api"
)
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${API_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
