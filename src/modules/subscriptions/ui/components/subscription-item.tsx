import { Skeleton } from '@/components/ui'
import { UserAvatar } from '@/components/shared'
import { SubscriptionButton } from '@/modules/subscriptions/ui/components'

interface Props {
	name: string
	imageUrl: string
	subscriberCount: number
	disabled: boolean
	onUnsubscribe: () => void
}

export const SubscriptionItemSkeleton = () => {
	return (
		<div className="flex items-start gap-2">
			<Skeleton className="size-8 rounded-full" />

			<div className="flex-1">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<Skeleton className="w-24 h-4" />
						<Skeleton className="w-20 h-3 mt-1" />
					</div>

					<Skeleton className="w-20 h-8 rounded-full" />
				</div>
			</div>
		</div>
	)
}

export const SubscriptionItem = ({ name, imageUrl, subscriberCount, disabled, onUnsubscribe }: Props) => {
	return (
		<div className="flex items-start gap-4">
			<UserAvatar size="lg" name={name} imageUrl={imageUrl} />

			<div className="flex-1">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm">{name}</h3>

						<p className="text-xs text-muted-foreground">{subscriberCount.toLocaleString()} subscribers</p>
					</div>

					<SubscriptionButton
						size="sm"
						disabled={disabled}
						onClick={(e) => {
							e.preventDefault()
							onUnsubscribe()
						}}
						isSubscribed
					/>
				</div>
			</div>
		</div>
	)
}
