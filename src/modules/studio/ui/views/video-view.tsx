import { FormSection } from '@/modules/studio/ui/sections/form-section'

interface Props {
	videoId: string
}

export const VideoView = ({ videoId }: Props) => {
	return (
		<div className="pt-2.5 px-4">
			<FormSection videoId={videoId} />
		</div>
	)
}
