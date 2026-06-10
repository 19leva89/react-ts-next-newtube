'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
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
	const trpc = useTRPC()
	const router = useRouter()

	const { data: categories } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

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
