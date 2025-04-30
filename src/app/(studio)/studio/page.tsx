import { HydrateClient, prefetch, trpc } from '@/trpc/server'

import { DEFAULT_LIMIT } from '@/constants'
import { StudioView } from '@/modules/studio/view/studio-view'

export const dynamic = 'force-dynamic' // Force dynamic rendering

const StudioPage = () => {
	prefetch(trpc.studio.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT }))

	return (
		<HydrateClient>
			<StudioView />
		</HydrateClient>
	)
}

export default StudioPage
