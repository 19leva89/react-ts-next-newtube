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
	// cacheComponents: true,
	reactCompiler: true,
	reactStrictMode: false,
	poweredByHeader: false, // remove X-Powered-By
	compress: true, // gzip compression
}

export default nextConfig
