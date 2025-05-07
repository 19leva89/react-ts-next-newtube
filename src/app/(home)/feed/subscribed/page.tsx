import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { SubscribedView } from '@/modules/home/ui/views/subscribed-view'

export const dynamic = 'force-dynamic'

const SubscriptionsPage = async () => {
	void trpc.videos.getManySubscribed.prefetchInfinite({
		cursor: null,
		limit: DEFAULT_LIMIT,
	})

	return <SubscribedView />
}

export default SubscriptionsPage
