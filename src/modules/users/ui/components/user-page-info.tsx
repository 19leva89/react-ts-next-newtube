import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

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
		<div className="py-6">
			<div className="flex flex-col space-y-4 md:hidden">
				<div className="flex items-center gap-3">
					<Skeleton className="h-[60px] w-[60px] rounded-full" />

					<div className="flex-1 min-w-0">
						<Skeleton className="h-[40px] w-[200px]" />
						<Skeleton className="h-[20px] w-[100px] mt-1" />
						<Skeleton className="h-[40px] w-full mt-1" />
					</div>
				</div>
			</div>

			<div className="hidden md:flex items-start gap-4">
				<Skeleton className="h-[160px] w-[160px] rounded-full" />

				<div className="flex-1 min-w-0">
					<Skeleton className="h-[40px] w-[200px]" />
					<Skeleton className="h-[20px] w-[100px] mt-1" />
					<Skeleton className="h-[20px] w-[100px] mt-1" />
				</div>
			</div>
		</div>
	)
}

export const UserPageInfo = ({ user }: Props) => {
	const { userId: clerkUserId, isLoaded } = useAuth()

	const isOwner = clerkUserId === user.clerkId

	const [mounted, setMounted] = useState<boolean>(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const { isPending, onClick } = useSubscription({
		userId: user.id,
		isSubscribed: user.viewerSubscribed,
	})

	return (
		<div className="py-6">
			{/* Mobile layout */}
			<div className="flex flex-col space-y-4 md:hidden">
				<div className="flex items-center gap-3">
					<UserAvatar
						size="lg"
						name={user.name}
						imageUrl={user.imageUrl || '/svg/user-placeholder.svg'}
						onClick={() => {}}
						className="size-15"
					/>

					<div className="flex-1 min-w-0">
						<h1 className="text-xl font-bold">{user.name}</h1>

						<div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
							<span>{user.subscriberCount} subscribers</span>

							<span>&bull;</span>

							<span>{user.videoCount} videos</span>
						</div>
					</div>
				</div>

				{mounted && isOwner ? (
					<Button variant="secondary" className="w-full mt-3 rounded-full" asChild>
						<Link prefetch href="/studio">
							Go to studio
						</Link>
					</Button>
				) : (
					<SubscriptionButton onClick={onClick} disabled={isPending} isSubscribed={user.viewerSubscribed} />
				)}
			</div>

			{/* Desktop layout */}
			<div className="hidden md:flex items-start gap-4">
				<UserAvatar
					size="xl"
					name={user.name}
					imageUrl={user.imageUrl || '/svg/user-placeholder.svg'}
					onClick={() => {}}
					className={cn(
						mounted && isOwner && 'cursor-pointer hover:opacity-80 transition-opacity duration-300',
					)}
				/>

				<div className="flex-1 min-w-0">
					<h1 className="text-4xl font-bold">{user.name}</h1>

					<div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
						<span>{user.subscriberCount} subscribers</span>

						<span>&bull;</span>

						<span>{user.videoCount} videos</span>
					</div>

					{mounted && isOwner ? (
						<Button variant="secondary" className="mt-3 rounded-full" asChild>
							<Link prefetch href="/studio">
								Go to studio
							</Link>
						</Button>
					) : (
						<SubscriptionButton
							disabled={isPending}
							onClick={onClick}
							isSubscribed={user.viewerSubscribed}
							className="mt-3 rounded-full"
						/>
					)}
				</div>
			</div>
		</div>
	)
}
