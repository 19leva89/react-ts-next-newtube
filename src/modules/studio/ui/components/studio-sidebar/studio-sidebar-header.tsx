import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

import { UserAvatar } from '@/components/shared'
import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, Skeleton, useSidebar } from '@/components/ui'

export const StudioSidebarHeader = () => {
	const { user } = useUser()
	const { state } = useSidebar()

	if (!user)
		return (
			<SidebarHeader className='flex items-center justify-center pb-4'>
				<Skeleton className='size-28 rounded-full' />

				<div className='mt-3 flex flex-col items-center gap-y-1'>
					<Skeleton className='h-4 w-20' />
					<Skeleton className='h-4 w-26' />
				</div>
			</SidebarHeader>
		)

	if (state === 'collapsed') {
		return (
			<SidebarMenuItem>
				<SidebarMenuButton tooltip='Your profile' asChild>
					<Link prefetch href='/users/current'>
						<UserAvatar
							size='xs'
							name={user?.fullName || 'User'}
							imageUrl={user?.imageUrl || '/svg/user-placeholder.svg'}
						/>

						<span className='text-sm'>Your profile</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		)
	}

	return (
		<SidebarHeader className='flex items-center justify-center pb-4'>
			<Link prefetch href='/users/current'>
				<UserAvatar
					size='xl'
					name={user?.fullName || 'User'}
					imageUrl={user?.imageUrl || '/svg/user-placeholder.svg'}
					className='size-28 transition-opacity hover:opacity-80'
				/>
			</Link>

			<div className='mt-2 flex flex-col items-center gap-y-1'>
				<p className='text-sm  font-medium'>Your profile</p>

				<p className='text-xs text-muted-foreground'>{user.fullName}</p>
			</div>
		</SidebarHeader>
	)
}
