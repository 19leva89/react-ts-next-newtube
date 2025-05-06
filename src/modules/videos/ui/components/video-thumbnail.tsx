import Image from 'next/image'

import { Skeleton } from '@/components/ui'
import { formatDuration } from '@/lib/utils'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants/thumbnail-fallback'

interface Props {
	title: string
	duration: number
	imageUrl?: string | null
	previewUrl?: string | null
}

export const VideoThumbnailSkeleton = () => {
	return (
		<div className="relative w-full rounded-xl overflow-hidden aspect-video">
			<Skeleton className="size-full" />
		</div>
	)
}

export const VideoThumbnail = ({ title, duration, imageUrl, previewUrl }: Props) => {
	return (
		<div className="relative group">
			{/* Thumbnail wrapper  */}
			<div className="relative w-full rounded-xl overflow-hidden transition-all aspect-video">
				<Image
					src={imageUrl || THUMBNAIL_FALLBACK}
					alt={title}
					sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
					fill
					className="size-full object-cover group-hover:opacity-0"
				/>

				<Image
					src={previewUrl || THUMBNAIL_FALLBACK}
					alt={title}
					sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
					unoptimized={!!previewUrl}
					fill
					className="size-full object-cover opacity-0 group-hover:opacity-100"
				/>
			</div>

			{/* Video duration box  */}
			<div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
				{formatDuration(duration)}
			</div>
		</div>
	)
}
