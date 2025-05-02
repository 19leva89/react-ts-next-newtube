import { FormSection } from '@/modules/studio/ui/sections/form-section'

interface Props {
	videoId: string
}

export const VideoView = ({ videoId }: Props) => {
	return (
		<div className="p-4 pt-2.5">
			<FormSection videoId={videoId} />
		</div>
	)
}
