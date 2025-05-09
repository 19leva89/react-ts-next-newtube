import { SubscriptionsSection } from '@/modules/subscriptions/ui/sections/subscriptions-section'

export const SubscriptionsView = () => {
	return (
		<div className="flex flex-col gap-y-6 max-w-300 mb-10 px-4 pt-2.5 mx-auto">
			<div>
				<h1 className="text-2xl font-bold">All subscriptions</h1>

				<p className="text-xs text-muted-foreground">View all subscriptions</p>
			</div>

			<SubscriptionsSection />
		</div>
	)
}
