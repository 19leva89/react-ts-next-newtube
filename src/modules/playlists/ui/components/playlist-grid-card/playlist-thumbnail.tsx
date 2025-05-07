import Image from 'next/image'
import { useMemo } from 'react'
import { ListVideoIcon, PlayIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants/thumbnail-fallback'

interface Props {
	title: string
	videoCount: number
	className?: string
	imageUrl?: string | null
}

export const PlaylistThumbnailSkeleton = () => {
	return (
		<div className="relative pt-3">
			<div className="relative">
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] aspect-video rounded-xl overflow-hidden bg-black/20" />

				<div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] aspect-video rounded-xl overflow-hidden bg-black/25" />
			</div>

			<div className="relative w-full aspect-video rounded-xl overflow-hidden">
				<div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
					<div className="flex items-center gap-x-2">
						<PlayIcon className="size-4 text-white fill-white" />

						<span className="text-white font-medium">Play all</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export const PlaylistThumbnail = ({ title, videoCount, className, imageUrl }: Props) => {
	const compactView = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'compact',
		}).format(videoCount)
	}, [videoCount])

	return (
		<div className={cn('relative pt-3', className)}>
			<div className="relative">
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] aspect-video rounded-xl overflow-hidden bg-black/20" />

				<div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] aspect-video rounded-xl overflow-hidden bg-black/25" />
			</div>

			<div className="relative w-full aspect-video rounded-xl overflow-hidden">
				<Image src={imageUrl || THUMBNAIL_FALLBACK} alt={title} fill className="size-full object-cover" />

				<div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
					<div className="flex items-center gap-x-2">
						<PlayIcon className="size-4 text-white fill-white" />

						<span className="text-white font-medium">Play all</span>
					</div>
				</div>
			</div>

			<div className="absolute bottom-2 right-2 flex items-center gap-x-1 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
				<ListVideoIcon className="size-4" />
				{compactView} videos
			</div>
		</div>
	)
}
