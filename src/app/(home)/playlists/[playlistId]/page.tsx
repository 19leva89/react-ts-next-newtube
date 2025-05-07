import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideosView } from '@/modules/playlists/ui/views/videos-view'

export const dynamic = 'force-dynamic'

interface Props {
	params: Promise<{ playlistId: string }>
}

const PlaylistIdPage = async ({ params }: Props) => {
	const { playlistId } = await params

	void trpc.playlists.getOne.prefetch({
		id: playlistId,
	})

	void trpc.playlists.getVideos.prefetchInfinite({
		playlistId,
		limit: DEFAULT_LIMIT,
	})

	return <VideosView playlistId={playlistId} />
}

export default PlaylistIdPage
