import MuxUploader, {
	MuxUploaderDrop,
	MuxUploaderFileSelect,
	MuxUploaderProgress,
	MuxUploaderStatus,
} from '@mux/mux-uploader-react'
import { UploadIcon } from 'lucide-react'

import { Button } from '@/components/ui'

interface Props {
	endpoint?: string | null
	onSuccess: () => void
}

const UPLOADER_ID = 'video-uploader'

export const StudioUploader = ({ endpoint, onSuccess }: Props) => {
	return (
		<div>
			<MuxUploader
				id={UPLOADER_ID}
				endpoint={endpoint}
				onSuccess={onSuccess}
				className="hidden group/uploader"
			/>

			<MuxUploaderDrop muxUploader={UPLOADER_ID} className="m-4 group/drop">
				<div slot="heading" className="flex flex-col items-center gap-6">
					<div className="flex items-center justify-center gap-2 size-32 rounded-full bg-muted">
						<UploadIcon className="size-10 text-muted-foreground group-hover/drop:animate-bounce transition-all duration-300" />
					</div>

					<div className="flex flex-col gap-2 text-center">
						<p className="text-sm ">Drop and drop video files to upload</p>

						<p className="text-xs text-muted-foreground">
							Your videos will be private until you publish them
						</p>
					</div>

					<MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
						<Button type="button" className="rounded-full">
							Select files
						</Button>
					</MuxUploaderFileSelect>
				</div>

				<span slot="separator" className="hidden" />

				<MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />

				<MuxUploaderProgress muxUploader={UPLOADER_ID} className="text-sm" type="percentage" />

				<MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" />
			</MuxUploaderDrop>
		</div>
	)
}
