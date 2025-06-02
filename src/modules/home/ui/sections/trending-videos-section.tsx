'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card'

export const TrendingVideosSection = () => {
	return (
		<Suspense fallback={<TrendingVideosSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<TrendingVideosSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

const TrendingVideosSectionSkeleton = () => {
	return (
		<div>
			<div className='grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6'>
				{Array.from({ length: 20 }).map((_, index) => (
					<VideoGridCardSkeleton key={index} />
				))}
			</div>
		</div>
	)
}

const TrendingVideosSectionSuspense = () => {
	const [videos, query] = trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	return (
		<div>
			<div className='grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6'>
				{videos.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoGridCard key={video.id} data={video} />
					))}
			</div>

			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				fetchNextPage={query.fetchNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
			/>
		</div>
	)
}
