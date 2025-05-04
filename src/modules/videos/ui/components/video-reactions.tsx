import { toast } from 'sonner'
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { Button, Separator } from '@/components/ui'
import { VideoGetOneOutput } from '@/modules/videos/types'

interface Props {
	videoId: string
	likeCount: number
	dislikeCount: number
	// viewerReaction: VideoGetOneOutput['viewerReaction']
}

export const VideoReactions = ({
	videoId,
	likeCount,
	dislikeCount,
	// viewerReaction
}: Props) => {
	const utils = trpc.useUtils()

	const viewerReaction = 'like'

	// const like = trpc.videoReactions.like.useMutation({
	// 	onSuccess: () => {
	// 		utils.videos.getOne.invalidate({ id: videoId })
	// 		utils.playlists.getLiked.invalidate()
	// 	},
	// 	onError: (error) => {
	// 		toast.error(error.message)

	// 		if (error.data?.code === 'UNAUTHORIZED') {
	// 			toast.error('You need to be logged in to like this video')
	// 			return
	// 		}
	// 	},
	// })

	// const dislike = trpc.videoReactions.dislike.useMutation({
	// 	onSuccess: () => {
	// 		utils.videos.getOne.invalidate({ id: videoId })
	// 		utils.playlists.getLiked.invalidate()
	// 	},
	// 	onError: (error) => {
	// 		toast.error(error.message)

	// 		if (error.data?.code === 'UNAUTHORIZED') {
	// 			toast.error('You need to be logged in to dislike this video')
	// 			return
	// 		}
	// 	},
	// })

	return (
		<div className="flex items-center flex-none">
			<Button
				// onClick={() => like.mutate({ videoId })}
				// disabled={like.isPending || dislike.isPending}
				variant="secondary"
				className="gap-2 pr-4 rounded-l-full rounded-r-none"
			>
				<ThumbsUpIcon className={cn('size-5', viewerReaction === 'like' && 'fill-black')} />

				{likeCount}
			</Button>

			<Separator orientation="vertical" className="h-6" />

			<Button
				variant="secondary"
				// onClick={() => dislike.mutate({ videoId })}
				// disabled={like.isPending || dislike.isPending}
				className="rounded-r-full rounded-l-none pl-3"
			>
				<ThumbsDownIcon className={cn('size-5', viewerReaction !== 'like' && 'fill-black')} />
				{dislikeCount}
			</Button>
		</div>
	)
}
