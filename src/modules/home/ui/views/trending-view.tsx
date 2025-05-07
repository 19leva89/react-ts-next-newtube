import { TrendingVideosSection } from '@/modules/home/ui/sections/trending-videos-section'

export const TrendingView = () => {
	return (
		<div className="flex flex-col gap-y-6 max-w-600 mb-10 px-4 pt-2.5 mx-auto">
			<div>
				<h1 className="text-2xl font-bold">Trending</h1>

				<p className="text-xs text-muted-foreground">Most popular videos at the moment</p>
			</div>

			<TrendingVideosSection />
		</div>
	)
}
