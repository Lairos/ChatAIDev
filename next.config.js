/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    ORGUUID: process.env.ORGUUID,
    APPUUID: process.env.APPUUID,
    APPKEY: process.env.APPKEY,
    APPSECRET: process.env.APPSECRET,
  },
  experimental: {
    // 其他實驗性功能配置
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig
