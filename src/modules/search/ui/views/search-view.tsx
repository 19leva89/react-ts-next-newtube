import { ResultsSection } from '@/modules/search/ui/sections/results-section'
import { CategoriesSection } from '@/modules/search/ui/sections/categories-section'

interface Props {
	query: string | undefined
	categoryId: string | undefined
}

export const SearchView = ({ query, categoryId }: Props) => {
	return (
		<div className="flex flex-col gap-y-6 min-w-325 mb-10 px-4 pt-2.5 mx-auto">
			<CategoriesSection categoryId={categoryId} />

			<ResultsSection query={query} categoryId={categoryId} />
		</div>
	)
}
