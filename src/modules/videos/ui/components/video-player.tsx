'use client'

import MuxPlayer from '@mux/mux-player-react'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants/thumbnail-fallback'

interface Props {
	playbackId?: string | null
	thumbnailUrl?: string | null
	autoPlay?: boolean
	onPlay?: () => void
}
export const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay, onPlay }: Props) => {
	if (!playbackId) return null

	return (
		<MuxPlayer
			playbackId={playbackId}
			poster={thumbnailUrl || THUMBNAIL_FALLBACK}
			autoPlay={autoPlay}
			playerInitTime={0}
			thumbnailTime={0}
			onPlay={onPlay}
			accentColor="#FF2056"
			className="size-full object-contain"
		/>
	)
}
