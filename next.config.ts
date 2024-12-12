import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i0.wp.com",
				pathname: "/**/*",
			},
			{
				protocol: "https",
				hostname: "m.media-amazon.com",
				pathname: "/**/*",
			},
			{
				protocol: "https",
				hostname: "www.itel-india.com",
				pathname: "/**/*",
			},
		],
	},
};

export default nextConfig;
