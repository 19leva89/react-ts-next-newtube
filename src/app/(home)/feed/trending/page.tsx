import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { TrendingView } from '@/modules/home/ui/views/trending-view'

const TrendingPage = async () => {
	const queryClient = getQueryClient()

	void queryClient.prefetchInfiniteQuery(
		trpc.videos.getManyTrending.infiniteQueryOptions(
			{
				cursor: null,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <TrendingView />
}

export default TrendingPage
