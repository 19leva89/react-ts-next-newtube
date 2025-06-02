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
	return <Skeleton className='h-[15vh] max-h-50 w-full md:h-[25vh]' />
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
		<div className='group relative'>
			<BannerUploadModal userId={user.id} open={open} onOpenChange={setOpen} />

			<div
				className={cn(
					'h-[15vh] max-h-50 w-full rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 md:h-[25vh]',
					user.bannerUrl ? 'bg-cover bg-center' : 'bg-gray-100',
				)}
				style={{
					backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined,
				}}
			>
				{mounted && isOwner && (
					<Button
						size='icon'
						type='button'
						onClick={() => setOpen(true)}
						className='absolute top-4 right-4 rounded-full bg-black/50 opacity-100 transition-opacity duration-300 group-hover:opacity-100 hover:bg-black/50 md:opacity-0'
					>
						<PencilIcon className='size-4 text-white' />
					</Button>
				)}
			</div>
		</div>
	)
}
