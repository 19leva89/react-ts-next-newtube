import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

import { UserAvatar } from '@/components/shared'
import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, Skeleton, useSidebar } from '@/components/ui'

export const StudioSidebarHeader = () => {
	const { user } = useUser()
	const { state } = useSidebar()

	if (!user)
		return (
			<SidebarHeader className="flex items-center justify-center pb-4">
				<Skeleton className="size-28 rounded-full" />

				<div className="flex flex-col items-center gap-y-1 mt-3">
					<Skeleton className="w-20 h-4" />
					<Skeleton className="w-26 h-4" />
				</div>
			</SidebarHeader>
		)

	if (state === 'collapsed') {
		return (
			<SidebarMenuItem>
				<SidebarMenuButton tooltip="Your profile" asChild>
					<Link href="/users/current" prefetch>
						<UserAvatar
							size="xs"
							name={user?.fullName || 'User'}
							imageUrl={user?.imageUrl || '/svg/user-placeholder.svg'}
						/>

						<span className="text-sm">Your profile</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		)
	}

	return (
		<SidebarHeader className="flex items-center justify-center pb-4">
			<Link href="/users/current" prefetch>
				<UserAvatar
					size="xl"
					name={user?.fullName || 'User'}
					imageUrl={user?.imageUrl || '/svg/user-placeholder.svg'}
					className="size-28 hover:opacity-80 transition-opacity"
				/>
			</Link>

			<div className="flex flex-col items-center mt-2 gap-y-1">
				<p className="text-sm  font-medium">Your profile</p>

				<p className="text-xs text-muted-foreground">{user.fullName}</p>
			</div>
		</SidebarHeader>
	)
}
