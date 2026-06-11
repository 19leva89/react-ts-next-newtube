'use client'

import { toast } from 'sonner'
import { Suspense } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { Button, Skeleton } from '@/components/ui'
import { useErrorToaster } from '@/hooks/use-error-toaster'

interface Props {
	playlistId: string
}

export const PlaylistHeaderSection = ({ playlistId }: Props) => {
	return (
		<Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Something went wrong</p>}>
				<PlaylistHeaderSectionSuspense playlistId={playlistId} />
			</ErrorBoundary>
		</Suspense>
	)
}

const PlaylistHeaderSectionSkeleton = () => {
	return (
		<div className='flex flex-col gap-y-2'>
			<Skeleton className='h-6 w-26' />
			<Skeleton className='h-4 w-34' />
		</div>
	)
}

const PlaylistHeaderSectionSuspense = ({ playlistId }: Props) => {
	const trpc = useTRPC()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { toastError } = useErrorToaster()
	const { data: playlist } = useSuspenseQuery(trpc.playlists.getOne.queryOptions({ id: playlistId }))

	const remove = useMutation(
		trpc.playlists.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.playlists.getMany.queryFilter())

				toast.success('Playlist removed')

				router.push('/playlists')
			},
			onError: (error) => {
				toastError(error, 'Remove playlist')
			},
		}),
	)

	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-2xl font-bold'>{playlist.name}</h1>

				<p className='text-xs text-muted-foreground'>Videos from the playlist</p>
			</div>

			<Button
				variant='outline'
				size='icon'
				disabled={remove.isPending}
				onClick={() => remove.mutate({ id: playlist.id })}
				className='rounded-full'
			>
				<Trash2Icon className='size-4' />
			</Button>
		</div>
	)
}
