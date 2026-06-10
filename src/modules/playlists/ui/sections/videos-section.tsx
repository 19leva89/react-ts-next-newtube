'use client'

import { Suspense } from 'react'
import { toast } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoRowCard, VideoRowCardSkeleton } from '@/modules/videos/ui/components/video-row-card'
import { VideoGridCard, VideoGridCardSkeleton } from '@/modules/videos/ui/components/video-grid-card'

interface Props {
	playlistId: string
}

export const VideosSection = ({ playlistId }: Props) => {
	return (
		<Suspense fallback={<VideosSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<VideosSectionSuspense playlistId={playlistId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const VideosSectionSkeleton = () => {
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

const VideosSectionSuspense = ({ playlistId }: Props) => {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const queryOptions = trpc.playlists.getVideos.infiniteQueryOptions(
		{
			playlistId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	const { data: videos, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(queryOptions)

	const removeVideo = useMutation(
		trpc.playlists.removeVideo.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(trpc.playlists.getMany.queryFilter())
				await queryClient.invalidateQueries(
					trpc.playlists.getManyForVideo.queryFilter({ videoId: data.videoId }),
				)
				await queryClient.invalidateQueries(trpc.playlists.getOne.queryFilter({ id: data.playlistId }))
				await queryClient.invalidateQueries(
					trpc.playlists.getVideos.queryFilter({ playlistId: data.playlistId }),
				)

				toast.success('Video removed from playlist')
			},
			onError: (error) => {
				toast.error(error.message)
			},
		}),
	)

	return (
		<div>
			<div className='flex flex-col gap-4 gap-y-10 md:hidden'>
				{videos?.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoGridCard
							key={video.id}
							data={video}
							onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
						/>
					))}
			</div>

			<div className='hidden flex-col gap-4 md:flex'>
				{videos?.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoRowCard
							key={video.id}
							data={video}
							size='compact'
							onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })}
						/>
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
