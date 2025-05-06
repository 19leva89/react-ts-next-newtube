import { trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { VideoView } from '@/modules/videos/ui/views/video-view'

export const dynamic = 'force-dynamic'

interface Props {
	params: Promise<{ videoId: string }>
}

const VideosIdPage = async ({ params }: Props) => {
	const { videoId } = await params

	void trpc.videos.getOne.prefetch({ id: videoId })

	void trpc.comments.getMany.prefetchInfinite({
		videoId,
		limit: DEFAULT_LIMIT,
	})

	void trpc.suggestions.getMany.prefetchInfinite({
		videoId,
		limit: DEFAULT_LIMIT,
	})

	return <VideoView videoId={videoId} />
}

export default VideosIdPage
