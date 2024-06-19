/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@node-rs/argon2'],

  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
