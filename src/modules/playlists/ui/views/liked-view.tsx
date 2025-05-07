import { LikedSection } from '@/modules/playlists/ui/sections/liked-section'

export const LikedView = () => {
	return (
		<div className="flex flex-col gap-y-6 max-w-screen-md mb-10 px-4 pt-2.5 mx-auto">
			<div>
				<h1 className="text-2xl font-bold">Liked</h1>

				<p className="text-xs text-muted-foreground">Video you have liked</p>
			</div>

			<LikedSection />
		</div>
	)
}
