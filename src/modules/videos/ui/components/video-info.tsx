import Link from 'next/link'
import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'

import { Skeleton } from '@/components/ui'
import { UserAvatar } from '@/components/shared'
import { VideoGetManyOutput } from '@/modules/videos/types'
import { UserInfo } from '@/modules/users/ui/components/user-info'
import { VideoMenu } from '@/modules/videos/ui/components/video-menu'

interface Props {
	data: VideoGetManyOutput['items'][number]
	onRemove?: () => void
}

export const VideoInfoSkeleton = () => {
	return (
		<div className="flex gap-3">
			<Skeleton className="size-10 shrink-0 rounded-full" />

			<div className="flex-1 min-w-0 space-y-2">
				<Skeleton className="w-[90%] h-5" />
				<Skeleton className="w-[70%] h-5" />
			</div>
		</div>
	)
}

export const VideoInfo = ({ data, onRemove }: Props) => {
	const compactViews = useMemo(() => {
		return Intl.NumberFormat('en', {
			notation: 'compact',
		}).format(data.viewCount)
	}, [data.viewCount])

	const compactDate = useMemo(() => {
		return formatDistanceToNow(data.createdAt, { addSuffix: true })
	}, [data.createdAt])

	return (
		<div className="flex gap-3">
			<Link prefetch href={`/videos/${data.id}`}>
				<UserAvatar
					name={data.user.name || 'User'}
					imageUrl={data.user.imageUrl || '/svg/user-placeholder.svg'}
				/>
			</Link>

			<div className="flex-1 min-w-0">
				<Link prefetch href={`/videos/${data.id}`}>
					<h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">{data.title}</h3>
				</Link>

				<Link prefetch href={`/users/${data.user.id}`}>
					<UserInfo size="sm" name={data.user.name || 'User'} />
				</Link>

				<Link prefetch href={`/videos/${data.id}`}>
					<p className="text-sm text-muted-foreground line-clamp-1">
						{compactViews} views &bull; {compactDate}
					</p>
				</Link>
			</div>

			<div className="flex-shrink-0">
				<VideoMenu videoId={data.id} onRemove={onRemove} />
			</div>
		</div>
	)
}
