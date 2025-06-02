import { VideoSection } from '@/modules/videos/ui/sections/video-section'
import { CommentsSection } from '@/modules/videos/ui/sections/comments-section'
import { SuggestionsSection } from '@/modules/videos/ui/sections/suggestions-section'

interface Props {
	videoId: string
}

export const VideoView = ({ videoId }: Props) => {
	return (
		<div className='mx-auto mb-10 flex max-w-425 flex-col px-4 pt-2.5 '>
			<div className='flex flex-col gap-6 xl:flex-row'>
				<div className='min-w-0 flex-1'>
					<VideoSection videoId={videoId} />

					<div className='mt-4 block xl:hidden'>
						<SuggestionsSection videoId={videoId} isManual={true} />
					</div>

					<CommentsSection videoId={videoId} />
				</div>

				<div className='hidden w-full shrink-1 xl:block xl:w-75 2xl:w-115'>
					<SuggestionsSection videoId={videoId} />
				</div>
			</div>
		</div>
	)
}
