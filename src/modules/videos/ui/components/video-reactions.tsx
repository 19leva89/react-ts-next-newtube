import { toast } from 'sonner'
import { useClerk } from '@clerk/nextjs'
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { Button, Separator } from '@/components/ui'
import { VideoGetOneOutput } from '@/modules/videos/types'

interface Props {
	videoId: string
	likeCount: number
	dislikeCount: number
	viewerReaction: VideoGetOneOutput['viewerReaction']
}

export const VideoReactions = ({ videoId, likeCount, dislikeCount, viewerReaction }: Props) => {
	const clerk = useClerk()
	const utils = trpc.useUtils()

	const like = trpc.videoReactions.like.useMutation({
		onSuccess: () => {
			utils.videos.getOne.invalidate({ id: videoId })
			utils.playlists.getLiked.invalidate()
		},
		onError: (error) => {
			toast.error('You need to be logged in to like this video')

			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn()
			}
		},
	})

	const dislike = trpc.videoReactions.dislike.useMutation({
		onSuccess: () => {
			utils.videos.getOne.invalidate({ id: videoId })
			utils.playlists.getLiked.invalidate()
		},
		onError: (error) => {
			toast.error('You need to be logged in to like this video')

			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn()
			}
		},
	})

	return (
		<div className="flex items-center flex-none">
			<Button
				onClick={() => like.mutate({ videoId })}
				disabled={like.isPending || dislike.isPending}
				variant="secondary"
				className="gap-2 pr-4 rounded-l-full rounded-r-none group/like"
			>
				<ThumbsUpIcon
					className={cn(
						'size-5 transition-colors ease-in-out duration-300 fill-transparent group-hover/like:fill-black',
						viewerReaction === 'like' && 'fill-black group-hover/like:fill-transparent',
					)}
				/>

				{likeCount}
			</Button>

			<Separator orientation="vertical" className="h-6" />

			<Button
				variant="secondary"
				onClick={() => dislike.mutate({ videoId })}
				disabled={like.isPending || dislike.isPending}
				className="rounded-r-full rounded-l-none pl-3 group/like"
			>
				<ThumbsDownIcon
					className={cn(
						'size-5 transition-colors ease-in-out duration-300 fill-transparent group-hover/like:fill-black',
						viewerReaction === 'dislike' && 'fill-black group-hover/like:fill-transparent',
					)}
				/>
				{dislikeCount}
			</Button>
		</div>
	)
}
