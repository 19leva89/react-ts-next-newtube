import { useMemo } from 'react'
import { format, formatDistanceToNow } from 'date-fns'

import { Skeleton } from '@/components/ui'
import { VideoGetOneOutput } from '@/modules/videos/types'
import { VideoMenu } from '@/modules/videos/ui/components/video-menu'
import { VideoOwner } from '@/modules/videos/ui/components/video-owner'
import { VideoReactions } from '@/modules/videos/ui/components/video-reactions'
import { VideoDescription } from '@/modules/videos/ui/components/video-description'

interface Props {
	video: VideoGetOneOutput
}

export const VideoTopRowSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 mt-4">
			<div className="flex flex-col gap-2">
				<Skeleton className="w-4/5 md:w-2/5 h-6" />
			</div>
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-3 w-[70%]">
					<Skeleton className="size-10 rounded-full shrink-0" />

					<div className="flex flex-col gap-2 w-full">
						<Skeleton className="w-4/5 md:w-2/6 h-5" />
						<Skeleton className="w-3/5 md:w-1/5 h-5" />
					</div>
				</div>

				<Skeleton className="w-2/6 md:w-1/6 h-9 rounded-full" />
			</div>

			<div className="w-full h-30" />
		</div>
	)
}

export const VideoTopRow = ({ video }: Props) => {
	const compactViews = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'compact',
		}).format(video.viewCount)
	}, [video.viewCount])

	const expandedViews = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'standard',
		}).format(video.viewCount)
	}, [video.viewCount])

	const compactDate = useMemo(() => {
		return formatDistanceToNow(video.createdAt, { addSuffix: true })
	}, [video.createdAt])

	const expandedDate = useMemo(() => {
		return format(video.createdAt, 'd MMM yyyy')
	}, [video.createdAt])

	return (
		<div className="flex flex-col gap-4 mt-4">
			<h1 className="text-xl font-semibold">{video.title}</h1>

			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<VideoOwner user={video.user} videoId={video.id} />

				<div className="flex gap-2 pb-2 -mb-2 sm:pb-0 sm:mb-0 overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible">
					<VideoReactions
						videoId={video.id}
						likeCount={video.likeCount}
						dislikeCount={video.dislikeCount}
						viewerReaction={video.viewerReaction}
					/>

					<VideoMenu variant="secondary" videoId={video.id} />
				</div>
			</div>

			<VideoDescription
				compactViews={compactViews}
				expandedViews={expandedViews}
				compactDate={compactDate}
				expandedDate={expandedDate}
				description={video.description}
			/>
		</div>
	)
}
