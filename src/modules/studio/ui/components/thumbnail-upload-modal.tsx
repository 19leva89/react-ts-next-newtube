import { trpc } from '@/trpc/client'
import { UploadDropzone } from '@/lib/uploadthing'
import { ResponsiveModal } from '@/components/shared'

interface Props {
	videoId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const ThumbnailUploadModal = ({ videoId, open, onOpenChange }: Props) => {
	const utils = trpc.useUtils()

	const onUploadComplete = () => {
		utils.studio.getMany.invalidate()
		utils.studio.getOne.invalidate({ id: videoId })

		onOpenChange(false)
	}

	return (
		<ResponsiveModal open={open} onOpenChangeAction={onOpenChange} title='Upload a Thumbnail'>
			<UploadDropzone
				input={{ videoId }}
				endpoint='thumbnailUploader'
				onClientUploadComplete={onUploadComplete}
			/>
		</ResponsiveModal>
	)
}
