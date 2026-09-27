/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/merchant/store',
        destination: '/stores',
        permanent: true,
      },
      {
        source: '/store',
        destination: '/stores',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;