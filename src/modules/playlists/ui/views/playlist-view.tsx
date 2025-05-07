'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { PlaylistSection } from '@/modules/playlists/ui/sections/playlist-section'
import { PlaylistCreateModal } from '@/modules/playlists/ui/components/playlist-create-modal'

export const PlaylistView = () => {
	const [open, setOpen] = useState(false)

	return (
		<div className="flex flex-col gap-y-6 max-w-600 mb-10 px-4 pt-2.5 mx-auto">
			<PlaylistCreateModal open={open} onOpenChangeAction={setOpen} />

			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Playlists</h1>
					<p className="text-xs text-muted-foreground">Collections you have created</p>
				</div>

				<Button variant="outline" size="icon" onClick={() => setOpen(true)} className="rounded-full">
					<PlusIcon className="size-4" />
				</Button>
			</div>

			<PlaylistSection />
		</div>
	)
}
