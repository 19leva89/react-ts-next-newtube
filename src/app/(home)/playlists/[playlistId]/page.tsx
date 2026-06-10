import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideosView } from '@/modules/playlists/ui/views/videos-view'

interface Props {
	params: Promise<{ playlistId: string }>
}

const PlaylistIdPage = async ({ params }: Props) => {
	const queryClient = getQueryClient()

	const { playlistId } = await params

	void queryClient.prefetchQuery(
		trpc.playlists.getOne.queryOptions({
			id: playlistId,
		}),
	)

	void queryClient.prefetchInfiniteQuery(
		trpc.playlists.getVideos.infiniteQueryOptions(
			{
				playlistId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		),
	)

	return <VideosView playlistId={playlistId} />
}

export default PlaylistIdPage
