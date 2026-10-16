/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "vfaivkobxxwuujvqdoei.supabase.co",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "najmifolio.vercel.app",
          },
        ],
        destination: "https://najmifaza.my.id/:path*",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
