import { trpc } from '@/trpc/client'
import { UploadDropzone } from '@/lib/uploadthing'
import { ResponsiveModal } from '@/components/shared'

interface Props {
	userId: string
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const BannerUploadModal = ({ userId, open, onOpenChange }: Props) => {
	const utils = trpc.useUtils()

	const onUploadComplete = () => {
		utils.users.getOne.invalidate({ id: userId })
		onOpenChange(false)
	}

	return (
		<ResponsiveModal open={open} onOpenChangeAction={onOpenChange} title="Upload a banner">
			<UploadDropzone endpoint="bannerUploader" onClientUploadComplete={onUploadComplete} />
		</ResponsiveModal>
	)
}
