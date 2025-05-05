import { CornerDownRightIcon, Loader2Icon } from 'lucide-react'

import { trpc } from '@/trpc/client'
import { Button } from '@/components/ui'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { CommentItem } from '@/modules/comments/ui/components'

interface Props {
	videoId: string
	parentId: string
}

export const CommentReplies = ({ videoId, parentId }: Props) => {
	const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
		trpc.comments.getMany.useInfiniteQuery(
			{
				videoId,
				parentId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		)

	return (
		<div className="pl-14">
			<div className="flex flex-col gap-4 mt-2">
				{isLoading && (
					<div className="flex items-center justify-center">
						<Loader2Icon className="size-6 animate-spin text-muted-foreground" />
					</div>
				)}

				{!isLoading &&
					data?.pages
						.flatMap((page) => page.items)
						.map((comment) => <CommentItem key={comment.id} comment={comment} variant="reply" />)}
			</div>

			{hasNextPage && (
				<Button variant="tertiary" size="sm" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
					<CornerDownRightIcon className="size-4 mr-2" />
					Show more replies
				</Button>
			)}
		</div>
	)
}
