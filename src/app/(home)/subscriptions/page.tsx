import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { SubscriptionsView } from '@/modules/subscriptions/ui/views/subscriptions-view'

export const dynamic = 'force-dynamic'

const SubscriptionsPage = async () => {
	void trpc.subscriptions.getMany.prefetchInfinite({
		limit: DEFAULT_LIMIT,
	})

	return <SubscriptionsView />
}

export default SubscriptionsPage
