import { toast } from 'sonner'
import { useClerk } from '@clerk/nextjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'

interface Props {
	userId: string
	isSubscribed: boolean
	fromVideoId?: string
}

export const useSubscription = ({ userId, isSubscribed, fromVideoId }: Props) => {
	const trpc = useTRPC()
	const clerk = useClerk()
	const queryClient = useQueryClient()

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
				toast.error('You need to be logged in to subscribe')

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
				toast.error('You need to be logged in to unsubscribe')

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
