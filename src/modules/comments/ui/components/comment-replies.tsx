import { CornerDownRightIcon, Loader2Icon } from 'lucide-react'

import { trpc } from '@/trpc/client'
import { Button } from '@/components/ui'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { CommentItem } from '@/modules/comments/ui/components'

interface Props {
	parentId: string
	videoId: string
}

export const CommentReplies = ({ parentId, videoId }: Props) => {
	const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
		trpc.comments.getMany.useInfiniteQuery(
			{
				limit: DEFAULT_LIMIT,
				parentId,
				videoId,
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

				{data?.pages.map((page, index) => (
					<div key={index}>
						{page.items.map((comment) => (
							<CommentItem key={comment.id} comment={comment} variant="reply" />
						))}
					</div>
				))}
			</div>

			{hasNextPage && (
				<Button
					variant="link"
					size="sm"
					disabled={isFetchingNextPage}
					onClick={() => fetchNextPage()}
					className="text-blue-500"
				>
					<CornerDownRightIcon className="size-4 mr-2" />
					Show More
				</Button>
			)}
		</div>
	)
}
