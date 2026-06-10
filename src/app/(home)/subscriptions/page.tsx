import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { SubscriptionsView } from '@/modules/subscriptions/ui/views/subscriptions-view'

const SubscriptionsPage = async () => {
	const queryClient = getQueryClient()

	try {
		void queryClient.prefetchInfiniteQuery(
			trpc.subscriptions.getMany.infiniteQueryOptions(
				{
					limit: DEFAULT_LIMIT,
				},
				{
					getNextPageParam: (lastPage) => lastPage.nextCursor,
				},
			),
		)
	} catch (error) {
		console.error('Failed to prefetch subscriptions:', error)
	}

	return <SubscriptionsView />
}

export default SubscriptionsPage
