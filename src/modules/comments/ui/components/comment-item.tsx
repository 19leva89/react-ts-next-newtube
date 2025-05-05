import {
	ChevronDownIcon,
	ChevronUpIcon,
	MessageSquareIcon,
	MoreVerticalIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	TrashIcon,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import { useAuth, useClerk } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { UserAvatar } from '@/components/shared'
import { CommentsGetManyOutput } from '@/modules/comments/types'
import { CommentForm, CommentReplies } from '@/modules/comments/ui/components'

interface Props {
	comment: CommentsGetManyOutput['items'][number]
	variant?: 'reply' | 'comment'
}

export const CommentItem = ({ comment, variant = 'comment' }: Props) => {
	const clerk = useClerk()
	const utils = trpc.useUtils()

	const { userId } = useAuth()

	const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false)
	const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false)

	const remove = trpc.comments.remove.useMutation({
		onSuccess: () => {
			utils.comments.getMany.invalidate({
				videoId: comment.videoId,
			})

			toast.success('Comment deleted')
		},
		onError: (error) => {
			toast.error('You need to be logged in to delete comment')

			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn()
			}
		},
	})

	// const like = trpc.commentReactions.like.useMutation({
	// 	onSuccess: () => {
	// 		utils.comments.getMany.invalidate({
	// 			videoId: comment.videoId,
	// 		})
	// 	},
	// 	onError: () => {
	// 		toast.error('Failed to like comment')
	// 	},
	// })

	// const dislike = trpc.commentReactions.dislike.useMutation({
	// 	onSuccess: () => {
	// 		utils.comments.getMany.invalidate({
	// 			videoId: comment.videoId,
	// 		})
	// 	},
	// 	onError: () => {
	// 		toast.error('Failed to dislike comment')
	// 	},
	// })

	return (
		<div>
			<div className="flex gap-4">
				<Link prefetch href={`/users/${comment.userId}`}>
					<UserAvatar
						size={variant === 'comment' ? 'lg' : 'sm'}
						name={comment.user.name || 'User'}
						imageUrl={comment.user.imageUrl || '/svg/user-placeholder.svg'}
					/>
				</Link>

				<div className="flex-1 min-w-0">
					<Link prefetch href={`/users/${comment.userId}`}>
						<div className="flex items-center gap-2 mb-0.5">
							<span className="pb-0.5 font-medium text-sm">{comment.user.name}</span>

							<span className="text-xs text-muted-foreground">
								{formatDistanceToNow(comment.createdAt, { addSuffix: true })}
							</span>
						</div>
					</Link>

					<p className="text-sm">{comment.value}</p>

					{/* Reactions */}
					<div className="flex items-center gap-2 mt-1">
						<div className="flex items-center">
							<Button
								variant="link"
								size="icon"
								// disabled={like.isPending || dislike.isPending}
								// onClick={() => like.mutate({ commentId: comment.id })}
								className="size-8 rounded-full group/like"
							>
								<ThumbsUpIcon
									className={cn(
										'transition-colors ease-in-out duration-300 fill-transparent group-hover/like:fill-black',
										comment.viewerReactions === 'like' && 'fill-black group-hover/like:fill-transparent',
									)}
								/>
							</Button>

							<span className="text-xs text-muted-foreground">{comment.likeCount}</span>

							<Button
								variant="link"
								size="icon"
								// disabled={dislike.isPending || like.isPending}
								// onClick={() => dislike.mutate({ commentId: comment.id })}
								className="size-8 rounded-full group/like"
							>
								<ThumbsDownIcon
									className={cn(
										'transition-colors ease-in-out duration-300 fill-transparent group-hover/like:fill-black',
										comment.viewerReactions === 'dislike' && 'fill-black group-hover/like:fill-transparent',
									)}
								/>
							</Button>

							<span className="text-xs text-muted-foreground">{comment.dislikeCount}</span>
						</div>

						{variant === 'comment' && (
							<Button variant="ghost" size="sm" className="rounded-full" onClick={() => setIsReplyOpen(true)}>
								Reply
							</Button>
						)}
					</div>
				</div>

				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-8">
							<MoreVerticalIcon />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						{variant === 'comment' && (
							<DropdownMenuItem onClick={() => setIsReplyOpen(true)} className="cursor-pointer">
								<MessageSquareIcon className="size-4 mr-2" />
								Reply
							</DropdownMenuItem>
						)}

						{comment.user.clerkId === userId && (
							<DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })} className="cursor-pointer">
								<TrashIcon className="size-4 mr-2" />
								Delete
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{isReplyOpen && variant === 'comment' && (
				<div className="mt-4 pl-14">
					<CommentForm
						videoId={comment.videoId}
						parentId={comment.id}
						onCancel={() => setIsReplyOpen(false)}
						variant="reply"
						onSuccess={() => {
							setIsReplyOpen(false)
							setIsRepliesOpen(true)
						}}
					/>
				</div>
			)}

			{comment.replyCount > 0 && variant === 'comment' && (
				<div className="pl-14">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsRepliesOpen((current) => !current)}
						className="rounded-full text-blue-500"
					>
						{isRepliesOpen ? (
							<ChevronUpIcon className="size-4 mr-2" />
						) : (
							<ChevronDownIcon className="size-4 mr-2" />
						)}
						{comment.replyCount} replies
					</Button>
				</div>
			)}

			{comment.replyCount > 0 && variant === 'comment' && isRepliesOpen && (
				<CommentReplies parentId={comment.id} videoId={comment.videoId} />
			)}
		</div>
	)
}
