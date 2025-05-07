import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { PlaylistView } from '@/modules/playlists/ui/views/playlist-view'

export const dynamic = 'force-dynamic'

const PlaylistsPage = () => {
	void trpc.playlists.getMany.prefetchInfinite({
		cursor: null,
		limit: DEFAULT_LIMIT,
	})

	return <PlaylistView />
}

export default PlaylistsPage
