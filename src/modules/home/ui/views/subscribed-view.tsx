import { SubscribedVideosSection } from '@/modules/home/ui/sections/subscribed-videos-section'

export const SubscribedView = () => {
	return (
		<div className="flex flex-col gap-y-6 max-w-600 mb-10 px-4 pt-2.5 mx-auto">
			<div>
				<h1 className="text-2xl font-bold">Subscriptions</h1>

				<p className="text-xs text-muted-foreground">Videos from your favorite channels</p>
			</div>

			<SubscribedVideosSection />
		</div>
	)
}
