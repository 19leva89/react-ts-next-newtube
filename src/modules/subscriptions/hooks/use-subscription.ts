import { toast } from 'sonner'
import { useClerk } from '@clerk/nextjs'

import { trpc } from '@/trpc/client'

interface Props {
	userId: string
	isSubscribed: boolean
	fromVideoId?: string
}

export const useSubscription = ({ userId, isSubscribed, fromVideoId }: Props) => {
	const clerk = useClerk()
	const utils = trpc.useUtils()

	const subscribe = trpc.subscriptions.create.useMutation({
		onSuccess: () => {
			utils.videos.getManySubscribed.invalidate()
			utils.users.getOne.invalidate({ id: userId })
			utils.subscriptions.getMany.invalidate()

			if (fromVideoId) {
				utils.videos.getOne.invalidate({ id: fromVideoId })
			}

			toast.success('Subscribed')
		},
		onError: (error) => {
			toast.error('You need to be logged in to subscribe')

			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn()
			}
		},
	})

	const unsubscribe = trpc.subscriptions.remove.useMutation({
		onSuccess: () => {
			utils.videos.getManySubscribed.invalidate()
			utils.users.getOne.invalidate({ id: userId })
			utils.subscriptions.getMany.invalidate()

			if (fromVideoId) {
				utils.videos.getOne.invalidate({ id: fromVideoId })
			}

			toast.success('Unsubscribed')
		},
		onError: (error) => {
			toast.error('You need to be logged in to unsubscribe')

			if (error.data?.code === 'UNAUTHORIZED') {
				clerk.openSignIn()
			}
		},
	})

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
