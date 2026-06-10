import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { HomeView } from '@/modules/home/ui/views/home-view'

interface Props {
	searchParams: Promise<{
		categoryId?: string
	}>
}

const HomePage = async ({ searchParams }: Props) => {
	const queryClient = getQueryClient()

	const { categoryId } = await searchParams

	void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

	void queryClient.prefetchInfiniteQuery(
		trpc.videos.getMany.infiniteQueryOptions(
			{
				categoryId: categoryId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <HomeView categoryId={categoryId} />
}

export default HomePage
