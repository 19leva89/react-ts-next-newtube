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
		<div className='mt-4 flex flex-col gap-4'>
			<div className='flex flex-col gap-2'>
				<Skeleton className='h-6 w-4/5 md:w-2/5' />
			</div>
			<div className='flex w-full items-center justify-between'>
				<div className='flex w-[70%] items-center gap-3'>
					<Skeleton className='size-10 shrink-0 rounded-full' />

					<div className='flex w-full flex-col gap-2'>
						<Skeleton className='h-5 w-4/5 md:w-2/6' />
						<Skeleton className='h-5 w-3/5 md:w-1/5' />
					</div>
				</div>

				<Skeleton className='h-9 w-2/6 rounded-full md:w-1/6' />
			</div>

			<div className='h-30 w-full' />
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
		<div className='mt-4 flex flex-col gap-4'>
			<h1 className='text-xl font-semibold'>{video.title}</h1>

			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<VideoOwner user={video.user} videoId={video.id} />

				<div className='-mb-2 flex gap-2 overflow-x-auto pb-2 sm:mb-0 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible sm:pb-0'>
					<VideoReactions
						videoId={video.id}
						likeCount={video.likeCount}
						dislikeCount={video.dislikeCount}
						viewerReaction={video.viewerReaction}
					/>

					<VideoMenu variant='secondary' videoId={video.id} />
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
