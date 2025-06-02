'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOutIcon, VideoIcon } from 'lucide-react'

import {
	Separator,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui'
import { StudioSidebarHeader } from '@/modules/studio/ui/components/studio-sidebar/studio-sidebar-header'

export const StudioSidebar = () => {
	const pathname = usePathname()

	return (
		<Sidebar className='z-40 pt-16' collapsible='icon'>
			<SidebarContent className='bg-background'>
				<SidebarGroup>
					<SidebarMenu>
						<StudioSidebarHeader />

						<SidebarMenuItem>
							<SidebarMenuButton isActive={pathname === '/studio'} tooltip='Content' asChild>
								<Link prefetch href='/studio'>
									<VideoIcon className='size-5' />

									<span className='text-sm'>Content</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

						<Separator />

						<SidebarMenuItem>
							<SidebarMenuButton tooltip='Exit studio' asChild>
								<Link prefetch href='/'>
									<LogOutIcon className='size-5' />

									<span className='text-sm'>Exit studio</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
