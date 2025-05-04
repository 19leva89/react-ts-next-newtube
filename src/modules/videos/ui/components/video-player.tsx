'use client'

import MuxPlayer from '@mux/mux-player-react'

import '@/modules/videos/ui/styles/video-player.css'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants/thumbnail-fallback'

interface Props {
	autoPlay?: boolean
	playbackId?: string | null
	thumbnailUrl?: string | null
	onPlay?: () => void
}
export const VideoPlayer = ({ autoPlay, playbackId, thumbnailUrl, onPlay }: Props) => {
	return (
		<MuxPlayer
			playbackId={playbackId || ''}
			poster={thumbnailUrl || THUMBNAIL_FALLBACK}
			autoPlay={autoPlay}
			playerInitTime={0}
			thumbnailTime={0}
			onPlay={onPlay}
			accentColor="#FF2056"
			className="mux-player"
		/>
	)
}
