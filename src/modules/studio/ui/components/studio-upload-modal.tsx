'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { Button } from '@/components/ui'
import { ResponsiveModal } from '@/components/shared'
import { useErrorToaster } from '@/hooks/use-error-toaster'
import { StudioUploader } from '@/modules/studio/ui/components/studio-uploader'

export const StudioUploadModal = () => {
	const trpc = useTRPC()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { toastError } = useErrorToaster()

	const create = useMutation(
		trpc.videos.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.studio.getMany.queryFilter())

				toast.success('Video created successfully')
			},
			onError: (error) => {
				toastError(error, 'Create video')
			},
		}),
	)

	const onSuccess = () => {
		if (!create.data?.video.id) return

		create.reset()

		router.push(`/studio/videos/${create.data.video.id}`)
	}

	return (
		<>
			<ResponsiveModal
				title='Upload a video'
				open={!!create.data?.ufsUrl}
				onOpenChangeAction={() => create.reset()}
			>
				{create.data?.ufsUrl ? (
					<StudioUploader endpoint={create.data.ufsUrl} onSuccess={onSuccess} />
				) : (
					<Loader2Icon className='size-4 animate-spin' />
				)}
			</ResponsiveModal>

			<Button
				variant='secondary'
				disabled={create.isPending}
				onClick={() => create.mutate()}
				className='cursor-pointer'
			>
				{create.isPending ? <Loader2Icon className='animate-spin' /> : <PlusIcon />}
				Create
			</Button>
		</>
	)
}
