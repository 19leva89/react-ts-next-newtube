import Link from 'next/link'

import { VideoGetManyOutput } from '@/modules/videos/types'
import { VideoInfo } from '@/modules/videos/ui/components/video-info'
import { VideoThumbnail } from '@/modules/videos/ui/components/video-thumbnail'

interface VideoGridCardProps {
	data: VideoGetManyOutput['items'][number]
	onRemove?: () => void
}

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
	return (
		<div className="flex flex-col gap-2 w-full group">
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
