import { VideosSection } from '@/modules/playlists/ui/sections/videos-section'
import { PlaylistHeaderSection } from '@/modules/playlists/ui/sections/playlist-header-section'

interface Props {
	playlistId: string
}

export const VideosView = ({ playlistId }: Props) => {
	return (
		<div className="flex flex-col gap-y-6 max-w-screen-md mb-10 px-4 pt-2.5 mx-auto">
			<PlaylistHeaderSection playlistId={playlistId} />

			<VideosSection playlistId={playlistId} />
		</div>
	)
}
