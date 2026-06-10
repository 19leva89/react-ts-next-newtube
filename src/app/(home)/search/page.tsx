import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { SearchView } from '@/modules/search/ui/views/search-view'

interface Props {
	searchParams: Promise<{
		query: string | undefined
		categoryId: string | undefined
	}>
}

const SearchPage = async ({ searchParams }: Props) => {
	const queryClient = getQueryClient()

	const { query, categoryId } = await searchParams

	void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

	void queryClient.prefetchInfiniteQuery(
		trpc.search.getMany.infiniteQueryOptions(
			{
				query: query,
				categoryId: categoryId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <SearchView query={query} categoryId={categoryId} />
}

export default SearchPage
