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
import { formatDistanceToNow } from 'date-fns'
import { useAuth, useClerk } from '@clerk/nextjs'

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

	const like = trpc.commentReactions.like.useMutation({
		onSuccess: () => {
			utils.comments.getMany.invalidate({
				videoId: comment.videoId,
			})

			toast.success('Comment liked')
		},
		onError: (error) => {
			toast.error('You need to be logged in to like comment')

			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn()
			}
		},
	})

	const dislike = trpc.commentReactions.dislike.useMutation({
		onSuccess: () => {
			utils.comments.getMany.invalidate({
				videoId: comment.videoId,
			})

			toast.success('Comment disliked')
		},
		onError: (error) => {
			toast.error('You need to be logged in to dislike comment')

			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn()
			}
		},
	})

	return (
		<div>
			<div className='flex gap-4'>
				<Link prefetch href={`/users/${comment.userId}`}>
					<UserAvatar
						size={variant === 'comment' ? 'lg' : 'sm'}
						name={comment.user.name || 'User'}
						imageUrl={comment.user.imageUrl || '/svg/user-placeholder.svg'}
					/>
				</Link>

				<div className='min-w-0 flex-1'>
					<Link prefetch href={`/users/${comment.userId}`}>
						<div className='mb-0.5 flex items-center gap-2'>
							<span className='pb-0.5 text-sm font-medium'>{comment.user.name}</span>

							<span className='text-xs text-muted-foreground'>
								{formatDistanceToNow(comment.createdAt, { addSuffix: true })}
							</span>
						</div>
					</Link>

					<p className='text-sm'>{comment.value}</p>

					{/* Reactions */}
					<div className='mt-1 flex items-center gap-2'>
						<div className='flex items-center'>
							<Button
								variant='link'
								size='icon'
								disabled={like.isPending || dislike.isPending}
								onClick={() => like.mutate({ commentId: comment.id })}
								className='group/like size-8 rounded-full'
							>
								<ThumbsUpIcon
									className={cn(
										'fill-transparent transition-colors duration-300 ease-in-out group-hover/like:fill-black',
										comment.viewerReactions === 'like' && 'fill-black group-hover/like:fill-transparent',
									)}
								/>
							</Button>

							<span className='text-xs text-muted-foreground'>{comment.likeCount}</span>

							<Button
								variant='link'
								size='icon'
								disabled={dislike.isPending || like.isPending}
								onClick={() => dislike.mutate({ commentId: comment.id })}
								className='group/like size-8 rounded-full'
							>
								<ThumbsDownIcon
									className={cn(
										'fill-transparent transition-colors duration-300 ease-in-out group-hover/like:fill-black',
										comment.viewerReactions === 'dislike' && 'fill-black group-hover/like:fill-transparent',
									)}
								/>
							</Button>

							<span className='text-xs text-muted-foreground'>{comment.dislikeCount}</span>
						</div>

						{variant === 'comment' && (
							<Button variant='ghost' size='sm' onClick={() => setIsReplyOpen(true)} className='rounded-full'>
								Reply
							</Button>
						)}
					</div>
				</div>

				{comment.user.clerkId === userId && (
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='icon' className='rounded-full'>
								<MoreVerticalIcon />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align='end'>
							{variant === 'comment' && (
								<DropdownMenuItem onClick={() => setIsReplyOpen(true)} className='cursor-pointer'>
									<MessageSquareIcon className='mr-2 size-4' />
									Reply
								</DropdownMenuItem>
							)}

							<DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })} className='cursor-pointer'>
								<TrashIcon className='mr-2 size-4' />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			{isReplyOpen && variant === 'comment' && (
				<div className='mt-4 pl-14'>
					<CommentForm
						variant='reply'
						videoId={comment.videoId}
						parentId={comment.id}
						onSuccess={() => {
							setIsReplyOpen(false)
							setIsRepliesOpen(true)
						}}
						onCancel={() => setIsReplyOpen(false)}
					/>
				</div>
			)}

			{comment.replyCount > 0 && variant === 'comment' && (
				<div className='pl-14'>
					<Button variant='tertiary' size='sm' onClick={() => setIsRepliesOpen((current) => !current)}>
						{isRepliesOpen ? (
							<ChevronUpIcon className='mr-2 size-4' />
						) : (
							<ChevronDownIcon className='mr-2 size-4' />
						)}
						{comment.replyCount} replies
					</Button>
				</div>
			)}

			{comment.replyCount > 0 && variant === 'comment' && isRepliesOpen && (
				<CommentReplies videoId={comment.videoId} parentId={comment.id} />
			)}
		</div>
	)
}
