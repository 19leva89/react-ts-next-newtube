import { useAuth } from '@clerk/nextjs'
import { PencilIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { Button, Skeleton } from '@/components/ui'
import { UserGetOneOutput } from '@/modules/users/types'
import { BannerUploadModal } from '@/modules/users/ui/components/banner-upload-modal'

interface Props {
	user: UserGetOneOutput
}

export const UserPageBannerSkeleton = () => {
	return <Skeleton className="w-full h-[15vh] md:h-[25vh] max-h-50" />
}

export const UserPageBanner = ({ user }: Props) => {
	const { userId: clerkUserId } = useAuth()

	const [open, setOpen] = useState<boolean>(false)
	const [mounted, setMounted] = useState<boolean>(false)

	const isOwner = clerkUserId === user.clerkId

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<div className="relative group">
			<BannerUploadModal userId={user.id} open={open} onOpenChange={setOpen} />

			<div
				className={cn(
					'w-full h-[15vh] md:h-[25vh] max-h-50 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200',
					user.bannerUrl ? 'bg-cover bg-center' : 'bg-gray-100',
				)}
				style={{
					backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined,
				}}
			>
				{mounted && isOwner && (
					<Button
						size="icon"
						type="button"
						onClick={() => setOpen(true)}
						className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					>
						<PencilIcon className="size-4 text-white" />
					</Button>
				)}
			</div>
		</div>
	)
}
