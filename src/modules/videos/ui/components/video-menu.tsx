import { toast } from 'sonner'
import { useState } from 'react'
import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui'
import { baseUrl } from '@/lib/utils'
import { PlaylistAddModal } from '@/modules/playlists/ui/components/playlist-add-modal'

interface Props {
	videoId: string
	variant?: 'ghost' | 'secondary'
	onRemove?: () => void
}

export const VideoMenu = ({ videoId, variant = 'ghost', onRemove }: Props) => {
	const [openPlaylistAddModal, setOpenPlaylistAddModal] = useState<boolean>(false)

	const onShare = () => {
		const fullUrl = `${baseUrl}/videos/${videoId}`
		navigator.clipboard.writeText(fullUrl)

		toast.success('Link copied to clipboard')
	}

	return (
		<>
			<PlaylistAddModal
				videoId={videoId}
				open={openPlaylistAddModal}
				onOpenChangeAction={setOpenPlaylistAddModal}
			/>

			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant={variant} size="icon" className="rounded-full">
						<MoreVerticalIcon />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
					<DropdownMenuItem onClick={onShare} className="cursor-pointer">
						<ShareIcon className="size-4 mr-2" />
						Share
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setOpenPlaylistAddModal(true)} className="cursor-pointer">
						<ListPlusIcon className="size-4 mr-2" />
						Add to playlist
					</DropdownMenuItem>

					{onRemove && (
						<DropdownMenuItem onClick={onRemove} className="cursor-pointer">
							<Trash2Icon className="size-4 mr-2" />
							Remove
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
