import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'standalone',
  trailingSlash: true,
  async rewrites() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    return [
      {
        source: `${basePath}/pay/${process.env.PAY_TRADE_NO || ':tradeNo'}`,
        destination: `/pay/${process.env.PAY_TRADE_NO || ':tradeNo'}`,
      },
      {
        source: `${basePath}/cashier/${process.env.CASHIER_TRADE_NO || ':tradeNo'}`,
        destination: `/cashier/${process.env.CASHIER_TRADE_NO || ':tradeNo'}`,
      },
      {
        source: `${basePath}/test-pay`,
        destination: `/test-pay`,
      },
      {
        source: `${basePath}/admin/login`,
        destination: `/admin/login`,
      },
      {
        source: `${basePath}/admin`,
        destination: `/admin`,
      },
      {
        source: `${basePath}/api/:path*`,
        destination: `/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
