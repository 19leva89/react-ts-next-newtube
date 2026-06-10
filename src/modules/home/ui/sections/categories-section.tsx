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

const CategoriesSkeleton = () => {
	return <FilterCarousel isLoading data={[]} onSelectAction={() => {}} />
}

export const CategoriesSection = ({ categoryId }: Props) => {
	return (
		<Suspense fallback={<CategoriesSkeleton />}>
			<ErrorBoundary fallback={<div>Error...</div>}>
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

	return <FilterCarousel data={data} value={categoryId} onSelectAction={onSelect} />
}
