/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [{
      source : "/api/kakao_map",
      destination: `https://dapi.kakao.com/v2/maps/sdk.js?appkey=4c939066d8cc2e1b0f9ee47df9749601&autoload=false`
    },
    {
      source : "/jira/:path*",
      destination: `https://coblah.atlassian.net/rest/agile/1.0/:path*`
    }
    ];
  },
}

module.exports = nextConfig
