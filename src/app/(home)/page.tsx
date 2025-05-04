import { trpc } from '@/trpc/server'

import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { HomeView } from '@/modules/home/ui/views/home-view'

export const dynamic = 'force-dynamic'

interface Props {
	searchParams: Promise<{
		categoryId?: string
	}>
}

const HomePage = async ({ searchParams }: Props) => {
	const { categoryId } = await searchParams

	void trpc.categories.getMany.prefetch()
	// void trpc.videos.getMany.prefetchInfinite({
	// 	categoryId: categoryId,
	// 	limit: DEFAULT_LIMIT,
	// })

	return <HomeView categoryId={categoryId} />
}

export default HomePage
