'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoRowCard, VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card'
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card'

interface Props {
	videoId: string
	isManual?: boolean
}

const SuggestionsSectionSkeleton = () => {
	return (
		<>
			<div className='block space-y-10 md:hidden'>
				{Array.from({ length: 6 }).map((_, index) => (
					<VideoGridCardSkeleton key={index} />
				))}
			</div>

			<div className='hidden space-y-3 md:block'>
				{Array.from({ length: 6 }).map((_, index) => (
					<VideoRowCardSkeleton key={index} size='compact' />
				))}
			</div>
		</>
	)
}

export const SuggestionsSection = ({ videoId, isManual }: Props) => {
	return (
		<Suspense fallback={<SuggestionsSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
			</ErrorBoundary>
		</Suspense>
	)
}

const SuggestionsSectionSuspense = ({ videoId, isManual }: Props) => {
	const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
		{
			videoId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage['nextCursor'],
		},
	)

	return (
		<>
			<div className='block space-y-10 md:hidden'>
				{suggestions.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoGridCard key={video.id} data={video} />
					))}
			</div>

			<div className='hidden space-y-3 md:block'>
				{suggestions.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoRowCard key={video.id} data={video} size='compact' />
					))}
			</div>

			<InfiniteScroll
				isManual={isManual}
				hasNextPage={query.hasNextPage}
				fetchNextPage={query.fetchNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
			/>
		</>
	)
}
