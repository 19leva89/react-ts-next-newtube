import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { PlaylistView } from '@/modules/playlists/ui/views/playlist-view'

const PlaylistsPage = async () => {
	const queryClient = getQueryClient()

	void queryClient.prefetchInfiniteQuery(
		trpc.playlists.getMany.infiniteQueryOptions(
			{
				cursor: null,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <PlaylistView />
}

export default PlaylistsPage
