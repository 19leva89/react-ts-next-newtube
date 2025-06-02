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
		<div className='flex min-w-0 items-center justify-between gap-3 sm:justify-start'>
			<Link prefetch href={`/users/${user.id}`}>
				<div className='flex min-w-0 items-center gap-3'>
					<UserAvatar
						size='lg'
						name={user.name || 'User'}
						imageUrl={user.imageUrl || '/svg/user-placeholder.svg'}
					/>

					<div className='flex min-w-0 flex-col gap-1'>
						<UserInfo size='lg' name={user.name || 'User'} />

						<span className='line-clamp-1 text-sm text-muted-foreground'>
							{user.subscriberCount} subscribers
						</span>
					</div>
				</div>
			</Link>

			{mounted ? (
				isOwner ? (
					<Button variant='secondary' className='rounded-full' asChild>
						<Link prefetch href={`/studio/videos/${videoId}`}>
							Edit video
						</Link>
					</Button>
				) : (
					<SubscriptionButton
						onClick={onClick}
						disabled={isPending || !isLoaded}
						isSubscribed={user.viewerSubscribed}
						className='flex-none'
					/>
				)
			) : (
				// Placeholder with roughly the same dimensions
				<div className='h-9 w-24' />
			)}
		</div>
	)
}
