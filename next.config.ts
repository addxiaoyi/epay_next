import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/pay";

const nextConfig: NextConfig = {
  basePath,
  output: "standalone",
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: `${basePath}/pay/:tradeNo`,
        destination: `/pay/:tradeNo`,
      },
      {
        source: `${basePath}/cashier/:tradeNo`,
        destination: `/cashier/:tradeNo`,
      },
      {
        source: `${basePath}/test-pay`,
        destination: `/test-pay`,
      },
      {
        source: `${basePath}/pay/start/:tradeNo`,
        destination: `/pay/start/:tradeNo`,
      },
      {
        source: `${basePath}/admin/login`,
        destination: `/admin/login`,
      },
      {
        source: `${basePath}/admin/:path*`,
        destination: `/admin/:path*`,
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
