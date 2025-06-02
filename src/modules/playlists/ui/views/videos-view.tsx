import { VideosSection } from '@/modules/playlists/ui/sections/videos-section'
import { PlaylistHeaderSection } from '@/modules/playlists/ui/sections/playlist-header-section'

interface Props {
	playlistId: string
}

export const VideosView = ({ playlistId }: Props) => {
	return (
		<div className='mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5'>
			<PlaylistHeaderSection playlistId={playlistId} />

			<VideosSection playlistId={playlistId} />
		</div>
	)
}
