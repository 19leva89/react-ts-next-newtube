import { toast } from 'sonner'
import { useClerk } from '@clerk/nextjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { useErrorToaster } from '@/hooks/use-error-toaster'

interface Props {
	userId: string
	isSubscribed: boolean
	fromVideoId?: string
}

export const useSubscription = ({ userId, isSubscribed, fromVideoId }: Props) => {
	const trpc = useTRPC()
	const clerk = useClerk()
	const queryClient = useQueryClient()

	const { toastError } = useErrorToaster()

	const subscribe = useMutation(
		trpc.subscriptions.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.videos.getManySubscribed.queryFilter())
				await queryClient.invalidateQueries(trpc.users.getOne.queryFilter({ id: userId }))
				await queryClient.invalidateQueries(trpc.subscriptions.getMany.queryFilter())

				if (fromVideoId) {
					await queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: fromVideoId }))
				}

				toast.success('Subscribed')
			},
			onError: (error) => {
				toastError(error, 'Subscribe')

				if (error.data?.code === 'UNAUTHORIZED') {
					clerk.openSignIn()
				}
			},
		}),
	)

	const unsubscribe = useMutation(
		trpc.subscriptions.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.videos.getManySubscribed.queryFilter())
				await queryClient.invalidateQueries(trpc.users.getOne.queryFilter({ id: userId }))
				await queryClient.invalidateQueries(trpc.subscriptions.getMany.queryFilter())

				if (fromVideoId) {
					await queryClient.invalidateQueries(trpc.videos.getOne.queryFilter({ id: fromVideoId }))
				}

				toast.success('Unsubscribed')
			},
			onError: (error) => {
				toastError(error, 'Unsubscribe')

				if (error.data?.code === 'UNAUTHORIZED') {
					clerk.openSignIn()
				}
			},
		}),
	)

	const isPending = subscribe.isPending || unsubscribe.isPending

	const onClick = () => {
		if (isSubscribed) {
			unsubscribe.mutate({ userId })
		} else {
			subscribe.mutate({ userId })
		}
	}

	return {
		isPending,
		onClick,
	}
}
