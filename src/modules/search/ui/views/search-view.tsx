import { ResultsSection } from '@/modules/search/ui/sections/results-section'
import { CategoriesSection } from '@/modules/search/ui/sections/categories-section'

interface Props {
	query: string | undefined
	categoryId: string | undefined
}

export const SearchView = ({ query, categoryId }: Props) => {
	return (
		<div className='mx-auto mb-10 flex max-w-325 flex-col gap-y-6 px-4 pt-2.5'>
			<CategoriesSection categoryId={categoryId} />

			<ResultsSection query={query} categoryId={categoryId} />
		</div>
	)
}
