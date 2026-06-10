import { useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { UploadDropzone } from '@/lib/uploadthing'
import { ResponsiveModal } from '@/components/shared'

interface Props {
	videoId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const ThumbnailUploadModal = ({ videoId, open, onOpenChange }: Props) => {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const onUploadComplete = () => {
		queryClient.invalidateQueries(trpc.studio.getMany.queryFilter())
		queryClient.invalidateQueries(trpc.studio.getOne.queryFilter({ id: videoId }))

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
