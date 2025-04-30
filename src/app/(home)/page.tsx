import { HydrateClient, prefetch, trpc } from '@/trpc/server'

import { HomeView } from '@/modules/home/ui/views/home-view'

export const dynamic = 'force-dynamic'

interface Props {
	searchParams: Promise<{
		categoryId?: string
	}>
}

const HomePage = async ({ searchParams }: Props) => {
	const { categoryId } = await searchParams

	prefetch(trpc.categories.getMany.queryOptions())

	return (
		<HydrateClient>
			<HomeView categoryId={categoryId} />
		</HydrateClient>
	)
}

export default HomePage
