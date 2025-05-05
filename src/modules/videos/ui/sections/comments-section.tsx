'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { InfiniteScroll } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { CommentForm } from '@/modules/comments/ui/components/comment-form'
import { CommentItem } from '@/modules/comments/ui/components/comment-item'

interface Props {
	videoId: string
}

export const CommentsSection = ({ videoId }: Props) => {
	return (
		<Suspense fallback={<CommentsSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<CommentsSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const CommentsSectionSkeleton = () => {
	return (
		<div className="flex justify-center items-center mt-6">
			<Loader2 className="size-7 animate-spin text-muted-foreground" />
		</div>
	)
}

const CommentsSectionSuspense = ({ videoId }: Props) => {
	const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
		{
			videoId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage['nextCursor'],
		},
	)

	return (
		<div className="mt-6">
			<div className="flex flex-col gap-6">
				<h1 className="text-xl font-bold">{comments.pages[0].totalCount} Comments</h1>

				<CommentForm videoId={videoId} />

				<div className="flex flex-col gap-4 mt-2">
					{comments.pages
						.flatMap((page) => page.items)
						.map((comment) => (
							<CommentItem key={comment.id} comment={comment} />
						))}
				</div>

				<InfiniteScroll
					hasNextPage={query.hasNextPage}
					fetchNextPage={query.fetchNextPage}
					isFetchingNextPage={query.isFetchingNextPage}
				/>
			</div>
		</div>
	)
}
