'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
// import { useUser } from '@/hooks/use-user'
import { Skeleton } from '@/components/ui'
import { VideoBanner } from '@/modules/videos/ui/components/video-banner'
import { VideoPlayer } from '@/modules/videos/ui/components/video-player'
import { VideoTopRow } from '@/modules/videos/ui/components/video-top-row'

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
			<div className="relative aspect-video rounded-xl bg-black overflow-hidden" />

			<div className="flex flex-col gap-4 mt-4">
				<Skeleton className="w-40 h-10" />

				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<Skeleton className="size-10 rounded-full" />

					<div className="flex gap-2 pb-2 -mb-2 sm:pb-0 sm:mb-0 overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible">
						<Skeleton className="w-40 h-10 rounded-l-full rounded-r-full" />
						<Skeleton className="size-10 rounded-full" />
					</div>
				</div>

				<Skeleton className="w-full h-40" />
			</div>
		</>
	)
}

const VideoSectionSuspense = ({ videoId }: Props) => {
	// const { userId } = useUser()

	const utils = trpc.useUtils()
	const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId })

	// const createView = trpc.videoViews.create.useMutation({
	// 	onSuccess: () => {
	// 		utils.videos.getOne.invalidate({ id: videoId })
	// 	},
	// })

	// const handlePlay = () => {
	// 	if (!userId) return

	// 	createView.mutate({
	// 		videoId,
	// 	})
	// }

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
					// onPlay={handlePlay}
				/>
			</div>

			<VideoBanner status={video.muxStatus} />

			<VideoTopRow video={video} />
		</>
	)
}
