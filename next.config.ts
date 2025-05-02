import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'image.mux.com',
			},
			{
				protocol: 'https',
				hostname: 'utfs.io',
			},
		],
		unoptimized: true,
	},
	reactStrictMode: false,
}

export default nextConfig
