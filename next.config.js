/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
