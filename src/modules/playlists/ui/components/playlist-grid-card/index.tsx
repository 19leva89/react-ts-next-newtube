import Link from 'next/link'

import { PlaylistGetManyOutput } from '@/modules/playlists/types'
import {
	PlaylistInfo,
	PlaylistInfoSkeleton,
} from '@/modules/playlists/ui/components/playlist-grid-card/playlist-info'
import {
	PlaylistThumbnail,
	PlaylistThumbnailSkeleton,
} from '@/modules/playlists/ui/components/playlist-grid-card/playlist-thumbnail'
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants/thumbnail-fallback'

interface Props {
	playlist: PlaylistGetManyOutput['items'][number]
}

export const PlaylistGridCardSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 w-full">
			<PlaylistThumbnailSkeleton />

			<PlaylistInfoSkeleton />
		</div>
	)
}

export const PlaylistGridCard = ({ playlist }: Props) => {
	return (
		<Link prefetch href={`/playlists/${playlist.id}`}>
			<div className="flex flex-col gap-2 w-full group">
				<PlaylistThumbnail
					title={playlist.name}
					videoCount={playlist.videoCount}
					imageUrl={playlist.thumbnailUrl || THUMBNAIL_FALLBACK}
				/>

				<PlaylistInfo data={playlist} />
			</div>
		</Link>
	)
}
