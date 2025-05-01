'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'

export const VideosSection = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<VideosSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

export const VideosSectionSuspense = () => {
	const trpc = useTRPC()
	const router = useRouter()

	const {
		data: videos,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useSuspenseInfiniteQuery(
		trpc.studio.getMany.infiniteQueryOptions(
			{ limit: DEFAULT_LIMIT },
			{
				getNextPageParam(lastPage) {
					return lastPage.nextCursor
				},
			},
		),
	)

	return (
		<div>
			<div className="border-y">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-130 pl-6">Video</TableHead>
							<TableHead>Visibility</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Views</TableHead>
							<TableHead>Comments</TableHead>
							<TableHead>Likes</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{videos.pages
							.flatMap((page) => page.items)
							.map((video) => (
								<TableRow
									key={video.id}
									onClick={() => router.push(`/studio/videos/${video.id}`)}
									className="cursor-pointer hover:bg-muted transition"
								>
									<TableCell>{video.title}</TableCell>
									<TableCell>Visibility</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Date</TableCell>
									<TableCell>Views</TableCell>
									<TableCell>Comments</TableCell>
									<TableCell>Likes</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>

			<InfiniteScroll
				isManual
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
			/>
		</div>
	)
}
