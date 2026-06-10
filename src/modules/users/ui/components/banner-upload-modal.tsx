import { useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { UploadDropzone } from '@/lib/uploadthing'
import { ResponsiveModal } from '@/components/shared'

interface Props {
	userId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const BannerUploadModal = ({ userId, open, onOpenChange }: Props) => {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const onUploadComplete = () => {
		queryClient.invalidateQueries(trpc.users.getOne.queryFilter({ id: userId }))
		onOpenChange(false)
	}

	return (
		<ResponsiveModal open={open} onOpenChangeAction={onOpenChange} title='Upload a banner'>
			<UploadDropzone endpoint='bannerUploader' onClientUploadComplete={onUploadComplete} />
		</ResponsiveModal>
	)
}
