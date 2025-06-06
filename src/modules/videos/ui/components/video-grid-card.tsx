import Link from 'next/link'

import { VideoGetManyOutput } from '@/modules/videos/types'
import { VideoInfo, VideoInfoSkeleton } from '@/modules/videos/ui/components/video-info'
import { VideoThumbnail, VideoThumbnailSkeleton } from '@/modules/videos/ui/components/video-thumbnail'

interface VideoGridCardProps {
	data: VideoGetManyOutput['items'][number]
	onRemove?: () => void
}

export const VideoGridCardSkeleton = () => {
	return (
		<div className='flex w-full flex-col gap-2'>
			<VideoThumbnailSkeleton />

			<VideoInfoSkeleton />
		</div>
	)
}

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
	return (
		<div className='group flex w-full flex-col gap-2'>
			<Link prefetch href={`/videos/${data.id}`}>
				<VideoThumbnail
					title={data.title}
					imageUrl={data.thumbnailUrl}
					previewUrl={data.previewUrl}
					duration={data.duration}
				/>
			</Link>

			<VideoInfo data={data} onRemove={onRemove} />
		</div>
	)
}
