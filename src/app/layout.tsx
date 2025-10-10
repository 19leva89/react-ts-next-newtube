import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'

import { Toaster } from '@/components/ui'
import { TRPCProviderClient } from '@/providers/trpc-provider-client'

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
		<ClerkProvider afterSignOutUrl='/'>
			<html lang='en' suppressHydrationWarning>
				<body className={`${inter.className} antialiased`}>

					<TRPCProviderClient>{children}</TRPCProviderClient>

					<Toaster position='bottom-right' expand={false} richColors />

					{/* Allow track page views for Vercel */}
				<Analytics />
				</body>
			</html>
		</ClerkProvider>
	)
}

export default RootLayout
