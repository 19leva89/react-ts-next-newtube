'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, useClerk } from '@clerk/nextjs'
import { FlameIcon, HomeIcon, PlaySquareIcon } from 'lucide-react'

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui'

const items = [
	{
		title: 'Home',
		url: '/',
		icon: HomeIcon,
	},
	{
		title: 'Subscriptions',
		url: '/feed/subscribed',
		icon: PlaySquareIcon,
		auth: true,
	},
	{
		title: 'Trending',
		url: '/feed/trending',
		icon: FlameIcon,
	},
]

export const MainSection = () => {
	const clerk = useClerk()
	const pathname = usePathname()

	const { isSignedIn } = useAuth()

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								isActive={pathname === item.url}
								onClick={(e) => {
									if (!isSignedIn && item.auth) {
										e.preventDefault()

										return clerk.openSignIn({ redirectUrl: item.url })
									}
								}}
							>
								<Link prefetch href={item.url} className='flex items-center gap-4'>
									<item.icon />

									<span className='text-sm'>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
