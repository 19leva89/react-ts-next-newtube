'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { useErrorToaster } from '@/hooks/use-error-toaster'
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
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const { toastError } = useErrorToaster()

	const queryOptions = trpc.subscriptions.getMany.infiniteQueryOptions(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	const {
		data: subscriptions,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteQuery(queryOptions)

	const unsubscribe = useMutation(
		trpc.subscriptions.remove.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(trpc.videos.getManySubscribed.queryFilter())
				await queryClient.invalidateQueries(trpc.users.getOne.queryFilter({ id: data.creatorId }))
				await queryClient.invalidateQueries(trpc.subscriptions.getMany.queryFilter())

				toast.success('Unsubscribed')
			},
			onError: (error) => {
				toastError(error, 'Unsubscribe')
			},
		}),
	)

	return (
		<>
			<div className='flex flex-col gap-4'>
				{subscriptions?.pages
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
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
			/>
		</>
	)
}
