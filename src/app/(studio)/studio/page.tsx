import { HydrateClient, trpc } from '@/trpc/server'

import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { StudioView } from '@/modules/studio/ui/views/studio-view'

export const dynamic = 'force-dynamic' // Force dynamic rendering

const StudioPage = () => {
	void trpc.studio.getMany.prefetchInfinite({
		limit: DEFAULT_LIMIT,
	})

	return (
		<HydrateClient>
			<StudioView />
		</HydrateClient>
	)
}

export default StudioPage
