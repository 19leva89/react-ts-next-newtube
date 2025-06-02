import { SubscribedVideosSection } from '@/modules/home/ui/sections/subscribed-videos-section'

export const SubscribedView = () => {
	return (
		<div className='mx-auto mb-10 flex max-w-600 flex-col gap-y-6 px-4 pt-2.5'>
			<div>
				<h1 className='text-2xl font-bold'>Subscriptions</h1>

				<p className='text-xs text-muted-foreground'>Videos from your favorite channels</p>
			</div>

			<SubscribedVideosSection />
		</div>
	)
}
