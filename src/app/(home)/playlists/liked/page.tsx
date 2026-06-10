import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'

import { LikedView } from '@/modules/playlists/ui/views/liked-view'

const LikedPage = async () => {
	const queryClient = getQueryClient()

	void queryClient.prefetchInfiniteQuery(
		trpc.playlists.getLiked.infiniteQueryOptions(
			{
				cursor: null,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <LikedView />
}

export default LikedPage
