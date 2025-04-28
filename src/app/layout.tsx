import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'
// import { ClerkProvider } from '@clerk/nextjs'
// import { SpeedInsights } from "@vercel/speed-insights/next";

import { Toaster } from '@/components/ui'
// import { TRPCProviderClient } from '@/providers'

import './globals.css'

const inter = Inter({
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'NewTube | Your favorite videos, right here',
	description:
		'NewTube is a video sharing platform that allows you to share your favorite videos with your friends and family.',
	category: 'social',
	robots: {
		index: true,
		follow: true,
	},
}

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		// <ClerkProvider afterSignOutUrl={'/'}>
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<Toaster />

				{/* <TRPCProviderClient> */}
				{children}
				{/* </TRPCProviderClient> */}
			</body>
		</html>
		// </ClerkProvider>
	)
}

export default RootLayout
