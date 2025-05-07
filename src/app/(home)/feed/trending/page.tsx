import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { TrendingView } from '@/modules/home/ui/views/trending-view'

export const dynamic = 'force-dynamic'

const TrendingPage = async () => {
	void trpc.videos.getManyTrending.prefetchInfinite({
		cursor: null,
		limit: DEFAULT_LIMIT,
	})

	return <TrendingView />
}

export default TrendingPage
