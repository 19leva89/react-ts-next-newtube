import { VideoSection } from '@/modules/videos/ui/sections/video-section'
import { CommentsSection } from '@/modules/videos/ui/sections/comments-section'
import { SuggestionsSection } from '@/modules/videos/ui/sections/suggestions-section'

interface Props {
	videoId: string
}

export const VideoView = ({ videoId }: Props) => {
	return (
		<div className="flex flex-col max-w-425 pt-2.5 px-4 mb-10 mx-auto ">
			<div className="flex flex-col xl:flex-row gap-6">
				<div className="flex-1 min-w-0">
					<VideoSection videoId={videoId} />

					<div className="mt-4 xl:hidden block">
						<SuggestionsSection videoId={videoId} isManual={true} />
					</div>

					<CommentsSection videoId={videoId} />
				</div>

				<div className="w-full xl:w-75 2xl:w-115 shrink-1 hidden xl:block">
					<SuggestionsSection videoId={videoId} />
				</div>
			</div>
		</div>
	)
}
