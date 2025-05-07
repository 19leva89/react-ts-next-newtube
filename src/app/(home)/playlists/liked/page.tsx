import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'

import { LikedView } from '@/modules/playlists/ui/views/liked-view'

export const dynamic = 'force-dynamic'

const LikedPage = async () => {
	void trpc.playlists.getLiked.prefetchInfinite({
		cursor: null,
		limit: DEFAULT_LIMIT,
	})

	return <LikedView />
}

export default LikedPage
