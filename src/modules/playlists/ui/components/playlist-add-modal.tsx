'use client'

import { toast } from 'sonner'
import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { Button } from '@/components/ui'
import { DEFAULT_LIMIT } from '@/constants/default-limit'
import { useErrorToaster } from '@/hooks/use-error-toaster'
import { InfiniteScroll, ResponsiveModal } from '@/components/shared'

interface Props {
	videoId: string
	open: boolean
	onOpenChangeAction: (open: boolean) => void
}

export const PlaylistAddModal = ({ open, onOpenChangeAction, videoId }: Props) => {
	const trpc = useTRPC()
	const queryClient = useQueryClient()

	const { toastError } = useErrorToaster()

	const queryOptions = trpc.playlists.getManyForVideo.infiniteQueryOptions(
		{
			videoId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			enabled: !!videoId && open,
		},
	)

	const {
		data: playlists,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(queryOptions)

	const addVideo = useMutation(
		trpc.playlists.addVideo.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(trpc.playlists.getMany.queryFilter())
				await queryClient.invalidateQueries(trpc.playlists.getManyForVideo.queryFilter({ videoId }))
				await queryClient.invalidateQueries(trpc.playlists.getOne.queryFilter({ id: data.playlistId }))
				await queryClient.invalidateQueries(
					trpc.playlists.getVideos.queryFilter({ playlistId: data.playlistId }),
				)

				toast.success('Video added to playlist')
			},
			onError: (error) => {
				toastError(error, 'Add video to playlist')
			},
		}),
	)

	const removeVideo = useMutation(
		trpc.playlists.removeVideo.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(trpc.playlists.getMany.queryFilter())
				await queryClient.invalidateQueries(trpc.playlists.getManyForVideo.queryFilter({ videoId }))
				await queryClient.invalidateQueries(trpc.playlists.getOne.queryFilter({ id: data.playlistId }))
				await queryClient.invalidateQueries(
					trpc.playlists.getVideos.queryFilter({ playlistId: data.playlistId }),
				)

				toast.success('Video removed from playlist')
			},
			onError: (error) => {
				toastError(error, 'Remove video from playlist')
			},
		}),
	)

	return (
		<ResponsiveModal open={open} onOpenChangeAction={onOpenChangeAction} title='Add to playlist'>
			<div className='flex flex-col gap-2'>
				{isLoading && (
					<div className='flex items-center justify-center p-4'>
						<Loader2Icon className='size-5 animate-spin text-muted-foreground' />
					</div>
				)}

				{!isLoading &&
					playlists?.pages
						.flatMap((page) => page.items)
						.map((playlist) => (
							<Button
								key={playlist.id}
								variant='ghost'
								size='lg'
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
								className='w-full justify-start px-2 [&_svg]:size-5'
							>
								{playlist.containsVideo ? (
									<SquareCheckIcon className='mr-2' />
								) : (
									<SquareIcon className='mr-2' />
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
