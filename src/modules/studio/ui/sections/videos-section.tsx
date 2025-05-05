'use client'

import { Suspense } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { LockOpenIcon, LockIcon } from 'lucide-react'

import { trpc } from '@/trpc/client'
import { snakeCaseToTitle } from '@/lib/utils'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoThumbnail } from '@/modules/videos/ui/components/video-thumbnail'
import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'

export const VideosSection = () => {
	return (
		<Suspense fallback={<VideosSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<VideosSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	)
}

const VideosSectionSkeleton = () => {
	return (
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
					{Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
						<TableRow key={index}>
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

							<TableCell>
								<Skeleton className="w-24 h-4" />
							</TableCell>

							<TableCell>
								<Skeleton className="w-16 h-4" />
							</TableCell>

							<TableCell>
								<Skeleton className="w-20 h-4" />
							</TableCell>

							<TableCell>
								<Skeleton className="w-16 h-4" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export const VideosSectionSuspense = () => {
	const router = useRouter()

	const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
		{ limit: DEFAULT_LIMIT },
		{ getNextPageParam: (lastPage) => lastPage.nextCursor },
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

											<div className="flex flex-col overflow-hidden gap-y-1 w-94">
												<span className="text-sm truncate">{video.title}</span>

												<span className="text-xs text-muted-foreground truncate">
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
												<LockOpenIcon className="size-4 mr-2" />
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
				hasNextPage={query.hasNextPage}
				fetchNextPage={query.fetchNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
			/>
		</div>
	)
}
