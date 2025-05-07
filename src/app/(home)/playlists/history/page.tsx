import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'

import { HistoryView } from '@/modules/playlists/ui/views/history-view'

export const dynamic = 'force-dynamic'

const HistoryPage = async () => {
	void trpc.playlists.getHistory.prefetchInfinite({
		cursor: null,
		limit: DEFAULT_LIMIT,
	})

	return <HistoryView />
}

export default HistoryPage
