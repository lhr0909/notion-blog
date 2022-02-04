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
      {
        source: '/gamedev/2014/02/24/clappy-bird.html',
        destination: 'https://lhr0909.github.io/gamedev/2014/02/24/clappy-bird.html',
        permanent: true,
      },
      {
        source: '/development/2014/02/27/dev-env.html',
        destination: 'https://lhr0909.github.io/development/2014/02/27/dev-env.html',
        permanent: true,
      },
      {
        source: '/poker/2014/06/12/gg-stars.html',
        destination: 'https://lhr0909.github.io/poker/2014/06/12/gg-stars.html',
        permanent: true,
      },
      {
        source: '/development/2015/12/21/frontend-basics.html',
        destination: 'https://lhr0909.github.io/development/2015/12/21/frontend-basics.html',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
