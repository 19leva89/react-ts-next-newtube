'use client'

import { toast } from 'sonner'
import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react'

import { trpc } from '@/trpc/client'
import { Button } from '@/components/ui'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { InfiniteScroll, ResponsiveModal } from '@/components/shared'

interface Props {
	videoId: string
	open: boolean
	onOpenChangeAction: (open: boolean) => void
}

export const PlaylistAddModal = ({ open, onOpenChangeAction, videoId }: Props) => {
	const utils = trpc.useUtils()
	const {
		data: playlists,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = trpc.playlists.getManyForVideo.useInfiniteQuery(
		{
			videoId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			enabled: !!videoId && open,
		},
	)

	const addVideo = trpc.playlists.addVideo.useMutation({
		onSuccess: (data) => {
			toast.success('Video added to playlist')

			utils.playlists.getMany.invalidate()
			utils.playlists.getManyForVideo.invalidate({
				videoId,
			})
			utils.playlists.getOne.invalidate({ id: data.playlistId })
			utils.playlists.getVideos.invalidate({
				playlistId: data.playlistId,
			})
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	const removeVideo = trpc.playlists.removeVideo.useMutation({
		onSuccess: (data) => {
			toast.success('Video removed from playlist')
			utils.playlists.getManyForVideo.invalidate({
				videoId,
			})
			utils.playlists.getOne.invalidate({ id: data.playlistId })
			utils.playlists.getVideos.invalidate({
				playlistId: data.playlistId,
			})
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	return (
		<ResponsiveModal open={open} onOpenChangeAction={onOpenChangeAction} title="Create a Playlist">
			<div className="flex flex-col gap-2">
				{isLoading && (
					<div className="flex items-center justify-center p-4">
						<Loader2Icon className="size-5 animate-spin text-muted-foreground" />
					</div>
				)}

				{!isLoading &&
					playlists?.pages
						.flatMap((page) => page.items)
						.map((playlist) => (
							<Button
								key={playlist.id}
								className="w-full justify-start px-2 [&_svg]:size-5"
								variant="ghost"
								size="lg"
								disabled={addVideo.isPending || removeVideo.isPending}
								onClick={() => {
									if (playlist.containsVideo) {
										removeVideo.mutate({
											playlistId: playlist.id,
											videoId,
										})
									} else {
										addVideo.mutate({
											playlistId: playlist.id,
											videoId,
										})
									}
								}}
							>
								{playlist.containsVideo ? (
									<SquareCheckIcon className="mr-2" />
								) : (
									<SquareIcon className="mr-2" />
								)}
								{playlist.name}
							</Button>
						))}

				{!isLoading && (
					<InfiniteScroll
						isManual
						hasNextPage={hasNextPage}
						fetchNextPage={fetchNextPage}
						isFetchingNextPage={isFetchingNextPage}
					/>
				)}
			</div>
		</ResponsiveModal>
	)
}
