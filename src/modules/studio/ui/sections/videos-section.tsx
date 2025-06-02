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
		<div className='border-y'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-130 pl-6'>Video</TableHead>
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
							<TableCell className='pl-6'>
								<div className='flex items-center gap-4'>
									<Skeleton className='h-20 w-36' />

									<div className='flex flex-col gap-2'>
										<Skeleton className='h-4 w-25' />
										<Skeleton className='h-3 w-45' />
									</div>
								</div>
							</TableCell>

							<TableCell>
								<Skeleton className='h-4 w-20' />
							</TableCell>

							<TableCell>
								<Skeleton className='h-4 w-20' />
							</TableCell>

							<TableCell>
								<Skeleton className='h-4 w-24' />
							</TableCell>

							<TableCell>
								<Skeleton className='h-4 w-16' />
							</TableCell>

							<TableCell>
								<Skeleton className='h-4 w-20' />
							</TableCell>

							<TableCell>
								<Skeleton className='h-4 w-16' />
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
			<div className='border-y'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-130 pl-6'>Video</TableHead>
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
									className='cursor-pointer transition hover:bg-muted'
								>
									<TableCell className='pl-6'>
										<div className='flex items-center gap-4'>
											<div className='relative aspect-video w-36 shrink-0'>
												<VideoThumbnail
													title={video.title}
													imageUrl={video.thumbnailUrl}
													previewUrl={video.previewUrl}
													duration={video.duration}
												/>
											</div>

											<div className='flex w-94 flex-col gap-y-1 overflow-hidden'>
												<span className='truncate text-sm'>{video.title}</span>

												<span className='truncate text-xs text-muted-foreground'>
													{video.description || 'No description'}
												</span>
											</div>
										</div>
									</TableCell>

									<TableCell>
										<div className='flex items-center'>
											{video.visibility === 'private' ? (
												<LockIcon className='mr-2 size-4' />
											) : (
												<LockOpenIcon className='mr-2 size-4' />
											)}

											{snakeCaseToTitle(video.visibility)}
										</div>
									</TableCell>

									<TableCell>
										<div className='flex items-center'>{snakeCaseToTitle(video.muxStatus || 'error')}</div>
									</TableCell>

									<TableCell className='truncate text-xs'>
										{format(new Date(video.createdAt), 'd MMM yyyy')}
									</TableCell>

									<TableCell>{video.viewCount}</TableCell>

									<TableCell>{video.commentCount}</TableCell>

									<TableCell>{video.likeCount}</TableCell>
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
