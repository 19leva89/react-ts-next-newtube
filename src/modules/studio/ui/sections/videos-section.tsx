'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { DEFAULT_LIMIT } from '@/constants'
import { InfiniteScroll } from '@/components/shared'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'

export const VideosSection = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ErrorBoundary fallback={<p>Error...</p>}>
				<VideosSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

export const VideosSectionSuspense = () => {
	const trpc = useTRPC()

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
								<Link href={`/studio/videos/${video.id}`} key={video.id} prefetch>
									<TableRow className="cursor-pointer">
										<TableCell>{video.title}</TableCell>
										<TableCell>Visibility</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Date</TableCell>
										<TableCell>Views</TableCell>
										<TableCell>Comments</TableCell>
										<TableCell>Likes</TableCell>
									</TableRow>
								</Link>
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
