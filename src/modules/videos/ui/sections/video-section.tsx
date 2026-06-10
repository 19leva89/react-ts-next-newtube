'use client'

import { Suspense } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ErrorBoundary } from 'react-error-boundary'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { useTRPC } from '@/trpc/client'
import { VideoBanner } from '@/modules/videos/ui/components/video-banner'
import { VideoPlayer, VideoPlayerSkeleton } from '@/modules/videos/ui/components/video-player'
import { VideoTopRow, VideoTopRowSkeleton } from '@/modules/videos/ui/components/video-top-row'

interface Props {
	videoId: string
}

export const VideoSection = ({ videoId }: Props) => {
	return (
		<Suspense fallback={<VideoSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<VideoSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const VideoSectionSkeleton = () => {
	return (
		<>
			<VideoPlayerSkeleton />

			<VideoTopRowSkeleton />
		</>
	)
}

const VideoSectionSuspense = ({ videoId }: Props) => {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const { isSignedIn } = useAuth()
	const { data: video } = useSuspenseQuery(trpc.videos.getOne.queryOptions({ id: videoId }))

	const createView = useMutation(
		trpc.videoViews.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: videoId }))
			},
		}),
	)

	const handlePlay = () => {
		if (!isSignedIn) return

		createView.mutate({
			videoId,
		})
	}

	return (
		<>
			<div
				className={cn(
					'relative aspect-video overflow-hidden rounded-xl bg-black',
					video.muxStatus !== 'ready' && 'rounded-b-none',
				)}
			>
				<VideoPlayer
					autoPlay
					playbackId={video.muxPlaybackId}
					thumbnailUrl={video.thumbnailUrl}
					onPlay={handlePlay}
				/>
			</div>

			<VideoBanner status={video.muxStatus} />

			<VideoTopRow video={video} />
		</>
	)
}
