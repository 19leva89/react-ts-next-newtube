'use client'

import { toast } from 'sonner'
import { Suspense } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'

import { trpc } from '@/trpc/client'
import { Button, Skeleton } from '@/components/ui'

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
		<div className="flex items-center justify-between">
			<div className="flex flex-col gap-1">
				<Skeleton className="w-24 h-8" />
				<Skeleton className="w-48 h-5" />
			</div>

			<Button variant="outline" size="icon" className="rounded-full" disabled={true}>
				<Trash2Icon className="size-5" />
			</Button>
		</div>
	)
}

const PlaylistHeaderSectionSuspense = ({ playlistId }: Props) => {
	const router = useRouter()
	const utils = trpc.useUtils()

	const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
		id: playlistId,
	})

	const remove = trpc.playlists.remove.useMutation({
		onSuccess: () => {
			utils.playlists.getMany.invalidate()

			toast.success('Playlist removed')

			router.push('/playlists')
		},
		onError: (error) => {
			toast.error(error.message)
		},
	})

	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold">{playlist.name}</h1>
				<p className="text-xs text-muted-foreground">Custom playlist</p>
			</div>

			<Button
				variant="outline"
				size="icon"
				disabled={remove.isPending}
				onClick={() => remove.mutate({ id: playlist.id })}
				className="rounded-full"
			>
				<Trash2Icon className="size-5" />
			</Button>
		</div>
	)
}
