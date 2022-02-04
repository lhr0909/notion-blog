/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // whitelist notion images domain
    domains: ['s3.us-west-2.amazonaws.com'],
    minimumCacheTTL: 60 * 60 * 24 * 3, // 3 days
  },
  async redirects() {
    return [
      {
        source: '/poker/2017/09/03/run-equilab-on-macos-with-winebottler.html',
        destination: '/posts/run-equilab-on-macos-with-winebottler',
        permanent: true,
      },
      {
        source: '/development/react/2018/04/24/react-ie.html',
        destination: '/posts/react-ie',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
