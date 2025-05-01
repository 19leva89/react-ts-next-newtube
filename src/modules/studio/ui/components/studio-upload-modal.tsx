'use client'

import { toast } from 'sonner'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { Button } from '@/components/ui'

export const StudioUploadModal = () => {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const create = useMutation(
		trpc.videos.create.mutationOptions({
			onSuccess: () => {
				toast.success('Video created successfully')
				queryClient.invalidateQueries({ refetchType: 'active' })
			},
			onError: (error) => {
				toast.error(error ? error.message : 'Error creating video')
			},
		}),
	)

	return (
		<Button
			variant="secondary"
			disabled={create.isPending}
			onClick={() => create.mutate()}
			className="cursor-pointer"
		>
			{create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
			Create
		</Button>
	)
}
