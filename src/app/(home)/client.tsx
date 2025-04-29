'use client'

import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

export const ClientPage = () => {
	const trpc = useTRPC()
	const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions())

	return (
		<div>
			<p>This is a client component, making a call to an API with data prefetching</p>

			<div>{JSON.stringify(data)}</div>
		</div>
	)
}
