import { trpc } from '@/trpc/server'
import { VideoView } from '@/modules/studio/ui/views/video-view'

export const dynamic = 'force-dynamic'

interface Props {
	params: Promise<{ videoId: string }>
}

const VideoIdPage = async ({ params }: Props) => {
	const { videoId } = await params

	void trpc.studio.getOne.prefetch({ id: videoId })
	void trpc.categories.getMany.prefetch()

	return <VideoView videoId={videoId} />
}

export default VideoIdPage
