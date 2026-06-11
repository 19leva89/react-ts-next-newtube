import { toast } from 'sonner'
import { useClerk } from '@clerk/nextjs'
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { useTRPC } from '@/trpc/client'
import { Button, Separator } from '@/components/ui'
import { VideoGetOneOutput } from '@/modules/videos/types'
import { useErrorToaster } from '@/hooks/use-error-toaster'

interface Props {
	videoId: string
	likeCount: number
	dislikeCount: number
	viewerReaction: VideoGetOneOutput['viewerReaction']
}

export const VideoReactions = ({ videoId, likeCount, dislikeCount, viewerReaction }: Props) => {
	const trpc = useTRPC()
	const clerk = useClerk()
	const queryClient = useQueryClient()

	const { toastError } = useErrorToaster()

	const like = useMutation(
		trpc.videoReactions.like.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: videoId }))
				await queryClient.invalidateQueries(trpc.playlists.getLiked.queryFilter())
			},
			onError: (error) => {
				toastError(error, 'Like')

				if (error.data?.code === 'UNAUTHORIZED') {
					clerk.openSignIn()
				}
			},
		}),
	)

	const dislike = useMutation(
		trpc.videoReactions.dislike.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: videoId }))
				await queryClient.invalidateQueries(trpc.playlists.getLiked.queryFilter())
			},
			onError: (error) => {
				toastError(error, 'Dislike')

				if (error.data?.code === 'UNAUTHORIZED') {
					clerk.openSignIn()
				}
			},
		}),
	)

	return (
		<div className='flex flex-none items-center'>
			<Button
				onClick={() => like.mutate({ videoId })}
				disabled={like.isPending || dislike.isPending}
				variant='secondary'
				className='group/like gap-2 rounded-l-full rounded-r-none pr-4'
			>
				<ThumbsUpIcon
					className={cn(
						'size-5 fill-transparent transition-colors duration-300 ease-in-out group-hover/like:fill-black',
						viewerReaction === 'like' && 'fill-black group-hover/like:fill-transparent',
					)}
				/>

				{likeCount}
			</Button>

			<Separator orientation='vertical' className='h-6' />

			<Button
				variant='secondary'
				onClick={() => dislike.mutate({ videoId })}
				disabled={like.isPending || dislike.isPending}
				className='group/like rounded-l-none rounded-r-full pl-3'
			>
				<ThumbsDownIcon
					className={cn(
						'size-5 fill-transparent transition-colors duration-300 ease-in-out group-hover/like:fill-black',
						viewerReaction === 'dislike' && 'fill-black group-hover/like:fill-transparent',
					)}
				/>
				{dislikeCount}
			</Button>
		</div>
	)
}
