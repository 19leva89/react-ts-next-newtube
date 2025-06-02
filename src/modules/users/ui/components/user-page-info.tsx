import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth, useClerk } from '@clerk/nextjs'

import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/shared'
import { Button, Skeleton } from '@/components/ui'
import { UserGetOneOutput } from '@/modules/users/types'
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription'
import { SubscriptionButton } from '@/modules/subscriptions/ui/components/subscription-button'

interface Props {
	user: UserGetOneOutput
}

export const UserPageInfoSkeleton = () => {
	return (
		<div className='py-6'>
			{/* Mobile layout */}
			<div className='flex flex-col space-y-4 md:hidden'>
				<div className='flex items-center gap-3'>
					<Skeleton className='size-15 rounded-full' />

					<div className='min-w-0 flex-1'>
						<Skeleton className='h-6 w-32' />
						<Skeleton className='mt-1 h-4 w-48' />
					</div>
				</div>

				<Skeleton className='mt-3 h-10 w-full rounded-full' />
			</div>

			{/* Desktop layout */}
			<div className='hidden items-start gap-4 md:flex'>
				<Skeleton className='size-40 rounded-full' />

				<div className='min-w-0 flex-1'>
					<Skeleton className='h-8 w-64' />
					<Skeleton className='mt-4 h-5 w-48' />
					<Skeleton className='mt-3 h-10 w-32 rounded-full' />
				</div>
			</div>
		</div>
	)
}

export const UserPageInfo = ({ user }: Props) => {
	const { userId: clerkUserId, isLoaded } = useAuth()

	const { isPending, onClick } = useSubscription({
		userId: user.id,
		isSubscribed: user.viewerSubscribed,
	})

	const [mounted, setMounted] = useState<boolean>(false)

	const clerk = useClerk()
	const isOwner = clerkUserId === user.clerkId

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<div className='py-6'>
			{/* Mobile layout */}
			<div className='flex flex-col space-y-4 md:hidden'>
				<div className='flex items-center gap-3'>
					<UserAvatar
						size='lg'
						name={user.name}
						imageUrl={user.imageUrl || '/svg/user-placeholder.svg'}
						onClick={() => {
							if (isOwner) {
								clerk.openUserProfile()
							}
						}}
						className='size-15'
					/>

					<div className='min-w-0 flex-1'>
						<h1 className='text-xl font-bold'>{user.name}</h1>

						<div className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
							<span>{user.subscriberCount} subscribers</span>

							<span>&bull;</span>

							<span>{user.videoCount} videos</span>
						</div>
					</div>
				</div>

				{mounted && isOwner ? (
					<Button variant='secondary' className='mt-3 w-full rounded-full' asChild>
						<Link prefetch href='/studio'>
							Go to studio
						</Link>
					</Button>
				) : (
					<SubscriptionButton
						onClick={onClick}
						disabled={isPending || !isLoaded}
						isSubscribed={user.viewerSubscribed}
						className='mt-3 w-full'
					/>
				)}
			</div>

			{/* Desktop layout */}
			<div className='hidden items-start gap-4 md:flex'>
				<UserAvatar
					size='xl'
					name={user.name}
					imageUrl={user.imageUrl || '/svg/user-placeholder.svg'}
					onClick={() => {
						if (isOwner) {
							clerk.openUserProfile()
						}
					}}
					className={cn(
						mounted && isOwner && 'cursor-pointer transition-opacity duration-300 hover:opacity-80',
					)}
				/>

				<div className='min-w-0 flex-1'>
					<h1 className='text-4xl font-bold'>{user.name}</h1>

					<div className='mt-3 flex items-center gap-1 text-sm text-muted-foreground'>
						<span>{user.subscriberCount} subscribers</span>

						<span>&bull;</span>

						<span>{user.videoCount} videos</span>
					</div>

					{mounted && isOwner ? (
						<Button variant='secondary' className='mt-3 rounded-full' asChild>
							<Link prefetch href='/studio'>
								Go to studio
							</Link>
						</Button>
					) : (
						<SubscriptionButton
							disabled={isPending}
							onClick={onClick}
							isSubscribed={user.viewerSubscribed}
							className='mt-3'
						/>
					)}
				</div>
			</div>
		</div>
	)
}
