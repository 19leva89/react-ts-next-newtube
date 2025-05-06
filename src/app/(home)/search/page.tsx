import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
// import { SearchView } from '@/modules/search/ui/views/search-view'

export const dynamic = 'force-dynamic'

interface Props {
	searchParams: Promise<{
		query: string | undefined
		categoryId: string | undefined
	}>
}

const SearchPage = async ({ searchParams }: Props) => {
	const { query, categoryId } = await searchParams

	void trpc.categories.getMany.prefetch()

	// void trpc.search.getMany.prefetchInfinite({
	// 	query: query,
	// 	categoryId: categoryId,
	// 	limit: DEFAULT_LIMIT,
	// })

	// return <SearchView query={query} categoryId={categoryId} />
}

export default SearchPage
