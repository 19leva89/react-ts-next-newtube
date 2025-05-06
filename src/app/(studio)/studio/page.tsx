import { trpc } from '@/trpc/server'

import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { StudioView } from '@/modules/studio/ui/views/studio-view'

export const dynamic = 'force-dynamic'

const StudioPage = () => {
	void trpc.studio.getMany.prefetchInfinite({
		limit: DEFAULT_LIMIT,
	})

	return <StudioView />
}

export default StudioPage
