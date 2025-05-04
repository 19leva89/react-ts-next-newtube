'use client'

import { Suspense } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ErrorBoundary } from 'react-error-boundary'

import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
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
	const { isSignedIn } = useAuth()

	const utils = trpc.useUtils()
	const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId })

	const createView = trpc.videoViews.create.useMutation({
		onSuccess: () => {
			utils.videos.getOne.invalidate({ id: videoId })
		},
	})

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
					'relative aspect-video bg-black rounded-xl overflow-hidden',
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
