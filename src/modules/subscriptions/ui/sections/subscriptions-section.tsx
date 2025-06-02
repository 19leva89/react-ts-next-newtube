'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { SubscriptionItem, SubscriptionItemSkeleton } from '@/modules/subscriptions/ui/components'

export const SubscriptionsSection = () => {
	return (
		<Suspense fallback={<SubscriptionsSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<SubscriptionsSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

const SubscriptionsSectionSkeleton = () => {
	return (
		<div className='flex flex-col gap-4'>
			{Array.from({ length: 8 }).map((_, index) => (
				<SubscriptionItemSkeleton key={index} />
			))}
		</div>
	)
}

const SubscriptionsSectionSuspense = () => {
	const utils = trpc.useUtils()

	const [data, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	const unsubscribe = trpc.subscriptions.remove.useMutation({
		onSuccess: (data) => {
			utils.videos.getManySubscribed.invalidate()
			utils.users.getOne.invalidate({ id: data.creatorId })
			utils.subscriptions.getMany.invalidate()

			toast.success('Unsubscribed')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	return (
		<>
			<div className='flex flex-col gap-4'>
				{data.pages
					.flatMap((page) => page.items)
					.map((subscription) => (
						<Link prefetch key={subscription.creatorId} href={`/users/${subscription.user.id}`}>
							<SubscriptionItem
								name={subscription.user.name}
								imageUrl={subscription.user.imageUrl || '/svg/user-placeholder.svg'}
								subscriberCount={subscription.user.subscriberCount}
								disabled={unsubscribe.isPending}
								onUnsubscribe={() => unsubscribe.mutate({ userId: subscription.creatorId })}
							/>
						</Link>
					))}
			</div>

			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
			/>
		</>
	)
}
