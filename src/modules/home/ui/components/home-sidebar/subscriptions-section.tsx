'use client'

import Link from 'next/link'
import { ListIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroupLabel,
	Skeleton,
} from '@/components/ui'
import { trpc } from '@/trpc/client'
import { UserAvatar } from '@/components/shared'
import { DEFAULT_LIMIT } from '@/constants/default-limit'

export const LoadingSkeleton = () => {
	return (
		<>
			{Array.from({ length: 5 }).map((_, index) => (
				<SidebarMenuItem key={`${index}-${Date.now()}`}>
					<div className="flex items-center gap-4 px-2 py-1.5">
						<Skeleton className="size-6 rounded-full shrink-0" />

						<Skeleton className="w-full h-4" />
					</div>
				</SidebarMenuItem>
			))}
		</>
	)
}

export const SubscriptionsSection = () => {
	const router = useRouter()
	const pathname = usePathname()

	const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarGroupLabel>Subscriptions</SidebarGroupLabel>

				<SidebarMenu>
					{isLoading ? (
						<LoadingSkeleton />
					) : (
						data?.pages
							.flatMap((page) => page.items)
							.map((item) => (
								<SidebarMenuItem key={`${item.creatorId}-${item.viewerId}`}>
									<SidebarMenuButton
										tooltip={item.user.name}
										isActive={pathname === `/users/${item.user.id}`}
										onClick={(e) => {
											e.preventDefault()

											return router.push(`/users/${item.user.id}`)
										}}
										asChild
									>
										<Link prefetch href={`/users/${item.user.id}`} className="flex items-center gap-4">
											<UserAvatar
												size="sm"
												name={item.user.name}
												imageUrl={item.user.imageUrl || '/svg/user-placeholder.svg'}
											/>

											<span className="text-sm">{item.user.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))
					)}

					{!isLoading && (
						<SidebarMenuItem>
							<SidebarMenuButton isActive={pathname === '/subscriptions'} asChild>
								<Link prefetch href="/subscriptions" className="flex items-center gap-4">
									<ListIcon className="size-4" />

									<span className="text-sm">All subscriptions</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
