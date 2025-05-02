'use client'

import { Suspense } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Globe2Icon, LockIcon } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { snakeCaseToTitle } from '@/lib/utils'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoThumbnail } from '@/modules/videos/ui/components/video-thumbnail'
import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'

export const VideosSection = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<VideosSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

const VideosSectionSkeleton = () => {
	return (
		<>
			<div className="border-y">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-130 pl-6">Video</TableHead>
							<TableHead>Visibility</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="text-right">Views</TableHead>
							<TableHead className="text-right">Comments</TableHead>
							<TableHead className="text-right pr-6">Likes</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
							<TableRow key={i}>
								<TableCell className="pl-6">
									<div className="flex items-center gap-4">
										<Skeleton className="w-36 h-20" />
										<div className="flex flex-col gap-2">
											<Skeleton className="w-25 h-4" />
											<Skeleton className="w-45 h-3" />
										</div>
									</div>
								</TableCell>

								<TableCell>
									<Skeleton className="w-20 h-4" />
								</TableCell>

								<TableCell>
									<Skeleton className="w-20 h-4" />
								</TableCell>

								<TableCell className="text-xs truncate">
									<Skeleton className="w-24 h-4" />
								</TableCell>

								<TableCell className="text-right">
									<Skeleton className="w-16 h-4" />
								</TableCell>

								<TableCell className="text-right">
									<Skeleton className="w-20 h-4" />
								</TableCell>

								<TableCell className="text-right pr-6">
									<Skeleton className="w-16 h-4" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
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
									<TableCell className="pl-6">
										<div className="flex items-center gap-4">
											<div className="relative aspect-video w-36 shrink-0">
												<VideoThumbnail
													title={video.title}
													duration={video.duration}
													imageUrl={video.thumbnailUrl}
													previewUrl={video.previewUrl}
												/>
											</div>

											<div className="flex flex-col overflow-hidden gap-y-1">
												<span className="text-sm line-clamp-1">{video.title}</span>

												<span className="text-xs text-muted-foreground line-clamp-1">
													{video.description || 'No description'}
												</span>
											</div>
										</div>
									</TableCell>

									<TableCell>
										<div className="flex items-center">
											{video.visibility === 'private' ? (
												<LockIcon className="size-4 mr-2" />
											) : (
												<Globe2Icon className="size-4 mr-2" />
											)}

											{snakeCaseToTitle(video.visibility)}
										</div>
									</TableCell>

									<TableCell>
										<div className="flex items-center">{snakeCaseToTitle(video.muxStatus || 'error')}</div>
									</TableCell>

									<TableCell className="text-xs truncate">
										{format(new Date(video.createdAt), 'd MMM yyyy')}
									</TableCell>

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
