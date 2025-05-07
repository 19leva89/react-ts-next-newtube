import { HistorySection } from '@/modules/playlists/ui/sections/history-section'

export const HistoryView = () => {
	return (
		<div className="flex flex-col gap-y-6 max-w-screen-md mb-10 px-4 pt-2.5 mx-auto">
			<div>
				<h1 className="text-2xl font-bold">History</h1>

				<p className="text-xs text-muted-foreground">Video you have watched</p>
			</div>

			<HistorySection />
		</div>
	)
}
