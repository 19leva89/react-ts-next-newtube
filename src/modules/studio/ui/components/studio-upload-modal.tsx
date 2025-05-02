'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2Icon, PlusIcon } from 'lucide-react'

import { trpc } from '@/trpc/client'
import { Button } from '@/components/ui'
import { ResponsiveModal } from '@/components/shared'
import { StudioUploader } from '@/modules/studio/ui/components/studio-uploader'

export const StudioUploadModal = () => {
	const router = useRouter()
	const utils = trpc.useUtils()

	const create = trpc.videos.create.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate()

			toast.success('Video created successfully')
		},
		onError: (error) => {
			toast.error(error ? error.message : 'Error creating video')
		},
	})

	const onSuccess = () => {
		if (!create.data?.video.id) return

		create.reset()

		router.push(`/studio/videos/${create.data.video.id}`)
	}

	return (
		<>
			<ResponsiveModal
				title="Upload a video"
				open={!!create.data?.url}
				onOpenChangeAction={() => create.reset()}
			>
				{create.data?.url ? (
					<StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
				) : (
					<Loader2Icon className="size-4 animate-spin" />
				)}
			</ResponsiveModal>

			<Button
				variant="secondary"
				disabled={create.isPending}
				onClick={() => create.mutate()}
				className="cursor-pointer"
			>
				{create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
				Create
			</Button>
		</>
	)
}
