import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import {
	PlaylistGridCard,
	PlaylistGridCardSkeleton,
} from '@/modules/playlists/ui/components/playlist-grid-card'

export const PlaylistSection = () => {
	return (
		<Suspense fallback={<PlaylistSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<PlaylistSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

export const PlaylistSectionSkeleton = () => {
	return (
		<div>
			<div className='grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6'>
				{Array.from({ length: 20 }).map((_, index) => (
					<PlaylistGridCardSkeleton key={index} />
				))}
			</div>
		</div>
	)
}

const PlaylistSectionSuspense = () => {
	const trpc = useTRPC()

	const queryOptions = trpc.playlists.getMany.infiniteQueryOptions(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	const { data: playlists, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(queryOptions)

	return (
		<div>
			<div className='grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6'>
				{playlists?.pages.flatMap((page) =>
					page.items.map((item) => <PlaylistGridCard key={item.id} playlist={item} />),
				)}
			</div>

			<InfiniteScroll
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
			/>
		</div>
	)
}
