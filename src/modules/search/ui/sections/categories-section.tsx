'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { FilterCarousel } from '@/components/shared'

interface Props {
	categoryId?: string
}

export const CategoriesSection = ({ categoryId }: Props) => {
	return (
		<Suspense fallback={<FilterCarousel isLoading data={[]} onSelectAction={() => {}} />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<CategoriesSectionSuspense categoryId={categoryId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const CategoriesSectionSuspense = ({ categoryId }: Props) => {
	const router = useRouter()

	const [categories] = trpc.categories.getMany.useSuspenseQuery()

	const data = categories.map((category) => ({
		value: category.id,
		label: category.name,
	}))

	const onSelect = (value: string | null) => {
		const url = new URL(window.location.href)

		if (value) {
			url.searchParams.set('categoryId', value)
		} else {
			url.searchParams.delete('categoryId')
		}

		router.push(url.toString())
	}

	return <FilterCarousel value={categoryId} data={data} onSelectAction={onSelect} />
}
