import { useMemo } from 'react'
import { format, formatDistanceToNow } from 'date-fns'

import { VideoGetOneOutput } from '@/modules/videos/types'
import { VideoMenu } from '@/modules/videos/ui/components/video-menu'
import { VideoOwner } from '@/modules/videos/ui/components/video-owner'
import { VideoReactions } from '@/modules/videos/ui/components/video-reactions'
import { VideoDescription } from '@/modules/videos/ui/components/video-description'

interface Props {
	video: VideoGetOneOutput
}

export const VideoTopRow = ({ video }: Props) => {
	const compactViews = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'compact',
		}).format(1511151891)
	}, [])

	const expandedViews = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'standard',
		}).format(1511151891)
	}, [])

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
						likeCount={1}
						dislikeCount={34}
						// viewerReaction={video.viewerReaction}
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
