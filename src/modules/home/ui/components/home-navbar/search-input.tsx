'use client'

import { FormEvent, useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { baseUrl } from '@/lib/utils'
import { Button } from '@/components/ui'

export const SearchInput = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const query = searchParams.get('query') || ''
	const categoryId = searchParams.get('categoryId') || ''

	const [value, setValue] = useState<string>(query)

	const handleSearch = (e: FormEvent) => {
		e.preventDefault()

		const url = new URL('/search', baseUrl)
		const newQuery = value.trim()

		url.searchParams.set('query', newQuery)

		if (categoryId) {
			url.searchParams.set('categoryId', categoryId)
		}

		if (newQuery === '') {
			url.searchParams.delete('query')
		}

		setValue(newQuery)
		router.push(url.toString())
	}

	return (
		<form onSubmit={handleSearch} className="flex w-full max-w-150">
			<div className="relative w-full">
				<input
					type="text"
					placeholder="Search"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-hidden focus:border-blue-500"
				/>

				{value && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => setValue('')}
						className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full"
					>
						<XIcon className="text-gray-500" />
					</Button>
				)}
			</div>

			<button
				type="submit"
				name="search video"
				aria-label="Search name video"
				disabled={!value.trim()}
				className="px-5 py-2.5 border border-l-0 rounded-r-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<SearchIcon className="size-5" />
			</button>
		</form>
	)
}
