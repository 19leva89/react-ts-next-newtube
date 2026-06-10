import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoView } from '@/modules/videos/ui/views/video-view'

interface Props {
	params: Promise<{ videoId: string }>
}

const VideosIdPage = async ({ params }: Props) => {
	const queryClient = getQueryClient()

	const { videoId } = await params

	void queryClient.prefetchQuery(trpc.videos.getOne.queryOptions({ id: videoId }))

	void queryClient.prefetchInfiniteQuery(
		trpc.comments.getMany.infiniteQueryOptions(
			{
				videoId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	void queryClient.prefetchInfiniteQuery(
		trpc.suggestions.getMany.infiniteQueryOptions(
			{
				videoId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <VideoView videoId={videoId} />
}

export default VideosIdPage
