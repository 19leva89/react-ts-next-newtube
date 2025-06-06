import Link from 'next/link'
import { useMemo } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/shared'
import { VideoGetManyOutput } from '@/modules/videos/types'
import { UserInfo } from '@/modules/users/ui/components/user-info'
import { VideoMenu } from '@/modules/videos/ui/components/video-menu'
import { Skeleton, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui'
import { VideoThumbnail, VideoThumbnailSkeleton } from '@/modules/videos/ui/components/video-thumbnail'

const videoRowCardVariants = cva('group flex min-w-0', {
	variants: {
		size: {
			default: 'gap-4',
			compact: 'gap-2',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

const thumbnailVariants = cva('relative flex-none', {
	variants: {
		size: {
			default: 'w-[38%]',
			compact: 'w-42',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

interface Props extends VariantProps<typeof videoRowCardVariants> {
	data: VideoGetManyOutput['items'][number]
	onRemove?: () => void
}

export const VideoRowCardSkeleton = ({ size = 'default' }: VariantProps<typeof videoRowCardVariants>) => {
	return (
		<div className={videoRowCardVariants({ size })}>
			{/* Thumbnail skeleton */}
			<div className={thumbnailVariants({ size })}>
				<VideoThumbnailSkeleton />
			</div>

			{/* Info skeleton */}
			<div className='min-w-0 flex-1'>
				<div className='flex justify-between gap-x-2'>
					<div className='min-w-0 flex-1'>
						<Skeleton className={cn('h-5 w-[40%]', size === 'compact' && 'h-4 w-[40%]')} />

						{size === 'default' && (
							<>
								<Skeleton className='mt-1 h-4 w-[20%]' />

								<div className='my-3 flex items-center gap-2'>
									<Skeleton className='size-8 rounded-full' />
									<Skeleton className='h-4 w-24' />
								</div>
							</>
						)}

						{size === 'compact' && <Skeleton className='mt-1 h-4 w-[50%]' />}
					</div>
				</div>
			</div>
		</div>
	)
}

export const VideoRowCard = ({ data, onRemove, size = 'default' }: Props) => {
	const compactViews = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'compact',
		}).format(data.viewCount)
	}, [data.viewCount])

	const compactLikes = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'compact',
		}).format(data.likeCount)
	}, [data.likeCount])

	return (
		<div className={videoRowCardVariants({ size })}>
			<Link prefetch href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
				<VideoThumbnail
					title={data.title}
					imageUrl={data.thumbnailUrl}
					previewUrl={data.previewUrl}
					duration={data.duration}
				/>
			</Link>

			{/* Info */}
			<div className='min-w-0 flex-1'>
				<div className='flex justify-between gap-x-2'>
					<Link prefetch href={`/videos/${data.id}`} className='min-w-0 flex-1'>
						<h3 className={cn('line-clamp-2 font-medium', size === 'compact' ? 'text-sm' : 'text-base')}>
							{data.title}
						</h3>

						{size === 'default' && (
							<p className='mt-1 text-sm text-muted-foreground'>
								{compactViews} views &bull; {compactLikes} likes
							</p>
						)}

						{size === 'default' && (
							<>
								<div className='my-3 flex items-center gap-2'>
									<UserAvatar
										size='sm'
										name={data.user.name || 'User'}
										imageUrl={data.user.imageUrl || '/svg/user-placeholder.svg'}
									/>

									<UserInfo size='sm' name={data.user.name || 'User'} />
								</div>

								<Tooltip>
									<TooltipTrigger asChild>
										<p className='line-clamp-2 w-fit text-xs text-muted-foreground'>
											{data.description || 'No description'}
										</p>
									</TooltipTrigger>

									<TooltipContent side='bottom' align='center' className='bg-black/70'>
										<p>From the video description</p>
									</TooltipContent>
								</Tooltip>
							</>
						)}

						{size === 'compact' && <UserInfo size='sm' name={data.user.name || 'User'} />}

						{size === 'compact' && (
							<p className='mt-1 text-xs text-muted-foreground'>
								{compactViews} views &bull; {compactLikes} likes
							</p>
						)}
					</Link>

					<div className='flex-none'>
						<VideoMenu videoId={data.id} onRemove={onRemove} />
					</div>
				</div>
			</div>
		</div>
	)
}
