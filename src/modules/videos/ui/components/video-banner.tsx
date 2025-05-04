import { AlertTriangleIcon } from 'lucide-react'

import type { VideoGetOneOutput } from '@/modules/videos/types'

interface Props {
	status: VideoGetOneOutput['muxStatus']
}

export const VideoBanner = ({ status }: Props) => {
	if (status === 'ready') return null

	return (
		<div className="flex items-center gap-2 py-3 px-4 rounded-b-xl bg-yellow-400">
			<AlertTriangleIcon className="size-4 text-black shrink-0" />

			<p className="text-xs md:text-sm font-medium text-black line-clamp-1">
				This video is still being processed
			</p>
		</div>
	)
}
