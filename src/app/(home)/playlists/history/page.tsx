import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'

import { HistoryView } from '@/modules/playlists/ui/views/history-view'

const HistoryPage = async () => {
	const queryClient = getQueryClient()

	void queryClient.prefetchInfiniteQuery(
		trpc.playlists.getHistory.infiniteQueryOptions(
			{
				cursor: null,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <HistoryView />
}

export default HistoryPage
