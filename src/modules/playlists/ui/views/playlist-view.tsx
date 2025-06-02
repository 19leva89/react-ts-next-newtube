'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { PlaylistSection } from '@/modules/playlists/ui/sections/playlist-section'
import { PlaylistCreateModal } from '@/modules/playlists/ui/components/playlist-create-modal'

export const PlaylistView = () => {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<div className='mx-auto mb-10 flex max-w-600 flex-col gap-y-6 px-4 pt-2.5'>
			<PlaylistCreateModal open={open} onOpenChangeAction={setOpen} />

			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold'>Playlists</h1>
					<p className='text-xs text-muted-foreground'>Collections you have created</p>
				</div>

				<Button variant='outline' size='icon' onClick={() => setOpen(true)} className='rounded-full'>
					<PlusIcon className='size-4' />
				</Button>
			</div>

			<PlaylistSection />
		</div>
	)
}
