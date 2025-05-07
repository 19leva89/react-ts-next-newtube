'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoRowCard, VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card'
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card'

interface Props {
	query: string | undefined
	categoryId: string | undefined
}

export const ResultsSection = (props: Props) => {
	return (
		<Suspense
			// search no caching
			key={`${props.query}-${props.categoryId}`}
			fallback={<ResultsSectionSkeleton />}
		>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<ResultsSectionSuspense {...props} />
			</ErrorBoundary>
		</Suspense>
	)
}

export const ResultsSectionSkeleton = () => {
	return (
		<>
			<div className="flex flex-col gap-4 gap-y-10 p-4 pt-6 md:hidden">
				{Array.from({ length: 6 }, (_, index) => (
					<VideoGridCardSkeleton key={index} />
				))}
			</div>

			<div className="hidden md:flex flex-col gap-4">
				{Array.from({ length: 6 }, (_, index) => (
					<VideoRowCardSkeleton key={index} />
				))}
			</div>
		</>
	)
}

const ResultsSectionSuspense = ({ query, categoryId }: Props) => {
	const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
		{
			query: query,
			categoryId: categoryId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	return (
		<>
			<div className="flex flex-col gap-4 gap-y-10 md:hidden">
				{results.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoGridCard key={video.id} data={video} />
					))}
			</div>

			<div className="hidden md:flex flex-col gap-4">
				{results.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoRowCard key={video.id} data={video} />
					))}
			</div>

			<InfiniteScroll
				hasNextPage={resultsQuery.hasNextPage}
				fetchNextPage={resultsQuery.fetchNextPage}
				isFetchingNextPage={resultsQuery.isFetchingNextPage}
			/>
		</>
	)
}
