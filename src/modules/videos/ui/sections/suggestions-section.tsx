'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { Skeleton } from '@/components/ui'
// import { DEFAULT_LIMIT } from '@/constants'
// import { VideoRowCard } from '../components/video-row-card'
// import { VideoGridCard } from '../components/video-grid-card'
// import { InfiniteScroll } from '@/components/infinite-scroll'

interface Props {
	videoId: string
	isManual?: boolean
}

export const SuggestionsSection = ({ videoId, isManual }: Props) => {
	return (
		<Suspense fallback={<Skeleton className="h-50" />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
			</ErrorBoundary>
		</Suspense>
	)
}

const SuggestionsSectionSuspense = ({ videoId, isManual }: Props) => {
	// const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
	// 	{
	// 		videoId,
	// 		limit: DEFAULT_LIMIT,
	// 	},
	// 	{
	// 		getNextPageParam: (lastPage) => lastPage['nextCursor'],
	// 	},
	// )

	return (
		<>
			<div className="hidden md:block space-y-3">
				{/* {suggestions.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoRowCard key={video.id} data={video} size="compact" />
					))} */}
			</div>

			<div className="block md:hidden space-y-10">
				{/* {suggestions.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoGridCard key={video.id} data={video} />
					))} */}
			</div>

			{/* <InfiniteScroll
				isManual={isManual}
				hasNextPage={query.hasNextPage}
				fetchNextPage={query.fetchNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
			/> */}
		</>
	)
}
