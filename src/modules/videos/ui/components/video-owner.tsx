'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui'
import { UserAvatar } from '@/components/shared'
import { VideoGetOneOutput } from '@/modules/videos/types'
import { UserInfo } from '@/modules/users/ui/components/user-info'
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription'
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button'

interface Props {
	user: VideoGetOneOutput['user']
	videoId: string
}

export const VideoOwner = ({ user, videoId }: Props) => {
	const { userId: clerkUserId, isLoaded } = useAuth()

	const isOwner = clerkUserId === user.clerkId

	const [mounted, setMounted] = useState<boolean>(false)

	const { isPending, onClick } = useSubscription({
		userId: user.id,
		isSubscribed: user.viewerSubscribed,
		fromVideoId: videoId,
	})

	// Only show the client-side rendered content after hydration is complete
	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<div className="flex items-center justify-between sm:justify-start gap-3 min-w-0">
			<Link prefetch href={`/users/${user.id}`}>
				<div className="flex items-center gap-3 min-w-0">
					<UserAvatar
						size="lg"
						name={user.name || 'User'}
						imageUrl={user.imageUrl || '/svg/user-placeholder.svg'}
					/>

					<div className="flex flex-col gap-1 min-w-0">
						<UserInfo size="lg" name={user.name || 'User'} />

						<span className="text-sm text-muted-foreground line-clamp-1">
							{user.subscriberCount} subscribers
						</span>
					</div>
				</div>
			</Link>

			{mounted ? (
				isOwner ? (
					<Button variant="secondary" className="rounded-full" asChild>
						<Link prefetch href={`/studio/videos/${videoId}`}>
							Edit video
						</Link>
					</Button>
				) : (
					<SubscriptionButton
						onClick={onClick}
						disabled={isPending || !isLoaded}
						isSubscribed={user.viewerSubscribed}
						className="flex-none"
					/>
				)
			) : (
				// Placeholder with roughly the same dimensions
				<div className="w-24 h-9" />
			)}
		</div>
	)
}
