import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { SubscribedView } from '@/modules/home/ui/views/subscribed-view'

const SubscriptionsPage = async () => {
	const queryClient = getQueryClient()

	void queryClient.prefetchInfiniteQuery(
		trpc.videos.getManySubscribed.infiniteQueryOptions(
			{
				cursor: null,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <SubscribedView />
}

export default SubscriptionsPage
