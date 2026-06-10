'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoRowCard, VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card'
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card'

export const LikedSection = () => {
	return (
		<Suspense fallback={<LikedSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<LikedSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

const LikedSectionSkeleton = () => {
	return (
		<>
			<div className='flex flex-col gap-4 gap-y-10 md:hidden'>
				{Array.from({ length: 6 }).map((_, index) => (
					<VideoGridCardSkeleton key={index} />
				))}
			</div>

			<div className='hidden flex-col gap-4 md:flex'>
				{Array.from({ length: 6 }).map((_, index) => (
					<VideoRowCardSkeleton key={index} size='compact' />
				))}
			</div>
		</>
	)
}

const LikedSectionSuspense = () => {
	const trpc = useTRPC()

	const queryOptions = trpc.playlists.getLiked.infiniteQueryOptions(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)
	const { data: videos, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(queryOptions)

	return (
		<div>
			<div className='flex flex-col gap-4 gap-y-10 md:hidden'>
				{videos?.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoGridCard key={video.id} data={video} />
					))}
			</div>

			<div className='hidden flex-col gap-4 md:flex'>
				{videos?.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoRowCard key={video.id} data={video} size='compact' />
					))}
			</div>

			<InfiniteScroll
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
			/>
		</div>
	)
}
