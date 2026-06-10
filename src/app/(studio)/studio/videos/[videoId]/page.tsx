import { getQueryClient, trpc } from '@/trpc/server'
import { VideoView } from '@/modules/studio/ui/views/video-view'

interface Props {
	params: Promise<{ videoId: string }>
}

const VideoIdPage = async ({ params }: Props) => {
	const queryClient = getQueryClient()

	const { videoId } = await params

	void queryClient.prefetchQuery(trpc.studio.getOne.queryOptions({ id: videoId }))
	void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions())

	return <VideoView videoId={videoId} />
}

export default VideoIdPage
